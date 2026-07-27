import { getOpenAIModel } from "@/lib/ai/config";

type ResponseOutputContent = {
  type?: string;
  text?: string;
};

type ResponseOutputItem = {
  content?: ResponseOutputContent[];
};

type ResponsesApiBody = {
  output_text?: string;
  output?: ResponseOutputItem[];
  error?: {
    message?: string;
  };
};

export class OpenAIRequestError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "OpenAIRequestError";
  }
}

export async function createStructuredResponse({
  prompt,
  schema,
  schemaName,
  signal,
}: {
  prompt: string;
  schema: object;
  schemaName: string;
  signal?: AbortSignal;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new OpenAIRequestError("OPENAI_API_KEY is not configured.", 503);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      input: prompt,
      max_output_tokens: 2400,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
    signal,
  });

  const body = (await response.json().catch(() => null)) as ResponsesApiBody | null;

  if (!response.ok) {
    throw new OpenAIRequestError(
      body?.error?.message || "OpenAI request failed.",
      response.status,
    );
  }

  const outputText =
    body?.output_text ??
    body?.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("");

  if (!outputText) {
    throw new OpenAIRequestError("OpenAI response did not include text output.");
  }

  return JSON.parse(outputText) as unknown;
}
