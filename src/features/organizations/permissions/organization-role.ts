/**
 * Base organization roles (v1). Hierarchy: OWNER > ADMIN > MEMBER > VIEWER.
 * Mirrors sass-backend `organization-role.enum.ts`.
 */
export const OrganizationRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
} as const

export type OrganizationRole =
  (typeof OrganizationRole)[keyof typeof OrganizationRole]

export const ORGANIZATION_ROLES = [
  OrganizationRole.OWNER,
  OrganizationRole.ADMIN,
  OrganizationRole.MEMBER,
  OrganizationRole.VIEWER,
] as const

const ORGANIZATION_ROLE_RANK: Record<OrganizationRole, number> = {
  [OrganizationRole.OWNER]: 400,
  [OrganizationRole.ADMIN]: 300,
  [OrganizationRole.MEMBER]: 200,
  [OrganizationRole.VIEWER]: 100,
}

export function isOrganizationRole(value: unknown): value is OrganizationRole {
  return (
    typeof value === 'string' &&
    (ORGANIZATION_ROLES as readonly string[]).includes(value)
  )
}

export function hasMinRole(
  role: OrganizationRole,
  minimumRole: OrganizationRole,
): boolean {
  return ORGANIZATION_ROLE_RANK[role] >= ORGANIZATION_ROLE_RANK[minimumRole]
}
