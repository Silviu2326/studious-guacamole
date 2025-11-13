import type { PreferenciasDensidadLayout, DensidadLayout } from '../types';

const STORAGE_KEY = 'dietas_preferencias_densidad_layout';

// Preferencias por defecto
const PREFERENCIAS_DEFAULT: Omit<PreferenciasDensidadLayout, 'dietistaId' | 'creadoEn' | 'actualizadoEn'> = {
  densidad: 'estandar',
};

/**
 * Obtiene las preferencias de densidad de layout del dietista
 */
export async function getPreferenciasDensidadLayout(dietistaId: string): Promise<PreferenciasDensidadLayout> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar preferencias de densidad de layout:', error);
  }

  // Retornar preferencias por defecto
  return {
    dietistaId,
    ...PREFERENCIAS_DEFAULT,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
}

/**
 * Guarda las preferencias de densidad de layout del dietista
 */
export async function guardarPreferenciasDensidadLayout(
  preferencias: PreferenciasDensidadLayout
): Promise<PreferenciasDensidadLayout> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const preferenciasActualizadas: PreferenciasDensidadLayout = {
    ...preferencias,
    actualizadoEn: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${preferencias.dietistaId}`,
      JSON.stringify(preferenciasActualizadas)
    );
  } catch (error) {
    console.error('Error al guardar preferencias de densidad de layout:', error);
  }

  // Aplicar inmediatamente
  aplicarPreferenciasDensidadLayout(preferenciasActualizadas);

  // En producción, esto haría una llamada PUT a la API
  // return await fetch(`/api/preferencias-densidad-layout/${preferencias.dietistaId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(preferenciasActualizadas),
  // }).then(res => res.json());

  return preferenciasActualizadas;
}

/**
 * Actualiza solo la densidad
 */
export async function actualizarDensidadLayout(
  dietistaId: string,
  densidad: DensidadLayout
): Promise<PreferenciasDensidadLayout> {
  const preferencias = await getPreferenciasDensidadLayout(dietistaId);
  return guardarPreferenciasDensidadLayout({
    ...preferencias,
    densidad,
  });
}

/**
 * Aplica las preferencias de densidad de layout al documento
 */
export function aplicarPreferenciasDensidadLayout(preferencias: PreferenciasDensidadLayout): void {
  const root = document.documentElement;

  // Remover clases anteriores
  root.classList.remove('densidad-compacto', 'densidad-estandar', 'densidad-amplio');
  
  // Aplicar nueva densidad
  root.classList.add(`densidad-${preferencias.densidad}`);

  // Aplicar variables CSS según la densidad
  const configuraciones: Record<DensidadLayout, { padding: string; gap: string; fontSize: string }> = {
    compacto: {
      padding: '0.5rem',
      gap: '0.5rem',
      fontSize: '0.875rem', // 14px
    },
    estandar: {
      padding: '1rem',
      gap: '1rem',
      fontSize: '1rem', // 16px
    },
    amplio: {
      padding: '1.5rem',
      gap: '1.5rem',
      fontSize: '1.125rem', // 18px
    },
  };

  const config = configuraciones[preferencias.densidad];
  root.style.setProperty('--densidad-padding', config.padding);
  root.style.setProperty('--densidad-gap', config.gap);
  root.style.setProperty('--densidad-font-size', config.fontSize);
}

