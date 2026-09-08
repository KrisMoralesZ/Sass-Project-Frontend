import { describe, expect, it } from 'vitest'
import type { OrganizationSettings } from './api/organization-api.types'
import {
  buildOrganizationSettingsPatch,
  getLocaleOptions,
  getTimezoneOptions,
  normalizeOrganizationSettings,
  toOrganizationSettingsFormValues,
  validateOrganizationSettingsForm,
  type OrganizationSettingsFormValues,
} from './organization-settings'

const savedSettings: OrganizationSettings = {
  timezone: 'America/New_York',
  locale: 'en',
  branding: {
    logoUrl: 'https://cdn.example.com/logo.png',
    primaryColor: '#1a5c40',
    accentColor: null,
    appName: 'Acme Workspace',
  },
  featureFlags: {
    betaBoards: false,
    advancedReports: false,
    memberInvites: false,
    customBranding: false,
  },
}

function formValues(
  overrides: Partial<OrganizationSettingsFormValues> = {},
): OrganizationSettingsFormValues {
  return {
    ...toOrganizationSettingsFormValues(savedSettings),
    ...overrides,
  }
}

describe('normalizeOrganizationSettings', () => {
  it('falls back to backend defaults for missing keys', () => {
    expect(normalizeOrganizationSettings(undefined)).toEqual({
      timezone: 'UTC',
      locale: 'en',
      branding: {
        logoUrl: null,
        primaryColor: null,
        accentColor: null,
        appName: null,
      },
      featureFlags: {
        betaBoards: false,
        advancedReports: false,
        memberInvites: false,
        customBranding: false,
      },
    })
  })
})

describe('toOrganizationSettingsFormValues', () => {
  it('maps null branding values to empty strings', () => {
    expect(toOrganizationSettingsFormValues(savedSettings)).toEqual({
      timezone: 'America/New_York',
      locale: 'en',
      appName: 'Acme Workspace',
      logoUrl: 'https://cdn.example.com/logo.png',
      primaryColor: '#1a5c40',
      accentColor: '',
    })
  })
})

describe('validateOrganizationSettingsForm', () => {
  it('accepts the saved settings unchanged', () => {
    expect(validateOrganizationSettingsForm(formValues())).toEqual({})
  })

  it('requires timezone and locale', () => {
    const errors = validateOrganizationSettingsForm(
      formValues({ timezone: '  ', locale: '' }),
    )

    expect(errors.timezone).toBe('Timezone is required.')
    expect(errors.locale).toBe('Locale is required.')
  })

  it('rejects malformed locale, logo URL, and colors', () => {
    const errors = validateOrganizationSettingsForm(
      formValues({
        locale: 'english_US',
        logoUrl: 'cdn.example.com/logo.png',
        primaryColor: 'forest-green',
      }),
    )

    expect(errors.locale).toMatch(/BCP 47/)
    expect(errors.logoUrl).toMatch(/http\(s\) URL/)
    expect(errors.primaryColor).toMatch(/hex color/)
  })

  it('allows empty branding fields', () => {
    expect(
      validateOrganizationSettingsForm(
        formValues({
          appName: '',
          logoUrl: '',
          primaryColor: '',
          accentColor: '',
        }),
      ),
    ).toEqual({})
  })
})

describe('buildOrganizationSettingsPatch', () => {
  it('returns null when nothing changed', () => {
    expect(
      buildOrganizationSettingsPatch(formValues(), savedSettings),
    ).toBeNull()
  })

  it('sends only the changed top-level fields', () => {
    expect(
      buildOrganizationSettingsPatch(
        formValues({ timezone: 'Europe/Madrid' }),
        savedSettings,
      ),
    ).toEqual({ timezone: 'Europe/Madrid' })
  })

  it('sends only the changed branding keys', () => {
    expect(
      buildOrganizationSettingsPatch(
        formValues({ accentColor: '#2a8f66' }),
        savedSettings,
      ),
    ).toEqual({ branding: { accentColor: '#2a8f66' } })
  })

  it('clears a branding value with null when the field is emptied', () => {
    expect(
      buildOrganizationSettingsPatch(
        formValues({ logoUrl: '   ' }),
        savedSettings,
      ),
    ).toEqual({ branding: { logoUrl: null } })
  })

  it('trims values before comparing', () => {
    expect(
      buildOrganizationSettingsPatch(
        formValues({
          timezone: ' America/New_York ',
          appName: ' Acme Workspace ',
        }),
        savedSettings,
      ),
    ).toBeNull()
  })

  it('treats missing saved settings as backend defaults', () => {
    expect(
      buildOrganizationSettingsPatch(
        {
          timezone: 'UTC',
          locale: 'en',
          appName: 'Acme',
          logoUrl: '',
          primaryColor: '',
          accentColor: '',
        },
        undefined,
      ),
    ).toEqual({ branding: { appName: 'Acme' } })
  })
})

describe('select options', () => {
  it('always offers UTC and keeps the saved timezone', () => {
    const options = getTimezoneOptions('Mars/Olympus_Mons')

    expect(options).toContain('UTC')
    expect(options).toContain('Mars/Olympus_Mons')
  })

  it('appends an unknown saved locale', () => {
    expect(getLocaleOptions('is-IS')).toContainEqual({
      value: 'is-IS',
      label: 'is-IS',
    })
  })
})
