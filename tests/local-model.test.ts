import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { draft, firstPass, submission } from "./fixtures";
import { getCriticProfile } from "@/lib/critics";

const fake = vi.hoisted(() => ({
  create: vi.fn(),
  createConversation: vi.fn(),
}));
vi.mock("@litert-lm/core", () => ({ Engine: { create: fake.create } }));
beforeEach(() => {
  vi.resetModules();
  fake.create.mockReset();
  fake.createConversation.mockReset();
  vi.stubGlobal("navigator", {
    gpu: {},
    storage: { persisted: async () => false, persist: async () => false },
  });
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(new Uint8Array([1, 2, 3]))),
  );
  fake.create.mockImplementation(
    async ({ model }: { model: ReadableStream<Uint8Array> }) => {
      const reader = model.getReader();
      while (!(await reader.read()).done) {
        /* Consume the mocked model only. */
      }
      return { createConversation: fake.createConversation };
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

it("retries invalid output in a new conversation and releases both conversations", async () => {
  const dispose = vi.fn();
  const firstSend = vi.fn(async () => ({
    role: "assistant",
    content: "incomplete",
  }));
  const secondSend = vi.fn(async () => ({
    role: "assistant",
    tool_calls: [
      { function: { name: "submit_critique", arguments: firstPass } },
    ],
  }));
  fake.createConversation
    .mockResolvedValueOnce({
      getTokenCount: async () => 600,
      sendMessage: firstSend,
      delete: dispose,
    })
    .mockResolvedValueOnce({
      getTokenCount: async () => 600,
      sendMessage: secondSend,
      delete: dispose,
    });
  const { generateLocalCritique } = await import("@/lib/ai/local-gemma");
  const result = await generateLocalCritique({
    submission,
    critic: getCriticProfile(draft.criticId)!,
    onStatus: vi.fn(),
  });
  expect(result.critique.critiquePoints).toHaveLength(3);
  expect(fake.createConversation).toHaveBeenCalledTimes(2);
  expect(firstSend).toHaveBeenCalledTimes(1);
  expect(secondSend).toHaveBeenCalledTimes(1);
  expect(dispose).toHaveBeenCalledTimes(2);
});

it("handles cache quota failures immediately and reports storage unavailable", async () => {
  const cache = {
    match: async () => null,
    put: vi.fn(async () => {
      throw new DOMException("quota", "QuotaExceededError");
    }),
  };
  vi.stubGlobal("window", { caches: {} });
  vi.stubGlobal("caches", { open: async () => cache });
  vi.spyOn(console, "warn").mockImplementation(() => {});
  fake.createConversation.mockResolvedValue({
    getTokenCount: async () => 600,
    sendMessage: async () => ({
      role: "assistant",
      tool_calls: [
        { function: { name: "submit_critique", arguments: firstPass } },
      ],
    }),
    delete: vi.fn(),
  });
  const status = vi.fn();
  const { generateLocalCritique } = await import("@/lib/ai/local-gemma");
  await generateLocalCritique({
    submission,
    critic: getCriticProfile(draft.criticId)!,
    onStatus: status,
  });
  expect(status).toHaveBeenCalledWith({
    phase: "loading",
    storage: "unavailable",
  });
  expect(console.warn).toHaveBeenCalled();
});

it("saves the download without cloning it, then loads the cached stream", async () => {
  let stored: ArrayBuffer | null = null;
  const downloaded = new Response(new Uint8Array([1, 2, 3]));
  const clone = vi.spyOn(downloaded, "clone");
  vi.mocked(fetch).mockResolvedValueOnce(downloaded);
  const cache = {
    match: async () => (stored ? new Response(stored) : null),
    put: async (_key: string, response: Response) => {
      stored = await response.arrayBuffer();
    },
  };
  vi.stubGlobal("window", { caches: {} });
  vi.stubGlobal("caches", { open: async () => cache });
  fake.createConversation.mockResolvedValue({
    getTokenCount: async () => 600,
    sendMessage: async () => ({
      role: "assistant",
      tool_calls: [
        { function: { name: "submit_critique", arguments: firstPass } },
      ],
    }),
    delete: vi.fn(),
  });
  const status = vi.fn();
  const { generateLocalCritique } = await import("@/lib/ai/local-gemma");
  await generateLocalCritique({
    submission,
    critic: getCriticProfile(draft.criticId)!,
    onStatus: status,
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(clone).not.toHaveBeenCalled();
  expect(status).toHaveBeenCalledWith({
    phase: "loading",
    progress: 100,
    storage: "temporary",
  });
});

it("skips caching when browser storage is already full", async () => {
  const put = vi.fn();
  vi.stubGlobal("window", { caches: {} });
  vi.stubGlobal("caches", {
    open: async () => ({ match: async () => null, put }),
  });
  vi.stubGlobal("navigator", {
    gpu: {},
    storage: {
      persisted: async () => false,
      persist: async () => false,
      estimate: async () => ({ quota: 100, usage: 99 }),
    },
  });
  fake.createConversation.mockResolvedValue({
    getTokenCount: async () => 600,
    sendMessage: async () => ({
      role: "assistant",
      tool_calls: [
        { function: { name: "submit_critique", arguments: firstPass } },
      ],
    }),
    delete: vi.fn(),
  });
  const { generateLocalCritique } = await import("@/lib/ai/local-gemma");
  await generateLocalCritique({
    submission,
    critic: getCriticProfile(draft.criticId)!,
    onStatus: vi.fn(),
  });
  expect(put).not.toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledTimes(1);
});
