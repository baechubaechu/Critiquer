export type Language = "ko" | "en";

export type LocalizedText = Record<Language, string>;

export function text(value: LocalizedText, language: Language) {
  return value[language];
}

export const languageNames: Record<Language, string> = {
  ko: "한국어",
  en: "English",
};

export const landingCopy = {
  navAction: { ko: "비평 시작", en: "Begin" },
  eyebrow: {
    ko: "근거 기반 건축 비평",
    en: "Evidence-informed architectural critique",
  },
  headline: {
    ko: "당신의 프로젝트를 다른 건축적 시선으로 읽어보세요.",
    en: "See your project through another architectural mind.",
  },
  description: {
    ko: "프로젝트를 설명하고 비평 렌즈를 선택하면, 문헌과 작업에 근거한 해석을 바탕으로 스튜디오 크리틱에 가까운 피드백을 제공합니다.",
    en: "Describe your project, select a critical lens, and receive a speculative studio-style critique grounded in documented architectural principles.",
  },
  disclaimer: {
    ko: "CRITIQUER는 실제 건축가나 비평가를 흉내 내지 않습니다. 글, 인터뷰, 프로젝트, 설계 원칙에 대한 구조화된 해석을 분석 렌즈로 사용합니다.",
    en: "CRITIQUER does not impersonate real architects or critics. It uses structured interpretations of their writings, projects, and design priorities as analytical lenses.",
  },
  howItWorks: { ko: "작동 방식", en: "How it works" },
  steps: [
    {
      title: { ko: "비평가 선택", en: "Choose a critic" },
      body: { ko: "하나의 건축적 렌즈를 고릅니다.", en: "Select one architectural lens." },
    },
    {
      title: { ko: "프로젝트 설명", en: "Describe the project" },
      body: {
        ko: "의도, 전략, 현재 고민을 적습니다.",
        en: "Name intent, strategy, and doubt.",
      },
    },
    {
      title: { ko: "긴장 읽기", en: "Read the tension" },
      body: {
        ko: "비평 포인트와 참고 사례를 검토합니다.",
        en: "Study critique points and references.",
      },
    },
  ],
  lenses: { ko: "비평 렌즈", en: "Critical lenses" },
  voices: { ko: "다섯 개의 출발점", en: "Five starting voices" },
  startCritique: { ko: "비평 작성", en: "Start critique" },
};

export const flowCopy = {
  mockFlow: { ko: "AI 비평 흐름", en: "AI critique flow" },
  steps: [
    { ko: "비평가 선택", en: "Choose critic" },
    { ko: "프로젝트 설명", en: "Describe project" },
    { ko: "비평 설정", en: "Set critique" },
  ],
  phaseNote: {
    ko: "현재 버전은 OpenAI API로 비평을 생성하고, 레퍼런스는 로컬 데이터에서 가볍게 추천합니다.",
    en: "This version generates critiques with the OpenAI API and lightly recommends references from local data.",
  },
  requiredError: {
    ko: "다음으로 넘어가기 전에 필수 프로젝트 항목을 입력해주세요.",
    en: "Complete the required project fields before continuing.",
  },
  stepLabel: { ko: "단계", en: "Step" },
  chooseCritic: { ko: "비평가를 선택하세요", en: "Choose your critic" },
  describeProject: { ko: "프로젝트를 설명하세요", en: "Describe your project" },
  setCritique: { ko: "비평 방식을 설정하세요", en: "Set the critique" },
  back: { ko: "이전", en: "Back" },
  continue: { ko: "계속", en: "Continue" },
  generate: { ko: "AI 비평 생성", en: "Generate AI critique" },
  fields: {
    title: { ko: "프로젝트 제목", en: "Project title" },
    oneLineSummary: { ko: "한 문장 요약", en: "One-sentence project summary" },
    problem: {
      ko: "프로젝트가 해결하려는 문제",
      en: "Problem the project attempts to solve",
    },
    concept: { ko: "핵심 설계 개념", en: "Core design concept" },
    designStrategies: { ko: "주요 설계 전략", en: "Main design strategies" },
    critiqueRequest: {
      ko: "현재 고민 또는 질문",
      en: "Current concern or question",
    },
    site: { ko: "대지와 맥락", en: "Site and context" },
    program: { ko: "프로그램", en: "Program" },
    users: { ko: "주요 사용자", en: "Primary users" },
    spatialOrganization: { ko: "공간 구성", en: "Spatial organization" },
    circulation: { ko: "동선", en: "Circulation" },
    structure: { ko: "구조", en: "Structure" },
    materials: { ko: "재료", en: "Materials" },
    environmentalStrategy: { ko: "환경 전략", en: "Environmental strategy" },
    stage: { ko: "프로젝트 단계", en: "Project stage" },
    reviewFocus: { ko: "비평 초점", en: "Critique focus" },
    intensity: { ko: "비평 강도", en: "Critique intensity" },
    language: { ko: "출력 언어", en: "Language" },
  },
};

export const loadingCopy = {
  label: { ko: "AI 비평 생성 중", en: "Generating AI critique" },
  headline: {
    ko: (criticName: string) => `${criticName}의 렌즈로 프로젝트를 읽는 중입니다.`,
    en: (criticName: string) => `Reading the project through ${criticName}.`,
  },
  stages: {
    ko: [
      "프로젝트 읽기",
      "중심 긴장 찾기",
      "선택한 비평 렌즈 적용",
      "관련 레퍼런스 탐색",
      "비평문 준비",
    ],
    en: [
      "Reading the project",
      "Identifying the central tension",
      "Applying the selected critical lens",
      "Searching relevant references",
      "Preparing the critique",
    ],
  },
};

export const resultCopy = {
  anotherCritic: { ko: "다른 비평가", en: "Another critic" },
  mockSheet: { ko: "AI 리뷰 시트", en: "AI review sheet" },
  understand: { ko: "이해한 내용", en: "What I Understand" },
  centralTension: { ko: "중심 긴장", en: "Central Tension" },
  oneMove: { ko: "테스트할 한 가지 조치", en: "One Move to Test" },
  actions: { ko: "작업", en: "Actions" },
  copy: { ko: "결과 복사", en: "Copy result" },
  copied: { ko: "복사됨", en: "Copied" },
  returnEdit: { ko: "프로젝트 수정으로 돌아가기", en: "Return to edit project" },
  compare: { ko: "비평가 비교 준비 중", en: "Compare critics placeholder" },
  critiquePoints: { ko: "주요 비평 포인트", en: "Main Critique Points" },
  questions: { ko: "디자이너에게 던지는 질문", en: "Questions for the Designer" },
  references: { ko: "검토할 레퍼런스", en: "References to Examine" },
  principles: {
    ko: "적용된 건축 원칙",
    en: "Applied Architectural Principles",
  },
  limits: { ko: "이 관점의 한계", en: "Limits of This Perspective" },
};
