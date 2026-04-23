import type { IntakeLog, IntakeSlot } from '@/types';
import { buildLogId } from '@/types';
import { openDB_YYH } from './db';

export const intakeLogRepo = {
  async logIntake(input: {
    supplementId: string;
    dateISO: string;
    slot: IntakeSlot;
    status: IntakeLog['status'];
  }): Promise<IntakeLog> {
    const log: IntakeLog = {
      id: buildLogId(input.supplementId, input.dateISO, input.slot),
      supplementId: input.supplementId,
      dateISO: input.dateISO,
      slot: input.slot,
      status: input.status,
      takenAt: input.status === 'taken' ? Date.now() : undefined,
    };
    const db = await openDB_YYH();
    await db.put('intakeLogs', log);
    db.close();
    return log;
  },

  async getByDate(dateISO: string): Promise<IntakeLog[]> {
    const db = await openDB_YYH();
    const result = await db.getAllFromIndex('intakeLogs', 'by-date', dateISO);
    db.close();
    return result;
  },

  async getBySupplement(supplementId: string): Promise<IntakeLog[]> {
    const db = await openDB_YYH();
    const result = await db.getAllFromIndex('intakeLogs', 'by-supplement', supplementId);
    db.close();
    return result;
  },

  async getByRange(fromISO: string, toISO: string): Promise<IntakeLog[]> {
    const db = await openDB_YYH();
    const range = IDBKeyRange.bound(fromISO, toISO);
    const result = await db.getAllFromIndex('intakeLogs', 'by-date', range);
    db.close();
    return result;
  },

  async remove(id: string): Promise<void> {
    const db = await openDB_YYH();
    await db.delete('intakeLogs', id);
    db.close();
  },

  async deleteAll(): Promise<void> {
    const db = await openDB_YYH();
    await db.clear('intakeLogs');
    db.close();
  },
};
