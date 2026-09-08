import type {
  OrganizationBrandingSettings,
  OrganizationSettings,
  OrganizationSettingsPatch,
} from './api/organization-api.types'

/** Mirrors backend `DEFAULT_ORGANIZATION_SETTINGS`. */
export const DEFAULT_ORGANIZATION_TIMEZONE = 'UTC'
export const DEFAULT_ORGANIZATION_LOCALE = 'en'

/** Backend `MaxLength` constraints from the organization settings DTOs. */
export const TIMEZONE_MAX_LENGTH = 64
export const LOCALE_MAX_LENGTH = 16
export const APP_NAME_MAX_LENGTH = 120
export const LOGO_URL_MAX_LENGTH = 2048
export const COLOR_MAX_LENGTH = 32

const LOCALE_PATTERN = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

const FALLBACK_TIMEZONES = [
  'UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Bogota',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Berlin',
  'Africa/Lagos',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const

export interface OrganizationLocaleOption {
  value: string
  label: string
}

export const ORGANIZATION_LOCALE_OPTIONS: readonly OrganizationLocaleOption[] =
  [
    { value: 'en', label: 'English (en)' },
    { value: 'en-GB', label: 'English — United Kingdom (en-GB)' },
    { value: 'es', label: 'Spanish (es)' },
    { value: 'es-MX', label: 'Spanish — Mexico (es-MX)' },
    { value: 'pt-BR', label: 'Portuguese — Brazil (pt-BR)' },
    { value: 'fr', label: 'French (fr)' },
    { value: 'de', label: 'German (de)' },
    { value: 'ja', label: 'Japanese (ja)' },
  ]

export const DEFAULT_ORGANIZATION_BRANDING: OrganizationBrandingSettings = {
  logoUrl: null,
  primaryColor: null,
  accentColor: null,
  appName: null,
}

/**
 * Fill in any missing settings keys so the form always has a complete shape,
 * mirroring the backend `normalizeOrganizationSettings` util.
 */
export function normalizeOrganizationSettings(
  settings: Partial<OrganizationSettings> | null | undefined,
): OrganizationSettings {
  const branding: Partial<OrganizationBrandingSettings> =
    settings?.branding ?? {}

  return {
    timezone: settings?.timezone ?? DEFAULT_ORGANIZATION_TIMEZONE,
    locale: settings?.locale ?? DEFAULT_ORGANIZATION_LOCALE,
    branding: {
      logoUrl: branding.logoUrl ?? null,
      primaryColor: branding.primaryColor ?? null,
      accentColor: branding.accentColor ?? null,
      appName: branding.appName ?? null,
    },
    featureFlags: {
      betaBoards: settings?.featureFlags?.betaBoards ?? false,
      advancedReports: settings?.featureFlags?.advancedReports ?? false,
      memberInvites: settings?.featureFlags?.memberInvites ?? false,
      customBranding: settings?.featureFlags?.customBranding ?? false,
    },
  }
}

/** Flat string form state; an empty branding string means "clear this value". */
export interface OrganizationSettingsFormValues {
  timezone: string
  locale: string
  appName: string
  logoUrl: string
  primaryColor: string
  accentColor: string
}

export type OrganizationSettingsField = keyof OrganizationSettingsFormValues

export type OrganizationSettingsFieldErrors = Partial<
  Record<OrganizationSettingsField, string>
>

export function toOrganizationSettingsFormValues(
  settings: Partial<OrganizationSettings> | null | undefined,
): OrganizationSettingsFormValues {
  const normalized = normalizeOrganizationSettings(settings)

  return {
    timezone: normalized.timezone,
    locale: normalized.locale,
    appName: normalized.branding.appName ?? '',
    logoUrl: normalized.branding.logoUrl ?? '',
    primaryColor: normalized.branding.primaryColor ?? '',
    accentColor: normalized.branding.accentColor ?? '',
  }
}

function validateColor(value: string, label: string): string | undefined {
  if (value.length > COLOR_MAX_LENGTH) {
    return `${label} must be ${COLOR_MAX_LENGTH} characters or fewer.`
  }

  if (!HEX_COLOR_PATTERN.test(value)) {
    return 'Use a hex color such as #1a5c40.'
  }

  return undefined
}

export function validateOrganizationSettingsForm(
  values: OrganizationSettingsFormValues,
): OrganizationSettingsFieldErrors {
  const errors: OrganizationSettingsFieldErrors = {}
  const timezone = values.timezone.trim()
  const locale = values.locale.trim()
  const appName = values.appName.trim()
  const logoUrl = values.logoUrl.trim()
  const primaryColor = values.primaryColor.trim()
  const accentColor = values.accentColor.trim()

  if (!timezone) {
    errors.timezone = 'Timezone is required.'
  } else if (timezone.length > TIMEZONE_MAX_LENGTH) {
    errors.timezone = `Timezone must be ${TIMEZONE_MAX_LENGTH} characters or fewer.`
  }

  if (!locale) {
    errors.locale = 'Locale is required.'
  } else if (locale.length > LOCALE_MAX_LENGTH) {
    errors.locale = `Locale must be ${LOCALE_MAX_LENGTH} characters or fewer.`
  } else if (!LOCALE_PATTERN.test(locale)) {
    errors.locale = 'Use a BCP 47 locale such as en or pt-BR.'
  }

  if (appName.length > APP_NAME_MAX_LENGTH) {
    errors.appName = `App name must be ${APP_NAME_MAX_LENGTH} characters or fewer.`
  }

  if (logoUrl) {
    if (logoUrl.length > LOGO_URL_MAX_LENGTH) {
      errors.logoUrl = `Logo URL must be ${LOGO_URL_MAX_LENGTH} characters or fewer.`
    } else if (!/^https?:\/\/\S+$/i.test(logoUrl)) {
      errors.logoUrl = 'Enter an absolute http(s) URL.'
    }
  }

  const primaryColorError = primaryColor
    ? validateColor(primaryColor, 'Primary color')
    : undefined
  if (primaryColorError) {
    errors.primaryColor = primaryColorError
  }

  const accentColorError = accentColor
    ? validateColor(accentColor, 'Accent color')
    : undefined
  if (accentColorError) {
    errors.accentColor = accentColorError
  }

  return errors
}

const BRANDING_FIELDS = [
  ['appName', 'appName'],
  ['logoUrl', 'logoUrl'],
  ['primaryColor', 'primaryColor'],
  ['accentColor', 'accentColor'],
] as const satisfies readonly (readonly [
  OrganizationSettingsField,
  keyof OrganizationBrandingSettings,
])[]

/**
 * Build a `settings` patch holding only the fields that actually changed, so a
 * `PATCH /organizations/:id` never overwrites values the user did not touch.
 * Returns `null` when the form matches the saved settings.
 */
export function buildOrganizationSettingsPatch(
  values: OrganizationSettingsFormValues,
  currentSettings: Partial<OrganizationSettings> | null | undefined,
): OrganizationSettingsPatch | null {
  const current = normalizeOrganizationSettings(currentSettings)
  const patch: OrganizationSettingsPatch = {}

  const timezone = values.timezone.trim()
  if (timezone !== current.timezone) {
    patch.timezone = timezone
  }

  const locale = values.locale.trim()
  if (locale !== current.locale) {
    patch.locale = locale
  }

  const branding: Partial<OrganizationBrandingSettings> = {}
  for (const [field, brandingKey] of BRANDING_FIELDS) {
    const next = values[field].trim() || null
    if (next !== current.branding[brandingKey]) {
      branding[brandingKey] = next
    }
  }

  if (Object.keys(branding).length > 0) {
    patch.branding = branding
  }

  return Object.keys(patch).length > 0 ? patch : null
}

/**
 * IANA timezone options for the settings select, with the saved value kept in
 * the list even when the runtime does not report it.
 */
export function getTimezoneOptions(current?: string): string[] {
  const supported =
    typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : [...FALLBACK_TIMEZONES]

  const options = new Set<string>([DEFAULT_ORGANIZATION_TIMEZONE, ...supported])

  if (current) {
    options.add(current)
  }

  return [...options]
}

export function getLocaleOptions(current?: string): OrganizationLocaleOption[] {
  const options = ORGANIZATION_LOCALE_OPTIONS.map((option) => ({ ...option }))

  if (current && !options.some((option) => option.value === current)) {
    options.push({ value: current, label: current })
  }

  return options
}
