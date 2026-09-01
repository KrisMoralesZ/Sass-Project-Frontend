import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppQueryProvider from '@/lib/AppQueryProvider'
import AuthSessionProvider from '@/features/auth/AuthSessionProvider'
import SessionExpiredRecovery from '@/features/auth/SessionExpiredRecovery'
import AppThemeProvider from '@/styles/AppThemeProvider'
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
