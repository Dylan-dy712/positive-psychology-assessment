// 主服务器文件
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 连接数据库
const { connectDB } = require('./src/config/database');
connectDB();

// 初始化Express应用
const app = express();

// 配置CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(express.json());

// 解析URL编码的请求体
app.use(express.urlencoded({ extended: true }));

// 导入路由
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const assessmentRoutes = require('./src/routes/assessment');
const coinRoutes = require('./src/routes/coin');
const checkinRoutes = require('./src/routes/checkin');
const gratitudeRoutes = require('./src/routes/gratitude');
const blindboxRoutes = require('./src/routes/blindbox');
const flowRoutes = require('./src/routes/flow');
const gameRoutes = require('./src/routes/game');

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'MongoDB数据库'
  });
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/coin', coinRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api/blindbox', blindboxRoutes);
app.use('/api/flow', flowRoutes);
app.use('/api/game', gameRoutes);

// 404路由
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`数据库模式: MongoDB数据库`);
  console.log(`API地址: http://localhost:${PORT}/api`);
});

module.exports = app;