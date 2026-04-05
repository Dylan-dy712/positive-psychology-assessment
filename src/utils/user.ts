import { updateCoinBalance } from './storage';

const USER_STORAGE_KEY = 'user_data' as const;
const COIN_RECORDS_KEY = 'coin_records' as const;
const FEEDBACK_RECORDS_KEY = 'feedback_records' as const;

export interface UserData {
  avatar: string;
  nickname: string;
  gender: 'male' | 'female' | 'unknown';
  age?: number;
  grade?: string;
  schoolStage?: string;
  coinBalance: number;
  consecutiveCheckInDays: number;
  lastCheckInDate?: string;
  hasAgreedToTerms: boolean;
}

export interface CoinRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  balanceAfter?: number; // 交易后的余额
}

export interface FeedbackRecord {
  id: string;
  content: string;
  contact?: string;
  submittedAt: string;
}

export const getAssetPath = (filename: string): string => {
  return `./assets/${filename}`;
};

const defaultUserData: UserData = {
  avatar: getAssetPath('touxiang.svg'),
  nickname: '朋朋',
  gender: 'unknown',
  coinBalance: 500,
  consecutiveCheckInDays: 0,
  hasAgreedToTerms: false,
};

export const getUserData = (): UserData => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    if (!data) return { ...defaultUserData };
    const parsed = JSON.parse(data);
    return { ...defaultUserData, ...parsed };
  } catch (error) {
    console.error('Failed to get user data:', error);
    return { ...defaultUserData };
  }
};

export const saveUserData = (data: Partial<UserData>): void => {
  try {
    const current = getUserData();
    const updated = { ...current, ...data };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const getCoinRecords = (): CoinRecord[] => {
  try {
    const data = localStorage.getItem(COIN_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get coin records:', error);
    return [];
  }
};

export const addCoinRecord = (record: Omit<CoinRecord, 'id' | 'date' | 'balanceAfter'>): CoinRecord => {
  try {
    const records = getCoinRecords();
    const userData = getUserData();
    const newBalance = record.type === 'earn' 
      ? userData.coinBalance + record.amount
      : userData.coinBalance - record.amount;
    
    const newRecord: CoinRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      balanceAfter: newBalance,
    };
    records.unshift(newRecord);
    localStorage.setItem(COIN_RECORDS_KEY, JSON.stringify(records));
    
    saveUserData({ coinBalance: newBalance });
    
    return newRecord;
  } catch (error) {
    console.error('Failed to add coin record:', error);
    throw error;
  }
};

export const getFeedbackRecords = (): FeedbackRecord[] => {
  try {
    const data = localStorage.getItem(FEEDBACK_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get feedback records:', error);
    return [];
  }
};

export const addFeedbackRecord = (record: Omit<FeedbackRecord, 'id' | 'submittedAt'>): FeedbackRecord => {
  try {
    const records = getFeedbackRecords();
    const newRecord: FeedbackRecord = {
      ...record,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    localStorage.setItem(FEEDBACK_RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  } catch (error) {
    console.error('Failed to add feedback record:', error);
    throw error;
  }
};

export const performCheckIn = (): { earned: number; isNewStreak: boolean } => {
  const today = new Date().toISOString().split('T')[0];
  const userData = getUserData();
  
  if (userData.lastCheckInDate === today) {
    return { earned: 0, isNewStreak: false };
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let consecutiveDays = userData.consecutiveCheckInDays;
  let isNewStreak = false;
  
  if (userData.lastCheckInDate === yesterdayStr) {
    consecutiveDays++;
    if (consecutiveDays > 7) {
      consecutiveDays = 1;
      isNewStreak = true;
    }
  } else {
    consecutiveDays = 1;
    isNewStreak = true;
  }
  
  const rewards = [15, 15, 20, 15, 30, 15, 45];
  const earned = rewards[consecutiveDays - 1];
  
  saveUserData({
    consecutiveCheckInDays: consecutiveDays,
    lastCheckInDate: today,
  });
  
  updateCoinBalance(earned, `每日签到（连续${consecutiveDays}天）`);
  
  return { earned, isNewStreak };
};

export const isTodayCheckedIn = (): boolean => {
  const userData = getUserData();
  const today = new Date().toISOString().split('T')[0];
  return userData.lastCheckInDate === today;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};
