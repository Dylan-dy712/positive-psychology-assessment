import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHopeBlindBoxes } from '../utils/storage';

export const HopeBlindBoxMemoirsPage = () => {
  const navigate = useNavigate();
  const [blindBoxes, setBlindBoxes] = useState<any[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const boxes = getHopeBlindBoxes();
    // 按日期倒序排序
    boxes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setBlindBoxes(boxes);
  }, []);

  const handleBoxClick = (box: any) => {
    // 只有未完成的任务且是当天的才能进入提交页面
    if (box.status === 'pending') {
      const today = new Date().toISOString().split('T')[0];
      if (box.date === today) {
        // 保存当前盲盒信息到localStorage，供提交页面使用
        localStorage.setItem('current_blind_box', JSON.stringify(box));
        navigate('/mental-save/hope-blind-box/submit');
      } else {
        alert('很遗憾，该盲盒任务已超过当日提交时限，无法继续完成啦，去抽取今日的新盲盒吧～');
      }
    }
  };

  const handlePhotoClick = (e: React.MouseEvent, photo: string) => {
    e.stopPropagation();
    setPreviewPhoto(photo);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-[#FFA203] text-white">
        <button 
          onClick={() => navigate('/mental-save/hope-blind-box')}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </button>
        <h1 className="text-xl font-bold">盲盒回忆录</h1>
        <div className="w-8"></div> {/* 占位，保持标题居中 */}
      </div>

      {/* 记录列表 */}
      <div className="p-4">
        {blindBoxes.length > 0 ? (
          <div className="space-y-4">
            {blindBoxes.map((box: { id: string; date: string; wishType: string; actualType: string; task: string; status: string; photo?: string; completedAt?: string }) => (
              <div 
                key={box.id} 
                className={`bg-[#B6D9FC] p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                  box.status === 'pending' ? 'hover:bg-[#A8CFFF]' : ''
                }`}
                onClick={() => handleBoxClick(box)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 mb-1">{box.task}</p>
                    <p className="text-sm text-gray-600 mb-1">领域：{box.actualType}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      状态：
                      <span className={`ml-1 font-medium ${
                        box.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {box.status === 'completed' ? '已完成' : '未完成'}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {box.status === 'completed' 
                        ? `完成时间：${new Date(box.completedAt!).toLocaleString()}`
                        : `未完成，创建时间：${new Date(box.date).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                  {box.photo && box.status === 'completed' && (
                    <div 
                      className="ml-4 w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => handlePhotoClick(e, box.photo!)}
                    >
                      <img src={box.photo} alt="任务完成" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {box.status === 'pending' && box.date === new Date().toISOString().split('T')[0] && (
                  <div className="mt-2 text-right">
                    <span className="text-sm text-blue-600 font-medium">任务还未完成，点击即可前往提交，当日内完成可领取对应心理货币奖励哦</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-gray-500 text-center">暂无记录，请先去抽盲盒哦~</p>
          </div>
        )}
      </div>

      {/* 图片预览模态框 */}
      {showPreview && previewPhoto && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={previewPhoto} 
              alt="预览" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-black"
              onClick={() => setShowPreview(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};