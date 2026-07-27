import clsx from "clsx";
import type { CriticSummary } from "@/lib/mock-data";
import { text, type Language } from "@/lib/i18n";

type CriticPreviewCardProps = {
  critic: CriticSummary;
  language?: Language;
  selected?: boolean;
  onSelect?: (criticId: string) => void;
};

export function CriticPreviewCard({
  critic,
  language = "ko",
  selected = false,
  onSelect,
}: CriticPreviewCardProps) {
  const interactive = Boolean(onSelect);

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div
          className={clsx(
            "grid h-14 w-14 shrink-0 place-items-center border text-lg font-serif transition",
            selected ? "border-ink bg-ink text-paper" : "border-ink/20 bg-white/45",
          )}
          aria-hidden="true"
        >
          {critic.initials}
        </div>
        <span className="max-w-24 text-right text-xs uppercase tracking-normal text-muted">
          {text(critic.lens, language)}
        </span>
      </div>
      <h3 className="mt-6 font-serif text-2xl leading-tight">
        {critic.displayName}
      </h3>
      <p className="mt-3 min-h-24 text-sm leading-6 text-muted">
        {text(critic.summary, language)}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {critic.themes[language].map((theme) => (
          <span
            key={theme}
            className="border border-ink/15 bg-white/35 px-2 py-1 text-xs text-muted"
          >
            {theme}
          </span>
        ))}
      </div>
      <p className="mt-5 border-t border-rule pt-4 text-sm leading-6">
        {text(critic.examines, language)}
      </p>
    </>
  );

  if (!interactive) {
    return <article className="h-full border border-rule bg-white/35 p-5">{content}</article>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(critic.id)}
      className={clsx(
        "focus-ring h-full border p-5 text-left transition",
        selected
          ? "border-ink bg-white shadow-[inset_0_0_0_2px_#181715]"
          : "border-rule bg-white/35 hover:border-ink hover:bg-white/70",
      )}
      aria-pressed={selected}
    >
      {content}
    </button>
  );
}
