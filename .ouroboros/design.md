# 영양해 — TDS Mobile 기반 화면 디자인

> Ouroboros Seed의 짝 아티팩트. 6개 주요 화면의 와이어프레임·TDS 컴포넌트 매핑·인터랙션 스펙.
> 기준: TDS Mobile v2, `@toss/tds-mobile` + `@toss/tds-mobile-ait`.

## 🎨 브랜드 아이덴티티

### 앱 정보
- **표시명**: 영양해
- **태그라인**: "오늘도 영양해?"
- **콘셉트**: 질문형 친근 UX (토스 해요체)
- **로고 방향**: 둥근 알약 1개 + 체크 마크, 6백×6백 각진 정사각형, 라이트/다크 모두 가시

### 색상 팔레트 (TDS 토큰만 사용)
| 역할 | 토큰 | Hex | 용도 |
|------|------|-----|------|
| Primary | `blue500` | `#3182f6` | CTA, 링크, 체크 완료, 포커스 |
| Primary Press | `blue700` | `#1d5fd4` | 눌림 |
| Accent (완료) | `green500` | TDS green500 | 복용 완료 상태 배지·아이콘 |
| 스트릭 | `orange500` | TDS orange500 | 🔥 스트릭 불꽃 대체 아이콘 색 |
| 경고 | `red500` | `#ff3333` | 성분 상호작용 경고, 삭제 |
| 배경 | `background` | `#FFFFFF` | 기본 |
| 서브 배경 | `greyBackground` | `#f3f4f6` | 카드/섹션 배경 |
| Dialog | `--adaptiveFloatBackground` | `#FFFFFF` | **해지해에서 학습한 필수 변수** |
| Text 주 | `grey900` | `#191f28` | 본문 |
| Text 보조 | `grey600` | `#4b5563` | 부가 정보 |
| Text 흐림 | `grey400` | `#9ca3af` | 플레이스홀더 |

### 타이포그래피 매핑
| 용도 | 토큰 | 크기 |
|------|------|------|
| 인트로 헤드 | Typography 1 | 30px |
| 화면 타이틀 | Typography 2 | 26px |
| 섹션 헤더 | Typography 4 | 20px |
| 영양제 이름 | Typography 5 Bold | 17px |
| 본문 | Typography 6 | 15px |
| 캡션/보조 | Typography 7 | 13px |
| 스트릭 숫자 | sub Typography 13 Bold | 29px |

---

## 📱 글로벌 레이아웃

### Navigation Bar (granite.config.ts — 모든 화면 공통)
```ts
navigationBar: {
  withBackButton: true,        // 공통 백버튼 (자체 백버튼 절대 금지)
  withHomeButton: true,        // 공통 홈버튼
  initialAccessoryButton: {
    id: 'points',
    title: 'Points',
    icon: { name: 'icon-coin-mono' },   // 모노톤 필수
  },
}
```
> 자체 TopBar/Header 절대 금지 (NEVER 규칙). 모든 화면은 공통 네비게이션바만 사용.

### Viewport (index.html 필수)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Root Provider (src/App.tsx)
```tsx
<TDSMobileAITProvider>
  <PremiumContext.Provider>
    <RouterProvider router={router} />
  </PremiumContext.Provider>
</TDSMobileAITProvider>
```

---

## 1️⃣ 인트로 (Intro/Onboarding)

**Purpose**: 앱 시작 직후 `appLogin()` 호출 금지 규정 준수 → 사용자 액션 유도.
**Route**: `/intro` (첫 진입, localStorage `youngyang:onboarding-completed` 미설정 시)

