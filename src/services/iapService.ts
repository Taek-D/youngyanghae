/**
 * IAP Service — 앱인토스 인앱결제 래퍼
 *
 * 심사 규정 준수:
 * - Dynamic import + isSupported 패턴
 * - 웹/샌드박스 환경에서 mock 동작
 * - Toss OAuth 토큰 클라이언트 노출 금지 (영양해는 서버 없음 → 토큰 미사용)
 *
 * SKU는 premiumConstants.IAP_SKU에서 관리. 앱인토스 콘솔에서 비소모품(Non-Consumable) 발급 후 교체.
 */

import { IAP_SKU, type IAPSkuKey } from '@/config/premiumConstants';
import { isTossApp } from '@/lib/environment';

export interface PurchaseResult {
  orderId: string;
  productId: string;
  purchaseTime: number;
}

export interface OrderInfo {
  orderId: string;
  productId: string;
  status: 'COMPLETED' | 'REFUNDED' | 'PENDING';
  purchaseTime: number;
}

export interface IAPErrorInfo {
  code: string;
  userMessage: string;
}

/**
 * IAP 에러 객체를 사용자 친화 메시지로 변환.
 * 해지해에서 검증된 코드 매핑 계승.
 */
export function parseIAPError(err: unknown): IAPErrorInfo {
  const code = ((err as { code?: string })?.code) ?? 'UNKNOWN';
  const userMessage =
    ({
      CANCELED: '결제가 취소됐어요',
      USER_CANCEL: '결제가 취소됐어요',
      NETWORK_ERROR: '네트워크 상태를 확인해주세요',
      ALREADY_OWNED: '이미 구매한 상품이에요',
      NOT_SUPPORTED: '이 환경에서는 결제를 할 수 없어요',
      TIMEOUT: '응답 시간이 초과됐어요. 다시 시도해주세요',
    } as Record<string, string>)[code] ??
    '결제 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.';
  return { code, userMessage };
}

/**
 * 프리미엄 구매 요청. 성공 시 PurchaseResult 반환, 환경 미지원 시 null.
 * 사용자 취소 등 실패는 throw.
 */
export async function purchase(plan: IAPSkuKey): Promise<PurchaseResult | null> {
  const productId = IAP_SKU[plan];
  if (!productId) throw new Error(`Invalid plan: ${plan}`);

  if (!isTossApp()) {
    // 웹 mock
    await new Promise((r) => setTimeout(r, 800));
    return {
      orderId: `mock-${plan}-${Date.now()}`,
      productId,
      purchaseTime: Date.now(),
    };
  }

  const sdk = (await import('@apps-in-toss/web-framework')) as unknown as {
    createOneTimePurchaseOrder: {
      (opts: { options: { productId: string } }): Promise<PurchaseResult>;
      isSupported: () => boolean;
    };
  };

  if (sdk.createOneTimePurchaseOrder.isSupported() !== true) return null;

  return sdk.createOneTimePurchaseOrder({ options: { productId } });
}

/**
 * 완료·환불 주문 내역 조회 (프리미엄 자동 복원 + 환불 감지용).
 * 해지해 학습: 앱 시작 시 호출하여 REFUNDED → 프리미엄 해제 폴링.
 */
export async function getCompletedOrRefundedOrders(): Promise<OrderInfo[]> {
  if (!isTossApp()) return [];

  try {
    const sdk = (await import('@apps-in-toss/web-framework')) as unknown as {
      getCompletedOrRefundedOrders?: {
        (): Promise<OrderInfo[] | { orders: OrderInfo[] }>;
        isSupported: () => boolean;
      };
    };
    if (!sdk.getCompletedOrRefundedOrders || sdk.getCompletedOrRefundedOrders.isSupported() !== true) {
      return [];
    }
    const result = await sdk.getCompletedOrRefundedOrders();
    return Array.isArray(result) ? result : result.orders;
  } catch {
    return [];
  }
}
