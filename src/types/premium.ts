export type PremiumPlan = 'monthly' | 'yearly' | 'lifetime' | 'points_1d' | 'points_7d';
export type PremiumSource = 'iap' | 'points';

export interface PremiumStatus {
  active: boolean;
  plan?: PremiumPlan;
  source?: PremiumSource;
  sku?: string;
  /** epoch ms, lifetime인 경우 undefined */
  expiresAt?: number;
  lastRestoredAt?: number;
}

export interface PendingOrder {
  orderId: string;
  plan: PremiumPlan;
  sku: string;
  createdAt: number;
}

export const INITIAL_PREMIUM: PremiumStatus = {
  active: false,
};
