import { PreferenciasMetricas, ConfiguracionMetrica, TipoMetrica } from '../types';

const STORAGE_KEY_PREFIX = 'dietas_metricas_prefs';
const STORAGE_KEY_DEFAULT = `${STORAGE_KEY_PREFIX}_default`;
const STORAGE_KEY_CLIENTE_PREFIX = `${STORAGE_KEY_PREFIX}_cliente_`;

// Configuración por defecto de métricas
const METRICAS_DEFAULT: ConfiguracionMetrica[] = [
  { id: 'kcal', label: 'Kcal Objetivo', visible: true, orden: 1 },
  { id: 'macronutrientes', label: 'Macronutrientes', visible: true, orden: 2 },
  { id: 'ratio-proteina', label: 'Ratio Proteína/kg', visible: true, orden: 3 },
  { id: 'vasos-agua', label: 'Vasos de Agua', visible: true, orden: 4 },
  { id: 'fibra', label: 'Fibra', visible: true, orden: 5 },
];

/**
 * Obtiene las preferencias de métricas por defecto
 */
export function getPreferenciasDefault(): PreferenciasMetricas {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_DEFAULT);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar preferencias por defecto:', error);
  }
  
  return {
    metricas: METRICAS_DEFAULT,
  };
}

/**
 * Guarda las preferencias de métricas por defecto
 */
export function guardarPreferenciasDefault(preferencias: PreferenciasMetricas): void {
  try {
    localStorage.setItem(STORAGE_KEY_DEFAULT, JSON.stringify(preferencias));
  } catch (error) {
    console.error('Error al guardar preferencias por defecto:', error);
  }
}

/**
 * Obtiene las preferencias de métricas para un cliente específico
 */
export function getPreferenciasCliente(clienteId: string): PreferenciasMetricas | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_CLIENTE_PREFIX}${clienteId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar preferencias del cliente:', error);
  }
  
  return null;
}

/**
 * Guarda las preferencias de métricas para un cliente específico
 */
export function guardarPreferenciasCliente(clienteId: string, preferencias: PreferenciasMetricas): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_CLIENTE_PREFIX}${clienteId}`, JSON.stringify(preferencias));
  } catch (error) {
    console.error('Error al guardar preferencias del cliente:', error);
  }
}

/**
 * Obtiene las preferencias de métricas (cliente específico o por defecto)
 */
export function getPreferenciasMetricas(clienteId?: string): PreferenciasMetricas {
  if (clienteId) {
    const preferenciasCliente = getPreferenciasCliente(clienteId);
    if (preferenciasCliente) {
      return preferenciasCliente;
    }
  }
  
  return getPreferenciasDefault();
}

/**
 * Guarda las preferencias de métricas (cliente específico o por defecto)
 */
export function guardarPreferenciasMetricas(preferencias: PreferenciasMetricas, clienteId?: string): void {
  if (clienteId) {
    guardarPreferenciasCliente(clienteId, preferencias);
  } else {
    guardarPreferenciasDefault(preferencias);
  }
}

/**
 * Resetea las preferencias a los valores por defecto
 */
export function resetearPreferencias(clienteId?: string): void {
  if (clienteId) {
    try {
      localStorage.removeItem(`${STORAGE_KEY_CLIENTE_PREFIX}${clienteId}`);
    } catch (error) {
      console.error('Error al resetear preferencias del cliente:', error);
    }
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY_DEFAULT);
    } catch (error) {
      console.error('Error al resetear preferencias por defecto:', error);
    }
  }
}

/**
 * Crea una configuración inicial de métricas si no existe
 */
export function inicializarMetricas(): ConfiguracionMetrica[] {
  return METRICAS_DEFAULT.map(m => ({ ...m }));
}

