import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationsQueryKey } from '@/features/organizations/api/list-organizations'
import { acceptInvitation } from '../api/accept-invitation'
import type { AcceptInvitationResponse } from '../api/invitation-api.types'

/**
 * `POST /invites/accept` — authenticated but not tenant-scoped (the organization
 * comes from the invitation). On success the join shows up in the organization
 * list, so the switcher cache is invalidated; the caller decides whether the
 * new workspace becomes active.
 */
export const useAcceptInvitation = (options?: {
  onAccepted?: (data: AcceptInvitationResponse) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
      options?.onAccepted?.(data)
    },
  })
}
