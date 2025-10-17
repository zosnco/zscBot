import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
// 发送群消息
export async function send_group_msg(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/send_group_msg`, 'POST', qs.stringify(data))
  return res
}
// 发送私聊消息
export async function send_private_msg(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/send_private_msg`, 'POST', qs.stringify(data))
  return res
}
// 合并消息转发
export async function send_forward_msg(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/send_forward_msg`, 'POST', qs.stringify(data))
  return res
}
// 群签到
export async function send_group_sign(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/send_group_sign`, 'POST', qs.stringify(data))
  return res
}
// 撤回消息
export async function delete_msg(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/delete_msg`, 'POST', qs.stringify(data))
  return res
}

// 修改群名片
export async function set_group_card(data) {
  const res = await sendApiRequest(`http://117.72.118.144:3010/set_group_card`, 'POST', qs.stringify(data))
  return res
}