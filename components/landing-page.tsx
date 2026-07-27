"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

          <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1.25fr)_390px] lg:items-stretch">
            <section
              data-feedback-target="landing-hero"
              data-feedback-label="첫 화면 대표 이미지"
              className="relative aspect-[16/9] min-h-0 overflow-hidden border border-ink bg-paper sheet-shadow"
            >
              <Image
                src="/main-profile-cutout.png"
                alt="다섯 명의 건축 교수님을 표현한 인물 일러스트"
                fill
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="scale-90 object-contain object-center"
              />
            </section>

            <aside
              data-feedback-target="landing-review-desk"
              data-feedback-label="리뷰 데스크 영역"
              className="grid border border-ink bg-ink text-paper"
            >
              <div className="border-b border-paper/20 p-5">
                <h2 className="font-serif text-3xl leading-tight">
                  {language === "ko"
                    ? "원하는 건축가에게 크리틱 받으세요"
                    : "Get a critique from the architect you choose."}
                </h2>
              </div>
              <div className="grid gap-5 p-5">
                <p className="border-y border-paper/20 py-4 text-sm leading-6 text-paper/72">
                  {text(landingCopy.disclaimer, language)}
                </p>
                <Link
                  href="/critique"
                  className="focus-ring border border-paper bg-paper px-5 py-3.5 text-center text-base font-semibold tracking-normal text-ink transition hover:bg-ink hover:text-paper"
                >
                  {text(landingCopy.startCritique, language)}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        data-feedback-target="landing-lenses"
        data-feedback-label="교수 소개"
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10"
      >
        <div className="mb-6 grid gap-3 border-b border-rule pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="font-serif text-4xl">
            {text(landingCopy.voices, language)}
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted">
            {language === "ko"
              ? "각 교수는 서로 다른 기준으로 설계를 봅니다. 프로젝트에 맞는 교수를 선택해 크리틱을 받아보세요."
              : "Each professor reviews design differently. Choose the professor who best fits your project and receive a critique."}
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
