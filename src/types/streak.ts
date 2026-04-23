export interface StreakState {
  currentDays: number;
  longestDays: number;
  /** 마지막 복용 체크 날짜 (ISO yyyy-MM-dd). 초기값: '' */
  lastCheckDate: string;
  /** 포인트로 구매 가능한 스트릭 복구권 잔량 */
  freezesAvailable: number;
}

export const INITIAL_STREAK: StreakState = {
  currentDays: 0,
  longestDays: 0,
  lastCheckDate: '',
  freezesAvailable: 0,
};
