/**
 * Servicio mock para sincronización con Google Calendar
 * 
 * Este servicio soporta la parte de sincronización de eventos con calendarios externos.
 * Proporciona funciones para gestionar el estado de integración, sincronizar eventos
 * y desincronizar eventos del calendario.
 */

import { CalendarSync } from '../types';

/**
 * Contexto de usuario para operaciones de calendario
 */
export interface ContextoCalendario {
  userId?: string;
  email?: string;
}

/**
 * Estado de integración con Google Calendar
 */
export interface EstadoIntegracionCalendario {
  conectado: boolean;
  activo: boolean;
  calendarioId?: string;
  emailCalendario?: string;
  ultimaSincronizacion?: Date;
  error?: string;
}

// Mock storage para simular estado de integración
const MOCK_STORAGE_KEY = 'mock_calendar_integration';

/**
 * Obtiene el estado de la integración con Google Calendar
 * 
 * @param contexto - Contexto del usuario (userId, email, etc.)
 * @returns Estado de la integración con Google Calendar
 */
export const obtenerIntegracionCalendario = async (
  contexto?: ContextoCalendario
): Promise<EstadoIntegracionCalendario> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Intentar obtener estado guardado
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        conectado: data.conectado || false,
        activo: data.activo || false,
        calendarioId: data.calendarioId,
        emailCalendario: data.emailCalendario || contexto?.email,
        ultimaSincronizacion: data.ultimaSincronizacion 
          ? new Date(data.ultimaSincronizacion) 
          : undefined,
        error: data.error,
      };
    }

    // Estado por defecto: no conectado
    return {
      conectado: false,
      activo: false,
      emailCalendario: contexto?.email,
    };
  } catch (error) {
    console.error('Error obteniendo estado de integración:', error);
    return {
      conectado: false,
      activo: false,
      error: 'Error al obtener estado de integración',
    };
  }
};

/**
 * Sincroniza un evento con Google Calendar
 * Simula crear o actualizar un evento en el calendario externo
 * 
 * @param eventId - ID del evento a sincronizar
 * @returns Resultado de la sincronización
 */
export const sincronizarEventoConCalendario = async (
  eventId: string
): Promise<{
  success: boolean;
  eventoExternoId?: string;
  error?: string;
}> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // Verificar que la integración esté activa
    const estado = await obtenerIntegracionCalendario();
    if (!estado.conectado || !estado.activo) {
      return {
        success: false,
        error: 'La integración con Google Calendar no está activa',
      };
    }

    // Simular creación/actualización de evento en calendario externo
    const eventoExternoId = `google-cal-event-${eventId}-${Date.now()}`;

    // Guardar referencia del evento sincronizado
    const syncKey = `event_sync_${eventId}`;
    localStorage.setItem(
      syncKey,
      JSON.stringify({
        eventId,
        eventoExternoId,
        fechaSincronizacion: new Date().toISOString(),
      })
    );

    // Actualizar última sincronización
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      data.ultimaSincronizacion = new Date().toISOString();
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
    }

    console.log(`[CalendarioSyncService] Evento ${eventId} sincronizado con Google Calendar: ${eventoExternoId}`);

    return {
      success: true,
      eventoExternoId,
    };
  } catch (error) {
    console.error('Error sincronizando evento con calendario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al sincronizar',
    };
  }
};

/**
 * Desincroniza un evento (elimina del calendario externo)
 * 
 * @param eventId - ID del evento a desincronizar
 * @returns Resultado de la desincronización
 */
export const desincronizarEvento = async (
  eventId: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Buscar referencia del evento sincronizado
    const syncKey = `event_sync_${eventId}`;
    const stored = localStorage.getItem(syncKey);

    if (!stored) {
      // El evento no estaba sincronizado
      return {
        success: true,
      };
    }

    const data = JSON.parse(stored);
    const eventoExternoId = data.eventoExternoId;

    // Simular eliminación del evento en calendario externo
    console.log(`[CalendarioSyncService] Eliminando evento ${eventoExternoId} de Google Calendar`);

    // Eliminar referencia local
    localStorage.removeItem(syncKey);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error desincronizando evento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al desincronizar',
    };
  }
};

/**
 * Función auxiliar para inicializar la integración con Google Calendar (mock)
 * Útil para testing o configuración inicial
 */
export const inicializarIntegracionCalendario = async (
  contexto: ContextoCalendario,
  calendarioId?: string
): Promise<EstadoIntegracionCalendario> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const estado: EstadoIntegracionCalendario = {
    conectado: true,
    activo: true,
    calendarioId: calendarioId || `cal-${Date.now()}`,
    emailCalendario: contexto.email,
    ultimaSincronizacion: new Date(),
  };

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(estado));

  return estado;
};
