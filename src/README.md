# Source layout

```
src/
  assets/          Static images/icons imported by the app
  components/      Shared UI building blocks (not domain-specific)
    layout/        Shells, nav, page frames (`PublicLayout`, `AppLayout`)
    ui/            Primitives (button, input, dialog, …)
  features/        Domain modules (auth, orgs, members, …)
  hooks/           Shared React hooks
  lib/             Cross-cutting utilities (env, api, storage)
  pages/           Route-level screens composed from features/components
  routes/          React Router route trees and guards
  styles/          Global CSS / theme entry points
  types/           Shared TypeScript types (API envelope, etc.)
```

## Routing (task 0.1.3)

| Area | Paths | Shell / guard |
|---|---|---|
| Guest | `/login`, `/register` | `RequireGuest` → `PublicLayout` |
| App | `/`, `/projects`, `/members`, `/settings` | `RequireAuth` → `AppLayout` |

Unauthenticated visits to app routes redirect to `/login`. Until Phase 1 auth is wired, use **Preview app shell** on the login page to enter a temporary session.

Import with the `@/` alias (e.g. `@/features/auth`, `@/components/ui`).
