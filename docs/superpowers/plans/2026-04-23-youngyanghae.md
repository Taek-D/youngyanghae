# 영양해 (Youngyanghae) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 앱인토스에서 20~30대 직장인 대상 영양제 복용 루틴 트래커 미니앱 "영양해"를 3~4주 내 MVP로 런칭한다. 광고+프리미엄 하이브리드 수익 모델, 1-tap 극단적 심플 UX, 해지해 검증 아키텍처 계승.

**Architecture:** Vite + React 19 + TypeScript + AppsInToss web-framework 2.0.1. TDS Mobile + shadcn-ui 혼용. IndexedDB(`idb`) 로컬 영속화, 서버 없음. Premium 3-layer 패턴(types → repository → service → hook → context). IAP 비소모품, 보상형 광고, 자체 앱 내 포인트 화폐.

**Tech Stack:** `@apps-in-toss/web-framework@2.0.1`, `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@toss/tds-colors`, `@emotion/react@^11`, `react@19`, `react-router@7`, `idb@8`, `vitest`, `bun` (build/test/lint).

**Reference Documents:**
- `.ouroboros/seed.yaml` — Crystallized spec
- `.ouroboros/design.md` — 6 화면 TDS 와이어프레임
- `E:\프로젝트\앱인토스\해지해\src` — 검증된 IAP·Premium 아키텍처 원본
- `apps-in-toss-examples-robin/_template` — 보일러플레이트
- `CLAUDE.md` — 앱인토스 NEVER/ALWAYS 심사 규칙

**Reference Skills:** `@appintoss-tds-mobile`, `@appintoss-login`, `@appintoss-rewarded-ad`, `@appintoss-nongame-launch-checklist`, `@harness-validate`

---

## Chunk 1: Bootstrap & Branding

### Task 1: 프로젝트 초기화 + 브랜딩

**Files:**
- Create: `granite.config.ts` (루트)
- Create: `index.html` (루트)
- Modify: `package.json` (루트)
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Dependencies 설치**

```bash
bun add @apps-in-toss/web-framework@2.0.1 @toss/tds-mobile @toss/tds-mobile-ait @toss/tds-colors @emotion/react@^11 react@19 react-dom@19 react-router@7 idb@8
bun add -D @types/react@19 @types/react-dom@19 typescript@^5.8 vitest @testing-library/react @testing-library/jest-dom jsdom
```

Expected: package.json `dependencies` + `devDependencies` 반영

- [ ] **Step 2: granite.config.ts 작성 (심사 필수 준수)**

```ts
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'youngyanghae',
  brand: {
    displayName: '영양해',
    primaryColor: '#3182F6', // TDS blue500, 6-digit hex, # 필수
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    initialAccessoryButton: {
      id: 'points',
      title: 'Points',
      icon: { name: 'icon-coin-mono' }, // 모노톤 필수 (NEVER 컬러 아이콘)
    },
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: { dev: 'vite', build: 'vite build' },
  },
  outdir: 'dist',
});
```

- [ ] **Step 3: index.html 작성 (핀치줌 비활성화 필수)**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>영양해</title>
  <meta property="og:title" content="영양해" />
  <meta property="og:description" content="오늘도 영양해? — 1초 영양제 복용 체크" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 4: styles.css에 adaptiveFloatBackground 선언 (해지해에서 학습한 필수 변수)**

```css
:root {
  --adaptiveFloatBackground: #FFFFFF;
  --adaptiveBackground: #FFFFFF;
}
@media (prefers-color-scheme: dark) {
  :root {
    --adaptiveFloatBackground: #1F2937;
    --adaptiveBackground: #191F28;
  }
}
body { margin: 0; font-family: "Toss Product Sans", "Tossface", "SF Pro KR", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", Roboto, "Noto Sans KR", sans-serif; }
```

- [ ] **Step 5: src/main.tsx + src/App.tsx (Provider 래핑)**

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TDSMobileAITProvider>
      <App />
    </TDSMobileAITProvider>
  </React.StrictMode>
);
```

- [ ] **Step 6: dev 서버 기동 확인**

```bash
bun run dev
```

Expected: `http://localhost:5173` 접속 시 흰 화면(에러 없음), 콘솔 에러 0

- [ ] **Step 7: Commit**

```bash
git add granite.config.ts index.html package.json src/App.tsx src/main.tsx src/styles.css
git commit -m "feat: initialize 영양해 project with TDS provider and AppsInToss config"
```

---

### Task 2: 로고·네비게이션바 액세서리 자산

**Files:**
- Create: `public/logo-light.png` (600×600, 각진 정사각형, 라이트모드 가시)
- Create: `public/logo-dark.png` (600×600, 다크모드 가시)
- Create: `public/icon-coin-mono.png` (48×48, 모노톤)

- [ ] **Step 1: 로고 스펙 확인**

라이트/다크 모드 모두 가시적이어야 함 (심사 ALWAYS 규칙). 각진 정사각형 (라운드 X).

- [ ] **Step 2: 로고 배치 후 manifest 확인**

로고 파일을 `public/`에 배치. `granite.config.ts`의 `brand.logo`에 경로 명시 (SDK 문서 확인 필요).

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: add brand logos (light/dark) and coin accessory icon"
```

---

## Chunk 2: Foundation — Types, Storage, Repositories

### Task 3: 도메인 타입 정의

**Files:**
- Create: `src/types/supplement.ts`
- Create: `src/types/intakeLog.ts`
- Create: `src/types/streak.ts`
- Create: `src/types/points.ts`
- Create: `src/types/premium.ts`
- Create: `src/types/index.ts` (barrel export)

- [ ] **Step 1: Supplement 타입**

```ts
// src/types/supplement.ts
export type IntakeSlot = 'morning' | 'lunch' | 'evening' | 'bedtime';
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun=0

