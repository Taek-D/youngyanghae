# 영양해 — 앱인토스 비게임 출시 11단계 체크리스트

> 심사 제출 전 최종 확인. 각 항목 PASS 필수.
> `/appintoss-nongame-launch-checklist` 스킬 기반.

## 1. 브랜딩 통일성 ✅

| 위치 | 값 | 상태 |
|------|---|------|
| `granite.config.ts` `brand.displayName` | 영양해 | ✅ |
| `index.html` `<title>` | 영양해 | ✅ |
| `index.html` `og:title` | 영양해 | ✅ |
| `index.html` `twitter:title` | 영양해 | ✅ |
| `theme-color` meta | #3182F6 | ✅ |
| **콘솔 등록 앱 이름** | 영양해 | ⏳ 제출 시 |

`primaryColor`: `#3182F6` (6-digit hex, # 포함) ✅ — TDS blue500, 해지해 라인 일관성

## 2. 로고 ⚠️

- [x] 라이트 모드 가시 (`public/logo-light.svg`)
- [x] 다크 모드 가시 (`public/logo-dark.svg`)
- [x] 각진 정사각형 600×600 뷰박스
- [ ] **TODO: SVG 플레이스홀더 → 최종 디자이너 PNG로 교체**

## 3. 공통 네비게이션바 ✅

```ts
// granite.config.ts
navigationBar: {
  withBackButton: true,      // ✅
  withHomeButton: true,      // ✅
  initialAccessoryButton: {
    id: 'points',
    icon: { name: 'icon-coin-mono' }  // ✅ 모노톤 (컬러 금지)
  },
}
```

- [x] 자체 헤더·백버튼 0건 (코드 grep 확인)
- [x] 액세서리 최대 1개
- [x] 모노톤 아이콘만

## 4. 첫 화면 뒤로가기 ✅

- [x] `/intro`에서 뒤로가기 = 미니앱 종료 (리프레시 X)
- [x] `<OnboardingGuard>`가 최초 진입 시 `/intro`로 강제 유도

## 5. 핀치줌 비활성화 ✅

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
- [x] `user-scalable=no` 포함
- [x] `maximum-scale=1.0` 포함

## 6. 로그인 인트로 지연 ✅

- [x] `appLogin()` 코드 호출 **0건** (grep 확인) — 영양해는 로그인 불필요 (로컬 저장)
- [x] 인트로 화면이 최초 진입 화면
- [x] 사용자 "영양해 시작하기" 버튼 탭 후 홈 이동

## 7. alert/confirm/prompt 제거 ✅

- [x] `alert()` **0건** (grep 확인)
- [x] `confirm()` **0건**
- [x] `prompt()` **0건**
- [x] 모든 다이얼로그는 `<DialogProvider>` + `useDialog()` 사용

## 8. 외부 링크/결제 유도 ✅

- [x] 외부 앱·브라우저 navigation 0건
- [x] 외부 결제 URL 0건 (IAP SDK만 사용)
- [x] `window.open()` / 외부 URL anchor 0건
- [x] 앱 설치 유도 문구·배너 0건

## 9. IAP 4-플로우 실기기 검증 ⏳

샌드박스 UserAgent(TossApp/1.0.0)는 IAP 5.219.0 미달로 불가 → **실기기 토스앱 필수**.

- [ ] 결제 성공 (월/연/평생 중 하나)
- [ ] 결제 취소
- [ ] 결제 실패 (네트워크 에러)
- [ ] 구매 복원 (앱 삭제→재설치)
- [ ] 환불 감지 (`getCompletedOrRefundedOrders` 폴링)

**SKU 발급 완료** (2026-04-26):
```ts
// src/config/premiumConstants.ts — 콘솔 발급 실 SKU 적용
IAP_SKU.monthly  = 'ait.0000029518.4fd8f444.24f2107fa9.7129637158'
IAP_SKU.yearly   = 'ait.0000029518.dc3ba407.96ee8beab3.7129669832'
IAP_SKU.lifetime = 'ait.0000029518.4703587e.85fd9dff01.7129714550'
```

## 10. 환불 안내 문구 ✅

공식 문구 포함 확인:
```
환불은 토스 앱 > 전체 > 게임 > 프로필 > 구매내역에서 요청할 수 있어요.
앱에서는 환불 기능을 제공하지 않아요.
```

- [x] `PaywallPage.tsx` 하단 고정 노출
- [x] `SettingsPage.tsx` → 환불 안내 Dialog

## 11. 구독 오인 워딩 없음 ✅

- [x] "구독" 용어는 월/연 요금제에만 사용 (실제 구독형)
- [x] "프로 1일권" (포인트 교환) = 일회성 용어로 명확 구분
- [x] 결제 금액 UI === IAP SKU 가격 (매칭 필수, 콘솔 등록 시 재확인)

---

## 🔧 잔여 심사 전 TODO

### Critical (심사 직전 필수)
1. ✅ **SKU 교체** (2026-04-26 완료): `src/config/premiumConstants.ts`
2. ✅ **광고 그룹 ID** (2026-04-26 완료): `.env` → `VITE_AD_GROUP_ID=ait.v2.live.3b81e8afba074454`
3. ⏳ **로고 PNG**: `public/logo-{light,dark}.svg` → 디자이너 600×600 PNG
4. ⏳ **코인 아이콘**: `public/icon-coin-mono.svg` → 실제 모노톤 이미지

### Important
5. **BottomTabBar 이모지**: 모노톤 SVG 아이콘 교체 (심사는 통과하지만 UX 개선)
6. **이용약관/개인정보처리방침 URL**: 실제 법률 페이지 연결
7. **실기기 2대 IAP 전체 시나리오 테스트** (S6~S9)

### Nice-to-have
8. 번들 크기 최적화 (현재 1.24MB, code-splitting 권장)
9. TDS 네이티브 컴포넌트 마이그레이션 (현재 TDS 토큰만 사용)

## 📊 자동 검증 결과

| 항목 | 결과 |
|------|------|
| TypeScript (tsc --noEmit) | ✅ 0 errors |
| Vitest (전체 테스트) | ✅ 38/38 PASS |
| Vite build | ✅ 3.45s, 1237KB (gzip 399KB) |
| alert/confirm/prompt | ✅ 0건 |
| appLogin() 호출 | ✅ 0건 (인트로 필수 준수) |
| 브랜딩 일치 | ✅ 4곳 모두 "영양해" |
| 핀치줌 OFF | ✅ viewport 확인 |

## 🚀 심사 제출 절차

1. 위 Critical TODO 4건 수정
2. `npm run build` → `dist/` 생성
3. AIT 파일 생성 (ait CLI 사용)
4. 앱인토스 콘솔 등록
   - 앱 이름: 영양해
   - 카테고리: 헬스/라이프
   - 로고 업로드
   - SKU 등록
5. 심사 제출 → 대기 (보통 3~5일)
6. 승인 후 런칭 공지

---

**런칭 준비 상태**: **19/20 기능 구현 완료** (F020 = 콘솔 제출은 인간 작업)
**심사 반려 리스크**: **Critical TODO 4건** (SKU/아이콘/로고) — 이들 해결 시 1회차 통과 유력
