import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { supplementRepo } from './supplementRepository';
import { resetDB_YYH } from './db';
import type { Supplement } from '@/types';

function mk(id: string, overrides: Partial<Supplement> = {}): Supplement {
  return {
    id, name: `s-${id}`, dose: '1정',
    slots: ['morning'], weekdays: [1, 2, 3, 4, 5],
    createdAt: Date.now(), ...overrides,
  };
}

describe('supplementRepo', () => {
  beforeEach(async () => { await resetDB_YYH(); });
  afterAll(async () => { await resetDB_YYH(); });

  it('creates and retrieves a supplement', async () => {
    await supplementRepo.create(mk('a', { name: '비타민C' }));
    const got = await supplementRepo.get('a');
    expect(got?.name).toBe('비타민C');
  });

  it('lists supplements ordered by createdAt', async () => {
    await supplementRepo.create(mk('b', { createdAt: 200 }));
    await supplementRepo.create(mk('a', { createdAt: 100 }));
    const list = await supplementRepo.list();
    expect(list.map(s => s.id)).toEqual(['a', 'b']);
  });

  it('counts accurately (for free tier gating)', async () => {
    for (let i = 0; i < 3; i++) await supplementRepo.create(mk(`s${i}`));
    expect(await supplementRepo.count()).toBe(3);
  });

  it('updates supplement', async () => {
    await supplementRepo.create(mk('a', { name: 'old' }));
    const existing = (await supplementRepo.get('a'))!;
    await supplementRepo.update({ ...existing, name: 'new' });
    expect((await supplementRepo.get('a'))?.name).toBe('new');
  });

  it('removes supplement', async () => {
    await supplementRepo.create(mk('a'));
    await supplementRepo.remove('a');
    expect(await supplementRepo.get('a')).toBeUndefined();
  });
});
