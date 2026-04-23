import { describe, it, expect } from 'vitest';
import { parseIAPError } from './iapService';

describe('parseIAPError', () => {
  it('maps CANCELED to friendly message', () => {
    expect(parseIAPError({ code: 'CANCELED' }).userMessage).toBe('결제가 취소됐어요');
  });

  it('maps NETWORK_ERROR', () => {
    expect(parseIAPError({ code: 'NETWORK_ERROR' }).userMessage).toContain('네트워크');
  });

  it('maps ALREADY_OWNED', () => {
    expect(parseIAPError({ code: 'ALREADY_OWNED' }).userMessage).toContain('이미');
  });

  it('fallbacks for unknown code', () => {
    expect(parseIAPError({ code: 'XYZ_UNKNOWN' }).userMessage).toContain('다시 시도');
  });

  it('fallbacks for non-object errors', () => {
    expect(parseIAPError('string error').code).toBe('UNKNOWN');
    expect(parseIAPError(null).code).toBe('UNKNOWN');
  });
});
