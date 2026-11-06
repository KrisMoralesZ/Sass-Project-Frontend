import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationMemberQueryKey } from '../api/get-member'
import { removeMember } from '../api/remove-member'

/**
 * `DELETE /members/:userId` — tenant-scoped; requires `member:update`.
 * Refreshes the active workspace's member list and removes the stale detail.
 */
export const useRemoveMember = (organizationId: string, userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeMember(userId),
    onSuccess: () => {
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: ['members', organizationId],
        })
        queryClient.removeQueries({
          queryKey: organizationMemberQueryKey(organizationId, userId),
          exact: true,
        })
      }
    },
  })
}
