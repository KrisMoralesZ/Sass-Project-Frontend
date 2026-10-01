import { useQuery } from '@tanstack/react-query'
import type { ListInvitationsQuery } from '../api/invitation-api.types'
import { invitationsQueryOptions } from '../api/list-invitations'

/** Paginated invitations (`GET /invites`); idle without an org id. */
export const useListInvitations = (
  organizationId: string | null,
  query?: ListInvitationsQuery,
) =>
  useQuery({
    ...invitationsQueryOptions(organizationId ?? '', query),
    retry: false,
  })