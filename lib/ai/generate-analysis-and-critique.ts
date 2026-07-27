import { firstPassJsonSchema } from "@/lib/ai/json-schema";
import { createStructuredResponse } from "@/lib/ai/openai-responses";
import { buildFirstPassPrompt } from "@/lib/ai/prompts/critic-critique";
import {
  critiqueResponseSchema,
  projectAnalysisSchema,
  type CritiqueResponse,
  type ProjectAnalysis,
} from "@/lib/ai/schemas";
import type { CriticProfile } from "@/lib/critics/types";
import type { ProjectSubmission } from "@/lib/validation/submission";
import { z } from "zod";

export async function generateProjectAnalysisAndCritique({
  submission,
  critic,
  signal,
}: {
  submission: ProjectSubmission;
  critic: CriticProfile;
  signal?: AbortSignal;
}): Promise<{
  analysis: ProjectAnalysis;
  critique: CritiqueResponse;
}> {
  const raw = await createStructuredResponse({
    prompt: buildFirstPassPrompt({ submission, critic }),
    schema: firstPassJsonSchema,
    schemaName: "critiquer_first_pass",
    signal,
  });

  const parsed = firstPassResponseSchema.parse(raw);

  return {
    analysis: parsed.analysis,
    critique: parsed.critique,
  };
}

const firstPassResponseSchema = z.object({
  analysis: projectAnalysisSchema.required({ centralIntentStrategyGap: true }),
  critique: critiqueResponseSchema,
});
