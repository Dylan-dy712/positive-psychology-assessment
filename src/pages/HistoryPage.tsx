import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getAssessmentRecords } from '../utils/storage';
import { formatDate } from '../utils/scoring';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const records = getAssessmentRecords().sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const handleBack = () => {
    navigate('/');
  };

  const handleViewReport = (recordId: string) => {
    navigate(`/report/${recordId}`);
  };

  return (
    <div className="page-container pb-24">
      {/* 头部 */}
      <div className="sticky top-0 z-10 px-4 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      {/* 标题 */}
      <div className="px-4 pb-6 text-center">
        <h1 className="text-xl font-bold text-primary">历史测评记录</h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        {/* 记录列表 */}
        <div className="px-4 pb-6 space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              当前暂无测评记录
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {record.assessmentName}测评报告
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
