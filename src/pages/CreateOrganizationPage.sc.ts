import styled from 'styled-components'

export const $Page = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.xl};
  align-items: start;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 0.8fr) minmax(20rem, 1fr);
    align-items: center;
    min-height: 70vh;
  }
`

export const $Intro = styled.section`
  span {
    color: ${({ theme }) => theme.colors.brand};
    font-size: ${({ theme }) => theme.font.size.xs};
    font-weight: ${({ theme }) => theme.font.weight.semibold};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing.wide};
    text-transform: uppercase;
  }

  h1 {
    margin: ${({ theme }) => theme.space.sm} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: ${({ theme }) => theme.font.lineHeight.tight};
  }

  p {
    max-width: 28rem;
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

export const $Panel = styled.section`
  padding: ${({ theme }) => theme.space.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

export const $Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
`

export const $PlanSelect = styled.select`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font: inherit;

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const $Status = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.sm};
`

export const $Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.sm};
  flex-wrap: wrap;
`
