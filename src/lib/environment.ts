/** Toss WebView 환경 감지 */
export function isTossApp(): boolean {
  return typeof window !== 'undefined'
    && !!(window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView;
}
