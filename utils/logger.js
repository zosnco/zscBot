import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建logs目录（如果不存在）
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 获取当前日期作为日志文件名
function getLogFileName() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
}

// 格式化日志消息
function formatLogMessage(message) {
  const timestamp = new Date().toISOString();
  const messageType = message.message_type || message.post_type || 'unknown';
  return `[${timestamp}] [${messageType}] ${JSON.stringify(message)}\n`;
}

// 写入日志
export function logMessage(message) {
  const logFile = path.join(logsDir, getLogFileName());
  const logEntry = formatLogMessage(message);
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

// 根据消息ID从日志中检索消息
export async function findMessageById(messageId, date) {
  try {
    // 如果没有提供日期，使用当前日期
    const searchDate = date || new Date();
    const logFile = path.join(logsDir, `${searchDate.getFullYear()}-${String(searchDate.getMonth() + 1).padStart(2, '0')}-${String(searchDate.getDate()).padStart(2, '0')}.log`);
    
    // 检查日志文件是否存在
    if (!fs.existsSync(logFile)) {
      return null;
    }
    
    // 读取日志文件内容
    const content = await fs.promises.readFile(logFile, 'utf-8');
    const lines = content.split('\n');
    
    // 遍历每一行查找匹配的消息ID
    for (const line of lines) {
      if (!line) continue;
      try {
        const messageStart = line.indexOf('{');
        const messageJson = JSON.parse(line.substring(messageStart));
        if (messageJson.message_id === messageId) {
          return messageJson;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding message:', error);
    return null;
  }
}