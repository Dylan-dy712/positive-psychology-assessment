import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { saveGratitudeDiary, updateDailyRewards, getDailyRewards, updateCoinBalance } from '../utils/storage';

export const GratitudeFreeRecordPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

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

  const handleSave = () => {
    // 检查内容是否为空
    if (content.trim() === '') {
      alert('请输入内容');
      return;
    }

    // 保存感恩日记
    const diary = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'free-record' as const,
      content: content,
      photo: photo || undefined,
    };

    saveGratitudeDiary(diary);

    // 检查是否是今天第一次保存
    const dailyRewards = getDailyRewards();
    if (!dailyRewards.gratitudeDiary) {
      // 发放15个心理货币
      updateCoinBalance(15, '每日首次保存感恩日记');
      updateDailyRewards('gratitudeDiary', true);
      setShowRewardModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowRewardModal(false);
    navigate('/mental-save/gratitude-diary');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/gratitude-diary')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">感恩日记</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录每天值得感恩的事物，培养积极心态</p>
      </div>

      {/* 切换按钮 */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => navigate('/mental-save/gratitude-diary/three-question')}
          className="flex-1 py-3 text-center font-medium text-gray-500"
        >
          感恩三问
        </button>
        <button 
          className="flex-1 py-3 text-center font-medium text-[#FFA203] border-b-2 border-[#FFA203]"
        >
          自由记录
        </button>
      </div>

      {/* 问题表单 */}
      <div className="p-5 space-y-5">
        <div>
          <p className="font-medium mb-2">今天有什么想要感恩的事？可以是大事，也可以是小事</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入"
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>
        
        {/* 照片上传 */}
        <div>
          <p className="font-medium mb-2">上传照片（可选）</p>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFA203] transition-colors w-full">
              <img src="/positive-psychology-assessment/assets/schtp.svg" alt="上传" className="w-full max-w-md h-48 object-contain" />
              <span className="text-gray-600 text-lg font-medium">点击上传照片</span>
            </label>
            {photo && (
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <img src={photo} alt="预览" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        {/* 备注 */}
        <div className="text-sm text-gray-500 p-3 bg-yellow-50 rounded-lg">
          注：每保存一次感恩日记可获得15个“心理货币”，每日限定领一次。
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="p-5">
        <button
          onClick={handleSave}
          className="w-full bg-[#FFA203] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#ff8c00] transition-colors active:scale-[0.98] transform"
        >
          保存感恩日记
        </button>
      </div>

      {/* 成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">保存成功</h3>
            <p className="text-center text-gray-700 mb-6">
              感恩日记保存成功
            </p>
            <button
              onClick={handleCloseModals}
              className="w-full py-3 bg-[#FFA203] text-white rounded-full font-medium"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 奖励弹窗 */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">保存成功</h3>
            <p className="text-center text-gray-700 mb-6">
              感恩日记保存成功！获得15个心理货币奖励
            </p>
            <button
              onClick={handleCloseModals}
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