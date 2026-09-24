import {
  ORGANIZATION_ROLES,
  OrganizationRole,
} from '@/features/organizations/permissions/organization-role'
import type { ListQuery, PaginatedResult } from '@/types/pagination'

/**
 * Invitation statuses from backend `organization-invitations-v1.md`.
 * `expired` may be derived (`pending` past `expiresAt`) or stored.
 */
export const INVITATION_STATUSES = [
  'pending',
  'accepted',
  'revoked',
  'expired',
] as const

export type InvitationStatus = (typeof INVITATION_STATUSES)[number]

export const INVITATION_DEFAULT_ROLE = OrganizationRole.MEMBER

export const INVITATION_ASSIGNABLE_ROLES = ORGANIZATION_ROLES

export type InvitationAssignableRole =
  (typeof INVITATION_ASSIGNABLE_ROLES)[number]

export function isInvitationStatus(value: unknown): value is InvitationStatus {
  return (
    typeof value === 'string' &&
    (INVITATION_STATUSES as readonly string[]).includes(value)
  )
}

export function isAssignableInviteRole(
  value: unknown,
): value is InvitationAssignableRole {
  return (
    typeof value === 'string' &&
    (INVITATION_ASSIGNABLE_ROLES as readonly string[]).includes(value)
  )
}

/**
 * Mirrors the invitation resource (dates as ISO strings).
 * List/detail responses never include `token` or `tokenHash`.
 */
export interface Invitation {
  id: string
  organizationId: string
  email: string
  role: InvitationAssignableRole
  status: InvitationStatus
  invitedByUserId: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateInvitationRequest {
  email: string
  role?: InvitationAssignableRole
}

export type CreateInvitationResponse = Invitation

export interface ListInvitationsQuery extends ListQuery {
  status?: InvitationStatus
}

export type ListInvitationsResponse = PaginatedResult<Invitation>

export interface AcceptInvitationRequest {
  token: string
}

export type AcceptInvitationResponse = Invitation

export type RevokeInvitationResponse = Invitation
