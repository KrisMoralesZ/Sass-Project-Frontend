import { createGlobalStyle } from 'styled-components'

/**
 * Base document styles driven by the app theme.
 * Component-level styling continues in later styled-components tasks.
 */
export const GlobalStyle = createGlobalStyle`
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
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.colors.brand};
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  code {
    font-family: ${({ theme }) => theme.font.family.mono};
    font-size: 0.9em;
  }
`
