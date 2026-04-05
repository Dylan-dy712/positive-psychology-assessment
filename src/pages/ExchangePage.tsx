import { useNavigate } from 'react-router-dom';
import { getCoinBalance, updateCoinBalance } from '../utils/storage';
import { useState, useEffect } from 'react';
import { Toast } from '../components/Toast';

export const ExchangePage = () => {
  const navigate = useNavigate();
  const [coinBalance, setCoinBalanceState] = useState(0);
  const [products, setProducts] = useState([
    { id: '1', name: '卡套—蓝色', price: 788, stock: 10, image: 'lansekatao.png' },
    { id: '2', name: '卡套—粉色', price: 788, stock: 10, image: 'fensekatao.png' },
    { id: '3', name: '钥匙扣', price: 480, stock: 10, image: 'yaoshikou.png' },
    { id: '4', name: '明信片（一套）', price: 998, stock: 10, image: 'mingxingpian.png' },
    { id: '5', name: '笔记本', price: 1499, stock: 10, image: 'bijiben.png' },
    { id: '6', name: '鼠标垫', price: 998, stock: 10, image: 'shubiaodian.png' }
  ]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // 从localStorage加载数据
    loadData();
  }, []);

  const loadData = () => {
    try {
      // 加载心理货币余额
      const balance = getCoinBalance();
      setCoinBalanceState(balance);

      // 加载产品库存
      const savedProducts = localStorage.getItem('exchange_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const saveProducts = (updatedProducts: any[]) => {
    try {
      localStorage.setItem('exchange_products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('保存产品数据失败:', error);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleExchangeClick = (product: any) => {
    if (product.stock <= 0) {
      showToastMessage('该产品已兑换完，敬请期待后续上新');
      return;
    }
    
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const handleConfirmExchange = () => {
    if (!selectedProduct) return;

    if (coinBalance < selectedProduct.price) {
      showToastMessage('您的心理货币余额不足，请继续积累');
      setShowConfirmModal(false);
      return;
    }

    // 扣除心理货币
    const success = updateCoinBalance(-selectedProduct.price, `兑换商品：${selectedProduct.name}`);
    if (!success) {
      showToastMessage('兑换失败，请稍后重试');
      setShowConfirmModal(false);
      return;
    }

    // 更新本地状态
    setCoinBalanceState(coinBalance - selectedProduct.price);

    // 生成兑换记录
    const exchangeRecord = {
      id: `exchange_${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      price: selectedProduct.price,
      status: '待领取',
      exchangeTime: new Date().toISOString(),
      collectTime: null,
      verificationCode: generateVerificationCode(),
      userId: 'guest_user_001' // 固定用户ID
    };

    // 保存兑换记录
    const exchangeRecords = JSON.parse(localStorage.getItem('exchange_records') || '[]');
    exchangeRecords.push(exchangeRecord);
    localStorage.setItem('exchange_records', JSON.stringify(exchangeRecords));

    // 扣减库存
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);

    // 关闭弹窗并跳转到兑换详情页
    setShowConfirmModal(false);
    navigate(`/exchange/detail/${exchangeRecord.id}`);
  };

  const generateVerificationCode = (): string => {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <div className="page-container pb-24">
      {/* 头部 */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">心理货币兑换站</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-120px)] pt-6">
        <div className="px-4 mb-6">
          <div className="bg-purple-600 rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="./assets/exchange/xinlihuobi.svg" alt="心理货币" className="w-10 h-10" />
              <div>
                <p className="text-white text-sm">我的心理货币</p>
                <p className="text-white text-2xl font-bold">{coinBalance} 枚</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => navigate('/exchange/rule')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium"
              >
                兑换规则
              </button>
              <button 
                onClick={() => navigate('/exchange/record')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium"
              >
                兑换记录
              </button>
            </div>
          </div>
        </div>

        {/* 产品展示区 */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div 
                key={product.id}
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: '#B6D9FC',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div className="mb-3">
                  <img 
                    src={`./assets/exchange/${product.image}`} 
                    alt={product.name} 
                    className="w-full h-36 object-contain"
                  />
                </div>
                <h3 className="text-gray-800 font-bold text-sm mb-2 text-center">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-purple-600 font-bold text-sm">
                    {product.price} 货币
                  </div>
                  <button 
                    onClick={() => handleExchangeClick(product)}
                    disabled={product.stock <= 0}
                    className={`px-4 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium ${
                      product.stock > 0 
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    兑换
                  </button>
                </div>
                {product.stock <= 0 && (
                  <div className="mt-2 text-xs text-red-600 text-center">
                    已售罄
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 确认兑换弹窗 */}
      {showConfirmModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-center mb-4">确认兑换</h3>
            <p className="text-gray-600 text-center mb-6">
              确定要用 {selectedProduct.price} 心理货币兑换 {selectedProduct.name} 吗？
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-gray-500 font-medium hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmExchange}
                className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
