import { authApi, userApi } from './api';

const TOKEN_STORAGE_KEY = 'auth_token' as const;
const USER_STORAGE_KEY = 'user_data' as const;

export interface AuthUser {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  coinBalance: number;
  consecutiveCheckInDays: number;
  lastCheckInDate?: string;
  hasAgreedToTerms: boolean;
}

// 获取token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

// 保存token
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

// 清除token
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

// 获取用户信息
export const getAuthUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get auth user:', error);
    return null;
  }
};

// 保存用户信息
export const saveAuthUser = (user: AuthUser): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth user:', error);
  }
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// 注册
export const register = async (username: string, password: string, nickname: string) => {
  try {
    const response = await authApi.register(username, password, nickname);
    const { token, user } = response;
    saveToken(token);
    saveAuthUser(user);
    return { success: true, user, token };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: error instanceof Error ? error.message : '注册失败' };
  }
};

// 登录
export const login = async (username: string, password: string) => {
  try {
    const response = await authApi.login(username, password);
    const { token, user } = response;
    saveToken(token);
    saveAuthUser(user);
    return { success: true, user, token };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: error instanceof Error ? error.message : '登录失败' };
  }
};

// 游客登录
export const guestLogin = async () => {
  try {
    const response = await authApi.guestLogin();
    const { token, user } = response;
    saveToken(token);
    saveAuthUser(user);
    return { success: true, user, token };
  } catch (error) {
    console.error('Guest login failed:', error);
    return { success: false, error: error instanceof Error ? error.message : '游客登录失败' };
  }
};

// 登出
export const logout = () => {
  clearToken();
};

// 更新用户信息
export const updateUserProfile = async (data: Partial<AuthUser>) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('未登录');
    }
    
    const response = await userApi.updateProfile(token, data);
    const updatedUser = response.user;
    saveAuthUser(updatedUser);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Update profile failed:', error);
    return { success: false, error: error instanceof Error ? error.message : '更新失败' };
  }
};

// 刷新用户信息
export const refreshUserInfo = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('未登录');
    }
    
    const response = await userApi.getProfile(token);
    const user = response.user;
    saveAuthUser(user);
    return { success: true, user };
  } catch (error) {
    console.error('Refresh user info failed:', error);
    return { success: false, error: error instanceof Error ? error.message : '刷新失败' };
  }
};

export default {
  getToken,
  saveToken,
  clearToken,
  getAuthUser,
  saveAuthUser,
  isAuthenticated,
  register,
  login,
  guestLogin,
  logout,
  updateUserProfile,
  refreshUserInfo,
};
