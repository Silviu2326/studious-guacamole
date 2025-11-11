import { HorarioTrabajoSemanal, PlantillaHorario, RangoHorario, HorarioTrabajoDia } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
let horariosTrabajoStorage: HorarioTrabajoSemanal[] = [];
let plantillasStorage: PlantillaHorario[] = [];

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


