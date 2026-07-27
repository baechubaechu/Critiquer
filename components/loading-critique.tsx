import { loadingCopy, text, type Language } from "@/lib/i18n";

export function LoadingCritique({
  criticName,
  language,
}: {
  criticName: string;
  language: Language;
}) {
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
            gpt-5.6-luna
          </div>
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
