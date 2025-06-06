import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res = await sendApiRequest(`https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php?${qs.stringify({
    msg: '',
    n: 1,
    type: 'json',
    quality: 128,
    ...data
  })}`)
  return res
}