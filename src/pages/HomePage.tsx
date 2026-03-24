import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getLatestAssessmentRecords, getAssessmentRecords } from '../utils/storage';
import { formatDate } from '../utils/scoring';

export const HomePage = () => {
  const navigate = useNavigate();
  const recentRecords = getLatestAssessmentRecords(3);
  const totalRecords = getAssessmentRecords();
  const hasRecords = recentRecords.length > 0;

  const handleViewReport = (recordId: string) => {
    navigate(`/report/${recordId}`);
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleStartAssessment = () => {
    navigate('/assessments');
  };

  return (
    <div className="page-container">
      {/* 头部 */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">心灵档案</h1>
      </div>

      {/* 主入口卡片 */}
      <div className="mx-4 mb-6">
        <div
          onClick={handleStartAssessment}
          className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">积极心理测评</h2>
              <p className="text-blue-100 text-sm">通过科学量表评估您的心理状态</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">GO!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 已测评板块 */}
      <div className="mx-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* 标题 */}
          <div className="bg-orange-400 text-white px-4 py-2 flex items-center gap-2">
            <ChevronRight className="w-5 h-5" />
            <span className="font-medium">已测评 ({totalRecords.length})</span>
          </div>

          {/* 记录列表 */}
          <div className="p-4">
            {!hasRecords ? (
              <div className="text-center py-8 text-gray-500">
                当前暂无测评记录
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {record.assessmentName}测评报告
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(record.completedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewReport(record.id)}
                        className="bg-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
                      >
                        查看报告
                      </button>
                    </div>
                  ))}
                </div>

                {/* 查看更多 */}
                {totalRecords.length > 3 && (
                  <button
                    onClick={handleViewHistory}
                    className="w-full text-center text-gray-500 text-sm mt-4 py-2 hover:text-primary transition-colors"
                  >
                    查看更多测评报告&gt;&gt;&gt;
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
