import { describe, it, expect, beforeEach } from 'vitest';
import { pointsRepo } from './pointsRepository';
import { resetDB_YYH } from './db';

describe('pointsRepo', () => {
  beforeEach(async () => { await resetDB_YYH(); });

  it('starts with balance 0', async () => {
    expect(await pointsRepo.getBalance()).toBe(0);
  });

  it('earn increments balance and records transaction', async () => {
    const next = await pointsRepo.earn('ad_watch', 50);
    expect(next).toBe(50);
    expect(await pointsRepo.getBalance()).toBe(50);
    const hist = await pointsRepo.history();
    expect(hist).toHaveLength(1);
    expect(hist[0]).toMatchObject({ type: 'earn', source: 'ad_watch', amount: 50 });
  });

  it('multiple earns accumulate correctly', async () => {
    await pointsRepo.earn('ad_watch', 50);
    await pointsRepo.earn('streak_7', 200);
    expect(await pointsRepo.getBalance()).toBe(250);
  });

  it('spend reduces balance and records transaction', async () => {
    await pointsRepo.earn('ad_watch', 1000);
    await new Promise(r => setTimeout(r, 5)); // ensure different createdAt for stable sort
    const next = await pointsRepo.spend('spend_premium_1d', 1000);
    expect(next).toBe(0);
    const hist = await pointsRepo.history();
    expect(hist[0]).toMatchObject({ type: 'spend', source: 'spend_premium_1d', amount: 1000 });
  });

  it('spend throws on insufficient balance', async () => {
    await pointsRepo.earn('ad_watch', 100);
    await expect(pointsRepo.spend('spend_premium_1d', 1000)).rejects.toThrow('insufficient');
  });

  it('history sorted descending by createdAt', async () => {
    await pointsRepo.earn('ad_watch', 50);
    await new Promise(r => setTimeout(r, 5));
    await pointsRepo.earn('streak_3', 100);
    const hist = await pointsRepo.history();
    expect(hist[0].source).toBe('streak_3');
    expect(hist[1].source).toBe('ad_watch');
  });
});
