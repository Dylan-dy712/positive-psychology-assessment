// 认证路由
const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { userDB } = require('../models/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    // 检查用户是否已存在
    const existingUser = await userDB.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      nickname: nickname || username,
      avatar: '/assets/touxiang.svg',
      coinBalance: 500, // 初始心理货币
      consecutiveCheckInDays: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await userDB.create(user);
    
    // 生成 token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: '注册成功',
      token,
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
    console.error('注册错误:', err);
    res.status(500).json({ error: '注册失败' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    // 查找用户
    const user = await userDB.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成 token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: '登录成功',
      token,
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
    console.error('登录错误:', err);
    res.status(500).json({ error: '登录失败' });
  }
});

// 游客登录
router.post('/guest', async (req, res) => {
  try {
    // 生成随机用户名
    const username = `guest_${Math.floor(Math.random() * 1000000)}`;
    
    // 创建游客用户
    const user = {
      id: uuidv4(),
      username,
      password: await bcrypt.hash('guest_password', 10),
      nickname: '游客',
      avatar: '/assets/touxiang.svg',
      coinBalance: 500, // 初始心理货币
      consecutiveCheckInDays: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await userDB.create(user);
    
    // 生成 token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: '游客登录成功',
      token,
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
    console.error('游客登录错误:', err);
    res.status(500).json({ error: '游客登录失败' });
  }
});

module.exports = router;