import { fireEvent, render, screen } from '@testing-library/react'
import styled from 'styled-components'
import { describe, expect, it } from 'vitest'
import AppThemeProvider from './AppThemeProvider'
import { useThemePreference } from './useThemePreference'

const Sample = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`

function ThemeProbe() {
  const { preference, resolvedMode, setPreference } = useThemePreference()

  return (
    <div>
      <Sample data-testid="sample">Sample surface</Sample>
      <p data-testid="preference">{preference}</p>
      <p data-testid="resolved">{resolvedMode}</p>
      <button type="button" onClick={() => setPreference('dark')}>
        Use dark
      </button>
      <button type="button" onClick={() => setPreference('light')}>
        Use light
      </button>
    </div>
  )
}

describe('AppThemeProvider', () => {
  it('defaults to the initial preference and switches modes', () => {
    render(
      <AppThemeProvider initialPreference="light">
        <ThemeProbe />
      </AppThemeProvider>,
    )

    expect(screen.getByTestId('preference').textContent).toBe('light')
    expect(screen.getByTestId('resolved').textContent).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Use dark' }))

    expect(screen.getByTestId('preference').textContent).toBe('dark')
    expect(screen.getByTestId('resolved').textContent).toBe('dark')
  })
})
