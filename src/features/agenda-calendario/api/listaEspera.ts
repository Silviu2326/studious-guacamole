import {
  EntradaListaEspera,
  EstadoListaEspera,
  Cita,
  TipoCita,
  ContextoMetricas,
} from '../types';
import { crearCita, getCitas } from './calendario';

// ============================================================================
// MOCK DATA STORAGE
// ============================================================================
// En producción, esto sería reemplazado por llamadas a una API REST/GraphQL
// Ejemplo de endpoints:
// - GET /api/lista-espera?entrenadorId=...&estado=...
// - POST /api/lista-espera (body: EntradaListaEsperaCreateDto)
// - DELETE /api/lista-espera/:id
// - POST /api/lista-espera/:id/asignar (body: { citaId: string })

/**
 * Almacenamiento mock en memoria de entradas de lista de espera
 * En producción, esto se almacenaría en una base de datos (PostgreSQL, MongoDB, etc.)
 * con índices en entrenadorId, cliente.id, estado, prioridad, fechaDeseada
 */
let mockListaEspera: EntradaListaEspera[] = [
  {
    id: 'le1',
    cliente: {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+1234567890',
    },
    tipoSesion: 'sesion-1-1',
    fechaDeseada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
    prioridad: 1,
    estado: 'activa',
    notas: 'Cliente prefiere horario matutino',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'le2',
    cliente: {
      id: '2',
      nombre: 'María García',
      email: 'maria@example.com',
      telefono: '+1234567891',
    },
    tipoSesion: 'videollamada',
    fechaDeseada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
    prioridad: 2,
    estado: 'activa',
    notas: 'Solicita sesión de evaluación',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'le3',
    cliente: {
      id: '3',
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      telefono: '+1234567892',
    },
    tipoSesion: 'sesion-1-1',
    fechaDeseada: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // En 10 días
    prioridad: 1,
    estado: 'activa',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
];

// ============================================================================
// FUNCIONES MOCK PARA LISTA DE ESPERA
// ============================================================================

/**
 * Obtiene todas las entradas de la lista de espera según el contexto proporcionado
 * 
 * INTEGRACIÓN CON GESTORLISTAESPERA.TSX:
 * Esta función es llamada por el componente GestorListaEspera.tsx para obtener
 * y mostrar todas las entradas de la lista de espera. El componente puede filtrar
 * por estado después de recibir los datos, o se puede agregar un parámetro de filtro
 * adicional si es necesario.
 * 
 * El contexto permite filtrar por entrenadorId o centroId según el rol del usuario.
 * 
 * @param contexto - Contexto que incluye información del usuario (entrenadorId, centroId, etc.)
 * @returns Promise con la lista de entradas de la lista de espera ordenadas por prioridad
 */
export const getListaEspera = async (
  contexto: ContextoMetricas
): Promise<EntradaListaEspera[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let lista = [...mockListaEspera];
      
      // Filtrar por entrenador si está en el contexto
      if (contexto.entrenadorId) {
        // En una implementación real, las entradas tendrían entrenadorId
        // Por ahora, retornamos todas las entradas mock
        // lista = lista.filter(le => le.entrenadorId === contexto.entrenadorId);
      }
      
      // Ordenar por prioridad (menor número = mayor prioridad) y fecha de creación
      lista.sort((a, b) => {
        if (a.prioridad !== b.prioridad) {
          return a.prioridad - b.prioridad;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      
      resolve(lista);
    }, 300);
  });
};

/**
 * Agrega una nueva entrada a la lista de espera
 * 
 * INTEGRACIÓN CON GESTORLISTAESPERA.TSX:
 * Esta función es llamada cuando el usuario hace clic en "Agregar Cliente" en el
 * componente GestorListaEspera.tsx. El componente pasa los datos del formulario
 * y esta función crea la entrada con prioridad automática basada en el número
 * de entradas activas existentes.
 * 
 * @param data - Datos de la entrada a agregar (sin id, estado, prioridad, fechas)
 * @returns Promise con la entrada creada
 */
export const addEntradaListaEspera = async (
  data: Omit<EntradaListaEspera, 'id' | 'estado' | 'prioridad' | 'createdAt' | 'updatedAt' | 'citaId' | 'fechaAsignacion'>
): Promise<EntradaListaEspera> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Verificar si el cliente ya está en la lista de espera para el mismo tipo de sesión y fecha similar
        const existe = mockListaEspera.find(le => 
          le.cliente.id === data.cliente.id &&
          le.tipoSesion === data.tipoSesion &&
          le.estado === 'activa' &&
          Math.abs(le.fechaDeseada.getTime() - data.fechaDeseada.getTime()) < 24 * 60 * 60 * 1000 // Mismo día
        );
        
        if (existe) {
          reject(new Error('El cliente ya está en la lista de espera para este tipo de sesión en una fecha similar'));
          return;
        }
        
        // Calcular prioridad (número de entradas activas + 1)
        const entradasActivas = mockListaEspera.filter(le => le.estado === 'activa').length;
        
        const nuevaEntrada: EntradaListaEspera = {
          ...data,
          id: `le${Date.now()}`,
          estado: 'activa',
          prioridad: entradasActivas + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        mockListaEspera.push(nuevaEntrada);
        
        resolve(nuevaEntrada);
      } catch (error) {
        console.error('Error agregando entrada a lista de espera:', error);
        reject(error);
      }
    }, 300);
  });
};

