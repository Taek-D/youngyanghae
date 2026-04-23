/**
 * 프리미엄 비즈니스 룰 상수
 *
 * 해지해 패턴 계승 — FREE_SUPPLEMENT_LIMIT=3, 4중 게이팅, 광고+IAP 하이브리드.
 *
 * IAP SKU는 앱인토스 콘솔에서 비소모품(Non-Consumable)으로 발급 후 교체.
 */

export const IAP_SKU = {
  /** 월 ₩3,900 1개월 이용권 (비소모품 — 자동 갱신 없음) */
  monthly: 'ait.XXXXXX.yyh.monthly',
  /** 연 ₩29,900 12개월 이용권 (35% 할인, 비소모품 — 자동 갱신 없음) */
  yearly: 'ait.XXXXXX.yyh.yearly',
  /** 일회성 ₩39,900 평생 이용 */
  lifetime: 'ait.XXXXXX.yyh.lifetime',
} as const;

export type IAPSkuKey = keyof typeof IAP_SKU;

export const PREMIUM_PRICES_KRW = {
  monthly: 3900,
  yearly: 29900,
  lifetime: 39900,
} as const;

export const PREMIUM_LABELS: Record<IAPSkuKey, string> = {
  monthly: '1개월 이용권',
  yearly: '12개월 이용권',
  lifetime: '평생 이용',
};

export const PLAN_DURATION_MS: Record<IAPSkuKey, number | null> = {
  monthly: 30 * 86400_000,
  yearly: 365 * 86400_000,
  lifetime: null,
};

/** 무료 영양제 등록 최대 개수 (4개 이상 등록 시 페이월) */
export const FREE_SUPPLEMENT_LIMIT = 3;

/** 무료 사용자 히스토리 조회 가능 일수 (이전 데이터는 블러 + 페이월) */
export const FREE_HISTORY_DAYS = 7;
