import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Clock, Coins } from 'lucide-react';
import { assessments } from '../data/assessments';
import { getAssessmentRecords } from '../utils/storage';

export const AssessmentListPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectAssessment = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}/intro`);
  };

  // 检查用户当月是否已使用免费机会
  const hasFreeMonthlyAssessment = (assessmentId: string): boolean => {
    if (!assessmentId || assessmentId === 'ppq') return true; // PPQ始终免费
    
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment || !assessment.freeMonthly) return false; // 无免费机会
    
    const records = getAssessmentRecords();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthRecords = records.filter(record => {
      if (record.assessmentId !== assessmentId) return false;
      const recordDate = new Date(record.completedAt);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });
    
    return thisMonthRecords.length === 0;
  };

  // 获取价格显示文本
  const getPriceText = (assessment: typeof assessments[0]): string => {
    if (assessment.id === 'ppq') {
      return '免费';
    }
    if (assessment.freeMonthly) {
      const hasFree = hasFreeMonthlyAssessment(assessment.id);
      if (hasFree) {
        return '本月免费';
      } else {
        return `${assessment.price}币`;
      }
    }
    return `${assessment.price}币`;
  };

  // 获取价格标签样式
  const getPriceStyle = (assessment: typeof assessments[0]): string => {
    if (assessment.id === 'ppq') {
      return 'bg-green-100 text-green-600';
    }
    if (assessment.freeMonthly) {
      const hasFree = hasFreeMonthlyAssessment(assessment.id);
      if (hasFree) {
        return 'bg-green-100 text-green-600';
      } else {
        return 'bg-orange-100 text-orange-600';
      }
    }
    return 'bg-orange-100 text-orange-600';
  };

  return (
    <div className="page-container">
      {/* 头部 */}
      <div className="sticky top-0 z-10 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>
      </div>

      {/* 标题 */}
      <div className="px-4 pb-4 text-center">
        <h1 className="text-xl font-bold text-primary">积极心理测评</h1>
        <p className="text-gray-500 text-sm mt-1">
          通过科学量表评估您的心理状态，建立专属心理档案
        </p>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        {/* 量表列表 */}
        <div className="px-4 pb-6 space-y-3">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              onClick={() => handleSelectAssessment(assessment.id)}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer transform transition-all duration-200 hover:shadow-md active:scale-[0.98] border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">
                      {assessment.name}（{assessment.shortName}）
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriceStyle(assessment)}`}>
                      {getPriceText(assessment)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {assessment.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{assessment.questionCount}题</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{assessment.duration}</span>
                    </div>
                    {assessment.id !== 'ppq' && assessment.freeMonthly && !hasFreeMonthlyAssessment(assessment.id) && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Coins className="w-4 h-4" />
                        <span>本月免费次数已用完</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
