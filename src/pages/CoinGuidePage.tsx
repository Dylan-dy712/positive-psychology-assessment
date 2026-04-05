import { useNavigate } from 'react-router-dom';

export const CoinGuidePage = () => {
  const navigate = useNavigate();

  const guideItems = [
    {
      icon: '🎁',
      title: '初始福利',
      content: '新用户注册即得 500 枚初始心理货币',
      color: 'bg-gradient-to-r from-pink-100 to-rose-100',
      borderColor: 'border-pink-200'
    },
    {
      icon: '📅',
      title: '每日签到',
      subtitle: '连续签到奖励递增',
      content: '第1天：15枚 | 第2天：15枚 | 第3天：20枚\n第4天：15枚 | 第5天：30枚 | 第6天：15枚\n第7天：45枚（最高奖励）\n连续7天后自动开启新一轮签到',
      color: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      borderColor: 'border-blue-200'
    },
    {
      icon: '📝',
      title: '日常记录',
      subtitle: '每日限领1次对应奖励',
      content: '感恩日记：每日首次保存得 15 枚\n心流时刻：每日首次保存得 10 枚',
      color: 'bg-gradient-to-r from-green-100 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      icon: '🎲',
      title: '希望盲盒',
      subtitle: '每日限抽1次',
      content: '抽中许愿类型并完成任务：得 45 枚\n未抽中许愿类型但完成任务：得 15 枚',
      color: 'bg-gradient-to-r from-purple-100 to-violet-100',
      borderColor: 'border-purple-200'
    },
    {
      icon: '🎮',
      title: '心理小游戏',
      subtitle: '每日首次通关奖励',
      content: '焦虑弹窗：首次完成得 5 枚\n夸夸消消乐：首次完成得 5 枚\n心渊猎手：首次通关得 10 枚\n心愈战牌：首次通关得 10 枚\n愈了个愈：首次通关得 10 枚\n心晴刮卡：特等奖15枚、一等奖10枚、二等奖5枚',
      color: 'bg-gradient-to-r from-yellow-100 to-amber-100',
      borderColor: 'border-yellow-200'
    }
  ];

  // 快速链接
  const quickLinks = [
    { name: '每日签到', path: '/my/check-in', color: 'bg-blue-500' },
    { name: '感恩日记', path: '/mental-save/gratitude-diary', color: 'bg-green-500' },
    { name: '心流时刻', path: '/mental-save/flow-moment', color: 'bg-purple-500' },
    { name: '希望盲盒', path: '/mental-save/hope-blind-box', color: 'bg-pink-500' },
    { name: '心理游戏', path: '/mental-save', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-pink-50 to-purple-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg">
        <button 
          onClick={() => navigate('/mental-save')}
          className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-full transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span>💰</span>
          <span>心理货币获取攻略</span>
          <span>✨</span>
        </h1>
        <div className="w-8"></div>
      </div>

      {/* 温馨提示 */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-orange-200">
          <p className="text-center text-gray-700 text-sm">
            <span className="text-2xl mr-2">🌟</span>
            坚持记录美好时刻，收获满满心理货币
            <span className="text-2xl ml-2">🌈</span>
          </p>
        </div>
      </div>

      {/* 快速入口 */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚡</span> 快速入口
        </h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate(link.path)}
              className={`${link.color} text-white text-xs font-medium px-4 py-2 rounded-full shadow-md hover:opacity-90 transition-opacity`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      {/* 攻略内容 */}
      <div className="px-4 py-3 space-y-4">
        {guideItems.map((item, index) => (
          <div 
            key={index}
            className={`${item.color} rounded-2xl p-4 shadow-md border-2 ${item.borderColor} transform hover:scale-[1.01] transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
                {item.subtitle && (
                  <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-3">
              {item.content.split('\n').map((line, i) => (
                <p key={i} className="text-gray-700 text-sm py-1 flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{line}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 底部鼓励语 */}
      <div className="px-4 pb-8 pt-2">
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-gray-700 text-sm mb-2">
            <span className="text-xl">💖</span> 温馨提示 <span className="text-xl">💖</span>
          </p>
          <p className="text-gray-600 text-xs leading-relaxed">
            心理货币是对你积极生活的奖励<br/>
            每天花一点时间关爱自己<br/>
            让心理健康成为生活的常态～
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="text-2xl">🌸</span>
            <span className="text-2xl">💪</span>
            <span className="text-2xl">🌟</span>
            <span className="text-2xl">❤️</span>
            <span className="text-xl">🌸</span>
          </div>
        </div>
      </div>
    </div>
  );
};
