import { describe, expect, it } from 'vitest'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import {
  INVITE_EMAIL_MAX_LENGTH,
  toCreateInvitationRequest,
  validateInviteMemberForm,
} from './invitation-settings'

describe('validateInviteMemberForm', () => {
  it('accepts valid email and role combinations', () => {
    expect(
      validateInviteMemberForm({
        email: ' jane@example.com ',
        role: OrganizationRole.MEMBER,
      }),
    ).toEqual({})
  })

  it('requires an email', () => {
    const errors = validateInviteMemberForm({
      email: '   ',
      role: OrganizationRole.MEMBER,
    })

    expect(errors.email).toBe('Email is required')
  })

  it('rejects malformed email addresses', () => {
    const errors = validateInviteMemberForm({
      email: 'not-an-email',
      role: OrganizationRole.MEMBER,
    })

    expect(errors.email).toBe('Enter a valid email address')
  })

  it('rejects overlong email addresses', () => {
    const email = `${'a'.repeat(INVITE_EMAIL_MAX_LENGTH)}@example.com`
    const errors = validateInviteMemberForm({
      email,
      role: OrganizationRole.MEMBER,
    })

    expect(errors.email).toContain('characters or fewer')
  })

  it('rejects invalid role assignments', () => {
    const errors = validateInviteMemberForm({
      email: 'jane@example.com',
      role: 'GUEST' as OrganizationRole,
    })

    expect(errors.role).toBe('Choose a valid role.')
  })
})

describe('toCreateInvitationRequest', () => {
  it('normalizes the email before sending', () => {
    expect(
      toCreateInvitationRequest({
        email: '  JANE@Example.COM  ',
        role: OrganizationRole.ADMIN,
      }),
    ).toEqual({
      email: 'JANE@Example.COM',
      role: OrganizationRole.ADMIN,
    })
  })
})