### 와이어프레임
```
┌───────────────────────────────┐
│  [공통 네비게이션바 — 뒤로가기 시 미니앱 종료]  │
├───────────────────────────────┤
│                               │
│                               │
│         [로고 120×120]         │
│                               │
│         영양해                 │  ← Typography 1 Bold
│                               │
│  매일 1번, 톡 누르면 끝         │  ← Typography 5 grey600
│   — 오늘도 영양해?              │
│                               │
│                               │
│       ┌───────────────┐       │
│       │ [일러스트 3컷] │       │  ← Asset / GridList 3col
│       └───────────────┘       │
│                               │
│                               │
├───────────────────────────────┤
│  [  영양해 시작하기  ]         │  ← BottomCTA.Single
└───────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 | 주요 Props |
|------|---------|-----------|
| 앱 로고 | `Asset` | `width=120`, `height=120` |
| 앱 이름 | `Text typography="t1" weight="bold"` | `color={colors.grey900}` |
| 태그라인 | `Text typography="t5"` | `color={colors.grey600}` |
| 3컷 기능 소개 | `GridList column={3}` | 각 셀 Asset+Text |
| CTA | `BottomCTA.Single` | `color="primary" variant="fill" size="xlarge"` "영양해 시작하기" |

### 인터랙션
1. 첫 진입: onboarding-completed 체크 → 없으면 이 화면
2. CTA 탭: `localStorage.setItem('youngyang:onboarding-completed', '1')` → `/` 이동
3. 네비게이션바 뒤로가기: 미니앱 종료 (리프레시 금지)
4. `appLogin()`은 호출하지 않음 — 로그인 불필요 (모두 로컬 저장)

---

## 2️⃣ 홈 (오늘의 복용)

**Purpose**: 1-tap 복용 체크 + 스트릭·포인트 즉시 확인. **앱 사용의 80% 시간이 이 화면**.
**Route**: `/`

### 와이어프레임
```
┌────────────────────────────────────┐
│ [네비게이션바: 포인트 아이콘 우측]    │
├────────────────────────────────────┤
│  10월 23일 목요일                   │  ← Typography 7 grey600
│  오늘도 영양해?                     │  ← Typography 2 bold
│                                    │
│  ╔══════════════════════════════╗  │
│  ║ 🔥 연속 7일                   ║  │  ← 스트릭 카드 (blue50 bg)
│  ║ 최장 14일 · 복구권 2개 있어요  ║  │
│  ╚══════════════════════════════╝  │
│                                    │
│  ── 아침 (08:00) ──                │  ← ListHeader
│  ┌──────────────────────────────┐  │
│  │ 종합비타민  1정   ⚪ (체크)    │  │  ← ListRow + Checkbox.Circle
│  │ 오메가3    1정   ✅            │  │  ← 완료 상태 (green500)
│  └──────────────────────────────┘  │
│                                    │
│  ── 저녁 (19:00) ──                │
│  ┌──────────────────────────────┐  │
│  │ 프로바이오틱스 1정   ⚪        │  │
│  └──────────────────────────────┘  │
│                                    │
│  (모두 완료 시) 🎉 오늘 완료!        │  ← Result 또는 Toast
│  [광고 보고 +50p 받기]               │  ← Button weak
│                                    │
├────────────────────────────────────┤
│ [Tab: 홈 · 영양제 · 기록 · 설정]    │  ← 하단 Tab (플로팅 탭바, 모노톤)
└────────────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 | 세부 |
|------|---------|------|
| 날짜 | `Text typography="t7"` | grey600 |
| 헤드 질문 | `Text typography="t2" weight="bold"` | grey900 |
| 스트릭 카드 | 커스텀 `div` + TDS 토큰 | `background: colors.blue50`, `borderRadius: 16`, `padding: 20` |
| 스트릭 숫자 | `Text typography="st13" weight="bold"` | orange500 |
| 스트릭 상세 | `Text typography="t7"` | grey600 |
| 섹션 헤더 | `ListHeader` | `title="아침 (08:00)"` |
| 복용 아이템 | `ListRow padding="large"` | `title`, `description`, `right` slot |
| 체크박스 | `Checkbox.Circle` `aria-label` 필수 | `size=28` |
| 완료 시 상태 | `Result` 또는 `Toast` | 간결히 |
| 광고 CTA | `Button variant="weak" size="large"` | "광고 보고 +50p" |
| 하단 탭바 | `Tab` + 플로팅 style | 4개 (홈/영양제/기록/설정), 모노톤 아이콘 |

### 인터랙션 (핵심)
1. **1-tap 체크**: ListRow 전체 영역 탭 → Checkbox 토글 + 완료 애니메이션 (체크 색 전환 200ms)
2. **스트릭 끊김 경고**: 전날 미체크 감지 → 아침에 Toast "스트릭 끊길 뻔! 어제 복용 복구할래요?" → BottomSheet: 복구권 사용 (500p)
3. **포인트 아이콘 탭**: 우상단 코인 아이콘 → BottomSheet (포인트 내역 + 사용처)
4. **모두 완료**: Toast + 광고 시청 보상 버튼 표시
5. **풀 투 리프레시**: 새로고침 (알림 시간 반영)

