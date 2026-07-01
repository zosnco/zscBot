// import sitiveWord from './sensitiveWords.js'

// AI 助手全局触发词（名称）。
// - 私聊固定用它触发
// - 群聊必须在该群配置里显式写 "dsAssistantName" 才启用：
//     · 用全局名字：   "dsAssistantName": ASSISTANT_NAME
//     · 用自定义名字： "dsAssistantName": "小爱"
//     · 不写或写 ""：  该群不启用 AI
// 改全局名字只需改下面这一行，引用 ASSISTANT_NAME 的群 + 私聊 + 菜单文案自动跟着变
export const ASSISTANT_NAME = '蛋挞'

const config = { // 白名单和配置
  "820888183": {
    "welcomeMessages": " 欢迎加入凌云 群名片改成游戏名字 记得留意下群公告内容谢谢", // 群欢迎语
    "isAntiRetraction": true, // 是否开启防撤回
    "isClockIn": true, // 是否开启签到
    "chatType": '', // 空表示关闭，at表示at模式，name表示名字
    "isVideoAnalysis": true, // 是否开启视频解析
    "autoReplyProbability": 0, // 自动回复消息的概率，最高100%
    "isCardName": "", // 是否开启群名片修改
    "isEmoji": true, // 是否开启表情包
    "dsAssistantName": ASSISTANT_NAME, // AI 对话触发词；可换成 ASSISTANT_NAME 或自定义名字
    // "sensitiveWords": sitiveWord // 敏感词
  },
  "985309959": {
    "isVideoAnalysis": true, // 是否开启视频解析
    "isEmoji": true,
    "dsAssistantName": ASSISTANT_NAME, // AI 对话触发词；可换成 ASSISTANT_NAME 或自定义名字
  },
  "1021173838": {
    "welcomeMessages": " 欢迎入群，嘻嘻",
    "isAntiRetraction": true,
    "isClockIn": true,
    "isEmoji": true,
    "chatType": '', // 空表示关闭，at表示at模式，name表示名字
    "isVideoAnalysis": true, // 是否开启视频解析
    "autoReplyProbability": 30, // 自动回复消息的概率，最高100%
    "isCardName": "", // 是否开启群名片修改
    "dsAssistantName": ASSISTANT_NAME, // AI 对话触发词；可换成 ASSISTANT_NAME 或自定义名字
    // "sensitiveWords": sitiveWord // 敏感词
  },
}
export default config;
// 测试环境
// export default {
//   "1021173838": config['1021173838']
// };