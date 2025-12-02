// Design system utilities for Adherencia feature based on guiaestilos.md v2.0
export const ds = {
  // Colors - Paleta moderna según guía de estilos
  color: {
    // Primarios
    primary: 'text-[#6366F1]',
    primaryHover: 'hover:text-[#4F46E5]',
    primaryActive: 'active:text-[#4338CA]',
    primaryBg: 'bg-[#6366F1]',
    primaryBgHover: 'hover:bg-[#4F46E5]',
    primaryBgActive: 'active:bg-[#4338CA]',
    primaryLight: 'bg-[#EEF2FF]',
    primaryLightText: 'text-[#6366F1]',
    onPrimary: 'text-white',
    
    // Neutros
    background: 'bg-white',
    backgroundDark: 'dark:bg-[#0F0F23]',
    surface: 'bg-[#F8FAFC]',
    surfaceDark: 'dark:bg-[#1E1E2E]',
    surface2: 'bg-[#F1F5F9]',
    surface2Dark: 'dark:bg-[#2A2A3A]',
    textPrimary: 'text-[#0F172A]',
    textPrimaryDark: 'dark:text-[#F1F5F9]',
    textSecondary: 'text-[#64748B]',
    textSecondaryDark: 'dark:text-[#94A3B8]',
    textMuted: 'text-[#94A3B8]',
    textMutedDark: 'dark:text-[#64748B]',
    border: 'border-[#E2E8F0]',
    borderDark: 'dark:border-[#334155]',
    borderLight: 'border-[#F1F5F9]',
    borderLightDark: 'dark:border-[#475569]',
    
    // Estados semánticos
    success: 'text-[#10B981]',
    successBg: 'bg-[#D1FAE5]',
    successBgDark: 'dark:bg-[#064E3B]',
    warning: 'text-[#F59E0B]',
    warningBg: 'bg-[#FEF3C7]',
    warningBgDark: 'dark:bg-[#78350F]',
    error: 'text-[#EF4444]',
    errorBg: 'bg-[#FEE2E2]',
    errorBgDark: 'dark:bg-[#7F1D1D]',
    info: 'text-[#3B82F6]',
    infoBg: 'bg-[#DBEAFE]',
    infoBgDark: 'dark:bg-[#1E3A8A]',
  },

  // Tipografía - Escala moderna según guía
  typography: {
    displayLarge: 'text-[48px] leading-[56px] font-extrabold',
    display: 'text-[36px] leading-[44px] font-bold',
    h1: 'text-[30px] leading-[38px] font-bold',
    h2: 'text-[24px] leading-[32px] font-semibold',
    h3: 'text-[20px] leading-[28px] font-semibold',
    bodyLarge: 'text-[18px] leading-[28px] font-normal',
    body: 'text-[16px] leading-[24px] font-normal',
    bodySmall: 'text-[14px] leading-[20px] font-normal',
    caption: 'text-[12px] leading-[16px] font-medium',
    overline: 'text-[10px] leading-[16px] font-semibold uppercase tracking-wider',
  },

  // Contenedores - Radios y elevación modernos (look claro y elegante)
  card: 'bg-white rounded-2xl shadow-sm border border-transparent',
  cardHover: 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
  cardPad: 'p-6',
  panel: 'bg-white rounded-xl shadow-sm border border-transparent',

  // Badges - Diseño moderno con colores semánticos
  badge: {
    base: 'inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200',
    success: 'bg-[#D1FAE5] dark:bg-[#064E3B] text-[#10B981] dark:text-[#34D399]',
    warning: 'bg-[#FEF3C7] dark:bg-[#78350F] text-[#F59E0B] dark:text-[#FBBF24]',
    error: 'bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#EF4444] dark:text-[#F87171]',
    info: 'bg-[#DBEAFE] dark:bg-[#1E3A8A] text-[#3B82F6] dark:text-[#60A5FA]',
    primary: 'bg-[#EEF2FF] dark:bg-[#312E81] text-[#6366F1] dark:text-[#818CF8]',
  },

  // Inputs - Diseño moderno con focus states
  input: 'w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all duration-200 bg-white dark:bg-[#1E1E2E] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B]',
  select: 'w-full px-4 py-3 border border-[#E2E8F0] dark:border-[#334155] rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all duration-200 bg-white dark:bg-[#1E1E2E] text-[#0F172A] dark:text-[#F1F5F9]',

  // Botones - Variantes modernas con microinteracciones
  btn: {
    primary: 'inline-flex items-center justify-center bg-[#6366F1] hover:bg-[#4F46E5] active:bg-[#4338CA] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1] shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'inline-flex items-center justify-center bg-white dark:bg-[#1E1E2E] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#2A2A3A] hover:border-[#6366F1] px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]',
    ghost: 'inline-flex items-center justify-center text-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[#312E81] px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]',
    destructive: 'inline-flex items-center justify-center bg-[#EF4444] hover:bg-[#DC2626] active:bg-[#B91C1C] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4444] shadow-md hover:shadow-lg active:scale-[0.98]',
  },

  // Tabs - Navegación moderna
  tabs: {
    container: 'flex gap-2 border-b border-[#E2E8F0]',
    item: 'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] transition-all duration-200',
    itemActive: 'bg-[#EEF2FF] text-[#6366F1] border border-[#EEF2FF]',
  },

  // Animaciones - Easing functions modernas
  animation: {
    fast: 'transition-all duration-100 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    slower: 'transition-all duration-500 ease-out',
    bounce: 'transition-all duration-200 cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Estados de loading - Skeleton moderno
  skeleton: 'animate-pulse bg-[#F1F5F9] dark:bg-[#2A2A3A] rounded-lg',
  shimmer: 'animate-pulse bg-gradient-to-r from-[#F1F5F9] via-[#F8FAFC] to-[#F1F5F9] dark:from-[#2A2A3A] dark:via-[#1E1E2E] dark:to-[#2A2A3A] rounded-lg',

  // Espaciado - Sistema 8px
  spacing: {
    xs: 'p-1', // 4px
    sm: 'p-2', // 8px
    md: 'p-3', // 12px
    lg: 'p-4', // 16px
    xl: 'p-6', // 24px
    '2xl': 'p-8', // 32px
  },

  // Radios - Sistema moderno
  radius: {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
    full: 'rounded-full',
  },
};