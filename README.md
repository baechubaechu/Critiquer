# CRITIQUER

CRITIQUER is an architectural critique web MVP for architecture students.

The first implementation covers Phase 1 and Phase 2 from the development brief:

- Next.js, TypeScript, App Router, and Tailwind CSS setup
- Editorial landing page
- Multi-step critique input flow
- Critic selection interface
- Project submission form
- Critique settings step
- AI loading state
- AI result page
- Session-local draft and result persistence

AI generation now starts with a Phase 4-1 one-call OpenAI Responses API route.
Reference recommendations are still deterministic and local, so the app can
avoid a second API call during early development.

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
- `app/api/critique/route.ts`

## API Setup

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6-luna
```

The API key is only read inside the Next.js server route. It is not exposed to
the browser.

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

## Editing Text

Most Korean and English UI copy is centralized in `lib/i18n.ts`.
Critique lens cards and fallback sample results live in `lib/mock-data.ts`.

For a beginner-friendly Korean guide, see:

```text
docs/text-editing-guide.md
```

## Current Architecture

The app is organized around the MVP user journey:

- `app/page.tsx` renders the landing page.
- `app/critique/page.tsx` renders the multi-step critique form.
- `app/critique/[id]/page.tsx` renders a stored mock result.
- `app/api/critique/route.ts` validates submissions and calls OpenAI from the
  server.
- `components/` contains reusable UI surfaces for critics, loading, form flow,
  and result display.
- `lib/mock-data.ts` holds temporary critic summaries and mock critique output.

The mock data layer is still used for UI summaries and fallback display data.
The production critique path now uses typed critic profiles, validation schemas,
reference seed data, and a server AI route.
