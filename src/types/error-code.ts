/**
 * Backend error codes from sass-backend `ErrorCode`.
 * Keep in sync with `sass-backend/src/common/errors/error-code.enum.ts`.
 */
export const ErrorCode = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT: 'CONFLICT',
  TENANT_ORGANIZATION_REQUIRED: 'TENANT_ORGANIZATION_REQUIRED',
  TENANT_ORGANIZATION_FORBIDDEN: 'TENANT_ORGANIZATION_FORBIDDEN',
  INVALID_SORT_FIELD: 'INVALID_SORT_FIELD',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

export function isErrorCode(value: unknown): value is ErrorCode {
  return (
    typeof value === 'string' &&
    (Object.values(ErrorCode) as string[]).includes(value)
  )
}
