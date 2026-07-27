import Link from "next/link";
import { critics } from "@/lib/mock-data";
import { CriticPreviewCard } from "@/components/critic-card";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="architectural-grid border-b border-rule">
        <div className="mx-auto grid min-h-[84vh] max-w-7xl grid-rows-[auto_1fr] px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b border-ink/70 pb-4">
            <Link href="/" className="font-serif text-2xl tracking-normal">
              CRITIQUER
            </Link>
            <Link
              href="/critique"
              className="focus-ring border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper"
            >
              Begin
            </Link>
          </header>

          <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-5 max-w-xl border-l border-ink pl-4 text-sm uppercase tracking-normal text-muted">
                Evidence-informed architectural critique
              </p>
              <h1 className="max-w-5xl font-serif text-6xl leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                See your project through another architectural mind.
              </h1>
            </div>
            <div className="border-t border-ink pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xl leading-8 text-ink">
                Describe your project, select a critical lens, and receive a
                speculative studio-style critique grounded in documented
                architectural principles.
              </p>
              <p className="mt-5 text-sm leading-6 text-muted">
                CRITIQUER does not impersonate real architects or critics. It
                uses structured interpretations of their writings, projects, and
                design priorities as analytical lenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-5 border-b border-rule pb-8 md:grid-cols-[0.45fr_1fr]">
          <h2 className="font-serif text-3xl">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Choose a critic", "Select one architectural lens."],
              ["02", "Describe the project", "Name intent, strategy, and doubt."],
              ["03", "Read the tension", "Study critique points and references."],
            ].map(([number, title, body]) => (
              <article key={number} className="border-t border-ink pt-4">
                <span className="text-sm text-muted">{number}</span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-normal text-muted">
              Critical lenses
            </p>
            <h2 className="mt-2 font-serif text-4xl">Five starting voices</h2>
          </div>
          <Link
            href="/critique"
            className="focus-ring hidden border border-ink px-4 py-2 text-sm uppercase tracking-normal transition hover:bg-ink hover:text-paper sm:inline-flex"
          >
            Start critique
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {critics.map((critic) => (
            <CriticPreviewCard key={critic.id} critic={critic} />
          ))}
        </div>
      </section>
    </main>
  );
}
