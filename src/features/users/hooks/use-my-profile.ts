import { useQuery } from '@tanstack/react-query'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { myProfileQueryOptions } from '../api/get-my-profile'

/** Current user profile (`GET /users/me`); idle until the session is authenticated. */
export const useMyProfile = () => {
  const { isAuthenticated } = useAuthSession()

  return useQuery({
    ...myProfileQueryOptions(),
    enabled: isAuthenticated,
    retry: false,
  })
}
