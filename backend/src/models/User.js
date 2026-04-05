// 用户模型
const { memoryDB } = require('../config/database');

// 用户模型类
class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.nickname = data.nickname;
    this.avatar = data.avatar || '/assets/touxiang.svg';
    this.coinBalance = data.coinBalance || 500;
    this.consecutiveCheckInDays = data.consecutiveCheckInDays || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // 保存用户
  save() {
    return memoryDB.users.save(this);
  }

  // 静态方法：根据查询条件查找用户
  static async findOne(query) {
    return await memoryDB.users.findOne(query);
  }

  // 静态方法：查找并更新用户
  static async findOneAndUpdate(query, update) {
    return await memoryDB.users.findOneAndUpdate(query, update);
  }

  // 静态方法：查找并删除用户
  static async findOneAndDelete(query) {
    return await memoryDB.users.findOneAndDelete(query);
  }

  // 静态方法：获取所有用户
  static async find() {
    return await memoryDB.users.find();
  }
}

module.exports = User;