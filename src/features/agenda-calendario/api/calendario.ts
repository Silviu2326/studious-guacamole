import { Cita, TipoCita, EstadoCita, Recurrencia, TipoRecurrencia } from '../types';
import { sincronizarCitaAutomaticamente, actualizarCitaAutomaticamente, eliminarCitaAutomaticamente } from './sincronizacionCalendario';
import { 
  getCitasOffline, 
  saveCitasOffline, 
  queueAccionOffline, 
  isOnline 
} from '../services/offlineStorage';

// ============================================================================
// MOCK DATA STORAGE Y MODO OFFLINE
// ============================================================================
// En producción, esto sería reemplazado por llamadas a una API REST/GraphQL
// Ejemplo de endpoints:
// - GET /api/citas?fechaInicio=...&fechaFin=...&entrenadorId=...&estado=...
// - POST /api/citas (body: CitaCreateDto)
// - PUT /api/citas/:id (body: CitaUpdateDto)
// - DELETE /api/citas/:id
// - GET /api/citas/recurrentes/:serieId (para obtener todas las instancias de una serie)

/**
 * NOTA: MODO OFFLINE - MOCK PARA PRUEBAS DE UX
 * 
 * Este módulo incluye soporte básico para modo offline como mock para pruebas de UX.
 * La sincronización real con el backend se implementaría más adelante cuando se integre
 * con la API real.
 * 
 * Funcionalidades mock:
 * - Bandera simulada para forzar modo offline (para pruebas)
 * - Fallback a IndexedDB cuando falla la conexión "online"
 * - Cola de acciones pendientes para sincronizar cuando vuelva la conexión
 * 
 * Para activar modo offline en pruebas, establecer SIMULATE_OFFLINE = true
 */
const SIMULATE_OFFLINE = false; // Bandera para simular modo offline en pruebas

/**
 * Almacenamiento mock en memoria de citas
 * En producción, esto se almacenaría en una base de datos (PostgreSQL, MongoDB, etc.)
 * con índices en fechaInicio, fechaFin, entrenadorId, clienteId, estado, tipo
 */
let mockCitasStorage: Cita[] = [];

/**
 * Verifica si estamos en modo offline (simulado o real)
 */
const checkOfflineMode = (): boolean => {
  return SIMULATE_OFFLINE || !isOnline();
};

// ============================================================================
// PARÁMETROS DE FILTRADO PARA getCitas
// ============================================================================

export interface GetCitasParams {
  /** Rango de fechas para filtrar citas */
  fechaInicio: Date;
  fechaFin: Date;
  /** ID del entrenador (opcional) - filtra citas asignadas a un entrenador específico */
  entrenadorId?: string;
  /** ID del centro/gimnasio (opcional) - filtra citas de un centro específico */
  centroId?: string;
  /** Estado de la cita (opcional) - filtra por estado: confirmada, cancelada, etc. */
  estado?: EstadoCita;
  /** Tipo de sesión (opcional) - filtra por tipo: sesion-1-1, clase-colectiva, etc. */
  tipoSesion?: TipoCita;
  /** ID del cliente (opcional) - filtra citas de un cliente específico */
  clienteId?: string;
  /** Si incluir citas canceladas (por defecto false) */
  incluirCanceladas?: boolean;
  /** Si expandir recurrencias automáticamente (por defecto true) */
  expandirRecurrencias?: boolean;
}

// ============================================================================
// FUNCIÓN PRINCIPAL: getCitas
// ============================================================================

/**
 * Obtiene una lista de citas filtrada por los parámetros proporcionados
 * 
 * En producción, esto haría una llamada HTTP a:
 * GET /api/citas?fechaInicio=ISO_DATE&fechaFin=ISO_DATE&entrenadorId=...&estado=...
 * 
 * La respuesta del backend incluiría:
 * - Lista de citas simples
 * - Lista de citas recurrentes (con campo recurrencia)
 * - El frontend puede expandir las recurrencias o el backend puede hacerlo
 * 
 * Para optimización en producción:
 * - Usar paginación si hay muchas citas
 * - Cachear resultados con React Query o SWR
 * - Usar índices en BD para búsquedas rápidas por fecha, entrenador, estado
 * 
 * @overload
 * Soporta dos formas de llamada:
 * 1. getCitas(params: GetCitasParams) - Nueva forma con objeto de parámetros
 * 2. getCitas(fechaInicio: Date, fechaFin: Date, role: 'entrenador' | 'gimnasio') - Forma legacy
 */
