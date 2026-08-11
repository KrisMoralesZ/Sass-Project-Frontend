import type { ApiErrorBody, ApiResponseMeta } from '@/types'
import { ErrorCode } from '@/types'

/**
 * Typed API failure from the Nest envelope or a transport-level problem.
 * Feature UI should catch this (or map via 0.3.5 helpers) instead of raw Axios errors.
 */
export class ApiError extends Error {
  readonly code: ErrorCode | string
  readonly statusCode: number
  readonly details: string | string[]
  readonly meta?: ApiResponseMeta

  constructor(options: {
    code: ErrorCode | string
    statusCode: number
    message: string | string[]
    meta?: ApiResponseMeta
    cause?: unknown
  }) {
    const normalizedMessage = Array.isArray(options.message)
      ? options.message.join(', ')
      : options.message

    super(normalizedMessage, { cause: options.cause })
    this.name = 'ApiError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.details = options.message
    this.meta = options.meta
  }

  static fromErrorBody(
    error: ApiErrorBody,
    meta?: ApiResponseMeta,
    cause?: unknown,
  ): ApiError {
    return new ApiError({
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
      meta,
      cause,
    })
  }

  static network(cause?: unknown): ApiError {
    return new ApiError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode: 0,
      message: 'Network request failed. Check your connection and try again.',
      cause,
    })
  }

  static unexpected(statusCode: number, cause?: unknown): ApiError {
    return new ApiError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode,
      message: 'Unexpected API response.',
      cause,
    })
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}
