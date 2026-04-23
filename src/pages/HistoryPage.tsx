import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplements } from '@/hooks/useSupplements';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { BottomTabBar } from '@/components/BottomTabBar';
import { weekAdherence, supplementAdherence, last7Days, last30Days, type DayAdherence, type SupplementAdherence } from '@/utils/adherence';
import { todayISO } from '@/services/streakService';
import { FREE_HISTORY_DAYS } from '@/config/premiumConstants';

type Range = 'week' | 'month' | 'all';

export default function HistoryPage() {
  const nav = useNavigate();
  const supplements = useSupplements();
  const premium = usePremiumContext();
  const [range, setRange] = useState<Range>('week');
  const [daily, setDaily] = useState<DayAdherence[]>([]);
  const [perSupp, setPerSupp] = useState<SupplementAdherence[]>([]);

  useEffect(() => {
    if (supplements.loading) return;
    let effective = range;
    if ((range === 'month' || range === 'all') && !premium.status.active) {
      effective = 'week';
    }
    const today = todayISO();
    const { from, to } = effective === 'week' ? last7Days(today) : last30Days(today);
    (async () => {
      const [d, p] = await Promise.all([
        weekAdherence(supplements.items, from, to),
        supplementAdherence(supplements.items, from, to),
      ]);
      setDaily(d);
      setPerSupp(p);
    })();
  }, [range, supplements.items, supplements.loading, premium.status.active]);

  const totalTaken = daily.reduce((sum, d) => sum + d.taken, 0);
  const totalPossible = daily.reduce((sum, d) => sum + d.total, 0);
  const overallPct = totalPossible === 0 ? 0 : Math.round((totalTaken / totalPossible) * 100);

  const isPaywallRange = (r: Range) => (r === 'month' || r === 'all') && !premium.status.active;

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', margin: '0 0 16px' }}>복용 기록</h1>

      {/* 기간 토글 */}
      <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', padding: 4, borderRadius: 10, marginBottom: 20 }}>
        {(['week', 'month', 'all'] as Range[]).map((r) => {
          const on = range === r;
          const label = r === 'week' ? '주' : r === 'month' ? '월' : '전체';
          const locked = isPaywallRange(r);
          return (
            <button
              key={r}
              onClick={() => (locked ? nav('/paywall') : setRange(r))}
              style={{
                flex: 1,
                padding: '10px',
                background: on ? '#FFFFFF' : 'transparent',
                color: locked ? '#9CA3AF' : on ? '#191F28' : '#6B7280',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: on ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: on ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {locked ? '🔒 ' : ''}{label}
            </button>
          );
        })}
      </div>

      {/* 전체 달성률 */}
      <section style={{ padding: 20, background: '#F9FAFB', borderRadius: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#4B5563' }}>
          {range === 'week' ? '이번주' : '지난 30일'} 복용률
        </div>
        <div style={{ fontSize: 29, fontWeight: 700, color: '#3182F6', marginTop: 4 }}>{overallPct}%</div>
        <div style={{ marginTop: 12, height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallPct}%`, background: '#3182F6' }} />
        </div>
        {/* 일별 도트 */}
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {daily.map((d) => (
            <div
              key={d.dateISO}
              title={`${d.dateISO}: ${d.taken}/${d.total}`}
              style={{
                flex: 1,
                height: 24,
                background: d.total === 0 ? '#E5E7EB' : d.percent === 100 ? '#027648' : d.percent > 50 ? '#74B8FF' : d.percent > 0 ? '#D1E7FF' : '#F3F4F6',
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </section>

      {/* 영양제별 */}
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#191F28', margin: '0 0 12px' }}>영양제별 복용률</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {perSupp.map((s) => (
          <div key={s.supplementId} style={{ padding: 16, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{s.name}</span>
              <span style={{ fontSize: 13, color: '#4B5563' }}>
                {s.taken}/{s.total} · {s.percent}%
              </span>
            </div>
            <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.percent}%`, background: s.percent === 100 ? '#027648' : '#3182F6' }} />
            </div>
          </div>
        ))}
      </div>

      {/* 페이월 안내 (무료 유저) */}
      {!premium.status.active && (
        <div
          onClick={() => nav('/paywall')}
          style={{
            marginTop: 20,
            padding: 20,
            background: '#E8F3FF',
            borderRadius: 12,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1649B8' }}>
            🔒 {FREE_HISTORY_DAYS}일 초과 기록은 프리미엄에서 볼 수 있어요
          </div>
          <div style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>영양해 프로 보기 →</div>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}
