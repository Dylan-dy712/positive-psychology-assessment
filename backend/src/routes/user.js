// 用户路由
const express = require('express');
const bcrypt = require('bcryptjs');
const { userDB } = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取用户信息
router.get('/info', authenticate, async (req, res) => {
  try {
    const user = await userDB.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      coinBalance: user.coinBalance,
      consecutiveCheckInDays: user.consecutiveCheckInDays,
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/update', authenticate, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const updateData = {};
    
    if (nickname) updateData.nickname = nickname;
    if (avatar) updateData.avatar = avatar;
    
    const user = await userDB.update(req.userId, updateData);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
      success: true,
      message: '更新成功',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        coinBalance: user.coinBalance,
        consecutiveCheckInDays: user.consecutiveCheckInDays,
      },
    });
  } catch (err) {
    console.error('更新用户信息错误:', err);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// 更改密码
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '旧密码和新密码不能为空' });
    }
    
    const user = await userDB.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '旧密码错误' });
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await userDB.update(req.userId, { password: hashedPassword });
    
    res.json({
      success: true,
      message: '密码更改成功',
    });
  } catch (err) {
    console.error('更改密码错误:', err);
    res.status(500).json({ error: '更改密码失败' });
  }
});

module.exports = router;