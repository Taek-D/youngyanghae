import { intakeLogRepo } from '@/storage/intakeLogRepository';
import type { IntakeLog, Supplement } from '@/types';

export interface DayAdherence {
  dateISO: string;
  taken: number;
  total: number;
  percent: number;
}

export interface SupplementAdherence {
  supplementId: string;
  name: string;
  taken: number;
  total: number;
  percent: number;
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** fromISO~toISO 범위에서 일별 달성률 계산 (요일 필터 반영) */
export async function weekAdherence(
  supplements: Supplement[],
  fromISO: string,
  toISO: string,
): Promise<DayAdherence[]> {
  const logs = await intakeLogRepo.getByRange(fromISO, toISO);
  const byDate = new Map<string, IntakeLog[]>();
  for (const l of logs) {
    const arr = byDate.get(l.dateISO) ?? [];
    arr.push(l);
    byDate.set(l.dateISO, arr);
  }

  const days: DayAdherence[] = [];
  let cursor = fromISO;
  while (cursor <= toISO) {
    const weekday = new Date(cursor + 'T00:00:00').getDay();
    let total = 0;
    for (const s of supplements) {
      if (!s.weekdays.includes(weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6)) continue;
      total += s.slots.length;
    }
    const takenCount = (byDate.get(cursor) ?? []).filter((l) => l.status === 'taken').length;
    days.push({
      dateISO: cursor,
      taken: takenCount,
      total,
      percent: total === 0 ? 0 : Math.round((takenCount / total) * 100),
    });
    cursor = addDays(cursor, 1);
  }
  return days;
}

/** 영양제별 복용률 */
export async function supplementAdherence(
  supplements: Supplement[],
  fromISO: string,
  toISO: string,
): Promise<SupplementAdherence[]> {
  const logs = await intakeLogRepo.getByRange(fromISO, toISO);
  const bySupplement = new Map<string, IntakeLog[]>();
  for (const l of logs) {
    const arr = bySupplement.get(l.supplementId) ?? [];
    arr.push(l);
    bySupplement.set(l.supplementId, arr);
  }

  return supplements.map((s) => {
    const days = daysInRangeForWeekdays(fromISO, toISO, s.weekdays);
    const total = days * s.slots.length;
    const taken = (bySupplement.get(s.id) ?? []).filter((l) => l.status === 'taken').length;
    return {
      supplementId: s.id,
      name: s.name,
      taken,
      total,
      percent: total === 0 ? 0 : Math.round((taken / total) * 100),
    };
  });
}

function daysInRangeForWeekdays(
  fromISO: string,
  toISO: string,
  weekdays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
): number {
  let count = 0;
  let cursor = fromISO;
  while (cursor <= toISO) {
    const wd = new Date(cursor + 'T00:00:00').getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    if (weekdays.includes(wd)) count++;
    cursor = addDays(cursor, 1);
  }
  return count;
}

export function last7Days(todayISO: string): { from: string; to: string } {
  return { from: addDays(todayISO, -6), to: todayISO };
}

export function last30Days(todayISO: string): { from: string; to: string } {
  return { from: addDays(todayISO, -29), to: todayISO };
}
