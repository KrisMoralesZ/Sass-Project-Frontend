# Frontend coverage effort

Two independent gates (same metrics: statements, branches, functions, lines):

| Suite         | Threshold | Measured files                                     | CI command                        |
| ------------- | --------- | -------------------------------------------------- | --------------------------------- |
| Unit (Vitest) | **70%**   | `src/lib`, `src/features`, `src/routes`, `App.tsx` | `npm run test:coverage:unit`      |
| Storybook     | **80%**   | `src/components`, `src/styles`                     | `npm run test:coverage:storybook` |

Storybook is higher because those files already have (or should have) interaction stories. Unit stays at 70% while auth/API specs are filled in. `src/pages/**` is included in the Storybook coverage gate now that page stories exist.

Work this list **module by module**. Check an item off when its tests are in and the matching coverage command still passes.

## Commands

| Script                            | What it does                                        |
| --------------------------------- | --------------------------------------------------- |
| `npm run test:unit`               | Watch unit tests (`src/**/*.{test,spec}.{ts,tsx}`)  |
| `npm run test:unit:run`           | Single unit run (no Storybook / Playwright)         |
| `npm run test:storybook:run`      | Storybook interaction tests only (no coverage)      |
| `npm run test:coverage:unit`      | Unit project + V8 coverage + **70%** threshold      |
| `npm run test:coverage:storybook` | Storybook project + V8 coverage + **80%** threshold |
| `npm run test:coverage`           | Unit gate then Storybook gate (local convenience)   |

Config lives in `vite.config.ts` (`test.coverage`). Coverage HTML is written to `coverage/` (gitignored).

## How the two gates work

CI runs unit coverage and Storybook coverage as **separate jobs**. Hits do not merge: a unit spec cannot satisfy the Storybook 80% bar, and a story cannot satisfy the unit 70% bar.

Story `play` functions and renders count toward `Button/index.tsx`, `PublicLayout/index.tsx`, and other files under `src/components` and `src/styles`. `.stories.tsx` files themselves are excluded (decorators, mock panels, story args).

| Command                           | Tests run                 | Coverage                         | Threshold |
| --------------------------------- | ------------------------- | -------------------------------- | --------- |
| `npm run test:coverage:unit`      | `*.test.ts` / `*.spec.ts` | lib, features, routes, `App.tsx` | 70%       |
| `npm run test:coverage:storybook` | stories                   | components, styles               | 80%       |
| `npm run test:storybook:run`      | stories                   | none                             | —         |

## What is excluded from the denominator

These are not counted toward either gate:

- `*.stories.tsx`, `*.test.*`, `*.spec.*` (test/story wrappers, not product source)
- `*.d.ts`, `src/types/**`
- `*.sc.tsx` (styled-components style files)
- `src/main.tsx` (bootstrap)

Unit logic (`src/lib`, `src/features`, `src/routes`) is counted only in the 70% gate. Component `index.tsx` files rendered by stories are counted only in the 80% gate.

## Suggested order

Do **lib + auth** first. They are high line-count, easy to unit-test, and the current Storybook suite does not exercise them. UI primitives already have stories; confirm they show up in the coverage report before spending time there.

---

## Tracker

### 1. lib / API client — unit tests (do first)

| Status | Area                 | Suggested spec                              | Notes                                                 |
| ------ | -------------------- | ------------------------------------------- | ----------------------------------------------------- |
| [x]    | `ApiError`           | `src/lib/api/api-error.test.ts`             | Constructor, `fromErrorBody`, array vs string message |
| [x]    | Error message helper | `src/lib/api/get-api-error-message.test.ts` | Envelope vs network vs unknown                        |
| [x]    | Refresh interceptor  | `src/lib/api/refresh-interceptor.test.ts`   | 401 retry, queue, logout on failure                   |
| [x]    | API client           | `src/lib/api/api-client.test.ts`            | Mock axios; auth header + org header                  |
| [x]    | Env                  | `src/lib/env.test.ts`                       | `VITE_API_URL` missing / present                      |
| [x]    | Query client         | `src/lib/query-client.test.ts`              | Default options if any logic exists                   |
| [x]    | `AppQueryProvider`   | `src/lib/AppQueryProvider.test.tsx`         | Provider wiring + session-cleared invalidation        |

**Effort:** ~1–1.5 days. This is the largest coverage gap.

### 2. Auth + organization session — unit tests

| Status | Area                             | Suggested spec                                                              | Notes                                           |
| ------ | -------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| [x]    | Session storage                  | `src/features/auth/session-storage.test.ts`                                 | Stub `sessionStorage`; get/set/clear/hasSession |
| [x]    | Session events                   | `src/features/auth/session-events.test.ts`                                  | Subscribe / emit                                |
| [x]    | `useAuthSession`                 | `src/features/auth/useAuthSession.test.tsx`                                 | Throw outside provider; happy path              |
| [x]    | `AuthSessionProvider`            | `src/features/auth/AuthSessionProvider.test.tsx`                            | establish / clear session                       |
| [x]    | `get-current-user`               | `src/features/auth/api/get-current-user.test.ts`                            | Mock api client                                 |
| [x]    | Active org storage               | `src/features/organizations/active-organization-storage.test.ts`            | Same pattern as session storage                 |
| [x]    | `clear-client-session`           | `src/features/auth/clear-client-session.test.ts`                            | Tokens, org, expired notice vs logout           |
| [x]    | `apply-auth-session`             | `src/features/auth/apply-auth-session.test.ts`                              | establishSession + query cache sync             |
| [x]    | Session expired notice           | `src/features/auth/session-expired-notice.test.ts`                          | One-shot flag get/set/clear                     |
| [x]    | Password validation              | `src/features/auth/password.test.ts`                                        | `getPasswordError` rules                        |
| [x]    | Auth API helpers                 | `src/features/auth/api/login.test.ts`, `register.test.ts`, `logout.test.ts` | Mock api client                                 |
| [x]    | Auth mutations / logout hook     | `src/features/auth/hooks/*.test.tsx`                                        | Login, register, sign-out flows                 |
| [x]    | `SessionExpiredRecovery`         | `src/features/auth/SessionExpiredRecovery.test.tsx`                         | Expired toast + redirect; ignore logout         |
| [x]    | `auth-api.types` / context files | skip                                                                        | Types and context objects only                  |

