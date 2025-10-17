import { send_private_msg, send_forward_msg } from '../api/qqBot.js'
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
      messageContent = `${originalMessage.group_id}群成员${originalMessage.sender.nickname}(${data.user_id})`
    } else {
      messageContent = `好友 ${originalMessage?.sender?.nickname}(${originalMessage.user_id})`
    }
    // 发送给管理员
    // send_private_msg(formatMessage({
    //   message_type: 'private',
    //   target_id: process.env.ADMIN_QQ,
    //   arrs: [{
    //     type: 'text',
    //     data: { text: messageContent + '撤回消息如下：\n' }
    //   }, ...(originalMessage?.message ? originalMessage?.message.map(item => {
    //     if (item.data?.file) item.data.file = item.data.url
    //     return item
    //   }) : [])]
    // }))
    send_forward_msg({
      "user_id": process.env.ADMIN_QQ,
      "messages": [
        {
          "type": "node",
          "data": {
            "user_id": '3435547347',
            "nickname": "QQ用户",
            "content": [{
              "type": "text",
              "data": { text: messageContent + '撤回消息如下：\n' }
            }]
          }
        },
        ...(originalMessage?.message ? originalMessage?.message.map(item => {
          if (item.data?.file) {
            item.data.file = item.data.url
            delete item.data.url
            delete item.data.file_size
            delete item.data.summary
            delete item.data.sub_type
            if (item.type == 'record') {
              item.type = 'text'
              item.data.text = item.data.file
            }
          }
          const datas = {
            "type": "node",
            "data": {
              "user_id": '3435547347',
              "nickname": "QQ用户",
              "content": [item]
            }
          }
          return datas
        }) : [])],
      "news": [
        {
          "text": "撤回消息"
        }
      ],
      "prompt": "[聊天记录]",
      "summary": "撤回消息",
      "source": "撤回消息"
    })
  }
}