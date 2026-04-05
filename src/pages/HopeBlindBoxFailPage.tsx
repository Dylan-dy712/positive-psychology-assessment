import { useNavigate } from 'react-router-dom';

export const HopeBlindBoxFailPage = () => {
  const navigate = useNavigate();
  const currentBlindBox = JSON.parse(localStorage.getItem('current_blind_box') || '{}');

  const handleGoComplete = () => {
    navigate('/mental-save/hope-blind-box/submit');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4">别灰心，明天继续！你的专属「希望盲盒」已成功开启！✨</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2"><strong>【任务领域】：</strong>{currentBlindBox.actualType}</p>
          <div className="bg-[#FFA203] text-white p-3 rounded-lg">
            <p><strong>【行动指南】：</strong>{currentBlindBox.task}</p>
          </div>
        </div>
        
        <p className="text-red-600 font-bold text-center mb-6">完成后可以获得15个心理货币</p>
        
        <button
          onClick={handleGoComplete}
          className="w-full bg-[#FFA203] text-white py-3 rounded-full font-bold hover:bg-[#ff8c00] transition-colors"
        >
          去完成
        </button>
      </div>
    </div>
  );
};