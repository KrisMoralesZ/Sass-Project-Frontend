import type { QueryClient } from '@tanstack/react-query'
import { currentUserQueryKey } from '@/features/auth/api/get-current-user'
import type { AuthUserProfile } from '@/features/auth/auth-api.types'
import { myProfileQueryKey } from './api/get-my-profile'
import type { UserProfile } from './api/user-api.types'

/** Refresh profile caches and auth session display name after `PATCH /users/me`. */
export function syncProfileAfterUpdate(
  queryClient: QueryClient,
  syncSessionUserDisplayName: (displayName: string | null) => void,
  profile: UserProfile,
): void {
  queryClient.setQueryData(myProfileQueryKey, profile)
  queryClient.setQueryData<AuthUserProfile | undefined>(
    currentUserQueryKey,
    (current) =>
      current ? { ...current, displayName: profile.displayName } : current,
  )
  syncSessionUserDisplayName(profile.displayName)
}
