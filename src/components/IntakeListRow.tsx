import type { IntakeStatus, IntakeSlot, Supplement } from '@/types';
import { INTAKE_SLOT_LABEL, DEFAULT_SLOT_TIMES } from '@/types';

interface Props {
  supplement: Supplement;
  slot: IntakeSlot;
  status: IntakeStatus;
  onToggle: () => void;
}

/**
 * 1-tap 복용 체크 리스트 항목.
 * 전체 행이 탭 영역 (최소 56px 높이), 체크박스는 시각적 표시만.
 */
export function IntakeListRow({ supplement, slot, status, onToggle }: Props) {
  const taken = status === 'taken';
  const slotTime = DEFAULT_SLOT_TIMES[slot];

  return (
    <button
      onClick={onToggle}
      aria-label={`${supplement.name} ${INTAKE_SLOT_LABEL[slot]} 복용 체크`}
      style={{
        width: '100%',
        minHeight: 56,
        padding: '12px 16px',
        background: taken ? '#F0FAF6' : '#FFFFFF',
        border: '1px solid ' + (taken ? '#027648' : '#E5E7EB'),
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 200ms ease, border-color 200ms ease',
      }}
    >
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#191F28' }}>{supplement.name}</div>
        <div style={{ fontSize: 13, color: '#4B5563', marginTop: 2 }}>
          {supplement.dose} · {slotTime}
        </div>
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          background: taken ? '#027648' : '#FFFFFF',
          border: '2px solid ' + (taken ? '#027648' : '#D1D5DB'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {taken && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}
