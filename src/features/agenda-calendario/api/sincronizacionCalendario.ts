import { 
  ConexionCalendario, 
  EventoCalendarioExterno, 
  ConfiguracionSincronizacion, 
  TipoCalendarioExterno, 
  BloqueoAgenda,
  ProveedorCalendario,
  CalendarioExterno,
  ContextoSincronizacion
} from '../types';

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

// ============================================================================
// FUNCIONES MOCK PARA INTEGRACIÓN CON CALENDARIOS EXTERNOS
// ============================================================================
// NOTA: Estas funciones son STUB/MOCK para desarrollo.
// En producción, estas funciones se implementarían usando:
// - OAuth 2.0 para autenticación con Google Calendar y Outlook Calendar
// - Webhooks para sincronización en tiempo real
// - APIs oficiales:
//   - Google Calendar API: https://developers.google.com/calendar
//   - Microsoft Graph API (Outlook): https://docs.microsoft.com/en-us/graph/api/resources/calendar
//
// USO FUTURO:
// Estas funciones están diseñadas para ser utilizadas desde:
// - La pestaña "Automatizaciones" en la página de Agenda/Calendario
// - La pestaña "Calendario" cuando se añada UI específica para gestión de integraciones
// ============================================================================

/**
 * Obtiene todas las integraciones de calendarios externos conectadas para un usuario
 * 
 * MOCK/STUB: En producción, esto consultaría la base de datos para obtener
 * todas las conexiones activas del usuario.
 * 
 * @param contexto - Contexto de sincronización con información del usuario
 * @returns Lista de calendarios externos conectados
 * 
 * @example
 * ```typescript
 * const integraciones = await getIntegracionesCalendario({
 *   userId: 'user-123',
 *   role: 'entrenador'
 * });
 * ```
 */
export const getIntegracionesCalendario = async (
  contexto: ContextoSincronizacion
): Promise<CalendarioExterno[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // MOCK DATA - En producción, esto consultaría la base de datos
      // usando contexto.userId para filtrar las conexiones del usuario
      const integraciones: CalendarioExterno[] = [
        // Ejemplo de integración Google Calendar (comentado para simular lista vacía por defecto)
        // {
        //   id: 'integracion-google-1',
        //   userId: contexto.userId || '1',
        //   tipo: 'google',
        //   nombreCalendario: 'Calendario Principal',
        //   calendarioId: 'primary',
        //   estado: 'conectado',
        //   sincronizacionBidireccional: true,
        //   bloquearAutomaticamente: true,
        //   ultimaSincronizacion: new Date(),
        //   createdAt: new Date('2024-01-15'),
        //   updatedAt: new Date(),
        // },
        // Ejemplo de integración Outlook Calendar (comentado para simular lista vacía por defecto)
        // {
        //   id: 'integracion-outlook-1',
        //   userId: contexto.userId || '1',
        //   tipo: 'outlook',
        //   nombreCalendario: 'Calendario de Trabajo',
        //   calendarioId: 'work-calendar-id',
        //   estado: 'conectado',
        //   sincronizacionBidireccional: false,
        //   bloquearAutomaticamente: true,
        //   ultimaSincronizacion: new Date(),
        //   createdAt: new Date('2024-01-20'),
        //   updatedAt: new Date(),
        // },
      ];
      resolve(integraciones);
    }, 300);
  });
};

/**
 * Conecta un calendario externo (Google o Outlook)
 * 
 * MOCK/STUB: En producción, esto:
 * 1. Iniciaría el flujo OAuth 2.0 del proveedor correspondiente
 * 2. Almacenaría los tokens de acceso/refresh de forma segura
 * 3. Crearía un registro de conexión en la base de datos
 * 4. Configuraría webhooks para sincronización en tiempo real
 * 
 * @param proveedor - Proveedor de calendario a conectar ('google' | 'outlook')
 * @param contexto - Contexto de sincronización con información del usuario (opcional)
 * @returns URL de autenticación OAuth y ID de conexión (si ya existe)
 * 
 * @example
 * ```typescript
 * const resultado = await conectarCalendarioExterno('google', {
 *   userId: 'user-123',
 *   role: 'entrenador'
 * });
 * // Redirigir al usuario a resultado.authUrl para completar OAuth
 * ```
 */
