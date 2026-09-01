import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/routes/paths'
import { logout } from '../api/logout'

/**
 * Signs out via `POST /auth/logout`, clears local session/org context,
 * and returns the user to the login screen.
 */
export function useLogout() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const signOut = useCallback(async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
      navigate(paths.login, { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, navigate])

  return { signOut, isLoggingOut }
}
