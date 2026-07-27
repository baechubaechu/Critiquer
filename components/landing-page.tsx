"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CriticPreviewCard } from "@/components/critic-card";
import { critics } from "@/lib/mock-data";
import {
  landingCopy,
  languageNames,
  text,
  type Language,
} from "@/lib/i18n";

export function LandingPage() {
  const [language, setLanguage] = useState<Language>("ko");

  useEffect(() => {
    const saved = window.sessionStorage.getItem("critiquer-language");
    if (saved === "ko" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.sessionStorage.setItem("critiquer-language", nextLanguage);
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="architectural-grid border-b border-rule">
        <div className="mx-auto grid min-h-[84vh] max-w-7xl grid-rows-[auto_1fr] px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4 border-b border-ink/70 pb-4">
            <Link href="/" className="font-serif text-2xl tracking-normal">
              CRITIQUER
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onChange={changeLanguage} />
              <Link
                href="/critique"
                className="focus-ring border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper"
              >
                {text(landingCopy.navAction, language)}
              </Link>
            </div>
          </header>

          <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-5 max-w-xl border-l border-ink pl-4 text-sm uppercase tracking-normal text-muted">
                {text(landingCopy.eyebrow, language)}
              </p>
              <h1 className="max-w-5xl font-serif text-5xl leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
                {text(landingCopy.headline, language)}
              </h1>
            </div>
            <div className="border-t border-ink pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xl leading-8 text-ink">
                {text(landingCopy.description, language)}
              </p>
              <p className="mt-5 text-sm leading-6 text-muted">
                {text(landingCopy.disclaimer, language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 border-b border-rule pb-8 md:grid-cols-[0.45fr_1fr]">
          <h2 className="font-serif text-3xl">
            {text(landingCopy.howItWorks, language)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {landingCopy.steps.map((step, index) => (
              <article key={index} className="border-t border-ink pt-4">
                <span className="text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold">
                  {text(step.title, language)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {text(step.body, language)}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">
              {text(landingCopy.lenses, language)}
            </p>
            <h2 className="mt-2 font-serif text-4xl">
              {text(landingCopy.voices, language)}
            </h2>
          </div>
          <Link
            href="/critique"
            className="focus-ring hidden border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper sm:inline-flex"
          >
            {text(landingCopy.startCritique, language)}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {critics.map((critic) => (
            <CriticPreviewCard
              key={critic.id}
              critic={critic}
              language={language}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function LanguageToggle({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="grid grid-cols-2 border border-rule" aria-label="Language">
      {(["ko", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            language === option
              ? "bg-ink px-3 py-2 text-xs uppercase tracking-normal text-paper"
              : "px-3 py-2 text-xs uppercase tracking-normal text-muted transition hover:text-ink"
          }
          aria-pressed={language === option}
        >
          {languageNames[option]}
        </button>
      ))}
    </div>
  );
}
