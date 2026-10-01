import { isAssignableInviteRole } from './api/invitation-api.types'
import type { InvitationAssignableRole } from './api/invitation-api.types'
import { INVITATION_DEFAULT_ROLE } from './api/invitation-api.types'
import type { CreateInvitationRequest } from './api/invitation-api.types'

/** Mirrors the backend `IsEmail` + `IsString` length bound (RFC 5321). */
export const INVITE_EMAIL_MAX_LENGTH = 254

export const INVITE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type InviteMemberField = 'email' | 'role'

export type InviteMemberFieldErrors = Partial<Record<InviteMemberField, string>>

export interface InviteMemberFormValues {
  email: string
  role: InvitationAssignableRole
}

export const INITIAL_INVITE_MEMBER_VALUES: InviteMemberFormValues = {
  email: '',
  role: INVITATION_DEFAULT_ROLE,
}

/** Client-side validation for the invite-member form (task 3.4.2). */
export function validateInviteMemberForm(
  values: InviteMemberFormValues,
): InviteMemberFieldErrors {
  const errors: InviteMemberFieldErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email is required'
  } else if (email.length > INVITE_EMAIL_MAX_LENGTH) {
    errors.email = `Email must be ${INVITE_EMAIL_MAX_LENGTH} characters or fewer.`
  } else if (!INVITE_EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!isAssignableInviteRole(values.role)) {
    errors.role = 'Choose a valid role.'
  }

  return errors
}

/** Normalized `POST /invites` payload from the form values. */
export function toCreateInvitationRequest(
  values: InviteMemberFormValues,
): CreateInvitationRequest {
  return {
    email: values.email.trim(),
    role: values.role,
  }
}
