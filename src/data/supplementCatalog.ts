/**
 * 내부 영양제 카탈로그 — 50건 시드
 *
 * 용도: SupplementEditPage의 검색·추천, 성분 상호작용 경고 매칭.
 * 출처: 2026 한국 건강기능식품 시장 트렌드 주요 카테고리 커버 (종합비타민/오메가3/프로바이오틱스/수면/저속노화).
 */

export type CatalogTag =
  | 'daily' | 'vitamin' | 'mineral' | 'heart' | 'brain' | 'joint'
  | 'sleep' | 'beauty' | 'immune' | 'gut' | 'eye' | 'energy' | 'senior';

export interface CatalogItem {
  id: string;
  name: string;
  brand?: string;
  /** 성분 식별자 — interactionRules와 매칭 */
  ingredients: string[];
  tags: CatalogTag[];
  commonDose: string;
  category: string;
}

export const catalog: CatalogItem[] = [
  // 기본 비타민·미네랄
  { id: 'multivitamin', name: '종합비타민', ingredients: ['vitamin_b', 'vitamin_c', 'zinc', 'magnesium'], tags: ['daily', 'vitamin'], commonDose: '1정', category: '종합' },
  { id: 'vitamin_c_1000', name: '비타민C 1000mg', ingredients: ['vitamin_c'], tags: ['daily', 'vitamin', 'immune'], commonDose: '1정', category: '비타민' },
  { id: 'vitamin_d_2000', name: '비타민D 2000IU', ingredients: ['vitamin_d'], tags: ['daily', 'vitamin', 'senior'], commonDose: '1정', category: '비타민' },
  { id: 'vitamin_e', name: '비타민E', ingredients: ['vitamin_e'], tags: ['beauty', 'vitamin'], commonDose: '1정', category: '비타민' },
  { id: 'vitamin_b_complex', name: '비타민B 컴플렉스', ingredients: ['vitamin_b'], tags: ['energy', 'vitamin'], commonDose: '1정', category: '비타민' },
  { id: 'biotin', name: '비오틴', ingredients: ['biotin'], tags: ['beauty', 'vitamin'], commonDose: '1정', category: '비타민' },
  { id: 'folic_acid', name: '엽산', ingredients: ['folic_acid'], tags: ['vitamin'], commonDose: '1정', category: '비타민' },
  { id: 'zinc', name: '아연', ingredients: ['zinc'], tags: ['immune', 'mineral'], commonDose: '1정', category: '미네랄' },
  { id: 'magnesium', name: '마그네슘', ingredients: ['magnesium'], tags: ['sleep', 'mineral'], commonDose: '1정', category: '미네랄' },
  { id: 'calcium', name: '칼슘', ingredients: ['calcium'], tags: ['joint', 'mineral', 'senior'], commonDose: '1정', category: '미네랄' },
  { id: 'iron', name: '철분', ingredients: ['iron'], tags: ['mineral', 'energy'], commonDose: '1정', category: '미네랄' },
  { id: 'calcium_magnesium_d', name: '칼슘·마그네슘·비타민D', ingredients: ['calcium', 'magnesium', 'vitamin_d'], tags: ['joint', 'senior'], commonDose: '1정', category: '미네랄' },

  // 오메가3 / EPA DHA
  { id: 'omega3', name: '오메가3', ingredients: ['epa', 'dha'], tags: ['heart', 'brain', 'daily'], commonDose: '1정', category: '오메가' },
  { id: 'omega3_high', name: '오메가3 고함량', ingredients: ['epa', 'dha'], tags: ['heart', 'brain'], commonDose: '2정', category: '오메가' },
  { id: 'algae_omega3', name: '조류(알지) 오메가3', ingredients: ['epa', 'dha'], tags: ['heart', 'brain'], commonDose: '1정', category: '오메가' },
  { id: 'krill_oil', name: '크릴 오일', ingredients: ['epa', 'dha', 'astaxanthin'], tags: ['heart'], commonDose: '2정', category: '오메가' },

  // 프로바이오틱스
  { id: 'probiotics_basic', name: '프로바이오틱스', ingredients: ['lactobacillus'], tags: ['gut', 'daily'], commonDose: '1캡슐', category: '유산균' },
  { id: 'probiotics_women', name: '여성 유산균', ingredients: ['lactobacillus'], tags: ['gut', 'beauty'], commonDose: '1캡슐', category: '유산균' },
  { id: 'probiotics_kids', name: '키즈 유산균', ingredients: ['lactobacillus'], tags: ['gut'], commonDose: '1포', category: '유산균' },
  { id: 'postbiotics', name: '포스트바이오틱스', ingredients: ['lactobacillus'], tags: ['gut'], commonDose: '1포', category: '유산균' },

  // 수면·스트레스
  { id: 'melatonin', name: '멜라토닌', ingredients: ['melatonin'], tags: ['sleep'], commonDose: '1정', category: '수면' },
  { id: 'theanine', name: '테아닌', ingredients: ['theanine'], tags: ['sleep'], commonDose: '1정', category: '수면' },
  { id: 'gaba', name: 'GABA', ingredients: ['gaba'], tags: ['sleep'], commonDose: '1정', category: '수면' },
  { id: 'ashwagandha', name: '아슈와간다', ingredients: ['ashwagandha'], tags: ['sleep'], commonDose: '1정', category: '수면' },
  { id: 'valerian', name: '발레리안 루트', ingredients: ['valerian'], tags: ['sleep'], commonDose: '1정', category: '수면' },

  // 관절·저속노화
  { id: 'glucosamine', name: '글루코사민', ingredients: ['glucosamine'], tags: ['joint', 'senior'], commonDose: '2정', category: '관절' },
  { id: 'msm', name: 'MSM', ingredients: ['msm'], tags: ['joint'], commonDose: '2정', category: '관절' },
  { id: 'collagen_peptide', name: '저분자 콜라겐', ingredients: ['collagen'], tags: ['beauty', 'joint'], commonDose: '1포', category: '콜라겐' },
  { id: 'collagen_drink', name: '콜라겐 드링크', ingredients: ['collagen'], tags: ['beauty'], commonDose: '1병', category: '콜라겐' },
  { id: 'nmn', name: 'NMN', ingredients: ['nmn'], tags: ['senior'], commonDose: '1정', category: '저속노화' },
  { id: 'resveratrol', name: '레스베라트롤', ingredients: ['resveratrol'], tags: ['senior', 'heart'], commonDose: '1정', category: '저속노화' },
  { id: 'coq10', name: '코엔자임Q10', ingredients: ['coq10'], tags: ['heart', 'energy', 'senior'], commonDose: '1정', category: '저속노화' },

  // 눈·뇌
  { id: 'lutein', name: '루테인', ingredients: ['lutein'], tags: ['eye', 'senior'], commonDose: '1정', category: '눈' },
  { id: 'lutein_zeaxanthin', name: '루테인·지아잔틴', ingredients: ['lutein', 'zeaxanthin'], tags: ['eye'], commonDose: '1정', category: '눈' },
  { id: 'blueberry', name: '블루베리 추출물', ingredients: ['blueberry'], tags: ['eye'], commonDose: '2정', category: '눈' },
  { id: 'phosphatidylserine', name: '포스파티딜세린', ingredients: ['ps'], tags: ['brain'], commonDose: '1정', category: '뇌' },

  // 면역·혈행
  { id: 'propolis', name: '프로폴리스', ingredients: ['propolis'], tags: ['immune'], commonDose: '1포', category: '면역' },
  { id: 'nattokinase', name: '나토키나제', ingredients: ['nattokinase'], tags: ['heart', 'senior'], commonDose: '1정', category: '혈행' },
  { id: 'garlic_oil', name: '마늘 오일', ingredients: ['garlic'], tags: ['heart'], commonDose: '1캡슐', category: '혈행' },
  { id: 'policosanol', name: '폴리코사놀', ingredients: ['policosanol'], tags: ['heart'], commonDose: '1정', category: '혈행' },

  // 다이어트·에너지
  { id: 'garcinia', name: '가르시니아', ingredients: ['garcinia'], tags: ['energy'], commonDose: '1정', category: '다이어트' },
  { id: 'green_tea_ext', name: '녹차 카테킨', ingredients: ['catechin'], tags: ['energy'], commonDose: '1정', category: '다이어트' },
  { id: 'l_carnitine', name: 'L-카르니틴', ingredients: ['l_carnitine'], tags: ['energy'], commonDose: '1정', category: '다이어트' },

  // 뷰티·피부
  { id: 'hyaluronic_acid', name: '히알루론산', ingredients: ['hyaluronic'], tags: ['beauty'], commonDose: '1정', category: '뷰티' },
  { id: 'vitamin_c_beauty', name: '비타민C 세럼캡슐', ingredients: ['vitamin_c'], tags: ['beauty'], commonDose: '1정', category: '뷰티' },

  // 단백질·기타
  { id: 'whey_protein', name: '웨이 프로틴', ingredients: ['whey'], tags: ['energy'], commonDose: '1스쿱', category: '프로틴' },
  { id: 'casein', name: '카제인', ingredients: ['casein'], tags: ['energy'], commonDose: '1스쿱', category: '프로틴' },

  // 시니어 타겟
  { id: 'ginkgo', name: '은행잎 추출물', ingredients: ['ginkgo'], tags: ['brain', 'senior'], commonDose: '1정', category: '시니어' },
  { id: 'silymarin', name: '밀크씨슬(실리마린)', ingredients: ['silymarin'], tags: ['senior'], commonDose: '1정', category: '간' },

  // 아이용
  { id: 'kids_omega3', name: '키즈 오메가3', ingredients: ['epa', 'dha'], tags: ['brain'], commonDose: '1젤리', category: '키즈' },
  { id: 'kids_multivitamin', name: '키즈 종합비타민', ingredients: ['vitamin_b', 'vitamin_c', 'zinc'], tags: ['daily', 'vitamin'], commonDose: '1젤리', category: '키즈' },
];

export function searchCatalog(query: string): CatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalog.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.ingredients.some((ing) => ing.includes(q)) ||
      item.tags.some((tag) => tag.includes(q)),
  );
}

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}
