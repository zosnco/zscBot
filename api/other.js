// import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
// 随机小姐姐视频
export async function apisjxjj() {
  const res = await sendApiRequest('http://api.yujn.cn/api/wmsc.php?type=json')
  return res
}

// 随机黑丝图片
export async function sjhsImg() {
  const res = await sendApiRequest('https://v2.api-m.com/api/heisi')
  return res
}
// 白丝图片
export async function sjbsImg() {
  const res = await sendApiRequest('https://v2.api-m.com/api/baisi')
  return res
}
// 毒鸡汤
export async function djtChange() {
  const res = await sendApiRequest('https://quote.qqluoshang.cn/api/')
  return res
}
