import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const $UserMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`

export const $UserLabel = styled.p`
  margin: 0;
  padding: 0 ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const $UserMeta = styled.p`
  margin: 0;
  padding: 0 ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const $ProfileLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-decoration: none;
  transition:
    color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    background ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
    background: ${({ theme }) => theme.colors.brandMuted};
  }

  &.active {
    color: ${({ theme }) => theme.colors.brand};
    background: ${({ theme }) => theme.colors.brandMuted};
    font-weight: ${({ theme }) => theme.font.weight.semibold};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`
