import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { describeMembersLoadError } from './members-errors'

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

describe('describeMembersLoadError', () => {
  it('explains missing tenant context for the members list', () => {
    expect(
      describeMembersLoadError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_REQUIRED,
          'Organization context is required.',
        ),
      ),
    ).toEqual({
      title: 'Select a workspace',
      message: 'Choose a workspace in the sidebar to view its members.',
    })
  })

  it('explains missing tenant context for a member detail', () => {
    expect(
      describeMembersLoadError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_REQUIRED,
          'Organization context is required.',
        ),
        'member',
      ).message,
    ).toMatch(/inspect a member/)
  })

  it('explains an unavailable workspace', () => {
    expect(
      describeMembersLoadError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
          'You do not have access to this organization.',
          403,
        ),
      ),
    ).toEqual({
      title: 'This workspace is unavailable',
      message:
        'You do not have access to this workspace. Choose another workspace in the sidebar.',
    })
  })

  it('explains an archived or missing workspace on the list', () => {
    expect(
      describeMembersLoadError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
      ),
    ).toEqual({
      title: 'This workspace is no longer available',
      message:
        'It may have been archived or deleted. Switch to another workspace to continue.',
    })
  })

  it('explains a missing member on the detail screen', () => {
    expect(
      describeMembersLoadError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Member not found', 404),
        'member',
      ),
    ).toEqual({
      title: 'Member not found',
      message: 'This member may have left the workspace or been removed.',
    })
  })

  it('explains forbidden access for the list and detail', () => {
    expect(
      describeMembersLoadError(apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403))
        .title,
    ).toBe('You cannot view these members')

    expect(
      describeMembersLoadError(
        apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403),
        'member',
      ).title,
    ).toBe('You cannot view this member')
  })

  it('falls back for unknown, non-API, and unrelated codes', () => {
    expect(describeMembersLoadError(new Error('Network down'))).toEqual({
      title: 'Members could not be loaded',
      message: 'Network down',
    })

    expect(
      describeMembersLoadError(new Error('Network down'), 'member').title,
    ).toBe('Member details could not be loaded')

    expect(
      describeMembersLoadError(
        apiError(ErrorCode.INTERNAL_SERVER_ERROR, 'Server error', 500),
      ).title,
    ).toBe('Members could not be loaded')

    expect(
      describeMembersLoadError(apiError(ErrorCode.CONFLICT, 'Conflict', 409))
        .message,
    ).toBe('Conflict')
  })
})
