import { HorarioDisponibilidad, BloqueoAgenda, HorarioTrabajo, AplicableA, SlotDisponible } from '../types';
import { getHorariosTrabajo, ContextoHorariosTrabajo } from './horariosTrabajo';

// ============================================================================
// API MOCK PARA DISPONIBILIDAD Y BLOQUEOS DE AGENDA
// ============================================================================
// Este archivo contiene funciones mock para gestionar la disponibilidad
// y bloqueos de agenda. En producción, estas funciones se reemplazarían
// con llamadas reales a la API del backend.
//
// Componentes que usan estas funciones:
// - BloqueosAgenda: usa getBloqueosAgenda(), crearBloqueoAgenda() y
//   eliminarBloqueoAgenda() para gestionar bloqueos
// - GestorHorarios: usa calcularSlotsDisponibles() para mostrar slots disponibles
// - ConfiguradorHorariosTrabajo: usa calcularSlotsDisponibles() para validar
//   disponibilidad al configurar horarios
// - AgendaCalendar: usa getBloqueos() para mostrar bloqueos en el calendario
// ============================================================================

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
let bloqueosAgendaStorage: BloqueoAgenda[] = [];

/**
 * Tipo de contexto para filtrar bloqueos de agenda
 * Usado en: BloqueosAgenda
 */
export interface ContextoBloqueosAgenda {
  /** Tipo de entidad (entrenador o centro) */
  aplicableA?: AplicableA;
  /** ID de la entidad específica */
  aplicableAId?: string;
  /** Fecha de inicio para filtrar bloqueos */
  fechaInicio?: Date;
  /** Fecha de fin para filtrar bloqueos */
  fechaFin?: Date;
  /** IDs específicos de entrenadores a filtrar (array) */
  entrenadorIds?: string[];
  /** Si debe incluir solo bloqueos futuros */
  soloFuturos?: boolean;
}

/**
 * Parámetros para calcular slots disponibles
 * Usado en: calcularSlotsDisponibles
 */
export interface ParamsCalcularSlotsDisponibles {
  /** Fecha de inicio del rango a calcular */
  fechaInicio: Date;
  /** Fecha de fin del rango a calcular */
  fechaFin: Date;
  /** Contexto para obtener horarios de trabajo */
  contextoHorarios?: ContextoHorariosTrabajo;
  /** Contexto para obtener bloqueos de agenda */
  contextoBloqueos?: ContextoBloqueosAgenda;
  /** Duración del slot en minutos (por defecto 30) */
  duracionSlotMinutos?: number;
}

export const getDisponibilidad = async (fecha: Date, role: 'entrenador' | 'gimnasio'): Promise<HorarioDisponibilidad[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const disponibilidad: HorarioDisponibilidad[] = [
        { id: '1', diaSemana: 1, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '2', diaSemana: 2, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '3', diaSemana: 3, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '4', diaSemana: 4, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '5', diaSemana: 5, horaInicio: '09:00', horaFin: '18:00', disponible: true },
      ];
      resolve(disponibilidad);
    }, 300);
  });
};

export const getBloqueos = async (fechaInicio: Date, fechaFin: Date): Promise<BloqueoAgenda[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrar bloqueos que se solapan con el rango de fechas
      const bloqueosFiltrados = bloqueosAgendaStorage.filter(bloqueo => {
        const bloqueoInicio = new Date(bloqueo.fechaInicio);
        const bloqueoFin = new Date(bloqueo.fechaFin);
        // Verificar si hay solapamiento
        return bloqueoInicio <= fechaFin && bloqueoFin >= fechaInicio;
      });
      resolve(bloqueosFiltrados);
    }, 300);
  });
};

export const crearBloqueo = async (bloqueo: Omit<BloqueoAgenda, 'id'>): Promise<BloqueoAgenda> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevoBloqueo: BloqueoAgenda = {
        ...bloqueo,
        id: `bloqueo-${Date.now()}`,
        bloqueoCompleto: bloqueo.bloqueoCompleto ?? true, // Por defecto día completo
      };
      bloqueosAgendaStorage.push(nuevoBloqueo);
      resolve(nuevoBloqueo);
    }, 300);
  });
};