**Effort:** ~1 day. Unit project uses `happy-dom` so `sessionStorage` and React tests run without a real browser.

### 3. Routes — unit tests

| Status | Area           | Suggested spec                     | Notes                                           |
| ------ | -------------- | ---------------------------------- | ----------------------------------------------- |
| [x]    | `RequireAuth`  | `src/routes/RequireAuth.test.tsx`  | Redirect when logged out; render outlet when in |
| [x]    | `RequireGuest` | `src/routes/RequireGuest.test.tsx` | Opposite of RequireAuth                         |
| [x]    | `paths`        | `src/routes/paths.test.ts`         | Route constants + `AppPath` type                |
| [x]    | `AppRoutes`    | skip                               | Composition; covered via page stories later     |

**Effort:** ~0.5 day. Wrap with `MemoryRouter` + a stub session provider.

### 4. Pages — Storybook (or RTL)

| Status | Area        | Suggested story / spec                  | Notes                                                                       |
| ------ | ----------- | --------------------------------------- | --------------------------------------------------------------------------- |
| [x]    | Login       | `src/pages/LoginPage.stories.tsx`       | Heading, guest layout, field errors, redirect state, session-expired notice |
| [x]    | Register    | `src/pages/RegisterPage.stories.tsx`    | Guest layout, field errors                                                  |
| [x]    | Home        | `src/pages/HomePage.stories.tsx`        | Authenticated shell via `AppLayout`                                         |
| [x]    | Not found   | `src/pages/NotFoundPage.stories.tsx`    | 404 copy + back link                                                        |
| [x]    | Placeholder | `src/pages/PlaceholderPage.stories.tsx` | Title/description props (Projects, Members, Settings)                       |

**Effort:** ~0.5–1 day.

### 5. Layouts — Storybook already started

| Status | Area                     | Existing                     | Remaining                                                           |
| ------ | ------------------------ | ---------------------------- | ------------------------------------------------------------------- |
| [x]    | `PublicLayout/` (folder) | `PublicLayout.stories.tsx`   | Shell, outlet, and nav link interactions covered in `play`          |
| [x]    | `AppLayout/` (folder)    | `AppLayout.stories.tsx`      | Nav, sign out click, and routed `<Outlet />` covered in `play`      |
| [x]    | Duplicate shells         | n/a (already folder modules) | No duplicate `AppLayout.tsx` / `PublicLayout.tsx` files in the tree |

**Effort:** ~0.5 day (mostly deciding what to do with the duplicate files).

### 6. UI primitives — Storybook already started

Stories exist. Mark done only after `npm run test:coverage` shows the `index.tsx` files above 70% (style files are excluded).

| Status | Component | Story                   |
| ------ | --------- | ----------------------- |
| [x]    | Button    | `Button.stories.tsx`    |
| [x]    | Input     | `Input.stories.tsx`     |
| [x]    | FormField | `FormField.stories.tsx` |
| [x]    | Dialog    | `Dialog.stories.tsx`    |
| [x]    | Table     | `Table.stories.tsx`     |
| [x]    | Toast     | `Toast.stories.tsx`     |
| [x]    | Theme     | `Theme.stories.tsx`     |

**Effort:** ~0.5 day to fill missing `play` functions / states, if the report still shows holes.

### 7. App shell / styles leftover

| Status | Area                                            | Notes                                                           |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| [x]    | `App.tsx`                                       | `src/App.test.tsx` — renders mocked `AppRoutes`                 |
| [x]    | `AppThemeProvider` / `GlobalStyle` / `media.ts` | Theme story `play` exercises provider + `mediaUp` / `mediaDown` |

**Effort:** ~1–2 hours.

---

## File conventions

- **Logic** (api, storage, env, interceptors): colocated `*.test.ts` in the unit project.
- **React that needs a browser:** prefer a Storybook `play` function next to the component. Use `*.test.tsx` only when Storybook is the wrong tool (guards, providers).
- Do not add specs for `*.sc.tsx` or `src/types/**`.

## Gate status

| Check                                                                                                                                                     | Unit (Vitest)                          | Storybook                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| Target                                                                                                                                                    | 70%                                    | 80%                                                          |
| Enforced in                                                                                                                                               | `vite.config.ts` when `--project=unit` | `vite.config.ts` when `--project=storybook`                  |
| CI step                                                                                                                                                   | job `quality` (`test:coverage:unit`)   | job `storybook` (`test:coverage:storybook`), after `quality` |
| When both reports are stably above their bars, keep this file as a checklist for new modules (unit spec or story `play` function in the matching folder). |
