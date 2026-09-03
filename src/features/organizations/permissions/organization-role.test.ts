import { describe, expect, it } from 'vitest'
import { hasMinRole, OrganizationRole } from './organization-role'

describe('hasMinRole', () => {
  it('allows only OWNER to meet the OWNER minimum used by archive', () => {
    expect(hasMinRole(OrganizationRole.OWNER, OrganizationRole.OWNER)).toBe(
      true,
    )
    expect(hasMinRole(OrganizationRole.ADMIN, OrganizationRole.OWNER)).toBe(
      false,
    )
    expect(hasMinRole(OrganizationRole.MEMBER, OrganizationRole.OWNER)).toBe(
      false,
    )
    expect(hasMinRole(OrganizationRole.VIEWER, OrganizationRole.OWNER)).toBe(
      false,
    )
  })
})
