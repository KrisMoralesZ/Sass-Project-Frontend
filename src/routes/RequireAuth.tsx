import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from './paths'

/**
 * Blocks unauthenticated access to the app shell.
 * Redirects to login and preserves the intended destination.
 * Waits on session hydrate so a hard refresh does not flash to login.
 */
export function RequireAuth() {
  const { status, isAuthenticated } = useAuthSession()
  const location = useLocation()

  if (status === 'loading') {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
