import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet, TrendingUp, TrendingDown, Gift, Gamepad2, Calendar, ShoppingBag, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getCoinRecords, getCoinBalance } from '../utils/storage';

// 定义 CoinRecord 类型
interface CoinRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  createdAt: string;
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 如果是昨天
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 其他日期
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 根据描述获取图标
const getIconByDescription = (description: string, type: 'earn' | 'spend') => {
  if (description.includes('签到')) return <Calendar className="w-5 h-5" />;
  if (description.includes('游戏') || description.includes('心愈') || description.includes('心晴') || description.includes('愈了') || description.includes('心渊')) 
    return <Gamepad2 className="w-5 h-5" />;
  if (description.includes('注册') || description.includes('福利') || description.includes('奖励')) 
    return <Gift className="w-5 h-5" />;
  if (description.includes('购买') || description.includes('消费') || description.includes('兑换')) 
    return <ShoppingBag className="w-5 h-5" />;
  if (description.includes('刮卡') || description.includes('抽奖')) 
    return <Star className="w-5 h-5" />;
  return type === 'earn' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;
};

// 获取分类标签
const getCategoryLabel = (description: string, type: 'earn' | 'spend'): string => {
  if (description.includes('签到')) return '每日签到';
  if (description.includes('游戏') || description.includes('心愈') || description.includes('心晴') || description.includes('愈了') || description.includes('心渊')) 
    return '心理游戏';
  if (description.includes('注册') || description.includes('初始')) return '新用户福利';
  if (description.includes('刮卡') || description.includes('抽奖')) return '刮卡奖励';
  if (description.includes('购买') || description.includes('消费')) return '商城消费';
  if (description.includes('盲盒')) return '盲盒抽奖';
  if (type === 'earn') return '任务奖励';
  return '其他消费';
};

export const CoinDetailPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'earn' | 'spend'>('all');
  const records = getCoinRecords() as CoinRecord[];
  const currentBalance = getCoinBalance();

  const filteredRecords = tab === 'all' 
    ? records 
    : records.filter(r => r.type === tab);

  // 统计数据
  const stats = useMemo(() => {
    const earnRecords = records.filter(r => r.type === 'earn');
    const spendRecords = records.filter(r => r.type === 'spend');
    const totalEarn = earnRecords.reduce((sum, r) => sum + r.amount, 0);
    const totalSpend = spendRecords.reduce((sum, r) => sum + r.amount, 0);
    return { totalEarn, totalSpend, earnCount: earnRecords.length, spendCount: spendRecords.length };
  }, [records]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5E6] to-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 px-4 py-4 bg-gradient-to-r from-[#FFA203] to-[#FF8C00]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      {/* 余额卡片 */}
      <div className="px-4 py-6 bg-gradient-to-r from-[#FFA203] to-[#FF8C00] rounded-b-[24px] shadow-lg">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">当前心理货币余额</p>
          <div className="flex items-center justify-center gap-2">
            <Wallet className="w-8 h-8 text-white" />
            <span className="text-4xl font-bold text-white">{currentBalance}</span>
          </div>
        </div>
        
        {/* 统计 */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">累计获得</p>
            <p className="text-white font-bold text-lg">+{stats.totalEarn}</p>
          </div>
          <div className="w-px bg-white/30"></div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">累计消费</p>
            <p className="text-white font-bold text-lg">-{stats.totalSpend}</p>
          </div>
        </div>
      </div>

      {/* 白色内容区域 */}
      <div className="px-4 py-6">
        <h1 className="text-lg font-bold text-gray-800 mb-4">收支明细</h1>
        
        {/* 标签切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('all')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'all' 
                ? 'bg-[#FFA203] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            全部 ({records.length})
          </button>
          <button
            onClick={() => setTab('earn')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'earn' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            积累 ({stats.earnCount})
          </button>
          <button
            onClick={() => setTab('spend')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'spend' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            消费 ({stats.spendCount})
          </button>
        </div>

        {/* 明细列表 */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">暂无明细记录</p>
              <p className="text-gray-400 text-sm mt-1">快去完成任务赚取心理货币吧！</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const icon = getIconByDescription(record.reason, record.type);
              const category = getCategoryLabel(record.reason, record.type);
              
              return (
                <div 
                  key={record.id} 
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  {/* 图标 */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    record.type === 'earn' 
                      ? 'bg-green-50 text-green-500' 
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {icon}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 truncate">
                      {record.reason}
                    </p>
                  </div>
                  
                  {/* 金额 */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${
                      record.type === 'earn' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {record.type === 'earn' ? '+' : '-'}{record.amount}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
