import { describe, expect, it } from 'vitest'
import { OrganizationRole } from '@/features/organizations/permissions/organization-role'
import {
  INVITATION_ASSIGNABLE_ROLES,
  INVITATION_DEFAULT_ROLE,
  INVITATION_STATUSES,
  isAssignableInviteRole,
  isInvitationStatus,
} from './invitation-api.types'
import {
  invitationsQueryKey,
  invitationsQueryOptions,
} from './list-invitations'

describe('invitation API types', () => {
  it('mirrors pending, accepted, revoked, and expired statuses', () => {
    expect(INVITATION_STATUSES).toEqual([
      'pending',
      'accepted',
      'revoked',
      'expired',
    ])
    expect(isInvitationStatus('pending')).toBe(true)
    expect(isInvitationStatus('cancelled')).toBe(false)
  })

  it('defaults invite role to MEMBER and allows all four base roles', () => {
    expect(INVITATION_DEFAULT_ROLE).toBe(OrganizationRole.MEMBER)
    expect([...INVITATION_ASSIGNABLE_ROLES]).toEqual([
      OrganizationRole.OWNER,
      OrganizationRole.ADMIN,
      OrganizationRole.MEMBER,
      OrganizationRole.VIEWER,
    ])
    expect(isAssignableInviteRole(OrganizationRole.OWNER)).toBe(true)
    expect(isAssignableInviteRole('GUEST')).toBe(false)
  })
})

describe('invitationsQueryOptions', () => {
  it('scopes the list query key to the active organization', () => {
    const query = { page: 1, status: 'pending' as const }

    expect(invitationsQueryKey('org-1', query)).toEqual([
      'invites',
      'org-1',
      query,
    ])
  })

  it('does not fetch without an active organization id', () => {
    expect(invitationsQueryOptions('').enabled).toBe(false)
    expect(invitationsQueryOptions('org-1').enabled).toBe(true)
  })
})
