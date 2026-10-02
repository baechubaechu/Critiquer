"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MockResult } from "@/lib/mock-data";
import {
  loadResult,
  resultToText,
  writeBrowserValue,
} from "@/lib/browser-storage";
import { resultCopy, text } from "@/lib/i18n";
import { getReferenceReason } from "@/lib/references/display-copy";

export function CritiqueResult({ resultId }: { resultId: string }) {
  const [saved, setSaved] = useState<{
    id: string;
    result: MockResult | null;
    temporary?: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = loadResult(resultId);
    setSaved({
      id: resultId,
      result: stored?.result ?? null,
      temporary: stored?.storage !== "persistent",
    });
  }, [resultId]);

  const result = saved?.id === resultId ? saved.result : null;

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(resultToText(result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const url = URL.createObjectURL(
        new Blob([resultToText(result)], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "critiquer-result.txt";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  function restoreProject() {
    const draft = loadResult(resultId)?.draft;
    if (draft) writeBrowserValue("critiquer-draft", JSON.stringify(draft));
  }

  if (!result)
    return (
      <main className="mx-auto max-w-7xl px-5 py-12 text-ink">
        <Link href="/" className="font-serif text-3xl">
          CRITIQUER
        </Link>
        <h1 className="mt-10 text-2xl">
          {saved?.id === resultId
            ? "저장된 크리틱을 찾을 수 없습니다."
            : "크리틱을 불러오고 있습니다."}
        </h1>
        {saved?.id === resultId ? (
          <Link
            href="/critique"
            className="focus-ring mt-6 inline-block border border-ink px-5 py-3"
          >
            크리틱 받기
          </Link>
        ) : null}
      </main>
    );

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink bg-paper/95">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8 lg:px-10">
          <Link href="/" className="font-serif text-3xl">
            CRITIQUER
          </Link>
          <Link
            href="/critique"
            onClick={restoreProject}
            className="focus-ring border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper"
          >
            {text(resultCopy.anotherCritic, result.language)}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        {saved?.temporary ? (
          <p
            role="status"
            className="mb-5 border-b border-clay pb-4 text-sm text-clay"
          >
            {result.language === "ko"
              ? "이 결과는 현재 창에서만 보관됩니다. 창을 닫기 전에 결과를 복사해주세요."
              : "This result is only kept in the current window. Copy it before closing the window."}
          </p>
        ) : null}
        <div className="border border-ink bg-paper sheet-shadow">
          <div className="grid gap-8 border-b border-ink p-5 sm:p-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="grid content-between gap-8">
              <div>
                <p className="text-sm uppercase tracking-normal text-muted">
                  {text(resultCopy.mockSheet, result.language)}
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  {result.title}
                </h1>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
                {result.disclaimer}
              </p>
            </div>
            <section className="border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <h2 className="font-serif text-3xl leading-tight">
                {text(resultCopy.understand, result.language)}
              </h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-8">
                {result.interpretation}
              </p>
            </section>
          </div>

          <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-6 border-b border-ink p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <Section title={text(resultCopy.centralTension, result.language)}>
                <h3 className="font-serif text-3xl leading-tight">
                  {result.centralTension.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {result.centralTension.explanation}
                </p>
              </Section>
              <Section title={text(resultCopy.oneMove, result.language)}>
                <h3 className="text-xl font-semibold">
                  {result.suggestedExperiment.title}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">
                  {result.suggestedExperiment.instruction}
                </p>
              </Section>
              <Section title={text(resultCopy.actions, result.language)}>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={copyResult}
                    className="focus-ring border border-ink bg-ink px-4 py-3 text-left text-sm uppercase tracking-normal text-paper transition hover:bg-paper hover:text-ink"
                  >
                    {copied
                      ? text(resultCopy.copied, result.language)
                      : text(resultCopy.copy, result.language)}
                  </button>
                  <Link
                    href="/critique"
                    onClick={restoreProject}
                    className="focus-ring border border-rule px-4 py-3 text-sm uppercase tracking-normal text-muted transition hover:border-ink hover:text-ink"
                  >
                    {text(resultCopy.returnEdit, result.language)}
                  </Link>
                  <button
                    type="button"
                    disabled
                    className="border border-rule px-4 py-3 text-left text-sm uppercase tracking-normal text-muted opacity-60"
                  >
                    {text(resultCopy.compare, result.language)}
                  </button>
                </div>
              </Section>
            </aside>

            <div className="space-y-10 p-5 sm:p-8">
              <Section title={text(resultCopy.critiquePoints, result.language)}>
                <div className="grid gap-4">
                  {result.critiquePoints.map((point) => (
                    <article
                      key={point.id}
                      className="border border-rule bg-white/35 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-serif text-2xl leading-tight">
                          {point.title}
                        </h3>
                        <span className="text-xs uppercase tracking-normal text-muted">
                          {point.confidence}
                        </span>
                      </div>
                      <p className="mt-4 whitespace-pre-line text-sm leading-6">
                        {point.observation}
                      </p>
                      <p className="mt-3 border-t border-rule pt-3 text-sm leading-6 text-muted">
                        {point.designConsequence}
                      </p>
                    </article>
                  ))}
                </div>
              </Section>

              <Section title={text(resultCopy.questions, result.language)}>
                <ol className="grid gap-3">
                  {result.questions.map((question, index) => (
                    <li
                      key={question}
                      className="grid grid-cols-[40px_1fr] gap-3"
                    >
                      <span className="text-sm text-muted">{index + 1}</span>
                      <span className="leading-7">{question}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title={text(resultCopy.references, result.language)}>
                {result.references.length === 0 ? (
                  <p className="text-sm text-muted">
                    {result.language === "ko"
                      ? "현재 자료에서 설계 주제와 일치하는 레퍼런스를 찾지 못했습니다."
                      : "No matching references were found in the current collection."}
                  </p>
                ) : null}
                <div className="grid gap-4 md:grid-cols-3">
                  {result.references.map((reference) => (
                    <article
                      key={reference.title}
                      className="border border-rule bg-white/30 p-4"
                    >
                      <p className="text-xs uppercase tracking-normal text-muted">
                        {reference.category}
                      </p>
                      <h3 className="mt-3 font-serif text-xl">
                        {reference.title}
                      </h3>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">
                        {getReferenceReason(
                          reference.title,
                          reference.reason,
                          result.language,
                        )}
                      </p>
                    </article>
                  ))}
                </div>
              </Section>

              <Section title={text(resultCopy.principles, result.language)}>
                <div className="flex flex-wrap gap-2">
                  {result.principles.map((principle) => (
                    <span
                      key={principle}
                      className="border border-rule px-3 py-2 text-sm"
                    >
                      {principle}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title={text(resultCopy.limits, result.language)}>
                <p className="text-sm leading-6 text-muted">{result.limits}</p>
              </Section>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="border-b border-rule pb-3 text-sm uppercase tracking-normal text-muted">
        {title}
      </h2>
      <div className="pt-4">{children}</div>
    </section>
  );
}
