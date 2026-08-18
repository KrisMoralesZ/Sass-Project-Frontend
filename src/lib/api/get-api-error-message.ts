import { ErrorCode, isErrorCode } from '@/types'
import { isApiError } from './api-error'

const ERROR_CODE_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    'Something went wrong on our side. Please try again.',
  [ErrorCode.BAD_REQUEST]:
    'The request was invalid. Please check and try again.',
  [ErrorCode.VALIDATION_FAILED]:
    'Please fix the highlighted fields and try again.',
  [ErrorCode.UNAUTHORIZED]: 'Please sign in to continue.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to do that.',
  [ErrorCode.RESOURCE_NOT_FOUND]:
    'We could not find what you were looking for.',
  [ErrorCode.CONFLICT]:
    'That conflicts with existing data. Please try a different value.',
  [ErrorCode.TENANT_ORGANIZATION_REQUIRED]: 'Select a workspace to continue.',
  [ErrorCode.TENANT_ORGANIZATION_FORBIDDEN]:
    'You do not have access to this workspace.',
  [ErrorCode.INVALID_SORT_FIELD]: 'Sorting is not available for that field.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    'Too many attempts. Please wait a moment and try again.',
  [ErrorCode.ACCOUNT_LOCKED]:
    'This account is temporarily locked. Try again later.',
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

/**
 * Maps a backend `error.code` (or unknown code string) to copy safe for UI.
 */
export function getErrorCodeMessage(code: string): string {
  if (isErrorCode(code)) {
    return ERROR_CODE_MESSAGES[code]
  }

  return FALLBACK_MESSAGE
}

function formatValidationDetails(details: string | string[]): string | null {
  if (Array.isArray(details)) {
    const parts = details.map((part) => part.trim()).filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : null
  }

  const trimmed = details.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * User-facing message for an `ApiError` or unknown thrown value.
 * Prefer mapped code copy; for validation, surface API field messages when present.
 */
export function getApiErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message
    }
    return FALLBACK_MESSAGE
  }

  if (error.code === ErrorCode.VALIDATION_FAILED) {
    const details = formatValidationDetails(error.details)
    if (details) {
      return details
    }
  }

  // Prefer the API's own message for common auth failures (login/register).
  if (
    (error.code === ErrorCode.UNAUTHORIZED ||
      error.code === ErrorCode.CONFLICT ||
      error.code === ErrorCode.ACCOUNT_LOCKED ||
      error.code === ErrorCode.TOO_MANY_REQUESTS) &&
    error.message.trim().length > 0
  ) {
    return error.message
  }

  // Network helper already sets a clear message on INTERNAL with status 0.
  if (error.statusCode === 0 && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error.code === 'string' && error.code.length > 0) {
    const mapped = getErrorCodeMessage(error.code)
    if (mapped !== FALLBACK_MESSAGE || isErrorCode(error.code)) {
      return mapped
    }
  }

  if (error.message.trim().length > 0) {
    return error.message
  }

  return FALLBACK_MESSAGE
}

export { ERROR_CODE_MESSAGES }