### 엣지 케이스
- 영양제 0개: Empty state — "영양제를 등록해보세요" + CTA (`Button primary`) → `/supplements/new`
- 무료 사용자 + 4번째 영양제: 등록 시점에 페이월 트리거

---

## 3️⃣ 영양제 등록/리스트

**Purpose**: 영양제 CRUD. 첫 등록은 조금 무거워도 OK, 재등록·편집은 빠르게.
**Route**: `/supplements` (리스트), `/supplements/new` (등록), `/supplements/:id` (편집)

### 3-A. 영양제 리스트
```
┌────────────────────────────────────┐
│ [네비게이션바]                      │
├────────────────────────────────────┤
│  내 영양제 (3/3)                    │  ← Typography 2 + Badge "3/3"
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🟦 종합비타민                 │  │  ← ListRow xlarge
│  │    아침 · 1정                 │  │
│  │                           ⋯   │  │  ← IconButton 편집
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 🟩 오메가3                    │  │
│  │    아침 · 1정                 │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 🟪 프로바이오틱스             │  │
│  │    저녁 · 1정                 │  │
│  └──────────────────────────────┘  │
│                                    │
│  (무료 유저) 더 추가하려면           │
│  ┌──────────────────────────────┐  │
│  │ 🔒 프리미엄으로 무제한 등록    │  │  ← Banner 또는 weak Button
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│              ( + )                 │  ← FloatingActionButton (blue500)
└────────────────────────────────────┘
```

### 3-B. 영양제 등록 (BottomSheet 또는 풀스크린)
```
┌────────────────────────────────────┐
│ [네비게이션바: 백버튼]              │
├────────────────────────────────────┤
│  영양제 추가                        │
│                                    │
│  [🔍 성분명·제품명 검색           ] │  ← SearchField (내부 DB)
│                                    │
│  추천                               │  ← ListHeader
│  · 종합비타민                       │
│  · 오메가3                          │
│  · 프로바이오틱스                   │
│                                    │
│  ─────── 직접 입력 ───────          │  ← Border
│                                    │
│  [영양제 이름 *              ]      │  ← TextField
│  [브랜드 (선택)              ]      │  ← TextField
│  [용량 (예: 1정) *           ]      │  ← TextField
│                                    │
│  복용 시간                          │
│  [ ☐ 아침 08:00 ] [ ☐ 점심 12:30 ]  │  ← Checkbox.Line 그리드
│  [ ☐ 저녁 19:00 ] [ ☐ 취침 22:00 ]  │
│                                    │
│  반복 요일                          │
│  [월][화][수][목][금][토][일]       │  ← SegmentedControl 다중
│                                    │
│  ⚠️ 오메가3는 아스피린과 함께 복용   │  ← 성분 상호작용 경고 (있을 시)
│     시 주의하세요 (프리미엄)         │
│                                    │
├────────────────────────────────────┤
│           [  저장하기  ]           │  ← BottomCTA.Single
└────────────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 |
|------|---------|
| 제목 + 카운트 | `Text` + `Badge size="small" color="blue"` |
| 영양제 행 | `ListRow padding="xlarge"` + `ListRow.Right` |
| 편집 | `IconButton aria-label="편집" variant="clear"` |
| FAB | 커스텀 `IconButton` 또는 `Button size="xlarge"` fixed |
| 검색 | `SearchField placeholder="성분명·제품명"` |
| 추천 | `ListRow padding="medium"` + `ListRow.ArrowIcon` |
| 텍스트 입력 | `TextField` with `label`, `error`, `required` |
| 복용 시간 | `Checkbox.Line` 2×2 grid |
| 요일 | `SegmentedControl alignment="fluid"` 다중 선택 시 체크박스 행 |
| 상호작용 경고 | 커스텀 카드 + `colors.red500` border/text |
| 저장 CTA | `BottomCTA.Single color="primary"` |
| 페이월 진입 | `Button variant="weak"` 배너 → `/paywall` |

---

## 4️⃣ 복용 히스토리

**Purpose**: 시각적 피드백으로 동기 강화. 무료는 7일, 프리미엄은 무제한.
**Route**: `/history`

### 와이어프레임
```
┌────────────────────────────────────┐
│ [네비게이션바]                      │
├────────────────────────────────────┤
│  복용 기록                          │
│                                    │
│  [ 주 ][ 월 ][ 전체 ]               │  ← SegmentedControl (전체는 Pro)
│                                    │
│  ╔══════════════════════════════╗  │
│  ║ 이번주 복용률                 ║  │
│  ║                                ║  │
│  ║    ██▓▓░░░ 85%               ║  │  ← ProgressBar
│  ║                                ║  │
│  ║ 월 화 수 목 금 토 일          ║  │
│  ║ ● ● ◐ ● ● ○ ·                ║  │  ← 일별 달성 (BarChart 대체 Dots)
│  ╚══════════════════════════════╝  │
│                                    │
│  영양제별 복용률                    │  ← ListHeader
│  ┌──────────────────────────────┐  │
│  │ 종합비타민       7/7  100%    │  │  ← ListRow + ProgressBar
│  │ ████████████████████          │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 오메가3         5/7   71%     │  │
│  │ ██████████████░░░░             │  │
│  └──────────────────────────────┘  │
│                                    │
│  (무료 유저) 🔒 7일 초과 기록은      │
│  프리미엄에서 확인할 수 있어요        │  ← Result figure
│  [ 영양해 프로 보기 ]                │
│                                    │
├────────────────────────────────────┤
│ [Tab: 홈 · 영양제 · 기록 · 설정]    │
└────────────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 |
|------|---------|
| 기간 토글 | `SegmentedControl` 3개 (전체는 disabled for free) |
| 주간 달성률 | `ProgressBar progress={0.85} size="bold"` |
| 일별 도트 | 커스텀 7칸 그리드 (blue500/grey300) |
| 영양제별 | `ListRow` + 내부 `ProgressBar` |
| 차트 상세 (Pro) | `BarChart` |
| 락 상태 | `Result` + `Button` 페이월 링크 |
| 월간 리포트 PDF | (Pro) `Button weak` 다운로드 |

