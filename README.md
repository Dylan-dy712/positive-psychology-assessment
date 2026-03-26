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

### 个人中心功能（新增）
- **启动页**：首次进入隐私协议确认，2-3秒启动动画
- **个人中心**：用户信息展示、心理货币管理
- **心理货币体系**：签到奖励、消费记录、积分明细
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
│   ├── HomePage.tsx     # 首页
│   ├── AssessmentListPage.tsx   # 量表列表
│   ├── AssessmentIntroPage.tsx  # 测评说明
│   ├── QuizPage.tsx     # 答题页面
│   ├── ReportPage.tsx   # 测评报告
│   ├── HistoryPage.tsx  # 历史记录（心灵档案）
│   ├── MyPage.tsx       # 个人中心
│   ├── CoinDetailPage.tsx  # 心理货币明细
│   ├── AccountPage.tsx  # 账号信息
│   ├── CheckInPage.tsx  # 每日签到
│   ├── EmojiPage.tsx    # 朋辈表情包
│   ├── FeedbackPage.tsx # 帮助与反馈
│   ├── ServicePage.tsx  # 在线客服
│   ├── ServiceAgreementPage.tsx  # 用户服务协议
│   ├── PrivacyPolicyPage.tsx     # 隐私保护政策
│   └── index.ts
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