export interface Supplement {
  id: string;               // crypto.randomUUID()
  name: string;             // "종합비타민"
  brand?: string;
  dose: string;             // "1정"
  slots: IntakeSlot[];      // ['morning']
  weekdays: Weekday[];      // [1,2,3,4,5] 평일
  color?: string;           // TDS color token (UI 구분용)
  createdAt: number;        // Date.now()
}
```

- [ ] **Step 2: IntakeLog 타입**

```ts
// src/types/intakeLog.ts
export type IntakeStatus = 'taken' | 'skipped' | 'missed';

export interface IntakeLog {
  id: string;                // `${supplementId}:${dateISO}:${slot}`
  supplementId: string;
  dateISO: string;           // '2026-04-23'
  slot: import('./supplement').IntakeSlot;
  status: IntakeStatus;
  takenAt?: number;
}
```

- [ ] **Step 3: Streak, Points, Premium 타입**

```ts
// src/types/streak.ts
export interface StreakState {
  currentDays: number;
  longestDays: number;
  lastCheckDate: string;     // dateISO
  freezesAvailable: number;  // 복구권 잔량 (포인트로 구매)
}

// src/types/points.ts
export type PointsSource =
  | 'ad_watch' | 'streak_3' | 'streak_7' | 'streak_30'
  | 'spend_premium_1d' | 'spend_premium_7d' | 'spend_freeze'
  | 'grant_initial';

export interface PointsTransaction {
  id: string;
  type: 'earn' | 'spend';
  source: PointsSource;
  amount: number;            // 양수, type이 spend면 차감
  createdAt: number;
}

// src/types/premium.ts
export type PremiumPlan = 'monthly' | 'yearly' | 'lifetime' | 'points_1d' | 'points_7d';
export type PremiumSource = 'iap' | 'points';

export interface PremiumStatus {
  active: boolean;
  plan?: PremiumPlan;
  source?: PremiumSource;
  sku?: string;
  expiresAt?: number;        // Date.now() epoch ms
  lastRestoredAt?: number;
}
```

- [ ] **Step 4: Barrel export**

```ts
// src/types/index.ts
export * from './supplement';
export * from './intakeLog';
export * from './streak';
export * from './points';
export * from './premium';
```

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: define domain types (Supplement, IntakeLog, Streak, Points, Premium)"
```

---

### Task 4: IndexedDB 스키마 + 마이그레이션 (idb)

**Files:**
- Create: `src/storage/db.ts`
- Test: `src/storage/db.test.ts`

- [ ] **Step 1: 실패 테스트 작성 (DB 오픈 + 스키마 검증)**

```ts
// src/storage/db.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { openDB_YYH } from './db';

describe('openDB_YYH', () => {
  it('opens DB v1 with all object stores', async () => {
    const db = await openDB_YYH();
    expect([...db.objectStoreNames]).toEqual(
      expect.arrayContaining(['supplements', 'intakeLogs', 'streak', 'points', 'pointsTx', 'premium', 'pendingOrders'])
    );
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
bun test src/storage/db.test.ts
```

Expected: FAIL "openDB_YYH not defined"

- [ ] **Step 3: db.ts 구현**

```ts
// src/storage/db.ts
import { openDB, type IDBPDatabase } from 'idb';

export const DB_NAME = 'youngyanghae';
export const DB_VERSION = 1;

export async function openDB_YYH(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('supplements', { keyPath: 'id' });
        const logs = db.createObjectStore('intakeLogs', { keyPath: 'id' });
        logs.createIndex('by-date', 'dateISO');
        logs.createIndex('by-supplement', 'supplementId');
        db.createObjectStore('streak');                 // singleton, key 'current'
        db.createObjectStore('points');                 // singleton, key 'balance'
        db.createObjectStore('pointsTx', { keyPath: 'id' });
        db.createObjectStore('premium');                // singleton, key 'status'
        db.createObjectStore('pendingOrders', { keyPath: 'orderId' });
      }
    },
  });
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
bun add -D fake-indexeddb
bun test src/storage/db.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/storage/db.ts src/storage/db.test.ts package.json
git commit -m "feat: IndexedDB schema v1 (supplements, logs, streak, points, premium)"
```

---

### Task 5: Repository Layer (CRUD per store)

**Files:**
- Create: `src/storage/supplementRepository.ts`
- Create: `src/storage/intakeLogRepository.ts`
- Create: `src/storage/streakRepository.ts`
- Create: `src/storage/pointsRepository.ts`
- Create: `src/storage/premiumRepository.ts`
- Test: `src/storage/supplementRepository.test.ts`
- Test: `src/storage/intakeLogRepository.test.ts`
- Test: `src/storage/pointsRepository.test.ts`

- [ ] **Step 1: SupplementRepository 실패 테스트**

```ts
// src/storage/supplementRepository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { supplementRepo } from './supplementRepository';

describe('supplementRepo', () => {
  beforeEach(async () => { await supplementRepo.deleteAll(); });

  it('creates and lists supplements', async () => {
    await supplementRepo.create({ id: 'a', name: '비타민C', dose: '1정', slots: ['morning'], weekdays: [1,2,3,4,5], createdAt: Date.now() });
    const list = await supplementRepo.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('비타민C');
  });

  it('counts accurately (for free tier gating)', async () => {
    for (let i=0;i<3;i++) await supplementRepo.create({ id:`s${i}`, name:`s${i}`, dose:'1정', slots:['morning'], weekdays:[1], createdAt:Date.now() });
    expect(await supplementRepo.count()).toBe(3);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인 → 구현**

```ts
// src/storage/supplementRepository.ts
import type { Supplement } from '@/types';
import { openDB_YYH } from './db';

