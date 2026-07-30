/**
 * Application theme tokens for styled-components.
 * Visual system expansion (primitives, Storybook) lands in task 0.2.
 */
export interface AppTheme {
  colors: {
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
    brand: string
    brandContrast: string
    danger: string
    focus: string
  }
  space: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  radii: {
    sm: string
    md: string
    lg: string
  }
  font: {
    family: {
      sans: string
      mono: string
    }
    size: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    weight: {
      regular: number
      medium: number
      bold: number
    }
    lineHeight: {
      tight: number
      normal: number
    }
  }
  shadow: {
    sm: string
  }
  zIndex: {
    dropdown: number
    modal: number
  }
}

export const defaultTheme: AppTheme = {
  colors: {
    background: '#f3f6f4',
    surface: '#ffffff',
    text: '#14201b',
    textMuted: '#5a6b63',
    border: '#d7e0db',
    brand: '#1f6b4a',
    brandContrast: '#ffffff',
    danger: '#a33b2b',
    focus: '#2f8f68',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  radii: {
    sm: '0.25rem',
    md: '0.4rem',
    lg: '0.75rem',
  },
  font: {
    family: {
      sans: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', sans-serif",
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    size: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '2rem',
    },
    weight: {
      regular: 400,
      medium: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
    },
  },
  shadow: {
    sm: '0 1px 2px rgba(20, 32, 27, 0.08)',
  },
  zIndex: {
    dropdown: 100,
    modal: 1000,
  },
}
