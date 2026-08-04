import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styled, { css, keyframes } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brandContrast};
    border-color: ${({ theme }) => theme.colors.brand};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brandHover};
      border-color: ${({ theme }) => theme.colors.brandHover};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.brandActive};
      border-color: ${({ theme }) => theme.colors.brandActive};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderStrong};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceMuted};
      border-color: ${({ theme }) => theme.colors.borderStrong};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.border};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.brand};
    border-color: transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brandMuted};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.border};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.brandContrast};
    border-color: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      filter: brightness(0.94);
    }

    &:active:not(:disabled) {
      filter: brightness(0.88);
    }
  `,
}

const sizeStyles = {
  sm: css`
    min-height: 2rem;
    padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
    font-size: ${({ theme }) => theme.font.size.sm};
  `,
  md: css`
    min-height: 2.5rem;
    padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
    font-size: ${({ theme }) => theme.font.size.sm};
  `,
}

const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
  $loading: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.normal};
  cursor: ${({ $loading }) => ($loading ? 'wait' : 'pointer')};
  transition:
    background ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    border-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    filter ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`

const Spinner = styled.span`
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: ${({ theme }) => theme.radii.full};
  animation: ${spin} 0.65s linear infinite;
`

const Label = styled.span<{ $loading: boolean }>`
  opacity: ${({ $loading }) => ($loading ? 0.85 : 1)};
`

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner aria-hidden="true" /> : null}
      <Label $loading={loading}>{children}</Label>
    </StyledButton>
  )
}
