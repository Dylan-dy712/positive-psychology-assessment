import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Gift, 
  Gamepad2, 
  Calendar, 
  Star,
  ShoppingBag,
  Award,
  Clock,
  ChevronDown,
  BarChart3,
  Filter,
  X,
  ChevronRight,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

// 兼容两种格式的 CoinRecord
interface CoinRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason?: string;
  description?: string;
  createdAt?: string;
  date?: string;
  created_at?: string;
}

type TabType = 'all' | 'earn' | 'spend';
type ViewType = 'list' | 'bill';

const getIconByDescription = (description: string, type: 'earn' | 'spend') => {
  if (!description) return type === 'earn' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;
  if (description.includes('签到')) return <Calendar className="w-5 h-5" />;
  if (description.includes('游戏') || description.includes('心愈') || description.includes('心晴') || description.includes('愈了') || description.includes('心渊') || description.includes('消消乐') || description.includes('刮卡')) 
    return <Gamepad2 className="w-5 h-5" />;
  if (description.includes('注册') || description.includes('福利') || description.includes('奖励') || description.includes('初始')) 
    return <Gift className="w-5 h-5" />;
  if (description.includes('购买') || description.includes('消费') || description.includes('兑换')) 
    return <ShoppingBag className="w-5 h-5" />;
  if (description.includes('盲盒')) 
    return <Star className="w-5 h-5" />;
  if (description.includes('成就') || description.includes('等级')) 
    return <Award className="w-5 h-5" />;
  return type === 'earn' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;
};

const getCategoryLabel = (description: string): string => {
  if (!description) return '其他';
  if (description.includes('签到')) return '每日签到';
  if (description.includes('游戏') || description.includes('心愈') || description.includes('心晴') || description.includes('愈了') || description.includes('心渊')) 
    return '心理游戏';
  if (description.includes('消消乐') || description.includes('刮卡')) 
    return '趣味游戏';
  if (description.includes('注册') || description.includes('初始')) return '新用户福利';
  if (description.includes('盲盒')) return '盲盒抽奖';
  if (description.includes('购买') || description.includes('消费')) return '商城消费';
  if (description.includes('成就')) return '成就奖励';
  return '其他';
};

// 获取记录原因（兼容两种格式）
const getRecordReason = (record: CoinRecord): string => {
  return record.reason || record.description || '未知原因';
};

// 获取记录时间（兼容多种格式）
const getRecordDate = (record: CoinRecord): string => {
  return record.createdAt || record.date || record.created_at || new Date().toISOString();
};

const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '未知时间';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知时间';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (e) {
    return '未知时间';
  }
};

const formatMonth = (date: Date): string => {
  try {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  } catch {
    return '未知月份';
  }
};

const getMonthString = (date: Date): string => {
  try {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return '';
  }
};

// 错误边界组件
const ErrorFallback = ({ error, onReset }: { error: string; onReset: () => void }) => (
  <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-5">
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-red-500 font-bold mb-2">页面加载失败</p>
      <p className="text-gray-500 text-sm mb-4 break-all">{error}</p>
      <button 
        onClick={onReset}
        className="px-6 py-2.5 bg-orange-500 text-white rounded-full text-sm font-medium"
      >
        刷新页面
      </button>
    </div>
  </div>
);

