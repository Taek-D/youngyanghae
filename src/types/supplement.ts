/**
 * 영양제 도메인 타입
 */
export type IntakeSlot = 'morning' | 'lunch' | 'evening' | 'bedtime';

export const INTAKE_SLOT_LABEL: Record<IntakeSlot, string> = {
  morning: '아침',
  lunch: '점심',
  evening: '저녁',
  bedtime: '취침',
};

export const DEFAULT_SLOT_TIMES: Record<IntakeSlot, string> = {
  morning: '08:00',
  lunch: '12:30',
  evening: '19:00',
  bedtime: '22:00',
};

/** Sun=0, Sat=6 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
};

export interface Supplement {
  id: string;
  name: string;
  brand?: string;
  dose: string;
  slots: IntakeSlot[];
  weekdays: Weekday[];
  color?: string;
  createdAt: number;
  updatedAt?: number;
}
