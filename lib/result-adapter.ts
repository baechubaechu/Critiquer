import type { CritiqueApiResponse } from "@/lib/ai/schemas";
import type { Language } from "@/lib/i18n";
import type { MockResult, ProjectDraft } from "@/lib/mock-data";

export function apiResponseToDisplayResult({
  apiResponse,
  draft,
  criticName,
}: {
  apiResponse: CritiqueApiResponse;
  draft: ProjectDraft;
  criticName: string;
}): MockResult {
  const language = draft.language;
  const projectTitle = draft.title.trim();

  return {
    title:
      language === "ko"
        ? `${criticName}의 시선으로 본 ${projectTitle}`
        : `${projectTitle} through ${criticName}`,
    disclaimer: apiResponse.critique.disclaimer,
    interpretation: [
      apiResponse.critique.interpretation.projectIntent,
      apiResponse.critique.interpretation.understoodStrategy,
    ].join("\n\n"),
    centralTension: apiResponse.critique.centralTension,
    critiquePoints: apiResponse.critique.critiquePoints.map((point) => ({
      id: point.id,
      title: point.title,
      observation: `${point.observation}\n\n${point.whyItMatters}`,
      designConsequence: point.designConsequence,
      confidence: point.confidence,
    })),
    questions: apiResponse.critique.questionsForDesigner,
    suggestedExperiment: {
      title: apiResponse.critique.suggestedExperiment.title,
      instruction: [
        apiResponse.critique.suggestedExperiment.instruction,
        apiResponse.critique.suggestedExperiment.expectedLearning,
      ].join("\n\n"),
    },
    references: apiResponse.recommendations.map((recommendation) => ({
      title: recommendation.relevanceTitle,
      category: translateCategory(recommendation.category, language),
      reason: [
        recommendation.relevanceExplanation,
        recommendation.comparableAspect,
        recommendation.keyDifference,
      ].join("\n\n"),
    })),
    principles: apiResponse.critique.architectLens.appliedPrinciples,
    limits: apiResponse.critique.architectLens.perspectiveLimitations.join("\n"),
    language,
  };
}

function translateCategory(
  category: CritiqueApiResponse["recommendations"][number]["category"],
  language: Language,
) {
  if (language === "en") {
    return category.replaceAll("-", " ");
  }

  const labels = {
    "closest-precedent": "가까운 선례",
    "alternative-approach": "다른 접근",
    "critical-counterexample": "비판적 반례",
  };

  return labels[category];
}
