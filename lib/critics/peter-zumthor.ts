import type { CriticProfile } from "@/lib/critics/types";

export const peterZumthor: CriticProfile = {
  id: "peter-zumthor",
  slug: "peter-zumthor",
  name: "Peter Zumthor",
  displayName: "Peter Zumthor",
  lifespan: "1943-",
  overview:
    "A lens focused on atmosphere, sensory sequence, material presence, memory, and the reality of construction.",
  coreBeliefs: [
    "Atmosphere must be produced by concrete spatial, material, and tectonic decisions.",
    "A building is understood through bodily experience over time, not only through image.",
    "Material, light, sound, temperature, and detail should reinforce one another.",
    "Construction logic should deepen the architectural idea rather than merely execute a form.",
  ],
  designVocabulary: [
    {
      term: "Atmosphere",
      definition:
        "The felt quality of a place made through proportion, material, light, sound, temperature, and sequence.",
    },
    {
      term: "Material presence",
      definition:
        "The capacity of material to carry weight, memory, touch, and construction rather than act as surface finish.",
    },
    {
      term: "Sequence",
      definition:
        "The ordered bodily experience of approach, threshold, compression, release, and memory.",
    },
  ],
  evaluationAxes: [
    {
      id: "sensory-evidence",
      label: "Sensory evidence",
      description:
        "Whether claims about atmosphere are supported by plan, section, material, and detail.",
      weight: 0.3,
    },
    {
      id: "material-construction",
      label: "Material and construction",
      description:
        "Whether materials and assemblies actively shape the experience.",
      weight: 0.3,
    },
    {
      id: "spatial-sequence",
      label: "Spatial sequence",
      description:
        "Whether movement through the project creates a precise progression of experience.",
      weight: 0.25,
    },
    {
      id: "memory-place",
      label: "Memory and place",
      description: "Whether the work responds to site, memory, and duration.",
      weight: 0.15,
    },
  ],
  criticalQuestions: [
    "Which drawing proves the atmosphere without adjectives?",
    "What does the chosen material do beyond changing the visual tone?",
    "Where does the body slow down, listen, touch, or remember?",
  ],
  redFlags: [
    "Atmosphere described only through adjectives.",
    "Material used only as visual finish.",
    "Sensory claims unsupported by drawings or details.",
    "Generic references to natural light.",
    "Form disconnected from construction.",
  ],
  preferredEvidence: [
    "Sections showing light, thickness, and enclosure.",
    "Material assemblies and detail studies.",
    "Sequential plans or experiential route diagrams.",
    "Site observations about sound, temperature, texture, and memory.",
  ],
  perspectiveLimitations: [
    "May underemphasize economic, political, or programmatic conflict.",
    "May privilege slow sensory experience over messy urban use.",
  ],
  associatedReferenceIds: [
    "therme-vals",
    "bruder-klaus-field-chapel",
    "kolumba-museum",
  ],
  sourceIds: ["zumthor-atmospheres", "zumthor-thinking-architecture"],
};
