import { describe, expect, it } from 'vitest'
import { OrganizationPermission } from './organization-permission'
import { roleHasPermission } from './organization-permission-matrix'
import { OrganizationRole } from './organization-role'

describe('roleHasPermission', () => {
  it('allows OWNER and ADMIN to update settings', () => {
    expect(
      roleHasPermission(
        OrganizationRole.OWNER,
        OrganizationPermission.SETTINGS_UPDATE,
      ),
    ).toBe(true)
    expect(
      roleHasPermission(
        OrganizationRole.ADMIN,
        OrganizationPermission.SETTINGS_UPDATE,
      ),
    ).toBe(true)
  })

  it('denies MEMBER and VIEWER from updating settings', () => {
    expect(
      roleHasPermission(
        OrganizationRole.MEMBER,
        OrganizationPermission.SETTINGS_UPDATE,
      ),
    ).toBe(false)
    expect(
      roleHasPermission(
        OrganizationRole.VIEWER,
        OrganizationPermission.SETTINGS_UPDATE,
      ),
    ).toBe(false)
  })

  it('allows every role to read settings', () => {
    for (const role of Object.values(OrganizationRole)) {
      expect(
        roleHasPermission(role, OrganizationPermission.SETTINGS_READ),
      ).toBe(true)
    }
  })
})
