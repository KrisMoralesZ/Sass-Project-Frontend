import styled, { css } from 'styled-components'

export type InputSize = 'sm' | 'md'

const sizeStyles = {
  sm: css`
    min-height: 2rem;
    padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
    font-size: ${({ theme }) => theme.font.size.sm};
  `,
  md: css`
    min-height: 2.5rem;
    padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
    font-size: ${({ theme }) => theme.font.size.sm};
  `,
} satisfies Record<InputSize, ReturnType<typeof css>>

export const $Input = styled.input<{
  $size: InputSize
  $fullWidth: boolean
  $error: boolean
}>`
  display: block;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? theme.colors.danger : theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.family.sans};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  line-height: ${({ theme }) => theme.font.lineHeight.normal};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.normal};
  transition:
    border-color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    box-shadow ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    background ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

  ${({ $size }) => sizeStyles[$size]}

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.danger : theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.danger : theme.colors.brand};
    box-shadow: ${({ theme, $error }) =>
      $error ? `0 0 0 3px ${theme.colors.dangerMuted}` : theme.shadow.focus};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`
