// API服务配置
// 本地开发使用 localhost
// 生产环境：如果在Vercel使用相对路径，否则使用VITE_API_URL环境变量
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001' 
  : import.meta.env.VITE_API_URL || '';

// 通用请求函数
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 认证相关API
export const authApi = {
  // 注册
  register: async (username: string, password: string, nickname: string) => {
    return request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, nickname }),
    });
  },
  
  // 登录
  login: async (username: string, password: string) => {
    return request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  // 游客登录
  guestLogin: async () => {
    return request<{ token: string; user: any }>('/api/auth/guest', {
      method: 'POST',
    });
  },
};

// 用户相关API
export const userApi = {
  // 获取用户信息
  getProfile: async (token: string) => {
    return request<{ user: any }>('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 更新用户信息
  updateProfile: async (token: string, data: any) => {
    return request<{ user: any }>('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
};

// 测评相关API
export const assessmentApi = {
  // 提交测评
  submit: async (token: string, assessmentId: string, answers: any[]) => {
    return request<{ recordId: string; result: any }>('/api/assessment/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ assessmentId, answers }),
    });
  },
  
  // 获取测评结果
  getResult: async (token: string, recordId: string) => {
    return request<{ result: any }>(`/api/assessment/result?recordId=${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 获取测评历史
  getHistory: async (token: string) => {
    return request<{ records: any[] }>('/api/assessment/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 心理货币相关API
export const coinApi = {
  // 获取余额
  getBalance: async (token: string) => {
    return request<{ balance: number }>('/api/coin/balance', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 获取交易记录
  getTransactions: async (token: string) => {
    return request<{ transactions: any[] }>('/api/coin/transactions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 签到相关API
export const checkinApi = {
  // 每日签到
  dailyCheckin: async (token: string) => {
    return request<{ earned: number; consecutiveDays: number }>('/api/checkin/daily', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 获取签到历史
  getHistory: async (token: string) => {
    return request<{ records: any[] }>('/api/checkin/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 感恩日记相关API
export const gratitudeApi = {
  // 创建日记
  create: async (token: string, content: string, type: string = 'free') => {
    return request<{ id: string }>('/api/gratitude/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, type }),
    });
  },
  
  // 获取日记列表
  list: async (token: string) => {
    return request<{ diaries: any[] }>('/api/gratitude/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 删除日记
  delete: async (token: string, id: string) => {
    return request<{ success: boolean }>(`/api/gratitude/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 盲盒相关API
export const blindboxApi = {
  // 开盲盒
  open: async (token: string) => {
    return request<{ prize: any; cost: number }>('/api/blindbox/open', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 获取奖品列表
  getPrizes: async (token: string) => {
    return request<{ prizes: any[] }>('/api/blindbox/prizes', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 心流时刻相关API
export const flowApi = {
  // 发布动态
  publish: async (token: string, content: string, type: string = 'text') => {
    return request<{ id: string }>('/api/flow/publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, type }),
    });
  },
  
  // 获取动态列表
  list: async (token: string) => {
    return request<{ moments: any[] }>('/api/flow/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  // 点赞
  like: async (token: string, momentId: string) => {
    return request<{ liked: boolean; likes: number }>('/api/flow/like', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ momentId }),
    });
  },
  
  // 评论
  comment: async (token: string, momentId: string, content: string) => {
    return request<{ id: string }>('/api/flow/comment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ momentId, content }),
    });
  },
};

// 游戏相关API
export const gameApi = {
  // 记录游戏分数
  record: async (token: string, gameId: string, score: number) => {
    return request<{ id: string }>('/api/game/record', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, score }),
    });
  },
  
  // 获取排行榜
  ranking: async (token: string, gameId: string) => {
    return request<{ rankings: any[] }>(`/api/game/ranking?gameId=${gameId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// 健康检查
export const healthCheck = async () => {
  return request<{ status: string; timestamp: string }>('/health');
};

// 导出所有API
export default {
  auth: authApi,
  user: userApi,
  assessment: assessmentApi,
  coin: coinApi,
  checkin: checkinApi,
  gratitude: gratitudeApi,
  blindbox: blindboxApi,
  flow: flowApi,
  game: gameApi,
  healthCheck,
};