export function getCitas(params: GetCitasParams): Promise<Cita[]>;
export function getCitas(fechaInicio: Date, fechaFin: Date, role: 'entrenador' | 'gimnasio'): Promise<Cita[]>;
export async function getCitas(
  paramsOrFechaInicio: GetCitasParams | Date,
  fechaFin?: Date,
  role?: 'entrenador' | 'gimnasio'
): Promise<Cita[]> {
  return new Promise(async (resolve, reject) => {
    try {
      // Manejar sobrecarga: si el primer parámetro es Date, es la forma legacy
      let params: GetCitasParams;
      if (paramsOrFechaInicio instanceof Date) {
        // Forma legacy: getCitas(fechaInicio, fechaFin, role)
        params = {
          fechaInicio: paramsOrFechaInicio,
          fechaFin: fechaFin!,
          // Mapear role a filtros si es necesario
        };
      } else {
        // Nueva forma: getCitas(params)
        params = paramsOrFechaInicio;
      }

      const {
        fechaInicio,
        fechaFin: fechaFinParam,
        entrenadorId,
        centroId,
        estado,
        tipoSesion,
        clienteId,
        incluirCanceladas = false,
        expandirRecurrencias = true,
      } = params;

      // Simular llamada "online" - si falla o estamos offline, usar fallback
      const isOffline = checkOfflineMode();
      
      if (isOffline) {
        // MODO OFFLINE: Usar datos de IndexedDB como fallback
        console.log('[calendario.ts] Modo offline detectado, usando datos locales');
        try {
          const citasOffline = await getCitasOffline();
          if (citasOffline.length > 0) {
            // Aplicar filtros básicos a las citas offline
            let citasFiltradas = citasOffline.filter((cita) => {
              const inicio = new Date(cita.fechaInicio);
              const fin = new Date(cita.fechaFin);
              return (
                (inicio >= fechaInicio && inicio <= fechaFinParam) ||
                (fin >= fechaInicio && fin <= fechaFinParam) ||
                (inicio <= fechaInicio && fin >= fechaFinParam)
              );
            });

            // Aplicar filtros adicionales si existen
            if (entrenadorId) {
              citasFiltradas = citasFiltradas.filter(
                (cita) => cita.entrenador?.id === entrenadorId || cita.instructorId === entrenadorId
              );
            }
            if (estado) {
              citasFiltradas = citasFiltradas.filter((cita) => cita.estado === estado);
            }
            if (!incluirCanceladas) {
              citasFiltradas = citasFiltradas.filter((cita) => cita.estado !== 'cancelada');
            }

            citasFiltradas.sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
            console.log('[calendario.ts] Citas offline filtradas:', citasFiltradas.length);
            resolve(citasFiltradas);
            return;
          }
        } catch (error) {
          console.warn('[calendario.ts] Error al obtener citas offline:', error);
          // Continuar con datos mock si falla IndexedDB
        }
      }

      // MODO ONLINE (o fallback si IndexedDB está vacío): Usar datos mock
      setTimeout(() => {
        // Inicializar datos mock si está vacío
        if (mockCitasStorage.length === 0) {
          mockCitasStorage = generarDatosMock();
          // Guardar en IndexedDB para uso offline futuro
          saveCitasOffline(mockCitasStorage).catch(err => 
            console.warn('[calendario.ts] Error guardando citas offline:', err)
          );
        }

        let citasFiltradas = [...mockCitasStorage];

      // Filtrar por rango de fechas
      citasFiltradas = citasFiltradas.filter((cita) => {
        const inicio = new Date(cita.fechaInicio);
        const fin = new Date(cita.fechaFin);
        // La cita debe solaparse con el rango solicitado
        return (
          (inicio >= fechaInicio && inicio <= fechaFinParam) ||
          (fin >= fechaInicio && fin <= fechaFinParam) ||
          (inicio <= fechaInicio && fin >= fechaFinParam)
        );
      });

      // Filtrar por entrenador
      if (entrenadorId) {
        citasFiltradas = citasFiltradas.filter(
          (cita) => cita.entrenador?.id === entrenadorId || cita.instructorId === entrenadorId
        );
      }

      // Filtrar por centro (para clases colectivas)
      if (centroId) {
        citasFiltradas = citasFiltradas.filter((cita) => {
          // En producción, esto dependería de cómo se almacene la relación centro-cita
          return cita.tipo === 'clase-colectiva' || cita.tipo === 'fisioterapia';
        });
      }

      // Filtrar por estado
      if (estado) {
        citasFiltradas = citasFiltradas.filter((cita) => cita.estado === estado);
      }

      // Filtrar por tipo de sesión
      if (tipoSesion) {
        citasFiltradas = citasFiltradas.filter((cita) => cita.tipo === tipoSesion);
      }

      // Filtrar por cliente
      if (clienteId) {
        citasFiltradas = citasFiltradas.filter(
          (cita) => cita.cliente?.id === clienteId || cita.clienteId === clienteId
        );
      }

      // Excluir canceladas si no se solicitan
      if (!incluirCanceladas) {
        citasFiltradas = citasFiltradas.filter((cita) => cita.estado !== 'cancelada');
      }

      // Expandir recurrencias si está habilitado
      if (expandirRecurrencias) {
        const citasExpandidas: Cita[] = [];
        citasFiltradas.forEach((cita) => {
          if (cita.recurrencia && cita.recurrencia.tipo !== 'ninguna') {
            const instancias = expandirRecurrencia(cita, fechaInicio, fechaFinParam);
            citasExpandidas.push(...instancias);
          } else {
            citasExpandidas.push(cita);
          }
        });
        citasFiltradas = citasExpandidas;
      }

        // Ordenar por fecha de inicio
        citasFiltradas.sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());

        console.log('[calendario.ts] Citas filtradas:', citasFiltradas.length);
        resolve(citasFiltradas);
      }, 300);
    } catch (error) {
      console.error('[calendario.ts] Error en getCitas:', error);
      // Si falla todo, intentar obtener citas offline como último recurso
      try {
        const citasOffline = await getCitasOffline();
        resolve(citasOffline);
      } catch (offlineError) {
        reject(error);
      }
    }
  });
};

// ============================================================================
// FUNCIÓN: createCita
// ============================================================================

