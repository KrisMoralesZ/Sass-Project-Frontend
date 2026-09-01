import type { Preview } from '@storybook/react-vite'
import AppQueryProvider from '../src/lib/AppQueryProvider'
import { AppThemeProvider } from '../src/styles'

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <AppQueryProvider>
          <Story />
        </AppQueryProvider>
      </AppThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
