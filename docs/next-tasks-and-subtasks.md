# Next implementation backlog for sass-frontend

This document captures the next tasks and subtasks for the multi-tenant SaaS frontend.
It is meant to stay aligned with the backend backlog in
[`sass-backend/docs/next-tasks-and-subtasks.md`](../../sass-backend/docs/next-tasks-and-subtasks.md)
and the live API conventions documented there.

## Frontend stack (locked)

| Layer                | Choice                | Rule                                                                                                                                                |
| -------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host / bundler       | **Vite**              | Dev server, production build, and `VITE_*` env vars.                                                                                                |
| UI runtime           | **React (SPA)**       | Browser React app only. No Next.js / RSC / Server Components.                                                                                       |
| Routing              | **React Router**      | File/feature routes via `react-router-dom` (`BrowserRouter`, route modules under `src/`).                                                           |
| Styling              | **styled-components** | No CSS Modules / Tailwind / utility CSS frameworks for component styling. Theme via styled-components `ThemeProvider` + CSS variables as needed.    |
| Component modularity | **Storybook**         | Shared UI and feature components get stories for states, variants, and visual review. Prefer building primitives in isolation before wiring routes. |

This is a **Vite + React SPA**. Next.js is not part of the stack.

## Current repo readiness

The frontend is a Vite + React + React Router scaffold and currently has:

- Vite + React 19 + TypeScript
- React Router with a root route shell under `src/`
- Path alias `@/*` → `src/*`
- `.env.example` with `VITE_API_URL`
- Implementation backlog in `docs/next-tasks-and-subtasks.md`

It does **not** yet have:

- styled-components + theme provider setup
- Storybook for component documentation/modularity
- Design system / shared UI primitives
- API client, auth session handling, or organization context
- Auth vs authenticated app route shells
- Domain screens (orgs, members, projects, boards, issues)

Backend readiness the frontend can already consume:

- Auth: register, login, refresh, logout, me
- Organizations: CRUD, settings, archive
- Users: profile get/update
- Members: list/detail (read-only)
- Tenant header: `X-Organization-Id`
- Shared response envelope + pagination
- Roles/permissions model on the backend (invite + member mutation APIs still pending)

---

## Backend contract the frontend must follow

| Concern          | Convention                                                       |
| ---------------- | ---------------------------------------------------------------- |
| Base URL         | `{API_URL}/api/v1`                                               |
| Auth header      | `Authorization: Bearer <accessToken>`                            |
| Refresh          | JSON body `{ refreshToken }` (not cookies)                       |
| Tenant header    | `X-Organization-Id: <organizationUuid>`                          |
| Success envelope | `{ success: true, data, meta }`                                  |
| Error envelope   | `{ success: false, error: { code, statusCode, message }, meta }` |
| Pagination       | `{ items, pagination: { page, limit, total, ... } }`             |
| Roles            | `OWNER \| ADMIN \| MEMBER \| VIEWER`                             |

Reference docs in the backend repo:

- `docs/tenant-isolation.md`
- `docs/organization-membership-v1.md`
- `docs/organization-roles-v1.md`
- `docs/organization-permissions-v1.md`
- `docs/organization-rbac-v1.md`
- `docs/database-seeds.md` (seed users for local QA)

---

## Recommended implementation order

1. App foundation (env, API client, layout shell, routing)
2. Authentication UI + session
3. Organizations + active workspace switching
4. Profile, members directory, and client-side RBAC helpers
5. Invitations + member management (after backend 3.3 / 3.4)
6. Projects
7. Boards
8. Issues / kanban workflow
9. Collaboration (comments, attachments, notifications, reports)

---

## Phase 0 — App foundation

### Task 0.1 — Project architecture and conventions

Subtasks:

- [x] **0.1.1** Define folder structure under `src/` (`pages/`, `components/`, `features/`, `lib/`, `hooks/`, `types/`, `styles/`, `routes/`, …)
- [x] **0.1.2** Keep environment config (`.env.example`) for `VITE_API_URL`
- [x] **0.1.3** Configure **React Router** route modules (public vs authenticated layouts)
  - [x] **0.1.3.1** Auth session stub for route guards
  - [x] **0.1.3.2** Shared route paths + `RequireAuth` / `RequireGuest`
  - [x] **0.1.3.3** `PublicLayout` and `AppLayout` shells
  - [x] **0.1.3.4** Wire route tree + placeholder pages
