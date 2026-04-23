import type { PremiumStatus, PendingOrder } from '@/types';
import { INITIAL_PREMIUM } from '@/types';
import { openDB_YYH } from './db';

const STATUS_KEY = 'status';

export const premiumRepo = {
  async getStatus(): Promise<PremiumStatus> {
    const db = await openDB_YYH();
    const v = await db.get('premium', STATUS_KEY);
    db.close();
    return (v as PremiumStatus | undefined) ?? INITIAL_PREMIUM;
  },

  async setStatus(status: PremiumStatus): Promise<void> {
    const db = await openDB_YYH();
    await db.put('premium', status, STATUS_KEY);
    db.close();
  },

  async clearStatus(): Promise<void> {
    const db = await openDB_YYH();
    await db.put('premium', INITIAL_PREMIUM, STATUS_KEY);
    db.close();
  },

  async addPendingOrder(order: PendingOrder): Promise<void> {
    const db = await openDB_YYH();
    await db.put('pendingOrders', order);
    db.close();
  },

  async getPendingOrders(): Promise<PendingOrder[]> {
    const db = await openDB_YYH();
    const result = (await db.getAll('pendingOrders')) as PendingOrder[];
    db.close();
    return result;
  },

  async removePendingOrder(orderId: string): Promise<void> {
    const db = await openDB_YYH();
    await db.delete('pendingOrders', orderId);
    db.close();
  },
};
