import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getAssessmentRecords } from '../utils/storage';
import { getAssessmentById } from '../data/assessments';
import {
  RadarChart,
  LinearScale,
  ScatterChart,
  BarChart,
  VerticalBarChart,
  PieChart,
} from '../components/charts';

export const ReportPage = () => {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();

  // 获取测评记录
  const records = getAssessmentRecords();
  const record = records.find((r) => r.id === recordId);

  if (!record) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">报告不存在</p>
          <button
            onClick={() => navigate('/assessments')}
            className="mt-4 text-primary hover:underline"
          >
            返回量表列表
          </button>
        </div>
      </div>
    );
  }

  const assessment = getAssessmentById(record.assessmentId);
  if (!assessment) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">量表不存在</p>
          <button
            onClick={() => navigate('/assessments')}
            className="mt-4 text-primary hover:underline"
          >
            返回量表列表
          </button>
        </div>
      </div>
    );
  }

  // 重新计算结果以获取解读和建议
  // 从记录中恢复答案（这里简化处理，实际应该从记录中存储的答案恢复）
  // 由于我们存储的是结果，这里直接使用存储的分数

  const handleBack = () => {
    navigate('/assessments');
  };

  // 准备图表数据
  const renderChart = () => {
    const scores = record.scores;

    switch (assessment.chartType) {
      case 'radar': {
        const radarData = assessment.dimensions.map((dim) => ({
          dimension: dim.name,
          score: scores[dim.key] || 0,
          fullMark: assessment.maxScore,
        }));
        return <RadarChart data={radarData} />;
      }

      case 'linear': {
        const score = record.totalScore || Object.values(scores)[0] || 0;
        const minScore =
          assessment.id === 'swls'
            ? 5
            : assessment.id === 'ers'
            ? 14
            : assessment.minScore * assessment.questionCount;
        const maxScore =
          assessment.id === 'swls'
            ? 35
            : assessment.id === 'ers'
            ? 56
            : assessment.maxScore * assessment.questionCount;
        const label =
          assessment.id === 'swls'
            ? '您的生活满意度为'
            : '您的自我韧性为';
        return (
          <LinearScale
            score={score}
            minScore={minScore}
            maxScore={maxScore}
            label={label}
          />
        );
      }

      case 'scatter': {
        const xScore = scores['presence'] || 0;
        const yScore = scores['search'] || 0;
        return (
          <ScatterChart
            xScore={xScore}
            yScore={yScore}
            xLabel="拥有意义感"
            yLabel="寻求意义感"
            maxScore={assessment.maxScore}
          />
        );
      }

      case 'bar': {
        const barData = assessment.dimensions.map((dim) => ({
          dimension: dim.name,
          score: scores[dim.key] || 0,
          maxScore: assessment.maxScore,
        }));
        return <VerticalBarChart data={barData} />;
      }

      case 'horizontalBar': {
        const hBarData = assessment.dimensions.map((dim) => ({
          dimension: dim.name,
          score: scores[dim.key] || 0,
          maxScore:
            assessment.id === 'panas'
              ? 50
              : assessment.id === 'ashs'
              ? 24
              : assessment.maxScore * dim.questions.length,
        }));
        return <BarChart data={hBarData} />;
      }

      case 'pie': {
        const reappraisal = scores['reappraisal'] || 0;
        const suppression = scores['suppression'] || 0;
        const pieData = [
          { name: '认知重评', value: reappraisal, color: '#FDBA74' },
          { name: '表达抑制', value: suppression, color: '#F97316' },
        ];
        return <PieChart data={pieData} />;
      }

      default:
        return null;
    }
  };

  // 获取解读文本
  const getInterpretation = (dimensionKey: string, score: number): string => {
    const dimInterp = assessment.dimensionInterpretations.find(
      (di) => di.key === dimensionKey
    );
    if (!dimInterp) return '';

    const interp = dimInterp.interpretations.find(
      (i) => score >= i.min && score <= i.max
    );
    return interp?.text || '';
  };

  // 获取建议文本
  const getSuggestion = (): string => {
    for (const suggestion of assessment.suggestions) {
      if (suggestion.condition(record.scores, record.totalScore)) {
        return suggestion.text;
      }
    }
    return '';
  };

  return (
    <div className="page-container pb-32">
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
        <h1 className="text-xl font-bold text-primary">
          {assessment.name}（{assessment.shortName}）
        </h1>
        <h2 className="text-lg font-bold text-gray-800 mt-2">测评报告</h2>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        {/* 图表区域 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {renderChart()}
          </div>
        </div>

        {/* 测评解读 */}
        <div className="px-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-bold text-primary mb-4">测评解读</h3>
            <div className="space-y-4">
              {assessment.dimensions.map((dim) => {
                const score = record.scores[dim.key];
                const interpretation = getInterpretation(dim.key, score);
                return (
                  <div key={dim.key}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {dim.name}
                      </span>
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        {score}分
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {interpretation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 建议小tips */}
        <div className="px-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h3 className="font-bold text-secondary mb-3">建议小tips</h3>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {getSuggestion()}
            </div>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="px-4 pb-8">
          <div className="text-center text-gray-400 text-xs space-y-1">
            <p>本测评结果仅供参考，不能替代专业心理诊断或医疗建议。</p>
            <p>如有严重情绪困扰，请寻求专业心理咨询师或医生的帮助。</p>
          </div>
        </div>
      </div>
    </div>
  );
};
