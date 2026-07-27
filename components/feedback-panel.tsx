"use client";

import { useEffect, useState } from "react";

type FeedbackTarget = {
  id: string;
  label: string;
};

const storageKey = "critiquer-feedback-notes";

export function FeedbackPanel() {
  const [isPicking, setIsPicking] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<FeedbackTarget | null>(null);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedNotes = window.localStorage.getItem(storageKey);
    if (!storedNotes) return;

    try {
      setSavedNotes(JSON.parse(storedNotes));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.feedbackPicking = isPicking ? "true" : "false";

    function handleTargetClick(event: MouseEvent) {
      if (!isPicking) return;

      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-feedback-target]",
      );
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      setSelectedTarget({
        id: target.dataset.feedbackTarget ?? "",
        label: target.dataset.feedbackLabel ?? "선택한 영역",
      });
      setIsPicking(false);
    }

    document.addEventListener("click", handleTargetClick, true);
    return () => {
      document.body.dataset.feedbackPicking = "false";
      document.removeEventListener("click", handleTargetClick, true);
    };
  }, [isPicking]);

  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>("[data-feedback-selected='true']")
      .forEach((element) => element.removeAttribute("data-feedback-selected"));

    if (!selectedTarget) return;

    document
      .querySelector<HTMLElement>(
        `[data-feedback-target="${selectedTarget.id}"]`,
      )
      ?.setAttribute("data-feedback-selected", "true");
  }, [selectedTarget]);

  const request = selectedTarget && note.trim()
    ? `[수정 요청] ${selectedTarget.label}\n현재 위치: ${selectedTarget.id}\n원하는 변경: ${note.trim()}`
    : "";

  async function saveAndCopy() {
    if (!request) return;

    const nextNotes = [request, ...savedNotes].slice(0, 8);
    setSavedNotes(nextNotes);
    window.localStorage.setItem(storageKey, JSON.stringify(nextNotes));
    await navigator.clipboard.writeText(request);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <aside
      data-feedback-ui
      className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] border border-ink bg-paper p-4 shadow-[0_16px_42px_rgba(24,23,21,0.18)]"
      aria-label="수정 요청 도구"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">수정 요청</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            화면을 보고 수정할 부분을 직접 지정하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPicking((current) => !current)}
          className={
            isPicking
              ? "border border-ink bg-ink px-3 py-2 text-xs text-paper"
              : "border border-ink px-3 py-2 text-xs text-ink hover:bg-ink hover:text-paper"
          }
          aria-pressed={isPicking}
        >
          {isPicking ? "선택 취소" : "위치 선택"}
        </button>
      </div>

      {isPicking ? (
        <p className="mt-4 border-y border-rule py-3 text-sm leading-6">
          이제 화면에서 수정할 영역을 클릭하세요.
        </p>
      ) : null}

      <div className="mt-4">
        <p className="text-xs text-muted">선택한 위치</p>
        <p className="mt-1 min-h-6 text-sm font-medium">
          {selectedTarget?.label ?? "아직 선택하지 않음"}
        </p>
      </div>

      <label className="mt-3 block text-xs text-muted" htmlFor="feedback-note">
        원하는 변경
      </label>
      <textarea
        id="feedback-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="예: 이 제목을 더 짧고 단단하게 바꿔줘"
        className="mt-1 min-h-24 w-full resize-y border border-rule bg-white/60 p-3 text-sm leading-6 outline-none focus:border-ink"
      />

      <button
        type="button"
        onClick={saveAndCopy}
        disabled={!request}
        className="mt-3 w-full border border-ink bg-ink px-4 py-3 text-sm text-paper disabled:cursor-not-allowed disabled:border-rule disabled:bg-rule disabled:text-muted"
      >
        {copied ? "복사됨 - 채팅에 붙여넣기" : "수정 요청 복사"}
      </button>

      {savedNotes.length > 0 ? (
        <p className="mt-3 text-xs leading-5 text-muted">
          이 브라우저에 최근 요청 {savedNotes.length}개를 보관 중입니다.
        </p>
      ) : null}
    </aside>
  );
}
