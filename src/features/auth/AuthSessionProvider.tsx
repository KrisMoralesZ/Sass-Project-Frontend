import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearActiveOrganizationId } from '@/features/organizations'
import type { AuthUserProfile } from './auth-api.types'
import {
  AuthSessionContext,
  type AuthSessionStatus,
  type EstablishSessionTokens,
} from './auth-session-context'
import { subscribeSessionCleared } from './session-events'
import {
  clearSessionTokens,
  hasSession,
  setDevPreviewSession,
  setSessionTokens,
} from './session-storage'

function initialStatus(): AuthSessionStatus {
  // Hydrate (`GET /auth/me`) lands in 1.1.4; until then, tokens ⇒ authenticated.
  return hasSession() ? 'authenticated' : 'anonymous'
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthSessionStatus>(initialStatus)
  const [user, setUser] = useState<AuthUserProfile | null>(null)

  const resetToAnonymous = useCallback(() => {
    setUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    return subscribeSessionCleared(() => {
      resetToAnonymous()
    })
  }, [resetToAnonymous])

  const establishSession = useCallback(
    (
      tokens: EstablishSessionTokens,
      nextUser: AuthUserProfile | null = null,
    ) => {
      setSessionTokens(tokens)
      setUser(nextUser)
      setStatus('authenticated')
    },
    [],
  )

  const clearSession = useCallback(() => {
    clearSessionTokens()
    clearActiveOrganizationId()
    resetToAnonymous()
  }, [resetToAnonymous])

  const enterDevPreviewSession = useCallback(() => {
    setDevPreviewSession()
    setUser(null)
    setStatus('authenticated')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      establishSession,
      clearSession,
      enterDevPreviewSession,
    }),
    [
      user,
      status,
      establishSession,
      clearSession,
      enterDevPreviewSession,
    ],
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
