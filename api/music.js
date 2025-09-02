import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
export async function dg_kugouSQ(data) {
  const res = await sendApiRequest(`https://sdkapi.hhlqilongzhu.cn/api/juhe_dgmusic?${qs.stringify({
    key:'',
    msg: '',
    n: 1,
    type: 'json',
    ...data,
    quality: '128',
  })}`)
  return res
}