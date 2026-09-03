# Frontend coverage effort (70% gate)

Vitest enforces **70%** statements, branches, functions, and lines (same bar as the backend). CI runs `npm run test:coverage`, which executes the **unit** project plus **Storybook** tests and fails the GitHub check if the threshold is missed.

Work this list **module by module**. Check an item off when its tests are in and `npm run test:coverage` still passes (or, until the first green run, when that module’s files are covered).

## Commands

| Script                       | What it does                                              |
| ---------------------------- | --------------------------------------------------------- |
| `npm run test:unit`          | Watch unit tests (`src/**/*.{test,spec}.{ts,tsx}`)        |
| `npm run test:unit:run`      | Single unit run (no Storybook / Playwright)               |
| `npm run test:storybook:run` | Storybook interaction tests only                          |
| `npm run test:coverage`      | All projects + V8 coverage + 70% threshold (what CI runs) |

Config lives in `vite.config.ts` (`test.coverage`). Coverage HTML is written to `coverage/` (gitignored).

## What is excluded from the denominator

These are not counted toward 70%:

- `*.stories.tsx`, `*.test.*`, `*.spec.*`
- `*.d.ts`, `src/types/**`
- `*.sc.tsx` (styled-components style files)
- `src/main.tsx` (bootstrap)

Logic, pages, layouts, hooks, and API helpers **are** counted.

## Suggested order

Do **lib + auth** first. They are high line-count, easy to unit-test, and the current Storybook suite does not exercise them. UI primitives already have stories; confirm they show up in the coverage report before spending time there.

---

## Tracker

### 1. lib / API client — unit tests (do first)

| Status | Area                 | Suggested spec                              | Notes                                                 |
| ------ | -------------------- | ------------------------------------------- | ----------------------------------------------------- |
| [ ]    | `ApiError`           | `src/lib/api/api-error.test.ts`             | Constructor, `fromErrorBody`, array vs string message |
| [ ]    | Error message helper | `src/lib/api/get-api-error-message.test.ts` | Envelope vs network vs unknown                        |
| [ ]    | Refresh interceptor  | `src/lib/api/refresh-interceptor.test.ts`   | 401 retry, queue, logout on failure                   |
| [ ]    | API client           | `src/lib/api/api-client.test.ts`            | Mock axios; auth header + org header                  |
| [ ]    | Env                  | `src/lib/env.test.ts`                       | `VITE_API_URL` missing / present                      |
| [ ]    | Query client         | `src/lib/query-client.test.ts`              | Default options if any logic exists                   |
| [ ]    | `AppQueryProvider`   | skip or thin render test                    | Mostly wiring; low ROI                                |

**Effort:** ~1–1.5 days. This is the largest coverage gap.

### 2. Auth + organization session — unit tests

| Status | Area                             | Suggested spec                                                   | Notes                                           |
| ------ | -------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| [ ]    | Session storage                  | `src/features/auth/session-storage.test.ts`                      | Stub `sessionStorage`; get/set/clear/hasSession |
| [ ]    | Session events                   | `src/features/auth/session-events.test.ts`                       | Subscribe / emit                                |
| [ ]    | `useAuthSession`                 | `src/features/auth/useAuthSession.test.ts`                       | Throw outside provider; happy path              |
| [ ]    | `AuthSessionProvider`            | `src/features/auth/AuthSessionProvider.test.tsx`                 | establish / clear session                       |
| [ ]    | `get-current-user`               | `src/features/auth/api/get-current-user.test.ts`                 | Mock api client                                 |
| [ ]    | Active org storage               | `src/features/organizations/active-organization-storage.test.ts` | Same pattern as session storage                 |
| [ ]    | `auth-api.types` / context files | skip                                                             | Types and context objects only                  |

**Effort:** ~1 day. `sessionStorage` tests need a `window` stub (or switch the unit project to `happy-dom` later).

### 3. Routes — unit tests

