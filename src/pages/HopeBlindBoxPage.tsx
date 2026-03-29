import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const HopeBlindBoxPage = () => {
  const navigate = useNavigate();
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    // 检查今天是否已经抽取过盲盒
    const today = new Date().toISOString().split('T')[0];
    const lastDrawDate = localStorage.getItem('last_blind_box_draw_date');
    setHasDrawnToday(lastDrawDate === today);
  }, []);

  const handleOpenBox = () => {
    if (hasDrawnToday) {
      setShowLimitModal(true);
    } else {
      navigate('/mental-save/hope-blind-box/wish');
    }
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/positive-psychology-assessment/assets/xiwangmanghe.png)' }}>
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-transparent">
        <button 
          onClick={() => navigate('/mental-save')}
          className="flex items-center gap-2 bg-white bg-opacity-80 px-3 py-2 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">返回</span>
        </button>
        <button 
          onClick={() => navigate('/mental-save/hope-blind-box/memoirs')}
          className="flex flex-col items-center gap-1 p-2"
        >
          <img src="/positive-psychology-assessment/assets/mhhyl.png" alt="盲盒回忆录" className="w-12 h-12 object-contain drop-shadow-lg" />
          <span className="text-sm font-medium text-white drop-shadow-md">盲盒回忆录</span>
        </button>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-center items-end h-[80vh] pb-10">
        <button
          onClick={handleOpenBox}
          className="bg-[#FFA203] text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:bg-[#ff8c00] transition-colors active:scale-[0.98] transform"
          style={{ boxShadow: '0 4px 6px rgba(255, 162, 3, 0.4)' }}
        >
          开启今日盲盒
        </button>
      </div>

      {/* 每日限制弹窗 */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">提示</h3>
            <p className="text-center text-gray-700 mb-6">
              今天已经开启过希望盲盒了，明日再来哦
            </p>
            <button
              onClick={handleCloseLimitModal}
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