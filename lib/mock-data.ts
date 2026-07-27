export type CriticSummary = {
  id: string;
  displayName: string;
  initials: string;
  lens: string;
  summary: string;
  themes: string[];
  examines: string;
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
  language: string;
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
};

export const critics: CriticSummary[] = [
  {
    id: "peter-zumthor",
    displayName: "Peter Zumthor",
    initials: "PZ",
    lens: "Atmosphere",
    summary:
      "Reads architecture through sensory sequence, material presence, construction, memory, and bodily experience.",
    themes: ["material", "light", "detail", "sequence"],
    examines:
      "Whether atmosphere is produced by spatial and tectonic decisions rather than descriptive adjectives.",
  },
  {
    id: "rem-koolhaas",
    displayName: "Rem Koolhaas",
    initials: "RK",
    lens: "Program",
    summary:
      "Tests programs, contradictions, congestion, metropolitan scale, infrastructure, and unstable social conditions.",
    themes: ["program", "event", "scale", "conflict"],
    examines:
      "Whether the diagram creates operational consequences or remains a formal image.",
  },
  {
    id: "louis-kahn",
    displayName: "Louis Kahn",
    initials: "LK",
    lens: "Order",
    summary:
      "Looks for spatial hierarchy, room, institution, structure, served and servant spaces, silence, and light.",
    themes: ["room", "structure", "order", "light"],
    examines:
      "Whether form, structure, service, and light produce a legible architectural order.",
  },
  {
    id: "jane-jacobs",
    displayName: "Jane Jacobs",
    initials: "JJ",
    lens: "Urban life",
    summary:
      "Studies everyday users, mixed use, street life, safety, diversity, adaptation, and small-scale urban behavior.",
    themes: ["street", "users", "mix", "time"],
    examines:
      "Whether publicness is supported by actual patterns of occupation, not only by open space or image.",
  },
  {
    id: "le-corbusier",
    displayName: "Le Corbusier",
    initials: "LC",
    lens: "Modern order",
    summary:
      "Questions proportion, promenade, free plan, light, standardization, roof landscape, and the object-site relation.",
    themes: ["proportion", "promenade", "plan", "light"],
    examines:
      "Whether modern architectural devices are spatially necessary rather than stylistic quotation.",
  },
];

export const projectStageOptions = [
  { value: "concept", label: "Concept" },
  { value: "schematic-design", label: "Schematic design" },
  { value: "design-development", label: "Design development" },
  { value: "final-review", label: "Final review" },
];

export const critiqueFocusOptions = [
  { value: "comprehensive", label: "Comprehensive" },
  { value: "concept", label: "Concept" },
  { value: "spatial-organization", label: "Spatial organization" },
  { value: "circulation", label: "Circulation" },
  { value: "program", label: "Program" },
  { value: "structure", label: "Structure" },
  { value: "material-atmosphere", label: "Material and atmosphere" },
  { value: "site-urban-context", label: "Site and urban context" },
];

export const intensityOptions = [
  {
    value: "constructive",
    label: "Constructive",
    description: "Studio guidance with a generous tone.",
  },
  {
    value: "direct",
    label: "Direct",
    description: "Sharper priorities and fewer cushions.",
  },
  {
    value: "jury",
    label: "Jury mode",
    description: "A firmer review focused on consequences.",
  },
];

export function mockCritiqueResult(
  draft: ProjectDraft,
  critic: CriticSummary,
): MockResult {
  const projectTitle = draft.title.trim() || "Untitled project";
  const focus = critiqueFocusOptions.find(
    (option) => option.value === draft.reviewFocus,
  )?.label;

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
        title: `${critic.lens} should become criteria`,
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
    principles: critic.themes,
    limits:
      "This mock result is intentionally provisional. Phase 3 will add typed critic profiles and source-backed reference data; Phase 4 will replace this text with server-side structured AI output.",
  };
}

export const fallbackResult = mockCritiqueResult(
  {
    criticId: "peter-zumthor",
    title: "Sample studio project",
    oneLineSummary: "A small public building organized around a quiet courtyard.",
    problem: "The project tries to create shared civic pause.",
    concept: "A gradual threshold from city noise to interior calm.",
    designStrategies: "Layered entries, compressed passages, and a central room.",
    critiqueRequest: "Does the concept appear clearly in the plan?",
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
    language: "en",
  },
  critics[0],
);
