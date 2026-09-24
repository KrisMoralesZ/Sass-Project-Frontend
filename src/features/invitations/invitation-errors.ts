import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { ErrorCode } from '@/types/error-code'
import { INVITE_EMAIL_MAX_LENGTH } from './invitation-settings'
import type { InviteMemberFieldErrors } from './invitation-settings'

export interface InvitationApiErrorView {
  fieldErrors: InviteMemberFieldErrors
  formError?: string
}

const FIELD_COPY = {
  email: `Enter a valid email up to ${INVITE_EMAIL_MAX_LENGTH} characters.`,
  role: 'Choose a valid role for the invite.',
} as const

const FIELD_MATCHERS: readonly (readonly [
  'email' | 'role',
  readonly string[],
])[] = [
  ['email', ['email', 'invitee', 'inviteemail']],
  ['role', ['role', 'assignablerole', 'inviterole']],
]

function validationMessages(error: unknown): string[] {
  if (!isApiError(error) || error.code !== ErrorCode.VALIDATION_FAILED) {
    return []
  }

  if (Array.isArray(error.details)) {
    return error.details.map((part) => String(part).trim()).filter(Boolean)
  }

  if (typeof error.details === 'string' && error.details.trim().length > 0) {
    return [error.details.trim()]
  }

  return []
}

function matchInviteField(message: string): 'email' | 'role' | undefined {
  const normalized = message.toLowerCase().replace(/[\s._-]/g, '')

  for (const [field, needles] of FIELD_MATCHERS) {
    if (
      needles.some((needle) =>
        normalized.includes(needle.replace(/[\s._-]/g, '')),
      )
    ) {
      return field
    }
  }

  return undefined
}

/**
 * Maps a `POST /invites` failure onto the invite-member form (task 3.4.2).
 * Validation and duplicate-member/conflict failures attach to the email field;
 * forbidden and tenant-context failures stay at form level (backend is the
 * source of truth — the UI gate is convenience only).
 */
export function mapInvitationApiError(error: unknown): InvitationApiErrorView {
  if (!error) {
    return { fieldErrors: {} }
  }

  if (!isApiError(error)) {
    return { fieldErrors: {}, formError: getApiErrorMessage(error) }
  }

  if (error.code === ErrorCode.VALIDATION_FAILED) {
    const fieldErrors: InviteMemberFieldErrors = {}
    const unmapped: string[] = []

    for (const message of validationMessages(error)) {
      const field = matchInviteField(message)
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = FIELD_COPY[field]
      } else if (!field) {
        unmapped.push(message)
      }
    }

    const hasFieldErrors = Object.keys(fieldErrors).length > 0

    return {
      fieldErrors,
      formError: hasFieldErrors
        ? unmapped.length > 0
          ? unmapped.join(' ')
          : undefined
        : getApiErrorMessage(error),
    }
  }

  if (error.code === ErrorCode.CONFLICT) {
    return {
      fieldErrors: {
        email:
          'That email already has a pending invite or is already a member.',
      },
      formError: undefined,
    }
  }

  if (error.code === ErrorCode.FORBIDDEN) {
    return {
      fieldErrors: {},
      formError:
        'You do not have permission to invite members. Ask an admin to update your role.',
    }
  }

  return { fieldErrors: {}, formError: getApiErrorMessage(error) }
}
