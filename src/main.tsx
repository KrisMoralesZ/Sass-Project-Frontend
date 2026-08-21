import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthSessionProvider, SessionExpiredRecovery } from '@/features/auth'
import { AppQueryProvider } from '@/lib'
import { AppThemeProvider } from '@/styles'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <AppQueryProvider>
        <BrowserRouter>
          <AuthSessionProvider>
            <SessionExpiredRecovery />
            <App />
          </AuthSessionProvider>
        </BrowserRouter>
      </AppQueryProvider>
    </AppThemeProvider>
  </StrictMode>,
)
