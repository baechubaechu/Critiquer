import { z } from "zod";

const content = z.string().trim().min(1);

export const projectAnalysisSchema = z.object({
  projectType: z.array(z.string()),
  projectIntent: content,
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
  centralIntentStrategyGap: content.optional(),
});

export const critiqueResponseSchema = z.object({
  interpretation: z.object({
    projectIntent: content,
    understoodStrategy: content,
    missingInformation: z.array(z.string()),
  }),
  centralTension: z.object({
    title: content,
    explanation: content,
  }),
  critiquePoints: z
    .array(
      z.object({
        id: content,
        title: content,
        observation: content,
        whyItMatters: content,
        designConsequence: content,
        confidence: z.enum(["high", "medium", "low"]),
      }),
    )
    .length(3)
    .refine(
      (points) =>
        new Set(points.map((point) => point.id)).size === points.length,
      "Critique point IDs must be unique",
    ),
  questionsForDesigner: z.array(content).min(3).max(4),
  suggestedExperiment: z.object({
    title: content,
    instruction: content,
    expectedLearning: content,
  }),
  recommendationQueries: z
    .array(
      z.object({
        topic: content,
        intent: z.enum([
          "closest-precedent",
          "alternative-approach",
          "critical-counterexample",
        ]),
      }),
    )
    .length(3),
  architectLens: z.object({
    appliedPrinciples: z.array(content).min(1),
    perspectiveLimitations: z.array(content).min(1),
  }),
  disclaimer: content,
});

export const referenceRecommendationSchema = z.object({
  referenceId: z.string(),
  category: z.enum([
    "closest-precedent",
    "alternative-approach",
    "critical-counterexample",
    "related-study",
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

export const firstPassResponseSchema = z.object({
  analysis: projectAnalysisSchema.required({ centralIntentStrategyGap: true }),
  critique: critiqueResponseSchema,
});

export type ProjectAnalysis = z.infer<typeof projectAnalysisSchema>;
export type CritiqueResponse = z.infer<typeof critiqueResponseSchema>;
export type ReferenceRecommendation = z.infer<
  typeof referenceRecommendationSchema
>;
export type CritiqueApiResponse = z.infer<typeof critiqueApiResponseSchema>;
export type FirstPassResponse = z.infer<typeof firstPassResponseSchema>;
