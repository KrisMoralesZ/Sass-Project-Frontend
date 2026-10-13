# AGENTS.md (sass-frontend)

Guidance for AI agents working in the SPA. Root-level repo guidance lives in
`../AGENTS.md`; this file adds frontend-specific detail. Keep both accurate.

## What this is

Vite + React 19 browser SPA. **Not** Next.js — no RSC/server components, no other router,
no CSS Modules/Tailwind. Styling is styled-components only. Sibling API: `../sass-backend`.

## Locked stack

| Layer                | Choice                                                  |
| -------------------- | ------------------------------------------------------- |
| Bundler              | Vite (`VITE_*` env), dev server :5173                   |
| UI runtime           | React SPA                                               |
| Routing              | React Router (`src/routes/`)                            |
| Styling              | styled-components, theme via `AppThemeProvider`         |
| Server state         | TanStack Query (app wrapped in `AppQueryProvider`)      |
| HTTP                 | axios through `apiClient` (never raw axios/fetch in UI) |
| Component docs/tests | Storybook + `@storybook/addon-vitest`                   |

## Commands (run here, `workdir: sass-frontend`)

- Dev: `npm run dev` (:5173) · Storybook: `npm run storybook` (:6006)
- Build: `npm run build` (runs `tsc -b` first — run for type errors)
- Lint: `npm run lint` (oxlint) · Lint fix: `npm run lint:fix`
- Format: `npm run format` / `npm run format:check` (Prettier, no semicolons)
- Unit tests: `npm run test:unit:run` · Storybook tests: `npm run test:storybook:run`

## Conventions

- Structure: `src/{components,features,pages,routes,lib,hooks,styles,types}`.
  Domain code lives in `features/<domain>/{api,hooks,components}`. Import via `@/` alias.
- Components are typed `FC` with an exported `I<ComponentName>` props interface and a single
  default export at the end of the file. Barrels re-export by name.
- Styles are colocated in `<Component>.sc.tsx` with `$`-prefixed transient props.
- All API calls go through `apiClient` (`@/lib`); the response envelope is unwrapped to `data`.
  Feature API helpers: `features/<domain>/api/*.ts` — thin functions + `queryOptions`.
  Follow `docs/api-client-v1.md`; surface failures with `getApiErrorMessage` / feature error mappers.
- Mirror backend DTOs/error shapes exactly (`src/types/error-code.ts` ↔ backend `error-code.enum.ts`).
- Tenant scope: `X-Organization-Id` is attached by the client once an active org is set
  (`active-organization-storage.ts`). Never fetch workspace data without one.
- UI permission checks (`usePermission`, `hasMinRole`) are convenience only — backend enforces.
- Storybook stories are required for shared/visual components and pages: cover states,
  variants, loading/empty/error. Route pages mirror `pages/*.stories.tsx` patterns.
- Env vars must be `VITE_`-prefixed. `VITE_API_URL` is the origin only; `/api/v1` is appended.
- 401 → refresh → retry once is handled by the response interceptor; refresh failure clears the
  session (`SessionExpiredRecovery`). Do not add parallel auth plumbing.

## API contract reminders

- Base `{VITE_API_URL}/api/v1`; auth `Authorization: Bearer <accessToken>`; refresh via JSON
  `{ refreshToken }`. Success `{ success: true, data, meta }`; error
  `{ success: false, error: { code, statusCode, message }, meta }`; pagination
  `{ items, pagination: { page, limit, total, ... } }`.
- Local QA seed users: `owner@acme.local` / `Password1` (see `../sass-backend/docs/database-seeds.md`).

## Where we are (backlog)

See `docs/next-tasks-and-subtasks.md`. Phases 0–3.3 and **3.4 (invites incl. accept route)** are done.
Next: **Task 3.5 — Member management UI** (role change / remove member), taken
**alongside** `../sass-backend` backend task 3.4.
