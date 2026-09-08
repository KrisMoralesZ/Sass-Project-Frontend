import { describe, expect, it } from 'vitest'
import { ErrorCode } from '@/types/error-code'
import { ApiError, isApiError } from './api-error'

describe('ApiError', () => {
  it('joins array messages for Error.message and keeps details as the original array', () => {
    const error = new ApiError({
      code: ErrorCode.VALIDATION_FAILED,
      statusCode: 400,
      message: ['Email is required', 'Password is required'],
    })

    expect(error.name).toBe('ApiError')
    expect(error.message).toBe('Email is required, Password is required')
    expect(error.details).toEqual(['Email is required', 'Password is required'])
    expect(isApiError(error)).toBe(true)
  })

  it('builds from an envelope error body', () => {
    const error = ApiError.fromErrorBody(
      {
        code: ErrorCode.UNAUTHORIZED,
        statusCode: 401,
        message: 'Invalid credentials',
      },
      {
        timestamp: '2026-01-01T00:00:00.000Z',
        path: '/auth/login',
        version: '1',
      },
    )

    expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Invalid credentials')
    expect(error.meta?.path).toBe('/auth/login')
  })

  it('creates a network error with status 0', () => {
    const error = ApiError.network()

    expect(error.statusCode).toBe(0)
    expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR)
    expect(error.message).toMatch(/connection/i)
  })

  it('creates an unexpected-response error', () => {
    const error = ApiError.unexpected(502)

    expect(error.statusCode).toBe(502)
    expect(error.message).toBe('Unexpected API response.')
  })

  it('does not treat a plain Error as ApiError', () => {
    expect(isApiError(new Error('nope'))).toBe(false)
    expect(isApiError(null)).toBe(false)
  })
})
