import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationsQueryKey } from '../api/list-organizations'
import { createOrganization } from '../api/create-organization'

export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey })
    },
  })
}
