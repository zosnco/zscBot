const emoType = {
  '洛天依': {
    type: 1,
    isPlainText: true // 是否纯文字
  },
  '戒导': {
    type: 2,
  },
  '逆转裁判气泡': {
    type: 3,
    isPlainText: true
  },
  '二次元入口': {
    type: 4,
  },
  '添乱': {
    type: 5,
  },
  '上瘾': {
    type: 6,
  },
  '"一样': {
    type: 7,
  },
  '一直': {
    type: 8,
  },
  '我永远喜欢': {
    type: 9,
  },
  '防诱拐': {
    type: 10,
  },
  '阿尼亚喜欢': {
    type: 11,
  },
  '鼓掌': {
    type: 12,
  },
  '阿罗娜扔': {
    type: 13,
  },
  '升天': {
    type: 14,
    isPlainText: true
  },
  '问问': {
    type: 15,
  },
  '亚托莉枕头': {
    type: 16,
    isPlainText: true
  },
  '宁宁举牌': {
    type: 17,
    isPlainText: true
  },
  'ba说': {
    type: 18,
    isPlainText: true
  },
  '继续干活': {
    type: 19,
  },
  '后空翻': {
    type: 20,
  },
  '悲报': {
    type: 21,
    isPlainText: true
  },
  '蔚蓝档案标题': {
    type: 22,
    isPlainText: true
  },
  '拍头': {
    type: 23,
  },
  '揍': {
    type: 24,
    isQQparam: true
  },
  '砍头': {
    type: 25,
  },
  '啃': {
    type: 26,
  },
  '高血压': {
    type: 28,
  },
  '波奇手稿': {
    type: 29,
  },
  '布洛妮娅举牌': {
    type: 30,
    isPlainText: true
  },
  '奶茶': {
    type: 31,
  },
  '遇到困难请拨打': {
    type: 32,
    isQQparam: true
  },
  '看看你的': {
    type: 33,
    isQQparam: true
  },
  '咖波画': {
    type: 34
  },
  '咖波指': {
    type: 35
  },
  '咖波撕': {
    type: 36
  },
  '咖波蹭': {
    type: 37
  },
  '咖波炖': {
    type: 39
  },
  '咖波撞': {
    type: 40
  },
  '这个引起的': {
    type: 42
  },
  '字符画': {
    type: 45
  },
  '追列车': {
    type: 46
  },
  '国旗': {
    type: 47
  },
  '智乃扔': {
    type: 48
  },
  '鼠鼠搓': {
    type: 49
  },
  '小丑': {
    type: 50
  },
  '小丑面具': {
    type: 51
  },
  '迷惑': {
    type: 52
  },
  '兑换券': {
    type: 53
  },
  '捂脸': {
    type: 54
  },
  '爬': {
    type: 55
  },
  '群青': {
    type: 56
  },
  '白天黑夜': {
    type: 57,
    isQQparam: true
  },
  '像样的亲亲': {
    type: 58
  },
  '恐龙': {
    type: 60
  },
  '注意力涣散': {
    type: 61
  },
  '离婚协议': {
    type: 62
  },
  '撅': {
    type: 63,
    isQQparam: true
  },
  '狗都不玩': {
    type: 64,
  },
  '管人痴': {
    type: 65
  },
  '不要靠近': {
    type: 66
  },
  '不要按': {
    type: 67,
    isPlainText: true
  },
  '别碰': {
    type: 68
  },
  '哆啦A梦说': {
    type: 69,
    isPlainText: true
  },
  '吃': {
    type: 71
  },
  '换位思考': {
    type: 72
  },
  '意若思镜': {
    type: 74
  },
  '灰飞烟灭': {
    type: 75
  },
  '我爸爸': {
    type: 77
  },
  '击剑': {
    type: 78,
    isQQparam: true
  },
  '我打宿傩': {
    type: 79
  },
  '满脑子': {
    type: 80
  },
  '闪瞎': {
    type: 83
  },
  '飞机杯': {
    type: 84
  },
  '弹': {
    type: 85
  },
  '红温': {
    type: 86
  },
  '回南天': {
    type: 87
  },
  '关注': {
    type: 88
  },
  '禁止': {
    type: 89
  },
  '芙莉莲拿': {
    type: 90
  },
  '哈哈镜': {
    type: 91
  },
  '垃圾': {
    type: 92
  },
  '原神吃': {
    type: 93
  },
  '原神启动': {
    type: 94
  },
  '喜报': {
    type: 95,
    isPlainText: true
  },
  '谷歌验证码': {
    type: 98
  },
  '抓': {
    type: 99
  },
  '双手抓': {
    type: 100
  },
  '鬼畜': {
    type: 101
  },
  '手枪': {
    type: 102
  },
  '锤': {
    type: 103
  },
  '凉宫春日举': {
    type: 104
  },
  '顶': {
    type: 105
  },
  '打穿': {
    type: 107
  },
  '记仇': {
    type: 108,
    isPlainText: true
  },
  '抱紧': {
    type: 109
  },
  '抱': {
    type: 110,
    isQQparam: true
  },
  '抱大腿': {
    type: 111
  },
  '胡桃啃': {
    type: 112
  },
  '坐牢': {
    type: 113,
    isPlainText: true
  },
  '不文明': {
    type: 114
  },
  '杰瑞盯': {
    type: 118
  },
  '急急国王': {
    type: 120
  },
  '汐汐': {
    type: 121,
    isPlainText: true
  },
  '旧病复发': {
    type: 122
  },
  '啾啾': {
    type: 123
  },
  '跳': {
    type: 124
  },
  '万花筒': {
    type: 125
  },
  '凯露指': {
    type: 126
  },
  '压岁钱不要交给': {
    type: 128
  },
  '踢球': {
    type: 129
  },
  '卡比锤': {
    type: 130
  },
  '亲': {
    type: 131,
    isQQparam: true
  },
  '可莉吃': {
    type: 132
  },
  '敲': {
    type: 133
  },
  '心奈印章': {
    type: 134,
    isPlainText: true
  },
  '泉此方看': {
    type: 135
  },
  '鞭笞': {
    type: 136,
    isQQparam: true
  },
  '偷学': {
    type: 137
  },
  '左右横跳': {
    type: 138
  },
  '让我进去': {
    type: 139
  },
  '舔糖': {
    type: 140
  },
  '等价无穷小': {
    type: 141
  },
  '听音乐': {
    type: 142
  },
  '小天使': {
    type: 143
  },
  '小撅': {
    type: 144,
    isQQparam: true
  },
  '加载中': {
    type: 145
  },
  '看扁': {
    type: 146
  },
  '看图标': {
    type: 147
  },
  '循环': {
    type: 148
  },
  '寻狗启事': {
    type: 149
  },
  '永远爱你': {
    type: 150
  },
  '洛天依要': {
    type: 151
  },
  '罗永浩说': {
    type: 153,
    isPlainText: true
  },
  '鲁迅说': {
    type: 154,
    isPlainText: true
  },
  '旅行伙伴觉醒': {
    type: 157
  },
  '旅行伙伴加入': {
    type: 158
  },
  '交个朋友': {
    type: 159
  },
  '结婚申请': {
    type: 160
  },
  '米哈游': {
    type: 162
  },
  '上香': {
    type: 163
  },
  '我老婆': {
    type: 167
  },
  '纳西妲啃': {
    type: 168
  },
  '亚文化取名机': {
    type: 169
  },
  '诺基亚': {
    type: 175,
    isPlainText: true
  },
  '请假条': {
    type: 176
  },
  '合成大干员': {
    type: 177
  },
  '我推的网友': {
    type: 178
  },
  'out': {
    type: 180
  },
  '加班': {
    type: 181
  },
  '这像画吗': {
    type: 183
  },
  '小画家': {
    type: 184
  },
  '拍': {
    type: 187
  },
  '佩佩举': {
    type: 188,
    isQQparam: true
  },
  '摸': {
    type: 190
  },
  '捏': {
    type: 191
  },
  '像素化': {
    type: 192
  },
  '普拉娜吃': {
    type: 194
  },
  '打棒球': {
    type: 195
  },
  '打篮球': {
    type: 196
  },
  '一起玩': {
    type: 198
  },
  '出警': {
    type: 199
  },
  '警察': {
    type: 200
  },
  '捣': {
    type: 203
  },
  '打印': {
    type: 205
  },
  '舔': {
    type: 206
  },
}
export default emoType;