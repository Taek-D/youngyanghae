import type { Supplement } from '@/types';
import { openDB_YYH } from './db';

export const supplementRepo = {
  async create(s: Supplement): Promise<void> {
    const db = await openDB_YYH();
    await db.put('supplements', s);
    db.close();
  },

  async update(s: Supplement): Promise<void> {
    const db = await openDB_YYH();
    await db.put('supplements', { ...s, updatedAt: Date.now() });
    db.close();
  },

  async get(id: string): Promise<Supplement | undefined> {
    const db = await openDB_YYH();
    const result = await db.get('supplements', id);
    db.close();
    return result;
  },

  async list(): Promise<Supplement[]> {
    const db = await openDB_YYH();
    const result = await db.getAll('supplements');
    db.close();
    return result.sort((a, b) => a.createdAt - b.createdAt);
  },

  async remove(id: string): Promise<void> {
    const db = await openDB_YYH();
    await db.delete('supplements', id);
    db.close();
  },

  async count(): Promise<number> {
    const db = await openDB_YYH();
    const result = await db.count('supplements');
    db.close();
    return result;
  },

  async deleteAll(): Promise<void> {
    const db = await openDB_YYH();
    await db.clear('supplements');
    db.close();
  },
};
