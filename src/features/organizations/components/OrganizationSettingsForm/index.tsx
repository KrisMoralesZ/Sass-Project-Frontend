import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from 'react'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import type {
  OrganizationSettings,
  OrganizationSettingsPatch,
} from '../../api/organization-api.types'
import {
  APP_NAME_MAX_LENGTH,
  buildOrganizationSettingsPatch,
  COLOR_MAX_LENGTH,
  getLocaleOptions,
  getTimezoneOptions,
  LOGO_URL_MAX_LENGTH,
  toOrganizationSettingsFormValues,
  validateOrganizationSettingsForm,
  type OrganizationSettingsField,
  type OrganizationSettingsFieldErrors,
} from '../../organization-settings'
import { mapOrganizationSettingsApiError } from '../../organization-settings-errors'
import {
  $Actions,
  $ColorField,
  $Form,
  $FormError,
  $FormNotice,
  $Grid,
  $ReadOnlyNotice,
  $Section,
  $SectionHeader,
  $SectionLead,
  $SectionTitle,
  $Select,
  $Swatch,
} from './OrganizationSettingsForm.sc'

export interface IOrganizationSettingsForm {
  /** Saved settings from `GET /organizations/:id`. */
  settings: Partial<OrganizationSettings> | null | undefined
  /** Receives a patch with only the fields the user changed. */
  onSubmit?: (settings: OrganizationSettingsPatch) => void
  isSubmitting?: boolean
  /**
   * PATCH or membership API failure. Validation messages map onto fields;
   * forbidden and tenant-context failures stay at form level (task 2.3.3).
   */
  apiError?: unknown
  /** Explicit form-level message; takes precedence over `apiError` copy. */
  formError?: ReactNode
  /** Confirmation shown after a successful save. */
  notice?: ReactNode
  /**
   * View-only mode when the caller lacks `settings:update` (task 2.3.2).
   * Backend PATCH still enforces the same permission.
   */
  readOnly?: boolean
  /** Shown above the form when `readOnly` is true. */
  readOnlyMessage?: ReactNode
}

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

function toSwatchColor(value: string): string | null {
  const trimmed = value.trim()
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : null
}

/**
 * Organization settings form for timezone, locale, and branding placeholders
 * (task 2.3.1). Submits a `PATCH` payload holding only changed fields.
 * API validation maps onto fields; forbidden and tenant failures stay at
 * form level (task 2.3.3).
 */
