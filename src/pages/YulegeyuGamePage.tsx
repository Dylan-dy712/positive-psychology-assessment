import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { updateCoinBalance, updateDailyRewards, getDailyRewards } from '../utils/storage';

export const YulegeyuGamePage = () => {
  const navigate = useNavigate();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 监听来自iframe的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'yulegeyuCompleted') {
        handleGameComplete();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGameComplete = () => {
    if (gameCompleted) return;
    setGameCompleted(true);
    
    const dailyRewards = getDailyRewards();
    if (!dailyRewards.yulegeyu) {
      updateCoinBalance(10, '完成愈了个愈小游戏');
      updateDailyRewards('yulegeyu', true);
      setShowRewardModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowRewardModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-[#FFA203] text-white">
        <button 
          onClick={() => navigate('/mental-save')}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </button>
        <h1 className="text-xl font-bold">愈了个愈</h1>
        <div className="w-8"></div>
      </div>

      {/* 游戏容器 - 使用iframe嵌入完整游戏 */}
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <iframe
          ref={iframeRef}
          src="/positive-psychology-assessment/yulegeyu-game.html"
          className="w-full h-full border-0"
          title="愈了个愈游戏"
        />
      </div>

      {/* 奖励弹窗 */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">游戏完成</h3>
            <p className="text-center text-gray-700 mb-6">
              恭喜你通关！获得10个心理货币奖励
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-[#FFA203] text-white rounded-full font-medium"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
