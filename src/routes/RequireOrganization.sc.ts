import styled from 'styled-components'

export const $EmptyState = styled.main`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.space.md};
  max-width: 34rem;
  margin: 10vh auto 0;
  padding: ${({ theme }) => theme.space.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const $Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.xl};
`

export const $Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const $Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  flex-wrap: wrap;
`
