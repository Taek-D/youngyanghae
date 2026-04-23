/**
 * 영양제 성분 상호작용 경고 규칙 — 20건 시드
 *
 * 용도: SupplementEditPage에서 사용자가 이미 등록한 영양제와 신규 영양제 간 상호작용 경고.
 * 참고: 일반 지식 기반이며 의료 조언 아님. 실제 복용 전 의사/약사 상담 권장 — 앱 내 안내 필수.
 */

export type InteractionSeverity = 'info' | 'warn' | 'danger';

export interface InteractionRule {
  a: string;
  b: string;
  severity: InteractionSeverity;
  message: string;
}

export const interactionRules: InteractionRule[] = [
  // Omega3 / Aspirin / Nattokinase (혈액응고 관련)
  { a: 'epa', b: 'nattokinase', severity: 'warn', message: '오메가3와 나토키나제는 모두 혈액 응고를 늦춰요. 함께 드실 때 출혈 위험이 높아질 수 있어요.' },
  { a: 'dha', b: 'nattokinase', severity: 'warn', message: '오메가3(DHA)와 나토키나제 병용 시 출혈 위험이 있어요.' },
  { a: 'garlic', b: 'nattokinase', severity: 'warn', message: '마늘과 나토키나제를 함께 드시면 출혈 위험이 커질 수 있어요.' },
  { a: 'epa', b: 'garlic', severity: 'info', message: '오메가3와 마늘은 혈액 순환에 모두 관여해요. 과량 복용은 피하세요.' },

  // Calcium + Iron 흡수 방해
  { a: 'calcium', b: 'iron', severity: 'warn', message: '칼슘과 철분은 함께 드시면 서로 흡수를 방해해요. 최소 2시간 간격을 두세요.' },
  { a: 'calcium', b: 'zinc', severity: 'info', message: '칼슘과 아연은 함께 드시면 아연 흡수가 줄어요. 시간 차를 두는 게 좋아요.' },
  { a: 'calcium', b: 'magnesium', severity: 'info', message: '칼슘과 마그네슘은 권장량 내 동시 복용 가능하지만 2:1 비율이 이상적이에요.' },

  // Vitamin 상호작용
  { a: 'vitamin_e', b: 'vitamin_k' as string, severity: 'warn', message: '비타민E 고용량은 비타민K 작용(혈액응고)을 방해할 수 있어요.' },
  { a: 'vitamin_c', b: 'vitamin_b', severity: 'info', message: '비타민C와 B는 함께 드셔도 안전하지만 수용성이라 아침에 한 번에 드시는 게 효과적이에요.' },

  // Zinc + Copper
  { a: 'zinc', b: 'copper' as string, severity: 'warn', message: '아연을 장기 고용량으로 드시면 구리 결핍이 생길 수 있어요.' },

  // Caffeine / 수면
  { a: 'catechin', b: 'melatonin', severity: 'warn', message: '녹차 카테킨의 카페인은 멜라토닌의 수면 효과를 방해할 수 있어요. 저녁엔 피하세요.' },
  { a: 'catechin', b: 'theanine', severity: 'info', message: '녹차 카테킨과 테아닌은 함께 들어있는 경우가 많아 이중 복용 주의.' },

  // Melatonin / GABA
  { a: 'melatonin', b: 'gaba', severity: 'info', message: '멜라토닌과 GABA는 함께 드시면 과한 졸음이 올 수 있어요.' },
  { a: 'melatonin', b: 'valerian', severity: 'warn', message: '멜라토닌과 발레리안 루트를 동시에 드시면 다음날 무기력감이 심할 수 있어요.' },

  // 간 관련
  { a: 'silymarin', b: 'ashwagandha', severity: 'info', message: '밀크씨슬과 아슈와간다 모두 간에 작용해요. 간 질환이 있다면 의사 상담 후 복용하세요.' },

  // CoQ10
  { a: 'coq10', b: 'nattokinase', severity: 'info', message: 'CoQ10는 혈압약과 상호작용이 있을 수 있어요. 처방약 복용 중이면 상담 권장.' },

  // 철분 + 비타민C (positive)
  { a: 'iron', b: 'vitamin_c', severity: 'info', message: '철분과 비타민C는 함께 드시면 철분 흡수가 좋아져요 (긍정적 상호작용).' },

  // NMN / Resveratrol
  { a: 'nmn', b: 'resveratrol', severity: 'info', message: 'NMN과 레스베라트롤은 함께 드시면 시너지 효과가 보고되고 있어요.' },

  // 프로바이오틱스 + 항생제 (일반 지식)
  { a: 'lactobacillus', b: 'lactobacillus', severity: 'info', message: '여러 종류의 프로바이오틱스를 동시에 드시면 효과가 상쇄될 수 있어요. 하나의 복합 제품을 선택하는 게 좋아요.' },

  // 콜라겐 + 비타민C
  { a: 'collagen', b: 'vitamin_c', severity: 'info', message: '콜라겐과 비타민C를 함께 드시면 콜라겐 합성이 촉진돼요 (긍정적).' },
];

/**
 * 두 영양제 ingredient 목록을 받아 관련된 경고만 반환.
 */
export function findInteractions(
  ingredientsA: string[],
  ingredientsB: string[],
): InteractionRule[] {
  const matches: InteractionRule[] = [];
  for (const rule of interactionRules) {
    const hit =
      (ingredientsA.includes(rule.a) && ingredientsB.includes(rule.b)) ||
      (ingredientsA.includes(rule.b) && ingredientsB.includes(rule.a));
    if (hit) matches.push(rule);
  }
  return matches;
}
