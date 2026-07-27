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
  navAction: { ko: "크리틱 시작", en: "Begin" },
  eyebrow: {
    ko: "건축 스튜디오 크리틱",
    en: "Evidence-informed architectural critique",
  },
  headline: {
    ko: "설계 의도와 도면 사이의 긴장을 읽어보세요.",
    en: "See your project through another architectural mind.",
  },
  description: {
    ko: "프로젝트를 설명하고 교수님을 선택하면, 개념, 공간, 동선, 재료, 맥락을 기준으로 스튜디오 크리틱에 가까운 피드백을 생성합니다.",
    en: "Describe your project, choose a professor, and receive a studio-style critique grounded in documented architectural principles.",
  },
  disclaimer: {
    ko: "건축 거장들이 당신의 지도교수가 되어 설계 내용을 크리틱해드립니다.",
    en: "Architectural masters become your studio professors and critique your design.",
  },
  howItWorks: { ko: "작동 방식", en: "How it works" },
  steps: [
    {
      title: { ko: "교수 선택", en: "Choose a professor" },
      body: { ko: "크리틱을 받을 교수님을 고릅니다.", en: "Choose your studio professor." },
    },
    {
      title: { ko: "프로젝트 입력", en: "Describe the project" },
      body: {
        ko: "의도, 전략, 고민을 짧고 구체적으로 적습니다.",
        en: "Name intent, strategy, and doubt.",
      },
    },
    {
      title: { ko: "핵심 긴장 확인", en: "Read the tension" },
      body: {
        ko: "크리틱 포인트와 다음 작업 방향을 확인합니다.",
        en: "Study critique points and references.",
      },
    },
  ],
  voices: { ko: "교수 소개", en: "Meet the professors" },
  startCritique: { ko: "크리틱 받기", en: "Get a critique" },
};

export const flowCopy = {
  mockFlow: { ko: "AI 크리틱 흐름", en: "AI critique flow" },
  steps: [
    { ko: "교수 선택", en: "Choose professor" },
    { ko: "프로젝트 입력", en: "Describe project" },
    { ko: "크리틱 설정", en: "Set critique" },
  ],
  phaseNote: {
    ko: "현재 버전은 OpenAI API로 크리틱을 생성하고, 로컬 레퍼런스 데이터에서 관련 사례를 가볍게 추천합니다.",
    en: "This version generates critiques with the OpenAI API and lightly recommends references from local data.",
  },
  requiredError: {
    ko: "다음 단계로 가기 전에 필수 프로젝트 항목을 입력해주세요.",
    en: "Complete the required project fields before continuing.",
  },
  stepLabel: { ko: "단계", en: "Step" },
  chooseCritic: { ko: "교수님을 선택하세요", en: "Choose your professor" },
  describeProject: { ko: "프로젝트를 설명하세요", en: "Describe your project" },
  setCritique: { ko: "크리틱 방식을 설정하세요", en: "Set the critique" },
  back: { ko: "이전", en: "Back" },
  continue: { ko: "계속", en: "Continue" },
  generate: { ko: "AI 크리틱 생성", en: "Generate AI critique" },
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
    reviewFocus: { ko: "크리틱 초점", en: "Critique focus" },
    intensity: { ko: "크리틱 강도", en: "Critique intensity" },
    language: { ko: "출력 언어", en: "Language" },
  },
};

export const loadingCopy = {
  label: { ko: "AI 크리틱 생성 중", en: "Generating AI critique" },
  headline: {
    ko: (criticName: string) => `${criticName} 교수님이 프로젝트를 읽는 중입니다.`,
    en: (criticName: string) => `Professor ${criticName} is reviewing your project.`,
  },
  stages: {
    ko: [
      "프로젝트 읽기",
      "핵심 긴장 찾기",
      "선택한 교수님의 판단 기준 적용",
      "관련 레퍼런스 탐색",
      "크리틱 정리",
    ],
    en: [
      "Reading the project",
      "Identifying the central tension",
      "Applying the professor's review criteria",
      "Searching relevant references",
      "Preparing the critique",
    ],
  },
};

export const resultCopy = {
  anotherCritic: { ko: "다른 교수님 선택", en: "Choose another professor" },
  mockSheet: { ko: "AI 리뷰 시트", en: "AI review sheet" },
  understand: { ko: "이해한 내용", en: "What I Understand" },
  centralTension: { ko: "핵심 긴장", en: "Central Tension" },
  oneMove: { ko: "테스트할 한 가지 조치", en: "One Move to Test" },
  actions: { ko: "작업", en: "Actions" },
  copy: { ko: "결과 복사", en: "Copy result" },
  copied: { ko: "복사됨", en: "Copied" },
  returnEdit: { ko: "프로젝트 수정으로 돌아가기", en: "Return to edit project" },
  compare: { ko: "크리틱 비교 준비 중", en: "Compare critics placeholder" },
  critiquePoints: { ko: "주요 크리틱 포인트", en: "Main Critique Points" },
  questions: { ko: "디자이너에게 남길 질문", en: "Questions for the Designer" },
  references: { ko: "검토할 레퍼런스", en: "References to Examine" },
  principles: {
    ko: "적용한 건축 원칙",
    en: "Applied Architectural Principles",
  },
  limits: { ko: "이 관점의 한계", en: "Limits of This Perspective" },
};
