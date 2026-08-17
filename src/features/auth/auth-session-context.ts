import { createContext } from 'react'

export interface AuthSessionContextValue {
  isAuthenticated: boolean
  /** Temporary until Phase 1 login/register wire-up. */
  enterDevPreviewSession: () => void
  clearSession: () => void
}

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(
  null,
)
