import { sendApiRequest } from '../utils/axiosEncapsulation.js'

// dschat AI 对话服务（部署在服务器 5000 端口）
const BASE = 'http://43.142.191.93:5000'

// 获取人设列表 GET /chat/presets
// 返回: { default, presets: [{ key, name, system }] }
export async function getDsPresets() {
  return sendApiRequest(`${BASE}/chat/presets`, 'get')
}

// 创建会话 POST /chat/session
// preset: 可选，default / coder / translator，不传用服务端默认
// 返回: { sessionId, preset }
export async function createDsSession(preset) {
  return sendApiRequest(`${BASE}/chat/session`, 'post', preset ? { preset } : {})
}

// 发送消息 POST /chat/message
// 返回: { reply, conversation }
export async function sendDsMessage(sessionId, message) {
  return sendApiRequest(`${BASE}/chat/message`, 'post', { sessionId, message })
}
