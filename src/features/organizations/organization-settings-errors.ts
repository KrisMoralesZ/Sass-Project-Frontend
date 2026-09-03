import { isApiError } from '@/lib/api/api-error'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { ErrorCode } from '@/types/error-code'
import type { OrganizationSettingsField } from './organization-settings'
import {
  APP_NAME_MAX_LENGTH,
  LOCALE_MAX_LENGTH,
  LOGO_URL_MAX_LENGTH,
  TIMEZONE_MAX_LENGTH,
  type OrganizationSettingsFieldErrors,
} from './organization-settings'

export interface OrganizationSettingsApiErrorView {
  fieldErrors: OrganizationSettingsFieldErrors
  formError?: string
}

export interface OrganizationWorkspaceLoadError {
  title: string
  message: string
}

const FIELD_COPY: Record<OrganizationSettingsField, string> = {
  timezone: `Timezone must be ${TIMEZONE_MAX_LENGTH} characters or fewer.`,
  locale: `Locale must be ${LOCALE_MAX_LENGTH} characters or fewer.`,
  appName: `App name must be ${APP_NAME_MAX_LENGTH} characters or fewer.`,
  logoUrl: `Logo URL must be ${LOGO_URL_MAX_LENGTH} characters or fewer.`,
  primaryColor: 'Use a hex color such as #1a5c40.',
  accentColor: 'Use a hex color such as #1a5c40.',
}

const FIELD_MATCHERS: readonly (readonly [
  OrganizationSettingsField,
  readonly string[],
])[] = [
  ['logoUrl', ['logourl', 'logo_url', 'logo url']],
  ['primaryColor', ['primarycolor', 'primary_color', 'primary color']],
  ['accentColor', ['accentcolor', 'accent_color', 'accent color']],
  ['appName', ['appname', 'app_name', 'app name']],
  ['timezone', ['timezone']],
  ['locale', ['locale']],
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

function matchSettingsField(
  message: string,
): OrganizationSettingsField | undefined {
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

export function isOrganizationSettingsAccessError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false
  }

  return (
    error.code === ErrorCode.FORBIDDEN ||
    error.code === ErrorCode.TENANT_ORGANIZATION_FORBIDDEN ||
    error.code === ErrorCode.TENANT_ORGANIZATION_REQUIRED ||
    error.code === ErrorCode.RESOURCE_NOT_FOUND
  )
}

/** Page-level copy for GET failures (missing, forbidden, or tenant context). */
export function describeOrganizationWorkspaceLoadError(
  error: unknown,
): OrganizationWorkspaceLoadError {
  if (!isApiError(error)) {
    return {
      title: 'We could not load this workspace',
      message: getApiErrorMessage(error),
    }
  }

  switch (error.code) {
    case ErrorCode.TENANT_ORGANIZATION_REQUIRED:
      return {
        title: 'Select a workspace',
        message: 'Choose a workspace in the sidebar to manage its settings.',
      }
    case ErrorCode.TENANT_ORGANIZATION_FORBIDDEN:
      return {
        title: 'This workspace is unavailable',
        message:
          'You do not have access to this workspace. Choose another workspace in the sidebar.',
      }
    case ErrorCode.RESOURCE_NOT_FOUND:
      return {
        title: 'This workspace is no longer available',
        message:
          'It may have been archived or deleted. Switch to another workspace to continue.',
      }
    case ErrorCode.FORBIDDEN:
      return {
        title: 'You cannot view these settings',
        message: 'You do not have permission to open this workspace.',
      }
    default:
      return {
        title: 'We could not load this workspace',
        message: getApiErrorMessage(error),
      }
  }
}

/** Form-level copy for PATCH / membership failures (task 2.3.3). */
export function mapOrganizationSettingsApiError(
  error: unknown,
): OrganizationSettingsApiErrorView {
  if (!error) {
    return { fieldErrors: {} }
  }

  if (!isApiError(error)) {
    return { fieldErrors: {}, formError: getApiErrorMessage(error) }
  }

  if (error.code === ErrorCode.FORBIDDEN) {
    return {
      fieldErrors: {},
      formError: 'You do not have permission to update these settings.',
    }
  }

  if (error.code === ErrorCode.TENANT_ORGANIZATION_FORBIDDEN) {
    return {
      fieldErrors: {},
      formError:
        'You do not have access to this workspace. Choose another workspace in the sidebar and try again.',
    }
  }

  if (error.code === ErrorCode.TENANT_ORGANIZATION_REQUIRED) {
    return {
      fieldErrors: {},
      formError: 'Select a workspace to save these settings.',
    }
  }

  if (error.code === ErrorCode.RESOURCE_NOT_FOUND) {
    return {
      fieldErrors: {},
      formError:
        'This workspace is no longer available. It may have been archived or deleted.',
    }
  }

  if (error.code === ErrorCode.VALIDATION_FAILED) {
    const fieldErrors: OrganizationSettingsFieldErrors = {}
    const unmapped: string[] = []

    for (const message of validationMessages(error)) {
      const field = matchSettingsField(message)
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