/**
 * Crea una nueva cita (simple o recurrente)
 * 
 * En producción, esto haría una llamada HTTP a:
 * POST /api/citas
 * 
 * Body del request:
 * {
 *   titulo: string,
 *   tipo: TipoCita,
 *   fechaInicio: ISO_DATE,
 *   fechaFin: ISO_DATE,
 *   clienteId?: string,
 *   entrenadorId?: string,
 *   recurrencia?: {
 *     tipo: TipoRecurrencia,
 *     intervalo?: number,
 *     diasSemana?: number[],
 *     fechaInicio: ISO_DATE,
 *     fechaFinOpcional?: ISO_DATE,
 *     excepciones?: ISO_DATE[]
 *   },
 *   ...
 * }
 * 
 * Si la cita es recurrente, el backend puede:
 * 1. Crear una sola entrada con campo recurrencia y expandir en el frontend
 * 2. Crear múltiples instancias en la BD (una por cada ocurrencia)
 * 3. Usar una tabla separada para reglas de recurrencia y otra para instancias
 * 
 * Recomendación: Opción 1 o 3 para mejor rendimiento y flexibilidad
 */
export const createCita = async (
  data: Omit<Cita, 'id' | 'historial'>,
  userId?: string
): Promise<Cita> => {
  return new Promise(async (resolve) => {
    try {
      const isOffline = checkOfflineMode();

      // Por defecto, sincronizar calendario si no se especifica lo contrario
      const sincronizar = data.sincronizarCalendario !== false;

      // Intentar sincronizar con calendario externo si está activo (solo si estamos online)
      let eventoExternoId: string | undefined;
      let conexionCalendarioId: string | undefined;

      if (sincronizar && !isOffline) {
        try {
          const resultadoSincronizacion = await sincronizarCitaAutomaticamente(
            {
              titulo: data.titulo,
              tipo: data.tipo,
              fechaInicio: data.fechaInicio,
              fechaFin: data.fechaFin,
              clienteNombre: data.clienteNombre,
              notas: data.notas,
              ubicacion: data.ubicacion,
            },
            userId
          );

          if (resultadoSincronizacion) {
            eventoExternoId = resultadoSincronizacion.eventoExternoId;
            conexionCalendarioId = resultadoSincronizacion.conexionCalendarioId;
          }
        } catch (syncError) {
          console.warn('[calendario.ts] Error sincronizando calendario, continuando sin sincronización:', syncError);
        }
      }

      // Generar ID único
      const citaId = `cita-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Si es recurrente, generar serieId si no existe
      let serieId: string | undefined;
      if (data.recurrencia && data.recurrencia.tipo !== 'ninguna') {
        serieId = data.recurrencia.serieId || `serie-${Date.now()}`;
      }

      const nuevaCita: Cita = {
        ...data,
        id: citaId,
        sincronizarCalendario: sincronizar && !isOffline,
        eventoExternoId,
        conexionCalendarioId,
        recurrencia: data.recurrencia
          ? {
              ...data.recurrencia,
              serieId: serieId || data.recurrencia.serieId,
            }
          : undefined,
        historial: [
          {
            id: `hist-${Date.now()}`,
            fecha: new Date(),
            tipo: 'creada',
            usuarioId: userId,
          },
        ],
        estado: data.estado || 'confirmada',
      };

      if (isOffline) {
        // MODO OFFLINE: Guardar localmente y encolar acción para sincronizar después
        console.log('[calendario.ts] Modo offline: guardando cita localmente y encolando acción');
        
        // Guardar en IndexedDB
        await saveCitasOffline([nuevaCita]);
        
        // Encolar acción para sincronizar cuando vuelva la conexión
        await queueAccionOffline({
          type: 'create',
          data: nuevaCita,
        });

        // También guardar en memoria mock para consistencia
        mockCitasStorage.push(nuevaCita);
        
        setTimeout(() => {
          resolve(nuevaCita);
        }, 300);
        return;
      }

      // MODO ONLINE: Guardar en almacenamiento mock
      mockCitasStorage.push(nuevaCita);
      
      // Guardar también en IndexedDB para uso offline futuro
      await saveCitasOffline([nuevaCita]).catch(err => 
        console.warn('[calendario.ts] Error guardando cita offline:', err)
      );

      // En producción, aquí se haría la llamada al backend:
      // const response = await fetch('/api/citas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(nuevaCita)
      // });
      // const citaCreada = await response.json();

      setTimeout(() => {
        resolve(nuevaCita);
      }, 300);
    } catch (error) {
      console.error('Error creando cita:', error);
      // Si falla la sincronización, crear la cita sin sincronización
      const nuevaCita: Cita = {
        ...data,
        id: `cita-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sincronizarCalendario: false,
        historial: [
          {
            id: `hist-${Date.now()}`,
            fecha: new Date(),
            tipo: 'creada',
            usuarioId: userId,
          },
        ],
        estado: data.estado || 'confirmada',
      };
      
      // Intentar guardar offline incluso si falla
      try {
        await saveCitasOffline([nuevaCita]);
        await queueAccionOffline({ type: 'create', data: nuevaCita });
      } catch (offlineError) {
        console.warn('[calendario.ts] Error guardando offline:', offlineError);
      }
      
      mockCitasStorage.push(nuevaCita);
      setTimeout(() => {
        resolve(nuevaCita);
      }, 300);
    }
  });
};

// ============================================================================
// FUNCIÓN: updateCita
// ============================================================================

/**
 * Actualiza una cita existente
 * 
 * En producción, esto haría una llamada HTTP a:
 * PUT /api/citas/:id
 * PATCH /api/citas/:id (si solo se actualizan campos específicos)
 * 
 * Body del request:
 * {
 *   titulo?: string,
 *   fechaInicio?: ISO_DATE,
 *   fechaFin?: ISO_DATE,
 *   estado?: EstadoCita,
 *   ...
 * }
 * 
 * Para citas recurrentes:
 * - Si se actualiza una instancia específica: PUT /api/citas/:id?instancia=true
 * - Si se actualiza toda la serie: PUT /api/citas/recurrentes/:serieId
 * - El backend debe manejar excepciones (modificar solo una instancia de la serie)
 */
