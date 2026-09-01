import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { Organization } from './organization-api.types'

export function getOrganization(organizationId: string) {
  return apiClient.get<Organization>(`/organizations/${organizationId}`)
}

export const organizationQueryKey = (organizationId: string) =>
  ['organizations', organizationId] as const

export const organizationQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: organizationQueryKey(organizationId),
    queryFn: () => getOrganization(organizationId),
  })
