import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInvitation } from '../api/create-invitation'
import { invitationsQueryKey } from '../api/list-invitations'

/**
 * `POST /invites` — tenant-scoped; requires `invite:create` (backend-enforced).
 * On success refreshes the pending-invites list for the active workspace so the
 * revoke UI (task 3.4.3) sees the new record.
 */
export const useCreateInvitation = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: invitationsQueryKey(organizationId),
        })
      }
    },
  })
}
