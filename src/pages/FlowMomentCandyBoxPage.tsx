import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFlowMoments } from '../utils/storage';

export const FlowMomentCandyBoxPage = () => {
  const navigate = useNavigate();
  const [showCandy, setShowCandy] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [showMoment, setShowMoment] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    // 从localStorage获取今日抽取次数
    const today = new Date().toISOString().split('T')[0];
    const storedCount = localStorage.getItem(`candy_draw_count_${today}`);
    if (storedCount) {
      setDrawCount(parseInt(storedCount, 10));
    }
  }, []);

  const handleBoxClick = () => {
    // 检查是否达到每日抽取限制
    if (drawCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    // 增加抽取次数
    const newCount = drawCount + 1;
    setDrawCount(newCount);
    
    // 保存到localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`candy_draw_count_${today}`, newCount.toString());

    // 显示糖果
    setShowCandy(true);
    setShowMoment(false);
    setSelectedMoment(null);
  };

  const handleCandyClick = () => {
    // 获取所有心流时刻记录
    const moments = getFlowMoments();
    if (moments.length === 0) {
      // 没有记录
      setSelectedMoment(null);
      setShowMoment(true);
      return;
    }

    // 随机选择一个记录
    const randomIndex = Math.floor(Math.random() * moments.length);
    const randomMoment = moments[randomIndex];
    setSelectedMoment(randomMoment);
    setShowMoment(true);
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  const handleCloseMoment = () => {
    setShowMoment(false);
    setShowCandy(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/flow-moment')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">糖果盒</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录专注投入的快乐时光，发现你的心流模式</p>
      </div>

      {/* 糖果盒 */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-6">
          <p className="text-gray-700">点击糖果盒抽取糖果</p>
          <p className="text-gray-500 text-sm mt-1">今日剩余次数：{3 - drawCount}/3</p>
          <p className="text-gray-500 text-sm mt-2">点击掉落的糖果查看你的心流时刻记录</p>
        </div>

        <div 
          className="w-48 h-48 bg-pink-100 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={handleBoxClick}
          style={{ 
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
            border: '4px solid #FF69B4'
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600">🍬</div>
            <p className="mt-2 text-pink-600 font-medium">糖果盒</p>
          </div>
        </div>

        {/* 糖果 */}
        {showCandy && (
          <div 
            className="mt-10 cursor-pointer animate-bounce"
            onClick={handleCandyClick}
          >
            <div className="text-6xl">🍭</div>
          </div>
        )}

        {/* 心流时刻记录 */}
        {showMoment && (
          <div className="mt-10 bg-gray-50 p-4 rounded-xl shadow-md w-[90%] max-w-md">
            <h3 className="font-bold text-center mb-3">你的心流时刻</h3>
            {selectedMoment ? (
              <div className="space-y-3">
                <p><strong>日期：</strong>{selectedMoment.date}</p>
                <p><strong>活动：</strong>{selectedMoment.activities.join('、')}</p>
                <p><strong>时长：</strong>{selectedMoment.duration}</p>
                <p><strong>感受：</strong>{selectedMoment.feelings.join('、')}</p>
                <p><strong>触发条件：</strong>{selectedMoment.triggers.join('、')}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">暂无心流时刻记录</p>
            )}
            <button
              onClick={handleCloseMoment}
              className="mt-4 w-full py-2 bg-[#FFA203] text-white rounded-full font-medium"
            >
              关闭
            </button>
          </div>
        )}
      </div>

      {/* 每日限制弹窗 */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">提示</h3>
            <p className="text-center text-gray-700 mb-6">
              今日抽取次数已用完，明日再来哦
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