import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getFeedbackRecords, addFeedbackRecord, formatDate } from '../utils/user';
import { Toast } from '../components/Toast';

const faqs = [
  {
    question: '如何获取心理货币？',
    answer: (
      <>
        <p>您可以通过以下方式获取心理货币：</p>
        <p className="mt-1">·每日签到</p>
        <p>·完成感恩日记、心流时刻、希望盲盒等活动</p>
        <p>·参与心理测评</p>
        <p>·邀请好友注册</p>
      </>
    ),
  },
  {
    question: '心理测评结果准确吗？',
    answer: (
      <>
        <p>我们使用的所有心理测评量表都是经过科学验证的标准化量表，具有较好的信度和效度。但需要注意的是：</p>
        <p className="mt-1">·测评结果仅供参考，不能替代专业心理咨询</p>
        <p>·测评结果受您当前情绪状态和环境影响</p>
        <p>·建议定期测评以跟踪心理状态变化</p>
      </>
    ),
  },
  {
    question: '如何修改个人信息？',
    answer: (
      <p>您可以在"我的"页面点击"账号信息"进入个人信息管理页面，修改昵称、头像、年龄、性别等信息。</p>
    ),
  },
  {
    question: '心智信箱的回复周期是多久？',
    answer: (
      <p>我们会在收到邮件后2-3工作日内进行回复，回复将直接发送至您投稿时使用的邮箱。</p>
    ),
  },
  {
    question: '如何联系人工客服？',
    answer: (
      <>
        <p>您可以通过以下方式联系人工客服：</p>
        <p className="mt-1">在"我的"页面点击"在线客服"聊天窗口留言</p>
        <p>发送邮件至：xinzhixinxiang525@126.com</p>
      </>
    ),
  },
];

export const FeedbackPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'submit' | 'history'>('faq');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const feedbackRecords = getFeedbackRecords();

  const handleSubmit = () => {
    if (!content.trim()) {
      setToastMessage('请输入反馈内容');
      setShowToast(true);
      return;
    }
    
    addFeedbackRecord({ content, contact: contact.trim() || undefined });
    setContent('');
    setContact('');
    setToastMessage('反馈提交成功');
    setShowToast(true);
  };

  return (
    <div className="page-container">
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      <div className="px-4 pb-6">
        <h1 className="text-xl font-bold text-primary mb-6 text-center">帮助与反馈</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'faq' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            常见问题
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'submit' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            意见反馈
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'history' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            历史反馈
          </button>
        </div>

        {activeTab === 'faq' && (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="space-y-4">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入您的反馈内容"
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="请填写您的邮箱/手机号（选填）"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-primary text-white rounded-full font-bold text-lg"
            >
              提交反馈
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {feedbackRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无反馈记录
              </div>
            ) : (
              feedbackRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-800 mb-2">{record.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{formatDate(record.submittedAt)}</span>
                    {record.contact && (
                      <span className="text-gray-400">{record.contact}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
