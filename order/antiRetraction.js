import { send_private_msg } from '../api/qqBot.js'
import config from '../config/index.js'
import { formatMessage } from '../utils/index.js'
import { findMessageById } from '../utils/logger.js'
import dotenv from 'dotenv'

dotenv.config()

export async function handleRetraction(data) {
  // 检查是否消息撤回
  if (data.notice_type === 'group_recall' || data.notice_type === 'friend_recall') {
    // 检查该群是否开启防撤回
    if (data.notice_type === 'group_recall' && !config[data.group_id]?.isAntiRetraction) return

    // 从日志中查找原始消息
    const originalMessage = await findMessageById(data.message_id)
    let messageContent = ''
    // 构造消息内容
    if (data.group_id) {
      messageContent = `群${originalMessage.group_id}撤回消息：\n发送者：${originalMessage.sender.nickname}(${data.user_id})\n原始消息：${originalMessage ? JSON.stringify(originalMessage.message) : '未找到原始消息'}`
    } else {
      messageContent = `好友 ${originalMessage.sender.nickname}(${originalMessage.user_id})撤回消息：\n原始消息：${originalMessage ? JSON.stringify(originalMessage.message) : '未找到原始消息'}`
    }
    // 发送给管理员
    send_private_msg(formatMessage({
      message_type: 'private',
      target_id: process.env.ADMIN_QQ,
      arrs: {
        type: 'text',
        data: { text: messageContent }
      },
    }))
  }
}