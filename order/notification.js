import { send_group_msg } from '../api/qqBot.js'
import config from '../config/index.js'
import { formatMessage } from '../utils/index.js'
import { handleRetraction } from './antiRetraction.js'
async function increaseChange(data) {
  if (data.notice_type == 'group_increase' && config[data.group_id]) { // 入群通知
    if (!config[data.group_id].welcomeMessages) return
    send_group_msg(formatMessage({
      message_type: 'group',
      target_id: data.group_id,
      arrs: {
        type: "text",
        data: { text: config[data.group_id].welcomeMessages },
      },
      at_qq: data.user_id
    }))

  }
  if (data.notice_type == 'group_decrease') { // 退群通知
    // console.log(data, 456);
  }
}
export async function notificationOnChange(data) {
  increaseChange(data)
  handleRetraction(data)
}
