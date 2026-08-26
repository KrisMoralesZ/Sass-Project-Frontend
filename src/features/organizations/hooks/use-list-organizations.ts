import { useQuery } from '@tanstack/react-query'
import { organizationsQueryOptions } from '../api/list-organizations'

export const useListOrganizations = () =>
  useQuery({
    ...organizationsQueryOptions(),
    retry: false,
  })
