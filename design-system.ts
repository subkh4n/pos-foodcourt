
/**
 * Foodcourt POS Design System
 * Centralized theme and component styles to ensure UI consistency.
 */

export const theme = {
  colors: {
    primary: {
      light: 'bg-emerald-50',
      main: 'bg-emerald-500',
      dark: 'bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-500',
      shadow: 'shadow-emerald-100',
    },
    neutral: {
      bg: 'bg-slate-50',
      surface: 'bg-white',
      border: 'border-slate-100',
      borderDark: 'border-slate-200',
      textMain: 'text-slate-800',
      textMuted: 'text-slate-400',
      textDark: 'text-slate-900',
    },
    danger: {
      light: 'bg-red-50',
      main: 'bg-red-500',
      text: 'text-red-500',
    }
  },
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  transition: 'transition-all duration-200 ease-in-out',
};

export const styles = {
  // Common UI Elements
  card: `${theme.colors.neutral.surface} ${theme.radius.xl} border ${theme.colors.neutral.border} ${theme.shadow.sm} ${theme.transition}`,
  input: `w-full px-4 py-3 ${theme.radius.md} border-2 border-transparent focus:border-emerald-500 ${theme.colors.neutral.surface} ${theme.shadow.sm} outline-none font-medium ${theme.transition}`,
  
  // Button Variants
  button: {
    base: `flex items-center justify-center gap-2 font-bold ${theme.transition} active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`,
    primary: `${theme.colors.primary.main} text-white hover:shadow-lg ${theme.colors.primary.shadow} ${theme.radius.md}`,
    secondary: `bg-slate-900 text-white hover:bg-slate-800 ${theme.shadow.xl} ${theme.radius.lg}`,
    outline: `bg-white text-slate-600 border ${theme.colors.neutral.borderDark} hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 ${theme.radius.md}`,
    ghost: `text-slate-400 hover:text-emerald-500 hover:bg-slate-50 ${theme.radius.md}`,
    dangerGhost: `text-slate-400 hover:text-red-500 hover:bg-red-50 ${theme.radius.md}`,
  },

  // Typography
  heading: {
    h1: 'text-3xl font-black text-slate-800 tracking-tight',
    h2: 'text-xl font-bold text-slate-800',
    h3: 'text-sm font-bold text-slate-800',
  },
  label: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest',
  badge: 'text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider',
};
