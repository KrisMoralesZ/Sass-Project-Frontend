import { type ButtonHTMLAttributes, type FC, type ReactNode } from 'react'
import {
  $Button,
  $Label,
  $Spinner,
  type ButtonSize,
  type ButtonVariant,
} from './Button.sc'

export type { ButtonSize, ButtonVariant }

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

const Button: FC<IButton> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  type = 'button',
  ...rest
}) => {
  const isDisabled = Boolean(disabled || loading)

  return (
    <$Button
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <$Spinner aria-hidden="true" /> : null}
      <$Label $loading={loading}>{children}</$Label>
    </$Button>
  )
}

export default Button
