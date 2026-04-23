import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PremiumProvider } from '@/contexts/PremiumContext';
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
  <PremiumProvider>
    <BrowserRouter>
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
    </BrowserRouter>
  </PremiumProvider>
);

export default App;
