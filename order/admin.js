import { exec } from 'child_process'
import { messageTypeChange } from './index.js'
import { delete_msg } from '../api/qqBot.js'
import { newCrawl } from '../api/saicheData.js'
import config from '../config/index.js'
import { gjlpChat } from '../api/chat.js'
import { tangdouzBiaoq } from '../api/emojiImg.js'
import { generateRandomString } from '../utils/index.js'
import dotenv from 'dotenv'
dotenv.config()
let sessionId = generateRandomString()
export async function handleAdminCommands(data, msg) {
  const msg1 = msg[0]?.data?.text || ''

  // 检查敏感词
  if (data.message_type === 'group' && config[data.group_id]?.sensitiveWords?.length > 0) {
    const sensitiveWords = config[data.group_id].sensitiveWords
    const hasSensitiveWord = msg.some(message => {
      const text = message?.data?.text?.replace(/\s+/g, '');
      if (!text) return false
      return sensitiveWords.some(word => text.includes(word))
    })
    if (hasSensitiveWord) {
      // 撤回消息
      await delete_msg({ message_id: data.message_id })
      return true
    }
  }

  // 检查是否为群消息且配置了自动回复概率
  if (data.user_id != Number(process.env.ADMIN_QQ) && data.message_type === 'group' && config[data.group_id]?.autoReplyProbability) {
    const probability = config[data.group_id].autoReplyProbability
    // 生成0-100的随机数，如果小于设定的概率值则触发自动回复
    const randomNum = Math.floor(Math.random() * 100)
    if (randomNum < probability) {
      // 生成0-100的随机数，如果小于设定的概率值则触发自动回复
      const randomNum2 = Math.floor(Math.random() * 100)
      if (randomNum2 < 30 && msg1) {
        const res = await gjlpChat({
          sessionId: sessionId,
          message: msg1,
        })
        messageTypeChange({
          type: "text",
          data: { text: res.response }
        }, data)
      } else {
        const res = await tangdouzBiaoq({
          nr: msg1 || '没啥好说的'
        })
        messageTypeChange({
          type: "image",
          data: { file: res, "sub_type": "1", "summary": "怎么都不说话？", }
        }, data)
      }
      return true
    }
  }
  // 更新插件
  if (data.user_id == Number(process.env.ADMIN_QQ)) {
    if (msg1?.includes('更新插件')) {
      exec('git pull', (error, stdout, stderr) => {
        if (error) {
          messageTypeChange({
            type: "text",
            data: { text: `更新失败：${error.message}` }
          }, data)
          return
        }
        messageTypeChange({
          type: "text",
          data: { text: `更新成功：\n${stdout}` }
        }, data)
      })
      return true
    }
    if (msg1?.includes('更新赛车数据')) {
      await newCrawl({
        "type": "赛车数据"
      })
      messageTypeChange({
        type: "text",
        data: { text: `更新成功` }
      }, data)
      return true
    }
  }
}