export const updateCita = async (
  id: string,
  changes: Partial<Cita>,
  citaOriginal?: Cita,
  userId?: string
): Promise<Cita> => {
  return new Promise(async (resolve) => {
    try {
      const isOffline = checkOfflineMode();
      
      // Buscar cita en almacenamiento mock
      const index = mockCitasStorage.findIndex((c) => c.id === id);
      if (index === -1 && !citaOriginal) {
        // Si no está en memoria, intentar buscar en IndexedDB
        try {
          const citasOffline = await getCitasOffline();
          const citaOffline = citasOffline.find((c) => c.id === id);
          if (citaOffline) {
            // Usar la cita offline como original
            const citaActualizada: Cita = {
              ...citaOffline,
              ...changes,
              id,
              historial: [
                ...(citaOffline.historial || []),
                {
                  id: `hist-${Date.now()}`,
                  fecha: new Date(),
                  tipo: 'editada',
                  usuarioId: userId,
                },
              ],
            };
            
            if (isOffline) {
              await saveCitasOffline([citaActualizada]);
              await queueAccionOffline({ type: 'update', data: citaActualizada });
            }
            
            resolve(citaActualizada);
            return;
          }
        } catch (offlineError) {
          console.warn('[calendario.ts] Error buscando cita offline:', offlineError);
        }
        
        throw new Error(`Cita con id ${id} no encontrada`);
      }

      const citaExistente = citaOriginal || mockCitasStorage[index];

      // Si se proporciona la cita original, preservar todos sus datos y solo actualizar los campos proporcionados
      let citaActualizada: Cita = {
        ...citaExistente,
        ...changes,
        id, // Asegurar que el ID se mantenga
        historial: [
          ...(citaExistente.historial || []),
          {
            id: `hist-${Date.now()}`,
            fecha: new Date(),
            tipo: 'editada',
            usuarioId: userId,
            cambios: Object.keys(changes).map((key) => ({
              campo: key,
              valorAnterior: (citaExistente as any)[key],
              valorNuevo: (changes as any)[key],
            })),
          },
        ],
      };

      // Si la cita se cancela y tiene evento externo, eliminarlo del calendario (solo si estamos online)
      if (citaActualizada.estado === 'cancelada' && citaActualizada.eventoExternoId && citaActualizada.conexionCalendarioId && !isOffline) {
        const sincronizar = citaActualizada.sincronizarCalendario !== false;

        if (sincronizar) {
          try {
            await eliminarCitaAutomaticamente(
              citaActualizada.eventoExternoId,
              citaActualizada.conexionCalendarioId,
              userId
            );
            // Limpiar referencias al evento externo después de eliminarlo
            citaActualizada.eventoExternoId = undefined;
            citaActualizada.conexionCalendarioId = undefined;
          } catch (syncError) {
            console.warn('[calendario.ts] Error eliminando evento externo:', syncError);
          }
        }

        // Añadir entrada al historial
        citaActualizada.historial = [
          ...(citaActualizada.historial || []),
          {
            id: `hist-${Date.now()}`,
            fecha: new Date(),
            tipo: 'cancelada',
            usuarioId: userId,
            motivo: changes.motivoCancelacion,
            motivoDetalle: changes.motivoCancelacionDetalle,
          },
        ];
      } else if (citaActualizada.eventoExternoId && citaActualizada.conexionCalendarioId && !isOffline) {
        // Si la cita tiene evento externo y se actualiza, sincronizar cambios (solo si estamos online)
        const sincronizar = citaActualizada.sincronizarCalendario !== false;

        if (sincronizar) {
          try {
            await actualizarCitaAutomaticamente(
              citaActualizada.eventoExternoId,
              citaActualizada.conexionCalendarioId,
              {
                titulo: citaActualizada.titulo,
                tipo: citaActualizada.tipo,
                fechaInicio: citaActualizada.fechaInicio,
                fechaFin: citaActualizada.fechaFin,
                clienteNombre: citaActualizada.clienteNombre,
                notas: citaActualizada.notas,
                ubicacion: citaActualizada.ubicacion,
              },
              userId
            );
          } catch (syncError) {
            console.warn('[calendario.ts] Error actualizando evento externo:', syncError);
          }
        }
      } else if (citaActualizada.sincronizarCalendario !== false && citaExistente && citaActualizada.estado !== 'cancelada' && !isOffline) {
        // Si no tenía evento externo pero se quiere sincronizar ahora (solo si estamos online)
        try {
          const resultadoSincronizacion = await sincronizarCitaAutomaticamente(
            {
              titulo: citaActualizada.titulo,
              tipo: citaActualizada.tipo,
              fechaInicio: citaActualizada.fechaInicio,
              fechaFin: citaActualizada.fechaFin,
              clienteNombre: citaActualizada.clienteNombre,
              notas: citaActualizada.notas,
              ubicacion: citaActualizada.ubicacion,
            },
            userId
          );

          if (resultadoSincronizacion) {
            citaActualizada.eventoExternoId = resultadoSincronizacion.eventoExternoId;
            citaActualizada.conexionCalendarioId = resultadoSincronizacion.conexionCalendarioId;
          }
        } catch (syncError) {
          console.warn('[calendario.ts] Error sincronizando cita:', syncError);
        }
      }

      if (isOffline) {
        // MODO OFFLINE: Guardar localmente y encolar acción para sincronizar después
        console.log('[calendario.ts] Modo offline: guardando actualización localmente y encolando acción');
        
        // Guardar en IndexedDB
        await saveCitasOffline([citaActualizada]);
        
        // Encolar acción para sincronizar cuando vuelva la conexión
        await queueAccionOffline({
          type: 'update',
          data: citaActualizada,
        });

        // También actualizar en memoria mock para consistencia
        if (index !== -1) {
          mockCitasStorage[index] = citaActualizada;
        }
        
        setTimeout(() => {
          resolve(citaActualizada);
        }, 300);
        return;
      }

      // MODO ONLINE: Actualizar en almacenamiento mock
      if (index !== -1) {
        mockCitasStorage[index] = citaActualizada;
      }
      
      // Guardar también en IndexedDB para uso offline futuro
      await saveCitasOffline([citaActualizada]).catch(err => 
        console.warn('[calendario.ts] Error guardando cita actualizada offline:', err)
      );

      // En producción, aquí se haría la llamada al backend:
      // const response = await fetch(`/api/citas/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(changes)
      // });
      // const citaActualizada = await response.json();

      setTimeout(() => {
        resolve(citaActualizada);
      }, 300);
    } catch (error) {
      console.error('Error actualizando cita:', error);
      // Si falla la sincronización, actualizar la cita sin sincronización
      const index = mockCitasStorage.findIndex((c) => c.id === id);
      const citaExistente = citaOriginal || (index !== -1 ? mockCitasStorage[index] : null);
      
      if (!citaExistente) {
        // Intentar buscar en IndexedDB como último recurso
        try {
          const citasOffline = await getCitasOffline();
          const citaOffline = citasOffline.find((c) => c.id === id);
          if (citaOffline) {
            const citaActualizada: Cita = {
              ...citaOffline,
              ...changes,
              id,
              historial: [
                ...(citaOffline.historial || []),
                {
                  id: `hist-${Date.now()}`,
                  fecha: new Date(),
                  tipo: 'editada',
                  usuarioId: userId,
                },
              ],
            };
            
            await saveCitasOffline([citaActualizada]);
            await queueAccionOffline({ type: 'update', data: citaActualizada });
            
            setTimeout(() => {
              resolve(citaActualizada);
            }, 300);
            return;
          }
        } catch (offlineError) {
          console.warn('[calendario.ts] Error buscando cita offline en catch:', offlineError);
        }
        
        throw error;
      }

      const citaActualizada: Cita = {
        ...citaExistente,
        ...changes,
        id,
        historial: [
          ...(citaExistente.historial || []),
          {
            id: `hist-${Date.now()}`,
            fecha: new Date(),
            tipo: 'editada',
            usuarioId: userId,
          },
        ],
      };
      
      // Intentar guardar offline incluso si falla
      try {
        await saveCitasOffline([citaActualizada]);
        await queueAccionOffline({ type: 'update', data: citaActualizada });
      } catch (offlineError) {
        console.warn('[calendario.ts] Error guardando actualización offline:', offlineError);
      }
      
      if (index !== -1) {
        mockCitasStorage[index] = citaActualizada;
      }
      
      setTimeout(() => {
        resolve(citaActualizada);
      }, 300);
    }
  });
};

