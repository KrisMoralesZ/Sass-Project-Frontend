import styled, { css } from 'styled-components'
import { OrganizationRole } from '../../permissions/organization-role'

export const $Badge = styled.span<{ $role: OrganizationRole }>`
  display: inline-flex;
  align-items: center;
  min-height: 1.5rem;
  padding: 0 ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  white-space: nowrap;

  ${({ $role, theme }) => {
    if ($role === OrganizationRole.OWNER) {
      return css`
        background: ${theme.colors.brandMuted};
        color: ${theme.colors.brand};
      `
    }

    if ($role === OrganizationRole.ADMIN) {
      return css`
        background: ${theme.colors.infoMuted};
        color: ${theme.colors.info};
      `
    }

    if ($role === OrganizationRole.MEMBER) {
      return css`
        background: ${theme.colors.surfaceMuted};
        color: ${theme.colors.text};
      `
    }

    return css`
      background: ${theme.colors.surfaceMuted};
      color: ${theme.colors.textSubtle};
    `
  }}
`
