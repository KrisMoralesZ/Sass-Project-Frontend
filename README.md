# Sass Project Frontend

Vite + React + React Router SPA for the multi-tenant SaaS product.

## Stack

- **Vite** — bundling, dev server, env (`VITE_*`)
- **React 19** — UI (browser SPA; no Next.js / RSC)
- **React Router** — client-side routing
- **styled-components** — styling/theming
- **Storybook** — component modularity and visual docs (Phase 0.2)
- **oxlint** — linting
- **Prettier** — formatting

## Implementation backlog

See [`docs/next-tasks-and-subtasks.md`](./docs/next-tasks-and-subtasks.md) for the frontend task plan, phased to match the NestJS backend API.

## Getting started

Requires Node matching [`.nvmrc`](./.nvmrc) (same major as the backend).

```bash
# From repo root sibling setup:
#   Sass-Project/sass-backend  -> http://localhost:3000
#   Sass-Project/sass-frontend -> http://localhost:5173

cp .env.example .env
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

Set `VITE_API_URL` to the Nest backend origin (default `http://localhost:3000`). Use the origin only — the app appends `/api/v1` via `getApiUrl()` in `src/lib/env.ts`.

## Source layout

See [`src/README.md`](./src/README.md) for the folder conventions (`components/`, `features/`, `pages/`, `routes/`, `lib/`, …).

## Lint and format

| Tool         | Role                                                            |
| ------------ | --------------------------------------------------------------- |
| **oxlint**   | Static analysis (React hooks, TypeScript, correctness)          |
| **Prettier** | Code formatting (single quotes, no semicolons, trailing commas) |

```bash
npm run lint          # oxlint
npm run lint:fix     # oxlint --fix
npm run format        # prettier --write
npm run format:check  # prettier --check (also runs in CI)
```

Editor defaults live in [`.vscode/settings.json`](./.vscode/settings.json) (format on save via Prettier).

## Storybook

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build under storybook-static/
```

Stories use `AppThemeProvider` (theme + global styles) via `.storybook/preview.tsx`.

## Scripts

| Script                    | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start Vite dev server                    |
| `npm run build`           | Typecheck + production build             |
| `npm run preview`         | Preview production build                 |
| `npm run storybook`       | Start Storybook                          |
| `npm run build-storybook` | Build static Storybook                   |
| `npm run lint`            | Lint with oxlint                         |
| `npm run lint:fix`        | Auto-fix oxlint issues where possible    |
| `npm run format`          | Format the repo with Prettier            |
| `npm run format:check`    | Fail if files are not Prettier-formatted |
