import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssessmentById } from '../data/assessments';
import {
  saveAssessmentProgress,
  getAssessmentProgress,
  saveAssessmentRecord,
} from '../utils/storage';
import { calculateAssessmentResult, generateId } from '../utils/scoring';
import { Toast } from '../components/Toast';

export const QuizPage = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const assessment = assessmentId ? getAssessmentById(assessmentId) : undefined;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 加载保存的进度
  useEffect(() => {
    if (assessmentId) {
      const progress = getAssessmentProgress(assessmentId);
      if (progress) {
        setCurrentQuestion(progress.currentQuestion);
        setAnswers(progress.answers);
        setSelectedOption(progress.answers[progress.currentQuestion] || null);
      }
    }
  }, [assessmentId]);

  // 保存进度
  useEffect(() => {
    if (assessmentId && assessment) {
      saveAssessmentProgress({
        assessmentId,
        currentQuestion,
        answers,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [currentQuestion, answers, assessmentId, assessment]);

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

  const question = assessment.questions[currentQuestion - 1];
  const progress = (currentQuestion / assessment.questionCount) * 100;
  const isFirstQuestion = currentQuestion === 1;
  const isLastQuestion = currentQuestion === assessment.questionCount;

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      showToastMessage('您当前没选择选项');
      return;
    }

    if (isLastQuestion) {
      // 提交测评
      const result = calculateAssessmentResult(assessment, answers);
      const record = {
        id: generateId(),
        assessmentId: assessment.id,
        assessmentName: assessment.name,
        completedAt: new Date().toISOString(),
        scores: result.dimensionScores,
        totalScore: result.totalScore,
      };
      saveAssessmentRecord(record);
      // 清除进度
      saveAssessmentProgress({
        assessmentId: assessment.id,
        currentQuestion: 1,
        answers: {},
        lastUpdated: new Date().toISOString(),
      });
      navigate(`/report/${record.id}`);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(answers[currentQuestion + 1] || null);
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate('/');
    } else {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    }
  };

  return (
    <div className="page-container">
      {/* 头部 */}
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
        <h1 className="text-lg font-bold text-primary text-center">
          {assessment.name}（{assessment.shortName}）
        </h1>
      </div>

      {/* 进度条 */}
      <div className="px-4 mb-6">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          {currentQuestion}/{assessment.questionCount}
        </p>
      </div>

      {/* 题目 */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 text-center leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* 选项 */}
      <div className="px-4 space-y-3 mb-8">
        {assessment.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${
              selectedOption === option.value
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === option.value
                  ? 'border-primary'
                  : 'border-gray-300'
              }`}
            >
              {selectedOption === option.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            <span
              className={`${
                selectedOption === option.value
                  ? 'text-primary font-medium'
                  : 'text-gray-700'
              }`}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto">
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            className="flex-1 py-3 px-6 rounded-full border-2 border-primary text-primary font-medium hover:bg-blue-50 transition-colors"
          >
            {isFirstQuestion ? '返回首页' : '上一题'}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            {isLastQuestion ? '提交测评' : '下一题'}
          </button>
        </div>
      </div>

      {/* Toast提示 */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
