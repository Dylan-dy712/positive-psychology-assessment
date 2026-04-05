import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../utils/user';

export const LaunchPage = () => {
  const navigate = useNavigate();
  const [showModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 直接进入首页，跳过登录注册
      navigate('/');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleAgree = () => {
    localStorage.setItem('has_agreed_to_terms', 'true');
    // 同意协议后直接进入首页
    navigate('/');
  };

  const handleDisagree = () => {
    // 不同意协议，可以关闭应用或显示提示
    alert('您需要同意服务协议和隐私政策才能使用本应用');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <img src={getAssetPath('startPage.png')} alt="启动页" className="w-full h-full object-cover" />
      
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">欢迎使用心智！</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              心智非常重视用户的隐私和个人信息保护。在您使用心智前，请认真阅读并同意
              <span
                onClick={() => navigate('/agreement/service')}
                className="text-primary font-medium mx-1 cursor-pointer"
              >
                《心智用户服务协议》
              </span>
              和
              <span
                onClick={() => navigate('/agreement/privacy')}
                className="text-primary font-medium mx-1 cursor-pointer"
              >
                《心智隐私保护政策》
              </span>
              ，点击"同意"按钮代表您同意前述协议。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDisagree}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-gray-500 font-medium hover:bg-gray-50"
              >
                不同意
              </button>
              <button
                onClick={handleAgree}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark"
              >
                同意
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
