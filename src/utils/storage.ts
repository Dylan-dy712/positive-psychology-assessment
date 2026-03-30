const STORAGE_KEYS = {
  ASSESSMENT_RECORDS: 'assessment_records',
  ASSESSMENT_PROGRESS: 'assessment_progress',
  COIN_BALANCE: 'coin_balance',
  COIN_RECORDS: 'coin_records',
  GRATITUDE_DIARY: 'gratitude_diary',
  FLOW_MOMENT: 'flow_moment',
  HOPE_BLIND_BOX: 'hope_blind_box',
  DAILY_REWARDS: 'daily_rewards',
} as const;

export interface AssessmentRecord {
  id: string;
  assessmentId: string;
  assessmentName: string;
  completedAt: string;
  scores: Record<string, number>;
  totalScore?: number;
}

export interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  answers: Record<number, number>;
  lastUpdated: string;
}

export interface CoinRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface GratitudeDiary {
  id: string;
  date: string;
  type: 'three-question' | 'free-record';
  content: any;
  photo?: string;
}

export interface FlowMoment {
  id: string;
  date: string;
  activities: string[];
  customActivity?: string;
  duration: string;
  endTime: string;
  feelings: string[];
  triggers: string[];
}

export interface HopeBlindBox {
  id: string;
  date: string;
  wishType: string;
  actualType: string;
  task: string;
  status: 'pending' | 'completed';
  photo?: string;
  completedAt?: string;
}

export interface DailyRewards {
  date: string;
  gratitudeDiary: boolean;
  flowMoment: boolean;
  anxietyPopup: boolean;
  heartHunter: boolean;
  heartCards: boolean;
  yulegeyu: boolean;
  kuakua: boolean;
  kuakua300: boolean;
  kuakua525: boolean;
  heartScratch: boolean;
  blindBox: boolean;
}

export type DailyRewardsKey = keyof DailyRewards;

/**
 * 保存测评记录
 */
export const saveAssessmentRecord = (record: AssessmentRecord): void => {
  try {
    const records = getAssessmentRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('保存测评记录失败:', error);
  }
};

/**
 * 获取所有测评记录
 */
export const getAssessmentRecords = (): AssessmentRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取测评记录失败:', error);
    return [];
  }
};

/**
 * 获取指定量表的测评记录
 */
export const getAssessmentRecordsById = (assessmentId: string): AssessmentRecord[] => {
  const records = getAssessmentRecords();
  return records.filter((record) => record.assessmentId === assessmentId);
};

/**
 * 获取最新的测评记录
 */
export const getLatestAssessmentRecords = (limit: number = 3): AssessmentRecord[] => {
  const records = getAssessmentRecords();
  return records
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit);
};

/**
 * 保存答题进度
 */
export const saveAssessmentProgress = (progress: AssessmentProgress): void => {
  try {
    const allProgress = getAllAssessmentProgress();
    const existingIndex = allProgress.findIndex((p) => p.assessmentId === progress.assessmentId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('保存答题进度失败:', error);
  }
};

/**
 * 获取指定量表的答题进度
 */
export const getAssessmentProgress = (assessmentId: string): AssessmentProgress | null => {
  try {
    const allProgress = getAllAssessmentProgress();
    return allProgress.find((p) => p.assessmentId === assessmentId) || null;
  } catch (error) {
    console.error('获取答题进度失败:', error);
    return null;
  }
};

/**
 * 获取所有答题进度
 */
export const getAllAssessmentProgress = (): AssessmentProgress[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_PROGRESS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取所有答题进度失败:', error);
    return [];
  }
};

/**
 * 清除指定量表的答题进度
 */
export const clearAssessmentProgress = (assessmentId: string): void => {
  try {
    const allProgress = getAllAssessmentProgress();
    const filtered = allProgress.filter((p) => p.assessmentId !== assessmentId);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_PROGRESS, JSON.stringify(filtered));
  } catch (error) {
    console.error('清除答题进度失败:', error);
  }
};

/**
 * 获取心理货币余额
 */
export const getCoinBalance = (): number => {
  try {
    // 检查 localStorage 是否可用（微信浏览器可能限制）
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage 不可用');
      return 500; // 返回默认值
    }
    const balance = localStorage.getItem(STORAGE_KEYS.COIN_BALANCE);
    if (balance === null) {
      // 初始余额为500
      const initialBalance = 500;
      try {
        localStorage.setItem(STORAGE_KEYS.COIN_BALANCE, initialBalance.toString());
        // 记录初始余额
        addCoinRecord('earn', initialBalance, '新用户注册初始福利');
      } catch (e) {
        console.warn('无法保存初始余额到 localStorage');
      }
      return initialBalance;
    }
    return parseInt(balance, 10) || 0;
  } catch (error) {
    console.error('获取心理货币余额失败:', error);
    return 500; // 返回默认值而不是0
  }
};

/**
 * 更新心理货币余额
 */
export const updateCoinBalance = (amount: number, reason: string): boolean => {
  try {
    const currentBalance = getCoinBalance();
    const newBalance = currentBalance + amount;
    
    if (newBalance < 0) {
      return false; // 余额不足
    }
    
    localStorage.setItem(STORAGE_KEYS.COIN_BALANCE, newBalance.toString());
    addCoinRecord(amount > 0 ? 'earn' : 'spend', Math.abs(amount), reason);
    return true;
  } catch (error) {
    console.error('更新心理货币余额失败:', error);
    return false;
  }
};

