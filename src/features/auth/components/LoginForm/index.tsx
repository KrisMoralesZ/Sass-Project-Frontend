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
import type { LoginRequest } from '../../auth-api.types'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../password'
import {
  $Footer,
  $FooterLink,
  $Form,
  $FormError,
  $FormNotice,
  $Header,
  $Lead,
  $Panel,
  $Title,
} from './LoginForm.sc'

export interface ILoginForm {
  /** Called after client-side validation succeeds. API wiring lands in 1.2.4. */
  onSubmit?: (values: LoginRequest) => void
  isSubmitting?: boolean
  /** Server/API error shown above the submit button (task 1.2.5). */
  formError?: ReactNode
  /** Informational banner (e.g. session expired on redirect). */
  notice?: ReactNode
}

interface LoginFormValues {
  email: string
  password: string
}

type LoginField = keyof LoginFormValues

type FieldErrors = Partial<Record<LoginField, string>>

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
}

function validateLoginForm(values: LoginFormValues): FieldErrors {
  const errors: FieldErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be at most ${PASSWORD_MAX_LENGTH} characters`
  }

  return errors
}

const LoginForm: FC<ILoginForm> = ({
  onSubmit,
  isSubmitting = false,
  formError,
  notice,
}) => {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})

  const updateField = useCallback(
    (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) => {
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

    const nextErrors = validateLoginForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit?.({
      email: values.email.trim(),
      password: values.password,
    })
  }

  return (
    <$Panel>
      <$Header>
        <$Title>Sign in</$Title>
        <$Lead>Welcome back. Sign in to continue to your workspace.</$Lead>
      </$Header>

      <$Form onSubmit={handleSubmit} noValidate>
        {notice ? <$FormNotice role="status">{notice}</$FormNotice> : null}

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

        <FormField label="Password" required error={errors.password}>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={updateField('password')}
            disabled={isSubmitting}
            fullWidth
          />
        </FormField>

        {formError ? <$FormError role="alert">{formError}</$FormError> : null}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign in
        </Button>
      </$Form>

      <$Footer>
        Need an account?{' '}
        <$FooterLink to={paths.register}>Create one</$FooterLink>
      </$Footer>
    </$Panel>
  )
}

export default LoginForm
