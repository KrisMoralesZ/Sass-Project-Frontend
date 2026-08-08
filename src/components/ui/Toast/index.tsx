import { type FC, type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  $CloseButton,
  $Content,
  $Description,
  $Title,
  $Toast,
  $Viewport,
  type ToastVariant,
} from './Toast.sc'

export type { ToastVariant }

export interface IToast {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  variant?: ToastVariant
  /** Auto-dismiss delay in ms. `null` disables auto-dismiss. */
  duration?: number | null
}

const Toast: FC<IToast> = ({
  open,
  onClose,
  title,
  children,
  variant = 'default',
  duration = 5000,
}) => {
  useEffect(() => {
    if (!open || duration === null) {
      return
    }

    const timer = window.setTimeout(() => {
      onClose()
    }, duration)

    return () => window.clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const isError = variant === 'error'

  return createPortal(
    <$Viewport>
      <$Toast
        $variant={variant}
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
      >
        <$Content>
          {title ? <$Title>{title}</$Title> : null}
          {children ? <$Description>{children}</$Description> : null}
        </$Content>
        <$CloseButton type="button" aria-label="Dismiss" onClick={onClose}>
          ×
        </$CloseButton>
      </$Toast>
    </$Viewport>,
    document.body,
  )
}

export default Toast
