import { OrganizationPermission } from './organization-permission'
import { OrganizationRole } from './organization-role'

const ALL_PERMISSIONS = Object.values(OrganizationPermission)

const VIEWER_PERMISSIONS: OrganizationPermission[] = [
  OrganizationPermission.PROJECT_READ,
  OrganizationPermission.BOARD_READ,
  OrganizationPermission.ISSUE_READ,
  OrganizationPermission.SETTINGS_READ,
]

const MEMBER_PERMISSIONS: OrganizationPermission[] = [
  ...VIEWER_PERMISSIONS,
  OrganizationPermission.PROJECT_CREATE,
  OrganizationPermission.PROJECT_UPDATE,
  OrganizationPermission.BOARD_CREATE,
  OrganizationPermission.BOARD_UPDATE,
  OrganizationPermission.ISSUE_CREATE,
  OrganizationPermission.ISSUE_UPDATE,
  OrganizationPermission.ISSUE_DELETE,
  OrganizationPermission.ISSUE_ASSIGN,
  OrganizationPermission.ISSUE_MOVE,
]

const ADMIN_PERMISSIONS: OrganizationPermission[] = [
  ...MEMBER_PERMISSIONS,
  OrganizationPermission.PROJECT_DELETE,
  OrganizationPermission.BOARD_DELETE,
  OrganizationPermission.INVITE_CREATE,
  OrganizationPermission.INVITE_READ,
  OrganizationPermission.INVITE_REVOKE,
  OrganizationPermission.SETTINGS_UPDATE,
]

/**
 * Role → permission matrix for v1.
 * OWNER inherits every permission. Lower roles receive explicit subsets.
 */
export const ORGANIZATION_PERMISSION_MATRIX: Record<
  OrganizationRole,
  ReadonlySet<OrganizationPermission>
> = {
  [OrganizationRole.OWNER]: new Set(ALL_PERMISSIONS),
  [OrganizationRole.ADMIN]: new Set(ADMIN_PERMISSIONS),
  [OrganizationRole.MEMBER]: new Set(MEMBER_PERMISSIONS),
  [OrganizationRole.VIEWER]: new Set(VIEWER_PERMISSIONS),
}

export function roleHasPermission(
  role: OrganizationRole,
  permission: OrganizationPermission,
): boolean {
  return ORGANIZATION_PERMISSION_MATRIX[role].has(permission)
}
