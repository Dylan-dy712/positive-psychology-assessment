# 积极心理测评平台

基于 React 18 + TypeScript + Tailwind CSS 开发的移动端 H5 心理测评应用。

## 功能特性

- **9个科学量表**：PPQ、SWLS、MLQ、SKUS、PANAS、ASHS、ERS、ERQ、RPWS
- **完整的测评流程**：首页 → 量表列表 → 测评说明 → 答题 → 报告
- **数据持久化**：使用 localStorage 存储测评记录和答题进度
- **丰富的可视化**：雷达图、线性量表、散点图、柱状图、饼图
- **响应式设计**：移动端优先，适配各种屏幕尺寸

## 技术栈

- React 18
- TypeScript
- Tailwind CSS 4
- React Router DOM
- Recharts
- Lucide React

## 项目结构

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
│   └── Toast.tsx        # Toast 提示组件
├── data/
│   └── assessments.ts   # 量表数据配置
├── pages/
│   ├── HomePage.tsx     # 首页
│   ├── AssessmentListPage.tsx   # 量表列表
│   ├── AssessmentIntroPage.tsx  # 测评说明
│   ├── QuizPage.tsx     # 答题页面
│   ├── ReportPage.tsx   # 测评报告
│   ├── HistoryPage.tsx  # 历史记录
│   └── index.ts
├── utils/
│   ├── storage.ts       # localStorage 工具
│   └── scoring.ts       # 计分逻辑
├── App.tsx
├── main.tsx
└── index.css
```

## 启动项目

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

## 量表说明

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

## 部署

构建后的文件位于 `dist` 目录，可直接部署到任何静态文件服务器。

```bash
# 构建
npm run build

# 部署 dist 目录到服务器
```

## 浏览器兼容性

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- 微信内置浏览器
