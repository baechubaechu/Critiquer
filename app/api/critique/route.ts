import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateProjectAnalysisAndCritique } from "@/lib/ai/generate-analysis-and-critique";
import {
  critiqueApiResponseSchema,
  type CritiqueApiResponse,
} from "@/lib/ai/schemas";
import { OpenAIRequestError } from "@/lib/ai/openai-responses";
import { getCriticProfile } from "@/lib/critics";
import {
  createDeterministicRecommendations,
  retrieveReferenceCandidates,
} from "@/lib/references";
import { projectSubmissionSchema } from "@/lib/validation/submission";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawInput = await request.json();
    const submission = projectSubmissionSchema.parse(rawInput);
    const critic = getCriticProfile(submission.criticId);

    if (!critic) {
      return safeError("critic-not-found", "선택한 비평가를 찾을 수 없습니다.", 404);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    try {
      const firstPass = await generateProjectAnalysisAndCritique({
        submission,
        critic,
        signal: controller.signal,
      });

      const candidates = retrieveReferenceCandidates({
        submission,
        analysis: firstPass.analysis,
        critique: firstPass.critique,
        selectedCriticId: critic.id,
      });

      const response: CritiqueApiResponse = {
        analysis: firstPass.analysis,
        critique: firstPass.critique,
        recommendations: createDeterministicRecommendations({
          candidates,
          critique: firstPass.critique,
        }),
      };

      const parsedResponse = critiqueApiResponseSchema.parse(response);

      return NextResponse.json(parsedResponse);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    logSafeApiError(error);

    if (error instanceof ZodError) {
      return safeError(
        "validation-failed",
        "입력값 형식이 올바르지 않습니다. 필수 항목을 조금 더 구체적으로 작성해주세요.",
        400,
      );
    }

    if (error instanceof OpenAIRequestError) {
      const status = error.status ?? 500;
      const message =
        status === 503
          ? "OpenAI API 키가 아직 설정되지 않았습니다. .env.local에 OPENAI_API_KEY를 추가해주세요."
          : status === 401
            ? "OpenAI API 키가 올바르지 않습니다. .env.local의 OPENAI_API_KEY 값을 다시 확인해주세요."
            : status === 502
              ? "AI 응답 형식이 올바르지 않습니다. 다시 생성해보거나 입력을 조금 줄여주세요."
          : "AI 비평 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

      return safeError("openai-request-failed", message, status);
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return safeError(
        "request-timeout",
        "비평 생성 시간이 너무 오래 걸렸습니다. 입력을 조금 줄이거나 다시 시도해주세요.",
        408,
      );
    }

    return safeError(
      "unknown-error",
      "예상하지 못한 오류가 발생했습니다. 다시 시도해주세요.",
      500,
    );
  }
}

function logSafeApiError(error: unknown) {
  if (error instanceof OpenAIRequestError) {
    console.error("[CRITIQUER_API_ERROR]", {
      name: error.name,
      status: error.status,
    });
    return;
  }

  if (error instanceof ZodError) {
    console.error("[CRITIQUER_API_ERROR]", {
      name: error.name,
      issues: error.issues.length,
    });
    return;
  }

  if (error instanceof Error) {
    console.error("[CRITIQUER_API_ERROR]", {
      name: error.name,
      message: error.message,
    });
    return;
  }

  console.error("[CRITIQUER_API_ERROR]", { name: "UnknownError" });
}

function safeError(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}
