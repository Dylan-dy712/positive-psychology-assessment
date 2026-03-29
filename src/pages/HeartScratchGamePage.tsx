import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { updateCoinBalance, updateDailyRewards, getDailyRewards, getCoinBalance } from '../utils/storage';

export const HeartScratchGamePage = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // 监听来自iframe的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'requestCoinBalance') {
        // 发送货币余额给iframe
        const balance = getCoinBalance();
        iframeRef.current?.contentWindow?.postMessage({
          type: 'coinBalance',
          balance: balance
        }, '*');
      } else if (event.data && event.data.type === 'updateCoinBalance') {
        // 更新货币余额
        const newBalance = event.data.balance;
        const reason = event.data.reason || '心晴刮刮卡游戏';
        const currentBalance = getCoinBalance();
        const diff = newBalance - currentBalance;
        
        if (diff !== 0) {
          updateCoinBalance(diff, reason);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 当iframe加载完成后发送初始货币数据
  useEffect(() => {
    if (iframeLoaded && iframeRef.current) {
      const balance = getCoinBalance();
      iframeRef.current.contentWindow?.postMessage({
        type: 'coinBalance',
        balance: balance
      }, '*');
    }
  }, [iframeLoaded]);

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
        <h1 className="text-xl font-bold">心晴刮卡</h1>
        <div className="w-8"></div>
      </div>

      {/* 游戏容器 - 使用iframe嵌入完整游戏 */}
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <iframe
          ref={iframeRef}
          src="/positive-psychology-assessment/xinqingguaka-game.html"
          className="w-full h-full border-0"
          title="心晴刮卡游戏"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </div>
  );
};
