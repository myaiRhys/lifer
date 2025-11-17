import type { Theme } from './types'

export const themes: Record<Theme, { name: string; colors: Record<string, string> }> = {
  dark: {
    name: 'Dark Ocean',
    colors: {
      'bg-primary': '#0f172a',
      'bg-secondary': '#1e293b',
      'bg-tertiary': '#334155',
      'border': '#475569',
      'text-primary': '#f1f5f9',
      'text-secondary': '#cbd5e1',
      'text-muted': '#94a3b8',
      'accent': '#3b82f6',
      'accent-hover': '#2563eb',
      'gradient-start': '#3b82f6',
      'gradient-mid': '#8b5cf6',
      'gradient-end': '#d946ef',
      'glow-color': 'rgba(59, 130, 246, 0.5)',
      'shimmer-color': 'rgba(139, 92, 246, 0.3)'
    }
  },
  light: {
    name: 'Light Mode',
    colors: {
      'bg-primary': '#ffffff',
      'bg-secondary': '#f8fafc',
      'bg-tertiary': '#f1f5f9',
      'border': '#e2e8f0',
      'text-primary': '#0f172a',
      'text-secondary': '#475569',
      'text-muted': '#64748b',
      'accent': '#3b82f6',
      'accent-hover': '#2563eb',
      'gradient-start': '#3b82f6',
      'gradient-mid': '#8b5cf6',
      'gradient-end': '#d946ef',
      'glow-color': 'rgba(59, 130, 246, 0.4)',
      'shimmer-color': 'rgba(139, 92, 246, 0.2)'
    }
  },
  ocean: {
    name: '🌊 Ocean',
    colors: {
      'bg-primary': '#0A2463',
      'bg-secondary': '#001427',
      'bg-tertiary': '#2F6D80',
      'border': 'rgba(102,204,255,0.3)',
      'text-primary': '#F9F9F9',
      'text-secondary': '#D9CFBC',
      'text-muted': '#AAEFDF',
      'accent': '#0066FF',
      'accent-hover': '#3E92CC',
      'gradient-start': '#0A2463',
      'gradient-mid': '#3E92CC',
      'gradient-end': '#AAEFDF',
      'glow-color': 'rgba(10,36,99,0.6)',
      'shimmer-color': 'rgba(62,146,204,0.3)'
    }
  },
  fire: {
    name: '🔥 Fire',
    colors: {
      'bg-primary': '#2B2B2B',
      'bg-secondary': '#4A4A4A',
      'bg-tertiary': '#B62203',
      'border': 'rgba(255,107,53,0.3)',
      'text-primary': '#F5F5F5',
      'text-secondary': '#FFD23F',
      'text-muted': '#FFA500',
      'accent': '#FF6B35',
      'accent-hover': '#FF4444',
      'gradient-start': '#FF0000',
      'gradient-mid': '#FF9A00',
      'gradient-end': '#FFD700',
      'glow-color': 'rgba(255,107,53,0.6)',
      'shimmer-color': 'rgba(255,68,68,0.4)'
    }
  },
  forest: {
    name: '🌲 Forest',
    colors: {
      'bg-primary': '#0F1E0D',
      'bg-secondary': '#19270D',
      'bg-tertiary': '#3A4928',
      'border': 'rgba(143,188,143,0.3)',
      'text-primary': '#F5F3ED',
      'text-secondary': '#E6DEB9',
      'text-muted': '#869D7A',
      'accent': '#4A7C59',
      'accent-hover': '#8FBC8F',
      'gradient-start': '#19270D',
      'gradient-mid': '#4A7C59',
      'gradient-end': '#8FBC8F',
      'glow-color': 'rgba(45,80,22,0.6)',
      'shimmer-color': 'rgba(74,124,89,0.3)'
    }
  },
  sunset: {
    name: 'Sunset Horizon',
    colors: {
      'bg-primary': '#1f0a1a',
      'bg-secondary': '#2e0f26',
      'bg-tertiary': '#3d1736',
      'border': '#5c2952',
      'text-primary': '#ffe6f5',
      'text-secondary': '#ffb3e6',
      'text-muted': '#cc80b8',
      'accent': '#f472b6',
      'accent-hover': '#ec4899',
      'gradient-start': '#ec4899',
      'gradient-mid': '#f472b6',
      'gradient-end': '#fbbf24',
      'glow-color': 'rgba(244, 114, 182, 0.6)',
      'shimmer-color': 'rgba(251, 191, 36, 0.3)'
    }
  },
  military: {
    name: '🎖️ Military Command',
    colors: {
      'bg-primary': '#1a251a',
      'bg-secondary': '#243e24',
      'bg-tertiary': '#2d4d2d',
      'border': '#3d5c3d',
      'text-primary': '#e8f0e8',
      'text-secondary': '#c2d6c2',
      'text-muted': '#8fad8f',
      'accent': '#4ade80',
      'accent-hover': '#22c55e',
      'gradient-start': '#3d5c3d',
      'gradient-mid': '#4ade80',
      'gradient-end': '#22c55e',
      'glow-color': 'rgba(74, 222, 128, 0.5)',
      'shimmer-color': 'rgba(61, 92, 61, 0.3)'
    }
  },
  cowboy: {
    name: '🤠 Wild West',
    colors: {
      'bg-primary': '#2d1810',
      'bg-secondary': '#4a2618',
      'bg-tertiary': '#6b3820',
      'border': '#8b4a28',
      'text-primary': '#fff5e6',
      'text-secondary': '#f5d6b3',
      'text-muted': '#d2a679',
      'accent': '#d2691e',
      'accent-hover': '#b8541a',
      'gradient-start': '#8b4a28',
      'gradient-mid': '#d2691e',
      'gradient-end': '#daa520',
      'glow-color': 'rgba(210, 105, 30, 0.6)',
      'shimmer-color': 'rgba(218, 165, 32, 0.3)'
    }
  },
  academic: {
    name: '🎓 Academic Scholar',
    colors: {
      'bg-primary': '#1e1f3a',
      'bg-secondary': '#2d2f5f',
      'bg-tertiary': '#3d4080',
      'border': '#4d508f',
      'text-primary': '#f0f1ff',
      'text-secondary': '#d4d6ff',
      'text-muted': '#a0a5cc',
      'accent': '#6366f1',
      'accent-hover': '#4f46e5',
      'gradient-start': '#4f46e5',
      'gradient-mid': '#6366f1',
      'gradient-end': '#818cf8',
      'glow-color': 'rgba(99, 102, 241, 0.6)',
      'shimmer-color': 'rgba(129, 140, 248, 0.3)'
    }
  },
  cyberpunk: {
    name: '💻 Cyber',
    colors: {
      'bg-primary': '#121212',
      'bg-secondary': '#1E1E1E',
      'bg-tertiary': '#424242',
      'border': 'rgba(187,134,252,0.3)',
      'text-primary': 'rgba(255,255,255,0.87)',
      'text-secondary': 'rgba(255,255,255,0.60)',
      'text-muted': '#39FF14',
      'accent': '#BB86FC',
      'accent-hover': '#03DAC6',
      'gradient-start': '#711C91',
      'gradient-mid': '#BB86FC',
      'gradient-end': '#03DAC6',
      'glow-color': 'rgba(187,134,252,0.8)',
      'shimmer-color': 'rgba(3,218,198,0.4)'
    }
  },
  zen: {
    name: '🌱 Zen Garden',
    colors: {
      'bg-primary': '#1a2e1a',
      'bg-secondary': '#2d4a2d',
      'bg-tertiary': '#40664b',
      'border': '#52b788',
      'text-primary': '#f0fff0',
      'text-secondary': '#d8f3d8',
      'text-muted': '#95d5b2',
      'accent': '#52b788',
      'accent-hover': '#40916c',
      'gradient-start': '#40916c',
      'gradient-mid': '#52b788',
      'gradient-end': '#95d5b2',
      'glow-color': 'rgba(82, 183, 136, 0.5)',
      'shimmer-color': 'rgba(149, 213, 178, 0.3)'
    }
  }
}

