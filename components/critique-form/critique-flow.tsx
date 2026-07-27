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
  mockCritiqueResult,
  projectStageOptions,
  type ProjectDraft,
} from "@/lib/mock-data";

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
      setDraft(JSON.parse(saved) as ProjectDraft);
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
    setErrors([]);
  }

  function validateProjectFields() {
    const missing = requiredFields.filter((field) => !draft[field].trim());
    if (missing.length > 0) {
      setErrors(["Complete the required project fields before continuing."]);
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

  function generateMockCritique() {
    if (!validateProjectFields()) {
      setStep(2);
      return;
    }

    setIsGenerating(true);
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());
    const result = mockCritiqueResult(draft, selectedCritic);

    window.sessionStorage.setItem(`critiquer-result-${id}`, JSON.stringify(result));
    window.setTimeout(() => {
      router.push(`/critique/${id}`);
    }, 2200);
  }

  if (isGenerating) {
    return <LoadingCritique criticName={selectedCritic.displayName} />;
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="font-serif text-2xl">
            CRITIQUER
          </Link>
          <span className="text-sm uppercase tracking-normal text-muted">
            Mock critique flow
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <ol className="grid gap-2 border-y border-rule py-4">
            {[
              ["1", "Choose critic"],
              ["2", "Describe project"],
              ["3", "Set critique"],
            ].map(([number, label]) => (
              <li key={number}>
                <button
                  type="button"
                  onClick={() => setStep(Number(number))}
                  className="focus-ring flex w-full items-center gap-3 px-2 py-3 text-left"
                >
                  <span
                    className={
                      step === Number(number)
                        ? "grid h-8 w-8 place-items-center bg-ink text-paper"
                        : "grid h-8 w-8 place-items-center border border-rule text-muted"
                    }
                  >
                    {number}
                  </span>
                  <span className={step === Number(number) ? "font-semibold" : ""}>
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm leading-6 text-muted">
            This first build uses mock data only. The AI route and reference
            database start in Phase 3 and Phase 4.
          </p>
        </aside>

        <div>
          {errors.length > 0 ? (
            <div className="mb-5 border border-clay bg-white/50 p-4 text-sm text-clay">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <StepChooseCritic
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

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
              className="focus-ring border border-rule px-5 py-3 text-sm uppercase tracking-normal text-muted transition hover:border-ink hover:text-ink"
              disabled={step === 1}
            >
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={moveNext}
                className="focus-ring border border-ink bg-ink px-5 py-3 text-sm uppercase tracking-normal text-paper transition hover:bg-paper hover:text-ink"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={generateMockCritique}
                className="focus-ring border border-ink bg-ink px-5 py-3 text-sm uppercase tracking-normal text-paper transition hover:bg-paper hover:text-ink"
              >
                Generate mock critique
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StepChooseCritic({
  selectedCriticId,
  onSelect,
}: {
  selectedCriticId: string;
  onSelect: (criticId: string) => void;
}) {
  return (
    <section>
      <div className="mb-6 border-b border-rule pb-5">
        <p className="text-sm uppercase tracking-normal text-muted">Step 1</p>
        <h1 className="mt-2 font-serif text-5xl">Choose your critic</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {critics.map((critic) => (
          <CriticPreviewCard
            key={critic.id}
            critic={critic}
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
    <section>
      <div className="mb-6 border-b border-rule pb-5">
        <p className="text-sm uppercase tracking-normal text-muted">Step 2</p>
        <h1 className="mt-2 font-serif text-5xl">Describe your project</h1>
      </div>
      <div className="grid gap-5">
        <TextInput
          label="Project title"
          value={draft.title}
          required
          onChange={(value) => updateDraft("title", value)}
        />
        <TextArea
          label="One-sentence project summary"
          value={draft.oneLineSummary}
          required
          onChange={(value) => updateDraft("oneLineSummary", value)}
        />
        <TwoColumn>
          <TextArea
            label="Problem the project attempts to solve"
            value={draft.problem}
            required
            onChange={(value) => updateDraft("problem", value)}
          />
          <TextArea
            label="Core design concept"
            value={draft.concept}
            required
            onChange={(value) => updateDraft("concept", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextArea
            label="Main design strategies"
            value={draft.designStrategies}
            required
            onChange={(value) => updateDraft("designStrategies", value)}
          />
          <TextArea
            label="Current concern or question"
            value={draft.critiqueRequest}
            required
            onChange={(value) => updateDraft("critiqueRequest", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label="Site and context"
            value={draft.site}
            onChange={(value) => updateDraft("site", value)}
          />
          <TextInput
            label="Program"
            value={draft.program}
            onChange={(value) => updateDraft("program", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label="Primary users"
            value={draft.users}
            onChange={(value) => updateDraft("users", value)}
          />
          <TextInput
            label="Spatial organization"
            value={draft.spatialOrganization}
            onChange={(value) => updateDraft("spatialOrganization", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label="Circulation"
            value={draft.circulation}
            onChange={(value) => updateDraft("circulation", value)}
          />
          <TextInput
            label="Structure"
            value={draft.structure}
            onChange={(value) => updateDraft("structure", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            label="Materials"
            value={draft.materials}
            onChange={(value) => updateDraft("materials", value)}
          />
          <TextInput
            label="Environmental strategy"
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
    <section>
      <div className="mb-6 border-b border-rule pb-5">
        <p className="text-sm uppercase tracking-normal text-muted">Step 3</p>
        <h1 className="mt-2 font-serif text-5xl">Set the critique</h1>
      </div>
      <div className="grid gap-6">
        <SelectField
          label="Project stage"
          value={draft.stage}
          options={projectStageOptions}
          onChange={(value) => updateDraft("stage", value)}
        />
        <SelectField
          label="Critique focus"
          value={draft.reviewFocus}
          options={critiqueFocusOptions}
          onChange={(value) => updateDraft("reviewFocus", value)}
        />
        <RadioGroup
          label="Critique intensity"
          value={draft.intensity}
          options={intensityOptions}
          onChange={(value) => updateDraft("intensity", value)}
        />
        <RadioGroup
          label="Language"
          value={draft.language}
          options={[
            { value: "ko", label: "Korean" },
            { value: "en", label: "English" },
          ]}
          onChange={(value) => updateDraft("language", value)}
        />
      </div>
    </section>
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
    <label className="grid gap-2">
      <span className="text-sm font-semibold">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring border border-rule bg-white/45 px-4 py-3 text-base"
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
    <label className="grid gap-2">
      <span className="text-sm font-semibold">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="focus-ring min-h-32 resize-y border border-rule bg-white/45 px-4 py-3 text-base leading-7"
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
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring border border-rule bg-white/45 px-4 py-3 text-base"
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
                : "border border-rule bg-white/45 p-4"
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
