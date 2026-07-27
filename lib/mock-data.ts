import type { Language, LocalizedText } from "@/lib/i18n";
import { text } from "@/lib/i18n";

export type CriticSummary = {
  id: string;
  displayName: string;
  initials: string;
  lens: LocalizedText;
  summary: LocalizedText;
  themes: Record<Language, string[]>;
  examines: LocalizedText;
};

export type ProjectDraft = {
  criticId: string;
  title: string;
  oneLineSummary: string;
  problem: string;
  concept: string;
  designStrategies: string;
  critiqueRequest: string;
  site: string;
  program: string;
  users: string;
  spatialOrganization: string;
  circulation: string;
  structure: string;
  materials: string;
  environmentalStrategy: string;
  stage: string;
  reviewFocus: string;
  intensity: string;
  language: Language;
};

export type MockResult = {
  title: string;
  disclaimer: string;
  interpretation: string;
  centralTension: {
    title: string;
    explanation: string;
  };
  critiquePoints: Array<{
    id: string;
    title: string;
    observation: string;
    designConsequence: string;
    confidence: "high" | "medium" | "low";
  }>;
  questions: string[];
  suggestedExperiment: {
    title: string;
    instruction: string;
  };
  references: Array<{
    title: string;
    category: string;
    reason: string;
  }>;
  principles: string[];
  limits: string;
  language: Language;
};

export const critics: CriticSummary[] = [
  {
    id: "peter-zumthor",
    displayName: "Peter Zumthor",
    initials: "PZ",
    lens: { ko: "분위기", en: "Atmosphere" },
    summary: {
      ko: "감각의 순서, 재료의 존재감, 구축, 기억, 몸의 경험을 통해 건축을 읽습니다.",
      en: "Reads architecture through sensory sequence, material presence, construction, memory, and bodily experience.",
    },
    themes: {
      ko: ["재료", "빛", "디테일", "순서"],
      en: ["material", "light", "detail", "sequence"],
    },
    examines: {
      ko: "분위기가 형용사가 아니라 공간과 구축의 결정으로 만들어졌는지 봅니다.",
      en: "Whether atmosphere is produced by spatial and tectonic decisions rather than descriptive adjectives.",
    },
  },
  {
    id: "rem-koolhaas",
    displayName: "Rem Koolhaas",
    initials: "RK",
    lens: { ko: "프로그램", en: "Program" },
    summary: {
      ko: "프로그램, 모순, 규모, 도시적 조건, 인프라, 불안정한 사회적 힘을 시험합니다.",
      en: "Tests programs, contradictions, congestion, metropolitan scale, infrastructure, and unstable social conditions.",
    },
    themes: {
      ko: ["프로그램", "사건", "스케일", "충돌"],
      en: ["program", "event", "scale", "conflict"],
    },
    examines: {
      ko: "다이어그램이 실제 작동 논리를 만드는지, 아니면 형태 이미지에 머무는지 봅니다.",
      en: "Whether the diagram creates operational consequences or remains a formal image.",
    },
  },
  {
    id: "louis-kahn",
    displayName: "Louis Kahn",
    initials: "LK",
    lens: { ko: "질서", en: "Order" },
    summary: {
      ko: "공간 위계, 방, 제도, 구조, 주공간과 보조공간, 침묵과 빛을 다룹니다.",
      en: "Looks for spatial hierarchy, room, institution, structure, served and servant spaces, silence, and light.",
    },
    themes: {
      ko: ["방", "구조", "질서", "빛"],
      en: ["room", "structure", "order", "light"],
    },
    examines: {
      ko: "형태, 구조, 서비스, 빛이 서로 맞물려 읽히는 건축 질서를 만드는지 봅니다.",
      en: "Whether form, structure, service, and light produce a legible architectural order.",
    },
  },
  {
    id: "jane-jacobs",
    displayName: "Jane Jacobs",
    initials: "JJ",
    lens: { ko: "도시 생활", en: "Urban life" },
    summary: {
      ko: "일상 사용자, 복합 용도, 거리 생활, 안전, 다양성, 시간에 따른 적응을 봅니다.",
      en: "Studies everyday users, mixed use, street life, safety, diversity, adaptation, and small-scale urban behavior.",
    },
    themes: {
      ko: ["거리", "사용자", "혼합", "시간"],
      en: ["street", "users", "mix", "time"],
    },
    examines: {
      ko: "공공성이 열린 공간이나 이미지가 아니라 실제 점유 패턴으로 뒷받침되는지 봅니다.",
      en: "Whether publicness is supported by actual patterns of occupation, not only by open space or image.",
    },
  },
  {
    id: "le-corbusier",
    displayName: "Le Corbusier",
    initials: "LC",
    lens: { ko: "근대적 질서", en: "Modern order" },
    summary: {
      ko: "비례, 건축적 산책, 자유 평면, 빛, 표준화, 옥상 경관, 오브젝트와 대지의 관계를 묻습니다.",
      en: "Questions proportion, promenade, free plan, light, standardization, roof landscape, and the object-site relation.",
    },
    themes: {
      ko: ["비례", "산책", "평면", "빛"],
      en: ["proportion", "promenade", "plan", "light"],
    },
    examines: {
      ko: "근대 건축 장치가 스타일 차용이 아니라 공간적으로 필요한 선택인지 봅니다.",
      en: "Whether modern architectural devices are spatially necessary rather than stylistic quotation.",
    },
  },
];

