import type { IntakeSlot } from './supplement';

export type IntakeStatus = 'taken' | 'skipped' | 'missed';

export interface IntakeLog {
  /** `${supplementId}:${dateISO}:${slot}` */
  id: string;
  supplementId: string;
  dateISO: string;
  slot: IntakeSlot;
  status: IntakeStatus;
  takenAt?: number;
}

export function buildLogId(supplementId: string, dateISO: string, slot: IntakeSlot): string {
  return `${supplementId}:${dateISO}:${slot}`;
}
