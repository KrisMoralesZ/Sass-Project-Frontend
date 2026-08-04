import type { AppTheme } from './theme'
import { defaultTheme } from './theme'

type Breakpoint = keyof AppTheme['breakpoints']

/** Min-width media query for a theme breakpoint. */
export function mediaUp(breakpoint: Breakpoint, theme: AppTheme = defaultTheme) {
  return `@media (min-width: ${theme.breakpoints[breakpoint]})`
}

/** Max-width media query for a theme breakpoint. */
export function mediaDown(breakpoint: Breakpoint, theme: AppTheme = defaultTheme) {
  return `@media (max-width: calc(${theme.breakpoints[breakpoint]} - 0.02px))`
}
