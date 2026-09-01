import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession } from '@/features/auth'
import LoginForm from '@/features/auth/components/LoginForm'
import {
  $DevPreview,
  $DevPreviewButton,
} from '@/features/auth/components/LoginForm/LoginForm.sc'
import { paths } from '@/routes/paths'

/** Local-only shell preview until login API wiring (1.2.4). Not a real API session. */
const DEV_PREVIEW_TOKENS = {
  accessToken: 'dev-access-token',
  refreshToken: 'dev-refresh-token',
} as const

function getPostLoginPath(state: unknown): string {
  const from = (state as { from?: { pathname?: string } } | null)?.from
    ?.pathname
  return from && from !== paths.login ? from : paths.home
}

const LoginPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { establishSession } = useAuthSession()
  /** Destination after a successful sign-in (from `RequireAuth` redirect state). */
  const redirectTo = getPostLoginPath(location.state)

  return (
    <main>
      <LoginForm
      // 1.2.4: useMutation(login) → establishSession(tokens, user) →
      // navigate(redirectTo, { replace: true })
      />
      {import.meta.env.DEV ? (
        <$DevPreview>
          Dev only:{' '}
          <$DevPreviewButton
            type="button"
            onClick={() => {
              establishSession({ ...DEV_PREVIEW_TOKENS })
              navigate(redirectTo, { replace: true })
            }}
          >
            Preview app shell
          </$DevPreviewButton>
          {redirectTo !== paths.home ? ` → ${redirectTo}` : null}
        </$DevPreview>
      ) : null}
    </main>
  )
}

export default LoginPage
