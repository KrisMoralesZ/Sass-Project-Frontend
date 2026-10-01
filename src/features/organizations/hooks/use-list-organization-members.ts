import { useQuery } from '@tanstack/react-query'
import {
  organizationMembersQueryOptions,
  type ListOrganizationMembersQuery,
} from '../api/list-members'

/** Paginated workspace members (`GET /members`); idle without an org id. */
export const useListOrganizationMembers = (
  organizationId: string | null,
  query?: ListOrganizationMembersQuery,
) =>
  useQuery({
    ...organizationMembersQueryOptions(organizationId ?? '', query),
    retry: false,
  })
