import { getDsPresets, createDsSession, sendDsMessage } from '../api/dschat.js'
import { messageTypeChange } from './index.js'
import config, { ASSISTANT_NAME } from '../config/index.js'

// 每个群 / 每个私聊用户的会话状态：{ sessionId, preset, presetName }
// 群内共享一个会话，私聊按用户隔离
const sessions = new Map()

// 人设列表缓存（首次用到时拉取，dschat 人设基本不变）
let presetsCache = null
async function loadPresets() {
  if (presetsCache) return presetsCache
  try {
    const res = await getDsPresets()
    presetsCache = (res?.presets || []).map(p => ({ key: p.key, name: p.name }))
  } catch (e) {
    presetsCache = []
  }
  return presetsCache
}

async function presetNameOf(key) {
  const presets = await loadPresets()
  const p = presets.find(x => x.key === key)
  return p?.name || key
}

// 匹配人设：支持 key、中文名，以及模糊包含
async function matchPreset(keyword) {
  const presets = await loadPresets()
  const kw = (keyword || '').trim()
  if (!kw) return null
  // 精确匹配 key / 中文名
  let hit = presets.find(p => p.key === kw || p.name === kw)
  if (hit) return hit
  // 模糊：名称互相包含，或 key 忽略大小写相等
  hit = presets.find(p =>
    p.name.includes(kw) || kw.includes(p.name) ||
    p.key.toLowerCase() === kw.toLowerCase()
  )
  return hit || null
}

function sessionKey(data) {
  if (data.message_type === 'group') return `group:${data.group_id}`
  return `private:${data.user_id}`
}

// 解析当前消息的触发词：
// 群聊——必须显式配置 dsAssistantName 才启用；值可取 ASSISTANT_NAME 或自定义，留空则关闭
// 私聊——固定用全局 ASSISTANT_NAME
function resolveTrigger(data) {
  if (data.message_type === 'group') {
    return config[data.group_id]?.dsAssistantName || ''
  }
  return ASSISTANT_NAME
}

// 确保会话存在，没有则按 preset 创建
async function ensureSession(key, presetKey) {
  const cached = sessions.get(key)
  if (cached?.sessionId) return cached
  return rebuildSession(key, presetKey || cached?.preset || 'default')
}

// 用指定人设新建会话（首次创建 / 切换人设 / 清空上下文 时调用）
async function rebuildSession(key, presetKey) {
  const res = await createDsSession(presetKey)
  const preset = res?.preset || presetKey || 'default'
  const session = {
    sessionId: res?.sessionId,
    preset,
    presetName: await presetNameOf(preset)
  }
  sessions.set(key, session)
  return session
}

function reply(text, data) {
  messageTypeChange({ type: 'text', data: { text } }, data)
}

// 切换人设 / 清空上下文 的权限：私聊任意用户均可，群聊仅管理员
function canManageSession(data) {
  if (data.message_type === 'private') return true
  return data.user_id == Number(process.env.ADMIN_QQ)
}

// 人设列表文案（触发词动态注入，保证菜单里显示的就是当前实际名字）
async function presetListText(trigger) {
  const presets = await loadPresets()
  return presets
    .map((p, i) => `${i + 1}. ${p.name}（${trigger}切换${p.name}）`)
    .join('\n')
}

// 帮助文案（触发词动态注入）
async function helpText(trigger) {
  return [
    `【${trigger} · 使用说明】`,
    '',
    `直接对话：${trigger} + 你的问题`,
    `例：${trigger}你好 / ${trigger}今天适合做什么运动`,
    '',
    '可用指令：',
    `· ${trigger}切换<人设> —— 切换 AI 人设（角色）`,
    `· ${trigger}清空      —— 清空当前对话记忆`,
    `· ${trigger}帮助      —— 查看本说明`
  ].join('\n')
}

export async function dsAssistantChange(data, msg) {
  const msg1 = msg[0]?.data?.text
  if (!msg1) return

  // 触发词：全局 ASSISTANT_NAME，群聊可被该群 config 覆盖；空串表示该群关闭
  const trigger = resolveTrigger(data)
  if (!trigger) return

  const head = msg1.trim()
  if (!head.startsWith(trigger)) return

  const key = sessionKey(data)
  // 去掉触发词及随后的空白、标点
  const content = head.slice(trigger.length).replace(/^[\s,，:：、]+/, '').trim()

  // 1) 切换人设：<触发词>切换<人设>（私聊任意用户，群聊仅管理员，其他人静默忽略）
  if (content.startsWith('切换')) {
    if (!canManageSession(data)) return
    const word = content.slice(2).trim()
    const preset = await matchPreset(word)
    if (!preset) {
      reply(`没找到「${word || '?'}」这个人设，目前支持：\n${await presetListText(trigger)}`, data)
      return
    }
    await rebuildSession(key, preset.key)
    reply(`已切换为「${preset.name}」人设，开始新的对话吧～`, data)
    return
  }

  // 2) 清空上下文（私聊任意用户，群聊仅管理员，其他人静默忽略）
  if (['清空', '重置', '清空上下文', '清除', '重来'].includes(content)) {
    if (!canManageSession(data)) return
    const cur = sessions.get(key)
    await rebuildSession(key, cur?.preset || 'default')
    reply('上下文已清空，开始新的对话吧～', data)
    return
  }

  // 3) 帮助 / 人设列表（含只发触发词、无内容的情况）
  if (['', '帮助', '菜单', '人设', '说明', '功能', '列表'].includes(content)) {
    reply(await helpText(trigger), data)
    return
  }

  // 4) 普通对话
  try {
    const session = await ensureSession(key, 'default')
    const res = await sendDsMessage(session.sessionId, content)
    if (res?.reply) {
      reply(res.reply, data)
    } else {
      reply('AI 暂时没有回复，稍后再试～', data)
    }
  } catch (e) {
    // 会话失效（服务重启 / sessionId 过期）→ 重建后重试一次
    const status = e?.response?.status
    if (status === 404) {
      try {
        const cur = sessions.get(key)
        const session = await rebuildSession(key, cur?.preset || 'default')
        const res = await sendDsMessage(session.sessionId, content)
        if (res?.reply) {
          reply(res.reply, data)
          return
        }
      } catch (_) { /* 走到下面的提示 */ }
    }
    reply('AI 服务开小差了，稍后再试～', data)
  }
}
