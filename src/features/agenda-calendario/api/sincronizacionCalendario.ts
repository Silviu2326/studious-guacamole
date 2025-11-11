import { ConexionCalendario, EventoCalendarioExterno, ConfiguracionSincronizacion, TipoCalendarioExterno, BloqueoAgenda } from '../types';

// Mock API - En producción, esto haría llamadas reales a la API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1/agenda';

/**
 * Obtiene todas las conexiones de calendario del usuario
 */
export const getConexionesCalendario = async (userId?: string): Promise<ConexionCalendario[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - en producción, esto vendría de la API
      const conexiones: ConexionCalendario[] = [
        // Ejemplo de conexión Google Calendar
        // {
        //   id: '1',
        //   userId: userId || '1',
        //   tipo: 'google',
        //   nombreCalendario: 'Calendario Principal',
        //   calendarioId: 'primary',
        //   estado: 'conectado',
        //   sincronizacionBidireccional: true,
        //   bloquearAutomaticamente: true,
        //   ultimaSincronizacion: new Date(),
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ];
      resolve(conexiones);
    }, 300);
  });
};

/**
 * Conecta una cuenta de Google Calendar
 */
export const conectarGoogleCalendar = async (userId?: string): Promise<{ authUrl: string; conexionId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto redirigiría al OAuth de Google
      // Por ahora, retornamos una URL mock
      resolve({
        authUrl: 'https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=https://www.googleapis.com/auth/calendar&response_type=code',
        conexionId: undefined,
      });
    }, 300);
  });
};

/**
 * Conecta una cuenta de Outlook Calendar
 */
export const conectarOutlookCalendar = async (userId?: string): Promise<{ authUrl: string; conexionId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto redirigiría al OAuth de Microsoft
      resolve({
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...&redirect_uri=...&scope=https://graph.microsoft.com/Calendars.ReadWrite&response_type=code',
        conexionId: undefined,
      });
    }, 300);
  });
};

/**
 * Obtiene la lista de calendarios disponibles de una cuenta conectada
 */
export const getCalendariosDisponibles = async (conexionId: string): Promise<Array<{ id: string; nombre: string; descripcion?: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data
      resolve([
        { id: 'primary', nombre: 'Calendario Principal', descripcion: 'Calendario principal de Google' },
        { id: 'work', nombre: 'Trabajo', descripcion: 'Eventos de trabajo' },
        { id: 'personal', nombre: 'Personal', descripcion: 'Eventos personales' },
      ]);
    }, 300);
  });
};

/**
 * Crea o actualiza una conexión de calendario
 */
export const guardarConexionCalendario = async (conexion: Partial<ConexionCalendario>): Promise<ConexionCalendario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaConexion: ConexionCalendario = {
        id: conexion.id || `conn-${Date.now()}`,
        userId: conexion.userId,
        tipo: conexion.tipo || 'google',
        nombreCalendario: conexion.nombreCalendario || 'Calendario',
        calendarioId: conexion.calendarioId || 'primary',
        estado: conexion.estado || 'conectado',
        sincronizacionBidireccional: conexion.sincronizacionBidireccional ?? true,
        bloquearAutomaticamente: conexion.bloquearAutomaticamente ?? true,
        ultimaSincronizacion: conexion.ultimaSincronizacion,
        errorSincronizacion: conexion.errorSincronizacion,
        createdAt: conexion.createdAt || new Date(),
        updatedAt: new Date(),
      };
      resolve(nuevaConexion);
    }, 300);
  });
};

/**
 * Desconecta una conexión de calendario
 */
export const desconectarCalendario = async (conexionId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto revocaría los tokens OAuth
      resolve();
    }, 300);
  });
};

/**
 * Sincroniza eventos desde un calendario externo
 */
