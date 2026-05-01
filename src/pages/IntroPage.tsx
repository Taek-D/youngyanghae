import { useNavigate } from 'react-router-dom';
import { ONBOARDING_KEY } from '@/components/OnboardingGuard';

/**
 * 인트로 화면 — 심사 규정: appLogin() 자동 호출 금지, 사용자 액션으로 시작.
 * T13에서 TDS 컴포넌트로 리팩토링 예정 (현재 스텁).
 */
export default function IntroPage() {
  const nav = useNavigate();

  const start = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    nav('/', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 24, background: '#FFFFFF' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <img src="/logo-light.png" alt="영양해" width={120} height={120} />
        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#191F28', margin: 0 }}>영양해</h1>
        <p style={{ fontSize: 17, color: '#4B5563', margin: 0, textAlign: 'center' }}>
          매일 1번, 톡 누르면 끝
          <br />
          — 오늘도 영양해?
        </p>
      </div>
      <button
        onClick={start}
        style={{
          height: 56,
          borderRadius: 12,
          background: '#3182F6',
          color: '#FFFFFF',
          fontSize: 17,
          fontWeight: 700,
          border: 'none',
        }}
      >
        영양해 시작하기
      </button>
    </div>
  );
}
