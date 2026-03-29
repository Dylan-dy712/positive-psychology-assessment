import { useNavigate } from 'react-router-dom';
import { getUserData, getAssetPath } from '../utils/user';
import { getCoinBalance } from '../utils/storage';
import { Toast } from '../components/Toast';
import { useState } from 'react';

export const MyPage = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const coinBalance = getCoinBalance();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="page-container pb-24">
      <div className="sticky top-0 z-10 px-4 py-4">
        <h1 className="text-xl font-bold text-primary text-center">个人中心</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6">
        <div className="px-4 pb-6 text-center">
          <img
            src={userData.avatar}
            alt="头像"
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
          <h2 className="text-lg font-bold text-gray-800">{userData.nickname}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {userData.gender === 'male' ? '男' : userData.gender === 'female' ? '女' : '未选择'}
          </p>
        </div>

        {/* 心理货币余额区 */}
        <div className="px-4 mb-6">
          <div className="p-6 bg-[#6B55FF] rounded-xl shadow-md">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="/positive-psychology-assessment/assets/xinlihuobi.svg" alt="心理货币" className="w-8 h-8" />
                  <span className="font-bold text-white">我的心理货币</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-white">{coinBalance} 枚</div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => navigate('/mental-save/coin-guide')}
                    className="px-4 py-1 bg-white text-[#6B55FF] rounded-full text-sm font-medium"
                  >
                    获取攻略
                  </button>
                  <button 
                    onClick={() => navigate('/my/coin-detail')}
                    className="px-4 py-1 bg-white text-[#6B55FF] rounded-full text-sm font-medium"
                  >
                    明细
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/my/account')}
              className="flex flex-col items-center gap-2"
            >
              <img src={getAssetPath('zhanghaoxinxi.svg')} alt="账号信息" className="w-10 h-10" />
              <span className="text-xs text-gray-600">账号信息</span>
            </button>
            <button
              onClick={() => navigate('/my/check-in')}
              className="flex flex-col items-center gap-2"
            >
              <img src={getAssetPath('meiriqiandao.svg')} alt="每日签到" className="w-10 h-10" />
              <span className="text-xs text-gray-600">每日签到</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex flex-col items-center gap-2"
            >
              <img src={getAssetPath('cepingjilu.svg')} alt="测评记录" className="w-10 h-10" />
              <span className="text-xs text-gray-600">测评记录</span>
            </button>
            <button
              onClick={() => showToastMessage('该功能正在开发')}
              className="flex flex-col items-center gap-2"
            >
              <img src={getAssetPath('AIhuoban.svg')} alt="AI伙伴" className="w-10 h-10" />
              <span className="text-xs text-gray-600">AI伙伴</span>
            </button>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => showToastMessage('推荐给朋友功能正在开发')}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100"
            >
              <span className="text-gray-800">推荐给朋友</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/my/emoji')}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100"
            >
              <span className="text-gray-800">朋辈系列表情包</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/my/service')}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100"
            >
              <span className="text-gray-800">在线客服</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/my/feedback')}
              className="w-full px-4 py-4 flex items-center justify-between"
            >
              <span className="text-gray-800">帮助与反馈</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 pb-6 text-center">
          <p className="text-xs text-gray-500">
            <span
              onClick={() => navigate('/agreement/service')}
              className="text-primary font-medium mx-1 cursor-pointer"
            >
              《心智用户服务协议》
            </span>
            <span
              onClick={() => navigate('/agreement/privacy')}
              className="text-primary font-medium mx-1 cursor-pointer"
            >
              《心智隐私保护政策》
            </span>
          </p>
        </div>

        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
};