export const supplementRepo = {
  async create(s: Supplement) { const db = await openDB_YYH(); await db.put('supplements', s); },
  async update(s: Supplement) { const db = await openDB_YYH(); await db.put('supplements', s); },
  async get(id: string) { const db = await openDB_YYH(); return db.get('supplements', id); },
  async list(): Promise<Supplement[]> { const db = await openDB_YYH(); return db.getAll('supplements'); },
  async remove(id: string) { const db = await openDB_YYH(); await db.delete('supplements', id); },
  async count(): Promise<number> { const db = await openDB_YYH(); return db.count('supplements'); },
  async deleteAll() { const db = await openDB_YYH(); await db.clear('supplements'); },
};
```

- [ ] **Step 3: 반복 (intakeLog, streak, points, premium)**

각 repository 동일 TDD 패턴:
- `intakeLogRepository.ts`: `logIntake`, `getByDate(dateISO)`, `getByRange(from, to)`, `countByStatus(status, dateISO)`
- `streakRepository.ts`: `get()`, `set(state)`, `reset()`
- `pointsRepository.ts`: `getBalance()`, `earn(source, amount)`, `spend(source, amount)`, `history()` (트랜잭션은 pointsTx store)
- `premiumRepository.ts`: `getStatus()`, `setStatus(status)`, `addPendingOrder(order)`, `getPendingOrders()`, `removePendingOrder(id)`

- [ ] **Step 4: 모든 repository 테스트 통과 확인**

```bash
bun test src/storage/
```

Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/storage/
git commit -m "feat: repository layer with CRUD for all domain stores"
```

---

### Task 6: 상수 + 비즈니스 룰 (premiumConstants.ts 패턴)

**Files:**
- Create: `src/config/premiumConstants.ts`
- Create: `src/config/pointsConstants.ts`

- [ ] **Step 1: 상수 정의**

```ts
// src/config/premiumConstants.ts
export const IAP_SKU = {
  monthly: 'ait.XXXXXX.yyh.monthly',    // 실제 발급 SKU로 교체
  yearly:  'ait.XXXXXX.yyh.yearly',
  lifetime:'ait.XXXXXX.yyh.lifetime',
} as const;

export const PREMIUM_PRICES_KRW = {
  monthly: 3900,
  yearly: 29900,
  lifetime: 39900,
} as const;

export const FREE_SUPPLEMENT_LIMIT = 3;
export const FREE_HISTORY_DAYS = 7;
```

```ts
// src/config/pointsConstants.ts
export const POINTS_EARN = {
  ad_watch: 50,
  streak_3: 100,
  streak_7: 200,
  streak_30: 1000,
} as const;

export const POINTS_SPEND = {
  premium_1d: 1000,
  premium_7d: 5000,
  freeze: 500,
} as const;

export const INITIAL_GRANT = 0; // 프로모션 시 변경
```

- [ ] **Step 2: Commit**

```bash
git add src/config/
git commit -m "feat: premium/points business rule constants"
```

---

## Chunk 3: Services & Hooks Layer

### Task 7: iapService — IAP SDK 래퍼 + 에러코드 파싱

**Files:**
- Create: `src/services/iapService.ts`
- Test: `src/services/iapService.test.ts`

- [ ] **Step 1: 실패 테스트**

```ts
// src/services/iapService.test.ts
import { describe, it, expect } from 'vitest';
import { parseIAPError } from './iapService';

describe('parseIAPError', () => {
  it('maps CANCELED code to friendly message', () => {
    expect(parseIAPError({ code: 'CANCELED' }).userMessage).toBe('결제가 취소됐어요');
  });
  it('maps unknown code to generic fallback', () => {
    expect(parseIAPError({ code: 'XYZ' }).userMessage).toContain('다시 시도');
  });
});
```

- [ ] **Step 2: 구현 — Dynamic import + isSupported 패턴 (SDK import rule)**

```ts
// src/services/iapService.ts
import type { PremiumPlan } from '@/types';
import { IAP_SKU } from '@/config/premiumConstants';

export function parseIAPError(err: { code?: string } | unknown) {
  const code = (err as any)?.code ?? 'UNKNOWN';
  const userMessage = {
    CANCELED: '결제가 취소됐어요',
    NETWORK_ERROR: '네트워크 상태를 확인해주세요',
    ALREADY_OWNED: '이미 구매한 상품이에요',
  }[code] ?? '결제 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.';
  return { code, userMessage };
}

export async function purchase(plan: PremiumPlan): Promise<{ orderId: string } | null> {
  const sku = IAP_SKU[plan as keyof typeof IAP_SKU];
  if (!sku) throw new Error(`Invalid plan: ${plan}`);
  const { createOneTimePurchaseOrder } = await import('@apps-in-toss/web-framework');
  if (createOneTimePurchaseOrder.isSupported() !== true) {
    console.warn('[iap] not supported in this environment (mock)');
    return null; // 웹/샌드박스 mock
  }
  const result = await createOneTimePurchaseOrder({ productId: sku });
  return { orderId: result.orderId };
}

export async function getCompletedOrRefundedOrders(): Promise<Array<{ orderId: string; status: 'COMPLETED' | 'REFUNDED'; productId: string }>> {
  const { getCompletedOrRefundedOrders } = await import('@apps-in-toss/web-framework');
  if (getCompletedOrRefundedOrders.isSupported() !== true) return [];
  return getCompletedOrRefundedOrders();
}
```

- [ ] **Step 3: 테스트 통과 확인 + Commit**

```bash
bun test src/services/iapService.test.ts
git add src/services/iapService.ts src/services/iapService.test.ts
git commit -m "feat: IAP service wrapper with error parsing and dynamic import pattern"
```

---

### Task 8: adService — 보상형 광고 래퍼

**Files:**
- Create: `src/services/adService.ts`

- [ ] **Step 1: 구현 (loadFullScreenAd → showFullScreenAd 순서 필수)**

