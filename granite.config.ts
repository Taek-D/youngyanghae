import { defineConfig } from '@apps-in-toss/web-framework/config';

/**
 * 영양해 — 앱인토스 영양제 루틴 트래커 미니앱
 *
 * 심사 규정 준수 사항:
 * - 공통 네비게이션바만 사용 (자체 헤더·백버튼 금지)
 * - 첫 화면 백버튼 = 미니앱 종료
 * - 액세서리 버튼은 최대 1개, 모노톤 아이콘만
 * - brand.displayName은 index.html <title>과 정확히 일치
 */
export default defineConfig({
  appName: 'youngyanghae',
  brand: {
    displayName: '영양해',
    primaryColor: '#3182F6', // TDS blue500 — 해지해 라인 일관성
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    initialAccessoryButton: {
      id: 'points',
      title: 'Points',
      icon: { name: 'icon-coin-mono' }, // 모노톤 필수 — 컬러 아이콘 사용 시 심사 반려
    },
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
