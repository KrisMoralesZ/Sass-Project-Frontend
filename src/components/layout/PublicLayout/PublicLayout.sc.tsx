import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { mediaUp } from '@/styles'

export const $Shell = styled.div`
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      120% 80% at 10% -10%,
      ${({ theme }) => theme.colors.brandMuted} 0%,
      transparent 55%
    ),
    radial-gradient(
      90% 70% at 100% 0%,
      ${({ theme }) => theme.colors.infoMuted} 0%,
      transparent 50%
    ),
    ${({ theme }) => theme.colors.background};
`

export const $Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  min-height: ${({ theme }) => theme.layout.navHeight};
  padding: ${({ theme }) => theme.space.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface}eb;
  backdrop-filter: blur(8px);

  ${mediaUp('md')} {
    padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
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
  font-size: ${({ theme }) => theme.font.size.xl};
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
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};

  ${mediaUp('md')} {
    gap: ${({ theme }) => theme.space.md};
  }
`

export const $NavLink = styled(Link)`
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  transition:
    color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard},
    background ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
    background: ${({ theme }) => theme.colors.brandMuted};
  }
`

export const $NavButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.brandContrast};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  text-decoration: none;
  transition: background ${({ theme }) => theme.motion.duration.fast}
    ${({ theme }) => theme.motion.easing.standard};

  &:hover {
    background: ${({ theme }) => theme.colors.brandHover};
    color: ${({ theme }) => theme.colors.brandContrast};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const $Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};

  ${mediaUp('md')} {
    align-items: center;
    padding: ${({ theme }) => theme.space['2xl']}
      ${({ theme }) => theme.space.xl};
  }
`

export const $ContentInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
`
