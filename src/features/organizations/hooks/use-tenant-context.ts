import { useQuery } from '@tanstack/react-query'
import { tenantContextQueryOptions } from '../api/get-tenant-context'

export const useTenantContext = (organizationId: string | null) =>
  useQuery({
    ...tenantContextQueryOptions(organizationId ?? ''),
    enabled: Boolean(organizationId),
  })
