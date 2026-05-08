import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res = await sendApiRequest(`https://api.vkeys.cn/v2/music/tencent?word=${data.msg}&choose=${data.n}&quality=8`)
  return res
}

export async function speechSynthesis(data) {
  const res = await sendApiRequest(`https://api.lolimi.cn/API/tryyhc/api?key=sk-82dee5057a994142a6efd2260e963a11&msg=${data.msg}&sp=${data.sp}`)
  return res
}