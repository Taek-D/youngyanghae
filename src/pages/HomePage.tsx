import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplements } from '@/hooks/useSupplements';
import { useIntake } from '@/hooks/useIntake';
import { useStreak } from '@/hooks/useStreak';
import { usePoints } from '@/hooks/usePoints';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { useRewardedAdFlow } from '@/hooks/useRewardedAdFlow';
import { useDialog } from '@/contexts/DialogContext';
import { StreakCard } from '@/components/StreakCard';
import { IntakeListRow } from '@/components/IntakeListRow';
import { BottomTabBar } from '@/components/BottomTabBar';
import { INTAKE_SLOT_LABEL, DEFAULT_SLOT_TIMES } from '@/types';
import type { IntakeSlot, Supplement } from '@/types';
import { todayISO } from '@/services/streakService';
import { POINTS_EARN } from '@/config/pointsConstants';

const SLOT_ORDER: IntakeSlot[] = ['morning', 'lunch', 'evening', 'bedtime'];

function formatToday(): string {
  const d = new Date();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${weekday}요일`;
}

export default function HomePage() {
  const nav = useNavigate();
  const supplements = useSupplements();
  const intake = useIntake();
  const streak = useStreak();
  const points = usePoints();
  const premium = usePremiumContext();
  const ad = useRewardedAdFlow();
  const dialog = useDialog();

  // 오늘 복용해야 할 (영양제, 슬롯) 페어 생성 후 슬롯별 그룹화
  const grouped = useMemo(() => {
    const pairs = intake.generateTodayPairs(supplements.items);
    const map = new Map<IntakeSlot, Array<{ supplement: Supplement; slot: IntakeSlot }>>();
    for (const p of pairs) {
      const arr = map.get(p.slot) ?? [];
      arr.push(p);
      map.set(p.slot, arr);
    }
    return SLOT_ORDER.filter((s) => map.has(s)).map((s) => ({ slot: s, pairs: map.get(s)! }));
  }, [intake, supplements.items]);

  const allPairs = useMemo(() => grouped.flatMap((g) => g.pairs), [grouped]);
  const allTaken = allPairs.length > 0 && allPairs.every(
    (p) => intake.getStatus(p.supplement.id, p.slot) === 'taken',
  );

  const onToggle = async (supplementId: string, slot: IntakeSlot) => {
    const log = await intake.toggle(supplementId, slot);
    if (log.status === 'taken') {
      const { milestone, wasAdvanced } = await streak.advanceToday(todayISO());
      if (wasAdvanced && milestone) {
        const amount = POINTS_EARN[`streak_${milestone}` as keyof typeof POINTS_EARN];
        await points.earn(`streak_${milestone}` as 'streak_3' | 'streak_7' | 'streak_30', amount);
      }
    }
  };

  const onWatchAd = async () => {
    const result = await ad.watchAndEarn();
    if (result.rewarded) {
      await dialog.openAlert({ title: '포인트 적립!', description: `+${result.earned}p 받았어요` });
    }
  };

  if (supplements.loading || intake.loading || streak.loading) {
    return <div style={{ padding: 24 }}>불러오는 중…</div>;
  }

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{formatToday()}</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', margin: '4px 0 0' }}>
            오늘도 영양해?
          </h1>
        </div>
        <button
          onClick={() => nav('/settings')}
          style={{
            padding: '6px 12px',
            background: '#F3F4F6',
            border: 'none',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
          }}
          aria-label="포인트 잔액"
        >
          {points.balance.toLocaleString()}p
        </button>
      </div>

      {/* 스트릭 카드 */}
      <div style={{ marginBottom: 20 }}>
        <StreakCard streak={streak.state} />
      </div>

      {/* 영양제 0개 — Empty state */}
      {supplements.items.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 17, color: '#4B5563' }}>영양제를 등록해보세요</p>
          <button
            onClick={() => nav('/supplements/new')}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              background: '#3182F6',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            영양제 추가하기
          </button>
        </div>
      )}

      {/* 오늘 복용 없음 (요일 필터로 걸러진 경우) */}
      {supplements.items.length > 0 && grouped.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>
          오늘은 복용할 영양제가 없어요
        </div>
      )}

      {/* 슬롯별 그룹 */}
      {grouped.map((g) => (
        <section key={g.slot} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#4B5563', margin: '0 0 8px' }}>
            {INTAKE_SLOT_LABEL[g.slot]} ({DEFAULT_SLOT_TIMES[g.slot]})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.pairs.map((p) => (
              <IntakeListRow
                key={`${p.supplement.id}:${p.slot}`}
                supplement={p.supplement}
                slot={p.slot}
                status={intake.getStatus(p.supplement.id, p.slot)}
                onToggle={() => onToggle(p.supplement.id, p.slot)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* 모두 완료 + 광고 CTA (프리미엄 제외) */}
      {allTaken && !premium.status.active && (
        <div style={{ marginTop: 20, padding: 20, background: '#F9FAFB', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#191F28', margin: 0 }}>🎉 오늘 완료!</p>
          <button
            onClick={onWatchAd}
            disabled={ad.busy}
            style={{
              marginTop: 12,
              padding: '10px 20px',
              background: '#E8F3FF',
              color: '#3182F6',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: ad.busy ? 'not-allowed' : 'pointer',
              opacity: ad.busy ? 0.6 : 1,
            }}
          >
            {ad.busy ? '광고 재생 중...' : `광고 보고 +${POINTS_EARN.ad_watch}p 받기`}
          </button>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}
