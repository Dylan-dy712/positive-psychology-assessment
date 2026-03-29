import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { saveFlowMoment, updateDailyRewards, getDailyRewards, updateCoinBalance } from '../utils/storage';

export const FlowMomentRecordPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [endTime, setEndTime] = useState(new Date().toISOString().slice(0, 16));
  const [feelings, setFeelings] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // 活动类型选项
  const activityOptions = [
    { category: '创作类', items: ['画画', '写东西', '做手工', '剪辑视频'] },
    { category: '工作/学习类', items: ['写方案', '做报表', '读专业书', '背单词'] },
    { category: '运动类', items: ['跑步', '瑜伽', '骑行', '打球（无对抗性运动）'] },
    { category: '日常兴趣类', items: ['做饭', '拼乐高', '看剧', '听音乐（需专注的）'] },
  ];

  // 感受选项
  const feelingOptions = [
    '忘记时间',
    '很有成就感',
    '内心平静',
    '想一直做下去',
    '做完很放松',
  ];

  // 触发条件选项
  const triggerOptions = [
    '无人打扰（安静环境）',
    '目标明确（知道要做什么）',
    '难度刚好（不太难也不太简单）',
    '自己想做（非被迫）',
    '有即时反馈（如做饭闻香味、画画看成果）',
  ];

  // 投入时长选项
  const durationOptions = [
    '15-30分钟',
    '30分-1小时',
    '1-2小时',
    '2小时以上',
  ];



  const handleFeelingToggle = (feeling: string) => {
    setFeelings((prev: string[]) => 
      prev.includes(feeling) 
        ? prev.filter((f: string) => f !== feeling) 
        : [...prev, feeling]
    );
  };

  const handleTriggerToggle = (trigger: string) => {
    setTriggers((prev: string[]) => 
      prev.includes(trigger) 
        ? prev.filter((t: string) => t !== trigger) 
        : [...prev, trigger]
    );
  };

  const handleSave = () => {
    // 检查必填项
    if (selectedCategory === '') {
      alert('请选择活动分类');
      return;
    }
    if (selectedCategory === '自定义' && customActivity.trim() === '') {
      alert('请输入自定义活动');
      return;
    }
    if (selectedCategory !== '自定义' && (!selectedActivity || selectedActivity === '')) {
      alert('请选择活动');
      return;
    }
    if (!duration) {
      alert('请选择投入时长');
      return;
    }

    // 保存心流时刻
    const moment = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      activities: selectedCategory === '自定义' ? [customActivity.trim()] : [selectedActivity],
      customActivity: selectedCategory === '自定义' ? customActivity.trim() : undefined,
      duration,
      endTime,
      feelings,
      triggers,
    };

    saveFlowMoment(moment);

    // 检查是否是今天第一次保存
    const dailyRewards = getDailyRewards();
    if (!dailyRewards.flowMoment) {
      // 发放10个心理货币
      updateCoinBalance(10, '每日首次保存心流时刻');
      updateDailyRewards('flowMoment', true);
      setShowRewardModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowRewardModal(false);
    navigate('/mental-save/flow-moment');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/flow-moment')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">心流时刻</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录专注投入的快乐时光，发现你的心流模式</p>
      </div>

      {/* 表单内容 */}
      <div className="p-5 space-y-6">
        {/* 活动类型 */}
        <div>
          <p className="font-medium mb-3">活动类型</p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-2">选择分类</p>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedActivity('');
                  setCustomActivity('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
              >
                <option value="">请选择分类</option>
                {activityOptions.map((category, index) => (
                  <option key={index} value={category.category}>
                    {category.category}
                  </option>
                ))}
                <option value="自定义">自定义</option>
              </select>
            </div>
            {selectedCategory && selectedCategory !== '自定义' && (
              <div>
                <p className="text-sm text-gray-500 mb-2">选择活动</p>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
                >
                  <option value="">请选择活动</option>
                  {activityOptions
                    .find(cat => cat.category === selectedCategory)
                    ?.items.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {selectedCategory === '自定义' && (
              <div>
                <p className="text-sm text-gray-500 mb-2">自定义活动</p>
                <input
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  placeholder="请输入其他活动"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
                />
              </div>
            )}
          </div>
        </div>

        {/* 投入时长 */}
        <div>
          <p className="font-medium mb-3">投入时长</p>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setDuration(option)}
                className={`px-4 py-2 rounded-full text-sm ${
                  duration === option
                    ? 'bg-[#FFA203] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 结束时间 */}
        <div>
          <p className="font-medium mb-3">结束时间</p>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA203]"
          />
        </div>

        {/* 当下感受 */}
        <div>
          <p className="font-medium mb-3">当下感受（可多选）</p>
          <div className="flex flex-wrap gap-2">
            {feelingOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFeelingToggle(option)}
                className={`px-4 py-2 rounded-full text-sm ${
                  feelings.includes(option)
                    ? 'bg-[#FFA203] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                ✅{option}
              </button>
            ))}
          </div>
        </div>

        {/* 触发条件 */}
        <div>
          <p className="font-medium mb-3">触发条件（可多选）</p>
          <div className="flex flex-wrap gap-2">
            {triggerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleTriggerToggle(option)}
                className={`px-4 py-2 rounded-full text-sm ${
                  triggers.includes(option)
                    ? 'bg-[#FFA203] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                ✅{option}
              </button>
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div className="text-sm text-gray-500 p-3 bg-yellow-50 rounded-lg">
          注：每保存一次心流时刻可获得10个“心理货币”，每日限定领一次。
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="p-5">
        <button
          onClick={handleSave}
          className="w-full bg-[#FFA203] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#ff8c00] transition-colors active:scale-[0.98] transform"
        >
          保存心流时刻
        </button>
      </div>

      {/* 成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">保存成功</h3>
            <p className="text-center text-gray-700 mb-6">
              心流时刻保存成功
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
              心流时刻保存成功！获得10个心理货币奖励
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