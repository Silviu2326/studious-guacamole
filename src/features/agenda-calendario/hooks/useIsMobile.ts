import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es móvil basado en el ancho de pantalla
 * @param breakpoint - Ancho en píxeles que define el límite entre móvil y desktop (default: 768px)
 * @returns boolean - true si es móvil, false si es desktop
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // SSR-safe: retornar false en servidor
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    // Usar matchMedia para mejor rendimiento y precisión
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Función para actualizar el estado
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Establecer valor inicial
    handleChange(mediaQuery);

    // Escuchar cambios (soporte moderno)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [breakpoint]);

  return isMobile;
};


