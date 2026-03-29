import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const HopeBlindBoxWishPage = () => {
  const navigate = useNavigate();
  const [wishType, setWishType] = useState('');

  const blindBoxTypes = [
    '微光学业',
    '元气身体',
    '心灵奇旅',
    '温暖连接',
    '日常探险',
    '奇思妙想',
  ];

  const handleWish = () => {
    if (!wishType) {
      alert('请选择盲盒类型');
      return;
    }
    
    // 保存用户的许愿类型到localStorage
    localStorage.setItem('blind_box_wish_type', wishType);
    navigate('/mental-save/hope-blind-box/draw');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-[90%] max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-center mb-6">请许愿你想要的盲盒类型</h2>
        
        <div className="mb-6">
          <select
            value={wishType}
            onChange={(e) => setWishType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          >
            <option value="">请选择</option>
            {blindBoxTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleWish}
          className="w-full bg-[#FFA203] text-white py-3 rounded-full font-bold hover:bg-[#ff8c00] transition-colors"
        >
          许愿
        </button>
      </div>
    </div>
  );
};