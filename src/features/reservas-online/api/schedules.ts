// API para gestión de horarios semanales disponibles

export interface HorarioDisponible {
  horaInicio: string; // Formato HH:mm
  horaFin: string; // Formato HH:mm
}

export interface HorarioDia {
  dia: 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';
  disponible: boolean;
  horarios: HorarioDisponible[];
}

export interface HorarioSemanal {
  id: string;
  entrenadorId: string;
  horariosPorDia: HorarioDia[];
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DIAS_SEMANA: HorarioDia['dia'][] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

/**
 * Obtiene el horario semanal de un entrenador
 */
export const getHorarioSemanal = async (entrenadorId: string): Promise<HorarioSemanal | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const horariosStorage = localStorage.getItem(`horarios-semanal-${entrenadorId}`);
  if (!horariosStorage) {
    // Crear horario por defecto (lunes a viernes, 9:00-18:00)
    const horarioPorDefecto: HorarioSemanal = {
      id: `horario-${entrenadorId}`,
      entrenadorId,
      horariosPorDia: DIAS_SEMANA.map(dia => ({
        dia,
        disponible: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'].includes(dia),
        horarios: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'].includes(dia)
          ? [{ horaInicio: '09:00', horaFin: '18:00' }]
          : [],
      })),
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await guardarHorarioSemanal(horarioPorDefecto);
    return horarioPorDefecto;
  }

  try {
    const horarioData = JSON.parse(horariosStorage);
    return {
      ...horarioData,
      createdAt: new Date(horarioData.createdAt),
      updatedAt: new Date(horarioData.updatedAt),
    };
  } catch (error) {
    console.error('Error cargando horario semanal:', error);
    return null;
  }
};

/**
 * Guarda el horario semanal de un entrenador
 */
export const guardarHorarioSemanal = async (horario: HorarioSemanal): Promise<HorarioSemanal> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const horarioActualizado = {
    ...horario,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`horarios-semanal-${horario.entrenadorId}`, JSON.stringify(horarioActualizado));
  
  return horarioActualizado;
};

/**
 * Verifica si una fecha y hora están dentro del horario disponible
 */
export const estaDisponibleEnHorario = (
  horario: HorarioSemanal,
  fecha: Date,
  horaInicio: string,
  horaFin: string
): boolean => {
  if (!horario.activo) {
    return false;
  }

  // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
  const diaSemana = fecha.getDay();
  const diasMap: Record<number, HorarioDia['dia']> = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miércoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sábado',
  };
  
  const dia = diasMap[diaSemana];
  const horarioDia = horario.horariosPorDia.find(h => h.dia === dia);
  
  if (!horarioDia || !horarioDia.disponible) {
    return false;
  }

  // Verificar si la hora está dentro de alguno de los bloques horarios del día
  return horarioDia.horarios.some(bloque => {
    const bloqueInicio = convertirHoraAMinutos(bloque.horaInicio);
    const bloqueFin = convertirHoraAMinutos(bloque.horaFin);
    const inicioSolicitado = convertirHoraAMinutos(horaInicio);
    const finSolicitado = convertirHoraAMinutos(horaFin);
    
    // La reserva debe estar completamente dentro del bloque horario
    return inicioSolicitado >= bloqueInicio && finSolicitado <= bloqueFin;
  });
};

/**
 * Convierte una hora en formato HH:mm a minutos desde medianoche
 */
const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

/**
 * Obtiene los horarios disponibles para un día específico
 */
export const getHorariosDisponiblesDia = (
  horario: HorarioSemanal,
  fecha: Date
): HorarioDisponible[] => {
  if (!horario.activo) {
    return [];
  }

  const diaSemana = fecha.getDay();
  const diasMap: Record<number, HorarioDia['dia']> = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miércoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sábado',
  };
  
  const dia = diasMap[diaSemana];
  const horarioDia = horario.horariosPorDia.find(h => h.dia === dia);
  
  if (!horarioDia || !horarioDia.disponible) {
    return [];
  }

  return horarioDia.horarios;
};

/**
 * Crea un nuevo bloque horario
 */
export const crearBloqueHorario = (horaInicio: string, horaFin: string): HorarioDisponible => {
  return { horaInicio, horaFin };
};

/**
 * Valida que un bloque horario sea válido
 */
export const validarBloqueHorario = (bloque: HorarioDisponible): boolean => {
  const inicio = convertirHoraAMinutos(bloque.horaInicio);
  const fin = convertirHoraAMinutos(bloque.horaFin);
  return fin > inicio;
};

/**
 * Valida que dos bloques horarios no se solapen
 */
export const validarBloquesNoSolapados = (bloques: HorarioDisponible[]): boolean => {
  for (let i = 0; i < bloques.length; i++) {
    for (let j = i + 1; j < bloques.length; j++) {
      const bloque1 = bloques[i];
      const bloque2 = bloques[j];
      
      const inicio1 = convertirHoraAMinutos(bloque1.horaInicio);
      const fin1 = convertirHoraAMinutos(bloque1.horaFin);
      const inicio2 = convertirHoraAMinutos(bloque2.horaInicio);
      const fin2 = convertirHoraAMinutos(bloque2.horaFin);
      
      // Verificar solapamiento
      if (
        (inicio1 >= inicio2 && inicio1 < fin2) ||
        (fin1 > inicio2 && fin1 <= fin2) ||
        (inicio1 <= inicio2 && fin1 >= fin2)
      ) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Contexto para obtener horarios
 * Permite especificar el entrenador o centro para el cual se obtienen los horarios
 */
export interface ContextoSchedules {
  entrenadorId?: string;
  centroId?: string;
  role?: 'entrenador' | 'gimnasio';
}

/**
 * Obtiene la configuración básica de horarios de trabajo
 * 
 * @param contexto - Contexto con entrenadorId o centroId para obtener los horarios
 * @returns Configuración de horarios semanales
 * 
 * @remarks
 * Esta es una función mock que simplifica la obtención de horarios.
 * En producción, se conectaría con un backend que maneja múltiples contextos
 * (entrenadores, centros, tipos de sesión, etc.).
 */
export const getSchedules = async (contexto: ContextoSchedules): Promise<HorarioSemanal | null> => {
  // Si hay entrenadorId, usar la función existente
  if (contexto.entrenadorId) {
    return await getHorarioSemanal(contexto.entrenadorId);
  }
  
  // Para otros contextos, retornar null (en producción se implementaría la lógica específica)
  return null;
};

/**
 * Guarda la configuración de horarios
 * 
 * @param data - Datos del horario semanal a guardar
 * @returns Horario semanal guardado
 * 
 * @remarks
 * Esta es una función mock que simplifica el guardado de horarios.
 * En producción, se conectaría con un backend que valida y persiste los datos.
 */
export const saveSchedules = async (data: HorarioSemanal): Promise<HorarioSemanal> => {
  return await guardarHorarioSemanal(data);
};


