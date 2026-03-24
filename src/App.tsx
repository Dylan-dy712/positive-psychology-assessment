import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  AssessmentListPage,
  AssessmentIntroPage,
  QuizPage,
  ReportPage,
  HistoryPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessments" element={<AssessmentListPage />} />
        <Route path="/assessment/:assessmentId/intro" element={<AssessmentIntroPage />} />
        <Route path="/assessment/:assessmentId/quiz" element={<QuizPage />} />
        <Route path="/report/:recordId" element={<ReportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
