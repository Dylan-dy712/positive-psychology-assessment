import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMentalFileActive = location.pathname === '/' || location.pathname === '/history';
  const isMentalSaveActive = location.pathname === '/mental-save' || location.pathname.startsWith('/mental-save/');
  const isExchangeActive = location.pathname === '/exchange' || location.pathname.startsWith('/exchange/');
  const isMyActive = location.pathname === '/my' || location.pathname.startsWith('/my/');

  const showBottomNav = 
    isMentalFileActive || 
    isMentalSaveActive || 
    isExchangeActive ||
    isMyActive;

  if (!showBottomNav) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t-2 border-blue-500 shadow-lg z-[100] bg-white"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="flex w-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`flex-1 py-3 sm:py-4 flex flex-col items-center gap-1 transition-colors min-h-[56px] ${
            isMentalFileActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs sm:text-sm font-bold">心灵档案</span>
        </button>
        <button
          onClick={() => navigate('/mental-save')}
          className={`flex-1 py-3 sm:py-4 flex flex-col items-center gap-1 transition-colors min-h-[56px] ${
            isMentalSaveActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <img 
            src={`/assets/${isMentalSaveActive ? 'xlcxxz.svg' : 'xlcxwx.svg'}`} 
            alt="心理储蓄" 
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
          <span className="text-xs sm:text-sm font-bold">心理储蓄</span>
        </button>
        <button
          onClick={() => navigate('/exchange')}
          className={`flex-1 py-3 sm:py-4 flex flex-col items-center gap-1 transition-colors min-h-[56px] ${
            isExchangeActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <img 
            src={`/assets/exchange/${isExchangeActive ? 'duihuanxz.svg' : 'duihuanwx.svg'}`} 
            alt="兑换" 
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
          <span className="text-xs sm:text-sm font-bold">兑换</span>
        </button>
        <button
          onClick={() => navigate('/my')}
          className={`flex-1 py-3 sm:py-4 flex flex-col items-center gap-1 transition-colors min-h-[56px] ${
            isMyActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs sm:text-sm font-bold">我的</span>
        </button>
      </div>
    </div>
  );
};