import { describe, expect, it } from 'vitest'
import {
  getOrganizationRoleLabel,
  hasMinRole,
  isOrganizationRole,
  OrganizationRole,
} from './organization-role'

describe('isOrganizationRole', () => {
  it('accepts known organization roles', () => {
    expect(isOrganizationRole(OrganizationRole.ADMIN)).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isOrganizationRole('SUPERADMIN')).toBe(false)
    expect(isOrganizationRole(undefined)).toBe(false)
  })
})

describe('getOrganizationRoleLabel', () => {
  it('returns the display label for each role', () => {
    expect(getOrganizationRoleLabel(OrganizationRole.OWNER)).toBe('Owner')
    expect(getOrganizationRoleLabel(OrganizationRole.ADMIN)).toBe('Admin')
    expect(getOrganizationRoleLabel(OrganizationRole.MEMBER)).toBe('Member')
    expect(getOrganizationRoleLabel(OrganizationRole.VIEWER)).toBe('Viewer')
  })
})

describe('hasMinRole', () => {
  it('treats higher roles as meeting lower minimums', () => {
    expect(hasMinRole(OrganizationRole.OWNER, OrganizationRole.MEMBER)).toBe(
      true,
    )
    expect(hasMinRole(OrganizationRole.MEMBER, OrganizationRole.ADMIN)).toBe(
      false,
    )
  })
})
