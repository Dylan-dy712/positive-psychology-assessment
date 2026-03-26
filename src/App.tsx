import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  HomePage,
  AssessmentListPage,
  AssessmentIntroPage,
  QuizPage,
  ReportPage,
  HistoryPage,
  LaunchPage,
  MyPage,
  ServiceAgreementPage,
  PrivacyPolicyPage,
  CoinDetailPage,
  AccountPage,
  CheckInPage,
  EmojiPage,
  FeedbackPage,
  ServicePage,
} from './pages';
import { BottomNav } from './components/BottomNav';

const AppContent = () => {
  const location = useLocation();
  
  const showBottomNav = 
    location.pathname === '/' || 
    location.pathname === '/assessments' ||
    location.pathname.startsWith('/assessment/') ||
    location.pathname.startsWith('/report/') ||
    location.pathname === '/history' ||
    location.pathname === '/my';

  const isLaunchPage = location.pathname === '/launch';
  const isAgreementPage = 
    location.pathname.startsWith('/agreement/');

  return (
    <>
      <Routes>
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/assessments" element={<AssessmentListPage />} />
        <Route path="/assessment/:assessmentId/intro" element={<AssessmentIntroPage />} />
        <Route path="/assessment/:assessmentId/quiz" element={<QuizPage />} />
        <Route path="/report/:recordId" element={<ReportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/my/coin-detail" element={<CoinDetailPage />} />
        <Route path="/my/account" element={<AccountPage />} />
        <Route path="/my/check-in" element={<CheckInPage />} />
        <Route path="/my/emoji" element={<EmojiPage />} />
        <Route path="/my/feedback" element={<FeedbackPage />} />
        <Route path="/my/service" element={<ServicePage />} />
        <Route path="/agreement/service" element={<ServiceAgreementPage />} />
        <Route path="/agreement/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<Navigate to="/launch" replace />} />
      </Routes>
      
      {showBottomNav && !isLaunchPage && !isAgreementPage && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
