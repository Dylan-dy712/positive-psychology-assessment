import { useNavigate } from 'react-router-dom';
import { getCoinBalance } from '../utils/storage';

export const MentalSavePage = () => {
  const navigate = useNavigate();
  const coinBalance = getCoinBalance();

  return (
    <div className="page-container pb-24">
      {/* 头部标题 */}
      <div className="sticky top-0 z-10 px-4 py-4">
        <h1 className="text-xl font-bold text-primary text-center">心理储蓄</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6">
        {/* 顶部欢迎语 */}
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex-1">
            <h2 className="text-blue-600 text-lg font-bold mb-1">欢迎来到心理银行!</h2>
            <p className="text-gray-600 text-sm">通过日常积极心理练习积累心理货币，提升心理健康水平</p>
          </div>
          <img src="./assets/pengpengbeibei.png" alt="PengPengBeiBei" className="w-24 h-24 object-contain flex-shrink-0" />
        </div>

        {/* 心理货币余额区 */}
        <div className="px-4 mb-6">
          <div className="p-5 bg-[#6B55FF] rounded-xl shadow-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <img src="./assets/xinlihuobi.svg" alt="心理货币" className="w-6 h-6" />
                <span className="font-bold text-white text-sm">我的心理货币</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">{coinBalance} 枚</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/mental-save/coin-guide')}
                    className="px-3 py-1.5 bg-white text-[#6B55FF] rounded-full text-xs font-medium"
                  >
                    获取攻略
                  </button>
                  <button 
                    onClick={() => navigate('/my/coin-detail')}
                    className="px-3 py-1.5 bg-white text-[#6B55FF] rounded-full text-xs font-medium"
                  >
                    明细
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 每日活动板块 */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">每日活动</h2>
          <div className="bg-[#D1EAFF] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/mental-save/gratitude-diary')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/rijitb.png" alt="感恩日记" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">感恩日记</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/flow-moment')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/xltb.png" alt="心流时刻" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">心流时刻</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/hope-blind-box')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/xwmhtb.png" alt="希望盲盒" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">希望盲盒</span>
              </button>
            </div>
          </div>
        </div>

        {/* 小游戏板块 */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">小游戏</h2>
          <div className="bg-[#FEFFDE] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/mental-save/games/anxiety-popup')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/jltc.png" alt="焦虑弹窗" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">焦虑弹窗</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/games/kuakua')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/kkxxl.png" alt="夸夸消消乐" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">夸夸消消乐</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/games/heart-hunter')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/xyls.png" alt="心渊猎手" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">心渊猎手</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/games/heart-cards')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/xyzp.png" alt="心愈战牌" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">心愈战牌</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/games/yulegeyu')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/ylgy.png" alt="愈了个愈" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">愈了个愈</span>
              </button>
              <button 
                onClick={() => navigate('/mental-save/games/heart-scratch')}
                className="flex flex-col items-center gap-2"
              >
                <img src="./assets/xqgk.png" alt="心晴刮卡" className="w-14 h-14 object-contain" />
                <span className="text-xs font-medium text-gray-800">心晴刮卡</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