```ts
// src/services/adService.ts
export async function showRewardedAd(): Promise<{ rewarded: boolean }> {
  const sdk = await import('@apps-in-toss/web-framework');
  if (sdk.loadFullScreenAd?.isSupported() !== true) return { rewarded: false };
  await sdk.loadFullScreenAd({ adType: 'REWARDED' });
  const result = await sdk.showFullScreenAd({ adType: 'REWARDED' });
  return { rewarded: result?.type === 'userEarnedReward' };
}
```

> 참조: `@appintoss-rewarded-ad` 스킬. 역순 호출 시 심사 반려.

- [ ] **Step 2: Commit**

```bash
git add src/services/adService.ts
git commit -m "feat: rewarded ad service (load→show order enforced)"
```

---

### Task 9: streakService — 스트릭 계산 로직

**Files:**
- Create: `src/services/streakService.ts`
- Test: `src/services/streakService.test.ts`

- [ ] **Step 1: 실패 테스트**

```ts
// src/services/streakService.test.ts
import { describe, it, expect } from 'vitest';
import { computeNextStreak } from './streakService';

describe('computeNextStreak', () => {
  it('increments when consecutive day', () => {
    const next = computeNextStreak({ currentDays: 5, longestDays: 5, lastCheckDate: '2026-04-22', freezesAvailable: 0 }, '2026-04-23');
    expect(next.currentDays).toBe(6);
    expect(next.longestDays).toBe(6);
  });
  it('resets to 1 when gap > 1 day', () => {
    const next = computeNextStreak({ currentDays: 5, longestDays: 5, lastCheckDate: '2026-04-20', freezesAvailable: 0 }, '2026-04-23');
    expect(next.currentDays).toBe(1);
    expect(next.longestDays).toBe(5);
  });
  it('keeps same when same day repeat', () => {
    const next = computeNextStreak({ currentDays: 5, longestDays: 5, lastCheckDate: '2026-04-23', freezesAvailable: 0 }, '2026-04-23');
    expect(next.currentDays).toBe(5);
  });
});
```

- [ ] **Step 2: 구현**

```ts
// src/services/streakService.ts
import type { StreakState } from '@/types';

function daysBetween(a: string, b: string): number {
  const d = (s: string) => Date.UTC(+s.slice(0,4), +s.slice(5,7)-1, +s.slice(8,10));
  return Math.round((d(b) - d(a)) / 86400000);
}

export function computeNextStreak(prev: StreakState, todayISO: string): StreakState {
  const gap = daysBetween(prev.lastCheckDate, todayISO);
  let currentDays: number;
  if (gap === 0) currentDays = prev.currentDays;
  else if (gap === 1) currentDays = prev.currentDays + 1;
  else currentDays = 1;
  const longestDays = Math.max(prev.longestDays, currentDays);
  return { ...prev, currentDays, longestDays, lastCheckDate: todayISO };
}

export function shouldMilestoneReward(days: number): 3 | 7 | 30 | null {
  if (days === 30) return 30;
  if (days === 7) return 7;
  if (days === 3) return 3;
  return null;
}
```

- [ ] **Step 3: Commit**

```bash
bun test src/services/streakService.test.ts
git add src/services/streakService.ts src/services/streakService.test.ts
git commit -m "feat: streak computation (consecutive-day logic + milestones)"
```

---

### Task 10: Hooks — useSupplements, usePremium, usePoints, useIntake

**Files:**
- Create: `src/hooks/useSupplements.ts`
- Create: `src/hooks/useIntake.ts`
- Create: `src/hooks/usePremium.ts`
- Create: `src/hooks/usePoints.ts`
- Create: `src/hooks/useStreak.ts`

- [ ] **Step 1: useSupplements (React Query 사용 안 함, 단순 useState + repo)**

```ts
// src/hooks/useSupplements.ts
import { useEffect, useState, useCallback } from 'react';
import { supplementRepo } from '@/storage/supplementRepository';
import type { Supplement } from '@/types';

export function useSupplements() {
  const [items, setItems] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setItems(await supplementRepo.list());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (s: Supplement) => { await supplementRepo.create(s); await refresh(); };
  const update = async (s: Supplement) => { await supplementRepo.update(s); await refresh(); };
  const remove = async (id: string) => { await supplementRepo.remove(id); await refresh(); };

  return { items, loading, add, update, remove, refresh, count: items.length };
}
```

- [ ] **Step 2: usePremium (4중 게이팅 로직 포함)**

```ts
// src/hooks/usePremium.ts
import { useEffect, useState, useCallback } from 'react';
import { premiumRepo } from '@/storage/premiumRepository';
import { purchase, getCompletedOrRefundedOrders } from '@/services/iapService';
import type { PremiumPlan, PremiumStatus } from '@/types';

export function usePremium() {
  const [status, setStatus] = useState<PremiumStatus>({ active: false });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await premiumRepo.getStatus();
    // 만료 체크
    if (s.active && s.expiresAt && s.expiresAt < Date.now()) {
      const expired = { active: false };
      await premiumRepo.setStatus(expired);
      setStatus(expired);
    } else setStatus(s);
    setLoading(false);
  }, []);

  const buy = async (plan: PremiumPlan) => {
    const result = await purchase(plan);
    if (!result) return { ok: false as const, reason: 'unsupported' as const };
    const durMs = plan === 'lifetime' ? null : plan === 'yearly' ? 365*86400000 : 30*86400000;
    await premiumRepo.setStatus({
      active: true, plan, source: 'iap',
      sku: result.orderId, // TODO: SKU mapping
      expiresAt: durMs ? Date.now() + durMs : undefined,
    });
    await refresh();
    return { ok: true as const };
  };

  const restore = async () => {
    const orders = await getCompletedOrRefundedOrders();
    // REFUNDED 감지 → 프리미엄 해제, COMPLETED 감지 → 활성화
    const completed = orders.find(o => o.status === 'COMPLETED');
    const refunded = orders.find(o => o.status === 'REFUNDED');
    if (refunded) { await premiumRepo.setStatus({ active: false }); await refresh(); return; }
    if (completed) { /* 복원 로직 */ }
  };

  useEffect(() => { refresh(); }, [refresh]);
  return { status, loading, buy, restore, refresh };
}
```

