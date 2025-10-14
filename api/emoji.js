import qs from 'qs';
import { removeEmptyValues } from '../utils/index.js';
import emoType from '../config/emoType.js';

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
  const text = msg[0]?.data.text?.split(' ')[0]?.trim()
  // 查找at消息
  const atMessages = msg.filter(m => m.type === 'at');
  // 查找text消息，并排除只包含空格的消息
  const textMessages = msg.filter(m => m.type === 'text' && m.data.text.trim() !== '');
  if (!emoType[text] || (atMessages.length == 0 && textMessages.length == 0)) return
  let emojiData = {}
  if (atMessages.length > 0 && !emoType[text].isPlainText) { // 如果有at消息
    const textArr = removeEmptyValues(textMessages[1]?.data.text?.split(' ')) || []
    emojiData = {
      type: emoType[text].type,
      // 如果是需要发送者id且没有at消息，使用原始qq，否则使用第一个at的qq
      qq: atMessages.length == 1 && emoType[text].isQQparam ? data.sender.user_id : atMessages[0]?.data.qq,
      // 如果有第二个at消息，使用第二个at的qq
      qq2: (atMessages[1] || atMessages[0])?.data.qq,
      msg: textArr[0] || text,
      msg2: textArr[1] || text,
      action: 'create_meme'
    }
  } else if (emoType[text].isPlainText) { // 如果没有at消息
    const textArr = removeEmptyValues(textMessages[0]?.data.text?.split(' ')) || []
    emojiData = {
      type: emoType[text].type,
      qq: data.sender.user_id,
      qq2: data.sender.user_id,
      msg: textArr[1] || textArr[0],
      msg2: textArr[2] || textArr[0],
      action: 'create_meme'
    }
  } else {
    return ''
  }
  if (!emojiData.type) return ''
  const res = `https://api.lolimi.cn/API/preview/api.php?${qs.stringify(emojiData)}`
  return res
}