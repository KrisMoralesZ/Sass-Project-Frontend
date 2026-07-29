import type { ErrorCode } from './error-code'

/**
 * Shared response envelope from the Nest API.
 * Mirrors `sass-backend/src/common/interfaces/api-response.interface.ts`.
 */
export interface ApiResponseMeta {
  timestamp: string
  path: string
  version: string
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiResponseMeta
}

export interface ApiErrorBody {
  code: ErrorCode | string
  statusCode: number
  message: string | string[]
  error?: string
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorBody
  meta: ApiResponseMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function isApiSuccessResponse<T>(
  value: unknown,
): value is ApiSuccessResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === true &&
    'data' in value
  )
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    (value as { success: unknown }).success === false &&
    'error' in value
  )
}
