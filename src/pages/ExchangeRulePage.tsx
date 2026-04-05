import { useNavigate } from 'react-router-dom';

export const ExchangeRulePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container pb-24">
      {/* 头部 */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary flex-1">兑换规则</h1>
        </div>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6 px-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">一、兑换流程</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">1.</span>
                <span>在兑换站选择您喜欢的奖励，点击 "兑换"。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">2.</span>
                <span>系统会弹出确认弹窗，告知所需心理货币数量。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">3.</span>
                <span>确认后，系统将自动扣除相应货币，并发放奖励。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">4.</span>
                <span>兑换详情页面会生成兑换码二维码，请妥善保管。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">5.</span>
                <span>凭兑换码到易班工作站核销兑换码，兑换对应奖励。</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">二、兑换限制</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">•</span>
                <span>每位用户每日兑换次数不限，但需确保心理货币余额充足。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">•</span>
                <span>奖励兑换后，心理货币不予退还。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">•</span>
                <span>产品库存有限，兑完即止。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-6 text-blue-600 font-bold">•</span>
                <span>兑换码仅限本人使用，禁止转售、倒卖，一经发现将取消兑换资格。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
