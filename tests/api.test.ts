import { beforeEach, describe, expect, it, vi } from "vitest";
import { draft, firstPass } from "./fixtures";

describe("paid endpoint protection", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("ENABLE_EXTERNAL_CRITIQUE", "true");
    vi.stubEnv("EXTERNAL_CRITIQUE_ACCESS_CODE", "test-access-code");
    vi.stubEnv("OPENAI_API_KEY", "fake-key-for-mocked-fetch");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ output_text: JSON.stringify(firstPass) }),
      ),
    );
  });
  function request(
    body = { ...draft, aiMode: "local-with-openai" },
    authorized = true,
  ) {
    return new Request("http://localhost/api/critique", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorized ? { Authorization: "Bearer test-access-code" } : {}),
      },
      body: JSON.stringify(body),
    });
  }
  it("disables external calls by default even when a key exists", async () => {
    vi.stubEnv("ENABLE_EXTERNAL_CRITIQUE", "false");
    const { POST } = await import("@/app/api/critique/route");
    expect((await POST(request())).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects anonymous callers and local-only submissions without charging", async () => {
    const { POST } = await import("@/app/api/critique/route");
    expect((await POST(request(undefined, false))).status).toBe(401);
    expect(
      (await POST(request({ ...draft, aiMode: "local-only" }))).status,
    ).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("limits authenticated requests per server instance", async () => {
    const { POST } = await import("@/app/api/critique/route");
    for (let count = 0; count < 5; count++)
      expect((await POST(request())).status).toBe(200);
    expect((await POST(request())).status).toBe(429);
    expect(fetch).toHaveBeenCalledTimes(5);
  });
  it("distinguishes bad input from bad generated output", async () => {
    const { POST } = await import("@/app/api/critique/route");
    expect(
      (
        await POST(
          request({ ...draft, aiMode: "local-with-openai", title: "" }),
        )
      ).status,
    ).toBe(400);
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json({
        output_text: JSON.stringify({ analysis: {}, critique: {} }),
      }),
    );
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect((await response.json()).error.code).toBe("invalid-output");
  });
  it("limits body size even when Content-Length is absent", async () => {
    const { POST } = await import("@/app/api/critique/route");
    expect(
      (
        await POST(
          request({
            ...draft,
            aiMode: "local-with-openai",
            title: "a".repeat(110_000),
          }),
        )
      ).status,
    ).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });
});
