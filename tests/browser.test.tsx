// @vitest-environment jsdom
import { StrictMode } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CritiqueFlow } from "@/components/critique-form/critique-flow";
import { CritiqueResult } from "@/components/critique-result";
import {
  loadResult,
  restoreDraft,
  saveResult,
  resultToText,
} from "@/lib/browser-storage";
import { apiResponseToDisplayResult } from "@/lib/result-adapter";
import { draft, firstPass } from "./fixtures";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

describe("draft and result storage", () => {
  it("restores a saved draft through StrictMode without replacing it with an empty draft", async () => {
    localStorage.setItem("critiquer-draft", JSON.stringify(draft));
    render(
      <StrictMode>
        <CritiqueFlow />
      </StrictMode>,
    );
    fireEvent.click(screen.getByRole("button", { name: "계속" }));
    await waitFor(() =>
      expect(screen.getByLabelText(/프로젝트 제목/).getAttribute("value")).toBe(
        draft.title,
      ),
    );
    expect(JSON.parse(localStorage.getItem("critiquer-draft")!).title).toBe(
      draft.title,
    );
  });
  it("recovers from invalid stored drafts and fills missing fields", () => {
    expect(restoreDraft(draft, "broken json")).toEqual(draft);
    expect(
      restoreDraft(
        draft,
        JSON.stringify({ title: "Recovered title", aiMode: "invalid" }),
      ),
    ).toEqual({ ...draft, title: "Recovered title" });
  });
  it("keeps real results after session storage is cleared", () => {
    const result = apiResponseToDisplayResult({
      apiResponse: { ...firstPass, recommendations: [] },
      draft,
      criticName: "Peter Zumthor",
    });
    saveResult("persisted-result", result, draft);
    sessionStorage.clear();
    expect(loadResult("persisted-result")?.result.title).toBe(result.title);
    expect(resultToText(result)).toContain(result.questions[0]);
    expect(resultToText(result)).toContain(
      result.suggestedExperiment.instruction,
    );
  });
  it("retains a generated result in memory when browser storage is blocked", () => {
    const result = apiResponseToDisplayResult({
      apiResponse: { ...firstPass, recommendations: [] },
      draft,
      criticName: "Peter Zumthor",
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(saveResult("blocked-storage", result, draft)).toBe(false);
    expect(loadResult("blocked-storage")?.result).toEqual(result);
  });
  it("shows missing-result state instead of a sample and clears previous results on navigation", async () => {
    const result = apiResponseToDisplayResult({
      apiResponse: { ...firstPass, recommendations: [] },
      draft,
      criticName: "Peter Zumthor",
    });
    saveResult("visible-result", result, draft);
    const view = render(<CritiqueResult resultId="visible-result" />);
    expect(
      await screen.findByRole("heading", { name: result.title }),
    ).toBeTruthy();
    view.rerender(<CritiqueResult resultId="unknown-result" />);
    expect(
      await screen.findByText("저장된 크리틱을 찾을 수 없습니다."),
    ).toBeTruthy();
    expect(screen.queryByText(result.title)).toBeNull();
    expect(screen.queryByText(/샘플 스튜디오 프로젝트/)).toBeNull();
  });
});
