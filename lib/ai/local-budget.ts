export const LOCAL_CONTEXT_TOKENS = 8192;
export const LOCAL_OUTPUT_TOKENS = 4096;
const safetyTokens = 512;

// Conservative estimate: runtime tokenization is not exposed for unsent messages.
export function estimateTokens(value: string) {
  let count = 0;
  for (const character of value) {
    count += character.charCodeAt(0) <= 127 ? 1 / 3 : 2;
  }
  return Math.ceil(count);
}

export function localOutputBudget(
  prompt: string,
  prefaceTokens: number,
  language: "ko" | "en",
) {
  const available =
    LOCAL_CONTEXT_TOKENS -
    estimateTokens(prompt) -
    prefaceTokens -
    safetyTokens;
  if (available < 2048) {
    throw new Error(
      language === "ko"
        ? "입력 내용이 로컬 모델의 처리 범위를 넘을 수 있습니다. 중복 설명과 부가 정보를 줄여주세요."
        : "The input may exceed the local model's context limit. Shorten repeated descriptions and optional details.",
    );
  }
  return Math.min(LOCAL_OUTPUT_TOKENS, available);
}
