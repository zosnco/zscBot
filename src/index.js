// 监听消息
import { initializeChange } from '../order/index.js'
import { notificationOnChange } from '../order/notification.js'
import config from '../config/index.js'
export async function messageOnChange(data) {
  const msg = data?.message
  if ((data.message_type == 'group' && config[data.group_id]) || data?.message_type == 'private') { // 群聊天或私聊
    initializeChange(data, msg)
  }
  if (data.post_type == 'notice') { // 通知消息
    notificationOnChange(data)
  }
}