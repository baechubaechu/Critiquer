import { loadingCopy, text, type Language } from "@/lib/i18n";
import { LOCAL_MODEL_NAME, type LocalGenerationPhase } from "@/lib/ai/local-gemma";

export function LoadingCritique({
  criticName,
  language,
  provider,
  phase,
  progress,
}: {
  criticName: string;
  language: Language;
  provider: "local" | "openai";
  phase: LocalGenerationPhase | "fallback";
  progress?: number;
}) {
  const status = getStatusText({ language, provider, phase });

  return (
    <main className="review-noise grid min-h-screen place-items-center bg-paper px-5 text-ink">
      <section className="w-full max-w-4xl border border-ink bg-paper p-5 sheet-shadow sm:p-8">
        <div className="grid gap-6 border-b border-ink pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">
              {text(loadingCopy.label, language)}
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
              {loadingCopy.headline[language](criticName)}
            </h1>
          </div>
          <div className="border border-rule bg-white/35 px-4 py-3 text-sm text-muted">
            {provider === "local" ? LOCAL_MODEL_NAME : language === "ko" ? "외부 서비스" : "External service"}
          </div>
        </div>
        <div className="mt-6" aria-live="polite">
          <div className="flex items-center justify-between gap-4 text-sm">
            <strong>{status}</strong>
            {phase === "downloading" && progress !== undefined ? (
              <span className="tabular-nums text-muted">{progress}%</span>
            ) : null}
          </div>
          <div className="mt-3 h-2 overflow-hidden border border-ink bg-white/35">
            <div
              className="h-full bg-ink transition-[width] duration-300"
              style={{ width: `${progress ?? progressForPhase(phase)}%` }}
            />
          </div>
          {phase === "downloading" ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              {language === "ko"
                ? "첫 실행에서는 약 3GB 모델을 받습니다. 완료되면 이 사이트의 전용 저장소에 보관합니다."
                : "The first run downloads a model of about 3GB and keeps it in this site's dedicated storage."}
            </p>
          ) : null}
        </div>
        <div className="mt-8 grid gap-3">
          {loadingCopy.stages[language].map((stage, index) => (
            <div key={stage} className="grid grid-cols-[40px_1fr] items-center gap-4">
              <span className="grid h-9 w-9 place-items-center border border-ink text-sm text-muted">
                {index + 1}
              </span>
              <div className="border-b border-rule pb-3 text-sm text-muted">
                {stage}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function progressForPhase(phase: LocalGenerationPhase | "fallback") {
  if (phase === "checking") return 5;
  if (phase === "loading") return 82;
  if (phase === "fallback") return 88;
  return 92;
}

function getStatusText({
  language,
  provider,
  phase,
}: {
  language: Language;
  provider: "local" | "openai";
  phase: LocalGenerationPhase | "fallback";
}) {
  if (language === "en") {
    if (phase === "checking") return "Checking this device";
    if (phase === "downloading") return "Downloading the local model";
    if (phase === "loading") return "Loading the model into your browser";
    if (phase === "fallback") return "Switching to the external service";
    return provider === "local"
      ? "Generating the critique on this device"
      : "Generating the critique with the external service";
  }

  if (phase === "checking") return "이 기기의 실행 환경을 확인하고 있습니다";
  if (phase === "downloading") return "로컬 모델을 다운로드하고 있습니다";
  if (phase === "loading") return "브라우저에 모델을 불러오고 있습니다";
  if (phase === "fallback") return "이 기기에서 실행하기 어려워 외부 서비스로 전환합니다";
  return provider === "local"
    ? "이 기기에서 크리틱을 생성하고 있습니다"
    : "외부 서비스에서 크리틱을 생성하고 있습니다";
}
