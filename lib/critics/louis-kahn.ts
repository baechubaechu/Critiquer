import type { CriticProfile } from "@/lib/critics/types";

export const louisKahn: CriticProfile = {
  id: "louis-kahn",
  slug: "louis-kahn",
  name: "Louis Kahn",
  displayName: "Louis Kahn",
  lifespan: "1901-1974",
  overview:
    "A lens focused on room, institution, spatial order, structure, served and servant spaces, silence, and light.",
  coreBeliefs: [
    "Architecture should clarify what a room wants to be.",
    "Structure, service, light, and spatial hierarchy should be conceived together.",
    "Institutions need legible order, not only functional accommodation.",
    "Light should reveal space and order rather than decorate surfaces.",
  ],
  designVocabulary: [
    {
      term: "Served and servant spaces",
      definition:
        "A hierarchy between primary rooms and the spaces that support them, such as circulation, services, and structure.",
    },
    {
      term: "Room",
      definition:
        "A spatial unit with purpose, proportion, boundary, structure, and light.",
    },
    {
      term: "Institutional order",
      definition:
        "The spatial clarity that gives public or collective programs civic presence.",
    },
  ],
  evaluationAxes: [
    {
      id: "spatial-hierarchy",
      label: "Spatial hierarchy",
      description: "Whether primary and secondary spaces are clearly ordered.",
      weight: 0.3,
    },
    {
      id: "structure-space",
      label: "Structure and space",
      description: "Whether structure is integral to the spatial idea.",
      weight: 0.3,
    },
    {
      id: "light-order",
      label: "Light and order",
      description: "Whether light clarifies rooms, thresholds, and hierarchy.",
      weight: 0.2,
    },
    {
      id: "institutional-character",
      label: "Institutional character",
      description: "Whether the project expresses the nature of its public role.",
      weight: 0.2,
    },
  ],
  criticalQuestions: [
    "What is the primary room, and what serves it?",
    "Would the structure still make sense if the facade were removed?",
    "Does light organize the space or merely decorate it?",
  ],
  redFlags: [
    "Unclear spatial hierarchy.",
    "Structure applied after form.",
    "Service functions hidden without organizational logic.",
    "Circulation treated as leftover space.",
    "Light used decoratively rather than spatially.",
  ],
  preferredEvidence: [
    "Plans showing served and servant hierarchy.",
    "Structural grids and sections.",
    "Light studies tied to room proportions.",
    "Diagrams of institutional organization.",
  ],
  perspectiveLimitations: [
    "May be less responsive to informal urban messiness or temporary uses.",
    "May privilege monumental clarity over lightweight adaptability.",
  ],
  associatedReferenceIds: [
    "salk-institute",
    "kimbell-art-museum",
    "exeter-library",
  ],
  sourceIds: ["kahn-writings-lectures-interviews", "kahn-conversations"],
};
