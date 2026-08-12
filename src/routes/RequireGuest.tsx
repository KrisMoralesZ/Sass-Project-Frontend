import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import { paths } from './paths'

/**
 * Keeps signed-in users out of guest-only screens (login/register).
 * Waits on session hydrate so a hard refresh does not bounce through login.
 */
export function RequireGuest() {
  const { status, isAuthenticated } = useAuthSession()

  if (status === 'loading') {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={paths.home} replace />
  }

  return <Outlet />
}
