import { HorarioTrabajoSemanal, PlantillaHorario, RangoHorario, HorarioTrabajoDia, HorarioTrabajo, AplicableA } from '../types';

// ============================================================================
// API MOCK PARA HORARIOS DE TRABAJO
// ============================================================================
// Este archivo contiene funciones mock para gestionar horarios de trabajo
// de entrenadores y centros. En producción, estas funciones se reemplazarían
// con llamadas reales a la API del backend.
//
// Componentes que usan estas funciones:
// - GestorHorarios: usa getHorariosTrabajo() para listar horarios
// - ConfiguradorHorariosTrabajo: usa getHorariosTrabajo(), saveHorariosTrabajo()
//   y validarHorarioTrabajo() para configurar y validar horarios
// - AgendaCalendar: usa getHorarioTrabajoActual() y esHorarioDisponible()
//   para verificar disponibilidad en el calendario
// ============================================================================

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
let horariosTrabajoStorage: HorarioTrabajoSemanal[] = [];
let plantillasStorage: PlantillaHorario[] = [];
// Almacenamiento para horarios de trabajo individuales (HorarioTrabajo)
let horariosTrabajoIndividualesStorage: HorarioTrabajo[] = [];

/**
 * Tipo de contexto para filtrar horarios de trabajo
 * Usado en: GestorHorarios, ConfiguradorHorariosTrabajo
 */
export interface ContextoHorariosTrabajo {
  /** Tipo de entidad (entrenador o centro) */
  aplicableA?: AplicableA;
  /** ID de la entidad específica */
  aplicableAId?: string;
  /** Si debe incluir solo horarios activos */
  soloActivos?: boolean;
}

/**
 * Obtiene el horario de trabajo actual del entrenador
 */
export const getHorarioTrabajoActual = async (userId?: string): Promise<HorarioTrabajoSemanal | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Buscar horario actual (no plantilla)
      const horarioActual = horariosTrabajoStorage.find(h => !h.esPlantilla);
      if (horarioActual) {
        resolve(horarioActual);
        return;
      }

      // Si no hay horario, crear uno por defecto
      const horarioPorDefecto: HorarioTrabajoSemanal = {
        id: 'default-1',
        nombre: 'Horario Actual',
        esPlantilla: false,
        dias: [
          { diaSemana: 1, disponible: true, rangos: [{ id: '1', horaInicio: '09:00', horaFin: '18:00' }] }, // Lunes
          { diaSemana: 2, disponible: true, rangos: [{ id: '2', horaInicio: '09:00', horaFin: '18:00' }] }, // Martes
          { diaSemana: 3, disponible: true, rangos: [{ id: '3', horaInicio: '09:00', horaFin: '18:00' }] }, // Miércoles
          { diaSemana: 4, disponible: true, rangos: [{ id: '4', horaInicio: '09:00', horaFin: '18:00' }] }, // Jueves
          { diaSemana: 5, disponible: true, rangos: [{ id: '5', horaInicio: '09:00', horaFin: '18:00' }] }, // Viernes
          { diaSemana: 6, disponible: false, rangos: [] }, // Sábado
          { diaSemana: 0, disponible: false, rangos: [] }, // Domingo
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      horariosTrabajoStorage.push(horarioPorDefecto);
      resolve(horarioPorDefecto);
    }, 300);
  });
};

/**
 * Guarda el horario de trabajo del entrenador
 */
