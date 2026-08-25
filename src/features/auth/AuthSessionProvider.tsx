import { useQueryClient } from '@tanstack/react-query'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { clearActiveOrganizationId } from '@/features/organizations'
import {
  currentUserQueryKey,
  currentUserQueryOptions,
} from './api/get-current-user'
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
  setSessionTokens,
} from './session-storage'
import { notifySessionCleared } from './session-events'

function initialStatus(): AuthSessionStatus {
  return hasSession() ? 'loading' : 'anonymous'
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<AuthSessionStatus>(initialStatus)
  const [user, setUser] = useState<AuthUserProfile | null>(null)
  /** Bumped to ignore in-flight hydrate after establish/clear. */
  const sessionEpochRef = useRef(0)

  const resetToAnonymous = useCallback(() => {
    sessionEpochRef.current += 1
    setUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    return subscribeSessionCleared(() => {
      resetToAnonymous()
    })
  }, [resetToAnonymous])

  useEffect(() => {
    if (!hasSession()) {
      return
    }

    const epoch = sessionEpochRef.current
    let cancelled = false

    void (async () => {
      try {
        const profile = await queryClient.fetchQuery({
          ...currentUserQueryOptions(),
          retry: false,
        })

        if (cancelled || epoch !== sessionEpochRef.current) {
          return
        }

        setUser(profile)
        setStatus('authenticated')
      } catch {
        if (cancelled || epoch !== sessionEpochRef.current) {
          return
        }

        clearSessionTokens()
        clearActiveOrganizationId()
        await queryClient.invalidateQueries({
          queryKey: ['auth'],
          refetchType: 'none',
        })
        queryClient.removeQueries({ queryKey: currentUserQueryKey })
        setUser(null)
        setStatus('anonymous')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [queryClient])

  const establishSession = useCallback(
    (
      tokens: EstablishSessionTokens,
      nextUser: AuthUserProfile | null = null,
    ) => {
      sessionEpochRef.current += 1
      setSessionTokens(tokens)
      setUser(nextUser)
      setStatus('authenticated')
    },
    [],
  )

  const clearSession = useCallback(() => {
    clearSessionTokens()
    clearActiveOrganizationId()
    queryClient.removeQueries({ queryKey: currentUserQueryKey })
    notifySessionCleared('logout')
    resetToAnonymous()
  }, [queryClient, resetToAnonymous])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      establishSession,
      clearSession,
    }),
    [user, status, establishSession, clearSession],
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
