import { useCallback, useEffect, useState } from 'react';
import { pointsRepo } from '@/storage/pointsRepository';
import type { PointsSource, PointsTransaction } from '@/types';

export function usePoints() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [b, h] = await Promise.all([
      pointsRepo.getBalance(),
      pointsRepo.history(),
    ]);
    setBalance(b);
    setHistory(h);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const earn = useCallback(async (source: PointsSource, amount: number) => {
    const next = await pointsRepo.earn(source, amount);
    await refresh();
    return next;
  }, [refresh]);

  const spend = useCallback(async (source: PointsSource, amount: number): Promise<{ ok: boolean; balance: number }> => {
    try {
      const next = await pointsRepo.spend(source, amount);
      await refresh();
      return { ok: true, balance: next };
    } catch {
      return { ok: false, balance };
    }
  }, [refresh, balance]);

  return { balance, history, loading, earn, spend, refresh };
}
