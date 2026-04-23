import type { StreakState } from '@/types';

/**
 * dateISO 간 일수 차이 (UTC 기준, b - a).
 * 예: daysBetween('2026-04-22', '2026-04-23') === 1
 */
export function daysBetween(aISO: string, bISO: string): number {
  const toUTC = (s: string) =>
    Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  return Math.round((toUTC(bISO) - toUTC(aISO)) / 86_400_000);
}

/**
 * 오늘 복용 체크 후의 다음 스트릭 상태 계산.
 * - gap === 0: 같은 날 중복 체크 → 변경 없음
 * - gap === 1: 연속 → currentDays +1
 * - gap >= 2: 끊김 → currentDays = 1 (오늘부터 재시작)
 * - 첫 체크 (lastCheckDate === ''): currentDays = 1
 */
export function computeNextStreak(
  prev: StreakState,
  todayISO: string,
): StreakState {
  let currentDays: number;

  if (prev.lastCheckDate === '') {
    currentDays = 1;
  } else {
    const gap = daysBetween(prev.lastCheckDate, todayISO);
    if (gap === 0) currentDays = prev.currentDays;
    else if (gap === 1) currentDays = prev.currentDays + 1;
    else if (gap < 0) currentDays = prev.currentDays; // 과거 날짜 중복 체크 방지
    else currentDays = 1;
  }

  const longestDays = Math.max(prev.longestDays, currentDays);

  return {
    ...prev,
    currentDays,
    longestDays,
    lastCheckDate: todayISO,
  };
}

/**
 * 마일스톤 달성 시 포인트 적립 대상 판단.
 * 정확히 3·7·30일에만 한 번 보상 (중복 방지).
 */
export function shouldMilestoneReward(days: number): 3 | 7 | 30 | null {
  if (days === 30) return 30;
  if (days === 7) return 7;
  if (days === 3) return 3;
  return null;
}

/**
 * 오늘 ISO 날짜 (로컬 타임존 기준, yyyy-MM-dd).
 */
export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
