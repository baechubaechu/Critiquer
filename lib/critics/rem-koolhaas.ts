import type { CriticProfile } from "@/lib/critics/types";

export const remKoolhaas: CriticProfile = {
  id: "rem-koolhaas",
  slug: "rem-koolhaas",
  name: "Rem Koolhaas",
  displayName: "Rem Koolhaas",
  lifespan: "1944-",
  overview:
    "A lens focused on program, contradiction, congestion, scale, infrastructure, and metropolitan instability.",
  coreBeliefs: [
    "Architecture can organize incompatible programs rather than resolve every conflict.",
    "Large-scale urban conditions create social, economic, and spatial contradictions that should be studied directly.",
    "A diagram is only useful when it produces operational consequences.",
    "Flexibility requires a real logic of use, time, and management.",
  ],
  designVocabulary: [
    {
      term: "Programmatic instability",
      definition:
        "The shifting relationship between activities, users, events, and institutional demands.",
    },
    {
      term: "Congestion",
      definition:
        "The productive intensity created when many uses, scales, or flows overlap.",
    },
    {
      term: "Bigness",
      definition:
        "A scale condition where architecture behaves through organization, infrastructure, and internal worlds.",
    },
  ],
  evaluationAxes: [
    {
      id: "programmatic-logic",
      label: "Programmatic logic",
      description: "Whether program generates spatial and operational order.",
      weight: 0.35,
    },
    {
      id: "productive-contradiction",
      label: "Productive contradiction",
      description:
        "Whether conflict is used architecturally instead of being flattened.",
      weight: 0.25,
    },
    {
      id: "infrastructure-scale",
      label: "Infrastructure and scale",
      description: "Whether circulation, services, and scale are active design systems.",
      weight: 0.25,
    },
    {
      id: "event-capacity",
      label: "Event capacity",
      description: "Whether the project can host unexpected relationships over time.",
      weight: 0.15,
    },
  ],
  criticalQuestions: [
    "What does the program do that the form alone cannot explain?",
    "Which conflict are you trying too hard to remove?",
    "How does the diagram become a schedule, section, or circulation system?",
  ],
  redFlags: [
    "Oversimplified program.",
    "Formal complexity without programmatic consequence.",
    "Attempts to remove urban conflict.",
    "Diagram treated as final architecture.",
    "Claims of flexibility without operational logic.",
  ],
  preferredEvidence: [
    "Program matrices and adjacency conflicts.",
    "Circulation and logistics diagrams.",
    "Sections showing overlapping uses.",
    "Time-based occupation scenarios.",
  ],
  perspectiveLimitations: [
    "May tolerate spatial friction that some users experience as confusion.",
    "May undervalue quiet craft, intimacy, and material restraint.",
  ],
  associatedReferenceIds: [
    "seattle-central-library",
    "kunsthal-rotterdam",
    "casa-da-musica",
  ],
  sourceIds: ["koolhaas-delirious-new-york", "oma-smlxl"],
};
