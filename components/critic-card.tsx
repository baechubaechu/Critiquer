import clsx from "clsx";
import type { CriticSummary } from "@/lib/mock-data";

type CriticPreviewCardProps = {
  critic: CriticSummary;
  selected?: boolean;
  onSelect?: (criticId: string) => void;
};

export function CriticPreviewCard({
  critic,
  selected = false,
  onSelect,
}: CriticPreviewCardProps) {
  const interactive = Boolean(onSelect);

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div
          className={clsx(
            "grid h-16 w-16 shrink-0 place-items-center border text-xl font-serif",
            selected ? "border-ink bg-ink text-paper" : "border-rule bg-paper",
          )}
          aria-hidden="true"
        >
          {critic.initials}
        </div>
        <span className="text-right text-xs uppercase tracking-normal text-muted">
          {critic.lens}
        </span>
      </div>
      <h3 className="mt-8 font-serif text-2xl leading-tight">
        {critic.displayName}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{critic.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {critic.themes.map((theme) => (
          <span
            key={theme}
            className="border border-rule px-2 py-1 text-xs text-muted"
          >
            {theme}
          </span>
        ))}
      </div>
      <p className="mt-6 border-t border-rule pt-4 text-sm leading-6">
        {critic.examines}
      </p>
    </>
  );

  if (!interactive) {
    return <article className="border border-rule bg-paper p-5">{content}</article>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(critic.id)}
      className={clsx(
        "focus-ring h-full border bg-paper p-5 text-left transition",
        selected
          ? "border-ink shadow-[inset_0_0_0_2px_#181715]"
          : "border-rule hover:border-ink",
      )}
      aria-pressed={selected}
    >
      {content}
    </button>
  );
}
