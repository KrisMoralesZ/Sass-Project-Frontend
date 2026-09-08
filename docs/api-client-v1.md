# API client and query layer (v1)

Conventions for **task 0.3** — how feature modules talk to the Nest API.

## Rules

1. **Only** call the backend through `apiClient` from `@/lib` (or a feature `api/` helper that wraps it).
2. Do **not** import `axios` or use raw `fetch` in feature/UI code.
3. Prefer **TanStack Query** (`useQuery` / `useMutation` / `queryOptions`) for server state. The app is wrapped in `AppQueryProvider`.
4. Surface failures with `getApiErrorMessage(error)` (and optionally `isApiError`).
5. Paths are relative to `/api/v1` (from `VITE_API_URL` via `getApiUrl()`).

## What the client already does

| Concern                           | Location                                     |
| --------------------------------- | -------------------------------------------- |
| Envelope unwrap (`data`)          | `apiClient`                                  |
| Typed failures                    | `ApiError`                                   |
| Bearer + `X-Organization-Id`      | request interceptor                          |
| 401 → refresh → retry once        | response interceptor                         |
| User-facing copy for `error.code` | `getApiErrorMessage` / `getErrorCodeMessage` |

## Transparent refresh (task 1.3.4)

When an authenticated request gets **401**, the interceptor:

1. Calls `POST /auth/refresh` with `{ refreshToken }` (single-flight if several requests fail together).
2. Writes the new access + refresh tokens to `sessionStorage`.
3. Retries the original request once with `Authorization: Bearer <new access>`.

A **successful** refresh is invisible in the product UI: no toast, no login redirect, no session-expired banner. `notifySessionCleared` / `SessionExpiredRecovery` run only when refresh **fails** (task **1.3.3**).

### Manual QA (short-lived access tokens)

Default access TTL is `15m` (`JWT_ACCESS_EXPIRES_IN` in the backend `.env`). To watch refresh during normal browsing:

1. In `sass-backend/.env`, set `JWT_ACCESS_EXPIRES_IN=15s` (keep refresh TTL long, e.g. `7d`) and restart the API.
2. Sign in on the SPA (seed user `owner@acme.local` / `Password1` is fine).
3. Stay on an authenticated route (`/`, `/projects`, …) and wait past 15s, then trigger another API call (navigate, or hard-refresh the app so `GET /auth/me` runs).
4. In DevTools → Network: expect `401` on the original call, then `POST /api/v1/auth/refresh` **200**, then the retried call **200**.
5. Confirm you remain in the app shell with **no** “Session expired” toast and **no** bounce to `/login`.
6. Restore `JWT_ACCESS_EXPIRES_IN=15m` when finished.

Unit coverage for the silent-success contract: `src/lib/api/refresh-interceptor.test.ts` (`npm run test:unit`).

## Feature layout

```
src/features/<domain>/
  api/           # thin functions + queryOptions (no React)
  hooks/         # useQuery / useMutation wrappers (optional)
  components/    # UI
```

## Query example

```ts
import { queryOptions, useQuery } from '@tanstack/react-query'
import { apiClient, getApiErrorMessage } from '@/lib'
import type { AuthUserProfile } from '@/features/auth'

export function getCurrentUser() {
  return apiClient.get<AuthUserProfile>('/auth/me')
}

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'me'] as const,
    queryFn: getCurrentUser,
  })

// In a component:
const { data, error, isPending } = useQuery(currentUserQueryOptions())
if (error) return <p>{getApiErrorMessage(error)}</p>
```

## Mutation example

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, getApiErrorMessage } from '@/lib'

const queryClient = useQueryClient()
const login = useMutation({
  mutationFn: (body: { email: string; password: string }) =>
    apiClient.post('/auth/login', body),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
  },
  onError: (error) => {
    console.error(getApiErrorMessage(error))
  },
})
```

## Active workspace

Set the tenant header with `setActiveOrganizationId(id)` from `@/features/organizations`. Clear happens on logout / failed refresh. Full switcher UI is Phase 2.

## Smoke helper

A minimal live call lives at `src/features/auth/api/get-current-user.ts` for Phase 1 to reuse (`GET /auth/me`). Do not wire it into screens until auth UI lands.

## Out of scope here

- Org create/switcher (**2.x**)
