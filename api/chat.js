// import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'// gjlpchant
// 发送消息
export async function gjlpChat(data) {
  const res = await sendApiRequest('http://117.72.118.144:5001/api/chat', 'post', data)
  return res
}
// 清空上下文
export async function gjlpClearContext(data) {
  const res = await sendApiRequest('http://117.72.118.144:5001/api/clear-context', 'post', data)
  return res
}
