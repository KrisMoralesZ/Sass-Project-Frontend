import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import {
  describeOrganizationWorkspaceLoadError,
  isOrganizationSettingsAccessError,
  mapOrganizationSettingsApiError,
} from './organization-settings-errors'

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

describe('mapOrganizationSettingsApiError', () => {
  it('maps class-validator settings paths onto form fields', () => {
    const mapped = mapOrganizationSettingsApiError(
      apiError(ErrorCode.VALIDATION_FAILED, [
        'settings.timezone must be shorter than or equal to 64 characters',
        'settings.locale must be shorter than or equal to 16 characters',
        'settings.branding.appName must be shorter than or equal to 120 characters',
        'settings.branding.primaryColor must be a string',
        'settings.branding.logoUrl must be shorter than or equal to 2048 characters',
        'settings.branding.accentColor must be a string',
      ]),
    )

    expect(mapped.fieldErrors.timezone).toMatch(/Timezone/)
    expect(mapped.fieldErrors.locale).toMatch(/Locale/)
    expect(mapped.fieldErrors.appName).toMatch(/App name/)
    expect(mapped.fieldErrors.primaryColor).toMatch(/hex color/)
    expect(mapped.fieldErrors.accentColor).toMatch(/hex color/)
    expect(mapped.fieldErrors.logoUrl).toMatch(/Logo URL/)
    expect(mapped.formError).toBeUndefined()
  })

  it('keeps unmapped validation text at form level', () => {
    const mapped = mapOrganizationSettingsApiError(
      apiError(ErrorCode.VALIDATION_FAILED, [
        'settings.timezone must be a string',
        'property featureFlags.unknown should not exist',
      ]),
    )

    expect(mapped.fieldErrors.timezone).toBeDefined()
    expect(mapped.formError).toMatch(/featureFlags/)
  })

  it('surfaces a page-level message when no field can be mapped', () => {
    const mapped = mapOrganizationSettingsApiError(
      apiError(ErrorCode.VALIDATION_FAILED, ['payload is invalid']),
    )

    expect(mapped.fieldErrors).toEqual({})
    expect(mapped.formError).toBe('payload is invalid')
  })

  it('uses dedicated copy for forbidden and tenant-context failures', () => {
    expect(
      mapOrganizationSettingsApiError(
        apiError(
          ErrorCode.FORBIDDEN,
          'Missing required permission(s): settings:update.',
          403,
        ),
      ).formError,
    ).toMatch(/do not have permission to update/)

    expect(
      mapOrganizationSettingsApiError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
          'You do not have access to this organization.',
          403,
        ),
      ).formError,
    ).toMatch(/Choose another workspace/)

    expect(
      mapOrganizationSettingsApiError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_REQUIRED,
          'Organization context is required.',
        ),
      ).formError,
    ).toMatch(/Select a workspace/)

    expect(
      mapOrganizationSettingsApiError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
      ).formError,
    ).toMatch(/no longer available/)
  })
})

describe('describeOrganizationWorkspaceLoadError', () => {
  it('explains archived or missing workspaces', () => {
    expect(
      describeOrganizationWorkspaceLoadError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
      ),
    ).toEqual({
      title: 'This workspace is no longer available',
      message:
        'It may have been archived or deleted. Switch to another workspace to continue.',
    })
  })

  it('explains tenant-context failures', () => {
    expect(
      describeOrganizationWorkspaceLoadError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
          'You do not have access to this organization.',
          403,
        ),
      ).title,
    ).toBe('This workspace is unavailable')

    expect(
      describeOrganizationWorkspaceLoadError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_REQUIRED,
          'Organization context is required.',
        ),
      ),
    ).toEqual({
      title: 'Select a workspace',
      message: 'Choose a workspace in the sidebar to manage its settings.',
    })
  })
})

describe('isOrganizationSettingsAccessError', () => {
  it('detects forbidden and tenant-context codes', () => {
    expect(
      isOrganizationSettingsAccessError(
        apiError(ErrorCode.FORBIDDEN, 'nope', 403),
      ),
    ).toBe(true)
    expect(
      isOrganizationSettingsAccessError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
      ),
    ).toBe(true)
    expect(
      isOrganizationSettingsAccessError(
        apiError(ErrorCode.VALIDATION_FAILED, ['bad']),
      ),
    ).toBe(false)
  })
})
