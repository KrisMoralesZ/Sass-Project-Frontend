import { describe, expect, it } from 'vitest'
import type { UserProfile } from './api/user-api.types'
import {
  buildProfilePatch,
  toProfileFormValues,
  validateProfileForm,
  type ProfileFormValues,
} from './user-profile-settings'

const savedProfile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  email: 'owner@acme.local',
  displayName: 'Jane Owner',
  avatarUrl: 'https://cdn.example.com/avatars/jane.png',
  preferences: {
    timezone: 'America/New_York',
    locale: 'en',
    theme: 'system',
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

describe('validateProfileForm', () => {
  it('accepts the saved profile unchanged', () => {
    expect(validateProfileForm(formValues())).toEqual({})
  })

  it('allows empty display name and avatar URL', () => {
    expect(
      validateProfileForm(formValues({ displayName: '  ', avatarUrl: '' })),
    ).toEqual({})
  })

  it('rejects malformed avatar URL and locale', () => {
    const errors = validateProfileForm(
      formValues({
        avatarUrl: 'cdn.example.com/avatar.png',
        locale: 'english_US',
      }),
    )

    expect(errors.avatarUrl).toMatch(/http\(s\) URL/)
    expect(errors.locale).toMatch(/BCP 47/)
  })

  it('requires timezone and locale', () => {
    const errors = validateProfileForm(
      formValues({ timezone: '  ', locale: '' }),
    )

    expect(errors.timezone).toBe('Timezone is required.')
    expect(errors.locale).toBe('Locale is required.')
  })

  it('rejects an invalid theme value', () => {
    const errors = validateProfileForm(
      formValues({ theme: 'neon' as ProfileFormValues['theme'] }),
    )

    expect(errors.theme).toMatch(/valid theme/)
  })
})

describe('buildProfilePatch', () => {
  it('returns null when nothing changed', () => {
    expect(buildProfilePatch(formValues(), savedProfile)).toBeNull()
  })

  it('sends only changed top-level fields', () => {
    expect(
      buildProfilePatch(
        formValues({ displayName: 'Jane Updated' }),
        savedProfile,
      ),
    ).toEqual({ displayName: 'Jane Updated' })
  })

  it('clears nullable fields when emptied', () => {
    expect(
      buildProfilePatch(formValues({ avatarUrl: '   ' }), savedProfile),
    ).toEqual({ avatarUrl: null })
  })

  it('sends only changed preference keys', () => {
    expect(
      buildProfilePatch(
        formValues({
          timezone: 'Europe/Madrid',
          theme: 'dark',
          notifyMarketing: true,
        }),
        savedProfile,
      ),
    ).toEqual({
      preferences: {
        timezone: 'Europe/Madrid',
        theme: 'dark',
        notifications: { marketing: true },
      },
    })
  })
})
