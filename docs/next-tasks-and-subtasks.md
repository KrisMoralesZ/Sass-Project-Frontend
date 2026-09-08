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

Phases **0–2** are in place on the frontend: design system + Storybook, API client,
auth session, organization create/switch/settings/archive, and client RBAC
helpers used by settings.

Still ahead on the frontend:

- Profile settings (`GET`/`PATCH /users/me`) and a shell user menu
- Members directory (`GET /members`, `GET /members/:userId`)
- Invitations and member role/removal UI (backend + frontend **alongside** when we get there)
- Projects, boards, issues, and later collaboration screens

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
4. Profile + members directory (client RBAC helpers already landed in 2.3.2 / 2.3.4)
5. Invitations + member management — backend and frontend **alongside** (backend 3.3 + frontend 3.4, then backend 3.4 + frontend 3.5)
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

Real auth UI and session lifecycle on top of the **0.1.3** route-guard stub,
**0.3** `apiClient` / refresh interceptor, and `features/auth/api/get-current-user.ts`.
Follow [`docs/api-client-v1.md`](./api-client-v1.md): features call APIs only via
`apiClient` + TanStack Query; surface failures with `getApiErrorMessage`.

Backend endpoints already available: `POST /auth/register`, `POST /auth/login`,
`POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.

### Task 1.1 — Auth session model

Turn the Phase 0 stub into a real session: confirm storage, hydrate the user, and
keep route guards honest while tokens/profile load.

Subtasks:

- [x] **1.1.1** Confirm **v1 token storage**: `sessionStorage` for access + refresh (`session-storage.ts`). Document that httpOnly cookie proxy is deferred (needs a BFF; not in SPA v1)
- [x] **1.1.2** Keep `setSessionTokens` / `clearSessionTokens` / `hasSession` as the single persistence API used by login, refresh, and logout
- [x] **1.1.3** Extend `AuthSessionProvider` beyond the boolean stub: hold `user` (`AuthUserProfile | null`), `status` (`anonymous` | `loading` | `authenticated`), and `establishSession(tokens)` / `clearSession`
- [x] **1.1.4** Hydrate on app load when tokens exist: `GET /auth/me` via `currentUserQueryOptions` / `getCurrentUser`; on failure clear tokens and treat as anonymous
- [x] **1.1.5** Keep `RequireAuth` / `RequireGuest` on public vs app shells (`paths.login` / `paths.register` already exist)
- [x] **1.1.6** Gate `RequireAuth` on hydrate `status` (avoid flash-redirect while `loading`; send anonymous users to login with `state.from`)
- [x] **1.1.7** Retire or tightly gate `setDevPreviewSession` / “Enter preview session” once real login works (dev-only escape hatch optional)

**1.1 out of scope** (later):

- Remember-me / `localStorage` persistence
- httpOnly cookie BFF or OAuth providers

Acceptance criteria:

- Authenticated routes require a hydrated session (tokens + successful `/auth/me`)
- Hard refresh restores the session when refresh tokens are still valid
- Failed hydrate or cleared tokens leave the user on login, not a half-loaded shell

### Task 1.2 — Registration and login UI

Subtasks:

- [x] **1.2.1** Add typed auth API helpers under `features/auth/api/` (`register`, `login`) mirroring backend `RegisterResponse` / `LoginResponse` (`user` + `tokens`)
- [x] **1.2.2** Build `/register` screen with PublicLayout: email, display name (optional if backend allows), password + confirm; client password rules aligned with backend (8–72 chars, upper/lower/digit)
- [x] **1.2.3** Build `/login` screen with PublicLayout: email + password; support redirect back to `state.from` after success
- [x] **1.2.4** Wire forms with TanStack `useMutation` → `establishSession(tokens)` → invalidate/prefetch `['auth', 'me']` → navigate into the app shell
- [x] **1.2.5** Surface backend errors via `getApiErrorMessage` (`VALIDATION_FAILED`, `CONFLICT` / duplicate email, `UNAUTHORIZED`, `ACCOUNT_LOCKED`, `TOO_MANY_REQUESTS`)
- [x] **1.2.6** Add Storybook stories for login/register form states (idle, submitting, field error, API error) before or alongside route wiring
- [x] **1.2.7** Cross-links between login ↔ register; guest-only via `RequireGuest`

**1.2 out of scope** (later):

- Email verification / password reset flows
- Social / SSO login

Acceptance criteria:

- A new user can register and land authenticated in the app shell
- An existing user can log in and reach the app shell (including deep-link return)
- Duplicate email and invalid credentials fail with clear messaging
- Forms use shared UI primitives (`Input`, `FormField`, `Button`) and design-system PublicLayout

### Task 1.3 — Logout and session-expired UX

Refresh **retry plumbing** already lives in **0.3.4**. This task is product UX:
explicit logout and recovery when the session cannot be refreshed.

Subtasks:

- [x] **1.3.1** Add `logout` API helper: `POST /auth/logout` with `{ refreshToken }`; always clear local session afterward (even if the network call fails)
- [x] **1.3.2** Add logout control in `AppLayout` (or shell header) that calls logout, clears org id, and navigates to `/login`
- [x] **1.3.3** Session-expired recovery: when `subscribeSessionCleared` fires (failed refresh), show a toast/banner and redirect to `/login` with a clear “session expired” message
- [x] **1.3.4** Confirm transparent refresh during normal authenticated browsing (manual QA against short-lived access tokens); no extra UI when refresh succeeds
- [x] **1.3.5** On logout / session clear: invalidate auth-related Query cache (`['auth', 'me']` and related keys)

**1.3 out of scope** (later / Phase 2):

- Organization switcher and active-org empty-state after login (**2.x**)
- Changing storage strategy

Acceptance criteria:

- Short-lived access tokens refresh transparently during normal use (no forced re-login on every expiry)
- Logout revokes the refresh token when possible and always returns the user to login with a clean client state
- Failed refresh never leaves the user stuck in an authenticated shell with dead tokens

---

## Phase 2 — Organizations and workspace context

Build organization workflows on the authenticated app shell, the typed
`apiClient`, TanStack Query, and the `X-Organization-Id` tenant header.
Available backend endpoints include organization list/create/update/archive
operations.

### Task 2.1 — Organization onboarding

Subtasks:

- [x] **2.1.1** Add typed organization API helpers and Query options for list/create/update/archive operations under `features/organizations/api/`
- [x] **2.1.2** Build the create-organization flow (`POST /organizations`) with name, slug, and plan placeholder fields
- [x] **2.1.3** Validate organization slugs on the client and surface backend validation/conflict errors through `getApiErrorMessage`
- [x] **2.1.4** Handle the authenticated empty state for users with zero organizations
- [x] **2.1.5** Set the newly created organization as the active workspace and navigate into its app context

Acceptance criteria:

- A newly registered user can create their first workspace
- Organization name, slug, and plan placeholder data are displayed consistently
- Invalid or duplicate slugs fail with clear inline feedback
- The creator lands inside that organization as the active workspace

### Task 2.2 — Organization list and switcher

Subtasks:

- [x] **2.2.1** Wire `GET /organizations` into an organization picker/switcher in the authenticated shell
- [x] **2.2.2** Persist the active organization id through one client-side active-organization storage API
- [x] **2.2.3** Restore a valid active organization after authentication and hard refresh; fall back to the first available organization when needed
- [x] **2.2.4** Send `X-Organization-Id` on all tenant-scoped API calls after an organization is active
- [x] **2.2.5** Invalidate organization-scoped Query data when switching workspaces
- [x] **2.2.6** Handle missing, archived, forbidden, and unavailable organization context without rendering stale workspace data
- [x] **2.2.7** Optionally probe `GET /tenant/context` after switching when the endpoint is available

Acceptance criteria:

- Multi-org users can switch workspaces without re-login
- Active org is visible in the shell and used consistently by the API client
- Active organization state survives a hard refresh when the organization remains available
- Switching organizations does not display data from the previous workspace

### Task 2.3 — Organization settings and archive

Subtasks:

- [x] **2.3.1** Build organization settings UI for timezone, locale, and branding placeholders (`PATCH /organizations/:id`)
- [x] **2.3.2** Gate settings edits behind the client permission check for `settings:update`, while retaining backend enforcement
- [x] **2.3.3** Surface forbidden, validation, and tenant-context errors with clear field or page feedback
- [x] **2.3.4** Add archive/delete confirmation for organization owners (`DELETE /organizations/:id`)
- [x] **2.3.5** Clear or replace the active organization after archive and hide archived organizations from the switcher after refresh

Acceptance criteria:

- Admins/owners can update settings when permitted
- Only owners can archive; forbidden responses are handled cleanly
- Archived organizations cannot remain selected as the active workspace

**Phase 2 out of scope** (land in later phases):

- Profile settings and member directory screens (Phase 3)
- Invitations and member role/removal mutations until the backend endpoints exist
- Projects, boards, issues, and other organization-scoped domain screens

---

## Phase 3 — Users, roles, and members

`GET`/`PATCH /users/me` and members list/detail are available on the backend.
Client RBAC helpers already exist from organization settings/archive. Invites
and member mutations wait on backend **3.3** / **3.4**.

Next implementation order: **3.1** profile, then **3.2** members directory.
**3.3** is already done. When we reach invites and member mutations, implement
**frontend 3.4 alongside backend 3.3**, then **frontend 3.5 alongside backend 3.4**
(API and UI in the same pass, not frontend waiting on a finished backend).

### Task 3.1 — Profile screens

User-scoped (`@OptionalOrganization()`): `GET /users/me` and `PATCH /users/me`.
This is **not** `GET /auth/me` (auth session is a smaller `{ id, email, displayName, createdAt }`).

Profile fields from `UserProfileResponse` / `UpdateUserProfileDto`:

- `displayName` (string, 1–120, nullable)
- `avatarUrl` (absolute http(s) URL, max 2048, nullable)
- `preferences.timezone` (max 64), `locale` (max 16)
- `preferences.theme`: `system` | `light` | `dark`
- `preferences.notifications`: `email`, `inApp`, `marketing` booleans

Subtasks:

- [x] **3.1.1** Add typed users API helpers and Query options under `features/users/` mirroring `UserProfileResponse` / `UpdateUserProfileDto`
- [x] **3.1.2** Add `useMyProfile` / `useUpdateMyProfile`; on success refresh profile cache and keep `AuthSessionProvider` `user.displayName` in sync
- [x] **3.1.3** Build `/profile` settings UI: display name, avatar URL, timezone, locale, theme, notification toggles
- [ ] **3.1.4** Client-validate field constraints and map `VALIDATION_FAILED` onto fields (same pattern as organization settings)
- [ ] **3.1.5** Apply `preferences.theme` in the product (`ThemeProvider`); add a dark token set so `dark` / `system` actually change the UI
- [ ] **3.1.6** Add a shell user menu (display name + link to profile) above Sign out; stay in sync after save
- [ ] **3.1.7** Add Storybook stories for the profile form (idle, submitting, field error, API error, saved)
- [x] **3.1.8** Register `/profile` under the authenticated shell **outside** `RequireOrganization` so it works with zero workspaces

**3.1 out of scope:**

- Email / password change and avatar file upload (URL only)
- Marketing-email delivery; persist the preference only
- Organization timezone/locale (already on `/settings`)

Acceptance criteria:

- Users can view and update their own profile
- Preference changes (especially theme) apply in the UI
- Shell user menu shows the saved display name without a full reload

### Task 3.2 — Members directory

Tenant-scoped: `GET /members` (paginated, optional `search`, sort `createdAt` |
`updatedAt` | `role`) and `GET /members/:userId`. `get-member` already exists for
the current user; list + detail screens still need building.

Subtasks:

- [ ] **3.2.1** Add typed list-members API helper and Query options (`['members', organizationId, query]`)
- [ ] **3.2.2** Build the members list page with the Table primitive, role badges (`OWNER` / `ADMIN` / `MEMBER` / `VIEWER`), search, and pagination
- [ ] **3.2.3** Add member detail (`GET /members/:userId`) for identity + role; reuse `getOrganizationMember`
- [ ] **3.2.4** Replace the `/members` placeholder; add `/members/:userId` if detail is a route rather than a panel
- [ ] **3.2.5** Surface tenant-context / forbidden / not-found copy with the same error helpers as settings
- [ ] **3.2.6** Add Storybook stories for the list (default, empty, loading, error) and role badge

**3.2 out of scope:**

- Invite, role-change, and remove controls (**3.4** / **3.5**)
- Profile editing of other members

Acceptance criteria:

- Workspace members are listable for the active organization
- Member detail shows identity + role fields from the API
- Missing tenant context does not fetch or render another workspace’s members

### Task 3.3 — Client-side permission helpers

Landed with organization settings (**2.3.2**) and archive (**2.3.4**). Keep
using these helpers on new screens; do not duplicate the matrix.

Subtasks:

- [x] **3.3.1** Port organization roles (`OWNER` / `ADMIN` / `MEMBER` / `VIEWER`) and `hasMinRole`
- [x] **3.3.2** Port the permission catalog (`settings:update`, `invite:*`, …)
- [x] **3.3.3** Port the role → permission matrix + unit tests
- [x] **3.3.4** Add `useCurrentOrganizationMember` (`GET /members/:userId` for the signed-in user)
- [x] **3.3.5** Add `usePermission(permission)` and gate settings edits on `settings:update`
- [x] **3.3.6** Gate owner-only archive with `hasMinRole(..., OWNER)` while backend `RequireMinRole` remains source of truth

Acceptance criteria:

- UI affordances match backend roles/permissions for implemented actions
- Forbidden API responses still degrade gracefully if the UI is stale

### Task 3.4 — Invitations UI (alongside backend 3.3)

Ship with backend **3.3.1–3.3.8** in the same pass (`invite:create` / `invite:read` /
`invite:revoke` + token accept). Reuse `usePermission` for invite actions. Do not
wait for the backend task to be fully closed before starting the UI; land
endpoint + screen together per slice.

Policy source of truth: [`sass-backend/docs/organization-invitations-v1.md`](../../sass-backend/docs/organization-invitations-v1.md).

Subtasks:

- [x] **3.4.1** Add typed invite API helpers as create/list/revoke/accept endpoints land
- [ ] **3.4.2** Add invite-member modal on the members page, gated on `invite:create`
- [ ] **3.4.3** List pending invites and revoke, gated on `invite:read` / `invite:revoke`
- [ ] **3.4.4** Add an accept-invite route for tokenized links (authenticated user + token)
- [ ] **3.4.5** Show the development stub copy (invite URL logged by the API; no real SMTP)
- [ ] **3.4.6** Stories + forbidden/validation/expired-token feedback

Acceptance criteria:

- Owners/admins can invite users when the API is available
- Invitees can accept and join the active organization

### Task 3.5 — Member management UI (alongside backend 3.4)

Ship with backend role-update and member-removal endpoints in the same pass.

Subtasks:

- [ ] **3.5.1** Add role-change controls on member detail, with confirmation
- [ ] **3.5.2** Add remove-member confirmation (Dialog danger pattern from archive)
- [ ] **3.5.3** Prevent last-owner remove/demote in the UI and explain the backend rule
- [ ] **3.5.4** Stories + forbidden handling

Acceptance criteria:

- Admins can manage membership safely with clear confirmations
- Backend last-owner protections are reflected in UX copy

**Phase 3 out of scope** (later phases):

- Projects, boards, issues
- Changing another user’s email or password
- Real invite email delivery (SMTP)

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
- [x] **0.1** Foundation (structure, routes, styled-components, API types, lint/README)
- [x] **0.2** Design system + Storybook primitives + layout shells
- [x] **0.3** API client + TanStack Query + refresh interceptor + error mapping
- [x] **1.1** Auth session model (storage, hydrate, loading-aware guards; preview gated to DEV)
- [x] **1.2.1–1.2.5** Login + register UI, mutations, session establish, error surfacing
- [x] **1.2.6–1.2.7** Auth Storybook stories + login↔register cross-links / `RequireGuest`
- [x] **1.3.1–1.3.4** Logout, session-expired recovery, transparent refresh (silent on success)
- [x] **1.3.5** Invalidate auth Query cache on logout / session clear
- [x] **2.1–2.2** Create-organization flow + active-organization switcher
- [x] **2.3.1** Organization settings UI (timezone, locale, branding placeholders)
- [x] **2.3.2** Settings edits gated on client `settings:update` (backend still enforces)
- [x] **2.3.3** Settings forbidden, validation, and tenant-context error surfacing
- [x] **2.3.4** Owner archive confirmation (`DELETE /organizations/:id`)
- [x] **2.3.5** Active-organization cleanup after archive
- [x] **3.3** Client permission helpers (roles, matrix, `usePermission`, `hasMinRole`)
- [ ] **3.1.1–3.1.4** Profile API + `/profile` form, validation, session display-name sync
- [ ] **3.1.5–3.1.8** Theme apply, shell user menu, stories, `/profile` outside `RequireOrganization`
- [ ] **3.2.1–3.2.4** Members list/detail API + pages (replace `/members` placeholder)
- [ ] **3.2.5–3.2.6** Members tenant-error copy + Storybook
- [x] **3.4.1** Typed invite API helpers (create/list/revoke/accept) mirroring invitation policy
- [ ] **3.4.2–3.4.6 / 3.5 alongside backend 3.3–3.4** Invite UI + member role/remove (API and screens in the same pass)
- [ ] Defer projects/boards/issues until matching backend APIs ship
- [ ] Keep screens aligned with backend seed users (`owner@acme.local` / `Password1`, …) for local QA

## Backend / frontend dependency map

| Frontend work                      | Backend dependency    | Backend status (as of frontend backlog creation) |
| ---------------------------------- | --------------------- | ------------------------------------------------ |
| Auth UI + session                  | Phase 1               | Available                                        |
| Org create/switch/settings         | Phase 2               | Available                                        |
| Profile + members read             | Phase 3.1             | Available                                        |
| Client RBAC helpers                | Phase 3.2 docs/matrix | Available (matrix + guards)                      |
| Invites UI                         | Phase 3.3             | Not yet — take **alongside** frontend 3.4        |
| Member role/remove UI              | Phase 3.4             | Not yet — take **alongside** frontend 3.5        |
| Projects UI                        | Phase 4               | Not yet                                          |
| Boards UI                          | Phase 5               | Not yet                                          |
| Issues / kanban UI                 | Phase 6               | Not yet                                          |
| Comments / attachments             | Phase 7               | Not yet                                          |
| Activity / notifications / reports | Phase 8               | Not yet                                          |

## Planning notes

- Host is **Vite**; routing is **React Router**. Do not add Next.js or mix in another router.
- **styled-components** is the styling system; keep styles colocated with components and theme-driven.
- **Storybook** is required for shared/modular components before (or alongside) route integration.
- Prefer building against **available** backend endpoints first (frontend **3.1–3.2** next). When we reach invites and member mutations, take **backend + frontend alongside** (backend 3.3 + frontend 3.4, then backend 3.4 + frontend 3.5).
- Do not invent parallel API shapes; mirror backend DTOs and error codes.
- Keep tenant scoping explicit in the client: no workspace data fetch without an active organization id.
- UI permission checks are convenience only; backend enforcement remains the source of truth.
- When implementing visually led surfaces, follow product design rules already used in this workspace (brand-first composition, no generic purple/cream AI defaults, purposeful typography, restrained motion).
- Env vars must use the `VITE_` prefix to be exposed to the browser.
