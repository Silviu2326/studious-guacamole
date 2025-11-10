// Servicio para sincronización con Google Calendar
import { Evento, SincronizacionCalendarioEvento } from '../api/events';
import {
  getConexionesCalendario,
  conectarGoogleCalendar,
  crearEventoExterno,
  actualizarEventoExterno,
  eliminarEventoExterno,
  getPrimeraConexionActiva,
  getConfiguracionSincronizacion,
} from '../../agenda-calendario/api/sincronizacionCalendario';
import { ConexionCalendario } from '../../agenda-calendario/types';

/**
 * Sincroniza un evento con Google Calendar
 */
export const sincronizarEventoConCalendario = async (
  evento: Evento,
  userId?: string
): Promise<{ success: boolean; eventoExternoId?: string; error?: string }> => {
  try {
    // Verificar si la sincronización está desactivada
    if (evento.sincronizacionCalendario?.desactivado) {
      return { success: false, error: 'Sincronización desactivada' };
    }

    // Obtener conexión activa
    let conexion: ConexionCalendario | null = null;
    
    if (evento.sincronizacionCalendario?.conexionCalendarioId) {
      const conexiones = await getConexionesCalendario(userId);
      conexion = conexiones.find(c => c.id === evento.sincronizacionCalendario?.conexionCalendarioId) || null;
    }

    if (!conexion) {
      conexion = await getPrimeraConexionActiva(userId);
    }

    if (!conexion) {
      return { 
        success: false, 
        error: 'No hay conexión de calendario activa. Por favor, conecta tu cuenta de Google Calendar primero.' 
      };
    }

    // Verificar configuración de sincronización
    const config = await getConfiguracionSincronizacion(userId);
    if (!config || !config.activo) {
      return { success: false, error: 'Sincronización no está activa en la configuración' };
    }

    // Si ya existe evento externo, actualizar
    if (evento.sincronizacionCalendario?.eventoExternoId) {
      try {
        await actualizarEventoExterno(
          conexion.id,
          evento.sincronizacionCalendario.eventoExternoId,
          {
            titulo: evento.nombre,
            descripcion: evento.descripcion,
            fechaInicio: evento.fechaInicio,
            fechaFin: evento.fechaFin || new Date(evento.fechaInicio.getTime() + 60 * 60 * 1000),
            ubicacion: evento.ubicacion,
          }
        );
        return { 
          success: true, 
          eventoExternoId: evento.sincronizacionCalendario.eventoExternoId 
        };
      } catch (error) {
        console.error('Error actualizando evento en calendario:', error);
        // Si falla la actualización, intentar crear uno nuevo
      }
    }

    // Crear nuevo evento en calendario
    const eventoExterno = await crearEventoExterno(conexion.id, {
      titulo: evento.nombre,
      descripcion: evento.descripcion,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin || new Date(evento.fechaInicio.getTime() + 60 * 60 * 1000),
      ubicacion: evento.ubicacion,
    });

    return { 
      success: true, 
      eventoExternoId: eventoExterno.eventoExternoId 
    };
  } catch (error) {
    console.error('Error sincronizando evento con calendario:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al sincronizar' 
    };
  }
};

/**
 * Desincroniza un evento (elimina del calendario)
 */
export const desincronizarEventoDeCalendario = async (
  evento: Evento,
  userId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!evento.sincronizacionCalendario?.eventoExternoId || !evento.sincronizacionCalendario?.conexionCalendarioId) {
      return { success: true }; // Ya está desincronizado
    }

    await eliminarEventoExterno(
      evento.sincronizacionCalendario.conexionCalendarioId,
      evento.sincronizacionCalendario.eventoExternoId
    );

    return { success: true };
  } catch (error) {
    console.error('Error desincronizando evento:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al desincronizar' 
    };
  }
};

/**
 * Conecta Google Calendar si no está conectado
 */
export const conectarGoogleCalendarSiNecesario = async (
  userId?: string
): Promise<{ authUrl?: string; conexionId?: string; yaConectado: boolean }> => {
  try {
    const conexion = await getPrimeraConexionActiva(userId);
    if (conexion) {
      return { yaConectado: true, conexionId: conexion.id };
    }

    const { authUrl } = await conectarGoogleCalendar(userId);
    return { authUrl, yaConectado: false };
  } catch (error) {
    console.error('Error conectando Google Calendar:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de sincronización de un evento
 */
export const obtenerEstadoSincronizacion = (evento: Evento): {
  sincronizado: boolean;
  activo: boolean;
  error?: string;
} => {
  const sync = evento.sincronizacionCalendario;
  
  if (!sync) {
    return { sincronizado: false, activo: false };
  }

  if (sync.desactivado) {
    return { sincronizado: false, activo: false };
  }

  if (sync.errorSincronizacion) {
    return { 
      sincronizado: false, 
      activo: sync.activo, 
      error: sync.errorSincronizacion 
    };
  }

  return { 
    sincronizado: !!sync.eventoExternoId, 
    activo: sync.activo 
  };
};

/**
 * Sincroniza automáticamente eventos cuando se crean o actualizan
 */
export const sincronizarEventosAutomaticamente = async (
  eventos: Evento[],
  userId?: string
): Promise<void> => {
  try {
    const config = await getConfiguracionSincronizacion(userId);
    if (!config || !config.activo || !config.sincronizacionBidireccional) {
      return;
    }

    // Sincronizar eventos programados o en curso que tengan sincronización activa
    const eventosASincronizar = eventos.filter(e => {
      const sync = e.sincronizacionCalendario;
      return (
        sync?.activo &&
        !sync.desactivado &&
        (e.estado === 'programado' || e.estado === 'en-curso') &&
        !sync.eventoExternoId
      );
    });

    for (const evento of eventosASincronizar) {
      await sincronizarEventoConCalendario(evento, userId);
    }
  } catch (error) {
    console.error('Error en sincronización automática:', error);
  }
};