// ============================================================================
// FUNCIÓN: deleteCita
// ============================================================================

/**
 * Elimina una cita o la marca como cancelada
 * 
 * En producción, esto haría una llamada HTTP a:
 * DELETE /api/citas/:id
 * 
 * O si se prefiere soft delete:
 * PUT /api/citas/:id (con estado: 'cancelada')
 * 
 * Para citas recurrentes:
 * - DELETE /api/citas/:id?serie=all (elimina toda la serie)
 * - DELETE /api/citas/:id?serie=instance (elimina solo esta instancia)
 * - DELETE /api/citas/:id?serie=future (elimina esta y todas las futuras)
 */
export const deleteCita = async (
  id: string,
  cita?: Cita,
  userId?: string,
  opciones?: {
    /** Si es true, elimina toda la serie recurrente */
    eliminarSerie?: boolean;
    /** Si es true, elimina solo esta instancia (para recurrentes) */
    soloInstancia?: boolean;
  }
): Promise<void> => {
  return new Promise(async (resolve) => {
    try {
      const isOffline = checkOfflineMode();
      
      // Buscar cita en almacenamiento mock
      const index = mockCitasStorage.findIndex((c) => c.id === id);
      const citaAEliminar = cita || (index !== -1 ? mockCitasStorage[index] : null);

      if (!citaAEliminar) {
        // Intentar buscar en IndexedDB
        try {
          const citasOffline = await getCitasOffline();
          const citaOffline = citasOffline.find((c) => c.id === id);
          if (citaOffline) {
            // Encolar eliminación para sincronizar después
            if (isOffline) {
              await queueAccionOffline({
                type: 'delete',
                data: { id, ...opciones },
              });
            }
            setTimeout(() => resolve(), 300);
            return;
          }
        } catch (offlineError) {
          console.warn('[calendario.ts] Error buscando cita offline para eliminar:', offlineError);
        }
        
        console.warn(`Cita con id ${id} no encontrada`);
        setTimeout(() => resolve(), 300);
        return;
      }

      // Si es recurrente y se solicita eliminar toda la serie
      if (opciones?.eliminarSerie && citaAEliminar.recurrencia?.serieId) {
        const serieId = citaAEliminar.recurrencia.serieId;
        mockCitasStorage = mockCitasStorage.filter(
          (c) => c.recurrencia?.serieId !== serieId
        );
      } else {
        // Eliminar solo esta instancia
        if (index !== -1) {
          mockCitasStorage.splice(index, 1);
        }
      }

      if (isOffline) {
        // MODO OFFLINE: Encolar eliminación para sincronizar después
        console.log('[calendario.ts] Modo offline: encolando eliminación');
        await queueAccionOffline({
          type: 'delete',
          data: { id, ...opciones },
        });
        setTimeout(() => resolve(), 300);
        return;
      }

      // MODO ONLINE: Si la cita tiene evento externo, eliminarlo del calendario
      if (citaAEliminar.eventoExternoId && citaAEliminar.conexionCalendarioId) {
        const sincronizar = citaAEliminar.sincronizarCalendario !== false;

        if (sincronizar) {
          try {
            await eliminarCitaAutomaticamente(
              citaAEliminar.eventoExternoId,
              citaAEliminar.conexionCalendarioId,
              userId
            );
          } catch (syncError) {
            console.warn('[calendario.ts] Error eliminando evento externo:', syncError);
          }
        }
      }

      // En producción, aquí se haría la llamada al backend:
      // await fetch(`/api/citas/${id}`, { method: 'DELETE' });

      setTimeout(() => {
        resolve();
      }, 300);
    } catch (error) {
      console.error('Error eliminando cita:', error);
      // Continuar con la eliminación aunque falle la sincronización
      const index = mockCitasStorage.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockCitasStorage.splice(index, 1);
      }
      
      // Intentar encolar eliminación offline
      try {
        await queueAccionOffline({
          type: 'delete',
          data: { id, ...opciones },
        });
      } catch (offlineError) {
        console.warn('[calendario.ts] Error encolando eliminación offline:', offlineError);
      }
      
      setTimeout(() => {
        resolve();
      }, 300);
    }
  });
};

