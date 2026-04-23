import { useCallback, useEffect, useState } from 'react';
import { premiumRepo } from '@/storage/premiumRepository';
import { purchase, getCompletedOrRefundedOrders, parseIAPError } from '@/services/iapService';
import { IAP_SKU, PLAN_DURATION_MS, type IAPSkuKey } from '@/config/premiumConstants';
import { PREMIUM_GRANT_DAYS } from '@/config/pointsConstants';
import { INITIAL_PREMIUM } from '@/types';
import type { PremiumStatus } from '@/types';

export type BuyResult =
  | { ok: true; status: PremiumStatus }
  | { ok: false; reason: 'unsupported' | 'canceled' | 'error'; message: string };

export function usePremium() {
  const [status, setStatus] = useState<PremiumStatus>(INITIAL_PREMIUM);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await premiumRepo.getStatus();
    // 만료 자동 downgrade
    if (s.active && s.expiresAt && s.expiresAt < Date.now()) {
      await premiumRepo.clearStatus();
      setStatus(INITIAL_PREMIUM);
    } else {
      setStatus(s);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const buy = useCallback(async (plan: IAPSkuKey): Promise<BuyResult> => {
    try {
      const result = await purchase(plan);
      if (!result) return { ok: false, reason: 'unsupported', message: '이 환경에서는 결제를 할 수 없어요' };
      const durMs = PLAN_DURATION_MS[plan];
      const next: PremiumStatus = {
        active: true,
        plan,
        source: 'iap',
        sku: result.productId,
        expiresAt: durMs ? Date.now() + durMs : undefined,
      };
      await premiumRepo.setStatus(next);
      setStatus(next);
      return { ok: true, status: next };
    } catch (e) {
      const info = parseIAPError(e);
      return {
        ok: false,
        reason: info.code === 'CANCELED' || info.code === 'USER_CANCEL' ? 'canceled' : 'error',
        message: info.userMessage,
      };
    }
  }, []);

  /** 포인트 교환으로 프리미엄 활성화 (points_1d or points_7d) */
  const grantByPoints = useCallback(async (tier: 'premium_1d' | 'premium_7d') => {
    const days = PREMIUM_GRANT_DAYS[tier];
    const next: PremiumStatus = {
      active: true,
      plan: tier === 'premium_1d' ? 'points_1d' : 'points_7d',
      source: 'points',
      expiresAt: Date.now() + days * 86400_000,
    };
    await premiumRepo.setStatus(next);
    setStatus(next);
    return next;
  }, []);

  /**
   * 구매 복원 (앱 시작 시 자동 호출).
   * - COMPLETED orders → 해당 SKU로 프리미엄 활성화 (기존에 없던 경우)
   * - REFUNDED orders → 프리미엄 해제 (환불 감지)
   */
  const restore = useCallback(async () => {
    const orders = await getCompletedOrRefundedOrders();
    if (orders.length === 0) return;

    const refundedSkus = new Set(orders.filter((o) => o.status === 'REFUNDED').map((o) => o.productId));
    const completedSkus = new Set(orders.filter((o) => o.status === 'COMPLETED').map((o) => o.productId));

    const current = await premiumRepo.getStatus();

    // 환불 감지 → 해제
    if (current.active && current.sku && refundedSkus.has(current.sku) && !completedSkus.has(current.sku)) {
      await premiumRepo.clearStatus();
      setStatus(INITIAL_PREMIUM);
      return;
    }

    // 복원 (프리미엄 상태 없음 + COMPLETED 있음)
    if (!current.active && completedSkus.size > 0) {
      const matchedPlan = (Object.entries(IAP_SKU) as Array<[IAPSkuKey, string]>)
        .find(([, sku]) => completedSkus.has(sku));
      if (matchedPlan) {
        const [plan, sku] = matchedPlan;
        const durMs = PLAN_DURATION_MS[plan];
        const next: PremiumStatus = {
          active: true,
          plan,
          source: 'iap',
          sku,
          expiresAt: durMs ? Date.now() + durMs : undefined,
          lastRestoredAt: Date.now(),
        };
        await premiumRepo.setStatus(next);
        setStatus(next);
      }
    }
  }, []);

  return { status, loading, buy, grantByPoints, restore, refresh };
}