export const guardarHorarioTrabajo = async (horario: Omit<HorarioTrabajoSemanal, 'id' | 'createdAt' | 'updatedAt'>): Promise<HorarioTrabajoSemanal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Si es un horario actual (no plantilla), actualizar o crear
      if (!horario.esPlantilla) {
        const index = horariosTrabajoStorage.findIndex(h => !h.esPlantilla);
        const nuevoHorario: HorarioTrabajoSemanal = {
          ...horario,
          id: index >= 0 ? horariosTrabajoStorage[index].id : `horario-${Date.now()}`,
          createdAt: index >= 0 ? horariosTrabajoStorage[index].createdAt : new Date(),
          updatedAt: new Date(),
        };
        if (index >= 0) {
          horariosTrabajoStorage[index] = nuevoHorario;
        } else {
          horariosTrabajoStorage.push(nuevoHorario);
        }
        resolve(nuevoHorario);
      } else {
        // Si es plantilla, crear nueva
        const nuevaPlantilla: HorarioTrabajoSemanal = {
          ...horario,
          id: `plantilla-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        horariosTrabajoStorage.push(nuevaPlantilla);
        resolve(nuevaPlantilla);
      }
    }, 300);
  });
};

/**
 * Obtiene todas las plantillas de horarios
 */
export const getPlantillasHorario = async (): Promise<PlantillaHorario[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Si no hay plantillas, crear algunas de ejemplo
      if (plantillasStorage.length === 0) {
        plantillasStorage = [
          {
            id: 'plantilla-1',
            nombre: 'Temporada Alta',
            descripcion: 'Horario ampliado para temporada alta',
            horarioTrabajo: {
              dias: [
                { diaSemana: 1, disponible: true, rangos: [{ id: '1', horaInicio: '08:00', horaFin: '14:00' }, { id: '2', horaInicio: '16:00', horaFin: '21:00' }] },
                { diaSemana: 2, disponible: true, rangos: [{ id: '3', horaInicio: '08:00', horaFin: '14:00' }, { id: '4', horaInicio: '16:00', horaFin: '21:00' }] },
                { diaSemana: 3, disponible: true, rangos: [{ id: '5', horaInicio: '08:00', horaFin: '14:00' }, { id: '6', horaInicio: '16:00', horaFin: '21:00' }] },
                { diaSemana: 4, disponible: true, rangos: [{ id: '7', horaInicio: '08:00', horaFin: '14:00' }, { id: '8', horaInicio: '16:00', horaFin: '21:00' }] },
                { diaSemana: 5, disponible: true, rangos: [{ id: '9', horaInicio: '08:00', horaFin: '14:00' }, { id: '10', horaInicio: '16:00', horaFin: '21:00' }] },
                { diaSemana: 6, disponible: true, rangos: [{ id: '11', horaInicio: '09:00', horaFin: '13:00' }] },
                { diaSemana: 0, disponible: false, rangos: [] },
              ],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'plantilla-2',
            nombre: 'Temporada Baja',
            descripcion: 'Horario reducido para temporada baja',
            horarioTrabajo: {
              dias: [
                { diaSemana: 1, disponible: true, rangos: [{ id: '1', horaInicio: '10:00', horaFin: '14:00' }] },
                { diaSemana: 2, disponible: true, rangos: [{ id: '2', horaInicio: '10:00', horaFin: '14:00' }] },
                { diaSemana: 3, disponible: true, rangos: [{ id: '3', horaInicio: '10:00', horaFin: '14:00' }] },
                { diaSemana: 4, disponible: true, rangos: [{ id: '4', horaInicio: '10:00', horaFin: '14:00' }] },
                { diaSemana: 5, disponible: true, rangos: [{ id: '5', horaInicio: '10:00', horaFin: '14:00' }] },
                { diaSemana: 6, disponible: false, rangos: [] },
                { diaSemana: 0, disponible: false, rangos: [] },
              ],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
      resolve(plantillasStorage);
    }, 300);
  });
};

/**
 * Guarda una nueva plantilla de horario
 */
export const guardarPlantillaHorario = async (plantilla: Omit<PlantillaHorario, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlantillaHorario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaPlantilla: PlantillaHorario = {
        ...plantilla,
        id: `plantilla-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      plantillasStorage.push(nuevaPlantilla);
      resolve(nuevaPlantilla);
    }, 300);
  });
};

/**
 * Elimina una plantilla de horario
 */
export const eliminarPlantillaHorario = async (plantillaId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      plantillasStorage = plantillasStorage.filter(p => p.id !== plantillaId);
      resolve();
    }, 300);
  });
};

/**
 * Aplica una plantilla de horario como horario actual
 */