const OrganizationSettingsForm: FC<IOrganizationSettingsForm> = ({
  settings,
  onSubmit,
  isSubmitting = false,
  apiError,
  formError,
  notice,
  readOnly = false,
  readOnlyMessage = 'You can view these settings, but only admins and owners can change them.',
}) => {
  const savedValues = useMemo(
    () => toOrganizationSettingsFormValues(settings),
    [settings],
  )
  const savedSignature = JSON.stringify(savedValues)

  const mappedApiError = useMemo(
    () => mapOrganizationSettingsApiError(apiError),
    [apiError],
  )
  const [values, setValues] = useState(savedValues)
  const [errors, setErrors] = useState<OrganizationSettingsFieldErrors>({})
  const [apiFieldErrors, setApiFieldErrors] =
    useState<OrganizationSettingsFieldErrors>(mappedApiError.fieldErrors)
  const [syncedSignature, setSyncedSignature] = useState(savedSignature)
  const [appliedApiError, setAppliedApiError] = useState(apiError)

  // Re-sync the form when saved settings change (initial load, save, refetch).
  if (syncedSignature !== savedSignature) {
    setSyncedSignature(savedSignature)
    setValues(savedValues)
    setErrors({})
    setApiFieldErrors({})
  }

  if (apiError !== appliedApiError) {
    setAppliedApiError(apiError)
    setApiFieldErrors(mappedApiError.fieldErrors)
  }

  const timezoneOptions = useMemo(
    () => getTimezoneOptions(savedValues.timezone),
    [savedValues.timezone],
  )
  const localeOptions = useMemo(
    () => getLocaleOptions(savedValues.locale),
    [savedValues.locale],
  )

  const patch = buildOrganizationSettingsPatch(values, settings)
  const isDirty = patch !== null
  const fieldsDisabled = isSubmitting || readOnly
  const fieldErrors = { ...apiFieldErrors, ...errors }
  const displayedFormError = formError ?? mappedApiError.formError

  const clearFieldError = (field: OrganizationSettingsField) => {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
    setApiFieldErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const updateField =
    (field: OrganizationSettingsField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      clearFieldError(field)
    }

  const handleReset = () => {
    setValues(savedValues)
    setErrors({})
    setApiFieldErrors({})
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (readOnly) {
      return
    }

    const nextErrors = validateOrganizationSettingsForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !patch) {
      return
    }

    onSubmit?.(patch)
  }

  return (
    <$Form onSubmit={handleSubmit} noValidate>
      <$Section>
        <$SectionHeader>
          <$SectionTitle>Regional defaults</$SectionTitle>
          <$SectionLead>
            Timezone and locale used for workspace-facing dates, numbers, and
            scheduling.
          </$SectionLead>
        </$SectionHeader>
        <$Grid>
          <FormField
            label="Timezone"
            htmlFor="organization-timezone"
            required
            error={fieldErrors.timezone}
          >
            <$Select
              id="organization-timezone"
              value={values.timezone}
              onChange={updateField('timezone')}
              disabled={fieldsDisabled}
            >
              {timezoneOptions.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </$Select>
          </FormField>
          <FormField
            label="Locale"
            htmlFor="organization-locale"
            required
            error={fieldErrors.locale}
          >
            <$Select
              id="organization-locale"
              value={values.locale}
              onChange={updateField('locale')}
              disabled={fieldsDisabled}
            >
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </$Select>
          </FormField>
        </$Grid>
      </$Section>

      <$Section>
        <$SectionHeader>
          <$SectionTitle>Branding placeholders</$SectionTitle>
          <$SectionLead>
            Stored for later theming work. Leave a field empty to clear it.
          </$SectionLead>
        </$SectionHeader>
        <FormField
          label="App name"
          htmlFor="organization-app-name"
          hint="Overrides the product name in workspace surfaces."
          error={fieldErrors.appName}
        >
          <Input
            id="organization-app-name"
            value={values.appName}
            onChange={updateField('appName')}
            placeholder="Acme Workspace"
            maxLength={APP_NAME_MAX_LENGTH}
            disabled={fieldsDisabled}
            fullWidth
          />
        </FormField>
        <FormField
          label="Logo URL"
          htmlFor="organization-logo-url"
          error={fieldErrors.logoUrl}
        >
          <Input
            id="organization-logo-url"
            type="url"
            value={values.logoUrl}
            onChange={updateField('logoUrl')}
            placeholder="https://cdn.example.com/logo.png"
            maxLength={LOGO_URL_MAX_LENGTH}
            disabled={fieldsDisabled}
            fullWidth
          />
        </FormField>
        <$Grid>
          <$ColorField>
            <$Swatch $color={toSwatchColor(values.primaryColor)} />
            <FormField
              label="Primary color"
              htmlFor="organization-primary-color"
              error={fieldErrors.primaryColor}
            >
              <Input
                id="organization-primary-color"
                value={values.primaryColor}
                onChange={updateField('primaryColor')}
                placeholder="#1a5c40"
                maxLength={COLOR_MAX_LENGTH}
                disabled={fieldsDisabled}
                fullWidth
              />
            </FormField>
          </$ColorField>
          <$ColorField>
            <$Swatch $color={toSwatchColor(values.accentColor)} />
            <FormField
              label="Accent color"
              htmlFor="organization-accent-color"
              error={fieldErrors.accentColor}
            >
              <Input
                id="organization-accent-color"
                value={values.accentColor}
                onChange={updateField('accentColor')}
                placeholder="#2a8f66"
                maxLength={COLOR_MAX_LENGTH}
                disabled={fieldsDisabled}
                fullWidth
              />
            </FormField>
          </$ColorField>
        </$Grid>
      </$Section>

      {readOnly && readOnlyMessage ? (
        <$ReadOnlyNotice role="status">{readOnlyMessage}</$ReadOnlyNotice>
      ) : null}
      {notice ? <$FormNotice role="status">{notice}</$FormNotice> : null}
      {displayedFormError ? (
        <$FormError role="alert">{displayedFormError}</$FormError>
      ) : null}

      {readOnly ? null : (
        <$Actions>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={!isDirty || isSubmitting}
          >
            Discard changes
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save settings
          </Button>
        </$Actions>
      )}
    </$Form>
  )
}

export default OrganizationSettingsForm
