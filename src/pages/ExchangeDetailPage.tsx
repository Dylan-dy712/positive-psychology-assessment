import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toast } from '../components/Toast';

export const ExchangeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecord();
    }
  }, [id]);

  useEffect(() => {
    if (record && record.verificationCode) {
      generateQRCode();
    }
  }, [record]);

  const loadRecord = () => {
    try {
      const exchangeRecords = JSON.parse(localStorage.getItem('exchange_records') || '[]');
      const foundRecord = exchangeRecords.find((r: any) => r.id === id);
      if (foundRecord) {
        setRecord(foundRecord);
      } else {
        showToastMessage('兑换记录不存在');
        navigate('/exchange/record');
      }
    } catch (error) {
      console.error('加载兑换记录失败:', error);
      showToastMessage('加载失败');
      navigate('/exchange/record');
    }
  };

  const generateQRCode = () => {
    if (!record || !record.verificationCode) return;
    
    // 使用在线API生成二维码
    const code = record.verificationCode;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`;
    setQrCodeUrl(url);
  };

  const handleVerification = () => {
    if (!record) return;

    // 模拟核销操作
    const exchangeRecords = JSON.parse(localStorage.getItem('exchange_records') || '[]');
    const updatedRecords = exchangeRecords.map((r: any) => 
      r.id === record.id 
        ? { ...r, status: '已领取', collectTime: new Date().toISOString() }
        : r
    );
    localStorage.setItem('exchange_records', JSON.stringify(updatedRecords));
    
    setRecord({ ...record, status: '已领取', collectTime: new Date().toISOString() });
    showToastMessage('核销成功');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
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

  if (!record) {
    return (
      <div className="page-container">
        {/* 头部 */}
        <div className="pt-12 pb-6 px-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-primary flex-1">兑换详情</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-24">
      {/* 头部 */}
      <div className="pt-12 pb-6 px-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-primary flex-1">兑换详情</h1>
        </div>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6 px-6">
        {/* 产品信息区 */}
        <div 
          className="rounded-xl p-4 mb-6"
          style={{ 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">产品信息</h2>
          <div className="flex gap-4">
            <div className="w-28 h-28 flex items-center justify-center flex-shrink-0">
              <img 
                src={`/assets/exchange/${record.productImage}`} 
                alt={record.productName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-bold text-sm mb-2">{record.productName}</h3>
              <p className="text-blue-600 font-bold text-sm">
                消耗心理货币：{record.price}
              </p>
            </div>
          </div>
        </div>

        {/* 兑换码核销区 */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">兑换码</h2>
          <p className="text-gray-600 text-center mb-4">
            请将此二维码展示给易班工作站领取礼品
          </p>
          <div className="flex justify-center mb-4">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="核销二维码" 
                className={`w-48 h-48 object-contain ${
                  record.status === '已领取' ? 'opacity-50' : ''
                }`}
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">生成中...</p>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-center">
            核销码：{record.verificationCode}
          </p>
          
          {record.status === '待领取' && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleVerification}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                确认核销
              </button>
            </div>
          )}
        </div>

        {/* 兑换信息 */}
        <div 
          className="rounded-xl p-4"
          style={{ 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">兑换信息</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">兑换时间：</span>
              <span className="text-gray-800 text-sm">{formatDate(record.exchangeTime)}</span>
            </div>
            {record.collectTime && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">领取时间：</span>
                <span className="text-gray-800 text-sm">{formatDate(record.collectTime)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">状态：</span>
              <span className={`text-sm ${record.status === '待领取' ? 'text-orange-600' : 'text-green-600'}`}>
                {record.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
