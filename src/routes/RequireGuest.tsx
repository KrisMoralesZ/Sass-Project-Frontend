import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { paths } from './paths'

/**
 * Keeps signed-in users out of guest-only screens (login/register).
 */
const RequireGuest: FC = () => {
  const { isAuthenticated } = useAuthSession()

  if (isAuthenticated) {
    return <Navigate to={paths.home} replace />
  }

  return <Outlet />
}

export default RequireGuest
