import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePremium } from '@/hooks/usePremium';

type PremiumContextValue = ReturnType<typeof usePremium>;

const Ctx = createContext<PremiumContextValue | null>(null);

/**
 * PremiumContext — 앱 루트 Provider.
 * 앱 시작 시 자동으로 restore() 호출 (미결 주문 복원 + 환불 감지).
 * 해지해에서 학습한 패턴 계승.
 */
export function PremiumProvider({ children }: { children: ReactNode }) {
  const premium = usePremium();

  useEffect(() => {
    // 최초 1회 자동 복원 — 에러는 silent (네트워크 없어도 앱은 동작)
    premium.restore().catch((err) => {
      console.warn('[premium] restore skipped:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Ctx.Provider value={premium}>{children}</Ctx.Provider>;
}

export function usePremiumContext(): PremiumContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePremiumContext must be used inside <PremiumProvider>');
  return v;
}
