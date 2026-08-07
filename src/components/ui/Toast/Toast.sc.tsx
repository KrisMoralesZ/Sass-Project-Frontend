import styled, { css, keyframes } from 'styled-components'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

const slideIn = keyframes`
  from {
    transform: translateY(0.75rem);
  }
  to {
    transform: translateY(0);
  }
`

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border-color: ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.text};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successMuted};
    border-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.text};
  `,
  error: css`
    background: ${({ theme }) => theme.colors.dangerMuted};
    border-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.text};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningMuted};
    border-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.text};
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoMuted};
    border-color: ${({ theme }) => theme.colors.info};
    color: ${({ theme }) => theme.colors.text};
  `,
} satisfies Record<ToastVariant, ReturnType<typeof css>>

export const $Viewport = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.toast};
  right: ${({ theme }) => theme.space.md};
  bottom: ${({ theme }) => theme.space.md};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.sm};
  width: min(100% - ${({ theme }) => theme.space.md} * 2, 24rem);
  pointer-events: none;
`

export const $Toast = styled.div<{ $variant: ToastVariant }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm};
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  font-family: ${({ theme }) => theme.font.family.sans};
  pointer-events: auto;
  animation: ${slideIn} ${({ theme }) => theme.motion.duration.normal}
    ${({ theme }) => theme.motion.easing.enter};

  ${({ $variant }) => variantStyles[$variant]}
`

export const $Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  min-width: 0;
`

export const $Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  color: ${({ theme }) => theme.colors.text};
`

export const $Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  line-height: ${({ theme }) => theme.font.lineHeight.normal};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const $CloseButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin: -0.125rem -0.125rem 0 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`
