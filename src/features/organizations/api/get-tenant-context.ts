import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'

export interface TenantContext {
  organizationId: string
}

export function getTenantContext() {
  return apiClient.get<TenantContext>('/tenant/context')
}

export const tenantContextQueryKey = (organizationId: string) =>
  ['tenant', 'context', organizationId] as const

export const tenantContextQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: tenantContextQueryKey(organizationId),
    queryFn: getTenantContext,
    enabled: organizationId.length > 0,
    retry: false,
  })