export function applyTheme(theme: Theme) {
  const themeColors = themes[theme].colors
  const root = document.documentElement

  Object.entries(themeColors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  // Store in localStorage for persistence
  localStorage.setItem('lifer-theme', theme)
}

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem('lifer-theme')
  return (stored as Theme) || 'dark'
}

// Theme-specific terminology
export const themeLabels: Record<Theme, { xp: string; level: string; tasks: string; icon: string }> = {
  dark: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🎯' },
  light: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🎯' },
  ocean: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🌊' },
  fire: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🔥' },
  forest: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🌲' },
  sunset: { xp: 'XP', level: 'Level', tasks: 'Tasks', icon: '🌅' },
  military: { xp: 'Combat Points', level: 'Rank', tasks: 'Missions', icon: '🎖️' },
  cowboy: { xp: 'Honor Points', level: 'Renown', tasks: 'Bounties', icon: '🤠' },
  academic: { xp: 'Research Credits', level: 'Academic Rank', tasks: 'Assignments', icon: '🎓' },
  cyberpunk: { xp: 'Street Cred', level: 'Clearance', tasks: 'Exploits', icon: '🤖' },
  zen: { xp: 'Life Force', level: 'Growth Stage', tasks: 'Practices', icon: '🌱' }
}

export function getThemeLabels(theme?: Theme): typeof themeLabels[Theme] {
  const currentTheme = theme || getStoredTheme()
  return themeLabels[currentTheme] || themeLabels.dark
}
