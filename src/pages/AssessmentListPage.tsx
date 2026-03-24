import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Clock } from 'lucide-react';
import { assessments } from '../data/assessments';

export const AssessmentListPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectAssessment = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}/intro`);
  };

  return (
    <div className="page-container">
      {/* 头部 */}
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
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

      {/* 量表列表 */}
      <div className="px-4 pb-6 space-y-3">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            onClick={() => handleSelectAssessment(assessment.id)}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer transform transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  {assessment.name}（{assessment.shortName}）
                </h3>
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
