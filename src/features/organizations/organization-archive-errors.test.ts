import { describe, expect, it } from 'vitest'
import { ApiError } from '@/lib/api/api-error'
import { ErrorCode } from '@/types/error-code'
import { describeOrganizationArchiveError } from './organization-archive-errors'

function apiError(code: ErrorCode, message: string, statusCode = 403) {
  return new ApiError({
    code,
    statusCode,
    message,
  })
}

describe('describeOrganizationArchiveError', () => {
  it('uses owner-only copy for FORBIDDEN instead of the raw API message', () => {
    expect(
      describeOrganizationArchiveError(
        apiError(ErrorCode.FORBIDDEN, 'Requires at least the OWNER role.'),
      ),
    ).toBe('Only the workspace owner can archive this workspace.')
  })

  it('explains tenant-context and missing-workspace failures', () => {
    expect(
      describeOrganizationArchiveError(
        apiError(
          ErrorCode.TENANT_ORGANIZATION_FORBIDDEN,
          'You do not have access to this organization.',
        ),
      ),
    ).toMatch(/Choose another workspace/)

    expect(
      describeOrganizationArchiveError(
        apiError(ErrorCode.RESOURCE_NOT_FOUND, 'Organization not found', 404),
      ),
    ).toMatch(/already have been archived/)
  })
})
