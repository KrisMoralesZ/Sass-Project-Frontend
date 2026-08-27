import type { FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from './paths'

/**
 * Blocks unauthenticated access to the app shell.
 * Redirects to login and preserves the intended destination.
 */
const RequireAuth: FC = () => {
  const { isAuthenticated } = useAuthSession()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
