import { useCallback, useMemo, useState, type FC, type ReactNode } from 'react'
import { AuthSessionContext } from './auth-session-context'
import {
  clearSessionTokens,
  hasSession,
  setDevPreviewSession,
} from './session-storage'

const AuthSessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasSession())

  const enterDevPreviewSession = useCallback(() => {
    setDevPreviewSession()
    setIsAuthenticated(true)
  }, [])

  const clearSession = useCallback(() => {
    clearSessionTokens()
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

export default AuthSessionProvider
