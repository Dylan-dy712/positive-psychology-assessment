# 心智小程序 - 积极心理测评平台

基于 React 18 + TypeScript + Tailwind CSS 开发的移动端 H5 心理测评应用。

## 🌐 访问地址

**https://Dylan-dy712.github.io/positive-psychology-assessment/**

## ✨ 功能特性

### 核心测评功能
- **9个科学量表**：PPQ、SWLS、MLQ、SKUS、PANAS、ASHS、ERS、ERQ、RPWS
- **完整的测评流程**：启动页 → 首页 → 量表列表 → 测评说明 → 答题 → 报告
- **数据持久化**：使用 localStorage 存储测评记录和答题进度
- **丰富的可视化**：雷达图、线性量表、散点图、柱状图、饼图
- **响应式设计**：移动端优先，适配各种屏幕尺寸

### 心理储蓄功能（新增）
- **心理货币体系**：通过日常练习积累心理货币
- **每日活动**：
  - 感恩日记 - 记录每日感恩时刻
  - 心流时刻 - 追踪专注状态
  - 希望盲盒 - 抽取希望卡片
- **心理小游戏**：
  - 🎮 焦虑弹窗 - 点击消除焦虑
  - 🎮 夸夸消消乐 - 消除负面词汇
  - 🎮 心渊猎手 - 潜入心渊收集能量
  - 🎮 心愈战牌 - 卡牌对战心魔
  - 🎮 愈了个愈 - 消除压力方块
  - 🎮 心晴刮卡 - 刮刮乐抽奖

### 个人中心功能
- **启动页**：首次进入隐私协议确认，2-3秒启动动画
- **个人中心**：用户信息展示、心理货币管理
- **心理货币明细**：分类显示收支记录，支持筛选查看
- **每日签到**：7天签到周期，递增奖励机制
- **账号管理**：头像、昵称、性别、年龄、年级编辑
- **朋辈表情包**：5套表情包，二维码获取
- **帮助与反馈**：常见问题、意见提交、历史反馈
- **在线客服**：客服入口
- **用户协议**：完整的用户服务协议和隐私保护政策

## 🛠️ 技术栈

- React 18
- TypeScript
- Tailwind CSS 4
- React Router DOM
- Recharts
- Lucide React

## 📁 项目结构

