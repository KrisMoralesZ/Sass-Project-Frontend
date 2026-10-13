import { type FC, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '@/features/auth/components/LoginForm'
import { useLoginMutation } from '@/features/auth/hooks/use-login-mutation'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { paths } from '@/routes/paths'
import {
  consumeSessionExpiredNotice,
  SESSION_EXPIRED_MESSAGE,
} from '@/features/auth/session-expired-notice'

function getPostLoginPath(state: unknown): string {
  const from = (
    state as {
      from?: { pathname?: string; search?: string }
    } | null
  )?.from
  const fromPath = from?.pathname

  if (!fromPath || fromPath === paths.login || fromPath === paths.register) {
    return paths.home
  }

  return from?.search ? `${fromPath}${from.search}` : fromPath
}

const LoginPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = getPostLoginPath(location.state)
  const [sessionNotice] = useState(() => consumeSessionExpiredNotice())

  const loginMutation = useLoginMutation({
    onAuthenticated: () => {
      navigate(redirectTo, { replace: true })
    },
  })

  return (
    <main>
      <LoginForm
        isSubmitting={loginMutation.isPending}
        notice={sessionNotice ? SESSION_EXPIRED_MESSAGE : undefined}
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
