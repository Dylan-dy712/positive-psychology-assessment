// 腾讯云TCB云开发数据库操作
const { db, COLLECTIONS } = require('../config/tcb');

// 用户相关操作
const userDB = {
  create: async (user) => {
    try {
      const result = await db.collection(COLLECTIONS.USERS).add({
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { ...user, _id: result.id };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  },
  
  findById: async (id) => {
    try {
      const result = await db.collection(COLLECTIONS.USERS).doc(id).get();
      return result.data ? { ...result.data, id: result.data._id } : null;
    } catch (error) {
      console.error('查找用户失败:', error);
      return null;
    }
  },
  
  findByUsername: async (username) => {
    try {
      const result = await db.collection(COLLECTIONS.USERS)
        .where({ username })
        .limit(1)
        .get();
      
      if (result.data && result.data.length > 0) {
        const user = result.data[0];
        return { ...user, id: user._id };
      }
      return null;
    } catch (error) {
      console.error('查找用户失败:', error);
      return null;
    }
  },
  
  update: async (id, data) => {
    try {
      await db.collection(COLLECTIONS.USERS).doc(id).update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      // 返回更新后的用户
      return await userDB.findById(id);
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },
};

// 测评相关操作
const assessmentDB = {
  create: async (assessment) => {
    try {
      const result = await db.collection(COLLECTIONS.ASSESSMENTS).add({
        ...assessment,
        createdAt: new Date().toISOString(),
      });
      return { ...assessment, _id: result.id };
    } catch (error) {
      console.error('创建测评记录失败:', error);
      throw error;
    }
  },
  
  findByUserId: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.ASSESSMENTS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('查找测评记录失败:', error);
      return [];
    }
  },
  
  findById: async (id) => {
    try {
      const result = await db.collection(COLLECTIONS.ASSESSMENTS).doc(id).get();
      return result.data ? { ...result.data, id: result.data._id } : null;
    } catch (error) {
      console.error('查找测评记录失败:', error);
      return null;
    }
  },
};

// 心理货币相关操作
const coinDB = {
  getBalance: async (userId) => {
    try {
      const user = await userDB.findById(userId);
      return user ? user.coinBalance || 0 : 0;
    } catch (error) {
      console.error('获取余额失败:', error);
      return 0;
    }
  },
  
  updateBalance: async (userId, amount, reason) => {
    try {
      const user = await userDB.findById(userId);
      if (!user) {
        throw new Error('用户不存在');
      }
      
      const newBalance = (user.coinBalance || 0) + amount;
      await userDB.update(userId, { coinBalance: newBalance });
      
      // 记录交易
      const record = {
        userId,
        type: amount > 0 ? 'earn' : 'spend',
        amount: Math.abs(amount),
        reason,
        balanceAfter: newBalance,
        createdAt: new Date().toISOString(),
      };
      
      const result = await db.collection(COLLECTIONS.COIN_RECORDS).add(record);
      
      return { 
        balance: newBalance, 
        record: { ...record, _id: result.id } 
      };
    } catch (error) {
      console.error('更新余额失败:', error);
      throw error;
    }
  },
  
  getRecords: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.COIN_RECORDS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('获取交易记录失败:', error);
      return [];
    }
  },
};

// 签到相关操作
const checkinDB = {
  getLastCheckin: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.CHECKIN_RECORDS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
      
      if (result.data && result.data.length > 0) {
        const record = result.data[0];
        return { ...record, id: record._id };
      }
      return null;
    } catch (error) {
      console.error('获取最后签到记录失败:', error);
      return null;
    }
  },
  
  create: async (checkin) => {
    try {
      const result = await db.collection(COLLECTIONS.CHECKIN_RECORDS).add({
        ...checkin,
        createdAt: new Date().toISOString(),
      });
      return { ...checkin, _id: result.id };
    } catch (error) {
      console.error('创建签到记录失败:', error);
      throw error;
    }
  },
  
  getHistory: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.CHECKIN_RECORDS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('获取签到历史失败:', error);
      return [];
    }
  },
};

// 感恩日记相关操作
const gratitudeDB = {
  create: async (diary) => {
    try {
      const result = await db.collection(COLLECTIONS.GRATITUDE_DIARIES).add({
        ...diary,
        createdAt: new Date().toISOString(),
      });
      return { ...diary, _id: result.id };
    } catch (error) {
      console.error('创建感恩日记失败:', error);
      throw error;
    }
  },
  
  findByUserId: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.GRATITUDE_DIARIES)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('查找感恩日记失败:', error);
      return [];
    }
  },
  
  findByDate: async (userId, date) => {
    try {
      const result = await db.collection(COLLECTIONS.GRATITUDE_DIARIES)
        .where({ userId, date })
        .limit(1)
        .get();
      
      if (result.data && result.data.length > 0) {
        const diary = result.data[0];
        return { ...diary, id: diary._id };
      }
      return null;
    } catch (error) {
      console.error('查找感恩日记失败:', error);
      return null;
    }
  },
};

// 盲盒相关操作
const blindboxDB = {
  create: async (blindbox) => {
    try {
      const result = await db.collection(COLLECTIONS.BLIND_BOXES).add({
        ...blindbox,
        createdAt: new Date().toISOString(),
      });
      return { ...blindbox, _id: result.id };
    } catch (error) {
      console.error('创建盲盒记录失败:', error);
      throw error;
    }
  },
  
  findByUserId: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.BLIND_BOXES)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('查找盲盒记录失败:', error);
      return [];
    }
  },
};

// 心流时刻相关操作
const flowDB = {
  create: async (flow) => {
    try {
      const result = await db.collection(COLLECTIONS.FLOW_MOMENTS).add({
        ...flow,
        createdAt: new Date().toISOString(),
      });
      return { ...flow, _id: result.id };
    } catch (error) {
      console.error('创建心流时刻失败:', error);
      throw error;
    }
  },
  
  findByUserId: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.FLOW_MOMENTS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('查找心流时刻失败:', error);
      return [];
    }
  },
};

// 游戏记录相关操作
const gameDB = {
  create: async (record) => {
    try {
      const result = await db.collection(COLLECTIONS.GAME_RECORDS).add({
        ...record,
        createdAt: new Date().toISOString(),
      });
      return { ...record, _id: result.id };
    } catch (error) {
      console.error('创建游戏记录失败:', error);
      throw error;
    }
  },
  
  findByUserId: async (userId) => {
    try {
      const result = await db.collection(COLLECTIONS.GAME_RECORDS)
        .where({ userId })
        .orderBy('createdAt', 'desc')
        .get();
      
      return result.data ? result.data.map(item => ({ ...item, id: item._id })) : [];
    } catch (error) {
      console.error('查找游戏记录失败:', error);
      return [];
    }
  },
};

module.exports = {
  userDB,
  assessmentDB,
  coinDB,
  checkinDB,
  gratitudeDB,
  blindboxDB,
  flowDB,
  gameDB,
};
