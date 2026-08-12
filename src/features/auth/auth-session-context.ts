import { createContext } from 'react'
import type { AuthTokens, AuthUserProfile } from './auth-api.types'

export type AuthSessionStatus = 'anonymous' | 'loading' | 'authenticated'

export type EstablishSessionTokens = Pick<
  AuthTokens,
  'accessToken' | 'refreshToken'
>

export interface AuthSessionContextValue {
  /** Current signed-in profile; null until hydrate (1.1.4) or login sets it. */
  user: AuthUserProfile | null
  status: AuthSessionStatus
  /** Convenience: `status === 'authenticated'`. */
  isAuthenticated: boolean
  /**
   * Persist tokens and mark the session authenticated.
   * Pass `user` when login/register already returned a profile; omit until hydrate.
   */
  establishSession: (
    tokens: EstablishSessionTokens,
    user?: AuthUserProfile | null,
  ) => void
  clearSession: () => void
  /** Temporary until Phase 1 login/register wire-up (retire in 1.1.7). */
  enterDevPreviewSession: () => void
}

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(
  null,
)
