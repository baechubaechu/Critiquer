"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MockResult } from "@/lib/mock-data";
import { fallbackResult } from "@/lib/mock-data";
import { resultCopy, text } from "@/lib/i18n";

export function CritiqueResult({ resultId }: { resultId: string }) {
  const [result, setResult] = useState<MockResult>(fallbackResult);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(`critiquer-result-${resultId}`);
    if (saved) {
      setResult(JSON.parse(saved) as MockResult);
    }
  }, [resultId]);

  async function copyResult() {
    const text = [
      result.title,
      result.disclaimer,
      `${resultCopy.centralTension[result.language]}: ${result.centralTension.title}`,
      result.centralTension.explanation,
      ...result.critiquePoints.map(
        (point) =>
          `${point.title}\n${point.observation}\n${point.designConsequence}`,
      ),
    ].join("\n\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="font-serif text-2xl">
            CRITIQUER
          </Link>
          <Link
            href="/critique"
            className="focus-ring border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper"
          >
            {text(resultCopy.anotherCritic, result.language)}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-ink pb-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">
              {text(resultCopy.mockSheet, result.language)}
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-tight">
              {result.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
              {result.disclaimer}
            </p>
          </div>
          <section className="border-l-0 border-rule lg:border-l lg:pl-8">
            <h2 className="font-serif text-3xl">
              {text(resultCopy.understand, result.language)}
            </h2>
            <p className="mt-4 text-lg leading-8">{result.interpretation}</p>
          </section>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-5">
            <Section title={text(resultCopy.centralTension, result.language)}>
              <h3 className="text-xl font-semibold">{result.centralTension.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {result.centralTension.explanation}
              </p>
            </Section>
            <Section title={text(resultCopy.oneMove, result.language)}>
              <h3 className="text-xl font-semibold">
                {result.suggestedExperiment.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {result.suggestedExperiment.instruction}
              </p>
            </Section>
            <Section title={text(resultCopy.actions, result.language)}>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={copyResult}
                  className="focus-ring border border-ink px-4 py-3 text-left text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper"
                >
                  {copied
                    ? text(resultCopy.copied, result.language)
                    : text(resultCopy.copy, result.language)}
                </button>
                <Link
                  href="/critique"
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

          <div className="space-y-8">
            <Section title={text(resultCopy.critiquePoints, result.language)}>
              <div className="grid gap-4">
                {result.critiquePoints.map((point) => (
                  <article key={point.id} className="border border-rule bg-white/35 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-2xl">{point.title}</h3>
                      <span className="text-xs uppercase tracking-normal text-muted">
                        {point.confidence}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6">{point.observation}</p>
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
                  <li key={question} className="grid grid-cols-[40px_1fr] gap-3">
                    <span className="text-sm text-muted">{index + 1}</span>
                    <span className="leading-7">{question}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title={text(resultCopy.references, result.language)}>
              <div className="grid gap-4 md:grid-cols-3">
                {result.references.map((reference) => (
                  <article key={reference.title} className="border border-rule p-4">
                    <p className="text-xs uppercase tracking-normal text-muted">
                      {reference.category}
                    </p>
                    <h3 className="mt-3 font-serif text-xl">{reference.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {reference.reason}
                    </p>
                  </article>
                ))}
              </div>
            </Section>

            <Section title={text(resultCopy.principles, result.language)}>
              <div className="flex flex-wrap gap-2">
                {result.principles.map((principle) => (
                  <span key={principle} className="border border-rule px-3 py-2 text-sm">
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
