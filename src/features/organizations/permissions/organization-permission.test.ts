import { describe, expect, it } from 'vitest'
import {
  isOrganizationPermission,
  OrganizationPermission,
} from './organization-permission'

describe('isOrganizationPermission', () => {
  it('accepts known organization permissions', () => {
    expect(isOrganizationPermission(OrganizationPermission.SETTINGS_UPDATE)).toBe(
      true,
    )
  })

  it('rejects unknown values', () => {
    expect(isOrganizationPermission('settings:delete')).toBe(false)
    expect(isOrganizationPermission(null)).toBe(false)
  })
})
