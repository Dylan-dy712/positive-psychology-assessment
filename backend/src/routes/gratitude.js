// 感恩日记路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 提交感恩日记
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { content, type } = req.body;
    
    if (!content || !type) {
      return res.status(400).json({ error: '内容和类型不能为空' });
    }
    
    res.json({
      success: true,
      message: '感恩日记提交成功',
      diary: {
        id: `diary_${Date.now()}`,
        userId: req.userId,
        content,
        type,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('提交感恩日记错误:', err);
    res.status(500).json({ error: '提交感恩日记失败' });
  }
});

// 获取感恩日记列表
router.get('/list', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取感恩日记列表
    res.json({
      diaries: [],
    });
  } catch (err) {
    console.error('获取感恩日记列表错误:', err);
    res.status(500).json({ error: '获取感恩日记列表失败' });
  }
});

// 获取感恩日记详情
router.get('/detail/:diaryId', authenticate, async (req, res) => {
  try {
    const { diaryId } = req.params;
    
    // 这里可以从数据库获取感恩日记详情
    res.json({
      diary: {
        id: diaryId,
        content: '感恩今天的阳光',
        type: 'free',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('获取感恩日记详情错误:', err);
    res.status(500).json({ error: '获取感恩日记详情失败' });
  }
});

module.exports = router;