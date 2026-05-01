import { defineConfig } from '@apps-in-toss/web-framework/config';

/**
 * 영양해 — 앱인토스 영양제 루틴 트래커 미니앱
 *
 * 심사 규정 준수 사항:
 * - 공통 네비게이션바만 사용 (자체 헤더·백버튼 금지)
 * - 첫 화면 백버튼 = 미니앱 종료
 * - 액세서리 버튼 미사용 (포인트 잔액은 설정·페이월 화면에서만 노출)
 * - brand.displayName은 index.html <title>과 정확히 일치
 */
export default defineConfig({
  appName: 'youngyanghae',
  brand: {
    displayName: '영양해',
    primaryColor: '#3182F6', // TDS blue500 — 해지해 라인 일관성
    // SDK 2.4.7+ 필수: HTTP URL 또는 토스 내부 등록 아이콘 이름.
    // toIcon(): http 시작 → { source: { uri } } / 그 외 → { name } 으로 해석.
    // 콘솔에 등록할 아이콘과 동일한 파일을 jsDelivr CDN(GitHub Public 자동 미러)으로 노출.
    icon: 'https://cdn.jsdelivr.net/gh/Taek-D/youngyanghae@main/public/logo-light.png',
  },
  permissions: [], // SDK 2.4.7+ 필수 필드 (영양해는 카메라/위치 등 권한 미사용)
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  web: {
    host: 'localhost',
    port: 8080,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  outdir: 'dist',
});
