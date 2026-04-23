/**
 * 모노톤 스트로크 아이콘 세트.
 * 심사 규정: 네비게이션·탭바 아이콘은 컬러 사용 금지, 모노톤만 허용.
 * 사용: <IconHome filled={active} />
 */

interface IconProps {
  size?: number;
  /** 활성 상태 — filled=true면 fill, 아니면 stroke only */
  filled?: boolean;
  /** 커스텀 색 — 기본은 currentColor */
  color?: string;
}

const baseProps = (size = 24, color?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color ?? 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export function IconHome({ size = 24, filled = false, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V10.5z"
        fill={filled ? (color ?? 'currentColor') : 'none'}
      />
    </svg>
  );
}

/** 알약 (캡슐) 모양 — 영양제 탭 */
export function IconPill({ size = 24, filled = false, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <rect
        x="2"
        y="8"
        width="20"
        height="8"
        rx="4"
        fill={filled ? (color ?? 'currentColor') : 'none'}
      />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  );
}

/** 바 차트 — 기록 탭 */
export function IconChart({ size = 24, filled = false, color }: IconProps) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect x="4" y="13" width="3" height="7" rx="1" fill={color ?? 'currentColor'} />
        <rect x="10.5" y="8" width="3" height="12" rx="1" fill={color ?? 'currentColor'} />
        <rect x="17" y="4" width="3" height="16" rx="1" fill={color ?? 'currentColor'} />
      </svg>
    );
  }
  return (
    <svg {...baseProps(size, color)}>
      <rect x="4" y="13" width="3" height="7" rx="1" />
      <rect x="10.5" y="8" width="3" height="12" rx="1" />
      <rect x="17" y="4" width="3" height="16" rx="1" />
    </svg>
  );
}

/** 설정 — 기어 */
export function IconGear({ size = 24, filled = false, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <circle cx="12" cy="12" r="3" fill={filled ? (color ?? 'currentColor') : 'none'} />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h0a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

/** 동전 — 포인트 배지용 */
export function IconCoin({ size = 24, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9h4.5a2.5 2.5 0 010 5H9v3m0-8h6m-6 5h6" />
    </svg>
  );
}

/** 불꽃 — 스트릭 */
export function IconFlame({ size = 24, filled = true, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <path
        d="M12 2s-5 4-5 9a5 5 0 0010 0c0-1.5-.5-2.5-1-3.5-.5-1-1-2-1-3.5-2 1-3 3.5-3 3.5z"
        fill={filled ? (color ?? 'currentColor') : 'none'}
      />
    </svg>
  );
}

/** 체크 — 완료 표시 */
export function IconCheck({ size = 24, color }: IconProps) {
  return (
    <svg {...baseProps(size, color)}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
