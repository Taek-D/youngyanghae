import type { PointsSource, PointsTransaction } from '@/types';
import { openDB_YYH } from './db';

const BALANCE_KEY = 'balance';

export const pointsRepo = {
  async getBalance(): Promise<number> {
    const db = await openDB_YYH();
    const v = await db.get('points', BALANCE_KEY);
    db.close();
    return typeof v === 'number' ? v : 0;
  },

  async earn(source: PointsSource, amount: number): Promise<number> {
    if (amount <= 0) throw new Error('earn amount must be positive');
    const db = await openDB_YYH();
    const current = (await db.get('points', BALANCE_KEY) ?? 0) as number;
    const next = current + amount;
    const tx: PointsTransaction = {
      id: crypto.randomUUID(),
      type: 'earn',
      source,
      amount,
      createdAt: Date.now(),
    };
    await db.put('points', next, BALANCE_KEY);
    await db.put('pointsTx', tx);
    db.close();
    return next;
  },

  async spend(source: PointsSource, amount: number): Promise<number> {
    if (amount <= 0) throw new Error('spend amount must be positive');
    const db = await openDB_YYH();
    const current = (await db.get('points', BALANCE_KEY) ?? 0) as number;
    if (current < amount) {
      db.close();
      throw new Error('insufficient points');
    }
    const next = current - amount;
    const tx: PointsTransaction = {
      id: crypto.randomUUID(),
      type: 'spend',
      source,
      amount,
      createdAt: Date.now(),
    };
    await db.put('points', next, BALANCE_KEY);
    await db.put('pointsTx', tx);
    db.close();
    return next;
  },

  async history(): Promise<PointsTransaction[]> {
    const db = await openDB_YYH();
    const all = (await db.getAll('pointsTx')) as PointsTransaction[];
    db.close();
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
};
