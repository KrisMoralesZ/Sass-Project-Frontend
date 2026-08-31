import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type ReactNode,
  useCallback,
  useState,
} from 'react'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Input from '@/components/ui/Input'
import { paths } from '@/routes/paths'
import type { RegisterRequest } from '../../auth-api.types'
import { getPasswordError, PASSWORD_HINT } from '../../password'
import {
  $Footer,
  $FooterLink,
  $Form,
  $FormError,
  $Header,
  $Lead,
  $Panel,
  $Title,
} from './RegisterForm.sc'

const DISPLAY_NAME_MAX_LENGTH = 120

export interface IRegisterForm {
  /** Called after client-side validation succeeds. API wiring lands in 1.2.4. */
  onSubmit?: (values: RegisterRequest) => void
  isSubmitting?: boolean
  /** Server/API error shown above the submit button (task 1.2.5). */
  formError?: ReactNode
}

interface RegisterFormValues {
  email: string
  displayName: string
  password: string
  confirmPassword: string
}

type RegisterField = keyof RegisterFormValues

type FieldErrors = Partial<Record<RegisterField, string>>

const INITIAL_VALUES: RegisterFormValues = {
  email: '',
  displayName: '',
  password: '',
  confirmPassword: '',
}

function validateRegisterForm(values: RegisterFormValues): FieldErrors {
  const errors: FieldErrors = {}
  const email = values.email.trim()
  const displayName = values.displayName.trim()

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    errors.displayName = `Display name must be at most ${DISPLAY_NAME_MAX_LENGTH} characters`
  }

  const passwordError = getPasswordError(values.password)
  if (passwordError) {
    errors.password = passwordError
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const RegisterForm: FC<IRegisterForm> = ({
  onSubmit,
  isSubmitting = false,
  formError,
}) => {
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})

  const updateField = useCallback(
    (field: RegisterField) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      setErrors((current) => {
        if (!current[field]) {
          return current
        }
        const next = { ...current }
        delete next[field]
        return next
      })
    },
    [],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateRegisterForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const displayName = values.displayName.trim()
    const payload: RegisterRequest = {
      email: values.email.trim(),
      password: values.password,
      ...(displayName ? { displayName } : {}),
    }

    onSubmit?.(payload)
  }

  return (
    <$Panel>
      <$Header>
        <$Title>Create account</$Title>
        <$Lead>Start your workspace with an email and a strong password.</$Lead>
      </$Header>

      <$Form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" required error={errors.email}>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={updateField('email')}
            disabled={isSubmitting}
            fullWidth
          />
        </FormField>

        <FormField
          label="Display name"
          hint="Optional — shown to teammates in the workspace."
          error={errors.displayName}
        >
          <Input
            type="text"
            name="displayName"
            autoComplete="name"
            placeholder="Jane Owner"
            value={values.displayName}
            onChange={updateField('displayName')}
            disabled={isSubmitting}
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            fullWidth
          />
        </FormField>

        <FormField
          label="Password"
          required
          hint={PASSWORD_HINT}
          error={errors.password}
        >
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={updateField('password')}
            disabled={isSubmitting}
            fullWidth
          />
        </FormField>

        <FormField
          label="Confirm password"
          required
          error={errors.confirmPassword}
        >
          <Input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={updateField('confirmPassword')}
            disabled={isSubmitting}
            fullWidth
          />
        </FormField>

        {formError ? <$FormError role="alert">{formError}</$FormError> : null}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Create account
        </Button>
      </$Form>

      <$Footer>
        Already have an account?{' '}
        <$FooterLink to={paths.login}>Sign in</$FooterLink>
      </$Footer>
    </$Panel>
  )
}

export default RegisterForm
