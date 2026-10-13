import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import {
  describeInvitationAcceptError,
  mapInvitationApiError,
} from './invitation-errors'

function apiError(
  code: ErrorCode,
  message: string,
  statusCode: number,
  details?: string | string[],
): ApiError {
  return new ApiError({ code, statusCode, message: details ?? message })
}

describe('mapInvitationApiError', () => {
  it('maps validation failures onto the email field', () => {
    const view = mapInvitationApiError(
      apiError(
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
        400,
        'email must be an email',
      ),
    )

    expect(view.fieldErrors.email).toContain('valid email')
    expect(view.formError).toBeUndefined()
  })

  it('maps validation failures onto the role field', () => {
    const view = mapInvitationApiError(
      apiError(
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
        400,
        'role must be one of the following values: OWNER, ADMIN, MEMBER, VIEWER',
      ),
    )

    expect(view.fieldErrors.role).toContain('valid role')
    expect(view.formError).toBeUndefined()
  })

  it('keeps unmapped validation messages at form level', () => {
    const view = mapInvitationApiError(
      apiError(
        ErrorCode.VALIDATION_FAILED,
        'Validation failed',
        400,
        'something unexpected',
      ),
    )

    expect(view.formError).toContain('something unexpected')
  })

  it('explains duplicate invite / active member conflicts on the email field', () => {
    const view = mapInvitationApiError(
      apiError(ErrorCode.CONFLICT, 'Conflict', 409),
    )

    expect(view.fieldErrors.email).toContain('pending invite')
    expect(view.formError).toBeUndefined()
  })

  it('explains forbidden responses at form level', () => {
    const view = mapInvitationApiError(
      apiError(ErrorCode.FORBIDDEN, 'Missing required permission(s).', 403),
    )

    expect(view.formError).toContain('permission to invite')
    expect(view.fieldErrors).toEqual({})
  })

  it('falls back to the mapped code message for other failures', () => {
    const view = mapInvitationApiError(
      apiError(ErrorCode.TENANT_ORGANIZATION_REQUIRED, 'Org required', 400),
    )

    expect(view.formError).toContain('Select a workspace')
    expect(view.fieldErrors).toEqual({})
  })

  it('returns an empty view for falsy errors', () => {
    expect(mapInvitationApiError(undefined)).toEqual({
      fieldErrors: {},
      formError: undefined,
    })
  })
})

describe('describeInvitationAcceptError', () => {
  it('keeps the backend message for expired invitations', () => {
    const message = describeInvitationAcceptError(
      apiError(
        ErrorCode.BAD_REQUEST,
        'This invitation has expired. Ask for a new invitation.',
        400,
      ),
    )

    expect(message).toContain('expired')
  })

  it('keeps the backend message for revoked invitations', () => {
    const message = describeInvitationAcceptError(
      apiError(ErrorCode.BAD_REQUEST, 'This invitation has been revoked', 400),
    )

    expect(message).toContain('revoked')
  })

  it('falls back to generic copy when the backend message is empty', () => {
    const message = describeInvitationAcceptError(
      apiError(ErrorCode.BAD_REQUEST, '', 400),
    )

    expect(message).toBe(
      'This invitation is no longer valid. Ask the sender to invite you again.',
    )
  })

  it('explains email-mismatch forbidden failures', () => {
    const message = describeInvitationAcceptError(
      apiError(
        ErrorCode.FORBIDDEN,
        'This invitation was issued to a different email address',
        403,
      ),
    )

    expect(message).toContain('different email address')
  })

  it('explains whether the invitation still exists', () => {
    const message = describeInvitationAcceptError(
      apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Invitation not found', 404),
    )

    expect(message).toContain('could not be found')
  })

  it('explains archived-workspace rejections', () => {
    const message = describeInvitationAcceptError(
      apiError(
        ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
        'This organization is archived',
        403,
      ),
    )

    expect(message).toContain('archived')
  })

  it('falls back to the mapped message for unknown failures', () => {
    const message = describeInvitationAcceptError(
      apiError(ErrorCode.INTERNAL_SERVER_ERROR, 'Internal', 500),
    )

    expect(message).toContain('Something went wrong')
  })
})
