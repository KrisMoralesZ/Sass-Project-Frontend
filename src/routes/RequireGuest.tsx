import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from './paths'

/**
 * Keeps signed-in users out of guest-only screens (login/register).
 */
export function RequireGuest() {
  const { isAuthenticated } = useAuthSession()

  if (isAuthenticated) {
    return <Navigate to={paths.home} replace />
  }

  return <Outlet />
}