### 인터랙션
- 날짜 셀 탭 → BottomSheet (해당 날짜 상세)
- 무료 사용자는 8일 이전 날짜 블러 + 프리미엄 CTA
- Pro 전용: 월간 리포트(PDF) 다운로드, 성분 상호작용 경고 주간 요약

---

## 5️⃣ 프리미엄 페이월 (영양해 프로)

**Purpose**: IAP 결제 플로우. 해지해 스타일 계승 + 4중 게이팅 명확히 전달.
**Route**: `/paywall`

### 와이어프레임
```
┌────────────────────────────────────┐
│ [네비게이션바: 닫기]                │
├────────────────────────────────────┤
│         [로고 80×80]                │
│         영양해 프로                 │  ← Typography 1 bold
│   무제한 기록, 무광고, 깊은 분석     │  ← Typography 5 grey600
│                                    │
│  ✅ 영양제 무제한 등록               │  ← ListRow check icon
│  ✅ 모든 기록·통계 평생 보관         │
│  ✅ 광고 제거                        │
│  ✅ 월간 건강 리포트 (PDF)           │
│  ✅ 성분 상호작용 경고               │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ○ 월 구독           ₩3,900/월 │  │  ← Radio ListRow
│  │ ● 연 구독  추천    ₩29,900/년 │  │  ← 선택 (blue500 border)
│  │   월 ₩2,492 — 35% ↓           │  │
│  │ ○ 평생 이용        ₩39,900    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌─ 포인트로 교환하기 (1일권) ─┐    │
│  │  잔여 2,300p · 1,000p 사용   │    │  ← weak Button
│  └──────────────────────────────┘    │
│                                    │
│  환불은 토스 앱 > 전체 > 게임 >      │
│  프로필 > 구매내역에서 요청 가능     │  ← Typography 7 grey600
│                                    │
├────────────────────────────────────┤
│  [ 연 구독 시작하기 — ₩29,900 ]    │  ← BottomCTA.Single
└────────────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 |
|------|---------|
| 닫기 | 네비게이션바 accessory (IconButton 모노톤) |
| 헤더 | `Text t1 bold` + `Text t5` |
| 혜택 목록 | `ListRow padding="medium"` + `ListRow.Left` green check icon |
| 플랜 선택 | `ListRow` + `Checkbox.Circle inputType="radio"` |
| 추천 배지 | `Badge color="blue" variant="fill" size="small"` "추천" |
| 포인트 교환 | `Button variant="weak" size="large"` (잔여 부족 시 disabled) |
| 환불 안내 | `Text t7` grey600 — **필수** (심사 가이드) |
| CTA | `BottomCTA.Single` 동적 라벨 (선택 플랜 반영) |

### 인터랙션
1. 플랜 선택 → CTA 라벨·가격 자동 갱신
2. 포인트 교환 탭 → `openConfirm` ("1,000p로 1일 프로를 쓸까요?") → usePremium.grantByPoints()
3. CTA 탭 → iapService.createOneTimePurchaseOrder(sku) → 성공 시 Toast + 홈 이동
4. 실패: dialog.openAlert (TDS Dialog, 절대 `alert()` X)
5. 결제 중: Button `loading` 상태

---

## 6️⃣ 설정

**Purpose**: 관리 기능 + 심사 필수 항목 (환불 정책, 이용약관).
**Route**: `/settings`

### 와이어프레임
```
┌────────────────────────────────────┐
│ [네비게이션바]                      │
├────────────────────────────────────┤
│  설정                               │
│                                    │
│  ── 알림 ──                         │  ← ListHeader
│  ┌──────────────────────────────┐  │
│  │ 알림 사용         [Switch ON] │  │
│  │ 아침 알림 시간    08:00   >   │  │
│  │ 점심 알림 시간    12:30   >   │  │
│  │ 저녁 알림 시간    19:00   >   │  │
│  └──────────────────────────────┘  │
│                                    │
│  ── 프리미엄 ──                     │
│  ┌──────────────────────────────┐  │
│  │ 멤버십 상태      프로 ✨      │  │
│  │ 다음 결제일      2026-11-23   │  │
│  │ 구매 복원                >    │  │
│  │ 환불 안내                >    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ── 포인트 ──                       │
│  ┌──────────────────────────────┐  │
│  │ 현재 포인트      2,300p       │  │
│  │ 포인트 내역              >    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ── 기타 ──                         │
│  ┌──────────────────────────────┐  │
│  │ 이용약관                 >    │  │
│  │ 개인정보처리방침         >    │  │
│  │ 오픈소스 라이선스        >    │  │
│  │ 버전 정보        v1.0.0       │  │
│  └──────────────────────────────┘  │
│                                    │
│  ── 위험 영역 ──                    │
│  [ 모든 데이터 초기화 ]              │  ← Button color="danger" variant="weak"
│                                    │
├────────────────────────────────────┤
│ [Tab: 홈 · 영양제 · 기록 · 설정]    │
└────────────────────────────────────┘
```

### TDS 컴포넌트 매핑
| 요소 | 컴포넌트 |
|------|---------|
| 섹션 헤더 | `ListHeader title="알림"` |
| 알림 토글 | `ListRow` + `Switch` right slot |
| 시간 설정 | `ListRow` + text right + `ListRow.ArrowIcon` → BottomSheet |
| 프리미엄 상태 | `ListRow` + `Badge color="blue"` "프로" |
| 구매 복원 | `ListRow` → `iapService.getCompletedOrRefundedOrders()` |
| 환불 안내 | `ListRow` → BottomSheet + 안내 텍스트 (심사 필수) |
| 데이터 초기화 | `Button danger weak` → `openAsyncConfirm` |

### 인터랙션
- 모든 액션은 TDS Dialog (`useDialog`) 또는 BottomSheet (`useBottomSheet`)
- 데이터 초기화: 이중 확인 (openAsyncConfirm) 후 IndexedDB 전체 drop

---

## 🔁 크로스 화면 패턴

### 1-Tap Check (최우선 UX)
```
알림 푸시 → 앱 열림 → 홈 (관련 영양제 하이라이트)
                    ↓
                  ListRow 탭 (전체 행이 탭 영역, ≥ 56px height)
                    ↓
                  체크박스 애니메이션 (200ms)
                    ↓
                  Toast "영양해요! 연속 8일째" (자동 사라짐)
