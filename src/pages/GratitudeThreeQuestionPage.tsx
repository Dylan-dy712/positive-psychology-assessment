import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { saveGratitudeDiary, updateDailyRewards, getDailyRewards, updateCoinBalance } from '../utils/storage';

export const GratitudeThreeQuestionPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handleInputChange = (question: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value
    }));
  };

  const handleSave = () => {
    // 检查所有问题是否都已回答
    if (Object.values(answers).some((answer: string) => answer.trim() === '')) {
      alert('请回答所有问题');
      return;
    }

    // 保存感恩日记
    const diary = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'three-question' as const,
      content: answers,
    };

    saveGratitudeDiary(diary);

    // 检查是否是今天第一次保存
    const dailyRewards = getDailyRewards();
    if (!dailyRewards.gratitudeDiary) {
      // 发放15个心理货币
      updateCoinBalance(15, '每日首次保存感恩日记');
      updateDailyRewards('gratitudeDiary', true);
      setShowRewardModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowRewardModal(false);
    navigate('/mental-save/gratitude-diary');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/gratitude-diary')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">感恩日记</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录每天值得感恩的事物，培养积极心态</p>
      </div>

      {/* 切换按钮 */}
      <div className="flex border-b border-gray-200">
        <button 
          className="flex-1 py-3 text-center font-medium text-[#FFA203] border-b-2 border-[#FFA203]"
        >
          感恩三问
        </button>
        <button 
          onClick={() => navigate('/mental-save/gratitude-diary/free-record')}
          className="flex-1 py-3 text-center font-medium text-gray-500"
        >
          自由记录
        </button>
      </div>

      {/* 问题表单 */}
      <div className="p-5 space-y-5">
        <div>
          <p className="font-medium mb-2">1. 今天，我感谢的人是？</p>
          <input
            type="text"
            value={answers.q1}
            onChange={(e) => handleInputChange('q1', e.target.value)}
            placeholder="请输入"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
        
        <div>
          <p className="font-medium mb-2">2. 因为？</p>
          <input
            type="text"
            value={answers.q2}
            onChange={(e) => handleInputChange('q2', e.target.value)}
            placeholder="请输入"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
        
        <div>
          <p className="font-medium mb-2">3. 今天，我感恩的一件事是？</p>
          <input
            type="text"
            value={answers.q3}
            onChange={(e) => handleInputChange('q3', e.target.value)}
            placeholder="请输入"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
        
        <div>
          <p className="font-medium mb-2">4. 它让我感到？</p>
          <input
            type="text"
            value={answers.q4}
            onChange={(e) => handleInputChange('q4', e.target.value)}
            placeholder="请输入"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
        
        <div>
          <p className="font-medium mb-2">5. 今天，一个让我感到温暖/幸运的瞬间是？</p>
          <input
            type="text"
            value={answers.q5}
            onChange={(e) => handleInputChange('q5', e.target.value)}
            placeholder="请输入"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="p-5">
        <button
          onClick={handleSave}
          className="w-full bg-[#FFA203] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#ff8c00] transition-colors active:scale-[0.98] transform"
        >
          保存感恩日记
        </button>
      </div>

      {/* 成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">保存成功</h3>
            <p className="text-center text-gray-700 mb-6">
              感恩日记保存成功
            </p>
            <button
              onClick={handleCloseModals}
              className="w-full py-3 bg-[#FFA203] text-white rounded-full font-medium"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 奖励弹窗 */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">保存成功</h3>
            <p className="text-center text-gray-700 mb-6">
              感恩日记保存成功！获得15个心理货币奖励
            </p>
            <button
              onClick={handleCloseModals}
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