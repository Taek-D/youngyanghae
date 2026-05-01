import { HashRouter, Routes, Route } from 'react-router-dom';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import IntroPage from '@/pages/IntroPage';
import HomePage from '@/pages/HomePage';
import SupplementListPage from '@/pages/SupplementListPage';
import SupplementEditPage from '@/pages/SupplementEditPage';
import HistoryPage from '@/pages/HistoryPage';
import PaywallPage from '@/pages/PaywallPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/NotFound';

const App = () => (
  <DialogProvider>
    <PremiumProvider>
      {/* HashRouter — 앱인토스 webview는 history.pushState 보장 X. # 기반 라우팅이 안전 */}
      <HashRouter>
        <OnboardingGuard>
        <Routes>
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/supplements" element={<SupplementListPage />} />
          <Route path="/supplements/new" element={<SupplementEditPage />} />
          <Route path="/supplements/:id" element={<SupplementEditPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/paywall" element={<PaywallPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </OnboardingGuard>
      </HashRouter>
    </PremiumProvider>
  </DialogProvider>
);

export default App;
