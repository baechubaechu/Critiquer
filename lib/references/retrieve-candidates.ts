import type { CritiqueResponse, ProjectAnalysis } from "@/lib/ai/schemas";
import { referenceDatabase } from "@/lib/references/database";
import { scoreReference } from "@/lib/references/scoring";
import type { ProjectSubmission } from "@/lib/validation/submission";

export function retrieveReferenceCandidates({
  submission,
  analysis,
  critique,
  selectedCriticId,
  limit = 8,
}: {
  submission: ProjectSubmission;
  analysis: ProjectAnalysis;
  critique: CritiqueResponse;
  selectedCriticId: string;
  limit?: number;
}) {
  return referenceDatabase
    .map((reference) =>
      scoreReference({
        reference,
        submission,
        analysis,
        critique,
        selectedCriticId,
      }),
    )
    .sort((a, b) => b.score - a.score || a.reference.title.localeCompare(b.reference.title))
    .slice(0, limit);
}