export const actualizarBloqueo = async (id: string, bloqueo: Partial<BloqueoAgenda>): Promise<BloqueoAgenda> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = bloqueosAgendaStorage.findIndex(b => b.id === id);
      if (index === -1) {
        reject(new Error(`Bloqueo con ID ${id} no encontrado`));
        return;
      }

      const bloqueoActualizado: BloqueoAgenda = {
        ...bloqueosAgendaStorage[index],
        ...bloqueo,
        id, // Asegurar que el ID no cambie
      };
      bloqueosAgendaStorage[index] = bloqueoActualizado;
      resolve(bloqueoActualizado);
    }, 300);
  });
};

export const eliminarBloqueo = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      bloqueosAgendaStorage = bloqueosAgendaStorage.filter(b => b.id !== id);
      resolve();
    }, 300);
  });
};

// ============================================================================
// FUNCIONES MOCK PARA GESTIÓN DE BLOQUEOS DE AGENDA
// ============================================================================
// Estas funciones se usan en:
// - BloqueosAgenda: para listar, crear y eliminar bloqueos de agenda

/**
 * Obtiene la lista de bloqueos de agenda según el contexto
 * Usado en: BloqueosAgenda
 * 
 * @param contexto - Contexto para filtrar los bloqueos (entrenador/centro, fechas, etc.)
 * @returns Lista de bloqueos de agenda que coinciden con el contexto
 */
export const getBloqueosAgenda = async (contexto?: ContextoBloqueosAgenda): Promise<BloqueoAgenda[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Inicializar con datos mock si el storage está vacío
      if (bloqueosAgendaStorage.length === 0) {
        const hoy = new Date();
        const mañana = new Date(hoy);
        mañana.setDate(mañana.getDate() + 1);
        const semanaSiguiente = new Date(hoy);
        semanaSiguiente.setDate(semanaSiguiente.getDate() + 7);

        bloqueosAgendaStorage = [
          {
            id: 'bloqueo-1',
            titulo: 'Vacaciones',
            descripcion: 'Vacaciones de verano',
            motivo: 'Vacaciones',
            fechaInicio: semanaSiguiente,
            fechaFin: new Date(semanaSiguiente.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 días
            tipo: 'vacaciones',
            aplicableA: 'entrenador',
            aplicableAId: 'entrenador-1',
            recurrente: false,
            bloqueoCompleto: true,
          },
          {
            id: 'bloqueo-2',
            titulo: 'Mantenimiento del gimnasio',
            descripcion: 'Mantenimiento programado',
            motivo: 'Mantenimiento',
            fechaInicio: mañana,
            fechaFin: mañana,
            tipo: 'mantenimiento',
            aplicableA: 'centro',
            aplicableAId: 'centro-1',
            recurrente: false,
            bloqueoCompleto: true,
          },
          {
            id: 'bloqueo-3',
            titulo: 'Reunión matutina',
            descripcion: 'Bloqueo parcial para reunión',
            motivo: 'Reunión',
            fechaInicio: mañana,
            fechaFin: mañana,
            tipo: 'bloqueoManual',
            aplicableA: 'entrenador',
            aplicableAId: 'entrenador-1',
            recurrente: false,
            bloqueoCompleto: false,
            horaInicio: '10:00',
            horaFin: '12:00',
          },
        ];
      }

      // Filtrar según el contexto
      let bloqueosFiltrados = [...bloqueosAgendaStorage];

      if (contexto) {
        // Filtrar por tipo de entidad
        if (contexto.aplicableA) {
          bloqueosFiltrados = bloqueosFiltrados.filter(b => b.aplicableA === contexto.aplicableA);
        }

        // Filtrar por ID de entidad
        if (contexto.aplicableAId) {
          bloqueosFiltrados = bloqueosFiltrados.filter(b => b.aplicableAId === contexto.aplicableAId);
        }

        // Filtrar por IDs de entrenadores específicos
        if (contexto.entrenadorIds && contexto.entrenadorIds.length > 0) {
          bloqueosFiltrados = bloqueosFiltrados.filter(b => 
            !b.aplicableAId || 
            contexto.entrenadorIds!.includes(b.aplicableAId) ||
            (b.aplicableA === 'centro') // Los bloqueos de centro afectan a todos
          );
        }

        // Filtrar por rango de fechas
        if (contexto.fechaInicio) {
          bloqueosFiltrados = bloqueosFiltrados.filter(b => {
            const bloqueoFin = new Date(b.fechaFin);
            bloqueoFin.setHours(23, 59, 59, 999);
            return bloqueoFin >= contexto.fechaInicio!;
          });
        }

        if (contexto.fechaFin) {
          bloqueosFiltrados = bloqueosFiltrados.filter(b => {
            const bloqueoInicio = new Date(b.fechaInicio);
            bloqueoInicio.setHours(0, 0, 0, 0);
            return bloqueoInicio <= contexto.fechaFin!;
          });
        }

        // Filtrar solo futuros
        if (contexto.soloFuturos) {
          const ahora = new Date();
          bloqueosFiltrados = bloqueosFiltrados.filter(b => {
            const bloqueoFin = new Date(b.fechaFin);
            bloqueoFin.setHours(23, 59, 59, 999);
            return bloqueoFin >= ahora;
          });
        }
      }

      resolve(bloqueosFiltrados);
    }, 300);
  });
};

