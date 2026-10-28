import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { OrganizationRole } from '../permissions/organization-role'
import { updateMemberRole } from '../api/update-member-role'

/**
 * `PATCH /members/:userId` — tenant-scoped; requires `member:update`
 * (backend-enforced, task 3.4). On success refreshes the active workspace's
 * member list and detail so role changes are reflected everywhere.
 */
export const useUpdateMemberRole = (organizationId: string, userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (role: OrganizationRole) => updateMemberRole(userId, role),
    onSuccess: () => {
      if (organizationId) {
        void queryClient.invalidateQueries({
          queryKey: ['members', organizationId],
        })
      }
    },
  })
}
