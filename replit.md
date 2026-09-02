# Nova International University

Nova's governed certificate-learning platform for academic production, learner progress, assessment, certificates, transcripts, and public credential verification.

## Run & Operate

- `pnpm --filter @workspace/niu-platform run dev` — run the web preview
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `PORT=18353 BASE_PATH=/ pnpm --filter @workspace/niu-platform run build` — production web build
- `pnpm run test:academic` — relationship invariant check for the local academic model
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required for the scaffold API: `DATABASE_URL` — Postgres connection string
- Optional browser configuration: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/niu-platform/src/App.tsx` — public catalogue, learner dashboard, transcript, verification, and the 12-stage Academic Production Studio
- `artifacts/niu-platform/src/lib/platform.ts` — typed academic relationships and reload-safe local preview store
- `artifacts/niu-platform/src/index.css` — NIU visual language and responsive layout
- `artifacts/api-server/src/routes/` — shared API route boundary
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `vercel.json` — static Vercel build and SPA rewrite configuration

## Architecture decisions

- The Academic Production Studio is ordered from programme information through publication and certificates; each stage operates on the same generated UUID relationships.
- The browser preview persists locally but is explicitly labelled as non-authoritative. Supabase authorization is required before live authentication, RLS, storage, grading, publication, or certificate issuance.
- Readiness checks are shared across Review and Publication so the UI does not show a publish state that differs from its governance gates.
- Learner completion and certificate eligibility are described as server-authoritative boundaries; no answer keys or private learning files are exposed in learner routes.

## Product

The app presents published certificate programmes, supports learner enrolment and progress previews, produces a printable transcript, verifies certificate identifiers publicly, and provides administrators with a continuous production flow for curriculum structure, learning content, assessments, question mapping, grading, review, pricing, publication, and certificate templates.

## User preferences

- Do not represent local preview state as authoritative academic data.

## Gotchas

- The Vite config defaults to port 5173 and `/` for Vercel, while the managed Replit workflow injects its own `PORT` and `BASE_PATH`.
- Supabase was not authorized in the current workspace, so no production records, storage buckets, RLS policies, or auth settings were changed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
