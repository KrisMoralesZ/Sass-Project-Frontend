import type {
  UpdateUserProfileRequest,
  UserProfile,
  UserProfileNotificationPreferencesPatch,
  UserProfilePreferencesPatch,
  UserProfileTheme,
} from './api/user-api.types'
import { USER_PROFILE_THEMES } from './api/user-api.types'
import {
  DEFAULT_ORGANIZATION_LOCALE,
  DEFAULT_ORGANIZATION_TIMEZONE,
  getLocaleOptions,
  getTimezoneOptions,
  type OrganizationLocaleOption,
} from '@/features/organizations/organization-settings'

/** Mirrors backend defaults from `user-profile-preferences.interface`. */
export const DEFAULT_PROFILE_TIMEZONE = DEFAULT_ORGANIZATION_TIMEZONE
export const DEFAULT_PROFILE_LOCALE = DEFAULT_ORGANIZATION_LOCALE
export const DEFAULT_PROFILE_THEME: UserProfileTheme = 'system'

export const DEFAULT_PROFILE_NOTIFICATIONS = {
  email: true,
  inApp: true,
  marketing: false,
} as const

/** Backend `UpdateUserProfileDto` constraints. */
export const DISPLAY_NAME_MAX_LENGTH = 120
export const AVATAR_URL_MAX_LENGTH = 2048
export const TIMEZONE_MAX_LENGTH = 64
export const LOCALE_MAX_LENGTH = 16

export interface ProfileThemeOption {
  value: UserProfileTheme
  label: string
}

export const PROFILE_THEME_OPTIONS: readonly ProfileThemeOption[] = [
  { value: 'system', label: 'Match system' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export interface ProfileFormValues {
  displayName: string
  avatarUrl: string
  timezone: string
  locale: string
  theme: UserProfileTheme
  notifyEmail: boolean
  notifyInApp: boolean
  notifyMarketing: boolean
}

export function normalizeProfilePreferences(
  profile: UserProfile | null | undefined,
): ProfileFormValues {
  const preferences = profile?.preferences

  return {
    displayName: profile?.displayName ?? '',
    avatarUrl: profile?.avatarUrl ?? '',
    timezone: preferences?.timezone ?? DEFAULT_PROFILE_TIMEZONE,
    locale: preferences?.locale ?? DEFAULT_PROFILE_LOCALE,
    theme: preferences?.theme ?? DEFAULT_PROFILE_THEME,
    notifyEmail:
      preferences?.notifications.email ?? DEFAULT_PROFILE_NOTIFICATIONS.email,
    notifyInApp:
      preferences?.notifications.inApp ?? DEFAULT_PROFILE_NOTIFICATIONS.inApp,
    notifyMarketing:
      preferences?.notifications.marketing ??
      DEFAULT_PROFILE_NOTIFICATIONS.marketing,
  }
}

export function toProfileFormValues(
  profile: UserProfile | null | undefined,
): ProfileFormValues {
  return normalizeProfilePreferences(profile)
}

/**
 * Build a `PATCH /users/me` body with only changed fields.
 * Returns `null` when the form matches the saved profile.
 */
export function buildProfilePatch(
  values: ProfileFormValues,
  current: UserProfile | null | undefined,
): UpdateUserProfileRequest | null {
  if (!current) {
    return null
  }

  const patch: UpdateUserProfileRequest = {}
  const displayName = values.displayName.trim() || null

  if (displayName !== current.displayName) {
    patch.displayName = displayName
  }

  const avatarUrl = values.avatarUrl.trim() || null
  if (avatarUrl !== current.avatarUrl) {
    patch.avatarUrl = avatarUrl
  }

  const preferences: UserProfilePreferencesPatch = {}
  const timezone = values.timezone.trim()

  if (timezone !== current.preferences.timezone) {
    preferences.timezone = timezone
  }

  const locale = values.locale.trim()
  if (locale !== current.preferences.locale) {
    preferences.locale = locale
  }

  if (values.theme !== current.preferences.theme) {
    preferences.theme = values.theme
  }

  const notifications: UserProfileNotificationPreferencesPatch = {}

  if (values.notifyEmail !== current.preferences.notifications.email) {
    notifications.email = values.notifyEmail
  }

  if (values.notifyInApp !== current.preferences.notifications.inApp) {
    notifications.inApp = values.notifyInApp
  }

  if (
    values.notifyMarketing !== current.preferences.notifications.marketing
  ) {
    notifications.marketing = values.notifyMarketing
  }

  if (Object.keys(notifications).length > 0) {
    preferences.notifications = notifications
  }

  if (Object.keys(preferences).length > 0) {
    patch.preferences = preferences
  }

  return Object.keys(patch).length > 0 ? patch : null
}

export function getProfileTimezoneOptions(current?: string): string[] {
  return getTimezoneOptions(current)
}

export function getProfileLocaleOptions(
  current?: string,
): OrganizationLocaleOption[] {
  return getLocaleOptions(current)
}

export function getProfileThemeOptions(
  current?: UserProfileTheme,
): ProfileThemeOption[] {
  const options = PROFILE_THEME_OPTIONS.map((option) => ({ ...option }))

  if (
    current &&
    USER_PROFILE_THEMES.includes(current) &&
    !options.some((option) => option.value === current)
  ) {
    options.push({ value: current, label: current })
  }

  return options
}
