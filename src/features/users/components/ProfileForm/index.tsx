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
import type { UserProfile } from '../../api/user-api.types'
import type { UpdateUserProfileRequest } from '../../api/user-api.types'
import { mapProfileApiError } from '../../profile-settings-errors'
import {
  AVATAR_URL_MAX_LENGTH,
  buildProfilePatch,
  DISPLAY_NAME_MAX_LENGTH,
  getProfileLocaleOptions,
  getProfileThemeOptions,
  getProfileTimezoneOptions,
  toProfileFormValues,
  validateProfileForm,
  type ProfileField,
  type ProfileFieldErrors,
  type ProfileFormValues,
} from '../../user-profile-settings'
import {
  $Actions,
  $Checkbox,
  $Form,
  $FormError,
  $Grid,
  $ReadOnlyValue,
  $Section,
  $SectionHeader,
  $SectionLead,
  $SectionTitle,
  $Select,
  $ToggleCopy,
  $ToggleError,
  $ToggleHint,
  $ToggleItem,
  $ToggleLabel,
  $ToggleList,
} from './ProfileForm.sc'

export interface IProfileForm {
  profile: UserProfile | null | undefined
  email: string
  onSubmit?: (body: UpdateUserProfileRequest) => void
  isSubmitting?: boolean
  apiError?: unknown
  formError?: ReactNode
}

const NOTIFICATION_TOGGLES = [
  {
    field: 'notifyEmail' as const,
    label: 'Email notifications',
    hint: 'Assignments, mentions, and workspace activity delivered by email.',
  },
  {
    field: 'notifyInApp' as const,
    label: 'In-app notifications',
    hint: 'Show alerts inside the product when something needs attention.',
  },
  {
    field: 'notifyMarketing' as const,
    label: 'Product updates',
    hint: 'Occasional release notes and feature announcements.',
  },
] as const

/**
 * Profile settings form for display name, avatar URL, locale, theme, and
 * notification preferences (task 3.1.3). Client validation and API field
 * mapping follow the organization settings pattern (task 3.1.4).
 */
