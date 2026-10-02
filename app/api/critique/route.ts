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
import { authorizeExternalCritique } from "@/lib/ai/external-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const denied = authorizeExternalCritique(request);
  if (denied) return safeError(denied.code, denied.message, denied.status);
  let inputValidated = false;
  try {
    if (Number(request.headers.get("content-length")) > 100_000) {
      return safeError("input-too-large", "입력 내용이 너무 깁니다.", 413);
    }
    const rawInput = await readInput(request);
    if (rawInput?.aiMode !== "local-with-openai") {
      return safeError(
        "external-not-allowed",
        "외부 서비스 전환을 허용해야 사용할 수 있습니다.",
        403,
      );
    }
    const submission = projectSubmissionSchema.parse(rawInput);
    inputValidated = true;
    const critic = getCriticProfile(submission.criticId);

    if (!critic) {
      return safeError(
        "critic-not-found",
        "선택한 교수님을 찾을 수 없습니다.",
        404,
      );
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

    if (error instanceof InputTooLargeError)
      return safeError("input-too-large", "입력 내용이 너무 깁니다.", 413);

    if (error instanceof ZodError) {
      if (inputValidated) {
        return safeError(
          "invalid-output",
          "생성된 크리틱이 완전하지 않습니다. 다시 생성해주세요.",
          502,
        );
      }
      return safeError(
        "validation-failed",
        "입력 형식이 올바르지 않습니다. 필수 항목을 조금 더 구체적으로 작성해주세요.",
        400,
      );
    }

    if (error instanceof SyntaxError) {
      return safeError("invalid-json", "입력 내용을 읽을 수 없습니다.", 400);
    }

    if (error instanceof OpenAIRequestError) {
      const status = error.status ?? 500;
      const message =
        error.code === "missing-key"
          ? "외부 서비스의 API 키가 아직 설정되지 않았습니다. 서버 환경변수를 확인해주세요."
          : status === 401
            ? "외부 서비스의 API 키가 올바르지 않습니다. 서버 환경변수를 확인해주세요."
            : status === 502
              ? "크리틱 형식이 올바르지 않습니다. 다시 생성해보거나 입력을 조금 줄여주세요."
              : "크리틱 생성 중 문제가 발생했습니다. 잠시 뒤 다시 시도해주세요.";

      return safeError("openai-request-failed", message, status);
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return safeError(
        "request-timeout",
        "크리틱 생성 시간이 너무 오래 걸렸습니다. 입력을 조금 줄이거나 다시 시도해주세요.",
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

class InputTooLargeError extends Error {}

async function readInput(request: Request) {
  if (!request.body) throw new SyntaxError("Missing input");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 100_000) {
        await reader.cancel();
        throw new InputTooLargeError("Input exceeds byte limit");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
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
