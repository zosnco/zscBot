// import sitiveWord from './sensitiveWords.js'
const config = { // 白名单和配置
  "838881064": {
    "welcomeMessages": " 欢迎加入凌云 群名片改成游戏名字 记得留意下群公告内容谢谢", // 群欢迎语
    "isAntiRetraction": true, // 是否开启防撤回
    "isClockIn": true, // 是否开启签到
    "chatType": '', // 空表示关闭，at表示at模式，name表示名字
    "isVideoAnalysis": true, // 是否开启视频解析
    "autoReplyProbability": 0, // 自动回复消息的概率，最高100%
    "isCardName": "LY.云端()", // 是否开启群名片修改
    "isEmoji": true, // 是否开启表情包
    // "sensitiveWords": sitiveWord // 敏感词
  },
  "985309959": {
    "isVideoAnalysis": true, // 是否开启视频解析
    "isEmoji": true,
  },
  "862794206": {},
  "1021173838": {
    "welcomeMessages": " 欢迎入群，嘻嘻",
    "isAntiRetraction": true,
    "isClockIn": true,
    "isEmoji": true,
    "chatType": '', // 空表示关闭，at表示at模式，name表示名字
    "isVideoAnalysis": true, // 是否开启视频解析
    "autoReplyProbability": 0, // 自动回复消息的概率，最高100%
    "isCardName": "", // 是否开启群名片修改
    // "sensitiveWords": sitiveWord // 敏感词
  },
}
export default config;
// 测试环境
// export default {
//   "1021173838": config['1021173838']
// };