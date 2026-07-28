# Sass Project Frontend

Vite + React + React Router SPA for the multi-tenant SaaS product.

## Stack

- **Vite** — bundling, dev server, env (`VITE_*`)
- **React 19** — UI (browser SPA; no Next.js / RSC)
- **React Router** — client-side routing
- **styled-components** — styling/theming (Phase 0)
- **Storybook** — component modularity and visual docs (Phase 0)

## Implementation backlog

See [`docs/next-tasks-and-subtasks.md`](./docs/next-tasks-and-subtasks.md) for the frontend task plan, phased to match the NestJS backend API.

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

Set `VITE_API_URL` to the Nest backend origin (default `http://localhost:3000`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with oxlint |
