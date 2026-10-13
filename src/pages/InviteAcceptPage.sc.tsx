import styled from 'styled-components'

export const $Page = styled.main`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space['3xl']} 0;
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
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${({ theme }) => theme.font.weight.bold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`

export const $Lead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $DevNotice = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.md};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

export const $Panel = styled.section`
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const $Actions = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: stretch;

    > button {
      width: 100%;
    }
  }
`

export const $Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
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

export const $ErrorTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`
