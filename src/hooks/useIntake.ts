import { useCallback, useEffect, useState } from 'react';
import { intakeLogRepo } from '@/storage/intakeLogRepository';
import { todayISO } from '@/services/streakService';
import type { IntakeLog, IntakeSlot, Supplement } from '@/types';
import { buildLogId } from '@/types';

/**
 * 오늘자 복용 로그 훅.
 * supplementId+slot 페어로 status 조회 및 토글.
 */
export function useIntake(dateISO: string = todayISO()) {
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await intakeLogRepo.getByDate(dateISO);
    setLogs(list);
    setLoading(false);
  }, [dateISO]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getStatus = useCallback(
    (supplementId: string, slot: IntakeSlot) => {
      const id = buildLogId(supplementId, dateISO, slot);
      return logs.find((l) => l.id === id)?.status ?? 'missed';
    },
    [logs, dateISO],
  );

  const toggle = useCallback(
    async (supplementId: string, slot: IntakeSlot): Promise<IntakeLog> => {
      const current = getStatus(supplementId, slot);
      const nextStatus = current === 'taken' ? 'skipped' : 'taken';
      const log = await intakeLogRepo.logIntake({
        supplementId,
        dateISO,
        slot,
        status: nextStatus,
      });
      await refresh();
      return log;
    },
    [getStatus, dateISO, refresh],
  );

  /** 주어진 영양제+슬롯 목록에서 모두 taken 상태인지 */
  const isAllTaken = useCallback(
    (pairs: Array<{ supplementId: string; slot: IntakeSlot }>) =>
      pairs.length > 0 && pairs.every((p) => getStatus(p.supplementId, p.slot) === 'taken'),
    [getStatus],
  );

  /** 영양제 목록에서 오늘 복용해야 할 (영양제, 슬롯) 페어 생성 */
  const generateTodayPairs = useCallback(
    (supplements: Supplement[]): Array<{ supplement: Supplement; slot: IntakeSlot }> => {
      const weekday = new Date(dateISO).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const pairs: Array<{ supplement: Supplement; slot: IntakeSlot }> = [];
      for (const s of supplements) {
        if (!s.weekdays.includes(weekday)) continue;
        for (const slot of s.slots) pairs.push({ supplement: s, slot });
      }
      return pairs;
    },
    [dateISO],
  );

  return { logs, loading, getStatus, toggle, isAllTaken, generateTodayPairs, refresh };
}
