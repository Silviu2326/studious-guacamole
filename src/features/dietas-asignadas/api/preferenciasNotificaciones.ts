import type { 
  PreferenciasNotificaciones, 
  ConfiguracionNotificacionEvento,
  TipoEventoNotificacion,
  TipoNotificacion
} from '../types';

const STORAGE_KEY = 'dietas_preferencias_notificaciones';

// Eventos por defecto con configuración inicial
const EVENTOS_DEFAULT: ConfiguracionNotificacionEvento[] = [
  {
    evento: 'feedback-recibido',
    email: true,
    push: true,
    inApp: true,
    configuracionAdicional: {
      soloFeedbackNegativo: false,
    },
  },
  {
    evento: 'ia-detecta-riesgo',
    email: true,
    push: true,
    inApp: true,
    configuracionAdicional: {
      soloRiesgosAltos: false,
    },
  },
  {
    evento: 'alerta-sobrecarga',
    email: true,
    push: false,
    inApp: true,
    configuracionAdicional: {
      soloSobrecargasAltas: true,
    },
  },
  {
    evento: 'nuevo-comentario',
    email: false,
    push: false,
    inApp: true,
  },
  {
    evento: 'encuesta-completada',
    email: false,
    push: false,
    inApp: true,
  },
  {
    evento: 'adherencia-baja',
    email: true,
    push: true,
    inApp: true,
    configuracionAdicional: {
      umbralAdherencia: 70,
    },
  },
  {
    evento: 'sugerencia-colaborador',
    email: false,
    push: false,
    inApp: true,
  },
  {
    evento: 'version-creada',
    email: false,
    push: false,
    inApp: false,
  },
];

// Preferencias por defecto
const PREFERENCIAS_DEFAULT: Omit<PreferenciasNotificaciones, 'dietistaId' | 'creadoEn' | 'actualizadoEn'> = {
  notificacionesActivas: true,
  eventos: EVENTOS_DEFAULT,
};

/**
 * Obtiene las preferencias de notificaciones del dietista
 */
export async function getPreferenciasNotificaciones(dietistaId: string): Promise<PreferenciasNotificaciones> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${dietistaId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Asegurar que todos los eventos estén presentes (por si se agregaron nuevos)
      const eventosExistentes = new Set(parsed.eventos.map((e: ConfiguracionNotificacionEvento) => e.evento));
      const eventosFaltantes = EVENTOS_DEFAULT.filter(e => !eventosExistentes.has(e.evento));
      return {
        ...parsed,
        eventos: [...parsed.eventos, ...eventosFaltantes],
      };
    }
  } catch (error) {
    console.error('Error al cargar preferencias de notificaciones:', error);
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
 * Guarda las preferencias de notificaciones del dietista
 */
export async function guardarPreferenciasNotificaciones(
  preferencias: PreferenciasNotificaciones
): Promise<PreferenciasNotificaciones> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const preferenciasActualizadas: PreferenciasNotificaciones = {
    ...preferencias,
    actualizadoEn: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${preferencias.dietistaId}`,
      JSON.stringify(preferenciasActualizadas)
    );
  } catch (error) {
    console.error('Error al guardar preferencias de notificaciones:', error);
  }

  // En producción, esto haría una llamada PUT a la API
  // return await fetch(`/api/preferencias-notificaciones/${preferencias.dietistaId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(preferenciasActualizadas),
  // }).then(res => res.json());

  return preferenciasActualizadas;
}

/**
 * Actualiza la configuración de un evento específico
 */
export async function actualizarConfiguracionEvento(
  dietistaId: string,
  evento: TipoEventoNotificacion,
  configuracion: Partial<ConfiguracionNotificacionEvento>
): Promise<PreferenciasNotificaciones> {
  const preferencias = await getPreferenciasNotificaciones(dietistaId);
  const eventosActualizados = preferencias.eventos.map(e => 
    e.evento === evento ? { ...e, ...configuracion } : e
  );
  
  return guardarPreferenciasNotificaciones({
    ...preferencias,
    eventos: eventosActualizados,
  });
}

/**
 * Activa o desactiva un tipo de notificación para un evento
 */
export async function toggleNotificacionEvento(
  dietistaId: string,
  evento: TipoEventoNotificacion,
  tipo: TipoNotificacion,
  activado: boolean
): Promise<PreferenciasNotificaciones> {
  return actualizarConfiguracionEvento(dietistaId, evento, { [tipo]: activado });
}

/**
 * Activa o desactiva todas las notificaciones
 */
export async function toggleNotificacionesGlobales(
  dietistaId: string,
  activado: boolean
): Promise<PreferenciasNotificaciones> {
  const preferencias = await getPreferenciasNotificaciones(dietistaId);
  return guardarPreferenciasNotificaciones({
    ...preferencias,
    notificacionesActivas: activado,
  });
}

