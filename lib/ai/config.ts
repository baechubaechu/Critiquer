export const DEFAULT_OPENAI_MODEL = "gpt-5.6-luna";

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}
