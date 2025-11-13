import type { PreferenciasTemaFuente, TemaColor, TamañoFuente } from '../types';

const STORAGE_KEY = 'dietas_preferencias_tema_fuente';

// Preferencias por defecto
const PREFERENCIAS_DEFAULT: Omit<PreferenciasTemaFuente, 'dietistaId' | 'creadoEn' | 'actualizadoEn'> = {
  tema: 'claro',
  tamañoFuente: 'mediano',
};

/**
 * Obtiene las preferencias de tema y fuente del dietista
 */
export async function getPreferenciasTemaFuente(dietistaId: string): Promise<PreferenciasTemaFuente> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar preferencias de tema y fuente:', error);
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
 * Guarda las preferencias de tema y fuente del dietista
 */
export async function guardarPreferenciasTemaFuente(
  preferencias: PreferenciasTemaFuente
): Promise<PreferenciasTemaFuente> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const preferenciasActualizadas: PreferenciasTemaFuente = {
    ...preferencias,
    actualizadoEn: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${preferencias.dietistaId}`,
      JSON.stringify(preferenciasActualizadas)
    );
  } catch (error) {
    console.error('Error al guardar preferencias de tema y fuente:', error);
  }

  // En producción, esto haría una llamada PUT a la API
  // return await fetch(`/api/preferencias-tema-fuente/${preferencias.dietistaId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(preferenciasActualizadas),
  // }).then(res => res.json());

  return preferenciasActualizadas;
}

/**
 * Actualiza solo el tema
 */
export async function actualizarTema(
  dietistaId: string,
  tema: TemaColor
): Promise<PreferenciasTemaFuente> {
  const preferencias = await getPreferenciasTemaFuente(dietistaId);
  return guardarPreferenciasTemaFuente({
    ...preferencias,
    tema,
  });
}

/**
 * Actualiza solo el tamaño de fuente
 */
export async function actualizarTamañoFuente(
  dietistaId: string,
  tamañoFuente: TamañoFuente
): Promise<PreferenciasTemaFuente> {
  const preferencias = await getPreferenciasTemaFuente(dietistaId);
  return guardarPreferenciasTemaFuente({
    ...preferencias,
    tamañoFuente,
  });
}

/**
 * Aplica las preferencias de tema y fuente al documento
 */
export function aplicarPreferenciasTemaFuente(preferencias: PreferenciasTemaFuente): void {
  const root = document.documentElement;

  // Aplicar tema
  root.classList.remove('tema-claro', 'tema-oscuro', 'tema-sepia', 'tema-alto-contraste');
  
  if (preferencias.tema === 'auto') {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'tema-oscuro' : 'tema-claro');
  } else {
    root.classList.add(`tema-${preferencias.tema}`);
  }

  // Aplicar tamaño de fuente
  const tamañosFuente: Record<TamañoFuente, string> = {
    'pequeño': '14px',
    'mediano': '16px',
    'grande': '18px',
    'muy-grande': '20px',
  };

  const tamañoBase = preferencias.configuracionAvanzada?.tamañoFuentePersonalizado 
    ? `${preferencias.configuracionAvanzada.tamañoFuentePersonalizado}px`
    : tamañosFuente[preferencias.tamañoFuente];

  root.style.setProperty('--tamaño-fuente-base', tamañoBase);

  // Aplicar configuración avanzada si existe
  if (preferencias.configuracionAvanzada) {
    const { colorFondo, colorTexto, colorPrimario, espaciadoLinea, contraste } = 
      preferencias.configuracionAvanzada;

    if (colorFondo) {
      root.style.setProperty('--color-fondo-personalizado', colorFondo);
    }
    if (colorTexto) {
      root.style.setProperty('--color-texto-personalizado', colorTexto);
    }
    if (colorPrimario) {
      root.style.setProperty('--color-primario-personalizado', colorPrimario);
    }
    if (espaciadoLinea) {
      root.style.setProperty('--espaciado-linea', espaciadoLinea.toString());
    }
    if (contraste) {
      root.style.setProperty('--contraste', contraste.toString());
    }
  }
}

