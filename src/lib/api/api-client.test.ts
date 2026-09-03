import { describe, expect, it } from 'vitest'
import { ErrorCode } from '@/types/error-code'
import { ApiError } from './api-error'
import { unwrapApiResponseData } from './api-client'

describe('unwrapApiResponseData', () => {
  it('returns envelope data for a normal success body', () => {
    expect(
      unwrapApiResponseData(200, {
        success: true,
        data: { id: 'org-1' },
        meta: { timestamp: 'now', path: '/organizations', version: 'v1' },
      }),
    ).toEqual({ id: 'org-1' })
  })

  it('treats empty 204 bodies as success', () => {
    expect(unwrapApiResponseData(204, '')).toBeUndefined()
    expect(unwrapApiResponseData(204, null)).toBeUndefined()
  })

  it('treats a 204 success envelope without data as success', () => {
    expect(
      unwrapApiResponseData(204, {
        success: true,
        meta: { timestamp: 'now', path: '/organizations/1', version: 'v1' },
      }),
    ).toBeUndefined()
  })

  it('throws ApiError for an error envelope', () => {
    expect(() =>
      unwrapApiResponseData(403, {
        success: false,
        error: {
          code: ErrorCode.FORBIDDEN,
          statusCode: 403,
          message: 'Requires at least the OWNER role.',
        },
        meta: { timestamp: 'now', path: '/organizations/1', version: 'v1' },
      }),
    ).toThrow(ApiError)
  })
})
