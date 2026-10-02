import { firstPassJsonSchema } from "@/lib/ai/json-schema";
import { firstPassResponseSchema } from "@/lib/ai/schemas";
import { projectSubmissionSchema } from "@/lib/validation/submission";
import type { ProjectDraft } from "@/lib/mock-data";

let nextId = 0;
function sample(schema: unknown, field = ""): unknown {
  const value = schema as {
    type: string;
    properties?: Record<string, unknown>;
    items?: unknown;
    minItems?: number;
    enum?: string[];
  };
  if (value.enum) return value.enum[0];
  if (value.type === "object")
    return Object.fromEntries(
      Object.entries(value.properties ?? {}).map(([key, item]) => [
        key,
        sample(item, key),
      ]),
    );
  if (value.type === "array")
    return Array.from({ length: value.minItems ?? 1 }, () =>
      sample(value.items),
    );
  return field === "id" ? `point-${++nextId}` : "light and material";
}
export const firstPass = firstPassResponseSchema.parse(
  sample(firstPassJsonSchema),
);
export const draft: ProjectDraft = {
  criticId: "peter-zumthor",
  title: "Saved project",
  oneLineSummary: "A neighborhood public library",
  problem: "A shortage of places to read",
  concept: "Daylit rooms for reading",
  designStrategies: "Use skylights and quiet rooms",
  critiqueRequest: "Review light and circulation",
  site: "",
  program: "",
  users: "",
  spatialOrganization: "",
  circulation: "",
  structure: "",
  materials: "",
  environmentalStrategy: "",
  stage: "concept",
  reviewFocus: "comprehensive",
  intensity: "constructive",
  language: "ko",
  aiMode: "local-only",
};
export const submission = projectSubmissionSchema.parse(draft);
