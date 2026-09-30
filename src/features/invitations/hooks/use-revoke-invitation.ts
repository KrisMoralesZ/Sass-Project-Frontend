import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invitationsQueryKey } from '../api/list-invitations'
import { revokeInvitation } from '../api/revoke-invitation'

/**
 * `POST /invites/:id/revoke` — tenant-scoped; requires `invite:revoke`
 * (backend-enforced). On success refreshes the invitations list for the active
 * workspace so the pending-invites section (task 3.4.3) stays current.
 */
export const useRevokeInvitation = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: invitationsQueryKey(organizationId),
        })
      }
    },
  })
}