import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { mediaUp } from '@/styles'

export const $Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};

  ${mediaUp('md')} {
    flex-direction: row;
  }
`

export const $Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  ${mediaUp('md')} {
    width: 15.5rem;
    flex-shrink: 0;
    min-height: 100vh;
    padding: ${({ theme }) => theme.space.lg};
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`

export const $BrandLink = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

export const $BrandMark = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  color: ${({ theme }) => theme.colors.brand};
`

export const $BrandMeta = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
  text-transform: uppercase;
`

export const $Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};

  ${mediaUp('md')} {
    flex: 1;
    flex-direction: column;
    flex-wrap: nowrap;
  }
`

export const $NavItem = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
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

export const $SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const $Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};

  ${mediaUp('md')} {
    padding: ${({ theme }) => theme.space.xl};
  }
`

export const $MainInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.shellMaxWidth};
`
