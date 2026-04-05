// 数据库操作
const User = require('./User');

// 用户数据库操作
const userDB = {
  // 根据用户名查找用户
  findByUsername: async (username) => {
    return await User.findOne({ username });
  },

  // 根据ID查找用户
  findById: async (id) => {
    return await User.findOne({ id });
  },

  // 创建用户
  create: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  // 更新用户
  update: async (id, updateData) => {
    return await User.findOneAndUpdate({ id }, updateData, { new: true });
  },

  // 删除用户
  delete: async (id) => {
    return await User.findOneAndDelete({ id });
  },

  // 获取所有用户
  getAll: async () => {
    return await User.find();
  }
};

module.exports = { userDB };