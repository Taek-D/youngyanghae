import { describe, it, expect, afterEach } from 'vitest';
import { openDB_YYH, resetDB_YYH, DB_NAME, DB_VERSION } from './db';

describe('openDB_YYH', () => {
  afterEach(async () => { await resetDB_YYH(); });

  it('opens DB with correct name and version', async () => {
    const db = await openDB_YYH();
    expect(db.name).toBe(DB_NAME);
    expect(db.version).toBe(DB_VERSION);
    db.close();
  });

  it('creates all required object stores', async () => {
    const db = await openDB_YYH();
    const names = [...db.objectStoreNames].sort();
    expect(names).toEqual(['intakeLogs', 'pendingOrders', 'points', 'pointsTx', 'premium', 'streak', 'supplements']);
    db.close();
  });

  it('creates indexes on intakeLogs store', async () => {
    const db = await openDB_YYH();
    const tx = db.transaction('intakeLogs', 'readonly');
    const indexes = [...tx.store.indexNames].sort();
    expect(indexes).toEqual(['by-date', 'by-supplement']);
    db.close();
  });
});
