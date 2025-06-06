import { gjlpChat, gjlpClearContext } from '../api/chat.js'
import { generateRandomString } from '../utils/index.js'
import { messageTypeChange } from './index.js'
import config from '../config/index.js'
import dotenv from 'dotenv'
dotenv.config()
let sessionId = generateRandomString()
export async function dsChatChange(data, msg) {
  const type = config[data.group_id]?.chatType
  if (type) {
    const msg1 = msg[0]?.data?.text
    if (msg1?.includes('机器人') && type == 'name') {
      const content = msg1.replace('机器人', '').trim();
      if (!content) return;
      const res = await gjlpChat({
        sessionId: sessionId,
        message: content,
      })
      messageTypeChange({
        type: "text",
        data: { text: res.response }
      }, data)
    } else if (msg[0]?.data.qq == process.env.ADMIN_QQ && type == 'at') {
      const msg2 = msg[1]?.data?.text
      if (!msg2) return;
      const res = await gjlpChat({
        sessionId: sessionId,
        message: msg2,
      })
      messageTypeChange({
        type: "text",
        data: { text: res.response }
      }, data)
    }
    if (msg1?.includes('清空上下文')) { // 清空上下文
      await gjlpClearContext({
        sessionId: sessionId,
      })
      messageTypeChange({
        type: "text",
        data: { text: '清空成功' }
      }, data)
      sessionId = generateRandomString()
    }
  }
}