export const aplicarPlantillaHorario = async (plantillaId: string): Promise<HorarioTrabajoSemanal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plantilla = plantillasStorage.find(p => p.id === plantillaId);
      if (!plantilla) {
        throw new Error('Plantilla no encontrada');
      }

      const horarioAplicado: HorarioTrabajoSemanal = {
        id: `horario-${Date.now()}`,
        nombre: 'Horario Actual',
        esPlantilla: false,
        dias: plantilla.horarioTrabajo.dias,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Actualizar o crear horario actual
      const index = horariosTrabajoStorage.findIndex(h => !h.esPlantilla);
      if (index >= 0) {
        horariosTrabajoStorage[index] = {
          ...horarioAplicado,
          id: horariosTrabajoStorage[index].id,
          createdAt: horariosTrabajoStorage[index].createdAt,
        };
      } else {
        horariosTrabajoStorage.push(horarioAplicado);
      }

      resolve(horarioAplicado);
    }, 300);
  });
};

/**
 * Verifica si un horario está dentro del rango de trabajo disponible
 */
export const esHorarioDisponible = (horarioTrabajo: HorarioTrabajoSemanal, fecha: Date, hora: number, minuto: number): boolean => {
  const diaSemana = fecha.getDay();
  const diaHorario = horarioTrabajo.dias.find(d => d.diaSemana === diaSemana);
  
  if (!diaHorario || !diaHorario.disponible) {
    return false;
  }

  const horaMinuto = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  
  return diaHorario.rangos.some(rango => {
    return horaMinuto >= rango.horaInicio && horaMinuto < rango.horaFin;
  });
};

// ============================================================================
// FUNCIONES MOCK PARA GESTIÓN DE HORARIOS DE TRABAJO
// ============================================================================
// Estas funciones se usan en:
// - GestorHorarios: para listar y gestionar horarios por entrenador/centro
// - ConfiguradorHorariosTrabajo: para guardar y validar configuraciones de horarios

/**
 * Obtiene la lista de horarios de trabajo según el contexto
 * Usado en: GestorHorarios, ConfiguradorHorariosTrabajo
 * 
 * @param contexto - Contexto para filtrar los horarios (entrenador/centro)
 * @returns Lista de horarios de trabajo que coinciden con el contexto
 */
export const getHorariosTrabajo = async (contexto?: ContextoHorariosTrabajo): Promise<HorarioTrabajo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Inicializar con datos mock si el storage está vacío
      if (horariosTrabajoIndividualesStorage.length === 0) {
        horariosTrabajoIndividualesStorage = [
          {
            id: 'horario-1',
            diaSemana: 1, // Lunes
            horaInicio: '09:00',
            horaFin: '18:00',
            activo: true,
            aplicableA: 'entrenador',
            aplicableAId: 'entrenador-1',
          },
          {
            id: 'horario-2',
            diaSemana: 2, // Martes
            horaInicio: '09:00',
            horaFin: '18:00',
            activo: true,
            aplicableA: 'entrenador',
            aplicableAId: 'entrenador-1',
          },
          {
            id: 'horario-3',
            diaSemana: 3, // Miércoles
            horaInicio: '09:00',
            horaFin: '18:00',
            activo: true,
            aplicableA: 'entrenador',
            aplicableAId: 'entrenador-1',
          },
          {
            id: 'horario-4',
            diaSemana: 1, // Lunes
            horaInicio: '10:00',
            horaFin: '14:00',
            activo: true,
            aplicableA: 'centro',
            aplicableAId: 'centro-1',
          },
        ];
      }

      // Filtrar según el contexto
      let horariosFiltrados = [...horariosTrabajoIndividualesStorage];

      if (contexto) {
        if (contexto.aplicableA) {
          horariosFiltrados = horariosFiltrados.filter(h => h.aplicableA === contexto.aplicableA);
        }

        if (contexto.aplicableAId) {
          horariosFiltrados = horariosFiltrados.filter(h => h.aplicableAId === contexto.aplicableAId);
        }

        if (contexto.soloActivos) {
          horariosFiltrados = horariosFiltrados.filter(h => h.activo);
        }
      }

      resolve(horariosFiltrados);
    }, 300);
  });
};

/**
 * Guarda una configuración completa de horarios de trabajo
 * Usado en: ConfiguradorHorariosTrabajo
 * 
 * @param lista - Lista de horarios de trabajo a guardar
 * @returns Lista de horarios guardados con sus IDs asignados
 */
