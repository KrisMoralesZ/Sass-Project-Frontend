import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

/**
 * Smoke story to prove Storybook is wrapped in AppThemeProvider / GlobalStyle.
 * Real UI primitives land in later 0.2.x tasks.
 */
const Panel = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.font.family.sans};
  max-width: 24rem;
`

const Brand = styled.strong`
  color: ${({ theme }) => theme.colors.brand};
`

const meta = {
  title: 'Foundation/Theme',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Panel>
      Theme provider is active. Brand color: <Brand>theme.colors.brand</Brand>
    </Panel>
  ),
}
