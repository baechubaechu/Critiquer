import { z } from "zod";

export const projectAnalysisSchema = z.object({
  projectType: z.array(z.string()),
  projectIntent: z.string(),
  coreProblems: z.array(z.string()),
  statedConcepts: z.array(z.string()),
  describedDesignStrategies: z.array(z.string()),

  spatialTopics: z.array(z.string()),
  circulationTopics: z.array(z.string()),
  programTopics: z.array(z.string()),
  structuralTopics: z.array(z.string()),
  materialTopics: z.array(z.string()),
  environmentalTopics: z.array(z.string()),
  urbanTopics: z.array(z.string()),

  statedStrengths: z.array(z.string()),
  unresolvedIssues: z.array(z.string()),
  missingInformation: z.array(z.string()),
  centralIntentStrategyGap: z.string().optional(),
});

export const critiqueResponseSchema = z.object({
  interpretation: z.object({
    projectIntent: z.string(),
    understoodStrategy: z.string(),
    missingInformation: z.array(z.string()),
  }),
  centralTension: z.object({
    title: z.string(),
    explanation: z.string(),
  }),
  critiquePoints: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      observation: z.string(),
      whyItMatters: z.string(),
      designConsequence: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    }),
  ),
  questionsForDesigner: z.array(z.string()),
  suggestedExperiment: z.object({
    title: z.string(),
    instruction: z.string(),
    expectedLearning: z.string(),
  }),
  recommendationQueries: z.array(
    z.object({
      topic: z.string(),
      intent: z.enum([
        "closest-precedent",
        "alternative-approach",
        "critical-counterexample",
      ]),
    }),
  ),
  architectLens: z.object({
    appliedPrinciples: z.array(z.string()),
    perspectiveLimitations: z.array(z.string()),
  }),
  disclaimer: z.string(),
});

export const referenceRecommendationSchema = z.object({
  referenceId: z.string(),
  category: z.enum([
    "closest-precedent",
    "alternative-approach",
    "critical-counterexample",
  ]),
  relevanceTitle: z.string(),
  relevanceExplanation: z.string(),
  comparableAspect: z.string(),
  keyDifference: z.string(),
  whatToStudy: z.array(z.string()),
  whatNotToCopy: z.array(z.string()),
  relatedCritiquePointIds: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});

export const critiqueApiResponseSchema = z.object({
  analysis: projectAnalysisSchema,
  critique: critiqueResponseSchema,
  recommendations: z.array(referenceRecommendationSchema),
});

export type ProjectAnalysis = z.infer<typeof projectAnalysisSchema>;
export type CritiqueResponse = z.infer<typeof critiqueResponseSchema>;
export type ReferenceRecommendation = z.infer<
  typeof referenceRecommendationSchema
>;
export type CritiqueApiResponse = z.infer<typeof critiqueApiResponseSchema>;
