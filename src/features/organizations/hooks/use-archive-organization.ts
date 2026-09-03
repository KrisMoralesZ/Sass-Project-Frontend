import { useMutation, useQueryClient } from '@tanstack/react-query'
import { archiveOrganization } from '../api/archive-organization'
import { organizationQueryKey } from '../api/get-organization'
import { organizationsQueryKey } from '../api/list-organizations'

/**
 * `DELETE /organizations/:id` (soft archive). Backend requires OWNER.
 * Task 2.3.5 replaces the active workspace after a successful archive.
 */
export const useArchiveOrganization = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => archiveOrganization(organizationId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: organizationQueryKey(organizationId),
      })
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
    },
  })
}