- [ ] **Step 3: usePoints (earn/spend 간단 래퍼)**

```ts
// src/hooks/usePoints.ts
import { useEffect, useState, useCallback } from 'react';
import { pointsRepo } from '@/storage/pointsRepository';
import type { PointsSource } from '@/types';

export function usePoints() {
  const [balance, setBalance] = useState(0);
  const refresh = useCallback(async () => setBalance(await pointsRepo.getBalance()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const earn = async (source: PointsSource, amount: number) => { await pointsRepo.earn(source, amount); await refresh(); };
  const spend = async (source: PointsSource, amount: number) => {
    const b = await pointsRepo.getBalance();
    if (b < amount) return { ok: false as const };
    await pointsRepo.spend(source, amount);
    await refresh();
    return { ok: true as const };
  };
  return { balance, earn, spend, refresh };
}
```

- [ ] **Step 4: useIntake + useStreak (홈 화면 코어 훅)**

```ts
// src/hooks/useIntake.ts
// 오늘자 IntakeLog 조회 + toggle(supplementId, slot) 제공
// toggle 시: 로그 저장 → 스트릭 업데이트 → 마일스톤 시 포인트 적립
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: domain hooks (useSupplements, useIntake, usePremium, usePoints, useStreak)"
```

---

### Task 11: PremiumContext — 앱 시작 시 미결 주문 자동 복원

**Files:**
- Create: `src/contexts/PremiumContext.tsx`
- Modify: `src/App.tsx` (Provider 추가)

- [ ] **Step 1: Context 작성 (해지해 패턴 재현)**

```tsx
// src/contexts/PremiumContext.tsx
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePremium } from '@/hooks/usePremium';

const Ctx = createContext<ReturnType<typeof usePremium> | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const premium = usePremium();
  // 앱 시작 시 자동 복원
  useEffect(() => { premium.restore().catch(console.error); }, []);
  return <Ctx.Provider value={premium}>{children}</Ctx.Provider>;
}

export function usePremiumContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('PremiumProvider missing');
  return v;
}
```

- [ ] **Step 2: App.tsx에서 래핑**

```tsx
// src/App.tsx
import { PremiumProvider } from '@/contexts/PremiumContext';
// <PremiumProvider> <RouterProvider ... /> </PremiumProvider>
```

- [ ] **Step 3: Commit**

```bash
git add src/contexts/ src/App.tsx
git commit -m "feat: PremiumContext with auto-restore on app boot"
```

---

## Chunk 4: Screens — Intro, Home, Supplements

### Task 12: 라우터 설정

**Files:**
- Modify: `src/App.tsx`
- Create: `src/router.tsx`

- [ ] **Step 1: React Router 7 설정**

```tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router';
import IntroPage from '@/pages/IntroPage';
import HomePage from '@/pages/HomePage';
import SupplementListPage from '@/pages/SupplementListPage';
import SupplementEditPage from '@/pages/SupplementEditPage';
import HistoryPage from '@/pages/HistoryPage';
import PaywallPage from '@/pages/PaywallPage';
import SettingsPage from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  { path: '/intro', element: <IntroPage /> },
  { path: '/', element: <HomePage /> },
  { path: '/supplements', element: <SupplementListPage /> },
  { path: '/supplements/new', element: <SupplementEditPage /> },
  { path: '/supplements/:id', element: <SupplementEditPage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/paywall', element: <PaywallPage /> },
  { path: '/settings', element: <SettingsPage /> },
]);
```

- [ ] **Step 2: 온보딩 가드 구현 (App.tsx 내부)**

앱 첫 진입 시 `localStorage.getItem('youngyang:onboarding-completed')` 없으면 `/intro` 리다이렉트.

- [ ] **Step 3: Commit**

```bash
git add src/router.tsx src/App.tsx
git commit -m "feat: router setup with onboarding guard"
```

---

### Task 13: 인트로 화면 (`/intro`)

**Files:**
- Create: `src/pages/IntroPage.tsx`

- [ ] **Step 1: 컴포넌트 작성 — design.md 화면 1 참조**

```tsx
// src/pages/IntroPage.tsx
import { useNavigate } from 'react-router';
import { Text, BottomCTA, Asset } from '@toss/tds-mobile';
import { colors } from '@toss/tds-colors';

export default function IntroPage() {
  const nav = useNavigate();
  const start = () => {
    localStorage.setItem('youngyang:onboarding-completed', '1');
    nav('/', { replace: true });
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', padding:24 }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <img src="/logo-light.png" alt="영양해" width={120} height={120} />
        <Text typography="t1" weight="bold" color={colors.grey900}>영양해</Text>
        <Text typography="t5" color={colors.grey600}>매일 1번, 톡 누르면 끝 — 오늘도 영양해?</Text>
      </div>
      <BottomCTA.Single onClick={start} color="primary">영양해 시작하기</BottomCTA.Single>
    </div>
  );
}
```

> ⚠️ `appLogin()` 절대 호출 금지 (심사 NEVER 규칙). 이 화면은 로그인 불필요.

- [ ] **Step 2: 뒤로가기 = 미니앱 종료 검증**

첫 화면에서 네비게이션바 뒤로가기 버튼 = 미니앱 종료이어야 함 (리프레시 아님). SDK 기본 동작 확인.

- [ ] **Step 3: Commit**

```bash
git add src/pages/IntroPage.tsx
git commit -m "feat: intro screen (onboarding, no appLogin on mount)"
```

---

