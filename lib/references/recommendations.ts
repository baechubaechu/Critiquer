import type {
  CritiqueResponse,
  ReferenceRecommendation,
} from "@/lib/ai/schemas";
import type { ScoredReference } from "@/lib/references/scoring";
import { scoreReferenceTopics } from "@/lib/references/scoring";

export function createDeterministicRecommendations({
  candidates,
  critique,
}: {
  candidates: ScoredReference[];
  critique: CritiqueResponse;
}): ReferenceRecommendation[] {
  const selected: {
    candidate: ScoredReference;
    category: ReferenceRecommendation["category"];
  }[] = [];
  for (const query of critique.recommendationQueries) {
    // A counterexample requires documented evidence, not a position in a ranked list.
    if (query.intent === "critical-counterexample") continue;
    const ranked = candidates
      .filter(
        (candidate) =>
          !selected.some(
            (item) => item.candidate.reference.id === candidate.reference.id,
          ),
      )
      .map((candidate) => ({
        candidate,
        topicScore: scoreReferenceTopics(candidate.reference, [query.topic])
          .score,
      }))
      .filter((item) => item.topicScore > 0)
      .filter(
        (item) =>
          query.intent !== "alternative-approach" ||
          !selected[0] ||
          !item.candidate.reference.creatorIds.some((id) =>
            selected[0].candidate.reference.creatorIds.includes(id),
          ),
      )
      .sort(
        (a, b) =>
          b.topicScore - a.topicScore || b.candidate.score - a.candidate.score,
      );
    if (ranked[0])
      selected.push({ candidate: ranked[0].candidate, category: query.intent });
  }
  for (const candidate of candidates) {
    if (selected.length >= 3) break;
    if (
      !selected.some(
        (item) => item.candidate.reference.id === candidate.reference.id,
      )
    )
      selected.push({ candidate, category: "related-study" });
  }
  return selected.slice(0, 3).map(({ candidate, category }) => {
    const relatedPoints = critique.critiquePoints.filter(
      (point) =>
        scoreReferenceTopics(candidate.reference, [
          point.title,
          point.observation,
          point.designConsequence,
        ]).score > 0,
    );

    return {
      referenceId: candidate.reference.id,
      category,
      relevanceTitle: candidate.reference.title,
      relevanceExplanation:
        candidate.reference.lessons[0] ||
        "This reference shares an architectural problem with the critique.",
      comparableAspect:
        candidate.reasons[0] ||
        candidate.reference.themes.slice(0, 2).join(", "),
      keyDifference:
        candidate.reference.risksOfMisapplication[0] ||
        "Study the architectural logic, not the surface appearance.",
      whatToStudy: candidate.reference.lessons.slice(0, 3),
      whatNotToCopy: candidate.reference.risksOfMisapplication.slice(0, 3),
      relatedCritiquePointIds: relatedPoints.map((point) => point.id),
      confidence:
        candidate.relevanceScore >= 16
          ? "high"
          : candidate.relevanceScore >= 8
            ? "medium"
            : "low",
    };
  });
}
