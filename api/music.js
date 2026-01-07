import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res1 = await sendApiRequest(`https://api.vkeys.cn/v2/music/tencent/search/song?word=${data.msg}`)
  const res2 = await sendApiRequest(`https://api.vkeys.cn/v2/music/tencent/geturl?id=${res1.data[data.n - 1].id}&quality=7`)
  return res2
}

export async function speechSynthesis(data) {
  const res = await sendApiRequest(`https://api.lolimi.cn/API/tryyhc/api?key=sk-82dee5057a994142a6efd2260e963a11&msg=${data.msg}&sp=${data.sp}`)
  return res
}