export const saveHorariosTrabajo = async (lista: Omit<HorarioTrabajo, 'id'>[]): Promise<HorarioTrabajo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validar cada horario antes de guardar
      const horariosValidos: HorarioTrabajo[] = [];
      const horariosInvalidos: string[] = [];

      lista.forEach((horario, index) => {
        const validacion = validarHorarioTrabajo({ ...horario, id: `temp-${index}` } as HorarioTrabajo);
        if (validacion.valido) {
          // Generar ID único
          const horarioConId: HorarioTrabajo = {
            ...horario,
            id: `horario-${Date.now()}-${index}`,
          };
          horariosValidos.push(horarioConId);
        } else {
          horariosInvalidos.push(`Horario del día ${horario.diaSemana} (${horario.horaInicio}-${horario.horaFin}): ${validacion.errores.join(', ')}`);
        }
      });

      if (horariosInvalidos.length > 0) {
        throw new Error(`Error al guardar horarios:\n${horariosInvalidos.join('\n')}`);
      }

      // Eliminar horarios existentes del mismo contexto
      if (lista.length > 0) {
        const primerHorario = lista[0];
        horariosTrabajoIndividualesStorage = horariosTrabajoIndividualesStorage.filter(
          h => !(
            h.aplicableA === primerHorario.aplicableA &&
            h.aplicableAId === primerHorario.aplicableAId &&
            h.diaSemana === primerHorario.diaSemana
          )
        );
      }

      // Agregar los nuevos horarios
      horariosTrabajoIndividualesStorage.push(...horariosValidos);

      resolve(horariosValidos);
    }, 300);
  });
};

/**
 * Valida un horario de trabajo verificando reglas básicas
 * Usado en: ConfiguradorHorariosTrabajo
 * 
 * Reglas de validación:
 * - Las horas deben estar en formato HH:mm válido
 * - horaInicio debe ser menor que horaFin
 * - El rango de horas debe ser razonable (máximo 24 horas, mínimo 15 minutos)
 * - No debe haber solapamientos con otros horarios del mismo día y entidad
 * - Las pausas deben estar dentro del rango de trabajo
 * - Las pausas no deben solaparse entre sí
 * 
 * @param horario - Horario de trabajo a validar
 * @returns Objeto con resultado de la validación y errores si los hay
 */
