import qs from 'qs';
import { removeEmptyValues } from '../utils/index.js';
// type和对应中文的映射关系
let typeMap = {
  '洛天依': {
    type: 1,
    isPlainText: true // 是否纯文字
  },
  '戒导': {
    type: 2,
  },
  '逆转裁判气泡': {
    type: 3,
    isPlainText: true
  },
  '二次元入口': {
    type: 4,
  },
  '添乱': {
    type: 5,
  },
  '上瘾': {
    type: 6,
  },
  '"一样': {
    type: 7,
  },
  '一直': {
    type: 8,
  },
  '我永远喜欢': {
    type: 9,
  },
  '防诱拐': {
    type: 10,
  },
  '阿尼亚喜欢': {
    type: 11,
  },
  '鼓掌': {
    type: 12,
  },
  '阿罗娜扔': {
    type: 13,
  },
  '升天': {
    type: 14,
    isPlainText: true
  },
  '问问': {
    type: 15,
  },
  '亚托莉枕头': {
    type: 16,
    isPlainText: true
  },
  '宁宁举牌': {
    type: 17,
    isPlainText: true
  },
  'ba说': {
    type: 18,
    isPlainText: true
  },
  '继续干活': {
    type: 19,
  },
  '后空翻': {
    type: 20,
  },
  '悲报': {
    type: 21,
    isPlainText: true
  },
  '蔚蓝档案标题': {
    type: 22,
    isPlainText: true
  },
  '拍头': {
    type: 23,
  },
  '揍': {
    type: 24,
    isQQparam: true
  },
  '砍头': {
    type: 25,
  },
  '啃': {
    type: 26,
  },
  '高血压': {
    type: 28,
  },
  '波奇手稿': {
    type: 29,
  },
  '布洛妮娅举牌': {
    type: 30,
    isPlainText: true
  },
  '奶茶': {
    type: 31,
  },
  '遇到困难请拨打': {
    type: 32,
    isQQparam: true
  },
  '看看你的': {
    type: 33,
    isQQparam: true
  },
  '咖波画': {
    type: 34
  },
  '咖波指': {
    type: 35
  },
  '咖波撕': {
    type: 36
  },
  '咖波蹭': {
    type: 37
  },
  '咖波炖': {
    type: 39
  },
  '咖波撞': {
    type: 40
  },
  '这个引起的': {
    type: 42
  },
  '字符画': {
    type: 45
  },
  '追列车': {
    type: 46
  },
  '国旗': {
    type: 47
  },
  '智乃扔': {
    type: 48
  },
  '鼠鼠搓': {
    type: 49
  },
  '小丑': {
    type: 50
  },
  '小丑面具': {
    type: 51
  },
  '迷惑': {
    type: 52
  },
  '兑换券': {
    type: 53
  },
  '捂脸': {
    type: 54
  },
  '爬': {
    type: 55
  },
  '群青': {
    type: 56
  },
  '白天黑夜': {
    type: 57,
    isQQparam: true
  },
  '像样的亲亲': {
    type: 58
  },
  '恐龙': {
    type: 60
  },
  '注意力涣散': {
    type: 61
  },
  '离婚协议': {
    type: 62
  },
  '撅': {
    type: 63,
    isQQparam: true
  },
  '狗都不玩': {
    type: 64,
  },
  '管人痴': {
    type: 65
  },
  '不要靠近': {
    type: 66
  },
  '不要按': {
    type: 67,
    isPlainText: true
  },
  '别碰': {
    type: 68
  },
  '哆啦A梦说': {
    type: 69,
    isPlainText: true
  },
  '吃': {
    type: 71
  },
  '换位思考': {
    type: 72
  },
  '意若思镜': {
    type: 74
  },
  '灰飞烟灭': {
    type: 75
  },
  '我爸爸': {
    type: 77
  },
  '击剑': {
    type: 78,
    isQQparam: true
  },
  '我打宿傩': {
    type: 79
  },
  '满脑子': {
    type: 80
  },
  '闪瞎': {
    type: 83
  },
  '飞机杯': {
    type: 84
  },
  '弹': {
    type: 85
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
  // 查找text消息，并排除只包含空格的消息
  const textMessages = msg.filter(m => m.type === 'text' && m.data.text.trim() !== '');
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
  const res = `https://api.lolimi.cn/API/preview/api.php?${qs.stringify(emojiData)}`
  return res
}