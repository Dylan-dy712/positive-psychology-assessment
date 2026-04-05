// 评估路由
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 提交评估
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;
    
    if (!assessmentId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: '评估ID和答案不能为空' });
    }
    
    // 这里可以添加评估逻辑，如计算分数等
    const scores = { total: answers.reduce((sum, answer) => sum + answer, 0) };
    
    res.json({
      success: true,
      message: '评估提交成功',
      assessment: {
        id: `assessment_${Date.now()}`,
        assessmentId,
        userId: req.userId,
        answers,
        scores,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('提交评估错误:', err);
    res.status(500).json({ error: '提交评估失败' });
  }
});

// 获取评估历史
router.get('/history', authenticate, async (req, res) => {
  try {
    // 这里可以从数据库获取评估历史
    res.json({
      assessments: [],
    });
  } catch (err) {
    console.error('获取评估历史错误:', err);
    res.status(500).json({ error: '获取评估历史失败' });
  }
});

// 获取评估详情
router.get('/detail/:assessmentId', authenticate, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // 这里可以从数据库获取评估详情
    res.json({
      assessment: {
        id: `assessment_${Date.now()}`,
        assessmentId,
        answers: [],
        scores: {},
        completedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('获取评估详情错误:', err);
    res.status(500).json({ error: '获取评估详情失败' });
  }
});

module.exports = router;