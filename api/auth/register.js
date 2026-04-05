// Vercel Serverless Function - 用户注册
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { userDB } = require('../../backend/src/models/database');
const { generateToken } = require('../../backend/src/middleware/auth');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};
