import { AccessibilityConfig, ThemeMode, DensityMode } from '../types';

const defaultConfig: AccessibilityConfig = {
  theme: 'auto',
  density: 'comfortable',
  screenReaderSupport: {
    enabled: true,
    announceChanges: true,
    announceProgress: true,
    verboseMode: false,
  },
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
};

/**
 * Obtiene la configuración de accesibilidad del usuario
 */
export const getAccessibilityConfig = async (userId: string): Promise<AccessibilityConfig> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem(`accessibility-config-${userId}`);
  if (saved) {
    return JSON.parse(saved);
  }

  return defaultConfig;
};

/**
 * Actualiza la configuración de accesibilidad del usuario
 */
export const updateAccessibilityConfig = async (
  userId: string,
  config: Partial<AccessibilityConfig>
): Promise<AccessibilityConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const current = await getAccessibilityConfig(userId);
  const updated: AccessibilityConfig = {
    ...current,
    ...config,
    savedAt: new Date().toISOString(),
    savedBy: userId,
  };

  localStorage.setItem(`accessibility-config-${userId}`, JSON.stringify(updated));

  // Aplicar configuración inmediatamente
  applyAccessibilityConfig(updated);

  return updated;
};

/**
 * Aplica la configuración de accesibilidad al documento
 */
export const applyAccessibilityConfig = (config: AccessibilityConfig): void => {
  const root = document.documentElement;

  // Aplicar tema
  root.classList.remove('theme-light', 'theme-dark');
  
  let themeToApply: 'light' | 'dark' = 'light';
  if (config.theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    themeToApply = prefersDark ? 'dark' : 'light';
  } else {
    themeToApply = config.theme;
  }
  
  root.classList.add(`theme-${themeToApply}`);
  root.setAttribute('data-theme', themeToApply);

  // Aplicar densidad
  root.classList.remove('density-comfortable', 'density-compact', 'density-spacious');
  root.classList.add(`density-${config.density}`);
  root.setAttribute('data-density', config.density);

  // Aplicar alto contraste
  if (config.highContrast) {
    root.classList.add('high-contrast');
    root.setAttribute('data-high-contrast', 'true');
  } else {
    root.classList.remove('high-contrast');
    root.removeAttribute('data-high-contrast');
  }

  // Aplicar movimiento reducido
  if (config.reducedMotion) {
    root.classList.add('reduced-motion');
    root.setAttribute('data-reduced-motion', 'true');
  } else {
    root.classList.remove('reduced-motion');
    root.removeAttribute('data-reduced-motion');
  }

  // Aplicar tamaño de fuente
  const fontSizeMap: Record<AccessibilityConfig['fontSize'], string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px',
  };
  root.style.setProperty('--font-size-base', fontSizeMap[config.fontSize]);

  // Aplicar soporte para lectores de pantalla
  if (config.screenReaderSupport.enabled) {
    root.setAttribute('aria-live', 'polite');
    if (config.screenReaderSupport.verboseMode) {
      root.setAttribute('aria-live', 'assertive');
    }
  } else {
    root.removeAttribute('aria-live');
  }

  // Aplicar estilos CSS variables para densidad
  const densitySpacing: Record<DensityMode, { padding: string; gap: string; margin: string }> = {
    compact: {
      padding: '0.5rem',
      gap: '0.5rem',
      margin: '0.5rem',
    },
    comfortable: {
      padding: '1rem',
      gap: '1rem',
      margin: '1rem',
    },
    spacious: {
      padding: '1.5rem',
      gap: '1.5rem',
      margin: '1.5rem',
    },
  };

  const spacing = densitySpacing[config.density];
  root.style.setProperty('--density-padding', spacing.padding);
  root.style.setProperty('--density-gap', spacing.gap);
  root.style.setProperty('--density-margin', spacing.margin);
};

/**
 * Anuncia cambios a lectores de pantalla
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

