import type { CritiqueResponse, ProjectAnalysis } from "@/lib/ai/schemas";
import type { ReferenceEntry } from "@/lib/references/types";
import type { ProjectSubmission } from "@/lib/validation/submission";
import { normalizeSearchTerms } from "@/lib/references/search-terms";

export type ScoredReference = {
  reference: ReferenceEntry;
  score: number;
  relevanceScore: number;
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
  const topics = [
    submission.problem,
    submission.concept,
    submission.designStrategies,
    submission.critiqueRequest,
    submission.environmentalStrategy ?? "",
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
  ];
  const { score: relevanceScore, reasons } = scoreReferenceTopics(
    reference,
    topics,
  );
  let score = relevanceScore;

  if (reference.relevantProjectStages.includes(submission.stage)) {
    score += 1.5;
    reasons.push("project stage");
  }

  if (reference.creatorIds.includes(selectedCriticId)) {
    score += 1;
    reasons.push("selected critic");
  }

  return { reference, score, relevanceScore, reasons };
}

export function scoreReferenceTopics(
  reference: ReferenceEntry,
  topics: string[],
) {
  const queryTerms = normalizeSearchTerms(topics);
  const reasons: string[] = [];
  let score = 0;
  for (const [terms, weight] of [
    [reference.problemsAddressed, 4],
    [reference.buildingTypes, 3],
    [reference.strategies, 3],
    [reference.themes, 3],
    [reference.spatialCharacteristics, 2],
    [reference.circulationStrategies, 2],
    [reference.structuralStrategies, 2],
    [reference.materialStrategies, 2],
    [reference.environmentalStrategies, 2],
    [reference.urbanStrategies, 2],
  ] as [string[], number][])
    score += scoreOverlap(queryTerms, terms, weight, reasons);
  return { score, reasons: [...new Set(reasons)] };
}

function scoreOverlap(
  queryTerms: Set<string>,
  referenceTerms: string[],
  weight: number,
  reasons: string[],
) {
  const referenceTokens = normalizeSearchTerms(referenceTerms);
  let matches = 0;

  for (const term of queryTerms) {
    if (referenceTokens.has(term)) {
      matches += 1;
    }
  }

  if (matches > 0) {
    reasons.push(referenceTerms.slice(0, 2).join(", "));
  }

  return Math.min(matches, 4) * weight;
}
