/**
 * Organization-scoped permissions for v1 RBAC.
 * Mirrors sass-backend `organization-permission.enum.ts`.
 */
export const OrganizationPermission = {
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',

  BOARD_CREATE: 'board:create',
  BOARD_READ: 'board:read',
  BOARD_UPDATE: 'board:update',
  BOARD_DELETE: 'board:delete',

  ISSUE_CREATE: 'issue:create',
  ISSUE_READ: 'issue:read',
  ISSUE_UPDATE: 'issue:update',
  ISSUE_DELETE: 'issue:delete',
  ISSUE_ASSIGN: 'issue:assign',
  ISSUE_MOVE: 'issue:move',

  INVITE_CREATE: 'invite:create',
  INVITE_READ: 'invite:read',
  INVITE_REVOKE: 'invite:revoke',

  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const

export type OrganizationPermission =
  (typeof OrganizationPermission)[keyof typeof OrganizationPermission]

export const ORGANIZATION_PERMISSIONS = Object.values(OrganizationPermission)

export function isOrganizationPermission(
  value: unknown,
): value is OrganizationPermission {
  return (
    typeof value === 'string' &&
    (ORGANIZATION_PERMISSIONS as string[]).includes(value)
  )
}
