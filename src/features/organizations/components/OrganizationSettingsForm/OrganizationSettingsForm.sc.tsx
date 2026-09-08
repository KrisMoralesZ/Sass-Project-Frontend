import styled from 'styled-components'

export const $Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

export const $Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const $SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`

export const $SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
`

export const $SectionLead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const $Select = styled.select`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font: inherit;

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textSubtle};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const $ColorField = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.sm};

  & > :last-child {
    flex: 1 1 auto;
    min-width: 0;
  }
`

export const $Swatch = styled.span<{ $color: string | null }>`
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $color, theme }) =>
    $color ??
    `repeating-linear-gradient(
      45deg,
      ${theme.colors.surfaceMuted},
      ${theme.colors.surfaceMuted} 4px,
      ${theme.colors.surface} 4px,
      ${theme.colors.surface} 8px
    )`};
`

export const $FormError = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerMuted};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $FormNotice = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.successMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.sm};
  flex-wrap: wrap;
`
