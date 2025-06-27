import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'
// 视频解析
export async function sp_jx_Analysis(data) {
  const res = await sendApiRequest(`https://api.dragonlongzhu.cn/api/sp_jx/sp.php?${qs.stringify({
    ...data
  })}`)
  return res
}