export const validarHorarioTrabajo = (horario: HorarioTrabajo): { valido: boolean; errores: string[] } => {
  const errores: string[] = [];

  // Validar formato de horas (HH:mm)
  const formatoHora = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!formatoHora.test(horario.horaInicio)) {
    errores.push(`Formato de hora de inicio inválido: ${horario.horaInicio}. Debe ser HH:mm`);
  }
  if (!formatoHora.test(horario.horaFin)) {
    errores.push(`Formato de hora de fin inválido: ${horario.horaFin}. Debe ser HH:mm`);
  }

  // Validar que horaInicio < horaFin
  if (horario.horaInicio >= horario.horaFin) {
    errores.push(`La hora de inicio (${horario.horaInicio}) debe ser menor que la hora de fin (${horario.horaFin})`);
  }

  // Validar rango de horas (convertir a minutos para facilitar cálculos)
  const [horaInicioH, minutoInicioH] = horario.horaInicio.split(':').map(Number);
  const [horaFinH, minutoFinH] = horario.horaFin.split(':').map(Number);
  const minutosInicio = horaInicioH * 60 + minutoInicioH;
  const minutosFin = horaFinH * 60 + minutoFinH;
  const duracionMinutos = minutosFin - minutosInicio;

  // Validar duración mínima (15 minutos)
  if (duracionMinutos < 15) {
    errores.push(`El horario debe tener al menos 15 minutos de duración. Duración actual: ${duracionMinutos} minutos`);
  }

  // Validar duración máxima (24 horas)
  if (duracionMinutos > 24 * 60) {
    errores.push(`El horario no puede exceder 24 horas. Duración actual: ${duracionMinutos} minutos`);
  }

  // Validar día de la semana (0-6)
  if (horario.diaSemana < 0 || horario.diaSemana > 6) {
    errores.push(`El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado). Valor actual: ${horario.diaSemana}`);
  }

  // Validar pausas si existen
  if (horario.pausas && horario.pausas.length > 0) {
    horario.pausas.forEach((pausa, index) => {
      // Validar formato de pausa
      if (!formatoHora.test(pausa.horaInicio)) {
        errores.push(`Pausa ${index + 1}: formato de hora de inicio inválido: ${pausa.horaInicio}`);
      }
      if (!formatoHora.test(pausa.horaFin)) {
        errores.push(`Pausa ${index + 1}: formato de hora de fin inválido: ${pausa.horaFin}`);
      }

      // Validar que pausa esté dentro del rango de trabajo
      const [pausaInicioH, pausaInicioM] = pausa.horaInicio.split(':').map(Number);
      const [pausaFinH, pausaFinM] = pausa.horaFin.split(':').map(Number);
      const pausaInicioMinutos = pausaInicioH * 60 + pausaInicioM;
      const pausaFinMinutos = pausaFinH * 60 + pausaFinM;

      if (pausaInicioMinutos < minutosInicio || pausaInicioMinutos >= minutosFin) {
        errores.push(`Pausa ${index + 1}: la hora de inicio (${pausa.horaInicio}) debe estar dentro del horario de trabajo`);
      }
      if (pausaFinMinutos <= minutosInicio || pausaFinMinutos > minutosFin) {
        errores.push(`Pausa ${index + 1}: la hora de fin (${pausa.horaFin}) debe estar dentro del horario de trabajo`);
      }

      // Validar que inicio < fin en la pausa
      if (pausaInicioMinutos >= pausaFinMinutos) {
        errores.push(`Pausa ${index + 1}: la hora de inicio debe ser menor que la hora de fin`);
      }
    });

    // Validar solapamientos entre pausas
    for (let i = 0; i < horario.pausas.length; i++) {
      for (let j = i + 1; j < horario.pausas.length; j++) {
        const pausa1 = horario.pausas[i];
        const pausa2 = horario.pausas[j];
        const [p1InicioH, p1InicioM] = pausa1.horaInicio.split(':').map(Number);
        const [p1FinH, p1FinM] = pausa1.horaFin.split(':').map(Number);
        const [p2InicioH, p2InicioM] = pausa2.horaInicio.split(':').map(Number);
        const [p2FinH, p2FinM] = pausa2.horaFin.split(':').map(Number);

        const p1Inicio = p1InicioH * 60 + p1InicioM;
        const p1Fin = p1FinH * 60 + p1FinM;
        const p2Inicio = p2InicioH * 60 + p2InicioM;
        const p2Fin = p2FinH * 60 + p2FinM;

        // Verificar solapamiento
        if ((p1Inicio < p2Fin && p1Fin > p2Inicio)) {
          errores.push(`Las pausas ${i + 1} y ${j + 1} se solapan entre sí`);
        }
      }
    }
  }

  // Verificar solapamientos con otros horarios del mismo día y entidad
  const horariosMismoContexto = horariosTrabajoIndividualesStorage.filter(
    h => h.id !== horario.id &&
    h.aplicableA === horario.aplicableA &&
    h.aplicableAId === horario.aplicableAId &&
    h.diaSemana === horario.diaSemana &&
    h.activo
  );

  horariosMismoContexto.forEach(horarioExistente => {
    const [existenteInicioH, existenteInicioM] = horarioExistente.horaInicio.split(':').map(Number);
    const [existenteFinH, existenteFinM] = horarioExistente.horaFin.split(':').map(Number);
    const existenteInicio = existenteInicioH * 60 + existenteInicioM;
    const existenteFin = existenteFinH * 60 + existenteFinM;

    // Verificar solapamiento
    if ((minutosInicio < existenteFin && minutosFin > existenteInicio)) {
      errores.push(`El horario se solapa con otro horario existente (${horarioExistente.horaInicio}-${horarioExistente.horaFin})`);
    }
  });

  return {
    valido: errores.length === 0,
    errores,
  };
};


