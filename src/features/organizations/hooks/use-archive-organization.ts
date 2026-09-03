import { useMutation, useQueryClient } from '@tanstack/react-query'
import { archiveOrganization } from '../api/archive-organization'
import { organizationQueryKey } from '../api/get-organization'
import { tenantContextQueryKey } from '../api/get-tenant-context'
import {
  organizationsQueryKey,
  organizationsQueryOptions,
} from '../api/list-organizations'
import type { ListOrganizationsResponse } from '../api/organization-api.types'
import { getActiveOrganizationId } from '../active-organization-storage'
import {
  applyActiveOrganizationId,
  chooseActiveOrganizationId,
  omitOrganizationFromList,
} from '../restore-active-organization'

/**
 * `DELETE /organizations/:id` (soft archive). Backend requires OWNER.
 * After success, drop the org from the switcher list and replace or clear the
 * active workspace so it cannot remain selected (task 2.3.5).
 */
export const useArchiveOrganization = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => archiveOrganization(organizationId),
    onSuccess: () => {
      const listKey = organizationsQueryOptions().queryKey
      const currentList =
        queryClient.getQueryData<ListOrganizationsResponse>(listKey)

      if (currentList) {
        const nextList = omitOrganizationFromList(currentList, organizationId)
        queryClient.setQueryData(listKey, nextList)
        applyActiveOrganizationId(
          chooseActiveOrganizationId(
            getActiveOrganizationId(),
            nextList.items.map((organization) => organization.id),
          ),
        )
      } else if (getActiveOrganizationId() === organizationId) {
        applyActiveOrganizationId(null)
      }

      queryClient.removeQueries({
        queryKey: organizationQueryKey(organizationId),
      })
      queryClient.removeQueries({
        queryKey: tenantContextQueryKey(organizationId),
      })
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey[0] === 'members' &&
          query.queryKey[1] === organizationId,
      })
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
    },
  })
}
