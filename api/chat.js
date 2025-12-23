// import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'// gjlpchant
// 发送消息
export async function gjlpChat(data) {
  const res = await sendApiRequest('http://43.142.191.93:5001/api/chat', 'post', data)
  return res
}
// 清空上下文
export async function gjlpClearContext(data) {
  const res = await sendApiRequest('http://43.142.191.93:5001/api/clear-context', 'post', data)
  return res
}
