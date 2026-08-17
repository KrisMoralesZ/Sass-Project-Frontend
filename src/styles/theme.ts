/**
 * Canopy design tokens for styled-components.
 * See docs/design-direction.md for the visual rationale.
 */
export interface AppTheme {
  colors: {
    background: string
    surface: string
    surfaceMuted: string
    surfaceElevated: string
    text: string
    textMuted: string
    textSubtle: string
    border: string
    borderStrong: string
    brand: string
    brandHover: string
    brandActive: string
    brandMuted: string
    brandContrast: string
    danger: string
    dangerMuted: string
    success: string
    successMuted: string
    warning: string
    warningMuted: string
    info: string
    infoMuted: string
    focus: string
    focusRing: string
    overlay: string
  }
  space: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
  radii: {
    sm: string
    md: string
    lg: string
    pill: string
    full: string
  }
  font: {
    family: {
      sans: string
      mono: string
    }
    size: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
    }
    weight: {
      regular: number
      medium: number
      semibold: number
      bold: number
    }
    lineHeight: {
      tight: number
      normal: number
      relaxed: number
    }
    letterSpacing: {
      tight: string
      normal: string
      wide: string
    }
  }
  shadow: {
    sm: string
    md: string
    lg: string
    focus: string
  }
  motion: {
    duration: {
      fast: string
      normal: string
      slow: string
    }
    easing: {
      standard: string
      enter: string
      exit: string
    }
  }
  layout: {
    contentMaxWidth: string
    shellMaxWidth: string
    navHeight: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  zIndex: {
    dropdown: number
    sticky: number
    modal: number
    toast: number
  }
}

/** Canopy — forest green workspace palette on cool green-gray neutrals. */
export const defaultTheme: AppTheme = {
  colors: {
    background: '#edf1ee',
    surface: '#ffffff',
    surfaceMuted: '#e4ebe6',
    surfaceElevated: '#ffffff',
    text: '#122018',
    textMuted: '#4f6358',
    textSubtle: '#7a8f83',
    border: '#cdd8d1',
    borderStrong: '#a8b8ae',
    brand: '#1a5c40',
    brandHover: '#174f37',
    brandActive: '#124030',
    brandMuted: '#d8ebe1',
    brandContrast: '#ffffff',
    danger: '#b42318',
    dangerMuted: '#fdecea',
    success: '#1a5c40',
    successMuted: '#d8ebe1',
    warning: '#9a6700',
    warningMuted: '#f8eed8',
    info: '#2d6a8f',
    infoMuted: '#dbeaf2',
    focus: '#2a8f66',
    focusRing: 'rgba(42, 143, 102, 0.35)',
    overlay: 'rgba(18, 32, 24, 0.48)',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
    '2xl': '3.5rem',
    '3xl': '5rem',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    pill: '9999px',
    full: '9999px',
  },
  font: {
    family: {
      sans: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', sans-serif",
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.75rem',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.65,
    },
    letterSpacing: {
      tight: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
  },
  shadow: {
    sm: '0 1px 2px rgba(18, 32, 24, 0.06)',
    md: '0 4px 12px rgba(18, 32, 24, 0.08)',
    lg: '0 12px 32px rgba(18, 32, 24, 0.12)',
    focus: '0 0 0 3px rgba(42, 143, 102, 0.35)',
  },
  motion: {
    duration: {
      fast: '120ms',
      normal: '180ms',
      slow: '280ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  layout: {
    contentMaxWidth: '42rem',
    shellMaxWidth: '80rem',
    navHeight: '3.5rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 1000,
    toast: 1100,
  },
}