- [x] **0.1.4** Configure **styled-components** (foundation only; one commit per nested subtask)
  - [x] **0.1.4.1** Install `styled-components` (+ types) and configure Vite/React plugin for styled-components
  - [x] **0.1.4.2** Add typed theme tokens (`DefaultTheme`) under `src/styles/` — tokens only, no visual polish pass
  - [x] **0.1.4.3** Wire `ThemeProvider` + minimal `createGlobalStyle` (replace/supplement the tiny CSS reset)
  - [x] **0.1.4.4** Smoke-convert one shell (`PublicLayout` **or** `AppLayout`) to prove the stack end-to-end
  - [x] **0.1.4.5** Document styled-components conventions (theme import path, no CSS Modules/Tailwind for components)
- [x] **0.1.5** Add shared TypeScript types for the API envelope, pagination, and error codes
- [x] **0.1.6** Establish lint/format conventions and keep README setup current against the backend

**0.1.4 out of scope** (land in **0.2** instead):

- Full brand/visual design system
- Shared UI primitives (button, input, dialog, toast, …) and Storybook stories
- Restyling every page/layout at once

Acceptance criteria:

- The Vite app boots with a clear module layout
- React Router handles public and app shells without full-page reloads
- styled-components theme/provider works in local dev
- Env-based API base URL works in local development
- Shared API types exist before feature screens are built

### Task 0.2 — Storybook + design system and app shell

Subtasks:

- [x] **0.2.1** Initialize **Storybook** (Vite + React) and wire a `ThemeProvider` / `GlobalStyle` decorator so stories use the app theme
- [x] **0.2.2** Choose a clear visual direction and expand theme tokens as needed (avoid generic AI-default purple/cream looks; no full page restyle yet)
- [x] **0.2.3** Add **Button** primitive under `src/components/ui/` + Storybook stories (default, disabled, loading, key variants)
- [x] **0.2.4** Add **Input** + **FormField** primitives + stories (default, disabled, error, key variants)
- [x] **0.2.5** Add **Dialog** primitive + stories (open/closed, key variants)
- [x] **0.2.6** Add **Toast** primitive + stories (default, error/success if applicable, key variants)
- [x] **0.2.7** Add **Table** / list primitive + stories (default, empty, key variants)
- [x] **0.2.8** Restyle **PublicLayout** with the design system (guest shell only)
- [x] **0.2.9** Restyle **AppLayout** with the design system and workspace nav placeholders (projects, boards, settings, members)

**0.2 out of scope** (later phases):

- Real auth/API wiring on buttons/forms (Phase 1+)
- Domain feature screens beyond layout shells
- Pixel-perfect marketing/landing branding pass beyond the app shell

Acceptance criteria:

- Storybook runs locally and documents shared components independently of routes
- First authenticated viewport feels like one product composition, not a generic dashboard kit
- Shared components are reusable across auth and workspace screens
- Mobile and desktop layouts both work for core shells

### Task 0.3 — API client and query layer

Foundation for all feature API calls. Builds on existing `getApiUrl()`, envelope
types, and the auth session stub. Real login/register UI stays in Phase 1.

Subtasks:

- [x] **0.3.1** Add **TanStack Query** (`@tanstack/react-query`) and wrap the app with `QueryClientProvider` (sensible defaults)
- [x] **0.3.2** Create a typed browser `apiClient` (**axios**) that unwraps the backend envelope and throws a typed `ApiError`
- [x] **0.3.3** Attach `Authorization: Bearer` when an access token exists, and `X-Organization-Id` when an active org id is present (stub getter ok until Phase 2)
- [x] **0.3.4** Add single-flight **401 → refresh → retry once** behavior; clear session tokens if refresh fails (client plumbing only)
- [x] **0.3.5** Map backend `error.code` values to user-facing messages (incl. tenant missing/forbidden)
- [x] **0.3.6** Document the convention that features call the API only via the client + Query hooks; optional thin smoke usage (see [`docs/api-client-v1.md`](./api-client-v1.md), `features/auth/api/get-current-user.ts`)

**0.3 out of scope** (land in Phase 1+ instead):

- Login/register screens and real auth form wiring (**1.2**)
- Logout UI and “session expired” recovery UX (**1.3**)
- Organization switcher / active-org persistence (**2.x**)

Acceptance criteria:

- All feature modules call the API through one client
- 401 refresh + retry works without forcing a full re-login on every expiry
- Missing tenant context surfaces clear UI errors for tenant-scoped routes
- TanStack Query is available app-wide for queries and mutations

---

## Phase 1 — Authentication

### Task 1.1 — Auth session model

Subtasks:

- Decide token storage strategy for v1 (memory + httpOnly cookie proxy vs local/session storage)
- Persist access/refresh tokens safely enough for local development
- Hydrate session on app load (`GET /auth/me` and/or profile)
- Protect authenticated routes and redirect anonymous users to login