export const sincronizarEventos = async (conexionId: string, fechaInicio: Date, fechaFin: Date): Promise<EventoCalendarioExterno[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - en producción, esto obtendría eventos reales de Google/Outlook
      const eventos: EventoCalendarioExterno[] = [
        // Ejemplo:
        // {
        //   id: '1',
        //   conexionId,
        //   eventoExternoId: 'ext-123',
        //   titulo: 'Reunión Externa',
        //   descripcion: 'Reunión sincronizada desde Google Calendar',
        //   fechaInicio: new Date(fechaInicio),
        //   fechaFin: new Date(fechaInicio.getTime() + 60 * 60 * 1000),
        //   ubicacion: 'Oficina',
        //   sincronizado: true,
        //   ultimaSincronizacion: new Date(),
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ];
      resolve(eventos);
    }, 500);
  });
};

/**
 * Convierte eventos externos en bloqueos de agenda
 */
export const convertirEventosEnBloqueos = async (eventos: EventoCalendarioExterno[]): Promise<BloqueoAgenda[]> => {
  return eventos.map((evento) => ({
    id: `bloqueo-ext-${evento.id}`,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    motivo: 'Evento sincronizado desde calendario externo',
    fechaInicio: evento.fechaInicio,
    fechaFin: evento.fechaFin,
    tipo: 'calendario-externo',
    recurrente: false,
    bloqueoCompleto: false,
    eventoExternoId: evento.eventoExternoId,
    conexionCalendarioId: evento.conexionId,
  }));
};

/**
 * Obtiene la configuración de sincronización del usuario
 */
export const getConfiguracionSincronizacion = async (userId?: string): Promise<ConfiguracionSincronizacion | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'config-1',
        userId: userId || '1',
        activo: true,
        sincronizacionBidireccional: true,
        bloquearAutomaticamente: true,
        intervaloActualizacion: 15, // minutos
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }, 300);
  });
};

/**
 * Guarda la configuración de sincronización
 */
export const guardarConfiguracionSincronizacion = async (config: Partial<ConfiguracionSincronizacion>): Promise<ConfiguracionSincronizacion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaConfig: ConfiguracionSincronizacion = {
        id: config.id || `config-${Date.now()}`,
        userId: config.userId,
        activo: config.activo ?? true,
        sincronizacionBidireccional: config.sincronizacionBidireccional ?? true,
        bloquearAutomaticamente: config.bloquearAutomaticamente ?? true,
        intervaloActualizacion: config.intervaloActualizacion || 15,
        createdAt: config.createdAt || new Date(),
        updatedAt: new Date(),
      };
      resolve(nuevaConfig);
    }, 300);
  });
};

/**
 * Crea un evento en el calendario externo
 */
export const crearEventoExterno = async (conexionId: string, evento: {
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
}): Promise<EventoCalendarioExterno> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevoEvento: EventoCalendarioExterno = {
        id: `evento-${Date.now()}`,
        conexionId,
        eventoExternoId: `ext-${Date.now()}`,
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        ubicacion: evento.ubicacion,
        sincronizado: true,
        ultimaSincronizacion: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(nuevoEvento);
    }, 500);
  });
};

/**
 * Actualiza un evento en el calendario externo
 */
export const actualizarEventoExterno = async (conexionId: string, eventoExternoId: string, evento: {
  titulo?: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  ubicacion?: string;
}): Promise<EventoCalendarioExterno> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventoActualizado: EventoCalendarioExterno = {
        id: `evento-${Date.now()}`,
        conexionId,
        eventoExternoId,
        titulo: evento.titulo || 'Evento actualizado',
        descripcion: evento.descripcion,
        fechaInicio: evento.fechaInicio || new Date(),
        fechaFin: evento.fechaFin || new Date(),
        ubicacion: evento.ubicacion,
        sincronizado: true,
        ultimaSincronizacion: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(eventoActualizado);
    }, 500);
  });
};

/**
 * Elimina un evento del calendario externo
 */
