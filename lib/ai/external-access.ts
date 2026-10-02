import { createHash, timingSafeEqual } from "node:crypto";

const windowMs = 60 * 60 * 1000;
const limit = 5;
let windowStart = 0;
let requests = 0;

export function authorizeExternalCritique(request: Request) {
  const code = process.env.EXTERNAL_CRITIQUE_ACCESS_CODE?.trim();
  if (process.env.ENABLE_EXTERNAL_CRITIQUE !== "true" || !code) {
    return {
      status: 403,
      code: "external-disabled",
      message:
        "외부 서비스 사용이 설정되어 있지 않습니다. 로컬 방식으로 생성해주세요.",
    };
  }
  const authorization = request.headers.get("authorization") ?? "";
  let supplied = "";
  try {
    if (authorization.startsWith("Bearer "))
      supplied = decodeURIComponent(authorization.slice(7));
  } catch {
    /* Reject malformed credentials below. */
  }
  const hash = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(hash(code), hash(supplied))) {
    return {
      status: 401,
      code: "access-denied",
      message: "외부 서비스 접속 코드를 확인해주세요.",
    };
  }
  // This limit is per server instance; shared credentials are required on every instance.
  const now = Date.now();
  if (now - windowStart >= windowMs) {
    windowStart = now;
    requests = 0;
  }
  if (requests >= limit) {
    return {
      status: 429,
      code: "rate-limited",
      message:
        "외부 서비스 사용 한도에 도달했습니다. 로컬 방식으로 생성하거나 한 시간 뒤 다시 시도해주세요.",
    };
  }
  requests += 1;
  return null;
}
