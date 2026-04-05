// 心流时刻路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 提交心流时刻
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { content, activity, duration } = req.body;
    
    if (!content || !activity || !duration) {
      return res.status(400).json({ error: '内容、活动和时长不能为空' });
    }
    
    res.json({
      success: true,
      message: '心流时刻提交成功',
      flow: {
        id: `flow_${Date.now()}`,
        userId: req.userId,
        content,
        activity,
        duration,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('提交心流时刻错误:', err);
    res.status(500).json({ error: '提交心流时刻失败' });
  }
});

// 获取心流时刻列表
router.get('/list', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取心流时刻列表
    res.json({
      flows: [],
    });
  } catch (err) {
    console.error('获取心流时刻列表错误:', err);
    res.status(500).json({ error: '获取心流时刻列表失败' });
  }
});

// 获取心流画像
router.get('/portrait', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取心流画像数据
    res.json({
      portrait: {
        topActivities: [
          { activity: '学习', count: 5 },
          { activity: '运动', count: 3 },
          { activity: '阅读', count: 2 },
        ],
        averageDuration: 60,
        totalCount: 10,
      },
    });
  } catch (err) {
    console.error('获取心流画像错误:', err);
    res.status(500).json({ error: '获取心流画像失败' });
  }
});

module.exports = router;