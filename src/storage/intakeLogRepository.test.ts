import { describe, it, expect, beforeEach } from 'vitest';
import { intakeLogRepo } from './intakeLogRepository';
import { resetDB_YYH } from './db';

describe('intakeLogRepo', () => {
  beforeEach(async () => { await resetDB_YYH(); });

  it('logs an intake and retrieves by date', async () => {
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-23', slot: 'morning', status: 'taken' });
    const logs = await intakeLogRepo.getByDate('2026-04-23');
    expect(logs).toHaveLength(1);
    expect(logs[0].supplementId).toBe('s1');
    expect(logs[0].status).toBe('taken');
    expect(logs[0].takenAt).toBeTypeOf('number');
  });

  it('returns empty array for dates with no logs', async () => {
    const logs = await intakeLogRepo.getByDate('2026-01-01');
    expect(logs).toEqual([]);
  });

  it('idempotent: same supplement+date+slot overwrites', async () => {
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-23', slot: 'morning', status: 'skipped' });
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-23', slot: 'morning', status: 'taken' });
    const logs = await intakeLogRepo.getByDate('2026-04-23');
    expect(logs).toHaveLength(1);
    expect(logs[0].status).toBe('taken');
  });

  it('getByRange returns inclusive range', async () => {
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-20', slot: 'morning', status: 'taken' });
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-23', slot: 'morning', status: 'taken' });
    await intakeLogRepo.logIntake({ supplementId: 's1', dateISO: '2026-04-25', slot: 'morning', status: 'taken' });
    const logs = await intakeLogRepo.getByRange('2026-04-21', '2026-04-24');
    expect(logs.map(l => l.dateISO)).toEqual(['2026-04-23']);
  });

  it('getBySupplement filters correctly', async () => {
    await intakeLogRepo.logIntake({ supplementId: 'a', dateISO: '2026-04-23', slot: 'morning', status: 'taken' });
    await intakeLogRepo.logIntake({ supplementId: 'b', dateISO: '2026-04-23', slot: 'morning', status: 'taken' });
    const logs = await intakeLogRepo.getBySupplement('a');
    expect(logs).toHaveLength(1);
    expect(logs[0].supplementId).toBe('a');
  });
});