Acceptance criteria:

- Authenticated routes require a valid session
- Logout clears session state and tokens
- Hard refresh keeps the user signed in according to the chosen storage policy

### Task 1.2 — Registration and login UI

Subtasks:

- Build `/register` and `/login` screens
- Wire `POST /auth/register` and `POST /auth/login`
- Surface validation and backend errors (`VALIDATION_FAILED`, `ACCOUNT_LOCKED`, `TOO_MANY_REQUESTS`, conflicts)
- Enforce client-side password rules aligned with backend (8–72 chars, upper/lower/digit)

Acceptance criteria:

- A new user can register and land in an authenticated state
- An existing user can log in and reach the app shell
- Duplicate email and invalid credentials fail with clear messaging

### Task 1.3 — Session refresh and logout

Subtasks:

- Wire `POST /auth/logout` (refresh retry path lands in **0.3.4**)
- Add “session expired” recovery UX when refresh fails
- Confirm short-lived access tokens refresh transparently during normal use

Acceptance criteria:

- Short-lived access tokens refresh transparently during normal use
- Logout revokes the refresh token and returns the user to login

---

## Phase 2 — Organizations and workspace context

### Task 2.1 — Organization onboarding

Subtasks:

- Build create-organization flow (`POST /organizations`)
- Handle empty-state for users with zero organizations
- Show org name/slug/plan fields with slug validation feedback

Acceptance criteria:

- A newly registered user can create their first workspace
- Creator lands inside that organization as the active workspace

### Task 2.2 — Organization list and switcher

Subtasks:

- Wire `GET /organizations` into an org picker / switcher
- Persist the active organization id for subsequent requests
- Send `X-Organization-Id` on all tenant-scoped calls
- Optionally probe `GET /tenant/context` after switching

Acceptance criteria:

- Multi-org users can switch workspaces without re-login
- Active org is visible in the shell and used consistently by the API client

### Task 2.3 — Organization settings and archive

Subtasks:

- Build organization settings UI (`PATCH /organizations/:id`) for timezone/locale/branding placeholders
- Gate settings edits behind client permission checks (`settings:update`)
- Add archive/delete confirmation for owners (`DELETE /organizations/:id`)
- Hide archived orgs from the active switcher after refresh

Acceptance criteria:

- Admins/owners can update settings when permitted
- Only owners can archive; forbidden responses are handled cleanly

---

## Phase 3 — Users, roles, and members

### Task 3.1 — Profile screens

Subtasks:

- Wire `GET /users/me` and `PATCH /users/me`
- Build profile settings for display name, avatar URL, preferences (theme/locale/notifications)
- Keep shell user menu in sync after profile updates

Acceptance criteria:

- Users can view and update their own profile
- Preference changes (e.g. theme) apply in the UI

### Task 3.2 — Members directory

Subtasks:

