import { useCallback, useState } from 'react';
import { showRewardedAd } from '@/services/adService';
import { usePoints } from './usePoints';
import { POINTS_EARN } from '@/config/pointsConstants';

export function useRewardedAdFlow() {
  const points = usePoints();
  const [busy, setBusy] = useState(false);

  const watchAndEarn = useCallback(async (): Promise<{ rewarded: boolean; earned: number }> => {
    if (busy) return { rewarded: false, earned: 0 };
    setBusy(true);
    try {
      const result = await showRewardedAd();
      if (!result.rewarded) return { rewarded: false, earned: 0 };
      const nextBalance = await points.earn('ad_watch', POINTS_EARN.ad_watch);
      return { rewarded: true, earned: POINTS_EARN.ad_watch };
    } finally {
      setBusy(false);
    }
  }, [busy, points]);

  return { watchAndEarn, busy, balance: points.balance };
}
