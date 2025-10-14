import qs from 'qs';
import { sendApiRequest } from '../utils/axiosEncapsulation.js';
import { removeEmptyValues } from '../utils/index.js';
let emoType = null
// 获取表情包所有数据
export async function allEmoChange() {
  const res = await sendApiRequest(
    `https://api.lolimi.cn/API/preview/api.php?action=meme_info&qq=1493312415&qq2=1493312415`,
    'GET',
  );
  return res
}
/**
 * 生成表情包
 * @param {Object} data - 请求参数
 * @param {string} data.qq - QQ号，或者使用data.img传入图片链接
 * @param {string} data.qq2 - QQ2号，或者使用data.img2传入图片链接
 * @param {string} data.msg - 文本消息1
 * @param {string} data.msg2 - 文本消息2
 * @param {number} data.type - 表情类型(1-9)
 * @returns {Promise<Object>} 接口返回数据
 */
export async function generateEmoji(data, msg) {
  if (!emoType) {
    const res = await allEmoChange()
    emoType = res
  }
  const text = msg[0]?.data.text?.split(' ')[0]?.trim()
  // 查找at消息
  const atMessages = msg.filter(m => m.type === 'at');
  // 查找text消息，并排除只包含空格的消息
  const textMessages = msg.filter(m => m.type === 'text' && m.data.text.trim() !== '' && m.data.text.trim() != text);
  if (!emoType) return
  const obj = emoType.find(item => item.data.name == text)?.data
  let emoData = {}
  if (obj) {
    let ids = 0
    for (let i = 0; i < obj.params.length; i++) {
      const item = obj.params[i];
      if (item.includes('qq')) {
        if (atMessages[ids]?.data.qq) emoData[`qq${ids == 0 ? '' : (Number(ids + 1))}`] = atMessages[ids].data.qq
        ids++
      } else if (item.includes('msg')) {
        const arr = textMessages[0]?.data.text.split(' ') || []
        if (arr[0] == text) arr.splice(0, 1)
        if (arr.length < 0) return
        removeEmptyValues(arr).forEach((item, index) => {
          emoData[`msg${index == 0 ? '' : (Number(index + 1))}`] = item
        })
      }
      if (item.includes('qq2') && atMessages.length == 1) { // 特殊
        emoData[`qq`] = data.sender.user_id
        emoData[`qq2`] = atMessages[0].data.qq
      }
    }
  }
  if (!obj || (!(Object.keys(emoData).length == obj.params.length))) return
  emoData.action = 'create_meme'
  emoData.type = obj.type
  const url = `https://api.lolimi.cn/API/preview/api.php?${qs.stringify(emoData)}`
  return url
}