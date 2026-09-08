import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { OrganizationRole } from '../permissions/organization-role'

/** Mirrors backend `OrganizationMemberResponse` (dates as ISO strings). */
export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: OrganizationRole
  email: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export function getOrganizationMember(userId: string) {
  return apiClient.get<OrganizationMember>(`/members/${userId}`)
}

export const organizationMemberQueryKey = (
  organizationId: string,
  userId: string,
) => ['members', organizationId, userId] as const

export const organizationMemberQueryOptions = (
  organizationId: string,
  userId: string,
) =>
  queryOptions({
    queryKey: organizationMemberQueryKey(organizationId, userId),
    queryFn: () => getOrganizationMember(userId),
    enabled: organizationId.length > 0 && userId.length > 0,
  })