// ============================================================================
// FUNCIÓN HELPER: expandirRecurrencia
// ============================================================================

/**
 * Expande una cita recurrente en múltiples instancias dentro de un rango de fechas
 * 
 * En producción, esta lógica podría estar en el backend o en el frontend:
 * - Backend: Más eficiente, puede usar índices de BD y optimizaciones
 * - Frontend: Más flexible, permite filtrado dinámico sin nuevas peticiones
 * 
 * Para bases de datos:
 * - PostgreSQL: Usar funciones de fecha y generación de series
 * - MongoDB: Usar aggregation pipelines con $dateAdd, $dateSubtract
 * - SQL Server: Usar CTEs recursivos o funciones de fecha
 * 
 * Ejemplo de query SQL para expandir recurrencias:
 * ```sql
 * WITH RECURSIVE fechas_recurrentes AS (
 *   SELECT fecha_inicio as fecha
 *   UNION ALL
 *   SELECT CASE
 *     WHEN tipo = 'diaria' THEN fecha + INTERVAL '1 day' * intervalo
 *     WHEN tipo = 'semanal' THEN fecha + INTERVAL '1 week' * intervalo
 *     WHEN tipo = 'mensual' THEN fecha + INTERVAL '1 month' * intervalo
 *   END
 *   FROM fechas_recurrentes, citas
 *   WHERE fecha <= fecha_fin AND fecha <= :fecha_fin_busqueda
 * )
 * SELECT * FROM fechas_recurrentes WHERE fecha BETWEEN :fecha_inicio AND :fecha_fin;
 * ```
 */
export const expandirRecurrencia = (
  citaBase: Cita,
  fechaInicio: Date,
  fechaFin: Date
): Cita[] => {
  if (!citaBase.recurrencia || citaBase.recurrencia.tipo === 'ninguna') {
    return [citaBase];
  }

  const recurrencia = citaBase.recurrencia;
  const instancias: Cita[] = [];
  const intervalo = recurrencia.intervalo || 1;

  // Calcular duración de la cita original
  const duracionMs = citaBase.fechaFin.getTime() - citaBase.fechaInicio.getTime();

  // Fecha límite para generar instancias
  const fechaLimite = recurrencia.fechaFinOpcional
    ? new Date(Math.min(recurrencia.fechaFinOpcional.getTime(), fechaFin.getTime()))
    : fechaFin;

  let fechaActual = new Date(citaBase.fechaInicio);

  // Generar instancias según el tipo de recurrencia
  while (fechaActual <= fechaLimite && fechaActual <= fechaFin) {
    // Verificar si esta fecha está en las excepciones
    const esExcepcion = recurrencia.excepciones?.some((excepcion) => {
      const excepcionDate = new Date(excepcion);
      return (
        excepcionDate.getDate() === fechaActual.getDate() &&
        excepcionDate.getMonth() === fechaActual.getMonth() &&
        excepcionDate.getFullYear() === fechaActual.getFullYear()
      );
    });

    if (!esExcepcion) {
      // Verificar si la fecha está dentro del rango solicitado
      if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
        const fechaFinInstancia = new Date(fechaActual.getTime() + duracionMs);

        const instancia: Cita = {
          ...citaBase,
          id: `${citaBase.id}-${fechaActual.getTime()}`,
          fechaInicio: new Date(fechaActual),
          fechaFin: fechaFinInstancia,
          // Mantener referencia a la serie original
          recurrencia: {
            ...recurrencia,
            serieId: recurrencia.serieId || citaBase.id,
          },
        };

        instancias.push(instancia);
      }
    }

    // Calcular siguiente fecha según el tipo de recurrencia
    switch (recurrencia.tipo) {
      case 'diaria':
        fechaActual = new Date(fechaActual);
        fechaActual.setDate(fechaActual.getDate() + intervalo);
        break;

      case 'semanal':
        if (recurrencia.diasSemana && recurrencia.diasSemana.length > 0) {
          // Recurrencia semanal en días específicos
          // Encontrar el siguiente día de la semana que esté en la lista
          let siguienteFecha = new Date(fechaActual);
          let encontrado = false;
          let intentos = 0;
          const maxIntentos = 14; // Máximo 2 semanas de búsqueda

          while (!encontrado && intentos < maxIntentos) {
            siguienteFecha.setDate(siguienteFecha.getDate() + 1);
            const diaSemana = siguienteFecha.getDay();
            if (recurrencia.diasSemana.includes(diaSemana)) {
              fechaActual = new Date(siguienteFecha);
              encontrado = true;
            }
            intentos++;
          }

          if (!encontrado) {
            // Si no se encuentra, avanzar una semana completa
            fechaActual = new Date(fechaActual);
            fechaActual.setDate(fechaActual.getDate() + 7 * intervalo);
          }
        } else {
          // Recurrencia semanal simple (mismo día de la semana)
          fechaActual = new Date(fechaActual);
          fechaActual.setDate(fechaActual.getDate() + 7 * intervalo);
        }
        break;

      case 'quincenal':
        fechaActual = new Date(fechaActual);
        fechaActual.setDate(fechaActual.getDate() + 14 * intervalo);
        break;

      case 'mensual':
        fechaActual = new Date(fechaActual);
        fechaActual.setMonth(fechaActual.getMonth() + intervalo);
        break;

      default:
        // Si no se reconoce el tipo, salir del bucle
        fechaActual = new Date(fechaLimite.getTime() + 1);
        break;
    }
  }

  return instancias.length > 0 ? instancias : [citaBase];
};

