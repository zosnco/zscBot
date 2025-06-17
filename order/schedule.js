import schedule from 'node-schedule';
import { send_group_sign, set_group_card } from '../api/qqBot.js';
import config from '../config/index.js';
import { dayjs } from '../utils/index.js'
import dotenv from 'dotenv'
dotenv.config()
// 存储所有的定时任务
const scheduledJobs = new Map();

/**
 * 创建定时任务
 * @param {string} jobId - 任务ID
 * @param {string} cronExpression - cron表达式
 * @param {Function} taskFunction - 要执行的任务函数
 */
function createScheduleJob(jobId, cronExpression, taskFunction) {
  // 如果已存在同ID的任务，先取消它
  if (scheduledJobs.has(jobId)) {
    cancelScheduleJob(jobId);
  }

  // 创建新任务
  const job = schedule.scheduleJob(cronExpression, taskFunction);
  scheduledJobs.set(jobId, job);
}

/**
 * 取消定时任务
 * @param {string} jobId - 任务ID
 */
function cancelScheduleJob(jobId) {
  const job = scheduledJobs.get(jobId);
  if (job) {
    job.cancel();
    scheduledJobs.delete(jobId);
  }
}

// 每日群打卡任务
function dailyGroupSignIn() {
  Object.keys(config).forEach(groupId => {
    if (config[groupId].isClockIn) {
      send_group_sign({ group_id: groupId })
    }
  });
}
// 修改群昵称
function set_group_cardChange() {
  Object.keys(config).forEach(groupId => {
    if (config[groupId].isCardName) {
      const times = dayjs().format('MM月DD日 HH:mm')
      set_group_card({
        group_id: groupId,
        user_id: process.env.ADMIN_QQ,
        card: config[groupId].isCardName.replace(/\(.*?\)/g, `(${times})`)
      })
    }
  });
}
// 初始化定时任务
export function initializeScheduledTasks() {
  // 每天00:00执行群打卡
  createScheduleJob(
    'dailyGroupSignIn',
    '0 0 0 * * *',
    dailyGroupSignIn
  );
  // 修改群昵称
  createScheduleJob(
    'set_group_cardChange',
    '* * * * *',
    set_group_cardChange
  );
}

// 导出任务管理函数
export {
  cancelScheduleJob
};