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
      <section className="review-noise border-b border-ink/80">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <header className="grid gap-4 border-b border-ink/70 pb-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <Link href="/" className="font-serif text-3xl tracking-normal">
              CRITIQUER
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <LanguageToggle language={language} onChange={changeLanguage} />
              <Link
                href="/critique"
                className="focus-ring border border-ink bg-ink px-4 py-2 text-sm uppercase tracking-normal text-paper transition hover:bg-transparent hover:text-ink"
              >
                {text(landingCopy.navAction, language)}
              </Link>
            </div>
          </header>

          <div className="grid min-h-[76vh] gap-8 py-8 lg:grid-cols-[minmax(0,1.25fr)_390px] lg:items-stretch">
            <section className="grid content-between border border-ink bg-paper/88 p-5 sheet-shadow sm:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 border-b border-rule pb-5 text-xs uppercase tracking-normal text-muted">
                  <span>{text(landingCopy.eyebrow, language)}</span>
                  <span className="h-px min-w-10 flex-1 bg-rule" />
                  <span>Studio Review Engine</span>
                </div>
                <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
                  {text(landingCopy.headline, language)}
                </h1>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-[0.65fr_1fr]">
                <p className="text-xl leading-8 text-ink">
                  {text(landingCopy.description, language)}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {landingCopy.steps.map((step, index) => (
                    <article key={index} className="border-t border-ink pt-4">
                      <span className="text-sm text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-5 text-lg font-semibold">
                        {text(step.title, language)}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {text(step.body, language)}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <aside className="grid border border-ink bg-ink text-paper">
              <div className="border-b border-paper/20 p-5">
                <p className="text-xs uppercase tracking-normal text-paper/60">
                  {language === "ko" ? "리뷰 데스크" : "Review Desk"}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">
                  {language === "ko"
                    ? "개념과 도면 사이의 가장 큰 긴장을 먼저 찾습니다."
                    : "Find the strongest tension between concept and drawing first."}
                </h2>
              </div>
              <div className="grid gap-5 p-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="border border-paper/20 p-3">
                    <p className="text-paper/55">
                      {language === "ko" ? "모드" : "Mode"}
                    </p>
                    <p className="mt-2">
                      {language === "ko" ? "AI 비평" : "AI critique"}
                    </p>
                  </div>
                  <div className="border border-paper/20 p-3">
                    <p className="text-paper/55">
                      {language === "ko" ? "기본 언어" : "Default"}
                    </p>
                    <p className="mt-2">
                      {language === "ko" ? "한국어" : "Korean"}
                    </p>
                  </div>
                </div>
                <p className="border-y border-paper/20 py-4 text-sm leading-6 text-paper/72">
                  {text(landingCopy.disclaimer, language)}
                </p>
                <Link
                  href="/critique"
                  className="focus-ring border border-paper bg-paper px-5 py-4 text-center text-sm uppercase tracking-normal text-ink transition hover:bg-ink hover:text-paper"
                >
                  {text(landingCopy.startCritique, language)}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-6 grid gap-3 border-b border-rule pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">
              {text(landingCopy.lenses, language)}
            </p>
            <h2 className="mt-2 font-serif text-4xl">
              {text(landingCopy.voices, language)}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            {language === "ko"
              ? "비평가는 인물이 아니라 판단 체계입니다. 하나의 렌즈를 고르면 같은 프로젝트의 약점이 다르게 보입니다."
              : "A critic is treated as an evaluation system, not a persona. Each lens reveals a different weakness in the same project."}
          </p>
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
    <div className="grid grid-cols-2 border border-rule bg-paper" aria-label="Language">
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
