import type { CritiqueResponse, ProjectAnalysis } from "@/lib/ai/schemas";
import type { ReferenceEntry } from "@/lib/references/types";
import type { ProjectSubmission } from "@/lib/validation/submission";

export type ScoredReference = {
  reference: ReferenceEntry;
  score: number;
  reasons: string[];
};

export function scoreReference({
  reference,
  submission,
  analysis,
  critique,
  selectedCriticId,
}: {
  reference: ReferenceEntry;
  submission: ProjectSubmission;
  analysis: ProjectAnalysis;
  critique: CritiqueResponse;
  selectedCriticId: string;
}): ScoredReference {
  const queryTerms = normalizeTerms([
    submission.problem,
    submission.concept,
    submission.designStrategies,
    submission.reviewFocus,
    ...analysis.coreProblems,
    ...analysis.statedConcepts,
    ...analysis.describedDesignStrategies,
    ...analysis.spatialTopics,
    ...analysis.circulationTopics,
    ...analysis.programTopics,
    ...analysis.structuralTopics,
    ...analysis.materialTopics,
    ...analysis.environmentalTopics,
    ...analysis.urbanTopics,
    ...analysis.unresolvedIssues,
    critique.centralTension.title,
    critique.centralTension.explanation,
    ...critique.recommendationQueries.map((query) => query.topic),
  ]);

  let score = 0;
  const reasons: string[] = [];

  score += scoreOverlap(queryTerms, reference.problemsAddressed, 4, reasons);
  score += scoreOverlap(queryTerms, reference.strategies, 3, reasons);
  score += scoreOverlap(queryTerms, reference.themes, 3, reasons);
  score += scoreOverlap(queryTerms, reference.spatialCharacteristics, 2, reasons);
  score += scoreOverlap(queryTerms, reference.circulationStrategies, 2, reasons);
  score += scoreOverlap(queryTerms, reference.structuralStrategies, 2, reasons);
  score += scoreOverlap(queryTerms, reference.materialStrategies, 2, reasons);
  score += scoreOverlap(queryTerms, reference.urbanStrategies, 2, reasons);

  if (reference.relevantProjectStages.includes(submission.stage)) {
    score += 1.5;
    reasons.push("project stage");
  }

  if (reference.creatorIds.includes(selectedCriticId)) {
    score += 1;
    reasons.push("selected critic");
  }

  return { reference, score, reasons };
}

function normalizeTerms(values: string[]) {
  return values
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9가-힣]+/u)
    .filter((term) => term.length >= 2);
}

function scoreOverlap(
  queryTerms: string[],
  referenceTerms: string[],
  weight: number,
  reasons: string[],
) {
  const referenceText = referenceTerms.join(" ").toLowerCase();
  let matches = 0;

  for (const term of queryTerms) {
    if (referenceText.includes(term)) {
      matches += 1;
    }
  }

  if (matches > 0) {
    reasons.push(referenceTerms.slice(0, 2).join(", "));
  }

  return Math.min(matches, 4) * weight;
}
