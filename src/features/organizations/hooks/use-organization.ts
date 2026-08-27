import { useQuery } from '@tanstack/react-query'
import { organizationQueryOptions } from '../api/get-organization'

/** Organization detail for the active workspace; idle without an id. */
export const useOrganization = (organizationId: string | null) =>
  useQuery({
    ...organizationQueryOptions(organizationId ?? ''),
    enabled: Boolean(organizationId),
    retry: false,
  })
