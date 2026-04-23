/**
 * Ad Service — 보상형 광고 래퍼
 *
 * 심사 규정 준수 (appintoss-rewarded-ad 스킬 참조):
 * - loadFullScreenAd → showFullScreenAd 순서 필수 (역순 호출 시 심사 반려)
 * - isSupported 체크 필수
 * - userEarnedReward 이벤트 반드시 처리
 * - 웹/샌드박스 환경에서 mock 동작 필수
 *
 * adGroupId는 앱인토스 콘솔에서 발급 후 환경변수로 주입.
 */

import { isTossApp } from '@/lib/environment';

export const AD_GROUP_ID = import.meta.env.VITE_AD_GROUP_ID ?? 'yyh-rewarded-default';

export interface RewardedAdResult {
  rewarded: boolean;
  unitType?: string;
  unitAmount?: number;
}

type LoadedCleanup = () => void;

/**
 * 광고 로드 후 즉시 노출 (간단한 use-case용 fire-and-forget 함수).
 * 복잡한 lifecycle 관리가 필요하면 useRewardedAdFlow 훅 사용.
 */
export async function showRewardedAd(
  adGroupId: string = AD_GROUP_ID,
): Promise<RewardedAdResult> {
  // 웹 mock
  if (!isTossApp()) {
    await new Promise((r) => setTimeout(r, 1200));
    return { rewarded: true, unitType: 'coin', unitAmount: 1 };
  }

  const sdk = (await import('@apps-in-toss/web-framework')) as unknown as {
    loadFullScreenAd: {
      (opts: {
        options: { adGroupId: string };
        onEvent: (e: { type: string; data?: Record<string, unknown> }) => void;
        onError?: (err: unknown) => void;
      }): LoadedCleanup;
      isSupported: () => boolean;
    };
    showFullScreenAd: {
      (opts: {
        options: { adGroupId: string };
        onEvent: (e: { type: string; data?: Record<string, unknown> }) => void;
        onError?: (err: unknown) => void;
      }): LoadedCleanup;
      isSupported: () => boolean;
    };
  };

  if (sdk.loadFullScreenAd.isSupported() !== true) {
    return { rewarded: false };
  }

  // 1단계: 로드 (반드시 load → show 순서)
  await new Promise<void>((resolve, reject) => {
    let loadCleanup: LoadedCleanup | null = null;
    loadCleanup = sdk.loadFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          loadCleanup?.();
          resolve();
        }
      },
      onError: (err) => {
        loadCleanup?.();
        reject(err);
      },
    });
  });

  // 2단계: 표시 + userEarnedReward 수신 대기
  return await new Promise<RewardedAdResult>((resolve) => {
    let showCleanup: LoadedCleanup | null = null;
    let rewardedResult: RewardedAdResult = { rewarded: false };

    showCleanup = sdk.showFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type === 'userEarnedReward') {
          rewardedResult = {
            rewarded: true,
            unitType: (event.data?.unitType as string) ?? 'coin',
            unitAmount: (event.data?.unitAmount as number) ?? 1,
          };
        }
        if (event.type === 'dismissed' || event.type === 'failedToShow') {
          showCleanup?.();
          resolve(rewardedResult);
        }
      },
      onError: () => {
        showCleanup?.();
        resolve({ rewarded: false });
      },
    });
  });
}
