import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res = await sendApiRequest(`https://www.hhlqilongzhu.cn/api/dg_qishuimusic.php?${qs.stringify({
    msg: '',
    n: 1,
    type: 'json',
    ...data
  })}`)
  return res
}