/**
 * Elimina una entrada de la lista de espera
 * 
 * INTEGRACIÓN CON GESTORLISTAESPERA.TSX:
 * Esta función es llamada cuando el usuario hace clic en el botón de eliminar
 * en el componente GestorListaEspera.tsx. La entrada se marca como 'cancelada'
 * en lugar de eliminarse físicamente para mantener el historial.
 * 
 * Después de eliminar, se reorganizan las prioridades de las entradas restantes.
 * 
 * @param id - ID de la entrada a eliminar
 * @returns Promise que se resuelve cuando la entrada ha sido eliminada
 */
export const removeEntradaListaEspera = async (
  id: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockListaEspera.findIndex(le => le.id === id);
      
      if (index === -1) {
        reject(new Error('Entrada no encontrada'));
        return;
      }
      
      // Marcar como cancelada en lugar de eliminar físicamente
      mockListaEspera[index].estado = 'cancelada';
      mockListaEspera[index].updatedAt = new Date();
      
      // Reorganizar prioridades de las entradas activas restantes
      reorganizarPrioridades();
      
      resolve();
    }, 300);
  });
};

/**
 * Asigna un hueco disponible a una entrada de la lista de espera, convirtiéndola en una cita
 * 
 * INTEGRACIÓN CON CREACIÓN/ACTUALIZACIÓN DE CITA:
 * Esta función simula el proceso de convertir una entrada de lista de espera en una Cita.
 * 
 * Flujo de integración:
 * 1. Cuando se libera un slot (por cancelación de una cita existente), se puede llamar
 *    a esta función para asignar automáticamente el slot al siguiente cliente en la lista.
 * 2. La función crea una nueva Cita usando crearCita() del módulo calendario.ts
 * 3. La entrada de lista de espera se actualiza con:
 *    - estado: 'asignada'
 *    - citaId: ID de la cita creada
 *    - fechaAsignacion: fecha actual
 * 4. Se reorganizan las prioridades de las entradas restantes
 * 
 * INTEGRACIÓN CON GESTORLISTAESPERA.TSX:
 * Esta función puede ser llamada desde GestorListaEspera.tsx cuando el entrenador
 * decide asignar manualmente un slot disponible a un cliente de la lista de espera,
 * o puede ser llamada automáticamente cuando se detecta que se liberó un slot.
 * 
 * @param entradaId - ID de la entrada de lista de espera a asignar
 * @param citaId - ID de la cita que se asignará (opcional, si no se proporciona se crea una nueva)
 * @returns Promise con la cita creada o actualizada
 */
