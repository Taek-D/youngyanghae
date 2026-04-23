import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { usePoints } from '@/hooks/usePoints';
import { PREMIUM_PRICES_KRW, type IAPSkuKey } from '@/config/premiumConstants';
import { POINTS_SPEND } from '@/config/pointsConstants';

const PLANS: Array<{
  key: IAPSkuKey;
  label: string;
  priceLine: string;
  subLine?: string;
  recommended?: boolean;
}> = [
  { key: 'monthly', label: '월 구독', priceLine: `월 ₩${PREMIUM_PRICES_KRW.monthly.toLocaleString()}` },
  { key: 'yearly', label: '연 구독', priceLine: `연 ₩${PREMIUM_PRICES_KRW.yearly.toLocaleString()}`, subLine: `월 ₩${Math.round(PREMIUM_PRICES_KRW.yearly / 12).toLocaleString()} — 35% ↓`, recommended: true },
  { key: 'lifetime', label: '평생 이용', priceLine: `₩${PREMIUM_PRICES_KRW.lifetime.toLocaleString()}` },
];

const BENEFITS = [
  '영양제 무제한 등록',
  '모든 기록·통계 평생 보관',
  '광고 제거',
  '월간 건강 리포트 (PDF)',
  '성분 상호작용 경고',
];

export default function PaywallPage() {
  const nav = useNavigate();
  const premium = usePremiumContext();
  const points = usePoints();
  const [selected, setSelected] = useState<IAPSkuKey>('yearly');
  const [busy, setBusy] = useState(false);

  const onPurchase = async () => {
    setBusy(true);
    try {
      const result = await premium.buy(selected);
      if (result.ok) {
        alert('영양해 프로로 업그레이드됐어요 ✨');
        nav('/', { replace: true });
      } else if (result.reason === 'canceled') {
        // 취소는 silent (노출 불필요)
      } else {
        alert(result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const onExchange1Day = async () => {
    const cost = POINTS_SPEND.premium_1d;
    if (points.balance < cost) {
      alert(`포인트가 부족해요 (${cost - points.balance}p 더 필요)`);
      return;
    }
    if (!confirm(`${cost}p로 프로 1일권을 받을까요?`)) return;
    const r = await points.spend('spend_premium_1d', cost);
    if (!r.ok) return;
    await premium.grantByPoints('premium_1d');
    alert('프로 1일권이 활성화됐어요');
    nav('/', { replace: true });
  };

  const selectedPrice = PREMIUM_PRICES_KRW[selected];

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <img src="/logo-light.svg" alt="영양해 프로" width={80} height={80} />
        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#191F28', margin: '12px 0 4px' }}>영양해 프로</h1>
        <p style={{ fontSize: 17, color: '#4B5563', margin: 0 }}>무제한 기록, 무광고, 깊은 분석</p>
      </div>

      {/* 혜택 */}
      <section style={{ marginBottom: 24 }}>
        {BENEFITS.map((b) => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <span style={{ color: '#027648', fontSize: 18 }}>✓</span>
            <span style={{ fontSize: 15, color: '#191F28' }}>{b}</span>
          </div>
        ))}
      </section>

      {/* 플랜 */}
      <section style={{ marginBottom: 20 }}>
        {PLANS.map((p) => {
          const on = selected === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setSelected(p.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                marginBottom: 8,
                background: on ? '#E8F3FF' : '#FFFFFF',
                border: '2px solid ' + (on ? '#3182F6' : '#E5E7EB'),
                borderRadius: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    border: '2px solid ' + (on ? '#3182F6' : '#D1D5DB'),
                    background: on ? '#3182F6' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {on && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#FFFFFF' }} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{p.label}</span>
                    {p.recommended && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          background: '#3182F6',
                          color: '#FFFFFF',
                          borderRadius: 999,
                          fontWeight: 600,
                        }}
                      >
                        추천
                      </span>
                    )}
                  </div>
                  {p.subLine && <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{p.subLine}</div>}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{p.priceLine}</div>
            </button>
          );
        })}
      </section>

      {/* 포인트 교환 */}
      <button
        onClick={onExchange1Day}
        disabled={points.balance < POINTS_SPEND.premium_1d}
        style={{
          width: '100%',
          padding: 14,
          background: '#F3F4F6',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          color: points.balance < POINTS_SPEND.premium_1d ? '#9CA3AF' : '#374151',
          cursor: points.balance < POINTS_SPEND.premium_1d ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          marginBottom: 16,
        }}
      >
        포인트로 교환하기 · 잔여 {points.balance.toLocaleString()}p · {POINTS_SPEND.premium_1d}p로 1일권
      </button>

      {/* 환불 안내 (심사 필수) */}
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, padding: '12px 4px' }}>
        환불은 토스 앱 &gt; 전체 &gt; 게임 &gt; 프로필 &gt; 구매내역에서 요청할 수 있어요. 앱에서는 환불 기능을 제공하지 않아요.
      </p>

      {/* CTA */}
      <div style={{ position: 'sticky', bottom: 20, background: '#FFFFFF', paddingTop: 8 }}>
        <button
          onClick={onPurchase}
          disabled={busy}
          style={{
            width: '100%',
            height: 56,
            background: '#3182F6',
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 700,
            border: 'none',
            borderRadius: 12,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
            fontFamily: 'inherit',
          }}
        >
          {busy ? '결제 중...' : `${PLANS.find((p) => p.key === selected)?.label} 시작하기 — ₩${selectedPrice.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}
