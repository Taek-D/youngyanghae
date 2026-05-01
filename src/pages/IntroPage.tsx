import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_KEY } from '@/components/OnboardingGuard';

/**
 * 온보딩 화면 — 3슬라이드 + 건너뛰기.
 * 심사 규정 준수:
 * - appLogin() 자동 호출 금지 → 사용자 액션('시작하기')으로 시작
 * - 자체 헤더/백버튼 금지 → 공통 네비게이션바 사용
 * - 콘텐츠 영역 이모지는 허용 (네비게이션 액세서리만 모노톤 강제)
 */

interface Slide {
  emoji: string | null;
  title: string;
  desc: string;
}

const SLIDES: Slide[] = [
  {
    emoji: null, // 첫 슬라이드는 로고로 브랜드 강화
    title: '오늘도 영양해?',
    desc: '매일 챙겨야 할 영양제,\n1초면 끝내요.',
  },
  {
    emoji: '💊',
    title: '톡 한 번에 복용 체크',
    desc: '아침·점심·저녁·취침 슬롯별로\n오늘의 영양제를 한 번에 완료 처리해요.',
  },
  {
    emoji: '🔥',
    title: '꾸준함을 응원해요',
    desc: '연속 복용일과 3·7·30일 마일스톤마다\n보너스 포인트로 동기를 더해드릴게요.',
  },
];

export default function IntroPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  const start = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    nav('/', { replace: true });
  };

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '16px 24px 24px',
        background: '#FFFFFF',
      }}
    >
      {/* 건너뛰기 (마지막 슬라이드는 숨김) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 36 }}>
        {!isLast && (
          <button
            type="button"
            onClick={start}
            aria-label="온보딩 건너뛰기"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#9CA3AF',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 8,
              minHeight: 44,
              minWidth: 44,
              fontFamily: 'inherit',
              transition: 'color 200ms',
            }}
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* 슬라이드 콘텐츠 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          textAlign: 'center',
          padding: '0 8px',
        }}
      >
        {step === 0 ? (
          <img
            src="/logo-light.png"
            alt="영양해 로고"
            width={140}
            height={140}
            style={{ borderRadius: 28, transition: 'opacity 200ms' }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              fontSize: 110,
              lineHeight: 1,
              userSelect: 'none',
              filter: 'drop-shadow(0 6px 12px rgba(49, 130, 246, 0.15))',
            }}
          >
            {slide.emoji}
          </div>
        )}

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#191F28',
            margin: '8px 0 0',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {slide.title}
        </h1>

        <p
          style={{
            fontSize: 16,
            color: '#4B5563',
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-line',
            maxWidth: 320,
          }}
        >
          {slide.desc}
        </p>
      </div>

      {/* 진행 인디케이터 (도트) */}
      <div
        role="tablist"
        aria-label="온보딩 진행 상태"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
        }}
      >
        {SLIDES.map((_, i) => {
          const active = i === step;
          return (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={active}
              aria-label={`${i + 1}번째 슬라이드`}
              onClick={() => setStep(i)}
              style={{
                width: active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: active ? '#3182F6' : '#E5E7EB',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 200ms ease, background 200ms ease',
              }}
            />
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={isLast ? start : () => setStep(step + 1)}
        style={{
          height: 56,
          borderRadius: 12,
          background: '#3182F6',
          color: '#FFFFFF',
          fontSize: 17,
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          minHeight: 44,
          letterSpacing: '-0.01em',
          transition: 'background 200ms, opacity 200ms',
        }}
      >
        {isLast ? '영양해 시작하기' : '다음'}
      </button>
    </div>
  );
}
