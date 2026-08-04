import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import type { AppTheme } from './theme'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  max-width: 56rem;
  padding: ${({ theme }) => theme.space.lg};
  font-family: ${({ theme }) => theme.font.family.sans};
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  letter-spacing: ${({ theme }) => theme.font.letterSpacing.tight};
`

const SectionLead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  line-height: ${({ theme }) => theme.font.lineHeight.relaxed};
`

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: ${({ theme }) => theme.space.sm};
`

const Swatch = styled.div<{ $bg: string; $fg?: string; $border?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 5.5rem;
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg, theme }) => $fg ?? theme.colors.text};
  border: ${({ $border, theme }) =>
    $border ? `1px solid ${theme.colors.border}` : 'none'};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
`

const SwatchLabel = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`

const TypeScale = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TypeRow = styled.div<{ $size: keyof AppTheme['font']['size'] }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  font-size: ${({ theme, $size }) => theme.font.size[$size]};
  line-height: ${({ theme }) => theme.font.lineHeight.normal};
`

const TypeMeta = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-family: ${({ theme }) => theme.font.family.mono};
`

const SpaceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`

const SpaceBar = styled.div<{ $width: string }>`
  height: 1rem;
  width: ${({ $width }) => $width};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.brandMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ShadowSamples = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.lg};
`

const ShadowCard = styled.div<{ $shadow: keyof AppTheme['shadow'] }>`
  width: 8rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme, $shadow }) => theme.shadow[$shadow]};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

function VisualDirectionOverview() {
  return (
    <Page>
      <Section>
        <SectionTitle>Canopy</SectionTitle>
        <SectionLead>
          Forest-green workspace palette on cool green-gray neutrals. Tokens
          below feed upcoming UI primitives (0.2.3+) and layout shells
          (0.2.8–0.2.9). See <code>docs/design-direction.md</code>.
        </SectionLead>
      </Section>

      <Section>
        <SectionTitle>Brand &amp; neutrals</SectionTitle>
        <SwatchGrid>
          <Swatch $bg="#1a5c40" $fg="#ffffff">
            <SwatchLabel>brand</SwatchLabel>
          </Swatch>
          <Swatch $bg="#174f37" $fg="#ffffff">
            <SwatchLabel>brandHover</SwatchLabel>
          </Swatch>
          <Swatch $bg="#d8ebe1">
            <SwatchLabel>brandMuted</SwatchLabel>
          </Swatch>
          <Swatch $bg="#edf1ee" $border>
            <SwatchLabel>background</SwatchLabel>
          </Swatch>
          <Swatch $bg="#ffffff" $border>
            <SwatchLabel>surface</SwatchLabel>
          </Swatch>
          <Swatch $bg="#e4ebe6" $border>
            <SwatchLabel>surfaceMuted</SwatchLabel>
          </Swatch>
        </SwatchGrid>
      </Section>

      <Section>
        <SectionTitle>Semantic</SectionTitle>
        <SwatchGrid>
          <Swatch $bg="#b42318" $fg="#ffffff">
            <SwatchLabel>danger</SwatchLabel>
          </Swatch>
          <Swatch $bg="#fdecea">
            <SwatchLabel>dangerMuted</SwatchLabel>
          </Swatch>
          <Swatch $bg="#9a6700" $fg="#ffffff">
            <SwatchLabel>warning</SwatchLabel>
          </Swatch>
          <Swatch $bg="#f8eed8">
            <SwatchLabel>warningMuted</SwatchLabel>
          </Swatch>
          <Swatch $bg="#2d6a8f" $fg="#ffffff">
            <SwatchLabel>info</SwatchLabel>
          </Swatch>
          <Swatch $bg="#dbeaf2">
            <SwatchLabel>infoMuted</SwatchLabel>
          </Swatch>
        </SwatchGrid>
      </Section>

      <Section>
        <SectionTitle>Typography</SectionTitle>
        <TypeScale>
          <TypeRow $size="2xl">
            <span>Page title — Source Sans 3</span>
            <TypeMeta>2xl / 28px</TypeMeta>
          </TypeRow>
          <TypeRow $size="xl">
            <span>Section subtitle</span>
            <TypeMeta>xl / 20px</TypeMeta>
          </TypeRow>
          <TypeRow $size="lg">
            <span>Card heading</span>
            <TypeMeta>lg / 18px</TypeMeta>
          </TypeRow>
          <TypeRow $size="md">
            <span>Body copy for forms, tables, and navigation.</span>
            <TypeMeta>md / 16px</TypeMeta>
          </TypeRow>
          <TypeRow $size="sm">
            <span>Secondary labels and table cells</span>
            <TypeMeta>sm / 14px</TypeMeta>
          </TypeRow>
          <TypeRow $size="xs">
            <span>Captions and badges</span>
            <TypeMeta>xs / 12px</TypeMeta>
          </TypeRow>
        </TypeScale>
      </Section>

      <Section>
        <SectionTitle>Spacing</SectionTitle>
        {(
          [
            ['xs', '0.25rem'],
            ['sm', '0.5rem'],
            ['md', '1rem'],
            ['lg', '1.5rem'],
            ['xl', '2.5rem'],
            ['2xl', '3.5rem'],
          ] as const
        ).map(([token, width]) => (
          <SpaceRow key={token}>
            <TypeMeta>{token}</TypeMeta>
            <SpaceBar $width={width} />
          </SpaceRow>
        ))}
      </Section>

      <Section>
        <SectionTitle>Elevation</SectionTitle>
        <ShadowSamples>
          <ShadowCard $shadow="sm">shadow.sm</ShadowCard>
          <ShadowCard $shadow="md">shadow.md</ShadowCard>
          <ShadowCard $shadow="lg">shadow.lg</ShadowCard>
          <ShadowCard $shadow="focus">shadow.focus</ShadowCard>
        </ShadowSamples>
      </Section>
    </Page>
  )
}

const meta = {
  title: 'Foundation/Visual direction',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <VisualDirectionOverview />,
}

export const ThemeActive: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <Swatch $bg="#ffffff" $border>
      <SwatchLabel>Theme provider active</SwatchLabel>
      <span>Brand: #1a5c40</span>
    </Swatch>
  ),
}