```
> 총 탭 수: 1. 총 시간: ≤3초.

### 포인트 경제 루프
```
광고 시청 (+50p) ─┐
스트릭 달성 (+200p) ─┼─→ points: number ─→ 프리미엄 1일권 교환 (-1000p)
                  ─┘                   ─→ 스트릭 복구권 (-500p)
```
> 모든 적립/사용은 `pointsTransactions`에 기록. 설정 → 포인트 내역에서 확인.

### 페이월 트리거 지점
1. 4번째 영양제 등록 시 (개수 제한)
2. 8일 이전 히스토리 접근 시 (기간 제한)
3. "광고 제거" 토글 시 (설정)
4. 월간 리포트 다운로드 / 성분 경고 확장 시

### 다이얼로그·토스트 원칙 (심사 위반 방지)
| 상황 | 절대 금지 | 올바른 선택 |
|------|----------|------------|
| 확인 메시지 | `alert()`, `confirm()`, `prompt()` | `useDialog().openAlert/openConfirm` |
| 피드백 | window.alert | `useToast` |
| 선택 패널 | 커스텀 모달 | `useBottomSheet` |
| 에러 | `console.error` 노출 | `Toast` + TDS Dialog |

---

## 📐 반응형 & 접근성

### 탭 타겟
- 모든 인터랙티브 요소: **최소 44×44px** (iOS HIG)
- 복용 체크 ListRow: **최소 56px** (1-tap 심플 위해 크게)

### 타이포그래피 A11y
- 고정 px 금지 — TDS 스케일 사용 → iOS 다이나믹 타입/Android 글자크기 자동 대응
- 최소 13px (Typography 7)

### 색상 대비
- 본문: grey900 on #FFFFFF (대비 16:1 ✅)
- CTA: white on blue500 (대비 4.55:1 ✅)
- 보조 텍스트: grey600 on #FFFFFF (대비 7:1 ✅)

### 다크 모드
- `adaptiveFloatBackground` 등 adaptive 토큰 사용 → 시스템 다크 모드 자동 전환
- 로고는 라이트/다크 모두 가시적 (심사 필수)

---

## ✅ TDS 컴플라이언스 체크리스트 (개발 완료 후 자기검증)

- [ ] 모든 색이 `colors.*` 토큰. 하드코딩 0건
- [ ] 타이포그래피 `t1~t7` / `st1~st13`만 사용
- [ ] `Button`/`Switch`/`Checkbox` 등 인터랙티브는 TDS 컴포넌트
- [ ] 다이얼로그: `useDialog` 사용, `alert()` 0건
- [ ] 토스트: `useToast` 사용
- [ ] 바텀시트: `useBottomSheet` 또는 `<BottomSheet />`
- [ ] 리스트: `ListRow`
- [ ] 앱 루트: `<TDSMobileAITProvider>` 필수
- [ ] 폰트 스택: TDS 기본
- [ ] `--adaptiveFloatBackground: #FFFFFF` 선언 (styles.css `:root`)
- [ ] 공통 네비게이션바만 사용, 자체 헤더/백버튼 0건
- [ ] `user-scalable=no` viewport 메타 포함
- [ ] 모노톤 아이콘만 네비게이션 액세서리에 사용
- [ ] 핀치줌 비활성화 확인
- [ ] 첫 화면 뒤로가기 = 미니앱 종료

---

## 📦 라우트 구조 요약

| Path | Screen | Public |
|------|--------|--------|
| `/intro` | 온보딩 (최초 1회) | ✅ |
| `/` | 홈 (오늘의 복용) | ✅ |
| `/supplements` | 영양제 리스트 | ✅ |
| `/supplements/new` | 등록 (BottomSheet) | ✅ |
| `/supplements/:id` | 편집 | ✅ |
| `/history` | 복용 기록 (7일 이후 Pro) | 🔒 |
| `/paywall` | 영양해 프로 결제 | ✅ |
| `/settings` | 설정 | ✅ |

---

## 🎬 다음 단계

1. **이 디자인 승인** — 수정 사항 반영
2. `/harness-init` — granite.config.ts, index.html, 로고, viewport, 공통 네비게이션바 설정 자동 생성
3. `/harness-progress` — 화면 단위로 구현 진행 (1일 1화면 권장)
4. 매 화면 완료 시 `/harness-validate` — NEVER/ALWAYS 위반 자동 탐지
5. 완료 후 `/appintoss-nongame-launch-checklist` — 11단계 심사 체크