/**
 * Crea un nuevo bloqueo de agenda
 * Usado en: BloqueosAgenda
 * 
 * @param data - Datos del bloqueo a crear (sin ID)
 * @returns Bloqueo de agenda creado con ID asignado
 */
export const crearBloqueoAgenda = async (data: Omit<BloqueoAgenda, 'id'>): Promise<BloqueoAgenda> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevoBloqueo: BloqueoAgenda = {
        ...data,
        id: `bloqueo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bloqueoCompleto: data.bloqueoCompleto ?? true,
      };
      bloqueosAgendaStorage.push(nuevoBloqueo);
      resolve(nuevoBloqueo);
    }, 300);
  });
};

/**
 * Elimina un bloqueo de agenda por su ID
 * Usado en: BloqueosAgenda
 * 
 * @param id - ID del bloqueo a eliminar
 * @returns Promise que se resuelve cuando el bloqueo es eliminado
 */
export const eliminarBloqueoAgenda = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bloqueoExiste = bloqueosAgendaStorage.some(b => b.id === id);
      if (!bloqueoExiste) {
        reject(new Error(`Bloqueo con ID ${id} no encontrado`));
        return;
      }
      bloqueosAgendaStorage = bloqueosAgendaStorage.filter(b => b.id !== id);
      resolve();
    }, 300);
  });
};

/**
 * Calcula los slots de tiempo disponibles basándose en horarios de trabajo y bloqueos
 * Usado en: GestorHorarios, ConfiguradorHorariosTrabajo, BloqueosAgenda
 * 
 * Esta función:
 * 1. Obtiene los horarios de trabajo según el contexto
 * 2. Obtiene los bloqueos de agenda según el contexto
 * 3. Genera slots de tiempo disponibles excluyendo los horarios bloqueados
 * 4. Retorna la lista de slots disponibles
 * 
 * @param params - Parámetros para calcular los slots disponibles
 * @returns Lista de slots disponibles en el rango de fechas especificado
 */
export const calcularSlotsDisponibles = async (params: ParamsCalcularSlotsDisponibles): Promise<SlotDisponible[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const {
        fechaInicio,
        fechaFin,
        contextoHorarios,
        contextoBloqueos,
        duracionSlotMinutos = 30, // Por defecto 30 minutos
      } = params;

      // Obtener horarios de trabajo
      const horariosTrabajo = await getHorariosTrabajo(contextoHorarios);

      // Obtener bloqueos de agenda
      const contextoBloqueosConFechas: ContextoBloqueosAgenda = {
        ...contextoBloqueos,
        fechaInicio,
        fechaFin,
      };
      const bloqueos = await getBloqueosAgenda(contextoBloqueosConFechas);

      const slots: SlotDisponible[] = [];

      // Iterar por cada día en el rango
      const fechaActual = new Date(fechaInicio);
      fechaActual.setHours(0, 0, 0, 0);
      const fechaFinLimite = new Date(fechaFin);
      fechaFinLimite.setHours(23, 59, 59, 999);

      while (fechaActual <= fechaFinLimite) {
        const diaSemana = fechaActual.getDay();

        // Buscar horarios de trabajo para este día
        const horariosDelDia = horariosTrabajo.filter(
          h => h.diaSemana === diaSemana && h.activo
        );

        // Generar slots para cada horario de trabajo del día
        horariosDelDia.forEach(horario => {
          const [horaInicioH, minutoInicioH] = horario.horaInicio.split(':').map(Number);
          const [horaFinH, minutoFinH] = horario.horaFin.split(':').map(Number);

          let horaActual = horaInicioH;
          let minutoActual = minutoInicioH;

          while (horaActual < horaFinH || (horaActual === horaFinH && minutoActual < minutoFinH)) {
            // Calcular hora de fin del slot
            const slotMinutoInicio = horaActual * 60 + minutoActual;
            const slotMinutoFin = slotMinutoInicio + duracionSlotMinutos;
            const slotHoraFinH = Math.floor(slotMinutoFin / 60);
            const slotMinutoFinH = slotMinutoFin % 60;

            // Verificar que el slot no se salga del horario de trabajo
            const horarioMinutoFin = horaFinH * 60 + minutoFinH;
            if (slotMinutoFin > horarioMinutoFin) {
              break;
            }

            // Verificar si el slot está bloqueado por pausas
            let bloqueadoPorPausa = false;
            if (horario.pausas) {
              bloqueadoPorPausa = horario.pausas.some(pausa => {
                const [pausaInicioH, pausaInicioM] = pausa.horaInicio.split(':').map(Number);
                const [pausaFinH, pausaFinM] = pausa.horaFin.split(':').map(Number);
                const pausaInicio = pausaInicioH * 60 + pausaInicioM;
                const pausaFin = pausaFinH * 60 + pausaFinM;
                return (slotMinutoInicio < pausaFin && slotMinutoFin > pausaInicio);
              });
            }

            // Verificar si el slot está bloqueado por bloqueos de agenda
            let bloqueadoPorAgenda = false;
            let motivoBloqueo = '';

            bloqueos.forEach(bloqueo => {
              const bloqueoInicio = new Date(bloqueo.fechaInicio);
              bloqueoInicio.setHours(0, 0, 0, 0);
              const bloqueoFin = new Date(bloqueo.fechaFin);
              bloqueoFin.setHours(23, 59, 59, 999);

              // Verificar si el bloqueo afecta a esta fecha
              if (fechaActual >= bloqueoInicio && fechaActual <= bloqueoFin) {
                // Si es bloqueo completo, todo el día está bloqueado
                if (bloqueo.bloqueoCompleto) {
                  bloqueadoPorAgenda = true;
                  motivoBloqueo = bloqueo.titulo || 'Bloqueo completo';
                } else if (bloqueo.horaInicio && bloqueo.horaFin) {
                  // Si es bloqueo parcial, verificar solapamiento con el slot
                  const [bloqueoInicioH, bloqueoInicioM] = bloqueo.horaInicio.split(':').map(Number);
                  const [bloqueoFinH, bloqueoFinM] = bloqueo.horaFin.split(':').map(Number);
                  const bloqueoInicioMinutos = bloqueoInicioH * 60 + bloqueoInicioM;
                  const bloqueoFinMinutos = bloqueoFinH * 60 + bloqueoFinM;

                  if (slotMinutoInicio < bloqueoFinMinutos && slotMinutoFin > bloqueoInicioMinutos) {
                    bloqueadoPorAgenda = true;
                    motivoBloqueo = bloqueo.titulo || 'Bloqueo parcial';
                  }
                }
              }
            });

            // Verificar si el bloqueo aplica a este contexto
            if (contextoBloqueos) {
              if (contextoBloqueos.aplicableAId) {
                bloqueos.forEach(bloqueo => {
                  // Solo considerar bloqueos que aplican al mismo contexto o a centro
                  if (bloqueo.aplicableAId !== contextoBloqueos.aplicableAId && bloqueo.aplicableA !== 'centro') {
                    bloqueadoPorAgenda = false;
                    motivoBloqueo = '';
                  }
                });
              }
            }

            // Crear el slot
            const slot: SlotDisponible = {
              fecha: new Date(fechaActual),
              horaInicio: `${horaActual.toString().padStart(2, '0')}:${minutoActual.toString().padStart(2, '0')}`,
              horaFin: `${slotHoraFinH.toString().padStart(2, '0')}:${slotMinutoFinH.toString().padStart(2, '0')}`,
              duracionMinutos: duracionSlotMinutos,
              disponible: !bloqueadoPorPausa && !bloqueadoPorAgenda,
              motivoNoDisponible: bloqueadoPorPausa ? 'Pausa programada' : bloqueadoPorAgenda ? motivoBloqueo : undefined,
            };

            slots.push(slot);

            // Avanzar al siguiente slot
            minutoActual += duracionSlotMinutos;
            while (minutoActual >= 60) {
              minutoActual -= 60;
              horaActual += 1;
            }
          }
        });

        // Avanzar al siguiente día
        fechaActual.setDate(fechaActual.getDate() + 1);
      }

      resolve(slots);
    }, 300);
  });
};