export const conectarCalendarioExterno = async (
  proveedor: ProveedorCalendario,
  contexto?: ContextoSincronizacion
): Promise<{ authUrl: string; conexionId?: string; estado: 'pendiente' | 'conectado' }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // MOCK: En producción, esto generaría una URL OAuth real basada en el proveedor
      let authUrl = '';
      
      if (proveedor === 'google') {
        // En producción: URL OAuth 2.0 de Google Calendar
        // authUrl = generarUrlOAuthGoogle(contexto);
        authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
          'client_id=MOCK_CLIENT_ID&' +
          'redirect_uri=https://app.example.com/oauth/callback&' +
          'scope=https://www.googleapis.com/auth/calendar&' +
          'response_type=code&' +
          'access_type=offline&' +
          'prompt=consent';
      } else if (proveedor === 'outlook') {
        // En producción: URL OAuth 2.0 de Microsoft Graph
        // authUrl = generarUrlOAuthOutlook(contexto);
        authUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
          'client_id=MOCK_CLIENT_ID&' +
          'redirect_uri=https://app.example.com/oauth/callback&' +
          'scope=https://graph.microsoft.com/Calendars.ReadWrite offline_access&' +
          'response_type=code&' +
          'response_mode=query';
      }

      // MOCK: En producción, se verificaría si ya existe una conexión pendiente
      // y se retornaría su ID, o se crearía una nueva conexión con estado 'pendiente'
      const conexionId = `integracion-${proveedor}-${Date.now()}`;

      resolve({
        authUrl,
        conexionId,
        estado: 'pendiente', // Cambiará a 'conectado' después de completar OAuth
      });
    }, 300);
  });
};

/**
 * Desconecta una integración de calendario externo
 * 
 * MOCK/STUB: En producción, esto:
 * 1. Revocaría los tokens OAuth en el proveedor (Google/Outlook)
 * 2. Eliminaría los webhooks configurados
 * 3. Marcaría la conexión como desconectada en la base de datos
 * 4. Limpiaría eventos sincronizados si es necesario
 * 
 * @param idIntegracion - ID de la integración a desconectar
 * @returns Promise que se resuelve cuando la desconexión se completa
 * 
 * @example
 * ```typescript
 * await desconectarCalendarioExterno('integracion-google-1');
 * ```
 */
export const desconectarCalendarioExterno = async (
  idIntegracion: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // MOCK: En producción, esto:
      // 1. Obtendría la conexión de la base de datos
      // 2. Revocaría el token en el proveedor (Google/Outlook API)
      // 3. Eliminaría webhooks si están configurados
      // 4. Actualizaría el estado a 'desconectado' en la base de datos
      // 5. Opcionalmente, limpiaría eventos sincronizados
      
      console.log(`[MOCK] Desconectando integración: ${idIntegracion}`);
      console.log('[MOCK] En producción, esto revocaría tokens OAuth y eliminaría webhooks');
      
      resolve();
    }, 300);
  });
};

/**
 * Sincroniza manualmente los eventos de un calendario externo
 * 
 * MOCK/STUB: En producción, esto:
 * 1. Obtendría los eventos del calendario externo usando la API del proveedor
 * 2. Compararía con eventos locales para detectar cambios
 * 3. Actualizaría/crearía eventos en la base de datos local
 * 4. Si la sincronización es bidireccional, también enviaría cambios locales al externo
 * 5. Actualizaría la fecha de última sincronización
 * 
 * @param idIntegracion - ID de la integración a sincronizar
 * @returns Resultado de la sincronización con estadísticas
 * 
 * @example
 * ```typescript
 * const resultado = await sincronizarAhora('integracion-google-1');
 * console.log(`Sincronizados ${resultado.eventosSincronizados} eventos`);
 * ```
 */
export const sincronizarAhora = async (
  idIntegracion: string
): Promise<{
  exito: boolean;
  eventosSincronizados: number;
  eventosCreados: number;
  eventosActualizados: number;
  eventosEliminados: number;
  errores?: string[];
  ultimaSincronizacion: Date;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // MOCK: En producción, esto realizaría:
      // 1. Obtener la conexión de la base de datos
      // 2. Validar que el token OAuth sigue siendo válido (renovar si es necesario)
      // 3. Obtener eventos del calendario externo (últimos 30 días o rango configurado)
      // 4. Comparar con eventos locales y aplicar cambios
      // 5. Si es bidireccional, también enviar cambios locales al externo
      // 6. Actualizar ultimaSincronizacion en la conexión
      
      console.log(`[MOCK] Sincronizando integración: ${idIntegracion}`);
      console.log('[MOCK] En producción, esto consultaría la API de Google/Outlook');
      
      // Simular sincronización exitosa con datos mock
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 7); // Últimos 7 días
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 7); // Próximos 7 días
      
      // En producción, se llamaría a sincronizarEventos() con el idIntegracion
      // const eventos = await sincronizarEventos(idIntegracion, fechaInicio, fechaFin);
      
      resolve({
        exito: true,
        eventosSincronizados: 0, // Mock: 0 eventos por defecto
        eventosCreados: 0,
        eventosActualizados: 0,
        eventosEliminados: 0,
        ultimaSincronizacion: new Date(),
      });
    }, 800); // Simular tiempo de sincronización
  });
};

