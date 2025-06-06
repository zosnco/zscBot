
import config from 'dotenv';
import WebSocket from 'ws';
import { messageOnChange } from './src/index.js';
import { initializeScheduledTasks } from './order/schedule.js';

const dotenv = config.config().parsed
// WebSocket服务器地址
const wsUrl = dotenv.WSURL;

// 创建WebSocket连接
const ws = new WebSocket(wsUrl);

// 连接打开时的处理
ws.on('open', function open() {
  console.log('已连接到WebSocket服务器:', wsUrl);

  // 可以在连接建立后发送初始消息
  // ws.send('客户端已连接');
});
connectWebSocket()
// // 接收消息的处理
// ws.on('message', function incoming(data) {
//   // console.log('收到消息:', data.toString());

//   try {
//     // 尝试解析收到的消息为JSON
//     const message = JSON.parse(data.toString());

//     // 根据消息内容处理不同的操作
//     console.log(message);

//   } catch (error) {
//     console.log('消息不是有效的JSON格式:', error.message);
//   }
// });

// 处理错误
ws.on('error', function error(err) {
  console.error('WebSocket错误:', err.message);
});

// 连接关闭的处理
ws.on('close', function close() {
  console.log('WebSocket连接已关闭');
  // 添加重连逻辑
  console.log('5秒后尝试重新连接...');
  setTimeout(connectWebSocket, 5000);
});

// 创建一个函数来处理WebSocket连接
function connectWebSocket() {
  console.log('正在连接到WebSocket服务器...');
  const newWs = new WebSocket(wsUrl);

  // 重新绑定所有事件处理器
  newWs.on('open', function open() {
    console.log('已重新连接到WebSocket服务器:', wsUrl);
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
  global.ws = newWs;
  return newWs;
}
// 导出函数，以便可以从其他文件使用
export default {
  ws
};

// 初始化定时任务
initializeScheduledTasks();

console.log('WebSocket客户端已启动，正在连接到', wsUrl);