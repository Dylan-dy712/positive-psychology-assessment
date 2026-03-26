import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMentalFileActive = 
    location.pathname === '/' || 
    location.pathname === '/mental-file' ||
    location.pathname === '/assessments' ||
    location.pathname.startsWith('/assessment/') ||
    location.pathname.startsWith('/report/') ||
    location.pathname === '/history';

  const isMyActive = 
    location.pathname === '/my' ||
    location.pathname.startsWith('/my/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="flex">
        <button
          onClick={() => navigate('/history')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isMentalFileActive ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-medium">心灵档案</span>
        </button>
        <button
          onClick={() => navigate('/my')}
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isMyActive ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-medium">我的</span>
        </button>
      </div>
    </div>
  );
};
