import sharp from 'sharp';
/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param options 配置选项
 * @returns 随机字符串
 */

/**
 * 格式化消息
 * @param {object} options 消息配置选项
 * @param {string} options.message_type 消息类型 (group/private)
 * @param {number} options.target_id 目标ID (群聊为group_id，私聊为user_id)
 * @param {string} options.type 消息类型 (image/record/text)
 * @param {object} options.data 消息数据
 * @param {number} [options.at_qq] @的用户QQ号 (仅群聊可用)
 * @returns {object} 格式化后的消息对象
 */
export function formatMessage(options) {
  // const { message_type, target_id, type, data, at_qq = null, isArray = false } = options;
  const { message_type, target_id, arrs, at_qq = null, } = options;
  const dataArr = Array.isArray(arrs) ? [...arrs] : [arrs]
  const message = [];
  // 如果是群聊且需要@用户
  if (message_type === 'group' && at_qq) {
    message.push({
      "type": "at",
      "data": {
        "qq": at_qq
      }
    });
  }

  for (let index = 0; index < dataArr.length; index++) {
    const item = dataArr[index];
    message.push({
      "type": item.type,
      "data": item.data
    });
  }

  // 根据消息类型返回不同的格式
  return message_type === 'group'
    ? { "group_id": target_id, "message": message }
    : { "user_id": target_id, "message": message }
}

export function parseSongRequest(param1, param2) {
  // 检查是否所有参数都已提供
  if (!param1 || !param2) {
    // throw new Error("两个参数都是必填项");
  }

  // 移除 param1 中的所有空格
  const cleanedParam1 = param1.replace(/\s+/g, "");

  // 从清理后的第一个参数中移除第二个参数的内容（如果存在）
  const resultParam1 = cleanedParam1.replace(param2, "").trim();

  // 使用正则表达式提取歌手名和数字部分，允许所有语言字符和标点符号的存在
  const match = resultParam1.match(/^([\p{L}\p{M}\p{P}]+)(\d+)?$/u);
  if (!match) {
    return []; // 如果格式不正确，返回空数组
  }

  const singer = match[1]; // 歌手名，包含可能的标点符号
  const number = match[2]; // 数字部分（如果有）

  // 始终返回数组，即使只有一个值也放在数组中
  return number ? [singer, parseInt(number)] : [singer];
}

/**
 * 移除数组中的空值（null、undefined、空字符串）
 * @param {Array} arr - 需要处理的数组
 * @returns {Array} 处理后的数组
 */
export function removeEmptyValues(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => {
    if (item === null || item === undefined) return false;
    if (typeof item === 'string' && item.trim() === '') return false;
    return true;
  });
}
/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param options 配置选项
 * @returns 随机字符串
 */
export function generateRandomString(length = 8, options = {}) {
  const {
    numbers = true,
    lowercase = true,
    uppercase = true,
    special = false
  } = options;

  let chars = '';
  if (numbers) chars += '0123456789';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (chars === '') {
    throw new Error('至少需要选择一种字符类型');
  }

  let result = '';
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}

/**
 * 从文本中提取所有的 HTTP/HTTPS 链接
 * @param {string} text - 需要提取链接的文本
 * @returns {string[]} - 提取到的链接数组
 */
export function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s<>"']*[^\s<>"',.)])/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

export async function generateTextImage(text) {
  try {
    // 计算文本换行
    const maxCharsPerLine = 30; // 每行最大字符数
    const lineHeight = 30; // 行高
    const lines = [];
    let currentLine = '';

    // 分割文本为单词或字符
    const words = text.split('');

    for (const char of words) {
      if (currentLine.length >= maxCharsPerLine && char !== '\n') {
        lines.push(currentLine);
        currentLine = '';
      }
      if (char === '\n') {
        lines.push(currentLine);
        currentLine = '';
        continue;
      }
      currentLine += char;
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // 计算所需的SVG高度
    const totalHeight = Math.max(400, (lines.length + 1) * lineHeight + 40);

    // 创建SVG内容
    const svgContent = `
      <svg width="800" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${lines.map((line, index) => `
          <text
            x="20"
            y="${40 + index * lineHeight}"
            font-size="24"
            fill="black"
          >${line}</text>
        `).join('')}
      </svg>
    `;

    // 使用sharp将SVG转换为图片
    const image = await sharp(Buffer.from(svgContent))
      .png()
      .toBuffer();

    return image.toString('base64');
  } catch (error) {
    console.error('生成图片失败:', error);
    return null;
  }
}

export function dayjs(date = new Date()) {
  const d = new Date(date);

  return {
    format(formatStr = 'YYYY-MM-DD HH:mm:ss') {
      const replacements = {
        YYYY: d.getFullYear(),
        MM: String(d.getMonth() + 1).padStart(2, '0'),
        DD: String(d.getDate()).padStart(2, '0'),
        HH: String(d.getHours()).padStart(2, '0'),
        mm: String(d.getMinutes()).padStart(2, '0'),
        ss: String(d.getSeconds()).padStart(2, '0'),
      };

      return Object.entries(replacements).reduce(
        (str, [key, value]) => str.replace(key, value),
        formatStr
      );
    },
    
    add(amount, unit) {
      const newDate = new Date(d);
      switch (unit) {
        case 'day':
        case 'days':
          newDate.setDate(newDate.getDate() + amount);
          break;
        case 'hour':
        case 'hours':
          newDate.setHours(newDate.getHours() + amount);
          break;
        // 可以继续扩展其他单位
      }
      return dayjs(newDate);
    }
  };
}