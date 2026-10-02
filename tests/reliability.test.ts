import { describe, expect, it } from "vitest";
import { firstPassResponseSchema } from "@/lib/ai/schemas";
import { localOutputBudget } from "@/lib/ai/local-budget";
import {
  retrieveReferenceCandidates,
  createDeterministicRecommendations,
} from "@/lib/references";
import { scoreReferenceTopics } from "@/lib/references/scoring";
import { referenceDatabase } from "@/lib/references/database";
import { criticProfiles } from "@/lib/critics";
import { sourceDatabase } from "@/lib/sources";
import { firstPass, submission } from "./fixtures";

describe("complete critique validation", () => {
  it("rejects missing points, missing questions, empty text and duplicate IDs", () => {
    for (const critique of [
      { ...firstPass.critique, critiquePoints: [] },
      { ...firstPass.critique, questionsForDesigner: [] },
      {
        ...firstPass.critique,
        centralTension: { title: " ", explanation: "" },
      },
      {
        ...firstPass.critique,
        critiquePoints: Array(3).fill(firstPass.critique.critiquePoints[0]),
      },
    ])
      expect(
        firstPassResponseSchema.safeParse({ ...firstPass, critique }).success,
      ).toBe(false);
    expect(firstPassResponseSchema.safeParse(firstPass).success).toBe(true);
  });
  it("reserves room for an answer and rejects long Korean input", () => {
    expect(() =>
      localOutputBudget("Brief project description", 1200, "ko"),
    ).not.toThrow();
    expect(() => localOutputBudget("가".repeat(5000), 1200, "ko")).toThrow();
    expect(localOutputBudget("가".repeat(1000), 2500, "ko")).toBe(3180);
  });
});

describe("reference retrieval", () => {
  function rank(topic: string) {
    return retrieveReferenceCandidates({
      submission: {
        ...submission,
        problem: topic,
        concept: topic,
        designStrategies: topic,
        critiqueRequest: topic,
      },
      analysis: {
        ...firstPass.analysis,
        coreProblems: [topic],
        statedConcepts: [topic],
        describedDesignStrategies: [topic],
        spatialTopics: [],
        circulationTopics: [],
        programTopics: [],
        structuralTopics: [],
        materialTopics: [],
        environmentalTopics: [],
        urbanTopics: [],
        unresolvedIssues: [],
      },
      critique: {
        ...firstPass.critique,
        centralTension: { title: topic, explanation: topic },
        recommendationQueries: [],
      },
      selectedCriticId: "peter-zumthor",
    });
  }
  it("distinguishes Korean bath and street-safety projects", () => {
    const bath = rank("온천 목욕 공간의 재료와 감각");
    const street = rank("골목 보행 안전과 상점 혼합 용도");
    expect(bath[0].reference.id).toBe("therme-vals");
    expect(street[0].reference.id).toBe("greenwich-village");
  });
  it("does not reward repeated words or stop words", () => {
    const reference = referenceDatabase[0];
    expect(scoreReferenceTopics(reference, ["light light light"]).score).toBe(
      scoreReferenceTopics(reference, ["light"]).score,
    );
    expect(scoreReferenceTopics(reference, ["the and with is"]).score).toBe(0);
  });
  it("does not manufacture counterexamples from ranking positions", () => {
    const recommendations = createDeterministicRecommendations({
      candidates: rank("빛 재료 감각 동선"),
      critique: firstPass.critique,
    });
    expect(
      recommendations.some(
        (item) => item.category === "critical-counterexample",
      ),
    ).toBe(false);
    expect(new Set(recommendations.map((item) => item.referenceId)).size).toBe(
      recommendations.length,
    );
  });
  it("does not recommend unrelated entries just because a professor is selected", () => {
    expect(rank("양자 컴퓨팅 암호 알고리즘")).toEqual([]);
  });
  it("all professor/reference links point to existing data", () => {
    for (const critic of criticProfiles) {
      for (const id of critic.associatedReferenceIds)
        expect(referenceDatabase.some((entry) => entry.id === id)).toBe(true);
      for (const id of critic.sourceIds)
        expect(sourceDatabase.some((entry) => entry.id === id)).toBe(true);
    }
    for (const reference of referenceDatabase)
      for (const id of reference.sourceIds)
        expect(sourceDatabase.some((entry) => entry.id === id)).toBe(true);
  });
});
