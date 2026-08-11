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

- Login/register screens (**1.2**)
- Session-expired UX (**1.3**)
- Org create/switcher (**2.x**)
