import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import styled from 'styled-components'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AppThemeProvider from './AppThemeProvider'
import { getStoredThemePreference } from './theme-preference-storage'
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
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

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
    expect(getStoredThemePreference()).toBe('dark')
  })

  it('restores the stored preference after a remount', () => {
    const { unmount } = render(
      <AppThemeProvider initialPreference="light">
        <ThemeProbe />
      </AppThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Use dark' }))
    unmount()

    render(
      <AppThemeProvider>
        <ThemeProbe />
      </AppThemeProvider>,
    )

    expect(screen.getByTestId('preference').textContent).toBe('dark')
    expect(screen.getByTestId('resolved').textContent).toBe('dark')
  })
})
