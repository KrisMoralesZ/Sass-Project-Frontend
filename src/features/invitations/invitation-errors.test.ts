import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { mapInvitationApiError } from './invitation-errors'

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