const ProfileForm: FC<IProfileForm> = ({
  profile,
  email,
  onSubmit,
  isSubmitting = false,
  apiError,
  formError,
}) => {
  const savedValues = useMemo(() => toProfileFormValues(profile), [profile])
  const savedSignature = JSON.stringify(savedValues)

  const mappedApiError = useMemo(() => mapProfileApiError(apiError), [apiError])
  const [values, setValues] = useState(savedValues)
  const [errors, setErrors] = useState<ProfileFieldErrors>({})
  const [apiFieldErrors, setApiFieldErrors] = useState<ProfileFieldErrors>(
    mappedApiError.fieldErrors,
  )
  const [syncedSignature, setSyncedSignature] = useState(savedSignature)
  const [appliedApiError, setAppliedApiError] = useState(apiError)

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
    () => getProfileTimezoneOptions(savedValues.timezone),
    [savedValues.timezone],
  )
  const localeOptions = useMemo(
    () => getProfileLocaleOptions(savedValues.locale),
    [savedValues.locale],
  )
  const themeOptions = useMemo(
    () => getProfileThemeOptions(savedValues.theme),
    [savedValues.theme],
  )

  const patch = buildProfilePatch(values, profile)
  const isDirty = patch !== null
  const fieldsDisabled = isSubmitting
  const fieldErrors = { ...apiFieldErrors, ...errors }
  const displayedFormError = formError ?? mappedApiError.formError

  const clearFieldError = (field: ProfileField) => {
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

  const updateTextField =
    (field: 'displayName' | 'avatarUrl') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      clearFieldError(field)
    }

  const updateSelectField =
    (field: 'timezone' | 'locale' | 'theme') =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target
      setValues((current) => ({
        ...current,
        [field]: value as ProfileFormValues[typeof field],
      }))
      clearFieldError(field)
    }

  const updateNotification =
    (field: 'notifyEmail' | 'notifyInApp' | 'notifyMarketing') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      setValues((current) => ({ ...current, [field]: checked }))
      clearFieldError(field)
    }

  const handleReset = () => {
    setValues(savedValues)
    setErrors({})
    setApiFieldErrors({})
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateProfileForm(values)
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
          <$SectionTitle>Identity</$SectionTitle>
          <$SectionLead>
            How you appear across the product. Email is managed separately.
          </$SectionLead>
        </$SectionHeader>
        <FormField label="Email" htmlFor="profile-email">
          <$ReadOnlyValue id="profile-email">{email}</$ReadOnlyValue>
        </FormField>
        <FormField
          label="Display name"
          htmlFor="profile-display-name"
          hint="Shown in the shell, member directory, and activity feeds."
          error={fieldErrors.displayName}
        >
          <Input
            id="profile-display-name"
            value={values.displayName}
            onChange={updateTextField('displayName')}
            placeholder="Jane Owner"
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            disabled={fieldsDisabled}
            fullWidth
          />
        </FormField>
        <FormField
          label="Avatar URL"
          htmlFor="profile-avatar-url"
          hint="Absolute http(s) link to your profile image."
          error={fieldErrors.avatarUrl}
        >
          <Input
            id="profile-avatar-url"
            type="url"
            value={values.avatarUrl}
            onChange={updateTextField('avatarUrl')}
            placeholder="https://cdn.example.com/avatars/jane.png"
            maxLength={AVATAR_URL_MAX_LENGTH}
            disabled={fieldsDisabled}
            fullWidth
          />
        </FormField>
      </$Section>

      <$Section>
        <$SectionHeader>
          <$SectionTitle>Preferences</$SectionTitle>
          <$SectionLead>
            Personal defaults for dates, language, and appearance.
          </$SectionLead>
        </$SectionHeader>
        <$Grid>
          <FormField
            label="Timezone"
            htmlFor="profile-timezone"
            required
            error={fieldErrors.timezone}
          >
            <$Select
              id="profile-timezone"
              value={values.timezone}
              onChange={updateSelectField('timezone')}
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
            htmlFor="profile-locale"
            required
            error={fieldErrors.locale}
          >
            <$Select
              id="profile-locale"
              value={values.locale}
              onChange={updateSelectField('locale')}
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
        <FormField
          label="Theme"
          htmlFor="profile-theme"
          hint="Your saved appearance preference. Product-wide theme switching is coming soon."
          error={fieldErrors.theme}
        >
          <$Select
            id="profile-theme"
            value={values.theme}
            onChange={updateSelectField('theme')}
            disabled={fieldsDisabled}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </$Select>
        </FormField>
      </$Section>

      <$Section>
        <$SectionHeader>
          <$SectionTitle>Notifications</$SectionTitle>
          <$SectionLead>
            Choose which updates you want to receive. Marketing delivery is not
            wired yet; the preference is stored for later.
          </$SectionLead>
        </$SectionHeader>
        <$ToggleList>
          {NOTIFICATION_TOGGLES.map(({ field, label, hint }) => (
            <$ToggleItem key={field}>
              <$Checkbox
                checked={values[field]}
                onChange={updateNotification(field)}
                disabled={fieldsDisabled}
              />
              <$ToggleCopy>
                <$ToggleLabel>{label}</$ToggleLabel>
                {fieldErrors[field] ? (
                  <$ToggleError role="alert">{fieldErrors[field]}</$ToggleError>
                ) : (
                  <$ToggleHint>{hint}</$ToggleHint>
                )}
              </$ToggleCopy>
            </$ToggleItem>
          ))}
        </$ToggleList>
      </$Section>

      {displayedFormError ? (
        <$FormError role="alert">{displayedFormError}</$FormError>
      ) : null}

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
          Save profile
        </Button>
      </$Actions>
    </$Form>
  )
}

export default ProfileForm
