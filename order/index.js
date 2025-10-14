import { send_group_msg, send_private_msg } from '../api/qqBot.js'
import { crawlData } from '../api/saicheData.js'
import { dg_kugouSQ } from '../api/music.js'
import { getWeather, generateWeatherImage } from '../api/weather.js'
import { parseSongRequest, formatMessage, generateTextImage } from '../utils/index.js'
import { handleAdminCommands } from './admin.js'
import { dsChatChange } from './chatChange.js'
import { _sp_jx_Analysis } from './videoAnalysis.js'
import { allEmoChange, generateEmoji } from '../api/emoji.js'
import config from '../config/index.js'
import dotenv from 'dotenv'

dotenv.config()
async function textChange(data, msg) {
  const msg1 = msg[0]?.data?.text
  if (msg1?.includes('天气')) {
    const city = msg1.replace('天气', '').trim();
    if (!city) return;
    const weatherData = await getWeather(city);
    if (weatherData) {
      const weatherImage = await generateWeatherImage(weatherData);
      messageTypeChange({
        type: "image",
        data: { file: `base64://${weatherImage.toString('base64')}` }
      }, data)
    }
  }
  if (msg1?.includes('点歌')) {
    if (!parseSongRequest(msg1, '点歌')[0]) return
    const res = await dg_kugouSQ({
      msg: parseSongRequest(msg1, '点歌')[0] || '',
      n: parseSongRequest(msg1, '点歌')[1] || 1,
    })
    if (res.data.url) messageTypeChange({
      type: "record",
      data: { file: res.data.url }
    }, data)
  }
  if (msg1?.includes('图鉴')) {
    if (!parseSongRequest(msg1, '图鉴')[0]) return
    const res = await crawlData({
      name: parseSongRequest(msg1, '图鉴')[0] || ''
    })
    const weatherImage = await generateTextImage(res.extractedContent);
    if (weatherImage) messageTypeChange([{
      type: "image",
      data: { file: `base64://${weatherImage.toString('base64')}` }
    }, {
      type: "image",
      data: { file: res.img }
    }], data)
  }
  // 处理表情包菜单指令
  if (msg1?.includes('表情包菜单')) {
    try {
      const emojiData = await allEmoChange()
      if (emojiData && emojiData.length > 0) {
        let menuText = '表情包指令菜单\n\n'
        menuText += '使用方法：直接发送表情包名称即可生成\n'
        menuText += '例如：捶 @某人 或 捶 @某人 文字内容 或 5000兆 文字内容1 文字内容2\n\n'
        menuText += '可用表情包列表：\n'
        
        emojiData.forEach((item, index) => {
          if (item.data && item.data.name) {
            menuText += `${index + 1}. ${item.data.name}`
            if (item.data.params && item.data.params.length > 0) {
              menuText += ` (需要: ${item.data.params.join(', ')})`
            }
            menuText += '\n'
          }
        })
        
        menuText += '\n温馨提示：\n'
        menuText += '• @某人：选择目标用户\n'
        menuText += '• 文字内容：添加自定义文字\n'
        menuText += '• 部分表情包支持多个参数，请按需使用\n'
        const menuImage = await generateTextImage(menuText);
        if (menuImage) {
          messageTypeChange({
            type: "image",
            data: { file: `base64://${menuImage}` }
          }, data)
        } else {
          // 如果图片生成失败，发送文本消息
          messageTypeChange({
            type: "text",
            data: { text: menuText }
          }, data)
        }
      }
    } catch (error) { }
  }
  // 处理表情包指令
  if (config[data.group_id]?.isEmoji) {
    const res = await generateEmoji(data, msg)
    if (res) {
      messageTypeChange({
        type: "image",
        data: { "sub_type": "1", file: res }
      }, data)
    }
  }
}
// 处理数据类型
export function messageTypeChange(data, form) {
  const formDadta = formatMessage({
    message_type: data.message_type,
    arrs: data
  })
  if (form.message_type == 'group') {
    formDadta.group_id = form.group_id
    send_group_msg(formDadta)
  } else {
    formDadta.user_id = form.target_id
    send_private_msg(formDadta)
  }
}

export async function initializeChange(data, msg) {
  // 处理管理员命令
  handleAdminCommands(data, msg)
  textChange(data, msg)
  dsChatChange(data, msg)
  _sp_jx_Analysis(data, msg)
}
