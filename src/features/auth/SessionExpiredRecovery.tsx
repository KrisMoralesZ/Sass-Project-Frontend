import { type FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '@/components/ui/Toast'
import { paths } from '@/routes/paths'
import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_TITLE,
} from './session-expired-notice'
import { subscribeSessionCleared } from './session-events'

/**
 * When refresh fails, shows a toast and sends the user to login.
 * Successful 401 → refresh → retry must not reach this path (task 1.3.4).
 * Explicit logout (`reason: 'logout'`) is handled separately in `useLogout`.
 */
const SessionExpiredRecovery: FC = () => {
  const navigate = useNavigate()
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => {
    return subscribeSessionCleared((reason) => {
      if (reason !== 'expired') {
        return
      }

      setToastOpen(true)

      const { pathname } = window.location
      if (pathname !== paths.login && pathname !== paths.register) {
        navigate(paths.login, { replace: true })
      }
    })
  }, [navigate])

  return (
    <Toast
      open={toastOpen}
      onClose={() => setToastOpen(false)}
      variant="warning"
      title={SESSION_EXPIRED_TITLE}
      duration={8000}
    >
      {SESSION_EXPIRED_MESSAGE}
    </Toast>
  )
}

export default SessionExpiredRecovery
