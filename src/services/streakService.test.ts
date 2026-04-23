import { describe, it, expect } from 'vitest';
import { daysBetween, computeNextStreak, shouldMilestoneReward, todayISO } from './streakService';
import { INITIAL_STREAK } from '@/types';

describe('daysBetween', () => {
  it('returns 1 for consecutive days', () => {
    expect(daysBetween('2026-04-22', '2026-04-23')).toBe(1);
  });
  it('returns 0 for same day', () => {
    expect(daysBetween('2026-04-23', '2026-04-23')).toBe(0);
  });
  it('returns negative for past', () => {
    expect(daysBetween('2026-04-23', '2026-04-20')).toBe(-3);
  });
  it('handles month boundary', () => {
    expect(daysBetween('2026-04-30', '2026-05-01')).toBe(1);
  });
});

describe('computeNextStreak', () => {
  it('first ever check sets currentDays=1', () => {
    const next = computeNextStreak(INITIAL_STREAK, '2026-04-23');
    expect(next.currentDays).toBe(1);
    expect(next.longestDays).toBe(1);
    expect(next.lastCheckDate).toBe('2026-04-23');
  });

  it('consecutive day increments', () => {
    const next = computeNextStreak(
      { currentDays: 5, longestDays: 5, lastCheckDate: '2026-04-22', freezesAvailable: 0 },
      '2026-04-23',
    );
    expect(next.currentDays).toBe(6);
    expect(next.longestDays).toBe(6);
  });

  it('same day repeat is idempotent', () => {
    const next = computeNextStreak(
      { currentDays: 5, longestDays: 5, lastCheckDate: '2026-04-23', freezesAvailable: 0 },
      '2026-04-23',
    );
    expect(next.currentDays).toBe(5);
    expect(next.longestDays).toBe(5);
  });

  it('gap >= 2 resets to 1 but preserves longest', () => {
    const next = computeNextStreak(
      { currentDays: 5, longestDays: 10, lastCheckDate: '2026-04-20', freezesAvailable: 0 },
      '2026-04-23',
    );
    expect(next.currentDays).toBe(1);
    expect(next.longestDays).toBe(10);
  });

  it('longest updates only when current exceeds it', () => {
    const next = computeNextStreak(
      { currentDays: 8, longestDays: 9, lastCheckDate: '2026-04-22', freezesAvailable: 0 },
      '2026-04-23',
    );
    expect(next.currentDays).toBe(9);
    expect(next.longestDays).toBe(9);
  });
});

describe('shouldMilestoneReward', () => {
  it('returns 3/7/30 on exact days', () => {
    expect(shouldMilestoneReward(3)).toBe(3);
    expect(shouldMilestoneReward(7)).toBe(7);
    expect(shouldMilestoneReward(30)).toBe(30);
  });
  it('returns null for non-milestones', () => {
    expect(shouldMilestoneReward(1)).toBeNull();
    expect(shouldMilestoneReward(5)).toBeNull();
    expect(shouldMilestoneReward(8)).toBeNull();
    expect(shouldMilestoneReward(60)).toBeNull();
  });
});

describe('todayISO', () => {
  it('formats yyyy-MM-dd', () => {
    const d = new Date('2026-04-23T15:30:00');
    expect(todayISO(d)).toBe('2026-04-23');
  });
  it('pads month/day to 2 digits', () => {
    const d = new Date('2026-01-05T00:00:00');
    expect(todayISO(d)).toBe('2026-01-05');
  });
});