| Status | Area           | Suggested spec                     | Notes                                           |
| ------ | -------------- | ---------------------------------- | ----------------------------------------------- |
| [ ]    | `RequireAuth`  | `src/routes/RequireAuth.test.tsx`  | Redirect when logged out; render outlet when in |
| [ ]    | `RequireGuest` | `src/routes/RequireGuest.test.tsx` | Opposite of RequireAuth                         |
| [ ]    | `paths`        | `src/routes/paths.test.ts`         | Optional; tiny constants                        |
| [ ]    | `AppRoutes`    | skip or Storybook                  | Composition; better covered via page stories    |

**Effort:** ~0.5 day. Wrap with `MemoryRouter` + a stub session provider.

### 4. Pages — Storybook (or RTL)

| Status | Area        | Suggested story / spec                  | Notes                                                   |
| ------ | ----------- | --------------------------------------- | ------------------------------------------------------- |
| [ ]    | Login       | `src/pages/LoginPage.stories.tsx`       | Heading, guest layout, preview control if still present |
| [ ]    | Register    | `src/pages/RegisterPage.stories.tsx`    | Restore if removed; field errors if the form exists     |
| [ ]    | Home        | `src/pages/HomePage.stories.tsx`        | Authenticated shell                                     |
| [ ]    | Not found   | `src/pages/NotFoundPage.stories.tsx`    |                                                         |
| [ ]    | Placeholder | `src/pages/PlaceholderPage.stories.tsx` | Title/description props                                 |

**Effort:** ~0.5–1 day.

### 5. Layouts — Storybook already started

| Status | Area                     | Existing                            | Remaining                                                                                                                                                     |
| ------ | ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ]    | `PublicLayout/` (folder) | `PublicLayout.stories.tsx`          | Confirm coverage of `index.tsx` in the report                                                                                                                 |
| [ ]    | `AppLayout/` (folder)    | `AppLayout.stories.tsx`             | Same; exercise nav + sign out if not already in `play`                                                                                                        |
| [ ]    | Duplicate shells         | `AppLayout.tsx`, `PublicLayout.tsx` | `AppRoutes` still imports these files. Either add stories/tests for **them**, or delete the duplicates and import the folder modules so coverage is not split |

**Effort:** ~0.5 day (mostly deciding what to do with the duplicate files).

### 6. UI primitives — Storybook already started

Stories exist. Mark done only after `npm run test:coverage` shows the `index.tsx` files above 70% (style files are excluded).

| Status | Component | Story                   |
| ------ | --------- | ----------------------- |
| [ ]    | Button    | `Button.stories.tsx`    |
| [ ]    | Input     | `Input.stories.tsx`     |
| [ ]    | FormField | `FormField.stories.tsx` |
| [ ]    | Dialog    | `Dialog.stories.tsx`    |
| [ ]    | Table     | `Table.stories.tsx`     |
| [ ]    | Toast     | `Toast.stories.tsx`     |
| [ ]    | Theme     | `Theme.stories.tsx`     |

**Effort:** ~0.5 day to fill missing `play` functions / states, if the report still shows holes.

### 7. App shell / styles leftover

| Status | Area                                            | Notes                                                                       |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------------- |
| [ ]    | `App.tsx`                                       | Thin; covered if a page story mounts the tree, or a one-liner unit test     |
| [ ]    | `AppThemeProvider` / `GlobalStyle` / `media.ts` | Theme story may be enough; `media.ts` is a good tiny unit spec if uncovered |

**Effort:** ~1–2 hours.

---

## File conventions

- **Logic** (api, storage, env, interceptors): colocated `*.test.ts` in the unit project.
- **React that needs a browser:** prefer a Storybook `play` function next to the component. Use `*.test.tsx` only when Storybook is the wrong tool (guards, providers).
- Do not add specs for `*.sc.tsx` or `src/types/**`.

## Gate status

| Check       | Value                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| Target      | 70% statements / branches / functions / lines                                                                         |
| Enforced in | `vite.config.ts` → `test.coverage.thresholds`                                                                         |
| CI step     | `npm run test:coverage` in `.github/workflows/ci.yml`                                                                 |
| Today       | No unit specs. Nine Storybook files. First `test:coverage` run on `main` will fail until sections 1–3 (at least) land |

When the report is stably above 70%, keep this file as a checklist for new modules (same rule: new feature folder ships with a `*.test.ts` or a story `play` function).
