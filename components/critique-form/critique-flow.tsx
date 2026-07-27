"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CriticPreviewCard } from "@/components/critic-card";
import { LoadingCritique } from "@/components/loading-critique";
import {
  critiqueFocusOptions,
  critics,
  intensityOptions,
  projectStageOptions,
  type ProjectDraft,
} from "@/lib/mock-data";
import { flowCopy, languageNames, text, type Language } from "@/lib/i18n";
import type { CritiqueApiResponse } from "@/lib/ai/schemas";
import { apiResponseToDisplayResult } from "@/lib/result-adapter";

const emptyDraft: ProjectDraft = {
  criticId: "peter-zumthor",
  title: "",
  oneLineSummary: "",
  problem: "",
  concept: "",
  designStrategies: "",
  critiqueRequest: "",
  site: "",
  program: "",
  users: "",
  spatialOrganization: "",
  circulation: "",
  structure: "",
  materials: "",
  environmentalStrategy: "",
  stage: "concept",
  reviewFocus: "comprehensive",
  intensity: "constructive",
  language: "ko",
};

const requiredFields: Array<keyof ProjectDraft> = [
  "title",
  "oneLineSummary",
  "problem",
  "concept",
  "designStrategies",
  "critiqueRequest",
];

export function CritiqueFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("critiquer-draft");
    if (saved) {
      const parsed = JSON.parse(saved) as ProjectDraft;
      setDraft({
        ...parsed,
        language: parsed.language === "en" ? "en" : "ko",
      });
      return;
    }

    const savedLanguage = window.sessionStorage.getItem("critiquer-language");
    if (savedLanguage === "ko" || savedLanguage === "en") {
      setDraft((current) => ({ ...current, language: savedLanguage }));
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("critiquer-draft", JSON.stringify(draft));
  }, [draft]);

  const selectedCritic = useMemo(
    () => critics.find((critic) => critic.id === draft.criticId) ?? critics[0],
    [draft.criticId],
  );

  function updateDraft(field: keyof ProjectDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (field === "language" && (value === "ko" || value === "en")) {
      window.sessionStorage.setItem("critiquer-language", value);
    }
    setErrors([]);
  }

  function validateProjectFields() {
    const missing = requiredFields.filter((field) => !draft[field].trim());
    if (missing.length > 0) {
      setErrors([text(flowCopy.requiredError, draft.language)]);
      return false;
    }

    return true;
  }

  function moveNext() {
    if (step === 2 && !validateProjectFields()) {
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  async function generateCritique() {
    if (!validateProjectFields()) {
      setStep(2);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/critique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(
          body?.error?.message ||
            (draft.language === "ko"
              ? "크리틱 생성에 실패했습니다."
              : "Failed to generate critique."),
        );
      }

      const apiResponse = (await response.json()) as CritiqueApiResponse;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());
      const result = apiResponseToDisplayResult({
        apiResponse,
        draft,
        criticName: selectedCritic.displayName,
      });

      window.sessionStorage.setItem(
        `critiquer-result-${id}`,
        JSON.stringify(result),
      );
      router.push(`/critique/${id}`);
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : draft.language === "ko"
            ? "알 수 없는 오류가 발생했습니다."
            : "An unknown error occurred.",
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  if (isGenerating) {
    return (
      <LoadingCritique
        criticName={selectedCritic.displayName}
        language={draft.language}
      />
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header
        data-feedback-target="critique-header"
        data-feedback-label="크리틱 작성 페이지 상단"
        className="border-b border-ink bg-paper/95"
      >
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8 lg:px-10">
          <Link href="/" className="font-serif text-3xl">
            CRITIQUER
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle
              language={draft.language}
              onChange={(language) => updateDraft("language", language)}
            />
            <span className="hidden text-sm uppercase tracking-normal text-muted sm:inline">
              {text(flowCopy.mockFlow, draft.language)}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[340px_1fr] lg:px-10">
        <aside
          data-feedback-target="critique-progress"
          data-feedback-label="진행 단계와 선택 정보"
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <div className="border border-ink bg-ink p-5 text-paper sheet-shadow">
            <p className="text-xs uppercase tracking-normal text-paper/55">
              {draft.language === "ko" ? "리뷰 설정" : "Review Setup"}
            </p>
            <h1 className="mt-4 font-serif text-3xl leading-tight">
              {step === 1
                ? text(flowCopy.chooseCritic, draft.language)
                : step === 2
                  ? text(flowCopy.describeProject, draft.language)
                  : text(flowCopy.setCritique, draft.language)}
            </h1>
            <p className="mt-4 text-sm leading-6 text-paper/68">
              {text(flowCopy.phaseNote, draft.language)}
            </p>
          </div>

          <ol className="mt-4 grid gap-2 border-y border-rule py-4">
            {flowCopy.steps.map((label, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setStep(index + 1)}
                  className="focus-ring grid w-full grid-cols-[40px_1fr] items-center gap-3 border border-transparent px-2 py-3 text-left transition hover:border-rule hover:bg-white/40"
                >
                  <span
                    className={
                      step === index + 1
                        ? "grid h-9 w-9 place-items-center bg-ink text-paper"
                        : "grid h-9 w-9 place-items-center border border-rule text-muted"
                    }
                  >
                    {index + 1}
                  </span>
                  <span className={step === index + 1 ? "font-semibold" : ""}>
                    {text(label, draft.language)}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-4 border border-rule bg-white/35 p-5">
            <p className="text-xs uppercase tracking-normal text-muted">
              {draft.language === "ko"
                ? "선택한 교수님"
                : "Selected Professor"}
            </p>
            <h2 className="mt-3 font-serif text-2xl">
              {selectedCritic.displayName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {text(selectedCritic.summary, draft.language)}
            </p>
          </div>
        </aside>

        <div
          data-feedback-target="critique-form"
          data-feedback-label="크리틱 입력 영역"
          className="border border-ink bg-paper sheet-shadow"
        >
          {errors.length > 0 ? (
            <div className="border-b border-clay bg-white/70 p-4 text-sm text-clay">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          <div className="p-5 sm:p-8">
            {step === 1 ? (
              <StepChooseCritic
                language={draft.language}
                selectedCriticId={draft.criticId}
                onSelect={(criticId) => updateDraft("criticId", criticId)}
              />
            ) : null}

            {step === 2 ? (
              <StepProjectDescription draft={draft} updateDraft={updateDraft} />
            ) : null}

            {step === 3 ? (
              <StepCritiqueSettings draft={draft} updateDraft={updateDraft} />
            ) : null}
          </div>

          <div
            data-feedback-target="critique-actions"
            data-feedback-label="이전 및 다음 버튼"
            className="flex flex-col-reverse gap-3 border-t border-ink bg-white/35 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
              className="focus-ring border border-rule px-5 py-3 text-sm uppercase tracking-normal text-muted transition hover:border-ink hover:bg-paper hover:text-ink"
              disabled={step === 1}
            >
              {text(flowCopy.back, draft.language)}
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={moveNext}
                className="focus-ring border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-normal text-paper transition hover:bg-paper hover:text-ink"
              >
                {text(flowCopy.continue, draft.language)}
              </button>
            ) : (
              <button
                type="button"
                onClick={generateCritique}
                className="focus-ring border border-ink bg-ink px-6 py-3 text-sm uppercase tracking-normal text-paper transition hover:bg-paper hover:text-ink"
              >
                {text(flowCopy.generate, draft.language)}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StepChooseCritic({
  language,
  selectedCriticId,
  onSelect,
}: {
  language: Language;
  selectedCriticId: string;
  onSelect: (criticId: string) => void;
}) {
  return (
    <section
      data-feedback-target="critique-professor-selection"
      data-feedback-label="교수 선택 단계"
    >
      <div className="mb-6 grid gap-3 border-b border-ink pb-5 md:grid-cols-[auto_1fr] md:items-end">
        <p className="text-sm uppercase tracking-normal text-muted">
          {text(flowCopy.stepLabel, language)} 1
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          {text(flowCopy.chooseCritic, language)}
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {critics.map((critic) => (
          <CriticPreviewCard
            key={critic.id}
            critic={critic}
            language={language}
            selected={selectedCriticId === critic.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

function StepProjectDescription({
  draft,
  updateDraft,
}: {
  draft: ProjectDraft;
  updateDraft: (field: keyof ProjectDraft, value: string) => void;
}) {
  return (
    <section
      data-feedback-target="critique-project-description"
      data-feedback-label="프로젝트 설명 단계"
    >
      <div className="mb-6 grid gap-3 border-b border-ink pb-5 md:grid-cols-[auto_1fr] md:items-end">
        <p className="text-sm uppercase tracking-normal text-muted">
          {text(flowCopy.stepLabel, draft.language)} 2
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          {text(flowCopy.describeProject, draft.language)}
        </h1>
      </div>
      <div className="grid gap-5">
        <TextInput
          label={text(flowCopy.fields.title, draft.language)}
          value={draft.title}
          required
          onChange={(value) => updateDraft("title", value)}
        />
        <TextArea
          label={text(flowCopy.fields.oneLineSummary, draft.language)}
          value={draft.oneLineSummary}
          required
          onChange={(value) => updateDraft("oneLineSummary", value)}
        />
        <TwoColumn>
          <TextArea
            label={text(flowCopy.fields.problem, draft.language)}
            value={draft.problem}
            required
            onChange={(value) => updateDraft("problem", value)}
          />
          <TextArea
            label={text(flowCopy.fields.concept, draft.language)}
            value={draft.concept}
            required
            onChange={(value) => updateDraft("concept", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextArea
            label={text(flowCopy.fields.designStrategies, draft.language)}
            value={draft.designStrategies}
            required
            onChange={(value) => updateDraft("designStrategies", value)}
          />
          <TextArea
            label={text(flowCopy.fields.critiqueRequest, draft.language)}
            value={draft.critiqueRequest}
            required
            onChange={(value) => updateDraft("critiqueRequest", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label={text(flowCopy.fields.site, draft.language)}
            value={draft.site}
            onChange={(value) => updateDraft("site", value)}
          />
          <TextInput
            label={text(flowCopy.fields.program, draft.language)}
            value={draft.program}
            onChange={(value) => updateDraft("program", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label={text(flowCopy.fields.users, draft.language)}
            value={draft.users}
            onChange={(value) => updateDraft("users", value)}
          />
          <TextInput
            label={text(flowCopy.fields.spatialOrganization, draft.language)}
            value={draft.spatialOrganization}
            onChange={(value) => updateDraft("spatialOrganization", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label={text(flowCopy.fields.circulation, draft.language)}
            value={draft.circulation}
            onChange={(value) => updateDraft("circulation", value)}
          />
          <TextInput
            label={text(flowCopy.fields.structure, draft.language)}
            value={draft.structure}
            onChange={(value) => updateDraft("structure", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label={text(flowCopy.fields.materials, draft.language)}
            value={draft.materials}
            onChange={(value) => updateDraft("materials", value)}
          />
          <TextInput
            label={text(flowCopy.fields.environmentalStrategy, draft.language)}
            value={draft.environmentalStrategy}
            onChange={(value) => updateDraft("environmentalStrategy", value)}
          />
        </TwoColumn>
      </div>
    </section>
  );
}

function StepCritiqueSettings({
  draft,
  updateDraft,
}: {
  draft: ProjectDraft;
  updateDraft: (field: keyof ProjectDraft, value: string) => void;
}) {
  return (
    <section
      data-feedback-target="critique-settings"
      data-feedback-label="크리틱 설정 단계"
    >
      <div className="mb-6 grid gap-3 border-b border-ink pb-5 md:grid-cols-[auto_1fr] md:items-end">
        <p className="text-sm uppercase tracking-normal text-muted">
          {text(flowCopy.stepLabel, draft.language)} 3
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          {text(flowCopy.setCritique, draft.language)}
        </h1>
      </div>
      <div className="grid gap-6">
        <SelectField
          label={text(flowCopy.fields.stage, draft.language)}
          value={draft.stage}
          options={projectStageOptions.map((option) => ({
            value: option.value,
            label: text(option.label, draft.language),
          }))}
          onChange={(value) => updateDraft("stage", value)}
        />
        <SelectField
          label={text(flowCopy.fields.reviewFocus, draft.language)}
          value={draft.reviewFocus}
          options={critiqueFocusOptions.map((option) => ({
            value: option.value,
            label: text(option.label, draft.language),
          }))}
          onChange={(value) => updateDraft("reviewFocus", value)}
        />
        <RadioGroup
          label={text(flowCopy.fields.intensity, draft.language)}
          value={draft.intensity}
          options={intensityOptions.map((option) => ({
            value: option.value,
            label: text(option.label, draft.language),
            description: text(option.description, draft.language),
          }))}
          onChange={(value) => updateDraft("intensity", value)}
        />
        <RadioGroup
          label={text(flowCopy.fields.language, draft.language)}
          value={draft.language}
          options={[
            { value: "ko", label: languageNames.ko },
            { value: "en", label: languageNames.en },
          ]}
          onChange={(value) => updateDraft("language", value)}
        />
      </div>
    </section>
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

function TwoColumn({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function TextInput({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 border border-rule bg-white/30 p-4">
      <span className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring border-0 border-b border-ink/35 bg-transparent px-0 py-2 text-base outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 border border-rule bg-white/30 p-4">
      <span className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="focus-ring min-h-32 resize-y border-0 border-b border-ink/35 bg-transparent px-0 py-2 text-base leading-7 outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 border border-rule bg-white/30 p-4">
      <span className="text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring border border-ink/30 bg-paper px-4 py-3 text-base"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RadioGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string; description?: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={
              value === option.value
                ? "border border-ink bg-ink p-4 text-paper"
                : "border border-rule bg-white/35 p-4 transition hover:border-ink"
            }
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
              className="sr-only"
            />
            <span className="block font-semibold">{option.label}</span>
            {option.description ? (
              <span className="mt-2 block text-sm opacity-75">
                {option.description}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
