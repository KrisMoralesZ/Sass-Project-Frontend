import { useQuery } from '@tanstack/react-query'
import { hasSession } from '@/features/auth/session-storage'
import { organizationsQueryOptions } from '../api/list-organizations'

export const useListOrganizations = () =>
  useQuery({
    ...organizationsQueryOptions(),
    retry: false,
    enabled: hasSession(),
  })
