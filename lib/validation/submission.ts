import { z } from "zod";

const requiredLongText = z.string().trim().min(10).max(1600);
const optionalLongText = z
  .string()
  .trim()
  .max(1600)
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const projectStageSchema = z.enum([
  "concept",
  "schematic-design",
  "design-development",
  "final-review",
]);

export const reviewFocusSchema = z.enum([
  "comprehensive",
  "concept",
  "spatial-organization",
  "circulation",
  "program",
  "structure",
  "material-atmosphere",
  "site-urban-context",
]);

export const critiqueIntensitySchema = z.enum([
  "constructive",
  "direct",
  "jury",
]);

export const critiqueLanguageSchema = z.enum(["ko", "en"]);

export const projectSubmissionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  oneLineSummary: z.string().trim().min(10).max(300),
  problem: requiredLongText,
  concept: requiredLongText,
  designStrategies: requiredLongText,
  critiqueRequest: requiredLongText,

  site: optionalLongText,
  program: optionalLongText,
  users: optionalLongText,
  spatialOrganization: optionalLongText,
  circulation: optionalLongText,
  structure: optionalLongText,
  materials: optionalLongText,
  environmentalStrategy: optionalLongText,

  stage: projectStageSchema,
  reviewFocus: reviewFocusSchema,
  intensity: critiqueIntensitySchema,
  language: critiqueLanguageSchema,
  criticId: z.string().trim().min(2).max(80),
});

export type ProjectSubmission = z.infer<typeof projectSubmissionSchema>;
export type ProjectStage = z.infer<typeof projectStageSchema>;
export type ReviewFocus = z.infer<typeof reviewFocusSchema>;
export type CritiqueIntensity = z.infer<typeof critiqueIntensitySchema>;
export type CritiqueLanguage = z.infer<typeof critiqueLanguageSchema>;
