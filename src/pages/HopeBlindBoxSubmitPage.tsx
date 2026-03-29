import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { saveHopeBlindBox, updateCoinBalance } from '../utils/storage';

export const HopeBlindBoxSubmitPage = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const currentBlindBox = JSON.parse(localStorage.getItem('current_blind_box') || '{}');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteTask = () => {
    if (!photo) {
      alert('请上传照片');
      return;
    }

    // 更新盲盒记录状态
    const updatedBlindBox = {
      ...currentBlindBox,
      status: 'completed' as const,
      photo,
      completedAt: new Date().toISOString(),
    };

    saveHopeBlindBox(updatedBlindBox);

    // 发放心理货币
    const amount = currentBlindBox.wishType === currentBlindBox.actualType ? 45 : 15;
    updateCoinBalance(amount, `完成希望盲盒任务：${currentBlindBox.actualType}`);
    setRewardAmount(amount);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/mental-save/hope-blind-box');
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/mental-save/hope-blind-box')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回</span>
          </button>
          <h1 className="text-xl font-bold">提交任务</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>

        {/* 任务信息 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-medium mb-2">任务：{currentBlindBox.task}</p>
          <p className="text-sm text-gray-500">请上传完成任务的照片</p>
        </div>

        {/* 照片上传 */}
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFA203] transition-colors h-96">
            {photo ? (
              <img src={photo} alt="任务完成" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center flex flex-col items-center justify-center h-full">
                <img src="/positive-psychology-assessment/assets/schtp.svg" alt="上传" className="w-32 h-32 mb-6" />
                <p className="text-gray-600 text-lg font-medium">点击上传照片</p>
              </div>
            )}
          </label>
        </div>

        {/* 完成按钮 */}
        <button
          onClick={handleCompleteTask}
          className="w-full bg-[#FFA203] text-white py-3 rounded-full font-bold hover:bg-[#ff8c00] transition-colors"
        >
          完成任务
        </button>
      </div>

      {/* 成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">任务完成</h3>
            <p className="text-center text-gray-700 mb-6">
              盲盒任务成功完成！获得{rewardAmount}个心理货币奖励
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-[#FFA203] text-white rounded-full font-medium"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};