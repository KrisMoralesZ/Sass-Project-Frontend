import type { FC, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './GlobalStyle'
import { defaultTheme } from './theme'

export interface IAppThemeProvider {
  children: ReactNode
}

const AppThemeProvider: FC<IAppThemeProvider> = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}

export default AppThemeProvider
