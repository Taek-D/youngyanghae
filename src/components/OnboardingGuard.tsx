import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ONBOARDING_KEY = 'youngyang:onboarding-completed';

/**
 * 최초 진입 시 /intro로 리다이렉트하는 가드.
 * 심사 규정: appLogin() 앱 시작 직후 호출 금지 → 인트로 화면 경유 필수.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed && loc.pathname !== '/intro') {
      nav('/intro', { replace: true });
    }
  }, [loc.pathname, nav]);

  return <>{children}</>;
}
