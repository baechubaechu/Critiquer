import type { ProjectStage } from "@/lib/validation/submission";

export type ReferenceEntry = {
  id: string;
  slug: string;

  type:
    | "building"
    | "urban-case"
    | "unbuilt-project"
    | "essay"
    | "concept"
    | "detail";

  title: string;
  creatorIds: string[];

  year?: number;
  location?: string;

  buildingTypes: string[];
  applicableScales: ("detail" | "room" | "building" | "site" | "city")[];

  overview: string;
  designIntent: string;

  problemsAddressed: string[];
  strategies: string[];
  themes: string[];

  spatialCharacteristics: string[];
  circulationStrategies: string[];
  structuralStrategies: string[];
  materialStrategies: string[];
  environmentalStrategies: string[];
  urbanStrategies: string[];

  lessons: string[];
  risksOfMisapplication: string[];

  relevantProjectStages: ProjectStage[];

  imageUrl?: string;
  sourceIds: string[];
};
