import {
  type FC,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import {
  $Body,
  $CloseButton,
  $Footer,
  $Header,
  $Overlay,
  $Panel,
  $Title,
} from './Dialog.sc'

export interface IDialog {
  open: boolean
  onClose: () => void
  title: ReactNode
  children?: ReactNode
  footer?: ReactNode
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Dialog: FC<IDialog> = ({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closeOnEscape, onClose])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <$Overlay onClick={onOverlayClick}>
      <$Panel
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <$Header>
          <$Title id={titleId}>{title}</$Title>
          <$CloseButton
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </$CloseButton>
        </$Header>
        {children ? <$Body>{children}</$Body> : null}
        {footer ? <$Footer>{footer}</$Footer> : null}
      </$Panel>
    </$Overlay>,
    document.body,
  )
}

export default Dialog
