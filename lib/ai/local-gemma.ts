import type { Engine, Message, Schema, Tool } from "@litert-lm/core";
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
const MODEL_CACHE_NAME = "critiquer-local-model-v1";
const CRITIQUE_TOOL_NAME = "submit_critique";
const critiqueTool = {
  type: "function",
  function: {
    name: CRITIQUE_TOOL_NAME,
    description: "Submit the complete architectural critique in the required structure.",
    parameters: toLiteRtSchema(firstPassJsonSchema),
  },
} satisfies Tool;

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
  void requestPersistentModelStorage();
  const localEngine = await getEngine(onStatus);
  onStatus({ phase: "generating" });

  const conversation = await localEngine.createConversation({
    enableConstrainedDecoding: true,
    sessionConfig: {
      maxOutputTokens: 4096,
      samplerParams: { temperature: 0.35, p: 0.9, k: 40 },
    },
    preface: {
      messages: [
        {
          role: "system",
          content:
            "You are CRITIQUER, an architectural studio critic. Submit the complete result through the provided tool.",
        },
      ],
      tools: [critiqueTool],
    },
  });

  try {
    const prompt = `${buildFirstPassPrompt({ submission, critic })}\n\nCall ${CRITIQUE_TOOL_NAME} exactly once with the complete result.`;
    const firstResponse = await conversation.sendMessage(prompt);
    let firstPass = parseFirstPassMessage(firstResponse);

    if (!firstPass) {
      const repairResponse = await conversation.sendMessage(
        `The previous tool arguments were incomplete. Call ${CRITIQUE_TOOL_NAME} again with every required field, exactly three critique points, three or four questions, and exactly three recommendation queries.`,
      );
      firstPass = parseFirstPassMessage(repairResponse);
    }

    if (!firstPass) {
      throw new Error("이 기기에서 크리틱 형식을 맞추지 못했습니다.");
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
  return Engine.create({
    model: modelStream,
    mainExecutorSettings: {
      maxNumTokens: 8192,
    },
  });
}

async function fetchModel(onStatus: StatusListener) {
  const cachedResponse = await getCachedModelResponse();
  const response =
    cachedResponse ?? (await fetch(MODEL_URL, { cache: "force-cache" }));
  if (!response.ok || !response.body) {
    throw new Error("이 기기에서 사용할 모델을 내려받지 못했습니다.");
  }

  const cacheWrite = cachedResponse ? null : cacheModelResponse(response.clone());
  const total = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  let received = 0;
  onStatus(
    cachedResponse
      ? { phase: "loading", progress: 100 }
      : { phase: "downloading", progress: total ? 0 : undefined },
  );

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        if (cacheWrite) {
          try {
            await cacheWrite;
            await requestPersistentModelStorage();
          } catch (error) {
            console.warn("[CRITIQUER_MODEL_CACHE_ERROR]", error);
          }
        }
        controller.close();
        return;
      }

      received += value.byteLength;
      if (!cachedResponse) {
        onStatus({
          phase: "downloading",
          progress: total
            ? Math.min(100, Math.round((received / total) * 100))
            : undefined,
        });
      }
      controller.enqueue(value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

async function getCachedModelResponse() {
  if (!("caches" in window)) return null;

  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    return (await cache.match(MODEL_URL)) ?? null;
  } catch (error) {
    console.warn("[CRITIQUER_MODEL_CACHE_READ_ERROR]", error);
    return null;
  }
}

async function cacheModelResponse(response: Response) {
  if (!("caches" in window)) return;

  const cache = await caches.open(MODEL_CACHE_NAME);
  await cache.put(MODEL_URL, response);
}

async function requestPersistentModelStorage() {
  if (!("storage" in navigator) || !("persist" in navigator.storage)) {
    return false;
  }

  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch (error) {
    console.warn("[CRITIQUER_STORAGE_PERSIST_ERROR]", error);
    return false;
  }
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

function parseFirstPassMessage(message: Message) {
  const toolCall = message.tool_calls?.find(
    (call) => call.function.name === CRITIQUE_TOOL_NAME,
  );
  if (toolCall) {
    const parsed = firstPassResponseSchema.safeParse(toolCall.function.arguments);
    if (parsed.success) return parsed.data;
  }

  return parseFirstPass(messageText(message));
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

function toLiteRtSchema(schema: unknown): Schema {
  if (!schema || typeof schema !== "object") return {};

  const source = schema as Record<string, unknown>;
  const result: Schema = {};

  if (typeof source.type === "string") {
    result.type = source.type as Schema["type"];
  }
  if (typeof source.description === "string") {
    result.description = source.description;
  }
  if (Array.isArray(source.required)) {
    result.required = source.required.filter(
      (value): value is string => typeof value === "string",
    );
  }
  if (Array.isArray(source.enum)) {
    result.enum = source.enum.filter(
      (value): value is string => typeof value === "string",
    );
  }
  if (source.items) {
    result.items = toLiteRtSchema(source.items);
  }
  if (source.properties && typeof source.properties === "object") {
    result.properties = Object.fromEntries(
      Object.entries(source.properties).map(([key, value]) => [
        key,
        toLiteRtSchema(value),
      ]),
    );
  }

  return result;
}
