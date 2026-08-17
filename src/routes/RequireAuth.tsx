import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from './paths'

/**
 * Blocks unauthenticated access to the app shell.
 * Redirects to login and preserves the intended destination.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuthSession()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