export const asignarHuecoDesdeListaEspera = async (
  entradaId: string,
  citaId?: string
): Promise<Cita> => {
  return new Promise(async (resolve, reject) => {
    try {
      const entrada = mockListaEspera.find(le => le.id === entradaId);
      
      if (!entrada) {
        reject(new Error('Entrada no encontrada'));
        return;
      }
      
      if (entrada.estado !== 'activa' && entrada.estado !== 'notificada') {
        reject(new Error('La entrada no está disponible para asignación'));
        return;
      }
      
      let cita: Cita;
      
      if (citaId) {
        // Si se proporciona un citaId, actualizar la cita existente
        // En producción, esto haría una llamada PUT /api/citas/:citaId
        const citas = await getCitas({
          fechaInicio: new Date(0),
          fechaFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
        
        const citaExistente = citas.find(c => c.id === citaId);
        if (!citaExistente) {
          reject(new Error('Cita no encontrada'));
          return;
        }
        
        cita = citaExistente;
      } else {
        // Crear una nueva cita basada en la entrada de lista de espera
        // Usar la fecha deseada del cliente como fecha de inicio
        const fechaInicio = new Date(entrada.fechaDeseada);
        // Estimar duración basada en el tipo de sesión (por defecto 60 minutos)
        const duracionMinutos = entrada.tipoSesion === 'videollamada' ? 30 : 60;
        const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60 * 1000);
        
        cita = await crearCita({
          titulo: `Sesión ${entrada.tipoSesion} con ${entrada.cliente.nombre}`,
          tipo: entrada.tipoSesion,
          estado: 'confirmada',
          fechaInicio,
          fechaFin,
          cliente: {
            id: entrada.cliente.id,
            nombre: entrada.cliente.nombre,
            email: entrada.cliente.email,
            telefono: entrada.cliente.telefono,
          },
          notas: entrada.notas 
            ? `${entrada.notas} - Asignada desde lista de espera`
            : 'Asignada desde lista de espera',
        });
      }
      
      // Actualizar la entrada de lista de espera
      entrada.estado = 'asignada';
      entrada.citaId = cita.id;
      entrada.fechaAsignacion = new Date();
      entrada.updatedAt = new Date();
      
      // Reorganizar prioridades de las entradas restantes
      reorganizarPrioridades();
      
      setTimeout(() => {
        resolve(cita);
      }, 300);
    } catch (error) {
      console.error('Error asignando hueco desde lista de espera:', error);
      setTimeout(() => {
        reject(error);
      }, 300);
    }
  });
};

/**
 * Reorganiza las prioridades de las entradas activas en la lista de espera
 * 
 * Esta función se llama automáticamente después de eliminar o asignar una entrada
 * para mantener las prioridades consistentes (1, 2, 3, ...) basadas en el orden
 * de creación (más antiguas primero).
 */
const reorganizarPrioridades = (): void => {
  const entradasActivas = mockListaEspera
    .filter(le => le.estado === 'activa')
    .sort((a, b) => {
      // Ordenar por fecha de creación (más antiguas primero)
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  
  entradasActivas.forEach((entrada, index) => {
    entrada.prioridad = index + 1;
    entrada.updatedAt = new Date();
  });
};

// ============================================================================
// WRAPPER FUNCTIONS PARA COMPATIBILIDAD CON COMPONENTES
// ============================================================================

/**
 * Wrapper para obtener lista de espera con filtro de estado
 */
export const getListaEsperaWithFilter = async (
  entrenadorId: string,
  estado?: EstadoListaEspera
): Promise<EntradaListaEspera[]> => {
  const lista = await getListaEspera({ entrenadorId, role: 'entrenador' });
  if (estado) {
    return lista.filter(le => le.estado === estado);
  }
  return lista;
};

/**
 * Wrapper para asignar slot desde lista de espera con fecha específica
 */
export const asignarSlotListaEspera = async (
  entradaId: string,
  fechaSlot: Date,
  entrenadorId: string
): Promise<Cita> => {
  // Buscar la entrada y actualizar la fecha deseada si es necesario
  const entrada = mockListaEspera.find(le => le.id === entradaId);
  if (entrada) {
    entrada.fechaDeseada = fechaSlot;
  }
  return asignarHuecoDesdeListaEspera(entradaId);
};

/**
 * Wrapper para agregar cliente a lista de espera (compatibilidad con componente)
 */
export const agregarClienteListaEspera = async (data: {
  entrenadorId: string;
  clienteId: string;
  clienteNombre: string;
  tipoSesion?: TipoCita;
  fechaDeseada?: Date;
}): Promise<EntradaListaEspera> => {
  // Crear fecha deseada si no se proporciona (usando fecha actual + 7 días)
  const fechaDeseada = data.fechaDeseada || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return addEntradaListaEspera({
    cliente: {
      id: data.clienteId,
      nombre: data.clienteNombre,
    },
    tipoSesion: data.tipoSesion || 'sesion-1-1',
    fechaDeseada,
  });
};

/**
 * Wrapper para eliminar cliente de lista de espera (compatibilidad con componente)
 */
export const eliminarClienteListaEspera = async (
  entradaId: string,
  entrenadorId: string
): Promise<void> => {
  return removeEntradaListaEspera(entradaId);
};

/**
 * Obtiene horarios populares (mock - simplificado)
 */
export const getHorariosPopulares = async (entrenadorId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 300);
  });
};

/**
 * Obtiene resumen de lista de espera (mock - simplificado)
 */
export const getResumenListaEspera = async (entrenadorId: string): Promise<any> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const lista = await getListaEspera({ entrenadorId, role: 'entrenador' });
      resolve({
        totalEntradas: lista.length,
        entradasActivas: lista.filter(le => le.estado === 'activa').length,
        entradasNotificadas: lista.filter(le => le.estado === 'notificada').length,
        entradasAsignadas: lista.filter(le => le.estado === 'asignada').length,
        horariosPopulares: [],
        proximasNotificaciones: 0,
      });
    }, 300);
  });
};

/**
 * Obtiene configuración de lista de espera (mock - simplificado)
 */
export const getConfiguracionListaEspera = async (entrenadorId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'config-1',
        entrenadorId,
        activo: true,
        tiempoRespuestaHoras: 24,
        notificacionAutomatica: true,
        metodoNotificacion: 'email',
        maxEntradasPorCliente: 3,
        diasValidez: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }, 300);
  });
};

/**
 * Actualiza configuración de lista de espera (mock - simplificado)
 */
export const actualizarConfiguracionListaEspera = async (
  config: any,
  entrenadorId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

/**
 * Obtiene notificaciones de slots liberados (mock - simplificado)
 */
export const getNotificacionesSlotsLiberados = async (entrenadorId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 300);
  });
};
