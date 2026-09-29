# Atlas — Evidence-First Content Agent

Automates the video content research pipeline — discovery, profile
expansion, captions-first transcription, and Gemini video analysis — before
any drafting happens. Drafts always ship with receipts back to a source
post, transcript line, or Gemini video segment, and nothing publishes
without a human clicking Approve.

**Status: Phase 0 of 10 — project scaffold.**

## Before you run this

This scaffold was generated in a sandboxed environment with no network
access, so `npm install` was never run here and nothing has been compiled,
type-checked, or booted. The code is hand-written against current Next.js
14 / Prisma 5 / Tailwind 3 APIs, and I'm confident in it, but you should
verify with a real build before relying on it — see below.

## Running this locally

```bash
npm install
npx prisma migrate dev --name init   # creates prisma/dev.db and runs generate
npm run dev                          # http://localhost:3000
```

`.env` already has a working `DATABASE_URL` for local SQLite. `.env.example`
lists every var later phases will want (Gemini, Whisper/OpenAI, scrape
proxy, Redis) — none are required yet.

## Architecture

```
app/          Next.js App Router pages (one folder per top-level nav item;
              /runs/[runId]/... subpages arrive with Phase 1+)
components/
  ui/         Hand-written shadcn/ui primitives (button, card, badge, ...)
  layout/     Sidebar, app shell, the PhasePlaceholder used by stub pages
lib/          Prisma client singleton, cn() helper, nav config
types/        enums.ts (canonical string-union values + Zod schemas),
              domain.ts (normalized scraper output, receipt refs, job shape)
prisma/       schema.prisma — all 17 models from the spec
server/       Route Handlers / Server Actions (empty — see server/README.md)
workers/      Background job processing (empty — see workers/README.md)
storage/      videos/ audio/ subtitles/ transcripts/ json/ — raw artifacts
              from each Research Run, kept for debugging/re-derivation
```

## Data model

`prisma/schema.prisma` is the source of truth — read it directly for exact
fields/relations. Two things worth knowing before you read it:

- **Enums are plain `String` columns**, not Prisma's native `enum` type.
  SQLite's Prisma connector doesn't support native enums, and this schema
  needs to run on SQLite locally. The canonical value sets + Zod schemas
  live in `types/enums.ts` — validate against those at the application
  layer. Swapping to real Postgres enums later is a mechanical change if
  you want DB-level constraints once you're off SQLite.
- **`evidenceComplete` on `ResearchRun`** is the Hard Rule #1 gate: Phase 7
  (Clustering) sets it `true` once Discover → Expand → Transcribe → Video
  Analysis are all done, and Phase 8 (Drafts) must refuse to generate
  anything while it's `false`.

## Design

Dark theme, one palette: ink/paper background, warm amber (`#C99A44`)
reserved for evidenced/"receipted" states so it keeps its meaning rather
than being decoration. IBM Plex Sans for UI text; IBM Plex Mono is wired up
but not yet visible anywhere — it's reserved for timestamp/ID display once
Phase 4+ pages have real data to show.

## Roadmap

- [x] **Phase 0** — scaffold, schema, types, shell, navigation
- [ ] **Phase 1** — Research Runs, Dashboard, state machine
- [ ] **Phase 2** — Discovery (`/runs/[runId]/discovery`)
- [ ] **Phase 3** — Expansion/Winners (`/runs/[runId]/winners`)
- [ ] **Phase 4** — Transcripts, captions-first fallback chain
- [ ] **Phase 5** — Gemini Video Analysis
- [ ] **Phase 6** — Knowledge Base
- [ ] **Phase 7** — Clustering & Angles (sets `evidenceComplete = true`)
- [ ] **Phase 8** — Draft Batch with Receipts (blocked until Phase 7)
- [ ] **Phase 9** — Approvals, Rule Accumulation, Library
- [ ] **Phase 10** — Scheduler, Run Logs, error handling/retries, polish
