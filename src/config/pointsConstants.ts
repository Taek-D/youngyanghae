/**
 * 앱 내 포인트 경제 상수
 *
 * 포인트는 앱 내 자체 화폐 (실제 토스포인트 아님).
 * Earn: 광고 시청 + 스트릭 마일스톤.
 * Spend: 프리미엄 교환권 + 스트릭 복구권.
 */

export const POINTS_EARN = {
  ad_watch: 50,       // 보상형 광고 1회 시청
  streak_3: 100,      // 3일 연속 달성 보너스
  streak_7: 200,      // 7일 연속
  streak_30: 1000,    // 30일 연속
} as const;

export const POINTS_SPEND = {
  premium_1d: 1000,   // 프로 1일권 교환
  premium_7d: 5000,   // 프로 7일권 교환
  freeze: 500,        // 스트릭 복구권 1장
} as const;

/** 신규 가입 시 그랜트 (프로모션 시 상향 조정 가능) */
export const INITIAL_GRANT = 0;

/** 프리미엄 교환 시 부여되는 일수 */
export const PREMIUM_GRANT_DAYS: Record<'premium_1d' | 'premium_7d', number> = {
  premium_1d: 1,
  premium_7d: 7,
};
