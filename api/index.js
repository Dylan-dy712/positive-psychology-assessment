// Vercel Serverless Function - 后端API入口
const express = require('express');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', require('../backend/src/routes/auth'));
app.use('/api/user', require('../backend/src/routes/user'));
app.use('/api/assessment', require('../backend/src/routes/assessment'));
app.use('/api/coin', require('../backend/src/routes/coin'));
app.use('/api/checkin', require('../backend/src/routes/checkin'));
app.use('/api/gratitude', require('../backend/src/routes/gratitude'));
app.use('/api/blindbox', require('../backend/src/routes/blindbox'));
app.use('/api/flow', require('../backend/src/routes/flow'));
app.use('/api/game', require('../backend/src/routes/game'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: process.env.USE_TCB === 'true' ? 'TCB云数据库' : '内存数据库'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// Vercel Serverless Function 导出
module.exports = (req, res) => {
  // 确保Express应用能处理请求
  app(req, res);
};