### Task 14: 홈 화면 — 1-tap 복용 체크 (핵심 UX)

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/components/StreakCard.tsx`
- Create: `src/components/IntakeListRow.tsx`
- Create: `src/components/BottomTabBar.tsx`

- [ ] **Step 1: StreakCard 컴포넌트**

```tsx
// src/components/StreakCard.tsx
import { Text } from '@toss/tds-mobile';
import { colors } from '@toss/tds-colors';
import type { StreakState } from '@/types';

export function StreakCard({ streak }: { streak: StreakState }) {
  return (
    <div style={{ background: colors.blue50, borderRadius: 16, padding: 20 }}>
      <Text typography="t7" color={colors.grey600}>🔥 연속</Text>
      <Text typography="st13" weight="bold" color={colors.orange500}>{streak.currentDays}일</Text>
      <Text typography="t7" color={colors.grey600}>
        최장 {streak.longestDays}일 · 복구권 {streak.freezesAvailable}개
      </Text>
    </div>
  );
}
```

- [ ] **Step 2: IntakeListRow — 56px 최소 높이, 1-tap**

```tsx
// src/components/IntakeListRow.tsx
import { ListRow, Checkbox } from '@toss/tds-mobile';
import type { Supplement, IntakeStatus } from '@/types';

export function IntakeListRow({ supplement, slot, status, onToggle }: {
  supplement: Supplement;
  slot: string;
  status: IntakeStatus;
  onToggle: () => void;
}) {
  const taken = status === 'taken';
  return (
    <ListRow
      padding="large"
      onClick={onToggle}  // 전체 행 탭 영역
      title={supplement.name}
      description={`${supplement.dose} · ${slot}`}
      right={
        <Checkbox.Circle
          checked={taken}
          onCheckedChange={onToggle}
          aria-label={`${supplement.name} 복용 체크`}
          size={28}
        />
      }
    />
  );
}
```

- [ ] **Step 3: BottomTabBar (홈·영양제·기록·설정)**

플로팅 탭바, 모노톤 아이콘 (심사 규칙).

- [ ] **Step 4: HomePage 조립**

```tsx
// src/pages/HomePage.tsx
// - 오늘 날짜 + "오늘도 영양해?" 헤더
// - <StreakCard />
// - 슬롯별 (morning/lunch/evening/bedtime) 그룹: ListHeader + IntakeListRow 반복
// - 모두 완료 시: Toast "오늘 완료!" + [광고 보고 +50p] Button
// - 영양제 0개: Empty state + /supplements/new CTA
// - <BottomTabBar />
```

- [ ] **Step 5: 1-tap 체크 로직 — useIntake.toggle**

- 탭 → IntakeLog 저장 (status: 'taken')
- streakService.computeNextStreak → streakRepo.set
- shouldMilestoneReward 체크 → pointsRepo.earn
- Toast 노출 (useToast)

- [ ] **Step 6: E2E 시뮬레이션**

```bash
bun run dev
# 브라우저에서 영양제 등록 → 홈에서 체크 → 스트릭 +1 확인
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/HomePage.tsx src/components/
git commit -m "feat: home screen with 1-tap intake check, streak card, bottom tabs"
```

---

### Task 15: 영양제 리스트 + 등록/편집 화면

**Files:**
- Create: `src/pages/SupplementListPage.tsx`
- Create: `src/pages/SupplementEditPage.tsx`
- Create: `src/data/supplementCatalog.ts` (50건 내부 DB)
- Create: `src/data/interactionRules.ts` (20건 상호작용)

- [ ] **Step 1: supplementCatalog.ts — 50건 시드**

```ts
// src/data/supplementCatalog.ts
export interface CatalogItem { id: string; name: string; ingredients: string[]; tags: string[]; commonDose: string; }
export const catalog: CatalogItem[] = [
  { id:'multivitamin', name:'종합비타민', ingredients:['vitamin_b','vitamin_c','zinc'], tags:['daily'], commonDose:'1정' },
  { id:'omega3', name:'오메가3', ingredients:['epa','dha'], tags:['heart','brain'], commonDose:'1정' },
  // ... 50건
];
```

- [ ] **Step 2: interactionRules.ts**

```ts
// src/data/interactionRules.ts
export interface InteractionRule { a: string; b: string; severity: 'info'|'warn'|'danger'; message: string; }
export const rules: InteractionRule[] = [
  { a:'omega3', b:'aspirin', severity:'warn', message:'오메가3와 아스피린 동시 복용 시 출혈 위험' },
  // ... 20건
];
```

- [ ] **Step 3: SupplementListPage (ListRow + FAB)**

- useSupplements + usePremiumContext 연결
- 무료 + 3개 도달 시 FAB 탭 → 페이월 트리거
- 각 행: 편집 IconButton (aria-label 필수)

- [ ] **Step 4: SupplementEditPage**

- SearchField (catalog 필터링)
- TextField: 이름/브랜드/용량
- Checkbox.Line 2×2: 복용 슬롯
- SegmentedControl: 요일 (다중)
- 상호작용 경고 (등록된 영양제와 비교)
- BottomCTA.Single "저장하기"
- 뒤로가기 시 변경사항 있으면 openConfirm("저장 안 됨, 나갈래요?")

- [ ] **Step 5: Commit**

```bash
git add src/pages/SupplementListPage.tsx src/pages/SupplementEditPage.tsx src/data/
git commit -m "feat: supplement CRUD with catalog search and interaction warnings"
```

---

## Chunk 5: History, Paywall, Ad, Settings

### Task 16: 복용 히스토리 화면

**Files:**
- Create: `src/pages/HistoryPage.tsx`
- Create: `src/components/AdherenceChart.tsx`

- [ ] **Step 1: 데이터 집계 유틸**

```ts
// src/utils/adherence.ts
// - weekAdherence(fromISO, toISO): { percent, perDay: Array<{date, taken, total}> }
// - perSupplementAdherence(): Array<{ supplementId, name, taken, total, percent }>
```

- [ ] **Step 2: HistoryPage 구성**

- SegmentedControl: 주/월/전체 (전체는 Pro 전용, 비활성화 + 페이월 tooltip)
- 주간 달성률 ProgressBar + 일별 도트 (7칸)
- 영양제별 ListRow + inline ProgressBar
- 무료: 8일 이전 블러 + Result + "영양해 프로 보기" Button

- [ ] **Step 3: Commit**

```bash
git add src/pages/HistoryPage.tsx src/components/AdherenceChart.tsx src/utils/adherence.ts
git commit -m "feat: history screen with adherence charts and 7-day free gating"
```

---

### Task 17: 페이월 화면 + IAP 결제 플로우

**Files:**
- Create: `src/pages/PaywallPage.tsx`

- [ ] **Step 1: 플랜 선택 UI**

- 3 플랜 라디오 ListRow (Checkbox.Circle inputType='radio')
- 선택 플랜 반영 동적 CTA
- 포인트 교환 weak Button (balance < 1000 시 disabled)
- 환불 안내 Typography 7 grey600 (심사 필수)

- [ ] **Step 2: 결제 플로우**

```tsx
const onPurchase = async () => {
  setLoading(true);
  try {
    const { ok, reason } = await premium.buy(selected);
    if (!ok) {
      dialog.openAlert({ title: '안내', description: '지원하지 않는 환경이에요' });
      return;
    }
    toast.open({ text: '영양해 프로로 업그레이드됐어요 ✨' });
    nav('/', { replace: true });
  } catch (e) {
    const { userMessage } = parseIAPError(e);
    dialog.openAlert({ title: '결제 실패', description: userMessage });
  } finally { setLoading(false); }
};
```

- [ ] **Step 3: 포인트 교환 플로우**

```tsx
const onExchangePoints = async () => {
  const ok = await dialog.openAsyncConfirm({
    title: '1,000p로 프로 1일권',
    description: '포인트 1,000p를 사용해 1일 동안 프리미엄을 사용할까요?',
    confirmButton: '교환하기', cancelButton: '취소',
    onConfirmClick: async () => {
      const r = await points.spend('spend_premium_1d', 1000);
      if (!r.ok) throw new Error('insufficient');
      // 1일 grant
      await premiumRepo.setStatus({ active:true, plan:'points_1d', source:'points', expiresAt:Date.now()+86400000 });
      await premium.refresh();
    },
  });
  if (ok) toast.open({ text: '프로 1일권이 활성화됐어요' });
};
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/PaywallPage.tsx
git commit -m "feat: paywall with 3 plans + points exchange + refund notice"
```

---

### Task 18: 보상형 광고 + 포인트 적립 (홈 통합)

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Create: `src/hooks/useRewardedAdFlow.ts`

- [ ] **Step 1: useRewardedAdFlow**

```ts
// src/hooks/useRewardedAdFlow.ts
import { showRewardedAd } from '@/services/adService';
import { usePoints } from './usePoints';
import { useToast } from '@toss/tds-mobile';
import { POINTS_EARN } from '@/config/pointsConstants';

