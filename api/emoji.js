import qs from 'qs';
import { sendApiRequest } from '../utils/axiosEncapsulation.js';
import { removeEmptyValues } from '../utils/index.js';
// type和对应中文的映射关系
let typeMap = {
  '二次元入口': {
    type: 1,
  },
  '给社会添乱': {
    type: 2,
  },
  '毒瘾发作': {
    type: 3,
  },
  '一样': {
    type: 4,
  },
  '我永远喜欢': {
    type: 5,
  },
  '防诱拐': {
    type: 6,
  },
  '阿尼亚喜欢': {
    type: 7,
  },
  '鼓掌': {
    type: 8,
  },
  '升天': {
    type: 9,
    isPlainText: true // 是否纯文字
  },
  '悲报': {
    type: 12,
    isPlainText: true // 是否纯文字
  },
  '拍头': {
    type: 13,
  },
  '啃': {
    type: 14,
  },
  '高血压': {
    type: 15,
  },
  '波奇手稿': {
    type: 144,
    isPlainText: true // 是否纯文字
  },
  '撅': {
    type: 117,
    isQQparam: true// 表示参数是需要二个QQ号
  },
};

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
  // 查找text消息
  const textMessages = msg.filter(m => m.type === 'text');
  if (!typeMap[text] || (atMessages.length == 0 && textMessages.length == 0)) return
  let emojiData = {}
  if (atMessages.length > 0 && !typeMap[text].isPlainText) { // 如果有at消息
    const textArr = removeEmptyValues(textMessages[1]?.data.text?.split(' ')) || []
    emojiData = {
      type: typeMap[text].type,
      // 如果是需要发送者id且没有at消息，使用原始qq，否则使用第一个at的qq
      qq: atMessages.length == 1 && typeMap[text].isQQparam ? data.sender.user_id : atMessages[0]?.data.qq,
      // 如果有第二个at消息，使用第二个at的qq
      qq2: (atMessages[1] || atMessages[0])?.data.qq,
      msg: textArr[0] || text,
      msg2: textArr[1] || text,
      action: 'create_meme'
    }
  } else if (typeMap[text].isPlainText) { // 如果没有at消息
    const textArr = removeEmptyValues(textMessages[0]?.data.text?.split(' ')) || []
    emojiData = {
      type: typeMap[text].type,
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
  const res = await sendApiRequest(
    `https://api.lolimi.cn/API/preview/api.php?${qs.stringify(emojiData)}`,
    'GET',
    null,
    {},
    true
  );
  // 将二进制数据转换为base64
  const base64Data = `base64://${res.toString('base64')}`
  return base64Data
}