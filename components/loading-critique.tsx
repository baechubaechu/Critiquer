import { loadingCopy, text, type Language } from "@/lib/i18n";

export function LoadingCritique({
  criticName,
  language,
}: {
  criticName: string;
  language: Language;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-ink">
      <section className="w-full max-w-3xl border-y border-ink py-10">
        <p className="text-sm uppercase tracking-normal text-muted">
          {text(loadingCopy.label, language)}
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-tight">
          {loadingCopy.headline[language](criticName)}
        </h1>
        <div className="mt-10 grid gap-3">
          {loadingCopy.stages[language].map((stage, index) => (
            <div key={stage} className="flex items-center gap-4">
              <span className="grid h-8 w-8 place-items-center border border-rule text-sm text-muted">
                {index + 1}
              </span>
              <div className="h-px flex-1 bg-rule" />
              <span className="w-64 text-sm text-muted">{stage}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
