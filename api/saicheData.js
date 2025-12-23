// import qs from 'qs'; // qs.stringify(data)
import { sendApiRequest } from '../utils/axiosEncapsulation.js'// gjlpchant
// 更新赛车数据
export async function newCrawl(data) {
  const res = await sendApiRequest('http://43.142.191.93:5100/api/crawl', 'post', data)
  return res
}

// 获取赛车详情
export async function crawlData(data) {
  const res = await sendApiRequest('http://43.142.191.93:5100/api/crawlData', 'post', data)
  return res
}

