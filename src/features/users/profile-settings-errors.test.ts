import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import {
  describeProfileLoadError,
  mapProfileApiError,
} from './profile-settings-errors'

function apiError(
  code: ErrorCode,
  message: string | string[],
  statusCode = 400,
) {
  return new ApiError({
    code,
    statusCode,
    message,
  })
}

describe('mapProfileApiError', () => {
  it('maps class-validator profile paths onto form fields', () => {
    const mapped = mapProfileApiError(
      apiError(ErrorCode.VALIDATION_FAILED, [
        'displayName must be shorter than or equal to 120 characters',
        'avatarUrl must be shorter than or equal to 2048 characters',
        'preferences.timezone must be shorter than or equal to 64 characters',
        'preferences.locale must be shorter than or equal to 16 characters',
        'preferences.theme must be one of the following values: system, light, dark',
        'preferences.notifications.email must be a boolean value',
      ]),
    )

    expect(mapped.fieldErrors.displayName).toMatch(/Display name/)
    expect(mapped.fieldErrors.avatarUrl).toMatch(/Avatar URL/)
    expect(mapped.fieldErrors.timezone).toMatch(/Timezone/)
    expect(mapped.fieldErrors.locale).toMatch(/Locale/)
    expect(mapped.fieldErrors.theme).toMatch(/valid theme/)
    expect(mapped.fieldErrors.notifyEmail).toMatch(/Email notifications/)
    expect(mapped.formError).toBeUndefined()
  })

  it('keeps unmapped validation text at form level', () => {
    const mapped = mapProfileApiError(
      apiError(ErrorCode.VALIDATION_FAILED, [
        'displayName must be a string',
        'property unknownField should not exist',
      ]),
    )

    expect(mapped.fieldErrors.displayName).toBeDefined()
    expect(mapped.formError).toMatch(/unknownField/)
  })

  it('surfaces a page-level message when no field can be mapped', () => {
    const mapped = mapProfileApiError(
      apiError(ErrorCode.VALIDATION_FAILED, ['payload is invalid']),
    )

    expect(mapped.fieldErrors).toEqual({})
    expect(mapped.formError).toBe('payload is invalid')
  })

  it('uses dedicated copy for unauthorized and missing profile failures', () => {
    expect(
      mapProfileApiError(apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401))
        .formError,
    ).toMatch(/session expired/)

    expect(
      mapProfileApiError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'User not found', 404),
      ).formError,
    ).toMatch(/could not find your profile/)
  })

  it('handles empty, unknown, and non-API errors', () => {
    expect(mapProfileApiError(undefined)).toEqual({ fieldErrors: {} })

    expect(mapProfileApiError(new Error('Network down')).formError).toBe(
      'Network down',
    )

    expect(
      mapProfileApiError(apiError(ErrorCode.CONFLICT, 'Conflict', 409))
        .formError,
    ).toBe('Conflict')
  })
})

describe('describeProfileLoadError', () => {
  it('explains unauthorized and missing profile responses', () => {
    expect(
      describeProfileLoadError(
        apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401),
      ),
    ).toEqual({
      title: 'Your session expired',
      message: 'Sign in again to manage your profile settings.',
    })

    expect(
      describeProfileLoadError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'User not found', 404),
      ),
    ).toEqual({
      title: 'Profile not found',
      message:
        'We could not find a profile for this account. Try signing out and back in.',
    })
  })

  it('falls back for unknown failures', () => {
    expect(describeProfileLoadError(new Error('Network down'))).toEqual({
      title: 'We could not load your profile',
      message: 'Network down',
    })
  })
})
