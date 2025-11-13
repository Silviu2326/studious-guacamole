import type { ConfiguracionAccesibilidad } from '../types';

const STORAGE_KEY = 'dietas_configuracion_accesibilidad';

// Configuración por defecto
const CONFIG_DEFAULT: Omit<ConfiguracionAccesibilidad, 'dietistaId' | 'creadoEn' | 'actualizadoEn'> = {
  modoAltoContraste: false,
  soporteLectorPantalla: false,
  anunciosLectorPantalla: {
    cambiosEstado: true,
    navegacion: true,
    interacciones: false,
    contenidoDinamico: true,
  },
  etiquetasARIA: {
    usarLabelsDescriptivos: true,
    usarLandmarks: true,
    usarRoles: true,
    usarLiveRegions: true,
  },
  navegacionTeclado: {
    skipLinks: true,
    focusVisible: true,
    ordenTab: true,
  },
};

/**
 * Obtiene la configuración de accesibilidad del dietista
 */
export async function getConfiguracionAccesibilidad(
  dietistaId: string
): Promise<ConfiguracionAccesibilidad> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar configuración de accesibilidad:', error);
  }

  // Retornar configuración por defecto
  return {
    dietistaId,
    ...CONFIG_DEFAULT,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
}

/**
 * Guarda la configuración de accesibilidad del dietista
 */
export async function guardarConfiguracionAccesibilidad(
  config: ConfiguracionAccesibilidad
): Promise<ConfiguracionAccesibilidad> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const configActualizada: ConfiguracionAccesibilidad = {
    ...config,
    actualizadoEn: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${config.dietistaId}`,
      JSON.stringify(configActualizada)
    );
  } catch (error) {
    console.error('Error al guardar configuración de accesibilidad:', error);
  }

  // Aplicar configuración inmediatamente
  aplicarConfiguracionAccesibilidad(configActualizada);

  return configActualizada;
}

/**
 * Aplica la configuración de accesibilidad al documento
 */
export function aplicarConfiguracionAccesibilidad(config: ConfiguracionAccesibilidad): void {
  const root = document.documentElement;
  const body = document.body;

  // Aplicar modo alto contraste
  if (config.modoAltoContraste) {
    root.classList.add('modo-alto-contraste');
    root.setAttribute('data-alto-contraste', 'true');
  } else {
    root.classList.remove('modo-alto-contraste');
    root.removeAttribute('data-alto-contraste');
  }

  // Aplicar soporte para lectores de pantalla
  if (config.soporteLectorPantalla) {
    root.setAttribute('data-lector-pantalla', 'true');
    body.setAttribute('role', 'application');
    body.setAttribute('aria-label', 'Editor de dietas');

    // Añadir live region para anuncios
    if (config.anunciosLectorPantalla.contenidoDinamico) {
      let liveRegion = document.getElementById('aria-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        body.appendChild(liveRegion);
      }
    }

    // Añadir skip links si están habilitados
    if (config.navegacionTeclado.skipLinks) {
      let skipLinks = document.getElementById('skip-links');
      if (!skipLinks) {
        skipLinks = document.createElement('div');
        skipLinks.id = 'skip-links';
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
          <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
          <a href="#navigation" class="skip-link">Saltar a navegación</a>
        `;
        body.insertBefore(skipLinks, body.firstChild);
      }
    }

    // Aplicar focus visible mejorado
    if (config.navegacionTeclado.focusVisible) {
      root.classList.add('focus-visible-mejorado');
    } else {
      root.classList.remove('focus-visible-mejorado');
    }
  } else {
    root.removeAttribute('data-lector-pantalla');
    body.removeAttribute('role');
    body.removeAttribute('aria-label');
    
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }
    
    const skipLinks = document.getElementById('skip-links');
    if (skipLinks) {
      skipLinks.remove();
    }
    
    root.classList.remove('focus-visible-mejorado');
  }
}

/**
 * Anuncia un mensaje al lector de pantalla
 */
export function anunciarLectorPantalla(mensaje: string, prioridad: 'polite' | 'assertive' = 'polite'): void {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', prioridad);
    liveRegion.textContent = mensaje;
    
    // Limpiar después de un tiempo para permitir nuevos anuncios
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
}

/**
 * Actualiza solo el modo alto contraste
 */
export async function actualizarModoAltoContraste(
  dietistaId: string,
  activado: boolean
): Promise<ConfiguracionAccesibilidad> {
  const config = await getConfiguracionAccesibilidad(dietistaId);
  config.modoAltoContraste = activado;
  return guardarConfiguracionAccesibilidad(config);
}

/**
 * Actualiza solo el soporte para lectores de pantalla
 */
export async function actualizarSoporteLectorPantalla(
  dietistaId: string,
  activado: boolean
): Promise<ConfiguracionAccesibilidad> {
  const config = await getConfiguracionAccesibilidad(dietistaId);
  config.soporteLectorPantalla = activado;
  return guardarConfiguracionAccesibilidad(config);
}

