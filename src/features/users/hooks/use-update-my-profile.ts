import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthSession } from '@/features/auth/useAuthSession'
import { updateMyProfile } from '../api/update-my-profile'
import type { UpdateUserProfileRequest } from '../api/user-api.types'
import { syncProfileAfterUpdate } from '../sync-profile-session'

/**
 * `PATCH /users/me` for profile settings (task 3.1.2).
 * Refreshes the profile cache and keeps auth session display name in sync.
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()
  const { syncSessionUserDisplayName } = useAuthSession()

  return useMutation({
    mutationFn: (body: UpdateUserProfileRequest) => updateMyProfile(body),
    onSuccess: (profile) => {
      syncProfileAfterUpdate(queryClient, syncSessionUserDisplayName, profile)
    },
  })
}
