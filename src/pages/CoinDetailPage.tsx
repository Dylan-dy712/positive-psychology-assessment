import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { getCoinRecords, formatDate } from '../utils/user';

export const CoinDetailPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'earn' | 'spend'>('all');
  const records = getCoinRecords();

  const filteredRecords = tab === 'all' 
    ? records 
    : records.filter(r => r.type === tab);

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
        <h1 className="text-xl font-bold text-primary mb-6 text-center">心理货币明细</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-200px)] pt-6">
        <div className="px-4 pb-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('all')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setTab('earn')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === 'earn' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              积累
            </button>
            <button
              onClick={() => setTab('spend')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === 'spend' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              消费
            </button>
          </div>

          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无明细记录
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${record.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.description}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <p className={`text-lg font-bold ${record.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'earn' ? '+' : '-'}{record.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
