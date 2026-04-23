import { useCallback, useEffect, useState } from 'react';
import { streakRepo } from '@/storage/streakRepository';
import { computeNextStreak, shouldMilestoneReward, todayISO } from '@/services/streakService';
import { INITIAL_STREAK } from '@/types';
import type { StreakState } from '@/types';

export function useStreak() {
  const [state, setState] = useState<StreakState>(INITIAL_STREAK);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await streakRepo.get();
    setState(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * 오늘 복용 체크 시 호출. 스트릭을 전진하고 마일스톤 달성 여부 반환.
   * 같은 날 중복 호출은 idempotent (중복 적립 없음).
   */
  const advanceToday = useCallback(async (
    dateISO: string = todayISO(),
  ): Promise<{ state: StreakState; milestone: 3 | 7 | 30 | null; wasAdvanced: boolean }> => {
    const prev = state;
    const next = computeNextStreak(prev, dateISO);
    const wasAdvanced = next.currentDays !== prev.currentDays;
    await streakRepo.set(next);
    setState(next);
    const milestone = wasAdvanced ? shouldMilestoneReward(next.currentDays) : null;
    return { state: next, milestone, wasAdvanced };
  }, [state]);

  const addFreeze = useCallback(async (count: number = 1) => {
    const next = { ...state, freezesAvailable: state.freezesAvailable + count };
    await streakRepo.set(next);
    setState(next);
  }, [state]);

  const consumeFreeze = useCallback(async (): Promise<boolean> => {
    if (state.freezesAvailable <= 0) return false;
    const next = { ...state, freezesAvailable: state.freezesAvailable - 1 };
    await streakRepo.set(next);
    setState(next);
    return true;
  }, [state]);

  const reset = useCallback(async () => {
    await streakRepo.reset();
    setState(INITIAL_STREAK);
  }, []);

  return { state, loading, advanceToday, addFreeze, consumeFreeze, reset, refresh };
}
