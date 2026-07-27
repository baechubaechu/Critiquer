export type CriticProfile = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  lifespan?: string;

  overview: string;
  coreBeliefs: string[];

  designVocabulary: {
    term: string;
    definition: string;
  }[];

  evaluationAxes: {
    id: string;
    label: string;
    description: string;
    weight: number;
  }[];

  criticalQuestions: string[];
  redFlags: string[];
  preferredEvidence: string[];
  perspectiveLimitations: string[];

  associatedReferenceIds: string[];
  sourceIds: string[];
};
