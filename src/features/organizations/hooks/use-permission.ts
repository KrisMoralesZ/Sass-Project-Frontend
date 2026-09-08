import { OrganizationPermission } from '../permissions/organization-permission'
import { roleHasPermission } from '../permissions/organization-permission-matrix'
import { isOrganizationRole } from '../permissions/organization-role'
import { useCurrentOrganizationMember } from './use-current-organization-member'

/**
 * Client-side permission check for the active workspace (task 2.3.2 / 3.3).
 * Backend guards remain the source of truth; this only hides or disables UI.
 */
export function usePermission(permission: OrganizationPermission) {
  const memberQuery = useCurrentOrganizationMember()
  const role =
    memberQuery.data && isOrganizationRole(memberQuery.data.role)
      ? memberQuery.data.role
      : null

  return {
    isPending: memberQuery.isPending,
    isError: memberQuery.isError,
    error: memberQuery.error,
    role,
    allowed: role !== null && roleHasPermission(role, permission),
  }
}
