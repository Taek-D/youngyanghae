import { openDB, type IDBPDatabase } from 'idb';

export const DB_NAME = 'youngyanghae';
export const DB_VERSION = 1;

export interface YYHSchema {
  supplements: { key: string };
  intakeLogs: { key: string; indexes: { 'by-date': string; 'by-supplement': string } };
  streak: { key: string };          // singleton key 'current'
  points: { key: string };          // singleton key 'balance'
  pointsTx: { key: string };
  premium: { key: string };         // singleton key 'status'
  pendingOrders: { key: string };
}

export async function openDB_YYH(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('supplements', { keyPath: 'id' });

        const logs = db.createObjectStore('intakeLogs', { keyPath: 'id' });
        logs.createIndex('by-date', 'dateISO');
        logs.createIndex('by-supplement', 'supplementId');

        db.createObjectStore('streak');
        db.createObjectStore('points');
        db.createObjectStore('pointsTx', { keyPath: 'id' });
        db.createObjectStore('premium');
        db.createObjectStore('pendingOrders', { keyPath: 'orderId' });
      }
    },
  });
}

/** 테스트·초기화용 전체 삭제 */
export async function resetDB_YYH(): Promise<void> {
  const { deleteDB } = await import('idb');
  await deleteDB(DB_NAME);
}