// ============================================================================
// GENERACIÓN DE DATOS MOCK
// ============================================================================

/**
 * Genera un conjunto de datos mock para desarrollo y testing
 * Incluye citas simples y recurrentes de diferentes tipos
 */
function generarDatosMock(): Cita[] {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const addDays = (days: number, hour: number, minute: number) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const citas: Cita[] = [];

  // ===== CITAS SIMPLES - ENTRENADOR =====
  citas.push(
    {
      id: 'e1',
      titulo: 'Sesión PT con Juan Pérez',
      tipo: 'sesion-1-1',
      estado: 'confirmada',
      fechaInicio: addDays(0, 17, 0),
      fechaFin: addDays(0, 18, 0),
      clienteId: '1',
      clienteNombre: 'Juan Pérez',
      cliente: { id: '1', nombre: 'Juan Pérez' },
      notas: 'Enfoque en piernas',
      historial: [
        {
          id: 'hist-e1',
          fecha: addDays(-2, 10, 0),
          tipo: 'creada',
        },
      ],
    },
    {
      id: 'e2',
      titulo: 'Videollamada con María García',
      tipo: 'videollamada',
      estado: 'confirmada',
      fechaInicio: addDays(0, 19, 0),
      fechaFin: addDays(0, 19, 45),
      clienteId: '2',
      clienteNombre: 'María García',
      cliente: { id: '2', nombre: 'María García' },
      notas: 'Consulta nutricional',
    },
    {
      id: 'e3',
      titulo: 'Sesión PT con Carlos Ruiz',
      tipo: 'sesion-1-1',
      estado: 'confirmada',
      fechaInicio: addDays(1, 10, 0),
      fechaFin: addDays(1, 11, 0),
      clienteId: '3',
      clienteNombre: 'Carlos Ruiz',
      cliente: { id: '3', nombre: 'Carlos Ruiz' },
      notas: 'Entrenamiento de fuerza',
    }
  );

  // ===== CITAS RECURRENTES - ENTRENADOR =====
  // Sesión semanal recurrente (Lunes y Miércoles a las 10:00)
  const fechaInicioRecurrente1 = addDays(0, 10, 0);
  // Asegurar que sea lunes
  while (fechaInicioRecurrente1.getDay() !== 1) {
    fechaInicioRecurrente1.setDate(fechaInicioRecurrente1.getDate() + 1);
  }

  citas.push({
    id: 'recurrente-1',
    titulo: 'Sesión PT Semanal - Ana Martínez',
    tipo: 'sesion-1-1',
    estado: 'confirmada',
    fechaInicio: fechaInicioRecurrente1,
    fechaFin: new Date(fechaInicioRecurrente1.getTime() + 60 * 60 * 1000), // 1 hora
    clienteId: '4',
    clienteNombre: 'Ana Martínez',
    cliente: { id: '4', nombre: 'Ana Martínez' },
    notas: 'Entrenamiento personalizado semanal',
    recurrencia: {
      tipo: 'semanal',
      intervalo: 1,
      diasSemana: [1, 3], // Lunes y Miércoles
      fechaInicio: fechaInicioRecurrente1,
      fechaFinOpcional: addDays(90, 0, 0), // 3 meses
      serieId: 'serie-ana-martinez',
    },
  });

  // Sesión quincenal recurrente (cada 2 semanas, Viernes a las 16:00)
  const fechaInicioRecurrente2 = addDays(0, 16, 0);
  while (fechaInicioRecurrente2.getDay() !== 5) {
    fechaInicioRecurrente2.setDate(fechaInicioRecurrente2.getDate() + 1);
  }

  citas.push({
    id: 'recurrente-2',
    titulo: 'Evaluación Quincenal - Pedro Sánchez',
    tipo: 'evaluacion',
    estado: 'confirmada',
    fechaInicio: fechaInicioRecurrente2,
    fechaFin: new Date(fechaInicioRecurrente2.getTime() + 60 * 60 * 1000),
    clienteId: '5',
    clienteNombre: 'Pedro Sánchez',
    cliente: { id: '5', nombre: 'Pedro Sánchez' },
    notas: 'Evaluación de progreso quincenal',
    recurrencia: {
      tipo: 'quincenal',
      intervalo: 1,
      fechaInicio: fechaInicioRecurrente2,
      fechaFinOpcional: addDays(180, 0, 0), // 6 meses
      serieId: 'serie-pedro-sanchez',
    },
  });

  // ===== CITAS SIMPLES - CLASES COLECTIVAS =====
  citas.push(
    {
      id: 'c1',
      titulo: 'Yoga Matutino',
      tipo: 'clase-colectiva',
      estado: 'confirmada',
      fechaInicio: addDays(0, 8, 0),
      fechaFin: addDays(0, 9, 0),
      capacidadMaxima: 20,
      inscritos: 16,
      instructorNombre: 'María García',
      entrenador: { id: 'trainer-1', nombre: 'María García' },
    },
    {
      id: 'c2',
      titulo: 'Pilates',
      tipo: 'clase-colectiva',
      estado: 'confirmada',
      fechaInicio: addDays(0, 9, 0),
      fechaFin: addDays(0, 10, 0),
      capacidadMaxima: 15,
      inscritos: 12,
      instructorNombre: 'Ana Martínez',
      entrenador: { id: 'trainer-2', nombre: 'Ana Martínez' },
    },
    {
      id: 'c3',
      titulo: 'HIIT',
      tipo: 'clase-colectiva',
      estado: 'confirmada',
      fechaInicio: addDays(0, 19, 0),
      fechaFin: addDays(0, 20, 0),
      capacidadMaxima: 25,
      inscritos: 22,
      instructorNombre: 'Carlos Ruiz',
      entrenador: { id: 'trainer-3', nombre: 'Carlos Ruiz' },
    }
  );

  // ===== CITAS RECURRENTES - CLASES COLECTIVAS =====
  // Clase semanal recurrente (Martes y Jueves a las 18:00)
  const fechaInicioClaseRecurrente = addDays(0, 18, 0);
  while (fechaInicioClaseRecurrente.getDay() !== 2) {
    fechaInicioClaseRecurrente.setDate(fechaInicioClaseRecurrente.getDate() + 1);
  }

  citas.push({
    id: 'clase-recurrente-1',
    titulo: 'Spinning Semanal',
    tipo: 'clase-colectiva',
    estado: 'confirmada',
    fechaInicio: fechaInicioClaseRecurrente,
    fechaFin: new Date(fechaInicioClaseRecurrente.getTime() + 60 * 60 * 1000),
    capacidadMaxima: 30,
    inscritos: 28,
    instructorNombre: 'Laura Gómez',
    entrenador: { id: 'trainer-4', nombre: 'Laura Gómez' },
    recurrencia: {
      tipo: 'semanal',
      intervalo: 1,
      diasSemana: [2, 4], // Martes y Jueves
      fechaInicio: fechaInicioClaseRecurrente,
      fechaFinOpcional: addDays(365, 0, 0), // 1 año
      serieId: 'serie-spinning',
    },
  });

  // Clase mensual recurrente (primer sábado de cada mes a las 10:00)
  const fechaInicioMensual = addDays(0, 10, 0);
  while (fechaInicioMensual.getDay() !== 6 || fechaInicioMensual.getDate() > 7) {
    fechaInicioMensual.setDate(fechaInicioMensual.getDate() + 1);
  }

  citas.push({
    id: 'clase-recurrente-2',
    titulo: 'Yoga Restaurativo Mensual',
    tipo: 'clase-colectiva',
    estado: 'confirmada',
    fechaInicio: fechaInicioMensual,
    fechaFin: new Date(fechaInicioMensual.getTime() + 90 * 60 * 1000), // 1.5 horas
    capacidadMaxima: 15,
    inscritos: 12,
    instructorNombre: 'Carmen Vega',
    entrenador: { id: 'trainer-5', nombre: 'Carmen Vega' },
    recurrencia: {
      tipo: 'mensual',
      intervalo: 1,
      fechaInicio: fechaInicioMensual,
      fechaFinOpcional: addDays(365, 0, 0), // 1 año
      serieId: 'serie-yoga-mensual',
    },
  });

  // ===== CITAS CON EXCEPCIONES =====
  // Cita recurrente con una excepción (fecha cancelada)
  const fechaInicioConExcepcion = addDays(0, 14, 0);
  while (fechaInicioConExcepcion.getDay() !== 1) {
    fechaInicioConExcepcion.setDate(fechaInicioConExcepcion.getDate() + 1);
  }

  citas.push({
    id: 'recurrente-con-excepcion',
    titulo: 'Sesión PT - Miguel González',
    tipo: 'sesion-1-1',
    estado: 'confirmada',
    fechaInicio: fechaInicioConExcepcion,
    fechaFin: new Date(fechaInicioConExcepcion.getTime() + 60 * 60 * 1000),
    clienteId: '6',
    clienteNombre: 'Miguel González',
    cliente: { id: '6', nombre: 'Miguel González' },
    notas: 'Sesión semanal con excepción en fecha específica',
    recurrencia: {
      tipo: 'semanal',
      intervalo: 1,
      diasSemana: [1], // Lunes
      fechaInicio: fechaInicioConExcepcion,
      fechaFinOpcional: addDays(60, 0, 0), // 2 meses
      serieId: 'serie-miguel-gonzalez',
      excepciones: [addDays(14, 14, 0)], // Excepción en 2 semanas
    },
  });

  return citas;
}

// Exportar también como crearCita para compatibilidad
export { createCita as crearCita };
// Exportar también como actualizarCita para compatibilidad
export { updateCita as actualizarCita };
