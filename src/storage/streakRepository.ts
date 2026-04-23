import type { StreakState } from '@/types';
import { INITIAL_STREAK } from '@/types';
import { openDB_YYH } from './db';

const KEY = 'current';

export const streakRepo = {
  async get(): Promise<StreakState> {
    const db = await openDB_YYH();
    const result = await db.get('streak', KEY);
    db.close();
    return (result as StreakState | undefined) ?? INITIAL_STREAK;
  },

  async set(state: StreakState): Promise<void> {
    const db = await openDB_YYH();
    await db.put('streak', state, KEY);
    db.close();
  },

  async reset(): Promise<void> {
    const db = await openDB_YYH();
    await db.put('streak', INITIAL_STREAK, KEY);
    db.close();
  },
};