- Build members list/detail views on `GET /members` and `GET /members/:userId`
- Display role badges (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`)
- Require active organization context before loading

Acceptance criteria:

- Workspace members are listable for the active organization
- Member detail shows identity + role fields from the API

### Task 3.3 — Client-side permission helpers

Subtasks:

- Port the backend permission matrix into shared frontend helpers
- Add hooks/utilities such as `usePermission('invite:create')` / `hasMinRole('ADMIN')`
- Hide or disable unauthorized actions in the UI (still rely on backend 403s)

Acceptance criteria:

- UI affordances match backend roles/permissions for implemented actions
- Forbidden API responses still degrade gracefully if the UI is stale

### Task 3.4 — Invitations UI (depends on backend 3.3)

Subtasks:

- Build invite member modal/form once invite endpoints exist
- Add accept-invite route/flow for tokenized links
- Add revoke-invite controls for admins/owners
- Stub email delivery messaging for development

Acceptance criteria:

- Owners/admins can invite users when the API is available
- Invitees can accept and join the active organization

### Task 3.5 — Member management UI (depends on backend 3.4)

Subtasks:

- Add role change controls
- Add remove-member controls
- Prevent attempting to remove/demote the last owner in the UI

Acceptance criteria:

- Admins can manage membership safely with clear confirmations
- Backend last-owner protections are reflected in UX copy

---

## Phase 4 — Projects

### Task 4.1 — Project list and CRUD UI (depends on backend 4.x)

Subtasks:

- Build project list/detail/create/edit/delete screens
- Scope all project requests with the active organization header
- Gate destructive actions with `project:delete` / role helpers

Acceptance criteria:

- Organization members can create and manage projects through the UI

### Task 4.2 — Project visibility and navigation

Subtasks:

- Reflect backend visibility rules in list/detail access states
- Deep-link from org shell → project → boards

Acceptance criteria:

- Project navigation is clear and tenant-safe

---

## Phase 5 — Boards

### Task 5.1 — Board CRUD UI (depends on backend 5.1)

Subtasks:

- Create board list/create/edit flows under a project
- Support board types such as KANBAN / SCRUM in the UI when exposed by the API

Acceptance criteria:

- A project can show and manage one or more boards

### Task 5.2 — Board columns UI (depends on backend 5.2)

Subtasks:

- Render configurable columns
- Support column reorder interactions once the API exists

Acceptance criteria:

- Boards display workflow columns from the backend

---

## Phase 6 — Issues (tasks)

### Task 6.1 — Issue list/detail CRUD (depends on backend 6.1)

Subtasks:

- Build issue create/list/detail/update/delete UI
- Link issues to project/board/column context

Acceptance criteria:

- Users can manage issues inside a board workflow from the UI

### Task 6.2 — Assignment and kanban movement (depends on backend 6.2)

Subtasks:

- Add assignee/reporter controls
- Implement drag-and-drop column moves with optimistic UI + API sync
- Show toasts/errors when moves fail permissions or validation

Acceptance criteria:

- Issues can be assigned and moved through columns from the board view

---

## Phase 7 — Collaboration UI

### Task 7.1 — Comments

Subtasks:

- Issue comment thread UI
- Author-only edit/delete affordances

### Task 7.2 — Attachments

Subtasks:

- Upload/list issue files with validation and size limits
- Progress and failure states for uploads

---

## Phase 8 — Activity, notifications, and reports UI

### Task 8.1 — Activity stream

Subtasks:

- Project/issue activity feeds once backend endpoints exist

### Task 8.2 — Notifications

Subtasks:

- In-app notification center for assignments/mentions
- Preference toggles already present on the profile model

### Task 8.3 — Reports

Subtasks:

- Basic project/organization progress and workload views

---

## Suggested execution checklist for the next implementation pass

- [x] Scaffold Vite + React + React Router and `.env.example`
- [x] **0.1.1** Expand `src/` feature/lib folder structure
- [x] **0.1.3.1–0.1.3.4** Public vs authenticated React Router layout shells (split commits)
- [ ] **0.1.4.1–0.1.4.5** styled-components foundation (install → theme → provider → one shell → docs)
- [ ] **0.1.5–0.1.6** API types, lint/README polish
- [ ] Initialize Storybook and document the first UI primitives with stories (0.2)
- [ ] Build typed client API layer with envelope unwrap + Bearer/`X-Organization-Id` support
- [ ] Implement auth session model, login, register, logout, refresh
- [ ] Build create-organization + org switcher flows
- [ ] Wire profile settings and members directory
- [ ] Add frontend permission helpers from the backend matrix
- [ ] Defer invites/member mutations/projects/boards/issues until matching backend APIs ship
- [ ] Keep screens aligned with backend seed users for local QA

## Backend / frontend dependency map

| Frontend work                      | Backend dependency    | Backend status (as of frontend backlog creation) |
| ---------------------------------- | --------------------- | ------------------------------------------------ |
| Auth UI + session                  | Phase 1               | Available                                        |
| Org create/switch/settings         | Phase 2               | Available                                        |
| Profile + members read             | Phase 3.1             | Available                                        |
| Client RBAC helpers                | Phase 3.2 docs/matrix | Available (matrix + guards)                      |
| Invites UI                         | Phase 3.3             | Not yet                                          |
| Member role/remove UI              | Phase 3.4             | Not yet                                          |
| Projects UI                        | Phase 4               | Not yet                                          |
| Boards UI                          | Phase 5               | Not yet                                          |
| Issues / kanban UI                 | Phase 6               | Not yet                                          |
| Comments / attachments             | Phase 7               | Not yet                                          |
| Activity / notifications / reports | Phase 8               | Not yet                                          |

## Planning notes

- Host is **Vite**; routing is **React Router**. Do not add Next.js or mix in another router.
- **styled-components** is the styling system; keep styles colocated with components and theme-driven.
- **Storybook** is required for shared/modular components before (or alongside) route integration.
- Prefer building against **available** backend endpoints first (Phases 0–3.2 on the frontend).
- Do not invent parallel API shapes; mirror backend DTOs and error codes.
- Keep tenant scoping explicit in the client: no workspace data fetch without an active organization id.
- UI permission checks are convenience only; backend enforcement remains the source of truth.
- When implementing visually led surfaces, follow product design rules already used in this workspace (brand-first composition, no generic purple/cream AI defaults, purposeful typography, restrained motion).
- Env vars must use the `VITE_` prefix to be exposed to the browser.
