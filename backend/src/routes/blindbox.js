// 希望盲盒路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 抽取盲盒
router.post('/draw', authenticate, async (req, res) => {
  try {
    // 这里可以添加抽取盲盒逻辑
    const blindboxTypes = ['希望', '勇气', '自信', '感恩', '友谊'];
    const randomType = blindboxTypes[Math.floor(Math.random() * blindboxTypes.length)];
    const isWon = Math.random() > 0.3; // 70%的概率中奖
    
    res.json({
      success: true,
      message: isWon ? '恭喜你抽中了盲盒！' : '很遗憾，再试一次吧！',
      blindbox: {
        id: `blindbox_${Date.now()}`,
        userId: req.userId,
        type: randomType,
        content: isWon ? `获得了${randomType}的力量！` : '继续努力，下次一定会中！',
        isWon,
        drawnAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('抽取盲盒错误:', err);
    res.status(500).json({ error: '抽取盲盒失败' });
  }
});

// 获取盲盒记录
router.get('/records', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取盲盒记录
    res.json({
      records: [],
    });
  } catch (err) {
    console.error('获取盲盒记录错误:', err);
    res.status(500).json({ error: '获取盲盒记录失败' });
  }
});

// 许愿
router.post('/wish', authenticate, async (req, res) => {
  try {
    const { wish } = req.body;
    
    if (!wish) {
      return res.status(400).json({ error: '许愿内容不能为空' });
    }
    
    res.json({
      success: true,
      message: '许愿成功，希望你的愿望能够实现！',
    });
  } catch (err) {
    console.error('许愿错误:', err);
    res.status(500).json({ error: '许愿失败' });
  }
});

module.exports = router;