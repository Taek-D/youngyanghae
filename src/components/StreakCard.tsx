import type { StreakState } from '@/types';

export function StreakCard({ streak, onFreezeClick }: {
  streak: StreakState;
  onFreezeClick?: () => void;
}) {
  return (
    <div
      style={{
        background: '#E8F3FF',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#4B5563' }}>🔥 연속</span>
      </div>
      <div style={{ fontSize: 29, fontWeight: 700, color: '#E45600', lineHeight: '43.5px' }}>
        {streak.currentDays}일
      </div>
      <div style={{ fontSize: 13, color: '#4B5563', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>최장 {streak.longestDays}일 · 복구권 {streak.freezesAvailable}개</span>
        {onFreezeClick && streak.freezesAvailable > 0 && (
          <button
            onClick={onFreezeClick}
            style={{
              background: '#FFFFFF',
              color: '#3182F6',
              border: 'none',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            복구
          </button>
        )}
      </div>
    </div>
  );
}
