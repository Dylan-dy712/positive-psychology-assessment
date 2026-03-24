const STORAGE_KEYS = {
  ASSESSMENT_RECORDS: 'assessment_records',
  ASSESSMENT_PROGRESS: 'assessment_progress',
} as const;

export interface AssessmentRecord {
  id: string;
  assessmentId: string;
  assessmentName: string;
  completedAt: string;
  scores: Record<string, number>;
  totalScore?: number;
}

export interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  answers: Record<number, number>;
  lastUpdated: string;
}

/**
 * 保存测评记录
 */
export const saveAssessmentRecord = (record: AssessmentRecord): void => {
  try {
    const records = getAssessmentRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('保存测评记录失败:', error);
  }
};

/**
 * 获取所有测评记录
 */
export const getAssessmentRecords = (): AssessmentRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取测评记录失败:', error);
    return [];
  }
};

/**
 * 获取指定量表的测评记录
 */
export const getAssessmentRecordsById = (assessmentId: string): AssessmentRecord[] => {
  const records = getAssessmentRecords();
  return records.filter((record) => record.assessmentId === assessmentId);
};

/**
 * 获取最新的测评记录
 */
export const getLatestAssessmentRecords = (limit: number = 3): AssessmentRecord[] => {
  const records = getAssessmentRecords();
  return records
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit);
};

/**
 * 保存答题进度
 */
export const saveAssessmentProgress = (progress: AssessmentProgress): void => {
  try {
    const allProgress = getAllAssessmentProgress();
    const existingIndex = allProgress.findIndex((p) => p.assessmentId === progress.assessmentId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('保存答题进度失败:', error);
  }
};

/**
 * 获取指定量表的答题进度
 */
export const getAssessmentProgress = (assessmentId: string): AssessmentProgress | null => {
  try {
    const allProgress = getAllAssessmentProgress();
    return allProgress.find((p) => p.assessmentId === assessmentId) || null;
  } catch (error) {
    console.error('获取答题进度失败:', error);
    return null;
  }
};

/**
 * 获取所有答题进度
 */
export const getAllAssessmentProgress = (): AssessmentProgress[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_PROGRESS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取所有答题进度失败:', error);
    return [];
  }
};

/**
 * 清除指定量表的答题进度
 */
export const clearAssessmentProgress = (assessmentId: string): void => {
  try {
    const allProgress = getAllAssessmentProgress();
    const filtered = allProgress.filter((p) => p.assessmentId !== assessmentId);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_PROGRESS, JSON.stringify(filtered));
  } catch (error) {
    console.error('清除答题进度失败:', error);
  }
};

/**
 * 清除所有数据
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_PROGRESS);
  } catch (error) {
    console.error('清除数据失败:', error);
  }
};
