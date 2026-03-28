import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { useState } from 'react';
import { getAssetPath } from '../utils/user';

const emojiPackages = [
  { id: 1, name: '信心喵辈辈', image: getAssetPath('beibei1.png'), qr: getAssetPath('erweima-1.png') },
  { id: 2, name: '信念狗朋朋', image: getAssetPath('pengpeng1.png'), qr: getAssetPath('erweima-2.png') },
  { id: 3, name: '信心喵辈辈第二弹', image: getAssetPath('beibei2.png'), qr: getAssetPath('erweima-3.png') },
  { id: 4, name: '信念狗朋朋第二弹', image: getAssetPath('pengpeng2.png'), qr: getAssetPath('erweima-4.png') },
  { id: 5, name: '朋朋的反内耗修炼', image: getAssetPath('pengpeng3.png'), qr: getAssetPath('erweima-5.png') },
];

export const EmojiPage = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<typeof emojiPackages[0] | null>(null);

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
        <h1 className="text-xl font-bold text-primary mb-6 text-center">朋辈系列表情包</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        <div className="px-4 pb-6">
          <div className="space-y-4">
            {emojiPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={pkg.image} alt={pkg.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{pkg.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium"
                >
                  获取
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">扫描二维码获取</h3>
              <button onClick={() => setSelectedPackage(null)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <img src={selectedPackage.qr} alt="二维码" className="w-full rounded-lg mb-4" />
            <p className="text-center text-gray-500 text-sm">{selectedPackage.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};
