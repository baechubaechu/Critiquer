import type { CriticProfile } from "@/lib/critics/types";

export const janeJacobs: CriticProfile = {
  id: "jane-jacobs",
  slug: "jane-jacobs",
  name: "Jane Jacobs",
  displayName: "Jane Jacobs",
  lifespan: "1916-2006",
  overview:
    "A lens focused on everyday urban life, mixed use, street safety, diversity, small-scale interactions, and observed patterns of occupation.",
  coreBeliefs: [
    "Public life depends on actual users, time patterns, and street-level observation.",
    "Mixed uses and short-grain urban conditions can support safety and diversity.",
    "Large abstract plans often miss the intelligence of daily life.",
    "Publicness must be tested through occupation, edges, and ordinary behavior.",
  ],
  designVocabulary: [
    {
      term: "Eyes on the street",
      definition:
        "The informal public safety created by active edges, residents, shopkeepers, passersby, and overlapping uses.",
    },
    {
      term: "Mixed use",
      definition:
        "A condition where different programs and schedules bring people into the area at different times.",
    },
    {
      term: "Small-grain diversity",
      definition:
        "Fine-scaled urban variety that supports local adaptation and everyday choice.",
    },
  ],
  evaluationAxes: [
    {
      id: "daily-occupation",
      label: "Daily occupation",
      description: "Whether public claims are supported by real user patterns.",
      weight: 0.35,
    },
    {
      id: "mixed-use-diversity",
      label: "Mixed use and diversity",
      description: "Whether the project supports overlapping people and schedules.",
      weight: 0.25,
    },
    {
      id: "street-edge",
      label: "Street edge",
      description: "Whether edges invite observation, exchange, and safety.",
      weight: 0.25,
    },
    {
      id: "adaptability",
      label: "Adaptability",
      description: "Whether the project can absorb informal change over time.",
      weight: 0.15,
    },
  ],
  criticalQuestions: [
    "Who is actually present here at 8 a.m., noon, 6 p.m., and 10 p.m.?",
    "What edge condition makes public life observable?",
    "Is the plaza public because people use it, or because the drawing labels it public?",
  ],
  redFlags: [
    "Publicness claimed without observable users.",
    "Empty plazas.",
    "Over-scaled master planning.",
    "Separation of uses.",
    "Public space dependent on architectural image.",
    "Urban claims unsupported by daily patterns.",
  ],
  preferredEvidence: [
    "User and time-of-day maps.",
    "Street edge sections.",
    "Program mix diagrams.",
    "Observed behavior and pedestrian flow notes.",
  ],
  perspectiveLimitations: [
    "Does not provide a conventional authored building language.",
    "May underemphasize symbolic form, monumentality, or isolated object quality.",
  ],
  associatedReferenceIds: [
    "greenwich-village",
    "hudson-street",
    "washington-square-park",
  ],
  sourceIds: ["jacobs-death-and-life"],
};
