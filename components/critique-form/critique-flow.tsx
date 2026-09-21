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
import {
  generateLocalCritique,
  type LocalGenerationPhase,
} from "@/lib/ai/local-gemma";
import { getCriticProfile } from "@/lib/critics";
import { apiResponseToDisplayResult } from "@/lib/result-adapter";
import { projectSubmissionSchema } from "@/lib/validation/submission";
import type { ZodIssue } from "zod";

type GenerationStatus = {
  provider: "local" | "openai";
  phase: LocalGenerationPhase | "fallback";
  progress?: number;
};

type FieldErrors = Partial<Record<keyof ProjectDraft, string>>;

type ProjectDescription = Pick<
  ProjectDraft,
  | "title"
  | "oneLineSummary"
  | "problem"
  | "concept"
  | "designStrategies"
  | "critiqueRequest"
  | "site"
  | "program"
  | "users"
  | "spatialOrganization"
  | "circulation"
  | "structure"
  | "materials"
  | "environmentalStrategy"
>;

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
  aiMode: "local-only",
};

const sampleProjects: Record<Language, ProjectDescription> = {
  ko: {
    title: "도시의 틈, 온기 도서관",
    oneLineSummary:
      "폐업한 도심 목욕탕을 동네의 기억과 새로운 일상을 담는 작은 도서관으로 재생합니다.",
    problem:
      "오래된 주거지에는 세대가 자연스럽게 만나 머물 수 있는 실내 공공 공간이 부족하고, 폐업한 목욕탕은 동네의 기억을 간직한 채 방치되어 있습니다.",
    concept:
      "기존 목욕탕의 온도와 습도, 빛의 기억을 보존하면서 읽기와 대화가 층층이 이어지는 따뜻한 지식의 방을 만듭니다.",
    designStrategies:
      "기존 탕의 높이 차이를 열람 공간으로 활용하고, 중앙의 높은 굴뚝을 빛이 들어오는 서가로 바꾸며, 탈의실과 목욕실 사이의 문턱을 다양한 체류 공간으로 재구성합니다.",
    critiqueRequest:
      "기존 건물의 분위기를 살리려는 선택이 단순한 향수에 머물지 않는지, 열람과 대화가 공존하는 동선과 공간의 위계가 충분히 분명한지 검토받고 싶습니다.",
    site: "서울의 오래된 저층 주거지와 골목 상권 사이에 있는 1980년대 목욕탕",
    program: "도서 열람, 어린이 자료실, 주민 모임방, 작은 전시실, 카페, 기록 보관실",
    users: "인근 주민, 어린이와 보호자, 청소년, 동네를 방문하는 사람",
    spatialOrganization:
      "중앙의 빛 서가를 중심으로 조용한 열람 공간과 대화가 가능한 공용 공간을 나누어 배치합니다.",
    circulation:
      "골목에서 낮은 현관으로 진입한 뒤 기존 탈의실을 지나 중앙 서가와 여러 열람실로 퍼지는 순환 동선입니다.",
    structure:
      "기존 철근콘크리트 벽과 보를 보강하고, 새로 삽입하는 공간은 가벼운 목구조로 구분합니다.",
    materials:
      "기존 타일과 노출 콘크리트, 재사용 벽돌, 따뜻한 색의 목재와 반투명 유리를 사용합니다.",
    environmentalStrategy:
      "기존 굴뚝을 활용한 자연 환기, 천창을 통한 간접 채광, 빗물 저장과 재사용을 계획합니다.",
  },
  en: {
    title: "The Warmth Library",
    oneLineSummary:
      "An abandoned neighborhood bathhouse becomes a small library that carries local memory into everyday public life.",
    problem:
      "The aging residential district lacks an indoor public place where generations can meet and stay, while its closed bathhouse remains vacant despite holding strong local memories.",
    concept:
      "The project preserves memories of heat, humidity, and light while turning the bathhouse into a sequence of warm rooms for reading and conversation.",
    designStrategies:
      "Level changes in the former baths become reading areas, the tall central chimney becomes a daylit book tower, and thresholds between changing and bathing rooms become varied places to pause.",
    critiqueRequest:
      "I want to test whether preserving the old atmosphere goes beyond nostalgia and whether the circulation and hierarchy clearly support both quiet reading and conversation.",
    site: "A 1980s bathhouse between an old low-rise neighborhood and a narrow commercial alley in Seoul",
    program: "Reading rooms, children's library, community room, small gallery, cafe, and local archive",
    users: "Local residents, children and caregivers, teenagers, and neighborhood visitors",
    spatialOrganization:
      "A central daylit book tower separates quiet reading rooms from more social shared spaces.",
    circulation:
      "Visitors enter from the alley through a low foyer, cross the former changing room, and disperse around the central book tower.",
    structure:
      "The existing reinforced-concrete walls and beams are strengthened, while new insertions use lightweight timber construction.",
    materials:
      "Existing tile and exposed concrete are combined with reused brick, warm timber, and translucent glass.",
    environmentalStrategy:
      "The old chimney supports natural ventilation, roof lights provide indirect daylight, and rainwater is collected for reuse.",
  },
};

