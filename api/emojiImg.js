import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
// 随机龙图
export async function tangdouzBiaoq(data) {
  const res = await sendApiRequest(`https://api.tangdouz.com/a/biaoq.php?${qs.stringify({
    ...data,
    return:''
  })}`)
  return res
}