import type { Assessment, Dimension } from '../data/assessments';

export interface ScoringResult {
  dimensionScores: Record<string, number>;
  totalScore?: number;
  interpretations: Record<string, string>;
  suggestion: string;
}

/**
 * 计算反向计分
 * @param originalScore 原始得分
 * @param maxScore 量表最大分值
 * @returns 反向计分后的得分
 */
export const calculateReverseScore = (originalScore: number, maxScore: number): number => {
  return maxScore + 1 - originalScore;
};

/**
 * 计算单个维度的得分
 * @param dimension 维度配置
 * @param answers 用户答案
 * @param maxScore 量表最大分值
 * @returns 维度得分（平均值或总分）
 */
export const calculateDimensionScore = (
  dimension: Dimension,
  answers: Record<number, number>,
  maxScore: number
): number => {
  let totalScore = 0;
  let validQuestions = 0;

  for (const questionId of dimension.questions) {
    const answer = answers[questionId];
    if (answer !== undefined) {
      // 检查是否需要反向计分
      const isReverse = dimension.reverseQuestions?.includes(questionId);
      const score = isReverse ? calculateReverseScore(answer, maxScore) : answer;
      totalScore += score;
      validQuestions++;
    }
  }

  if (validQuestions === 0) return 0;

  // 返回平均值
  return parseFloat((totalScore / validQuestions).toFixed(1));
};

/**
 * 计算单个维度的总分（用于需要总分而非平均值的量表）
 * @param dimension 维度配置
 * @param answers 用户答案
 * @param maxScore 量表最大分值
 * @returns 维度总分
 */
export const calculateDimensionTotalScore = (
  dimension: Dimension,
  answers: Record<number, number>,
  maxScore: number
): number => {
  let totalScore = 0;

  for (const questionId of dimension.questions) {
    const answer = answers[questionId];
    if (answer !== undefined) {
      // 检查是否需要反向计分
      const isReverse = dimension.reverseQuestions?.includes(questionId);
      const score = isReverse ? calculateReverseScore(answer, maxScore) : answer;
      totalScore += score;
    }
  }

  return totalScore;
};

/**
 * 获取维度的解读文本
 * @param dimensionKey 维度key
 * @param score 维度得分
 * @param assessment 量表配置
 * @returns 解读文本
 */
export const getDimensionInterpretation = (
  dimensionKey: string,
  score: number,
  assessment: Assessment
): string => {
  const dimensionInterp = assessment.dimensionInterpretations.find(
    (di) => di.key === dimensionKey
  );

  if (!dimensionInterp) return '';

  const interpretation = dimensionInterp.interpretations.find(
    (i) => score >= i.min && score <= i.max
  );

  return interpretation?.text || '';
};

/**
 * 获取建议文本
 * @param dimensionScores 维度得分
 * @param totalScore 总分
 * @param assessment 量表配置
 * @returns 建议文本
 */
export const getSuggestion = (
  dimensionScores: Record<string, number>,
  totalScore: number | undefined,
  assessment: Assessment
): string => {
  for (const suggestion of assessment.suggestions) {
    if (suggestion.condition(dimensionScores, totalScore)) {
      return suggestion.text;
    }
  }
  return '';
};

/**
 * 计算完整的测评结果
 * @param assessment 量表配置
 * @param answers 用户答案
 * @returns 测评结果
 */
export const calculateAssessmentResult = (
  assessment: Assessment,
  answers: Record<number, number>
): ScoringResult => {
  const dimensionScores: Record<string, number> = {};
  const interpretations: Record<string, string> = {};
  let totalScore: number | undefined;

  // 根据量表类型选择计分方式
  const needsTotalScore = ['swls', 'ers', 'rpws'].includes(assessment.id);

  for (const dimension of assessment.dimensions) {
    if (needsTotalScore && assessment.dimensions.length === 1) {
      // 单维度量表使用总分
      const score = calculateDimensionTotalScore(dimension, answers, assessment.maxScore);
      dimensionScores[dimension.key] = score;
      totalScore = score;
    } else if (assessment.id === 'panas' || assessment.id === 'ashs' || assessment.id === 'erq' || assessment.id === 'rpws') {
      // PANAS、ASHS、ERQ、RPWS使用总分
      const score = calculateDimensionTotalScore(dimension, answers, assessment.maxScore);
      dimensionScores[dimension.key] = score;
    } else {
      // 其他量表使用平均分
      const score = calculateDimensionScore(dimension, answers, assessment.maxScore);
      dimensionScores[dimension.key] = score;
    }

    // 获取维度解读
    interpretations[dimension.key] = getDimensionInterpretation(
      dimension.key,
      dimensionScores[dimension.key],
      assessment
    );
  }

  // 计算RPWS的总分
  if (assessment.id === 'rpws') {
    totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
  }

  // 获取建议
  const suggestion = getSuggestion(dimensionScores, totalScore, assessment);

  return {
    dimensionScores,
    totalScore,
    interpretations,
    suggestion,
  };
};

/**
 * 格式化日期
 * @param dateString ISO日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
