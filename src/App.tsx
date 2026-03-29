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
} from './pages';
import { BottomNav } from './components/BottomNav';

const AppContent = () => {
  const location = useLocation();
  
  const showBottomNav = 
    location.pathname === '/' || // 心灵档案
    location.pathname === '/mental-save' || // 心理储蓄
    location.pathname === '/my'; // 我的


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
        
        {/* 心理储蓄相关路由 */}
        <Route path="/mental-save" element={<MentalSavePage />} />
        <Route path="/mental-save/coin-guide" element={<CoinGuidePage />} />
        <Route path="/mental-save/gratitude-diary" element={<GratitudeDiaryPage />} />
        <Route path="/mental-save/gratitude-diary/three-question" element={<GratitudeThreeQuestionPage />} />
        <Route path="/mental-save/gratitude-diary/free-record" element={<GratitudeFreeRecordPage />} />
        <Route path="/mental-save/gratitude-diary/calendar" element={<GratitudeCalendarPage />} />
        <Route path="/mental-save/flow-moment" element={<FlowMomentPage />} />
        <Route path="/mental-save/flow-moment/record" element={<FlowMomentRecordPage />} />
        <Route path="/mental-save/flow-moment/portrait" element={<FlowMomentPortraitPage />} />
        <Route path="/mental-save/flow-moment/candy-box" element={<FlowMomentCandyBoxPage />} />
        <Route path="/mental-save/hope-blind-box" element={<HopeBlindBoxPage />} />
        <Route path="/mental-save/hope-blind-box/wish" element={<HopeBlindBoxWishPage />} />
        <Route path="/mental-save/hope-blind-box/draw" element={<HopeBlindBoxDrawPage />} />
        <Route path="/mental-save/hope-blind-box/draw/success" element={<HopeBlindBoxSuccessPage />} />
        <Route path="/mental-save/hope-blind-box/draw/fail" element={<HopeBlindBoxFailPage />} />
        <Route path="/mental-save/hope-blind-box/submit" element={<HopeBlindBoxSubmitPage />} />
        <Route path="/mental-save/hope-blind-box/memoirs" element={<HopeBlindBoxMemoirsPage />} />
        <Route path="/mental-save/games/anxiety-popup" element={<AnxietyPopupGamePage />} />
        <Route path="/mental-save/games/kuakua" element={<KuakuaGamePage />} />
        <Route path="/mental-save/games/heart-hunter" element={<HeartHunterGamePage />} />
        <Route path="/mental-save/games/heart-cards" element={<HeartCardsGamePage />} />
        <Route path="/mental-save/games/yulegeyu" element={<YulegeyuGamePage />} />
        <Route path="/mental-save/games/heart-scratch" element={<HeartScratchGamePage />} />
        
        <Route path="*" element={<Navigate to="/launch" replace />} />
      </Routes>
      
      {showBottomNav && <BottomNav />}
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