export const CoinDetailPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<CoinRecord[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({start: null, end: null});
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // 统计数据
  const [stats, setStats] = useState({totalEarn: 0, totalSpend: 0, earnCount: 0, spendCount: 0});
  const [filteredRecords, setFilteredRecords] = useState<CoinRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any>({
    totalEarn: 0, 
    totalSpend: 0, 
    net: 0,
    earnCount: 0, 
    spendCount: 0,
    categoryStats: {}
  });

  // 全局错误捕获
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('全局错误:', event.error);
      setPageError(event.error?.message || event.error?.toString() || '未知错误');
      event.preventDefault();
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise错误:', event.reason);
      setPageError(event.reason?.message || event.reason?.toString() || 'Promise错误');
      event.preventDefault();
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // 加载数据
  useEffect(() => {
    const loadData = () => {
      try {
        let storedRecords: CoinRecord[] = [];
        let storedBalance = 0;
        
        try {
          const recordsData = localStorage.getItem('coin_records');
          if (recordsData) {
            const parsed = JSON.parse(recordsData);
            if (Array.isArray(parsed)) {
              storedRecords = parsed;
            }
          }
        } catch (e) {
          console.error('读取记录失败:', e);
        }
        
        try {
          const balanceData = localStorage.getItem('coin_balance');
          if (balanceData) {
            storedBalance = parseInt(balanceData, 10) || 0;
          } else {
            storedBalance = 500;
            localStorage.setItem('coin_balance', '500');
            const initialRecord: CoinRecord = {
              id: Date.now().toString(),
              type: 'earn',
              amount: 500,
              reason: '新用户注册初始福利',
              createdAt: new Date().toISOString(),
            };
            storedRecords = [initialRecord];
            localStorage.setItem('coin_records', JSON.stringify(storedRecords));
          }
        } catch (e) {
          console.error('读取余额失败:', e);
        }
        
        setBalance(storedBalance);
        setRecords(storedRecords);
        
        // 计算统计数据
        const earnRecords = storedRecords.filter(r => r.type === 'earn');
        const spendRecords = storedRecords.filter(r => r.type === 'spend');
        setStats({
          totalEarn: earnRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
          totalSpend: spendRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
          earnCount: earnRecords.length,
          spendCount: spendRecords.length
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('页面错误:', err);
        setPageError(err?.message || err?.toString() || '未知错误');
        setLoading(false);
      }
    };
    
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, []);

  // 筛选记录
  useEffect(() => {
    try {
      let filtered = [...records];
      
      if (activeTab !== 'all') {
        filtered = filtered.filter(r => r.type === activeTab);
      }
      
      if (viewType === 'bill') {
        const monthStr = getMonthString(selectedMonth);
        if (monthStr) {
          filtered = filtered.filter(r => {
            try {
              const recordDate = new Date(getRecordDate(r));
              return getMonthString(recordDate) === monthStr;
            } catch {
              return false;
            }
          });
        }
      }
      
      if (dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(r => {
          try {
            const recordDate = new Date(getRecordDate(r));
            return recordDate >= startDate && recordDate <= endDate;
          } catch {
            return false;
          }
        });
      }
      
      setFilteredRecords(filtered);
    } catch (e: any) {
      console.error('筛选错误:', e);
      setPageError('筛选失败: ' + (e?.message || '未知错误'));
    }
  }, [records, activeTab, viewType, selectedMonth, dateRange]);

  // 计算月度统计
  useEffect(() => {
    try {
      const monthStr = getMonthString(selectedMonth);
      if (!monthStr) return;
      
      const monthRecords = records.filter(r => {
        try {
          const recordDate = new Date(getRecordDate(r));
          return getMonthString(recordDate) === monthStr;
        } catch {
          return false;
        }
      });
      
      const earnRecords = monthRecords.filter(r => r.type === 'earn');
      const spendRecords = monthRecords.filter(r => r.type === 'spend');
      const totalEarn = earnRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
      const totalSpend = spendRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
      
      const categoryStats: any = {};
      monthRecords.forEach(r => {
        const reason = getRecordReason(r);
        const category = getCategoryLabel(reason);
        if (!categoryStats[category]) {
          categoryStats[category] = { amount: 0, count: 0, type: r.type };
        }
        categoryStats[category].amount += (r.amount || 0);
        categoryStats[category].count += 1;
      });
      
      setMonthlyStats({
        totalEarn,
        totalSpend,
        net: totalEarn - totalSpend,
        earnCount: earnRecords.length,
        spendCount: spendRecords.length,
        categoryStats
      });
    } catch (e: any) {
      console.error('月度统计错误:', e);
    }
  }, [records, selectedMonth]);

  // 生成月份选项
  const monthOptions: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    try {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthOptions.push(date);
    } catch {
      break;
    }
  }

  const changeMonth = (delta: number) => {
    try {
      setSelectedMonth(prev => {
        const newDate = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
        return newDate;
      });
    } catch (e) {
      console.error('切换月份错误:', e);
    }
  };

  if (pageError) {
    return <ErrorFallback error={pageError} onReset={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-6">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 px-4 py-4 bg-gradient-to-r from-orange-400 to-orange-500">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <span className="text-white font-medium">心理货币明细</span>
          <div className="w-16"></div>
        </div>
      </div>

      {/* 余额卡片 */}
      <div className="px-4 py-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-3xl shadow-lg mb-4">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">当前心理货币余额</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-4xl font-bold text-white">
              {loading ? '...' : balance}
            </span>
          </div>
        </div>
        
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">累计获得</p>
            <p className="text-white font-bold text-lg flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +{stats.totalEarn}
            </p>
          </div>
          <div className="w-px bg-white/30"></div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">累计消费</p>
            <p className="text-white font-bold text-lg flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              -{stats.totalSpend}
            </p>
          </div>
        </div>
      </div>

      {/* 视图切换标签 */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-1 flex gap-1 shadow-sm">
          <button
            onClick={() => setViewType('list')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
              viewType === 'list' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            明细列表
          </button>
          <button
            onClick={() => setViewType('bill')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
              viewType === 'bill' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            月度账单
          </button>
        </div>
      </div>

      {/* 账单视图 */}
      {viewType === 'bill' && (
        <div className="px-4 mb-4">
          {/* 月份选择器 */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 font-medium"
              >
                <Calendar className="w-4 h-4" />
                {formatMonth(selectedMonth)}
                <ChevronDown className={`w-4 h-4 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {showMonthPicker && (
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {monthOptions.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMonth(month);
                        setShowMonthPicker(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        getMonthString(month) === getMonthString(selectedMonth)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {month.getMonth() + 1}月
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 月度统计卡片 */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-800">{formatMonth(selectedMonth)}收支概览</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-600 mb-1">收入</p>
                <p className="text-lg font-bold text-green-600">+{monthlyStats.totalEarn}</p>
                <p className="text-xs text-green-500">{monthlyStats.earnCount}笔</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-600 mb-1">支出</p>
                <p className="text-lg font-bold text-red-600">-{monthlyStats.totalSpend}</p>
                <p className="text-xs text-red-500">{monthlyStats.spendCount}笔</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${monthlyStats.net >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <p className={`text-xs mb-1 ${monthlyStats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>结余</p>
                <p className={`text-lg font-bold ${monthlyStats.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {monthlyStats.net >= 0 ? '+' : ''}{monthlyStats.net}
                </p>
                <p className={`text-xs ${monthlyStats.net >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                  {monthlyStats.net >= 0 ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                </p>
              </div>
            </div>

            {/* 分类统计 */}
            {Object.keys(monthlyStats.categoryStats).length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">分类统计</p>
                <div className="space-y-2">
                  {Object.entries(monthlyStats.categoryStats)
                    .sort((a: any, b: any) => b[1].amount - a[1].amount)
                    .map(([category, data]: [string, any]) => (
                      <div key={category} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            data.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {getIconByDescription(category, data.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{category}</p>
                            <p className="text-xs text-gray-400">{data.count}笔</p>
                          </div>
                        </div>
                        <p className={`font-bold ${data.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                          {data.type === 'earn' ? '+' : '-'}{data.amount}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 明细列表视图 */}
      {viewType === 'list' && (
        <div className="px-4 mb-4">
          {/* 日期范围筛选 */}
          <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="w-full flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {dateRange.start && dateRange.end 
                    ? `${dateRange.start} 至 ${dateRange.end}`
                    : '筛选日期范围'
                  }
                </span>
              </div>
              {dateRange.start && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateRange({start: null, end: null});
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </button>
            
            {showDateFilter && (
              <div className="border-t pt-3 mt-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">开始日期</label>
                    <input
                      type="date"
                      value={dateRange.start || ''}
                      onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">结束日期</label>
                    <input
                      type="date"
                      value={dateRange.end || ''}
                      onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 类型筛选标签 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium ${
                activeTab === 'all' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              全部 ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('earn')}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium ${
                activeTab === 'earn' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                积累 ({stats.earnCount})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('spend')}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium ${
                activeTab === 'spend' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4" />
                消费 ({stats.spendCount})
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 记录列表 */}
      <div className="px-4">
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {viewType === 'bill' ? '该月份暂无记录' : '暂无明细记录'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {viewType === 'bill' ? '试试切换其他月份' : '快去完成任务赚取心理货币吧！'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">
                共 {filteredRecords.length} 条记录
              </p>
              {filteredRecords.map((record) => {
                const reason = getRecordReason(record);
                const recordDate = getRecordDate(record);
                const icon = getIconByDescription(reason, record.type);
                const category = getCategoryLabel(reason);
                
                return (
                  <div 
                    key={record.id} 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      record.type === 'earn' 
                        ? 'bg-green-50 text-green-500' 
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(recordDate)}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 truncate">
                        {reason}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${
                        record.type === 'earn' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {record.type === 'earn' ? '+' : '-'}{record.amount}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
