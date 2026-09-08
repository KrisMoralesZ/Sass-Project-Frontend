import styled from 'styled-components'

export const $SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

export const $Select = styled.select`
  width: 100%;
  min-height: 2.5rem;
  padding: 0 ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.sm};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const $SelectLoading = styled.div`
  display: flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`

export const $SelectError = styled.div`
  display: flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.sm};
`
