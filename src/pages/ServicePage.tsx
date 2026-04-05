import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="sticky top-0 z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      <div className="px-4 pb-6">
        <h1 className="text-xl font-bold text-primary mb-6 text-center">在线客服</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        <div className="px-4 pb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <img src="/assets/AIhuoban.svg" alt="AI伙伴" className="w-16 h-16" />
            </div>
            <p className="text-gray-800 font-medium mb-2">AI伙伴</p>
            <p className="text-gray-500 text-sm mb-6">该功能正在开发中</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
              <p className="mb-2">您可以通过以下方式联系我们：</p>
              <p>发送邮件至：</p>
              <p className="text-primary font-medium mt-1">xinzhixinxiang525@126.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
