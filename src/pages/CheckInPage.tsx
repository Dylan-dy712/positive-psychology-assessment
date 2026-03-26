import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { getUserData, performCheckIn, isTodayCheckedIn, getAssetPath } from '../utils/user';
import { Toast } from '../components/Toast';

const checkInRewards = [15, 15, 20, 15, 30, 15, 45];

export const CheckInPage = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const hasCheckedIn = isTodayCheckedIn();

  const handleCheckIn = () => {
    if (hasCheckedIn) return;
    
    const result = performCheckIn();
    setToastMessage(`签到成功，获得${result.earned}枚心理货币`);
    setShowToast(true);
  };

  return (
    <div className="page-container">
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      <div className="px-4 pb-6">
        <div className="text-center mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">我的心理货币</p>
                <p className="text-2xl font-bold text-primary">{userData.coinBalance}枚</p>
              </div>
              <img src={getAssetPath('weiqiandao.svg')} alt="签到图标" className="w-10 h-10" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">连续签到天数</p>
                <p className="text-2xl font-bold text-primary">{userData.consecutiveCheckInDays}天</p>
              </div>
              <img src={getAssetPath('pengpeng2.png')} alt="朋朋" className="w-16 h-16" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isChecked = day <= userData.consecutiveCheckInDays;
            const isToday = day === userData.consecutiveCheckInDays + 1 && !hasCheckedIn;
            
            return (
              <div
                key={day}
                className={`rounded-xl p-3 text-center ${
                  isChecked 
                    ? 'bg-[#E0FFF8]' 
                    : 'bg-[#FEF9ED]'
                }`}
              >
                <img
                  src={isChecked ? getAssetPath('yiqiandao.svg') : getAssetPath('weiqiandao.svg')}
                  alt="签到状态"
                  className="w-6 h-6 mx-auto mb-1"
                />
                <p className="text-xs text-gray-600">第{day}天</p>
                <p className="text-xs text-primary font-bold">+{checkInRewards[day - 1]}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          className={`w-full py-4 rounded-full font-bold text-lg ${
            hasCheckedIn
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
        >
          {hasCheckedIn ? '今日已签到' : '立即签到'}
        </button>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
