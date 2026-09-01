import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '@/features/auth/components/LoginForm'
import { useLoginMutation } from '@/features/auth/hooks/use-login-mutation'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { paths } from '@/routes/paths'

function getPostLoginPath(state: unknown): string {
  const from = (state as { from?: { pathname?: string } } | null)?.from
    ?.pathname
  return from && from !== paths.login && from !== paths.register
    ? from
    : paths.home
}

const LoginPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = getPostLoginPath(location.state)

  const loginMutation = useLoginMutation({
    onAuthenticated: () => {
      navigate(redirectTo, { replace: true })
    },
  })

  return (
    <main>
      <LoginForm
        isSubmitting={loginMutation.isPending}
        formError={
          loginMutation.isError
            ? getApiErrorMessage(loginMutation.error)
            : undefined
        }
        onSubmit={(values) => {
          loginMutation.mutate(values)
        }}
      />
    </main>
  )
}

export default LoginPage
