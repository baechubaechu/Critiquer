import { z } from "zod";
import type { MockResult, ProjectDraft } from "@/lib/mock-data";
import {
  projectStageSchema,
  reviewFocusSchema,
  critiqueIntensitySchema,
} from "@/lib/validation/submission";
import { getCriticProfile } from "@/lib/critics";

const displayResultSchema = z.object({
  title: z.string(),
  disclaimer: z.string(),
  interpretation: z.string(),
  centralTension: z.object({ title: z.string(), explanation: z.string() }),
  critiquePoints: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        observation: z.string(),
        designConsequence: z.string(),
        confidence: z.enum(["high", "medium", "low"]),
      }),
    )
    .length(3),
  questions: z.array(z.string()).min(3).max(4),
  suggestedExperiment: z.object({ title: z.string(), instruction: z.string() }),
  references: z.array(
    z.object({ title: z.string(), category: z.string(), reason: z.string() }),
  ),
  principles: z.array(z.string()),
  limits: z.string(),
  language: z.enum(["ko", "en"]),
});

type SavedResult = {
  result: MockResult;
  draft?: ProjectDraft;
  storage: "persistent" | "session" | "memory";
};
const memoryResults = new Map<string, SavedResult>();

export function readBrowserValue(key: string) {
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      const value = window[name].getItem(key);
      if (value !== null) return value;
    } catch {
      /* Storage may be blocked or unavailable. */
    }
  }
  return null;
}

export function writeBrowserValue(key: string, value: string) {
  let saved = false;
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      window[name].setItem(key, value);
      saved = true;
    } catch {
      /* Keep the current screen usable. */
    }
  }
  return saved;
}

export function restoreDraft(
  defaults: ProjectDraft,
  serialized: string | null,
): ProjectDraft {
  try {
    const raw: unknown = JSON.parse(serialized ?? "null");
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      return { ...defaults };
    const values = raw as Record<string, unknown>;
    const restored = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof ProjectDraft)[]) {
      if (typeof values[key] === "string")
        Object.assign(restored, { [key]: values[key] });
    }
    if (!["ko", "en"].includes(restored.language))
      restored.language = defaults.language;
    if (!["local-only", "local-with-openai"].includes(restored.aiMode))
      restored.aiMode = "local-only";
    if (!getCriticProfile(restored.criticId))
      restored.criticId = defaults.criticId;
    if (!projectStageSchema.safeParse(restored.stage).success)
      restored.stage = defaults.stage;
    if (!reviewFocusSchema.safeParse(restored.reviewFocus).success)
      restored.reviewFocus = defaults.reviewFocus;
    if (!critiqueIntensitySchema.safeParse(restored.intensity).success)
      restored.intensity = defaults.intensity;
    return restored;
  } catch {
    return { ...defaults };
  }
}

export function saveResult(
  id: string,
  result: MockResult,
  draft: ProjectDraft,
) {
  const stored = { result, draft };
  memoryResults.set(id, { ...stored, storage: "memory" });
  return writeBrowserValue(
    `critiquer-result-${id}`,
    JSON.stringify({ version: 1, ...stored }),
  );
}

export function loadResult(id: string): SavedResult | null {
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(id)) return null;
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try {
      const serialized = window[name].getItem(`critiquer-result-${id}`);
      if (!serialized) continue;
      const raw = JSON.parse(serialized);
      const parsed = displayResultSchema.safeParse(
        raw.version === 1 ? raw.result : raw,
      );
      if (parsed.success)
        return {
          result: parsed.data,
          draft: raw.version === 1 ? raw.draft : undefined,
          storage: name === "localStorage" ? "persistent" : "session",
        };
    } catch {
      /* Invalid saved results must never turn into sample critiques. */
    }
  }
  return memoryResults.get(id) ?? null;
}

export function resultToText(result: MockResult) {
  return [
    result.title,
    result.disclaimer,
    result.interpretation,
    result.centralTension.title,
    result.centralTension.explanation,
    ...result.critiquePoints.map(
      (point) =>
        `${point.title}\n${point.observation}\n${point.designConsequence}`,
    ),
    ...result.questions,
    result.suggestedExperiment.title,
    result.suggestedExperiment.instruction,
    ...result.references.map(
      (reference) =>
        `${reference.title}\n${reference.category}\n${reference.reason}`,
    ),
    result.principles.join(", "),
    result.limits,
  ].join("\n\n");
}
