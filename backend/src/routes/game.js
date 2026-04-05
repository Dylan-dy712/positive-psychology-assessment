// 游戏路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 记录游戏分数
router.post('/record', authenticate, async (req, res) => {
  try {
    const { gameId, score } = req.body;
    
    if (!gameId || score === undefined) {
      return res.status(400).json({ error: '游戏ID和分数不能为空' });
    }
    
    res.json({
      success: true,
      message: '游戏分数记录成功',
    });
  } catch (err) {
    console.error('记录游戏分数错误:', err);
    res.status(500).json({ error: '记录游戏分数失败' });
  }
});

// 获取游戏历史
router.get('/history/:gameId', authenticate, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // 这里可以从数据库获取游戏历史
    res.json({
      records: [],
    });
  } catch (err) {
    console.error('获取游戏历史错误:', err);
    res.status(500).json({ error: '获取游戏历史失败' });
  }
});

module.exports = router;