# CRITIQUER

CRITIQUER is an architectural critique web MVP for architecture students.

The first implementation covers Phase 1 and Phase 2 from the development brief:

- Next.js, TypeScript, App Router, and Tailwind CSS setup
- Editorial landing page
- Multi-step critique input flow
- Critic selection interface
- Project submission form
- Critique settings step
- Mock loading state
- Mock result page
- Session-local draft and result persistence

AI generation and retrieval logic are intentionally left for the next phases.
Zod schemas, critic profile files, source types, and a small reference seed set
now exist as Phase 3 groundwork.

## AI Model Plan

Development should default to:

```text
gpt-5.6-luna
```

This keeps early API testing cheaper. Higher-quality review modes can later test
`gpt-5.6-terra` or `gpt-5.6-sol` after the core flow is working.

The model name is prepared in:

- `.env.example`
- `lib/ai/config.ts`

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Current Architecture

The app is organized around the MVP user journey:

- `app/page.tsx` renders the landing page.
- `app/critique/page.tsx` renders the multi-step critique form.
- `app/critique/[id]/page.tsx` renders a stored mock result.
- `components/` contains reusable UI surfaces for critics, loading, form flow,
  and result display.
- `lib/mock-data.ts` holds temporary critic summaries and mock critique output.

The mock data layer is deliberately isolated so it can be replaced by typed
critic profiles, validation schemas, reference data, and server AI routes.