export const projectStageOptions = [
  { value: "concept", label: { ko: "콘셉트", en: "Concept" } },
  { value: "schematic-design", label: { ko: "계획 설계", en: "Schematic design" } },
  { value: "design-development", label: { ko: "중간 설계", en: "Design development" } },
  { value: "final-review", label: { ko: "최종 리뷰", en: "Final review" } },
];

export const critiqueFocusOptions = [
  { value: "comprehensive", label: { ko: "종합", en: "Comprehensive" } },
  { value: "concept", label: { ko: "콘셉트", en: "Concept" } },
  { value: "spatial-organization", label: { ko: "공간 구성", en: "Spatial organization" } },
  { value: "circulation", label: { ko: "동선", en: "Circulation" } },
  { value: "program", label: { ko: "프로그램", en: "Program" } },
  { value: "structure", label: { ko: "구조", en: "Structure" } },
  { value: "material-atmosphere", label: { ko: "재료와 분위기", en: "Material and atmosphere" } },
  { value: "site-urban-context", label: { ko: "대지와 도시 맥락", en: "Site and urban context" } },
];

export const intensityOptions = [
  {
    value: "constructive",
    label: { ko: "건설적", en: "Constructive" },
    description: {
      ko: "스튜디오 튜터처럼 차분하게 방향을 잡아줍니다.",
      en: "Studio guidance with a generous tone.",
    },
  },
  {
    value: "direct",
    label: { ko: "직접적", en: "Direct" },
    description: {
      ko: "핵심 문제를 더 분명하고 날카롭게 짚습니다.",
      en: "Sharper priorities and fewer cushions.",
    },
  },
  {
    value: "jury",
    label: { ko: "심사 모드", en: "Jury mode" },
    description: {
      ko: "결과와 모순을 중심으로 더 엄격하게 검토합니다.",
      en: "A firmer review focused on consequences.",
    },
  },
];