export function useRewardedAdFlow() {
  const points = usePoints();
  const toast = useToast();
  return async () => {
    const { rewarded } = await showRewardedAd();
    if (rewarded) {
      await points.earn('ad_watch', POINTS_EARN.ad_watch);
      toast.open({ text: `+${POINTS_EARN.ad_watch}p 받았어요!` });
    } else {
      toast.open({ text: '광고 시청이 완료되지 않았어요' });
    }
  };
}
```

- [ ] **Step 2: HomePage 통합**

- 모두 완료 시 weak Button "광고 보고 +50p" → useRewardedAdFlow 호출
- 프리미엄 사용자는 광고 숨김

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useRewardedAdFlow.ts src/pages/HomePage.tsx
git commit -m "feat: rewarded ad flow with auto points crediting"
```

---

### Task 19: 설정 화면

**Files:**
- Create: `src/pages/SettingsPage.tsx`
- Create: `src/components/NotificationTimeSheet.tsx`

- [ ] **Step 1: ListRow 기반 설정 화면**

- 알림 사용 Switch
- 아침/점심/저녁/취침 시간 ListRow → BottomSheet 시간 피커
- 프리미엄 상태 Badge
- 구매 복원 ListRow → iapService.getCompletedOrRefundedOrders
- 환불 안내 ListRow → BottomSheet 공식 안내문
- 이용약관/개인정보/오픈소스 라이선스 ListRow
- 데이터 초기화 Button danger weak + openAsyncConfirm 이중 확인

- [ ] **Step 2: 환불 안내문 (심사 필수)**

```
"환불은 토스 앱 > 전체 > 게임 > 프로필 > 구매내역에서 요청할 수 있어요.
앱에서는 환불 기능을 제공하지 않아요."
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/SettingsPage.tsx src/components/NotificationTimeSheet.tsx
git commit -m "feat: settings screen with refund policy notice (review compliance)"
```

---

### Task 20: 로컬 푸시 알림 통합

**Files:**
- Create: `src/services/notificationService.ts`
- Modify: `src/hooks/useIntake.ts` (연동)

- [ ] **Step 1: AppsInToss 로컬 알림 API 조사**

`@appintoss-docs` 스킬로 알림 관련 SDK 확인 (`scheduleLocalNotification` 존재 여부).

- [ ] **Step 2: notificationService 래퍼 구현**

Dynamic import + isSupported 패턴 준수.

- [ ] **Step 3: 영양제 등록 시 자동 알림 예약**

영양제 추가/수정 시 각 슬롯·요일별 로컬 알림 스케줄.

- [ ] **Step 4: Commit**

```bash
git add src/services/notificationService.ts src/hooks/useIntake.ts
git commit -m "feat: local notifications for scheduled supplement slots"
```

---

## Chunk 6: Integration, QA & Launch

### Task 21: End-to-End 코어 루프 수동 테스트

