import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { ErrorCode } from '@/types/error-code'
import type { ProfileField } from './user-profile-settings'
import {
  AVATAR_URL_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  LOCALE_MAX_LENGTH,
  TIMEZONE_MAX_LENGTH,
  type ProfileFieldErrors,
} from './user-profile-settings'

export interface ProfileApiErrorView {
  fieldErrors: ProfileFieldErrors
  formError?: string
}

export interface ProfileLoadError {
  title: string
  message: string
}

const FIELD_COPY: Record<ProfileField, string> = {
  displayName: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`,
  avatarUrl: `Avatar URL must be ${AVATAR_URL_MAX_LENGTH} characters or fewer.`,
  timezone: `Timezone must be ${TIMEZONE_MAX_LENGTH} characters or fewer.`,
  locale: `Locale must be ${LOCALE_MAX_LENGTH} characters or fewer.`,
  theme: 'Choose a valid theme.',
  notifyEmail: 'Email notifications must be enabled or disabled.',
  notifyInApp: 'In-app notifications must be enabled or disabled.',
  notifyMarketing: 'Product updates must be enabled or disabled.',
}

const FIELD_MATCHERS: readonly (readonly [ProfileField, readonly string[]])[] =
  [
    ['avatarUrl', ['avatarurl', 'avatar_url', 'avatar url']],
    ['displayName', ['displayname', 'display_name', 'display name']],
    [
      'notifyMarketing',
      ['notifications.marketing', 'marketing', 'notifymarketing'],
    ],
    ['notifyInApp', ['notifications.inapp', 'inapp', 'notifyinapp']],
    [
      'notifyEmail',
      ['notifications.email', 'notifyemail', 'notificationemail'],
    ],
    ['timezone', ['timezone', 'preferences.timezone']],
    ['locale', ['locale', 'preferences.locale']],
    ['theme', ['theme', 'preferences.theme']],
  ]

function validationMessages(error: unknown): string[] {
  if (!isApiError(error) || error.code !== ErrorCode.VALIDATION_FAILED) {
    return []
  }

  if (Array.isArray(error.details)) {
    return error.details.map((part) => String(part).trim()).filter(Boolean)
  }

  if (typeof error.details === 'string' && error.details.trim().length > 0) {
    return [error.details.trim()]
  }

  return []
}

function matchProfileField(message: string): ProfileField | undefined {
  const normalized = message.toLowerCase().replace(/[\s._-]/g, '')

  for (const [field, needles] of FIELD_MATCHERS) {
    if (
      needles.some((needle) =>
        normalized.includes(needle.replace(/[\s._-]/g, '')),
      )
    ) {
      return field
    }
  }

  return undefined
}

/** Page-level copy for GET /users/me failures. */
export function describeProfileLoadError(error: unknown): ProfileLoadError {
  if (!isApiError(error)) {
    return {
      title: 'We could not load your profile',
      message: getApiErrorMessage(error),
    }
  }

  switch (error.code) {
    case ErrorCode.UNAUTHORIZED:
      return {
        title: 'Your session expired',
        message: 'Sign in again to manage your profile settings.',
      }
    case ErrorCode.RESOURCE_NOT_FOUND:
      return {
        title: 'Profile not found',
        message:
          'We could not find a profile for this account. Try signing out and back in.',
      }
    default:
      return {
        title: 'We could not load your profile',
        message: getApiErrorMessage(error),
      }
  }
}

/** Form-level copy for PATCH /users/me failures (task 3.1.4). */
export function mapProfileApiError(error: unknown): ProfileApiErrorView {
  if (!error) {
    return { fieldErrors: {} }
  }

  if (!isApiError(error)) {
    return { fieldErrors: {}, formError: getApiErrorMessage(error) }
  }

  if (error.code === ErrorCode.UNAUTHORIZED) {
    return {
      fieldErrors: {},
      formError: 'Your session expired. Sign in again and retry.',
    }
  }

  if (error.code === ErrorCode.RESOURCE_NOT_FOUND) {
    return {
      fieldErrors: {},
      formError: 'We could not find your profile. Try signing out and back in.',
    }
  }

  if (error.code === ErrorCode.VALIDATION_FAILED) {
    const fieldErrors: ProfileFieldErrors = {}
    const unmapped: string[] = []

    for (const message of validationMessages(error)) {
      const field = matchProfileField(message)
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = FIELD_COPY[field]
      } else if (!field) {
        unmapped.push(message)
      }
    }

    const hasFieldErrors = Object.keys(fieldErrors).length > 0

    return {
      fieldErrors,
      formError: hasFieldErrors
        ? unmapped.length > 0
          ? unmapped.join(' ')
          : undefined
        : getApiErrorMessage(error),
    }
  }

  return { fieldErrors: {}, formError: getApiErrorMessage(error) }
}
