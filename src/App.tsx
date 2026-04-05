import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  MentalSavePage,
  CoinGuidePage,
  GratitudeDiaryPage,
  GratitudeThreeQuestionPage,
  GratitudeFreeRecordPage,
  GratitudeCalendarPage,
  FlowMomentPage,
  FlowMomentRecordPage,
  FlowMomentPortraitPage,
  FlowMomentCandyBoxPage,
  HopeBlindBoxPage,
  HopeBlindBoxWishPage,
  HopeBlindBoxDrawPage,
  HopeBlindBoxSuccessPage,
  HopeBlindBoxFailPage,
  HopeBlindBoxSubmitPage,
  HopeBlindBoxMemoirsPage,
  AnxietyPopupGamePage,
  KuakuaGamePage,
  HeartHunterGamePage,
  HeartCardsGamePage,
  YulegeyuGamePage,
  HeartScratchGamePage,
  ExchangePage,
  ExchangeRulePage,
  ExchangeRecordPage,
  ExchangeDetailPage,
} from './pages';
import { BottomNav } from './components/BottomNav';

// 移除认证保护，直接返回子组件
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  const showBottomNav = 
    location.pathname === '/' || // 心灵档案
    location.pathname === '/mental-save' || // 心理储蓄
    location.pathname === '/exchange' || // 兑换
    location.pathname === '/my'; // 我的


  return (
    <>
      <Routes>
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/assessments" element={
          <ProtectedRoute>
            <AssessmentListPage />
          </ProtectedRoute>
        } />
        <Route path="/assessment/:assessmentId/intro" element={
          <ProtectedRoute>
            <AssessmentIntroPage />
          </ProtectedRoute>
        } />
        <Route path="/assessment/:assessmentId/quiz" element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } />
        <Route path="/report/:recordId" element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/my" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/my/coin-detail" element={
          <ProtectedRoute>
            <CoinDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/my/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
        <Route path="/my/check-in" element={
          <ProtectedRoute>
            <CheckInPage />
          </ProtectedRoute>
        } />
        <Route path="/my/emoji" element={
          <ProtectedRoute>
            <EmojiPage />
          </ProtectedRoute>
        } />
        <Route path="/my/feedback" element={
          <ProtectedRoute>
            <FeedbackPage />
          </ProtectedRoute>
        } />
        <Route path="/my/service" element={
          <ProtectedRoute>
            <ServicePage />
          </ProtectedRoute>
        } />
        <Route path="/agreement/service" element={<ServiceAgreementPage />} />
        <Route path="/agreement/privacy" element={<PrivacyPolicyPage />} />
        
        {/* 心理储蓄相关路由 */}
        <Route path="/mental-save" element={
          <ProtectedRoute>
            <MentalSavePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/coin-guide" element={
          <ProtectedRoute>
            <CoinGuidePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/gratitude-diary" element={
          <ProtectedRoute>
            <GratitudeDiaryPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/gratitude-diary/three-question" element={
          <ProtectedRoute>
            <GratitudeThreeQuestionPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/gratitude-diary/free-record" element={
          <ProtectedRoute>
            <GratitudeFreeRecordPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/gratitude-diary/calendar" element={
          <ProtectedRoute>
            <GratitudeCalendarPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/flow-moment" element={
          <ProtectedRoute>
            <FlowMomentPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/flow-moment/record" element={
          <ProtectedRoute>
            <FlowMomentRecordPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/flow-moment/portrait" element={
          <ProtectedRoute>
            <FlowMomentPortraitPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/flow-moment/candy-box" element={
          <ProtectedRoute>
            <FlowMomentCandyBoxPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box" element={
          <ProtectedRoute>
            <HopeBlindBoxPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/wish" element={
          <ProtectedRoute>
            <HopeBlindBoxWishPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/draw" element={
          <ProtectedRoute>
            <HopeBlindBoxDrawPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/draw/success" element={
          <ProtectedRoute>
            <HopeBlindBoxSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/draw/fail" element={
          <ProtectedRoute>
            <HopeBlindBoxFailPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/submit" element={
          <ProtectedRoute>
            <HopeBlindBoxSubmitPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/hope-blind-box/memoirs" element={
          <ProtectedRoute>
            <HopeBlindBoxMemoirsPage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/anxiety-popup" element={
          <ProtectedRoute>
            <AnxietyPopupGamePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/kuakua" element={
          <ProtectedRoute>
            <KuakuaGamePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/heart-hunter" element={
          <ProtectedRoute>
            <HeartHunterGamePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/heart-cards" element={
          <ProtectedRoute>
            <HeartCardsGamePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/yulegeyu" element={
          <ProtectedRoute>
            <YulegeyuGamePage />
          </ProtectedRoute>
        } />
        <Route path="/mental-save/games/heart-scratch" element={
          <ProtectedRoute>
            <HeartScratchGamePage />
          </ProtectedRoute>
        } />
        
        {/* 兑换相关路由 */}
        <Route path="/exchange" element={
          <ProtectedRoute>
            <ExchangePage />
          </ProtectedRoute>
        } />
        <Route path="/exchange/rule" element={
          <ProtectedRoute>
            <ExchangeRulePage />
          </ProtectedRoute>
        } />
        <Route path="/exchange/record" element={
          <ProtectedRoute>
            <ExchangeRecordPage />
          </ProtectedRoute>
        } />
        <Route path="/exchange/detail/:id" element={
          <ProtectedRoute>
            <ExchangeDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/launch" replace />} />
      </Routes>
      
      {showBottomNav && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;