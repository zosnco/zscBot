// import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'// gjlpchant
// 查询远行商人信息
export async function searchmerchant(data) {
  const res = await sendApiRequest('https://api.tinyaii.top/v1/roco/merchant', 'get', data, { "Authorization": 'Bearer sk_18b686bdc8d1df2fdef44811b3228e54' })
  return res
}