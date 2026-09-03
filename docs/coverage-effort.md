# Frontend coverage effort

Two independent gates (same metrics: statements, branches, functions, lines):

| Suite         | Threshold | Measured files                                     | CI command                        |
| ------------- | --------- | -------------------------------------------------- | --------------------------------- |
| Unit (Vitest) | **70%**   | `src/lib`, `src/features`, `src/routes`, `App.tsx` | `npm run test:coverage:unit`      |
| Storybook     | **80%**   | `src/components`, `src/styles`                     | `npm run test:coverage:storybook` |

Storybook is higher because those files already have (or should have) interaction stories. Unit stays at 70% while auth/API specs are filled in. Add `src/pages/**` to the Storybook include in `vite.config.ts` when page stories exist.

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
- `src/pages/**` until page stories exist (then add them to the Storybook `include` in `vite.config.ts`)

Unit logic (`src/lib`, `src/features`, `src/routes`) is counted only in the 70% gate. Component `index.tsx` files rendered by stories are counted only in the 80% gate.

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

| Check                                                                                                                                                     | Unit (Vitest)                          | Storybook                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| Target                                                                                                                                                    | 70%                                    | 80%                                                          |
| Enforced in                                                                                                                                               | `vite.config.ts` when `--project=unit` | `vite.config.ts` when `--project=storybook`                  |
| CI step                                                                                                                                                   | job `quality` (`test:coverage:unit`)   | job `storybook` (`test:coverage:storybook`), after `quality` |
| When both reports are stably above their bars, keep this file as a checklist for new modules (unit spec or story `play` function in the matching folder). |
