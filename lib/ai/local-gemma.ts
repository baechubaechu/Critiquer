import type { Engine, Message } from "@litert-lm/core";
import { firstPassJsonSchema } from "@/lib/ai/json-schema";
import { buildFirstPassPrompt } from "@/lib/ai/prompts/critic-critique";
import {
  critiqueApiResponseSchema,
  firstPassResponseSchema,
  type CritiqueApiResponse,
  type FirstPassResponse,
} from "@/lib/ai/schemas";
import type { CriticProfile } from "@/lib/critics/types";
import {
  createDeterministicRecommendations,
  retrieveReferenceCandidates,
} from "@/lib/references";
import type { ProjectSubmission } from "@/lib/validation/submission";

export const LOCAL_MODEL_NAME = "Gemma 4 E4B (로컬)";

const MODEL_URL =
  "https://huggingface.co/litert-community/gemma-4-E4B-it-litert-lm/resolve/main/gemma-4-E4B-it-web.litertlm";

export type LocalGenerationPhase =
  | "checking"
  | "downloading"
  | "loading"
  | "generating";

export type LocalGenerationStatus = {
  phase: LocalGenerationPhase;
  progress?: number;
};

type StatusListener = (status: LocalGenerationStatus) => void;

let engine: Engine | null = null;
let enginePromise: Promise<Engine> | null = null;

export async function generateLocalCritique({
  submission,
  critic,
  onStatus,
}: {
  submission: ProjectSubmission;
  critic: CriticProfile;
  onStatus: StatusListener;
}): Promise<CritiqueApiResponse> {
  const localEngine = await getEngine(onStatus);
  onStatus({ phase: "generating" });

  const conversation = await localEngine.createConversation({
    sessionConfig: {
      maxOutputTokens: 4096,
      samplerParams: { temperature: 0.35, p: 0.9, k: 40 },
    },
    preface: {
      messages: [
        {
          role: "system",
          content:
            "You are CRITIQUER, an architectural studio critic. Follow the requested JSON schema exactly and return JSON only.",
        },
      ],
    },
  });

  try {
    const prompt = `${buildFirstPassPrompt({ submission, critic })}\n\nJSON schema:\n${JSON.stringify(firstPassJsonSchema)}`;
    const firstResponse = await conversation.sendMessage(prompt);
    let firstPass = parseFirstPass(messageText(firstResponse));

    if (!firstPass) {
      const repairResponse = await conversation.sendMessage(
        `The previous response was not valid for the required schema. Return one corrected JSON object only. Do not use Markdown. Schema: ${JSON.stringify(firstPassJsonSchema)}`,
      );
      firstPass = parseFirstPass(messageText(repairResponse));
    }

    if (!firstPass) {
      throw new Error("로컬 AI가 결과 형식을 맞추지 못했습니다.");
    }

    const candidates = retrieveReferenceCandidates({
      submission,
      analysis: firstPass.analysis,
      critique: firstPass.critique,
      selectedCriticId: critic.id,
    });

    return critiqueApiResponseSchema.parse({
      analysis: firstPass.analysis,
      critique: firstPass.critique,
      recommendations: createDeterministicRecommendations({
        candidates,
        critique: firstPass.critique,
      }),
    });
  } finally {
    await conversation.delete();
  }
}

async function getEngine(onStatus: StatusListener) {
  if (engine) {
    onStatus({ phase: "loading", progress: 100 });
    return engine;
  }

  if (!("gpu" in navigator)) {
    throw new Error("이 브라우저에서는 WebGPU를 사용할 수 없습니다.");
  }

  onStatus({ phase: "checking" });

  if (!enginePromise) {
    enginePromise = createEngine(onStatus).catch((error) => {
      enginePromise = null;
      throw error;
    });
  }

  engine = await enginePromise;
  return engine;
}

async function createEngine(onStatus: StatusListener) {
  const modelStream = await fetchModel(onStatus);
  onStatus({ phase: "loading", progress: 100 });

  const { Engine } = await import("@litert-lm/core");
  return Engine.create({ model: modelStream });
}

async function fetchModel(onStatus: StatusListener) {
  const response = await fetch(MODEL_URL, { cache: "force-cache" });
  if (!response.ok || !response.body) {
    throw new Error("로컬 AI 모델을 내려받지 못했습니다.");
  }

  const total = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  let received = 0;
  onStatus({ phase: "downloading", progress: total ? 0 : undefined });

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      received += value.byteLength;
      onStatus({
        phase: "downloading",
        progress: total ? Math.min(100, Math.round((received / total) * 100)) : undefined,
      });
      controller.enqueue(value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

function messageText(message: Message) {
  if (typeof message.content === "string") {
    return message.content;
  }

  return (message.content ?? [])
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

function parseFirstPass(text: string): FirstPassResponse | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) {
    return null;
  }

  try {
    const json = JSON.parse(text.slice(start, end + 1));
    const parsed = firstPassResponseSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
