import type {
  CritiqueResponse,
  ReferenceRecommendation,
} from "@/lib/ai/schemas";
import type { ScoredReference } from "@/lib/references/scoring";

const categories: ReferenceRecommendation["category"][] = [
  "closest-precedent",
  "alternative-approach",
  "critical-counterexample",
];

export function createDeterministicRecommendations({
  candidates,
  critique,
}: {
  candidates: ScoredReference[];
  critique: CritiqueResponse;
}): ReferenceRecommendation[] {
  return candidates.slice(0, 3).map((candidate, index) => {
    const category = categories[index] ?? "alternative-approach";
    const firstPoint = critique.critiquePoints[0]?.id;

    return {
      referenceId: candidate.reference.id,
      category,
      relevanceTitle: candidate.reference.title,
      relevanceExplanation:
        candidate.reference.lessons[0] ||
        "This reference shares an architectural problem with the critique.",
      comparableAspect:
        candidate.reasons[0] || candidate.reference.themes.slice(0, 2).join(", "),
      keyDifference:
        candidate.reference.risksOfMisapplication[0] ||
        "Study the architectural logic, not the surface appearance.",
      whatToStudy: candidate.reference.lessons.slice(0, 3),
      whatNotToCopy: candidate.reference.risksOfMisapplication.slice(0, 3),
      relatedCritiquePointIds: firstPoint ? [firstPoint] : [],
      confidence: candidate.score >= 8 ? "high" : candidate.score >= 4 ? "medium" : "low",
    };
  });
}
