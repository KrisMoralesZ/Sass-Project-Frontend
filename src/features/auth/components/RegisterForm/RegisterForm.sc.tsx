import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const $Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  width: 100%;
  max-width: 28rem;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const $Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

export const $Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size['2xl']};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`

export const $Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`

export const $Footer = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.brandHover};
  }
`