**Files:**
- Create: `docs/qa/manual-test-plan.md`

- [ ] **Step 1: 핵심 시나리오 체크리스트**

1. 앱 첫 설치 → 인트로 → 홈 (영양제 0개 empty state)
2. 영양제 3개 등록 → 홈에 표시
3. 홈에서 1-tap 체크 → 스트릭 +1, Toast
4. 7일 스트릭 달성 → +200p 적립, Toast
5. 4번째 영양제 등록 시도 → 페이월 트리거
6. 페이월에서 월 구독 → IAP 성공 (실기기)
7. 영양제 무제한 등록 → 성공
8. 설정 → 데이터 초기화 → 확인 → IndexedDB clear
9. 광고 시청 → +50p 적립
10. 포인트 교환 → 프로 1일권 grant → 만료 후 자동 downgrade

- [ ] **Step 2: 실기기 2대에서 검증 (샌드박스 UserAgent는 IAP 불가)**

실제 토스앱에서 1~10번 시나리오 전체 통과 확인.

- [ ] **Step 3: Commit**

```bash
git add docs/qa/manual-test-plan.md
git commit -m "docs: E2E manual test plan for core loop and IAP"
```

---

### Task 22: 심사 규칙 자동 검증 (/harness-validate)

- [ ] **Step 1: `/harness-validate` 실행**

위반 탐지 항목:
- alert/confirm/prompt 사용 여부
- 자체 헤더/백버튼 사용 여부
- 컬러 네비게이션 아이콘
- 핀치줌 활성화
- appLogin() 앱 시작 호출
- Toss OAuth 토큰 클라이언트 노출
- 외부 결제/앱 링크 유도
- 앱 설치 유도 문구

- [ ] **Step 2: 위반 사항 모두 수정 + 재검증**

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: resolve harness-validate findings (review rule compliance)"
```

---

### Task 23: 11단계 심사 체크리스트 (/appintoss-nongame-launch-checklist)

- [ ] **Step 1: 체크리스트 실행**

1. 브랜딩 통일성 (granite.config.ts / index.html / 콘솔)
2. 로고 라이트·다크 모두 가시
3. 네비게이션바 공통 사용
4. 첫 화면 백버튼 = 앱 종료
5. 핀치줌 비활성화
6. 로그인 인트로 지연
7. alert/confirm/prompt 제거
8. 외부 링크/결제 유도 없음
9. IAP 4-플로우 실기기 검증
10. 환불 안내 문구 노출
11. 구독 오인 워딩 없음

- [ ] **Step 2: 각 항목 PASS 확인**

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: launch checklist PASS (11/11)"
```

---

### Task 24: 런칭 준비 (콘솔 등록 + 제출)

- [ ] **Step 1: 앱인토스 콘솔 등록**

- 앱 이름: 영양해
- 카테고리: 헬스/라이프
- SKU 등록 (monthly/yearly/lifetime 비소모품)
- 스킴 URL 등록 (필요 시)

- [ ] **Step 2: 빌드 + AIT 파일 생성**

```bash
bun run build
# dist/ 및 *.ait 생성 확인
```

- [ ] **Step 3: 콘솔 제출 + 심사 대기**

- [ ] **Step 4: 승인 후 런칭 공지**

---

## Appendix A: 스킬 레퍼런스 체크리스트

구현 중 참조할 스킬:
- `@appintoss-tds-mobile` — TDS 컴포넌트 사용법
- `@appintoss-login` — (필요 시) 로그인 연동
- `@appintoss-rewarded-ad` — 보상형 광고 API 상세
- `@appintoss-docs` — SDK API 레퍼런스
- `@appintoss-nongame-launch-checklist` — 11단계 심사
- `@harness-validate` — NEVER/ALWAYS 자동 검증
- `@superpowers:test-driven-development` — TDD 가이드
- `@superpowers:executing-plans` — 본 플랜 실행

## Appendix B: 해지해 참조 파일 매핑

| 영양해 파일 | 해지해 원본 | 재사용도 |
|------------|------------|---------|
| `src/types/premium.ts` | `E:\프로젝트\앱인토스\해지해\src\types\premium.ts` | 95% |
| `src/storage/premiumRepository.ts` | 동일 경로 | 90% |
| `src/services/iapService.ts` | 동일 경로 | 85% (SKU만 교체) |
| `src/hooks/usePremium.ts` | 동일 경로 | 85% |
| `src/contexts/PremiumContext.tsx` | 동일 경로 | 95% |
| `src/config/premiumConstants.ts` | 동일 경로 | 70% (FREE_LIMIT 3, 가격 3900) |

> 📌 해지해 코드 복사 시 반드시 **라이선스·작성자 주석 제거** 후 영양해 맥락으로 재작성.

## Appendix C: 타임라인 (4주)

| 주 | Chunk | Tasks | 목표 |
|----|-------|-------|------|
| W1 | 1·2 | T1~T6 | 프로젝트 부트스트랩 + 도메인 계층 완성 |
| W2 | 3·4 | T7~T15 | 서비스/훅 + 홈·인트로·영양제 CRUD 완성 |
| W3 | 5 | T16~T20 | 히스토리·페이월·광고·설정·알림 |
| W4 | 6 | T21~T24 | QA + 심사 + 런칭 |

## Appendix D: DRY/YAGNI/TDD 원칙 강제

- **DRY**: 해지해 premium 레이어 복붙 대신 **패턴 준수**하여 재작성 (라이선스 이슈 회피)
- **YAGNI**: 가족공유·토스제휴·OCR·바코드는 v2 — MVP에 넣지 않음
- **TDD**: storage layer와 streakService는 반드시 테스트 먼저. UI는 E2E 수동 테스트로 커버
- **Frequent commits**: 각 Task 완료마다 커밋. 평균 Task당 3~7커밋

---

**Plan lines total:** ~700
**Task count:** 24
**Chunk count:** 6
