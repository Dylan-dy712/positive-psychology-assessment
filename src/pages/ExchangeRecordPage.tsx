import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const ExchangeRecordPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    try {
      const exchangeRecords = JSON.parse(localStorage.getItem('exchange_records') || '[]');
      // 按兑换时间倒序排列
      exchangeRecords.sort((a: any, b: any) => 
        new Date(b.exchangeTime).getTime() - new Date(a.exchangeTime).getTime()
      );
      setRecords(exchangeRecords);
    } catch (error) {
      console.error('加载兑换记录失败:', error);
      setRecords([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container pb-24">
      {/* 头部 */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary flex-1">兑换记录</h1>
        </div>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-center">
              暂无兑换记录，快去兑换心仪的礼品吧~
            </p>
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {records.map(record => (
              <div 
                key={record.id}
                className="rounded-xl p-4"
                style={{ 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
                }}
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={`/assets/exchange/${record.productImage}`} 
                      alt={record.productName} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-bold text-sm mb-2">{record.productName}</h3>
                    <p className="text-gray-500 text-xs mb-2">
                      消耗：{record.price} 心理货币
                    </p>
                    <p className="text-gray-500 text-xs mb-2">
                      状态：
                      <span className={`ml-1 ${record.status === '待领取' ? 'text-orange-600' : 'text-green-600'}`}>
                        {record.status}
                      </span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      {record.status === '待领取' ? '兑换时间' : '领取时间'}：
                      {formatDate(record.status === '待领取' ? record.exchangeTime : record.collectTime || record.exchangeTime)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => navigate(`/exchange/detail/${record.id}`)}
                    className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    查看兑换详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
