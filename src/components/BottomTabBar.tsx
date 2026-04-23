import { useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconPill, IconChart, IconGear } from './icons';

interface TabItem {
  path: string;
  label: string;
  Icon: (p: { size?: number; filled?: boolean; color?: string }) => JSX.Element;
}

const TABS: TabItem[] = [
  { path: '/', label: '홈', Icon: IconHome },
  { path: '/supplements', label: '영양제', Icon: IconPill },
  { path: '/history', label: '기록', Icon: IconChart },
  { path: '/settings', label: '설정', Icon: IconGear },
];

/**
 * 하단 플로팅 탭바 — 모노톤 SVG 아이콘 (심사 규정 준수).
 * 활성 상태: blue500 + filled, 비활성: grey500 + stroke only.
 */
export function BottomTabBar() {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <nav
      aria-label="주요 탐색"
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
      {TABS.map(({ path, label, Icon }) => {
        const active = path === '/' ? loc.pathname === '/' : loc.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => nav(path)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
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
              color: active ? '#3182F6' : '#6B7280',
              transition: 'background 150ms, color 150ms',
            }}
          >
            <Icon size={22} filled={active} />
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
