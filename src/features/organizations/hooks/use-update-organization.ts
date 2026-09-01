import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationQueryKey } from '../api/get-organization'
import { organizationsQueryKey } from '../api/list-organizations'
import { updateOrganization } from '../api/update-organization'
import type { UpdateOrganizationRequest } from '../api/organization-api.types'

/**
 * `PATCH /organizations/:id` for settings and profile fields (task 2.3.1).
 * Refreshes the organization detail cache and the switcher list on success.
 */
export const useUpdateOrganization = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateOrganizationRequest) =>
      updateOrganization(organizationId, body),
    onSuccess: (organization) => {
      queryClient.setQueryData(
        organizationQueryKey(organizationId),
        organization,
      )
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
    },
  })
}
