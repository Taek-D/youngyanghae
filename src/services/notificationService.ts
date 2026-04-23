/**
 * Local Notification Service
 *
 * 앱인토스 SDK의 알림 API는 버전별로 이름이 다를 수 있음.
 * Dynamic import + isSupported 체크로 graceful fallback.
 *
 * 웹 환경에서는 Notification API mock, 토스 앱 환경에서는 SDK 사용.
 *
 * TODO: 실제 배포 전 @appintoss-docs 스킬로 SDK API 이름 최종 확인.
 */

import { isTossApp } from '@/lib/environment';
import { DEFAULT_SLOT_TIMES, type IntakeSlot, type Supplement, type Weekday } from '@/types';

export interface NotificationSchedule {
  supplementId: string;
  supplementName: string;
  slot: IntakeSlot;
  /** HH:mm */
  time: string;
  weekdays: Weekday[];
}

const STORAGE_KEY = 'youngyang:scheduled-notifications';

/**
 * 영양제 목록을 기반으로 알림 스케줄 배열 생성.
 */
export function buildSchedules(supplements: Supplement[], customTimes?: Partial<Record<IntakeSlot, string>>): NotificationSchedule[] {
  const times = { ...DEFAULT_SLOT_TIMES, ...customTimes };
  const schedules: NotificationSchedule[] = [];
  for (const s of supplements) {
    for (const slot of s.slots) {
      schedules.push({
        supplementId: s.id,
        supplementName: s.name,
        slot,
        time: times[slot],
        weekdays: s.weekdays,
      });
    }
  }
  return schedules;
}

/**
 * 스케줄 등록 (SDK 지원 시) + localStorage 캐시.
 * 실패해도 앱 동작에 지장 없도록 silent fail.
 */
export async function syncSchedules(schedules: NotificationSchedule[]): Promise<{ registered: boolean; count: number }> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));

  if (!isTossApp()) {
    return { registered: false, count: schedules.length };
  }

  try {
    const sdk = (await import('@apps-in-toss/web-framework')) as unknown as {
      scheduleLocalNotification?: {
        (opts: { title: string; body: string; trigger: { hour: number; minute: number; weekdays?: number[] } }): Promise<void>;
        isSupported: () => boolean;
      };
      cancelAllLocalNotifications?: {
        (): Promise<void>;
        isSupported: () => boolean;
      };
    };

    if (!sdk.scheduleLocalNotification || sdk.scheduleLocalNotification.isSupported() !== true) {
      return { registered: false, count: schedules.length };
    }

    // 기존 알림 모두 취소
    if (sdk.cancelAllLocalNotifications && sdk.cancelAllLocalNotifications.isSupported() === true) {
      await sdk.cancelAllLocalNotifications();
    }

    // 새 스케줄 등록
    for (const s of schedules) {
      const [hour, minute] = s.time.split(':').map(Number);
      await sdk.scheduleLocalNotification({
        title: '영양해',
        body: `${s.supplementName} 먹을 시간이에요`,
        trigger: { hour, minute, weekdays: s.weekdays },
      });
    }
    return { registered: true, count: schedules.length };
  } catch (err) {
    console.warn('[notification] sync failed:', err);
    return { registered: false, count: schedules.length };
  }
}

export async function clearAllSchedules(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  if (!isTossApp()) return;
  try {
    const sdk = (await import('@apps-in-toss/web-framework')) as unknown as {
      cancelAllLocalNotifications?: {
        (): Promise<void>;
        isSupported: () => boolean;
      };
    };
    if (sdk.cancelAllLocalNotifications?.isSupported() === true) {
      await sdk.cancelAllLocalNotifications();
    }
  } catch {
    // silent
  }
}
