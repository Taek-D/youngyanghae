import { useNavigate } from 'react-router-dom';
import { useSupplements } from '@/hooks/useSupplements';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { BottomTabBar } from '@/components/BottomTabBar';
import { FREE_SUPPLEMENT_LIMIT } from '@/config/premiumConstants';
import { INTAKE_SLOT_LABEL } from '@/types';

export default function SupplementListPage() {
  const nav = useNavigate();
  const supplements = useSupplements();
  const premium = usePremiumContext();

  const atLimit = !premium.status.active && supplements.count >= FREE_SUPPLEMENT_LIMIT;

  const onAddClick = () => {
    if (atLimit) {
      nav('/paywall');
      return;
    }
    nav('/supplements/new');
  };

  if (supplements.loading) {
    return <div style={{ padding: 24 }}>불러오는 중…</div>;
  }

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', margin: 0 }}>내 영양제</h1>
        {!premium.status.active && (
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            ({supplements.count}/{FREE_SUPPLEMENT_LIMIT})
          </span>
        )}
        {premium.status.active && (
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
            PRO
          </span>
        )}
      </div>

      {supplements.items.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>
          <p style={{ fontSize: 17, margin: 0 }}>등록된 영양제가 없어요</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>아래 + 버튼으로 추가해보세요</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {supplements.items.map((s) => (
          <button
            key={s.id}
            onClick={() => nav(`/supplements/${s.id}`)}
            style={{
              textAlign: 'left',
              padding: '16px 16px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#191F28' }}>{s.name}</div>
              <div style={{ fontSize: 13, color: '#4B5563', marginTop: 2 }}>
                {s.slots.map((sl) => INTAKE_SLOT_LABEL[sl]).join('·')} · {s.dose}
              </div>
            </div>
            <span style={{ color: '#9CA3AF', fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>

      {atLimit && (
        <div
          onClick={() => nav('/paywall')}
          style={{
            marginTop: 16,
            padding: 16,
            background: '#E8F3FF',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1649B8' }}>
            🔒 프리미엄으로 무제한 등록
          </div>
          <div style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>
            영양해 프로로 업그레이드하면 영양제를 제한 없이 추가할 수 있어요.
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={onAddClick}
        aria-label="영양제 추가"
        style={{
          position: 'fixed',
          bottom: 96,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: atLimit ? '#9CA3AF' : '#3182F6',
          color: '#FFFFFF',
          border: 'none',
          fontSize: 28,
          fontWeight: 300,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(49, 130, 246, 0.3)',
          zIndex: 5,
        }}
      >
        +
      </button>

      <BottomTabBar />
    </div>
  );
}
