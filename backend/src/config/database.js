// 数据库配置
const dotenv = require('dotenv');

dotenv.config();

// 内存数据库
let users = [];

// 连接数据库
const connectDB = async () => {
  console.log('使用内存数据库');
};

// 内存数据库操作
const memoryDB = {
  users: {
    findOne: (query) => {
      if (query.username) {
        return Promise.resolve(users.find(user => user.username === query.username));
      }
      if (query.id) {
        return Promise.resolve(users.find(user => user.id === query.id));
      }
      return Promise.resolve(null);
    },
    save: (user) => {
      users.push(user);
      return Promise.resolve(user);
    },
    findOneAndUpdate: (query, update) => {
      const index = users.findIndex(user => user.id === query.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...update };
        return Promise.resolve(users[index]);
      }
      return Promise.resolve(null);
    },
    findOneAndDelete: (query) => {
      const index = users.findIndex(user => user.id === query.id);
      if (index !== -1) {
        const deletedUser = users[index];
        users.splice(index, 1);
        return Promise.resolve(deletedUser);
      }
      return Promise.resolve(null);
    },
    find: () => {
      return Promise.resolve(users);
    }
  }
};

module.exports = {
  connectDB,
  memoryDB
};