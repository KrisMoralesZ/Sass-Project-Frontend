import { createGlobalStyle } from 'styled-components'

/**
 * Base document styles and CSS variable bridge for the Canopy theme.
 * Component-level styling continues in tasks 0.2.3+.
 */
export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;

    --color-background: ${({ theme }) => theme.colors.background};
    --color-surface: ${({ theme }) => theme.colors.surface};
    --color-text: ${({ theme }) => theme.colors.text};
    --color-text-muted: ${({ theme }) => theme.colors.textMuted};
    --color-border: ${({ theme }) => theme.colors.border};
    --color-brand: ${({ theme }) => theme.colors.brand};
    --color-brand-hover: ${({ theme }) => theme.colors.brandHover};
    --color-focus-ring: ${({ theme }) => theme.colors.focusRing};

    --font-sans: ${({ theme }) => theme.font.family.sans};
    --font-mono: ${({ theme }) => theme.font.family.mono};

    --shadow-sm: ${({ theme }) => theme.shadow.sm};
    --shadow-md: ${({ theme }) => theme.shadow.md};
    --shadow-focus: ${({ theme }) => theme.shadow.focus};

    --motion-duration-normal: ${({ theme }) => theme.motion.duration.normal};
    --motion-easing-standard: ${({ theme }) => theme.motion.easing.standard};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.family.sans};
    font-size: ${({ theme }) => theme.font.size.md};
    font-weight: ${({ theme }) => theme.font.weight.regular};
    line-height: ${({ theme }) => theme.font.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.font.letterSpacing.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.colors.brand};
    text-decoration-thickness: 1px;
    text-underline-offset: 0.15em;
    transition: color ${({ theme }) => theme.motion.duration.fast}
      ${({ theme }) => theme.motion.easing.standard};

    &:hover {
      color: ${({ theme }) => theme.colors.brandHover};
    }
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  code {
    font-family: ${({ theme }) => theme.font.family.mono};
    font-size: 0.9em;
  }
`
