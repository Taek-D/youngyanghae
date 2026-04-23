import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { usePoints } from '@/hooks/usePoints';
import { useSupplements } from '@/hooks/useSupplements';
import { BottomTabBar } from '@/components/BottomTabBar';
import { resetDB_YYH } from '@/storage/db';
import { buildSchedules, syncSchedules, clearAllSchedules } from '@/services/notificationService';
import { DEFAULT_SLOT_TIMES, INTAKE_SLOT_LABEL, type IntakeSlot } from '@/types';
import { useDialog } from '@/contexts/DialogContext';

const NOTIF_ENABLED_KEY = 'youngyang:notifications-enabled';
const NOTIF_TIMES_KEY = 'youngyang:notifications-times';

const SLOTS: IntakeSlot[] = ['morning', 'lunch', 'evening', 'bedtime'];

export default function SettingsPage() {
  const nav = useNavigate();
  const premium = usePremiumContext();
  const points = usePoints();
  const supplements = useSupplements();
  const dialog = useDialog();

  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => localStorage.getItem(NOTIF_ENABLED_KEY) !== '0');
  const [times, setTimes] = useState<Record<IntakeSlot, string>>(() => {
    try {
      const raw = localStorage.getItem(NOTIF_TIMES_KEY);
      if (raw) return { ...DEFAULT_SLOT_TIMES, ...JSON.parse(raw) };
    } catch { /* noop */ }
    return { ...DEFAULT_SLOT_TIMES };
  });

  // 알림 설정 변경 시 자동 sync
  useEffect(() => {
    if (supplements.loading) return;
    localStorage.setItem(NOTIF_ENABLED_KEY, notifEnabled ? '1' : '0');
    localStorage.setItem(NOTIF_TIMES_KEY, JSON.stringify(times));
    if (notifEnabled) {
      syncSchedules(buildSchedules(supplements.items, times)).catch(() => {});
    } else {
      clearAllSchedules().catch(() => {});
    }
  }, [notifEnabled, times, supplements.items, supplements.loading]);

  const onTimeChange = (slot: IntakeSlot, value: string) => {
    setTimes((prev) => ({ ...prev, [slot]: value }));
  };

  const onRestore = async () => {
    await premium.restore();
    await dialog.openAlert({ title: '구매 내역 확인 완료', description: '프리미엄 상태를 최신화했어요' });
  };

  const onRefundInfo = async () => {
    await dialog.openAlert({
      title: '환불 안내',
      description:
        '환불은 토스 앱 > 전체 > 게임 > 프로필 > 구매내역에서 요청할 수 있어요.\n\n앱에서는 환불 기능을 제공하지 않아요. 환불 권한은 앱마켓(토스)에 있습니다.',
    });
  };

  const onResetAll = async () => {
    const first = await dialog.openConfirm({
      title: '모든 데이터 삭제',
      description: '영양제·기록·포인트·프리미엄 상태가 모두 삭제돼요.',
      confirmLabel: '계속',
    });
    if (!first) return;
    const second = await dialog.openConfirm({
      title: '정말 삭제할까요?',
      description: '되돌릴 수 없어요.',
      confirmLabel: '삭제',
    });
    if (!second) return;
    await resetDB_YYH();
    localStorage.clear();
    await dialog.openAlert({ title: '초기화 완료' });
    nav('/intro', { replace: true });
  };

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', margin: '0 0 20px' }}>설정</h1>

      {/* 알림 */}
      <Section title="알림">
        <Row
          label="알림 사용"
          right={
            <Switch
              on={notifEnabled}
              onChange={(v) => setNotifEnabled(v)}
            />
          }
        />
        {notifEnabled && SLOTS.map((slot) => (
          <Row
            key={slot}
            label={`${INTAKE_SLOT_LABEL[slot]} 알림 시간`}
            right={
              <input
                type="time"
                value={times[slot]}
                onChange={(e) => onTimeChange(slot, e.target.value)}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 15,
                  fontFamily: 'inherit',
                }}
              />
            }
          />
        ))}
      </Section>

      {/* 프리미엄 */}
      <Section title="프리미엄">
        <Row
          label="멤버십"
          right={
            premium.status.active ? (
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 10px',
                  background: '#3182F6',
                  color: '#FFFFFF',
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                PRO
              </span>
            ) : (
              <span style={{ fontSize: 13, color: '#6B7280' }}>무료</span>
            )
          }
        />
        {premium.status.active && premium.status.expiresAt && (
          <Row
            label="다음 결제일"
            right={<span style={{ fontSize: 13, color: '#4B5563' }}>{new Date(premium.status.expiresAt).toLocaleDateString('ko-KR')}</span>}
          />
        )}
        {!premium.status.active && (
          <RowButton label="영양해 프로 보기" onClick={() => nav('/paywall')} />
        )}
        <RowButton label="구매 복원" onClick={onRestore} />
        <RowButton label="환불 안내" onClick={onRefundInfo} />
      </Section>

      {/* 포인트 */}
      <Section title="포인트">
        <Row
          label="현재 포인트"
          right={<span style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{points.balance.toLocaleString()}p</span>}
        />
        <Row
          label="포인트 내역"
          right={<span style={{ fontSize: 13, color: '#6B7280' }}>{points.history.length}건</span>}
        />
      </Section>

      {/* 기타 */}
      <Section title="기타">
        <RowButton label="이용약관" onClick={() => dialog.openAlert({ title: '이용약관', description: '실제 URL로 교체 예정입니다.' })} />
        <RowButton label="개인정보처리방침" onClick={() => dialog.openAlert({ title: '개인정보처리방침', description: '실제 URL로 교체 예정입니다.' })} />
        <Row label="버전" right={<span style={{ fontSize: 13, color: '#6B7280' }}>v1.0.0</span>} />
      </Section>

      {/* 위험 */}
      <button
        onClick={onResetAll}
        style={{
          width: '100%',
          marginTop: 24,
          padding: '14px',
          background: '#FFEEEE',
          color: '#E63333',
          border: 'none',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        모든 데이터 초기화
      </button>

      <BottomTabBar />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', margin: '0 0 8px', padding: '0 4px' }}>
        {title}
      </h2>
      <div style={{ background: '#F9FAFB', borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #F3F4F6', minHeight: 56 }}>
      <span style={{ fontSize: 15, color: '#191F28' }}>{label}</span>
      {right}
    </div>
  );
}

function RowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid #F3F4F6',
        fontSize: 15,
        color: '#191F28',
        cursor: 'pointer',
        fontFamily: 'inherit',
        minHeight: 56,
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span style={{ color: '#9CA3AF' }}>›</span>
    </button>
  );
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: on ? '#3182F6' : '#D1D5DB',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 200ms',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 22 : 2,
          width: 24,
          height: 24,
          borderRadius: 12,
          background: '#FFFFFF',
          transition: 'left 200ms',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}
