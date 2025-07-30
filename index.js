
import config from 'dotenv';
import WebSocket from 'ws';
import { messageOnChange } from './src/index.js';
import { initializeScheduledTasks } from './order/schedule.js';

const dotenv = config.config().parsed
// WebSocket服务器地址
const wsUrl = dotenv.WSURL;

// 声明全局WebSocket变量
let ws;

// 创建一个函数来处理WebSocket连接
function connectWebSocket() {
  console.log('正在连接到WebSocket服务器...');
  const newWs = new WebSocket(wsUrl, {
    headers: {
      'Authorization': 'Bearer zosnco51857'
    }
  });

  // 绑定所有事件处理器
  newWs.on('open', function open() {
    console.log('已连接到WebSocket服务器:', wsUrl);
  });

  newWs.on('message', function incoming(data) {
    try {
      // 尝试解析收到的消息为JSON
      const message = JSON.parse(data);
      // 记录消息日志
      import('./utils/logger.js').then(logger => {
        logger.logMessage(message);
      });
      messageOnChange(message)
    } catch (error) {
      console.log('消息不是有效的JSON格式:', error.message);
    }
  });

  newWs.on('error', function error(err) {
    console.error('WebSocket错误:', err.message);
  });

  newWs.on('close', function close() {
    console.log('WebSocket连接已关闭');
    console.log('5秒后尝试重新连接...');
    setTimeout(connectWebSocket, 5000);
  });

  // 更新全局ws变量
  ws = newWs;
  global.ws = newWs;
  return newWs;
}

// 初始化WebSocket连接
connectWebSocket();

// 导出WebSocket实例，以便可以从其他文件使用
export default {
  get ws() { return ws; }
};

// 初始化定时任务
initializeScheduledTasks();

console.log('WebSocket客户端已启动，正在连接到', wsUrl);