/**
 * 添加心理货币记录
 */
export const addCoinRecord = (type: 'earn' | 'spend', amount: number, reason: string): void => {
  try {
    const records = getCoinRecords();
    const newRecord: CoinRecord = {
      id: Date.now().toString(),
      type,
      amount,
      reason,
      createdAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.COIN_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('添加心理货币记录失败:', error);
  }
};

/**
 * 获取心理货币记录
 */
export const getCoinRecords = (): CoinRecord[] => {
  try {
    // 检查 localStorage 是否可用（微信浏览器可能限制）
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage 不可用');
      return [];
    }
    const data = localStorage.getItem(STORAGE_KEYS.COIN_RECORDS);
    if (!data) {
      return [];
    }
    const records = JSON.parse(data);
    // 确保返回的是数组
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('获取心理货币记录失败:', error);
    return [];
  }
};

/**
 * 保存感恩日记
 */
export const saveGratitudeDiary = (diary: GratitudeDiary): void => {
  try {
    const diaries = getGratitudeDiaries();
    diaries.push(diary);
    localStorage.setItem(STORAGE_KEYS.GRATITUDE_DIARY, JSON.stringify(diaries));
  } catch (error) {
    console.error('保存感恩日记失败:', error);
  }
};

/**
 * 获取感恩日记
 */
export const getGratitudeDiaries = (): GratitudeDiary[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GRATITUDE_DIARY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取感恩日记失败:', error);
    return [];
  }
};

/**
 * 保存心流时刻
 */
export const saveFlowMoment = (moment: FlowMoment): void => {
  try {
    const moments = getFlowMoments();
    moments.push(moment);
    localStorage.setItem(STORAGE_KEYS.FLOW_MOMENT, JSON.stringify(moments));
  } catch (error) {
    console.error('保存心流时刻失败:', error);
  }
};

/**
 * 获取心流时刻
 */
export const getFlowMoments = (): FlowMoment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FLOW_MOMENT);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取心流时刻失败:', error);
    return [];
  }
};

/**
 * 保存希望盲盒
 */
export const saveHopeBlindBox = (box: HopeBlindBox): void => {
  try {
    const boxes = getHopeBlindBoxes();
    const existingIndex = boxes.findIndex(b => b.id === box.id);
    
    if (existingIndex >= 0) {
      boxes[existingIndex] = box;
    } else {
      boxes.push(box);
    }
    
    localStorage.setItem(STORAGE_KEYS.HOPE_BLIND_BOX, JSON.stringify(boxes));
  } catch (error) {
    console.error('保存希望盲盒失败:', error);
  }
};

/**
 * 获取希望盲盒
 */
export const getHopeBlindBoxes = (): HopeBlindBox[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOPE_BLIND_BOX);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取希望盲盒失败:', error);
    return [];
  }
};

/**
 * 获取每日奖励状态
 */
export const getDailyRewards = (): DailyRewards => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_REWARDS);
    
    if (data) {
      const rewards = JSON.parse(data);
      if (rewards.date === today) {
        return rewards;
      }
    }
    
    // 新的一天，重置奖励状态
    const newRewards: DailyRewards = {
      date: today,
      gratitudeDiary: false,
      flowMoment: false,
      anxietyPopup: false,
      heartHunter: false,
      heartCards: false,
      yulegeyu: false,
      kuakua: false,
      kuakua300: false,
      kuakua525: false,
      heartScratch: false,
      blindBox: false,
    };
    
    localStorage.setItem(STORAGE_KEYS.DAILY_REWARDS, JSON.stringify(newRewards));
    return newRewards;
  } catch (error) {
    console.error('获取每日奖励状态失败:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      gratitudeDiary: false,
      flowMoment: false,
      anxietyPopup: false,
      heartHunter: false,
      heartCards: false,
      yulegeyu: false,
      kuakua: false,
      kuakua300: false,
      kuakua525: false,
      heartScratch: false,
      blindBox: false,
    };
  }
};

/**
 * 更新每日奖励状态
 */
export const updateDailyRewards = (key: DailyRewardsKey, value: boolean): void => {
  try {
    const rewards = getDailyRewards();
    // 类型断言确保TypeScript知道这是正确的类型
    (rewards as any)[key] = value;
    localStorage.setItem(STORAGE_KEYS.DAILY_REWARDS, JSON.stringify(rewards));
  } catch (error) {
    console.error('更新每日奖励状态失败:', error);
  }
};

/**
 * 清除所有数据
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.COIN_BALANCE);
    localStorage.removeItem(STORAGE_KEYS.COIN_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.GRATITUDE_DIARY);
    localStorage.removeItem(STORAGE_KEYS.FLOW_MOMENT);
    localStorage.removeItem(STORAGE_KEYS.HOPE_BLIND_BOX);
    localStorage.removeItem(STORAGE_KEYS.DAILY_REWARDS);
  } catch (error) {
    console.error('清除数据失败:', error);
  }
};
