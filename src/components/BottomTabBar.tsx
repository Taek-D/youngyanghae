import { useLocation, useNavigate } from 'react-router-dom';

interface TabItem {
  path: string;
  label: string;
  icon: string; // simple unicode/symbol — 추후 모노톤 SVG로 교체
}

const TABS: TabItem[] = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/supplements', label: '영양제', icon: '💊' },
  { path: '/history', label: '기록', icon: '📊' },
  { path: '/settings', label: '설정', icon: '⚙️' },
];

/**
 * 하단 플로팅 탭바 — 모노톤 아이콘 원칙.
 * 현재 이모지는 프로토타입용 (심사 전 모노톤 SVG로 교체 필요).
 */
export function BottomTabBar() {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: 8,
        gap: 4,
        zIndex: 10,
      }}
    >
      {TABS.map((t) => {
        const active = loc.pathname === t.path || (t.path !== '/' && loc.pathname.startsWith(t.path));
        return (
          <button
            key={t.path}
            onClick={() => nav(t.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 16px',
              background: active ? '#E8F3FF' : 'transparent',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              fontFamily: 'inherit',
              minWidth: 56,
            }}
          >
            <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(100%)' }}>{t.icon}</span>
            <span style={{ fontSize: 11, color: active ? '#3182F6' : '#6B7280', fontWeight: active ? 600 : 400 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
