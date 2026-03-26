import { useNavigate } from 'react-router-dom';
import { getUserData, getAssetPath } from '../utils/user';
import { Toast } from '../components/Toast';
import { useState } from 'react';

export const MyPage = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="page-container pb-24">
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
        <h1 className="text-xl font-bold text-primary text-center">个人中心</h1>
      </div>

      <div className="px-4 py-6 text-center">
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

      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={getAssetPath('xinlihuobi.svg')} alt="心理货币" className="w-8 h-8" />
            <div>
              <p className="text-gray-500 text-sm">我的心理货币</p>
              <p className="text-2xl font-bold text-primary">{userData.coinBalance}枚</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/my/coin-detail')}
            className="text-primary text-sm font-medium"
          >
            明细
          </button>
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
            《心智小程序用户服务协议》
          </span>
          <span
            onClick={() => navigate('/agreement/privacy')}
            className="text-primary font-medium mx-1 cursor-pointer"
          >
            《心智小程序隐私保护政策》
          </span>
        </p>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