export function CritiqueFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraft>(emptyDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [firstInvalidField, setFirstInvalidField] = useState<keyof ProjectDraft | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("critiquer-draft");
    if (saved) {
      const parsed = JSON.parse(saved) as ProjectDraft;
      setDraft({
        ...parsed,
        language: parsed.language === "en" ? "en" : "ko",
        aiMode:
          parsed.aiMode === "local-with-openai"
            ? "local-with-openai"
            : "local-only",
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

  useEffect(() => {
    if (step !== 2 || !firstInvalidField) return;

    const frame = window.requestAnimationFrame(() => {
      const input = document.getElementById(`project-${firstInvalidField}`);
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      input?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [step, firstInvalidField]);

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
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (firstInvalidField === field) setFirstInvalidField(null);
  }

  function fillSampleProject() {
    setDraft((current) => ({ ...current, ...sampleProjects[current.language] }));
    setErrors([]);
    setFieldErrors({});
    setFirstInvalidField(null);
  }

  function validateProjectFields() {
    const result = projectSubmissionSchema.safeParse(draft);
    if (result.success) {
      setFieldErrors({});
      setFirstInvalidField(null);
      return true;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ProjectDraft;
      if (field && !nextErrors[field]) {
        nextErrors[field] = describeSubmissionIssue(issue, draft.language);
      }
    }
    setErrors([]);
    setFieldErrors(nextErrors);
    setFirstInvalidField(result.error.issues[0]?.path[0] as keyof ProjectDraft);
    return false;
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

    setGenerationStatus({ provider: "local", phase: "checking" });

    try {
      const submission = projectSubmissionSchema.parse(draft);
      const critic = getCriticProfile(submission.criticId);
      if (!critic) {
        throw new Error(
          draft.language === "ko"
            ? "선택한 교수님을 찾을 수 없습니다."
            : "The selected professor could not be found.",
        );
      }

      let apiResponse: CritiqueApiResponse;
      try {
        apiResponse = await generateLocalCritique({
          submission,
          critic,
          onStatus: (status) =>
            setGenerationStatus({ provider: "local", ...status }),
        });
      } catch (localError) {
        console.warn("[CRITIQUER_LOCAL_AI_ERROR]", localError);
        if (draft.aiMode !== "local-with-openai") {
          throw new Error(
            draft.language === "ko"
              ? "이 기기에서 크리틱을 생성하지 못했습니다. 브라우저의 WebGPU 지원과 사용 가능한 메모리를 확인한 뒤 다시 시도하세요. 외부 서비스는 사용하지 않았습니다."
              : "Could not generate a critique on this device. Check WebGPU support and available memory, then try again. The external service was not used.",
          );
        }

        setGenerationStatus({ provider: "openai", phase: "fallback" });
        apiResponse = await requestOpenAICritique(draft, draft.language);
      }
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
      setGenerationStatus(null);
    }
  }

  if (generationStatus) {
    return (
      <LoadingCritique
        criticName={selectedCritic.displayName}
        language={draft.language}
        provider={generationStatus.provider}
        phase={generationStatus.phase}
        progress={generationStatus.progress}
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
              <StepProjectDescription
                draft={draft}
                fieldErrors={fieldErrors}
                onFillSample={fillSampleProject}
                updateDraft={updateDraft}
              />
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

function describeSubmissionIssue(issue: ZodIssue, language: Language) {
  const field = issue.path[0];
  const label =
    typeof field === "string" && field in flowCopy.fields
      ? text(flowCopy.fields[field as keyof typeof flowCopy.fields], language)
      : language === "ko"
        ? "입력 내용"
        : "Input";

  if (issue.code === "too_small" && issue.type === "string") {
    return language === "ko"
      ? `${label}: ${issue.minimum}자 이상 입력해주세요.`
      : `${label}: Enter at least ${issue.minimum} characters.`;
  }

  if (issue.code === "too_big" && issue.type === "string") {
    return language === "ko"
      ? `${label}: ${issue.maximum}자 이하로 입력해주세요.`
      : `${label}: Enter no more than ${issue.maximum} characters.`;
  }

  return language === "ko"
    ? `${label}: 입력값을 확인해주세요.`
    : `${label}: Check this value.`;
}

async function requestOpenAICritique(
  draft: ProjectDraft,
  language: Language,
): Promise<CritiqueApiResponse> {
  const response = await fetch("/api/critique", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(
      body?.error?.message ||
        (language === "ko"
          ? "크리틱 생성에 실패했습니다."
          : "Failed to generate critique."),
    );
  }

  return (await response.json()) as CritiqueApiResponse;
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
  fieldErrors,
  onFillSample,
  updateDraft,
}: {
  draft: ProjectDraft;
  fieldErrors: FieldErrors;
  onFillSample: () => void;
  updateDraft: (field: keyof ProjectDraft, value: string) => void;
}) {
  return (
    <section
      data-feedback-target="critique-project-description"
      data-feedback-label="프로젝트 설명 단계"
    >
      <div className="mb-6 grid gap-3 border-b border-ink pb-5 md:grid-cols-[auto_1fr_auto] md:items-end">
        <p className="text-sm uppercase tracking-normal text-muted">
          {text(flowCopy.stepLabel, draft.language)} 2
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          {text(flowCopy.describeProject, draft.language)}
        </h1>
        <button
          type="button"
          onClick={onFillSample}
          className="focus-ring border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
        >
          {text(flowCopy.fillSample, draft.language)}
        </button>
      </div>
      <div className="grid gap-5">
        <TextInput
          field="title"
          label={text(flowCopy.fields.title, draft.language)}
          value={draft.title}
          error={fieldErrors.title}
          required
          onChange={(value) => updateDraft("title", value)}
        />
        <TextArea
          field="oneLineSummary"
          label={text(flowCopy.fields.oneLineSummary, draft.language)}
          value={draft.oneLineSummary}
          error={fieldErrors.oneLineSummary}
          required
          onChange={(value) => updateDraft("oneLineSummary", value)}
        />
        <TwoColumn>
          <TextArea
            field="problem"
            label={text(flowCopy.fields.problem, draft.language)}
            value={draft.problem}
            error={fieldErrors.problem}
            required
            onChange={(value) => updateDraft("problem", value)}
          />
          <TextArea
            field="concept"
            label={text(flowCopy.fields.concept, draft.language)}
            value={draft.concept}
            error={fieldErrors.concept}
            required
            onChange={(value) => updateDraft("concept", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextArea
            field="designStrategies"
            label={text(flowCopy.fields.designStrategies, draft.language)}
            value={draft.designStrategies}
            error={fieldErrors.designStrategies}
            required
            onChange={(value) => updateDraft("designStrategies", value)}
          />
          <TextArea
            field="critiqueRequest"
            label={text(flowCopy.fields.critiqueRequest, draft.language)}
            value={draft.critiqueRequest}
            error={fieldErrors.critiqueRequest}
            required
            onChange={(value) => updateDraft("critiqueRequest", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            field="site"
            label={text(flowCopy.fields.site, draft.language)}
            value={draft.site}
            error={fieldErrors.site}
            onChange={(value) => updateDraft("site", value)}
          />
          <TextInput
            field="program"
            label={text(flowCopy.fields.program, draft.language)}
            value={draft.program}
            error={fieldErrors.program}
            onChange={(value) => updateDraft("program", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            field="users"
            label={text(flowCopy.fields.users, draft.language)}
            value={draft.users}
            error={fieldErrors.users}
            onChange={(value) => updateDraft("users", value)}
          />
          <TextInput
            field="spatialOrganization"
            label={text(flowCopy.fields.spatialOrganization, draft.language)}
            value={draft.spatialOrganization}
            error={fieldErrors.spatialOrganization}
            onChange={(value) => updateDraft("spatialOrganization", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            field="circulation"
            label={text(flowCopy.fields.circulation, draft.language)}
            value={draft.circulation}
            error={fieldErrors.circulation}
            onChange={(value) => updateDraft("circulation", value)}
          />
          <TextInput
            field="structure"
            label={text(flowCopy.fields.structure, draft.language)}
            value={draft.structure}
            error={fieldErrors.structure}
            onChange={(value) => updateDraft("structure", value)}
          />
        </TwoColumn>
        <TwoColumn>
          <TextInput
            field="materials"
            label={text(flowCopy.fields.materials, draft.language)}
            value={draft.materials}
            error={fieldErrors.materials}
            onChange={(value) => updateDraft("materials", value)}
          />
          <TextInput
            field="environmentalStrategy"
            label={text(flowCopy.fields.environmentalStrategy, draft.language)}
            value={draft.environmentalStrategy}
            error={fieldErrors.environmentalStrategy}
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
        <RadioGroup
          label={text(flowCopy.fields.aiMode, draft.language)}
          value={draft.aiMode}
          options={[
            {
              value: "local-only",
              label: text(flowCopy.aiModes.localOnly, draft.language),
              description: text(
                flowCopy.aiModes.localOnlyDescription,
                draft.language,
              ),
            },
            {
              value: "local-with-openai",
              label: text(flowCopy.aiModes.allowOpenAI, draft.language),
              description: text(
                flowCopy.aiModes.allowOpenAIDescription,
                draft.language,
              ),
            },
          ]}
          onChange={(value) => updateDraft("aiMode", value)}
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
  field,
  label,
  value,
  error,
  required,
  onChange,
}: {
  field: keyof ProjectDraft;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const id = `project-${field}`;
  return (
    <label className={`grid gap-2 border bg-white/30 p-4 ${error ? "border-clay" : "border-rule"}`}>
      <span className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="focus-ring border-0 border-b border-ink/35 bg-transparent px-0 py-2 text-base outline-none"
      />
      {error ? <span id={`${id}-error`} className="text-sm text-clay">{error}</span> : null}
    </label>
  );
}

function TextArea({
  field,
  label,
  value,
  error,
  required,
  onChange,
}: {
  field: keyof ProjectDraft;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const id = `project-${field}`;
  return (
    <label className={`grid gap-2 border bg-white/30 p-4 ${error ? "border-clay" : "border-rule"}`}>
      <span className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-clay">*</span> : null}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={4}
        className="focus-ring min-h-32 resize-y border-0 border-b border-ink/35 bg-transparent px-0 py-2 text-base leading-7 outline-none"
      />
      {error ? <span id={`${id}-error`} className="text-sm text-clay">{error}</span> : null}
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
