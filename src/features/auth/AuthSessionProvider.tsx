import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearActiveOrganizationId } from '@/features/organizations'
import { AuthSessionContext } from './auth-session-context'
import { subscribeSessionCleared } from './session-events'
import {
  clearSessionTokens,
  hasSession,
  setDevPreviewSession,
} from './session-storage'

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasSession())

  useEffect(() => {
    return subscribeSessionCleared(() => {
      setIsAuthenticated(false)
    })
  }, [])

  const enterDevPreviewSession = useCallback(() => {
    setDevPreviewSession()
    setIsAuthenticated(true)
  }, [])

  const clearSession = useCallback(() => {
    clearSessionTokens()
    clearActiveOrganizationId()
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      enterDevPreviewSession,
      clearSession,
    }),
    [isAuthenticated, enterDevPreviewSession, clearSession],
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