export function mockCritiqueResult(
  draft: ProjectDraft,
  critic: CriticSummary,
): MockResult {
  const projectTitle = draft.title.trim() || "Untitled project";
  const focus = critiqueFocusOptions.find(
    (option) => option.value === draft.reviewFocus,
  )?.label[draft.language];

  if (draft.language === "en") {
    return {
      title: `${projectTitle} through ${critic.displayName}`,
      disclaimer:
        "A speculative architectural critique generated from documented interpretations of the selected critic's writings, interviews, projects, and design principles. This does not reproduce or impersonate the real person.",
      interpretation: `The project presents itself as "${draft.oneLineSummary}". Its strongest stated ambition is ${draft.concept || "still emerging"}, while the main design strategy is described as ${draft.designStrategies || "not yet defined"}.`,
      centralTension: {
        title: "Intent is ahead of architectural evidence",
        explanation: `The proposal names a clear ambition, but the current description needs stronger proof in ${focus?.toLowerCase() ?? "the selected focus"}. The next step is to show how the concept changes plan, section, circulation, program, structure, material, or occupation.`,
      },
      critiquePoints: [
        {
          id: "point-1",
          title: "The concept needs a spatial test",
          observation:
            "The idea is legible as a sentence, but it is not yet clear which spatial decision would fail if the concept were removed.",
          designConsequence:
            "Choose one plan or section relationship that must carry the concept, then make every adjacent decision answer to it.",
          confidence: "high",
        },
        {
          id: "point-2",
          title: "The user experience is under-specified",
          observation:
            "The description states what the project wants to solve, but gives limited evidence about how a person encounters, uses, or revisits the building.",
          designConsequence:
            "Map a complete first-time visitor route and mark where the project teaches, slows, compresses, reveals, or redirects the body.",
          confidence: "medium",
        },
        {
          id: "point-3",
          title: `${text(critic.lens, "en")} should become criteria`,
          observation: `${critic.displayName}'s lens suggests a more exact standard for judging the proposal than general quality or visual coherence.`,
          designConsequence:
            "Translate the selected critical lens into three measurable drawing checks before changing the form again.",
          confidence: "medium",
        },
      ],
      questions: [
        "Which drawing most honestly proves the core design concept?",
        "What contradiction in the current proposal are you avoiding because it is difficult?",
        "What should a reviewer understand from the section before reading your text?",
      ],
      suggestedExperiment: {
        title: "One-section argument",
        instruction:
          "Produce a single sectional drawing that removes decoration and labels only program, movement, structure, light, and the core concept. If the argument disappears, the project is still too dependent on explanation.",
      },
      references: [
        {
          title: "Therme Vals",
          category: "closest precedent",
          reason:
            "Useful for studying how sequence, material, and atmosphere can become architectural evidence.",
        },
        {
          title: "Seattle Central Library",
          category: "alternative approach",
          reason:
            "Useful for seeing how programmatic organization can produce form instead of decorating it afterward.",
        },
        {
          title: "Washington Square Park",
          category: "critical counterexample",
          reason:
            "Useful as a reminder that public life depends on use patterns and edges, not open space alone.",
        },
      ],
      principles: critic.themes.en,
      limits:
        "This fallback result is intentionally provisional. The production path uses the OpenAI API and structured local reference recommendations.",
      language: "en",
    };
  }

  return {
    title: `${critic.displayName} 교수님의 크리틱: ${projectTitle}`,
    disclaimer:
      "선택한 교수님의 글, 인터뷰, 프로젝트, 설계 원칙에 대한 문헌적 해석을 바탕으로 생성한 건축 크리틱입니다. 실제 인물을 재현하거나 대리하지 않습니다.",
    interpretation: `이 프로젝트는 "${draft.oneLineSummary}"라고 설명됩니다. 가장 강한 의도는 ${draft.concept || "아직 명확히 정리되지 않은 상태"}이고, 주요 설계 전략은 ${draft.designStrategies || "아직 충분히 설명되지 않았습니다"}.`,
    centralTension: {
      title: "의도가 건축적 증거보다 앞서 있습니다",
      explanation: `제안은 분명한 의도를 말하고 있지만, 현재 설명만으로는 ${focus ?? "선택한 초점"}에서 더 강한 증거가 필요합니다. 다음 단계는 콘셉트가 평면, 단면, 동선, 프로그램, 구조, 재료, 점유 방식 중 무엇을 실제로 바꾸는지 보여주는 것입니다.`,
    },
    critiquePoints: [
      {
        id: "point-1",
        title: "콘셉트에는 공간적 검증이 필요합니다",
        observation:
          "아이디어는 문장으로는 읽히지만, 그 콘셉트를 제거했을 때 어떤 공간 결정이 무너지는지는 아직 분명하지 않습니다.",
        designConsequence:
          "콘셉트를 반드시 지탱해야 하는 평면 또는 단면 관계 하나를 고르고, 주변 결정들이 그 관계에 응답하도록 정리해보세요.",
        confidence: "high",
      },
      {
        id: "point-2",
        title: "사용자 경험의 증거가 부족합니다",
        observation:
          "프로젝트가 해결하려는 문제는 말하고 있지만, 사람이 건물을 어떻게 만나고 사용하고 다시 방문하는지에 대한 증거가 아직 적습니다.",
        designConsequence:
          "첫 방문자의 전체 동선을 그리고, 어디서 몸이 멈추고 압축되고 열리고 방향을 바꾸는지 표시해보세요.",
        confidence: "medium",
      },
      {
        id: "point-3",
        title: `${text(critic.lens, "ko")}가 판단 기준이 되어야 합니다`,
        observation: `${critic.displayName} 교수님의 관점은 일반적인 완성도나 시각적 일관성보다 더 정확한 판단 기준을 요구합니다.`,
        designConsequence:
          "형태를 다시 바꾸기 전에, 선택한 교수님의 판단 기준을 도면에서 확인 가능한 세 가지 체크 항목으로 정리해보세요.",
        confidence: "medium",
      },
    ],
    questions: [
      "핵심 설계 개념을 가장 솔직하게 증명하는 도면은 무엇인가요?",
      "어렵다는 이유로 지금 미루고 있는 프로젝트 내부의 모순은 무엇인가요?",
      "설명문을 읽기 전에, 리뷰어가 단면만 보고 이해해야 하는 것은 무엇인가요?",
    ],
    suggestedExperiment: {
      title: "하나의 단면으로 주장하기",
      instruction:
        "장식을 제거하고 프로그램, 움직임, 구조, 빛, 핵심 개념만 표시한 단면 하나를 그려보세요. 그 단면에서 주장이 사라진다면 프로젝트는 아직 설명문에 너무 의존하고 있습니다.",
    },
    references: [
      {
        title: "Therme Vals",
        category: "가까운 선례",
        reason:
          "순서, 재료, 분위기가 어떻게 건축적 증거가 되는지 공부하기 좋습니다.",
      },
      {
        title: "Seattle Central Library",
        category: "다른 접근",
        reason:
          "프로그램 조직이 형태를 사후 장식이 아니라 생성 논리로 만드는 방식을 볼 수 있습니다.",
      },
      {
        title: "Washington Square Park",
        category: "반대 사례",
        reason:
          "공공성이 열린 공간 자체가 아니라 이용 패턴과 가장자리 조건에 달려 있음을 확인하게 해줍니다.",
      },
    ],
    principles: critic.themes.ko,
    limits:
      "이 결과는 API 응답이 없을 때 보여주는 임시 샘플입니다. 실제 크리틱은 OpenAI API와 로컬 레퍼런스 추천 데이터를 사용해 생성됩니다.",
    language: "ko",
  };
}

export const fallbackResult = mockCritiqueResult(
  {
    criticId: "peter-zumthor",
    title: "샘플 스튜디오 프로젝트",
    oneLineSummary: "조용한 중정을 중심으로 구성한 작은 공공 건축입니다.",
    problem: "도시 안에서 공유 가능한 멈춤의 장소를 만들고자 합니다.",
    concept: "도시의 소음에서 내부의 고요로 천천히 진입하는 문턱입니다.",
    designStrategies: "겹쳐진 진입부, 압축된 통로, 중앙 방을 사용합니다.",
    critiqueRequest: "이 콘셉트가 평면에서 명확하게 보이나요?",
    site: "",
    program: "",
    users: "",
    spatialOrganization: "",
    circulation: "",
    structure: "",
    materials: "",
    environmentalStrategy: "",
    stage: "concept",
    reviewFocus: "comprehensive",
    intensity: "constructive",
    language: "ko",
  },
  critics[0],
);
