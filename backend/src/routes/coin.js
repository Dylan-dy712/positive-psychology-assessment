// 心理货币路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取货币余额
router.get('/balance', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取货币余额
    res.json({
      balance: 500,
    });
  } catch (err) {
    console.error('获取货币余额错误:', err);
    res.status(500).json({ error: '获取货币余额失败' });
  }
});

// 获取货币记录
router.get('/records', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取货币记录
    res.json({
      records: [],
    });
  } catch (err) {
    console.error('获取货币记录错误:', err);
    res.status(500).json({ error: '获取货币记录失败' });
  }
});

module.exports = router;