```
src/
├── components/
│   ├── charts/          # 图表组件
│   │   ├── RadarChart.tsx
│   │   ├── LinearScale.tsx
│   │   ├── ScatterChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── VerticalBarChart.tsx
│   │   ├── PieChart.tsx
│   │   └── index.ts
│   ├── BottomNav.tsx     # 底部导航栏
│   └── Toast.tsx        # Toast 提示组件
├── data/
│   └── assessments.ts   # 量表数据配置
├── pages/
│   ├── LaunchPage.tsx   # 启动页
│   ├── HomePage.tsx     # 首页（心灵档案）
│   ├── AssessmentListPage.tsx   # 量表列表
│   ├── AssessmentIntroPage.tsx  # 测评说明
│   ├── QuizPage.tsx     # 答题页面
│   ├── ReportPage.tsx   # 测评报告
│   ├── HistoryPage.tsx  # 历史记录
│   ├── MentalSavePage.tsx       # 心理储蓄
│   ├── MyPage.tsx       # 个人中心
│   ├── CoinDetailPage.tsx       # 心理货币明细
│   ├── CoinGuidePage.tsx        # 货币获取攻略
│   ├── AccountPage.tsx  # 账号信息
│   ├── CheckInPage.tsx  # 每日签到
│   ├── EmojiPage.tsx    # 朋辈表情包
│   ├── FeedbackPage.tsx # 帮助与反馈
│   ├── ServicePage.tsx  # 在线客服
│   ├── ServiceAgreementPage.tsx  # 用户服务协议
│   ├── PrivacyPolicyPage.tsx     # 隐私保护政策
│   │
│   ├── # 心理储蓄功能页面
│   ├── GratitudeDiaryPage.tsx           # 感恩日记
│   ├── GratitudeThreeQuestionPage.tsx   # 三问记录
│   ├── GratitudeFreeRecordPage.tsx      # 自由记录
│   ├── GratitudeCalendarPage.tsx        # 感恩日历
│   ├── FlowMomentPage.tsx               # 心流时刻
│   ├── FlowMomentRecordPage.tsx         # 心流记录
│   ├── FlowMomentPortraitPage.tsx       # 心流画像
│   ├── FlowMomentCandyBoxPage.tsx       # 心流糖果盒
│   ├── HopeBlindBoxPage.tsx             # 希望盲盒
│   ├── HopeBlindBoxWishPage.tsx         # 许愿页面
│   ├── HopeBlindBoxDrawPage.tsx         # 抽奖页面
│   ├── HopeBlindBoxSuccessPage.tsx      # 中奖页面
│   ├── HopeBlindBoxFailPage.tsx         # 未中奖页面
│   ├── HopeBlindBoxSubmitPage.tsx       # 提交页面
│   ├── HopeBlindBoxMemoirsPage.tsx      # 回忆录
│   │
│   ├── # 心理小游戏页面
│   ├── AnxietyPopupGamePage.tsx   # 焦虑弹窗
│   ├── KuakuaGamePage.tsx         # 夸夸消消乐
│   ├── HeartHunterGamePage.tsx    # 心渊猎手
│   ├── HeartCardsGamePage.tsx     # 心愈战牌
│   ├── YulegeyuGamePage.tsx       # 愈了个愈
│   └── HeartScratchGamePage.tsx   # 心晴刮卡
│
├── utils/
│   ├── storage.ts       # localStorage 工具
│   ├── scoring.ts       # 计分逻辑
│   └── user.ts          # 用户数据管理
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📋 量表说明

| 量表 | 名称 | 题目数 | 测评时长 |
|------|------|--------|----------|
| PPQ | 积极心理资本量表 | 26题 | 5-8分钟 |
| SWLS | 生活满意度量表 | 5题 | 1-2分钟 |
| MLQ | 生命意义感量表 | 10题 | 2-3分钟 |
| SKUS | 优势知识和优势使用量表 | 21题 | 4-6分钟 |
| PANAS | 积极情绪与消极情绪量表 | 20题 | 3-5分钟 |
| ASHS | 成人状态希望量表 | 6题 | 1-2分钟 |
| ERS | 自我韧性量表 | 14题 | 3-4分钟 |
| ERQ | 情绪调节问卷 | 10题 | 2-3分钟 |
| RPWS | 心理幸福感量表 | 18题 | 4-6分钟 |

## 🎮 心理小游戏说明

### 焦虑弹窗
点击弹出的焦虑词汇，消除焦虑，获得心理货币奖励。

### 夸夸消消乐
消除负面词汇，收集积极词汇，通过积极心理学答题复活。

### 心渊猎手
潜入心渊，收集心理能量，战胜心魔获得奖励。

### 心愈战牌
卡牌对战游戏，使用心理特质卡牌战胜敌人，每日首次通关奖励10枚心理货币。

### 愈了个愈
消除压力方块，通过积极心理学答题复活，通关奖励心理货币。

### 心晴刮卡
刮刮乐抽奖游戏，20%中奖率，每天最多产出25枚心理货币。

## 📊 签到奖励规则

| 连续签到天数 | 奖励心理货币 |
|--------------|--------------|
| 第1天 | 15枚 |
| 第2天 | 15枚 |
| 第3天 | 20枚 |
| 第4天 | 15枚 |
| 第5天 | 30枚 |
| 第6天 | 15枚 |
| 第7天 | 45枚 |

连续签到满7天后自动开启新一轮签到周期。

## 🎁 心理货币获取方式

1. **每日签到** - 最高可获得45枚/天
2. **完成测评** - 每次测评奖励心理货币
3. **心理小游戏** - 通关奖励10枚心理货币
4. **心晴刮卡** - 每天最多产出25枚心理货币
5. **感恩日记** - 记录感恩时刻获得奖励
6. **心流时刻** - 追踪专注状态获得奖励
7. **希望盲盒** - 抽取希望卡片获得奖励

## 📦 部署

### 本地部署

构建后的文件位于 `dist` 目录，可直接部署到任何静态文件服务器。

```bash
# 构建
npm run build

# 部署 dist 目录到服务器
```

### GitHub Pages 部署

项目已配置 GitHub Pages 自动部署：

```bash
# 一键部署
npm run deploy
```

部署后访问：**https://Dylan-dy712.github.io/positive-psychology-assessment/**

## 💾 数据存储

所有用户数据都存储在浏览器的 localStorage 中，包括：
- 用户个人信息（头像、昵称、性别、年龄等）
- 心理货币余额和交易记录
- 测评历史记录
- 签到记录
- 感恩日记记录
- 心流时刻记录
- 希望盲盒记录
- 反馈记录

**注意**：清除浏览器缓存或更换设备会导致数据丢失。

## 🌐 浏览器兼容性

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 微信内置浏览器

## 📄 许可证

心智桥工作室 版权所有

## 📞 联系方式

- 联系邮箱：xinzhixinxiang525@126.com
- 客服通道：小程序【我的】-【在线客服】

---

**最新更新时间**：2025年3月
