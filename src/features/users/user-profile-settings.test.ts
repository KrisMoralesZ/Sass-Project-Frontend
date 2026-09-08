import { describe, expect, it } from 'vitest'
import type { UserProfile } from './api/user-api.types'
import {
  buildProfilePatch,
  DEFAULT_PROFILE_LOCALE,
  DEFAULT_PROFILE_NOTIFICATIONS,
  DEFAULT_PROFILE_THEME,
  DEFAULT_PROFILE_TIMEZONE,
  getProfileLocaleOptions,
  getProfileThemeOptions,
  getProfileTimezoneOptions,
  normalizeProfilePreferences,
  toProfileFormValues,
  type ProfileFormValues,
} from './user-profile-settings'

const savedProfile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  email: 'owner@company.com',
  displayName: 'Owner',
  avatarUrl: 'https://cdn.example.com/avatar.png',
  preferences: {
    timezone: 'America/New_York',
    locale: 'en',
    theme: 'dark',
    notifications: {
      email: true,
      inApp: true,
      marketing: false,
    },
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function formValues(
  overrides: Partial<ProfileFormValues> = {},
): ProfileFormValues {
  return {
    ...toProfileFormValues(savedProfile),
    ...overrides,
  }
}

describe('normalizeProfilePreferences', () => {
  it('falls back to backend defaults when profile is missing', () => {
    expect(normalizeProfilePreferences(undefined)).toEqual({
      displayName: '',
      avatarUrl: '',
      timezone: DEFAULT_PROFILE_TIMEZONE,
      locale: DEFAULT_PROFILE_LOCALE,
      theme: DEFAULT_PROFILE_THEME,
      notifyEmail: DEFAULT_PROFILE_NOTIFICATIONS.email,
      notifyInApp: DEFAULT_PROFILE_NOTIFICATIONS.inApp,
      notifyMarketing: DEFAULT_PROFILE_NOTIFICATIONS.marketing,
    })
  })
})

describe('toProfileFormValues', () => {
  it('maps null display name and avatar to empty strings', () => {
    expect(
      toProfileFormValues({
        ...savedProfile,
        displayName: null,
        avatarUrl: null,
      }),
    ).toEqual({
      displayName: '',
      avatarUrl: '',
      timezone: 'America/New_York',
      locale: 'en',
      theme: 'dark',
      notifyEmail: true,
      notifyInApp: true,
      notifyMarketing: false,
    })
  })
})

describe('buildProfilePatch', () => {
  it('returns null when there is no saved profile', () => {
    expect(buildProfilePatch(formValues(), null)).toBeNull()
  })

  it('returns null when the form matches the saved profile', () => {
    expect(buildProfilePatch(formValues(), savedProfile)).toBeNull()
  })

  it('sends only changed top-level fields', () => {
    expect(
      buildProfilePatch(
        formValues({ displayName: '  New Name  ', avatarUrl: '' }),
        savedProfile,
      ),
    ).toEqual({
      displayName: 'New Name',
      avatarUrl: null,
    })
  })

  it('sends nested preference patches for timezone, locale, and theme', () => {
    expect(
      buildProfilePatch(
        formValues({
          timezone: 'Europe/London',
          locale: 'es',
          theme: 'light',
        }),
        savedProfile,
      ),
    ).toEqual({
      preferences: {
        timezone: 'Europe/London',
        locale: 'es',
        theme: 'light',
      },
    })
  })

  it('sends partial notification preference patches', () => {
    expect(
      buildProfilePatch(
        formValues({ notifyEmail: false, notifyMarketing: true }),
        savedProfile,
      ),
    ).toEqual({
      preferences: {
        notifications: {
          email: false,
          marketing: true,
        },
      },
    })
  })
})

describe('profile option helpers', () => {
  it('delegates timezone and locale options to organization helpers', () => {
    expect(getProfileTimezoneOptions('Custom/Zone')).toContain('Custom/Zone')
    expect(getProfileLocaleOptions('xx-YY')).toContainEqual({
      value: 'xx-YY',
      label: 'xx-YY',
    })
  })

  it('returns the standard theme options', () => {
    expect(getProfileThemeOptions()).toEqual([
      { value: 'system', label: 'Match system' },
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ])
  })
})
