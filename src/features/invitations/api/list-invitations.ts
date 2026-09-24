import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type {
  ListInvitationsQuery,
  ListInvitationsResponse,
} from './invitation-api.types'

/**
 * `GET /invites` — tenant-scoped; requires `invite:read`.
 * Backend defaults the list to `pending` (derived expiry is returned as `expired`).
 */
export function listInvitations(query?: ListInvitationsQuery) {
  return apiClient.get<ListInvitationsResponse>('/invites', {
    params: query,
  })
}

export const invitationsQueryKey = (
  organizationId: string,
  query?: ListInvitationsQuery,
) => ['invites', organizationId, query] as const

export const invitationsQueryOptions = (
  organizationId: string,
  query?: ListInvitationsQuery,
) =>
  queryOptions({
    queryKey: invitationsQueryKey(organizationId, query),
    queryFn: () => listInvitations(query),
    enabled: organizationId.length > 0,
  })
