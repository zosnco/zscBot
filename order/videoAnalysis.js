import { sp_jx_Analysis } from '../api/videoAnalysis.js'
import { extractUrls } from '../utils/index.js'
import { messageTypeChange } from './index.js'
import config from '../config/index.js'
export async function _sp_jx_Analysis(data, msg) {
  const isVideoAnalysis = config[data.group_id]?.isVideoAnalysis
  if (isVideoAnalysis) {
    const msg1 = msg[0]?.data?.text
    if (msg1?.includes('https://')||msg1?.includes('http://')) {
      const urls = extractUrls(msg1);
      if (urls.length > 0) {
        const res = await sp_jx_Analysis({
          url: urls[0], // 使用第一个找到的链接
        });
        const url = res?.data?.url
       if(!url) return
        messageTypeChange({
          type: "video",
          data: { file: url }
        }, data);
      }
    }
  }
}