export const eliminarEventoExterno = async (conexionId: string, eventoExternoId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

/**
 * Obtiene la primera conexión activa de calendario para un usuario
 */
export const getPrimeraConexionActiva = async (userId?: string): Promise<ConexionCalendario | null> => {
  const conexiones = await getConexionesCalendario(userId);
  const conexionActiva = conexiones.find(c => c.estado === 'conectado');
  return conexionActiva || null;
};

/**
 * Sincroniza automáticamente una cita con el calendario externo
 * Retorna el evento externo creado o null si no se pudo sincronizar
 */
export const sincronizarCitaAutomaticamente = async (
  cita: { 
    titulo: string; 
    tipo: string; 
    fechaInicio: Date; 
    fechaFin: Date; 
    clienteNombre?: string; 
    notas?: string;
    ubicacion?: string;
  },
  userId?: string
): Promise<{ eventoExternoId: string; conexionCalendarioId: string } | null> => {
  try {
    // Obtener primera conexión activa
    const conexion = await getPrimeraConexionActiva(userId);
    if (!conexion) {
      console.log('No hay conexión de calendario activa');
      return null;
    }

    // Obtener configuración de sincronización
    const config = await getConfiguracionSincronizacion(userId);
    if (!config || !config.activo || !config.sincronizacionBidireccional) {
      console.log('Sincronización bidireccional no está activa');
      return null;
    }

    // Crear descripción con detalles de la sesión
    const descripcion = [
      `Tipo: ${cita.tipo}`,
      cita.clienteNombre ? `Cliente: ${cita.clienteNombre}` : '',
      cita.notas ? `Notas: ${cita.notas}` : '',
    ].filter(Boolean).join('\n');

    // Crear evento en calendario externo
    const eventoExterno = await crearEventoExterno(conexion.id, {
      titulo: cita.titulo,
      descripcion,
      fechaInicio: cita.fechaInicio,
      fechaFin: cita.fechaFin,
      ubicacion: cita.ubicacion,
    });

    return {
      eventoExternoId: eventoExterno.eventoExternoId,
      conexionCalendarioId: conexion.id,
    };
  } catch (error) {
    console.error('Error sincronizando cita automáticamente:', error);
    return null;
  }
};

/**
 * Actualiza automáticamente un evento en el calendario externo
 */
export const actualizarCitaAutomaticamente = async (
  eventoExternoId: string,
  conexionCalendarioId: string,
  cita: {
    titulo?: string;
    tipo?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    clienteNombre?: string;
    notas?: string;
    ubicacion?: string;
  },
  userId?: string
): Promise<boolean> => {
  try {
    // Obtener configuración de sincronización
    const config = await getConfiguracionSincronizacion(userId);
    if (!config || !config.activo || !config.sincronizacionBidireccional) {
      return false;
    }

    // Crear descripción con detalles de la sesión
    const descripcion = [
      cita.tipo ? `Tipo: ${cita.tipo}` : '',
      cita.clienteNombre ? `Cliente: ${cita.clienteNombre}` : '',
      cita.notas ? `Notas: ${cita.notas}` : '',
    ].filter(Boolean).join('\n');

    // Actualizar evento en calendario externo
    await actualizarEventoExterno(conexionCalendarioId, eventoExternoId, {
      titulo: cita.titulo,
      descripcion,
      fechaInicio: cita.fechaInicio,
      fechaFin: cita.fechaFin,
      ubicacion: cita.ubicacion,
    });

    return true;
  } catch (error) {
    console.error('Error actualizando cita automáticamente:', error);
    return false;
  }
};

/**
 * Elimina automáticamente un evento del calendario externo
 */
export const eliminarCitaAutomaticamente = async (
  eventoExternoId: string,
  conexionCalendarioId: string,
  userId?: string
): Promise<boolean> => {
  try {
    // Obtener configuración de sincronización
    const config = await getConfiguracionSincronizacion(userId);
    if (!config || !config.activo || !config.sincronizacionBidireccional) {
      return false;
    }

    // Eliminar evento del calendario externo
    await eliminarEventoExterno(conexionCalendarioId, eventoExternoId);
    return true;
  } catch (error) {
    console.error('Error eliminando cita automáticamente:', error);
    return false;
  }
};

