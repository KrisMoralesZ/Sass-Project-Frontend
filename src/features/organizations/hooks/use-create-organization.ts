import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  organizationsQueryKey,
  organizationsQueryOptions,
} from '../api/list-organizations'
import { createOrganization } from '../api/create-organization'
import type { ListOrganizationsResponse } from '../api/organization-api.types'

export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: (organization) => {
      queryClient.setQueryData<ListOrganizationsResponse>(
        organizationsQueryOptions().queryKey,
        (current) =>
          current
            ? {
                ...current,
                items: [organization, ...current.items],
                pagination: {
                  ...current.pagination,
                  total: current.pagination.total + 1,
                },
              }
            : current,
      )
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
    },
  })
}
