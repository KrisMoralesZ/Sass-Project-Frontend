import { apiClient } from '@/lib/api/api-client'
import type { OrganizationRole } from '../permissions/organization-role'
import type { OrganizationMember } from './get-member'

/** Mirrors backend `UpdateOrganizationMemberRoleDto` (task 3.4). */
export interface UpdateMemberRoleRequest {
  role: OrganizationRole
}

export function updateMemberRole(
  userId: string,
  role: OrganizationRole,
): Promise<OrganizationMember> {
  return apiClient.patch<OrganizationMember>(`/members/${userId}`, {
    role,
  } satisfies UpdateMemberRoleRequest)
}
