import styled from 'styled-components'

export const $Scroll = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`

export const $Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.font.family.sans};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text};
`

export const $Caption = styled.caption`
  caption-side: top;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const $Head = styled.thead`
  background: ${({ theme }) => theme.colors.surfaceMuted};
`

export const $Body = styled.tbody``

export const $Row = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  ${$Body} &:hover {
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`

export const $HeaderCell = styled.th<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  text-align: ${({ $align }) => $align ?? 'left'};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
  text-transform: uppercase;
  white-space: nowrap;
`

export const $Cell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => theme.space.md};
  text-align: ${({ $align }) => $align ?? 'left'};
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.text};
`

export const $Empty = styled.td`
  padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`
