import { useNavigate } from 'react-router-dom';

export const GratitudeDiaryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/positive-psychology-assessment/assets/ganenriji.png)' }}>
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-transparent">
        <button 
          onClick={() => navigate('/mental-save')}
          className="flex items-center gap-2 bg-white bg-opacity-80 px-3 py-2 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">返回</span>
        </button>
        <button 
          onClick={() => navigate('/mental-save/gratitude-diary/calendar')}
          className="flex flex-col items-center gap-1 p-2"
        >
          <img src="/positive-psychology-assessment/assets/ganenrili.png" alt="感恩日历" className="w-36 h-36 object-contain drop-shadow-lg" />
          <span className="text-sm font-medium text-white drop-shadow-md">感恩日历</span>
        </button>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-center items-end h-[80vh] pb-10">
        <button
          onClick={() => navigate('/mental-save/gratitude-diary/three-question')}
          className="bg-[#FFA203] text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:bg-[#ff8c00] transition-colors active:scale-[0.98] transform"
          style={{ boxShadow: '0 4px 6px rgba(255, 162, 3, 0.4)' }}
        >
          记录感恩日记
        </button>
      </div>
    </div>
  );
};