import { send_group_msg, send_private_msg } from '../api/qqBot.js'
import { crawlData } from '../api/saicheData.js'
import { dg_kugouSQ } from '../api/music.js'
import { getWeather, generateWeatherImage } from '../api/weather.js'
import { parseSongRequest, formatMessage, generateTextImage } from '../utils/index.js'
import { handleAdminCommands } from './admin.js'
import { dsChatChange } from './chatChange.js'
import { _sp_jx_Analysis } from './videoAnalysis.js'
import { generateEmoji } from '../api/emoji.js'
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
    if (res.music_url) messageTypeChange({
      type: "record",
      data: { file: res.music_url }
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
