import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res1 = await sendApiRequest(`https://api.vkeys.cn/v2/music/tencent/search/song?word=${data.msg}`)
  const res2 = await sendApiRequest(`https://api.vkeys.cn/v2/music/tencent/geturl?id=${res1.data[data.n-1].id}`)
  return res2
}