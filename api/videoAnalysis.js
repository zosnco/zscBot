import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
// 视频解析
export async function sp_jx_Analysis(data) {
  const res = await sendApiRequest(`https://tmini.net/api/shortvideo?${qs.stringify({
    ...data
  })}`)
  return res
}