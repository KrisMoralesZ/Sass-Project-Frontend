import styled from 'styled-components'

export const $Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  width: 100%;
  max-width: 46rem;
`

export const $Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`

export const $Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.brand};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
  text-transform: uppercase;
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

export const $Meta = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};
  margin: 0;
`

export const $MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};

  dt {
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: ${({ theme }) => theme.font.size.xs};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: ${({ theme }) => theme.font.weight.medium};
  }
`

export const $Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
`

export const $ErrorPanel = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`
