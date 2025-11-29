import { NotaSesion, PlantillaNotaSesion, TipoCita } from '../types';
import { getCitas } from './calendario';

// Mock data storage (en producción sería una base de datos)
let notasSesion: NotaSesion[] = [];
let plantillasNotas: PlantillaNotaSesion[] = [
  {
    id: 'plantilla-1',
    nombre: 'Sesión de Fuerza Estándar',
    descripcion: 'Plantilla para sesiones de entrenamiento de fuerza',
    queSeTrabajo: 'Entrenamiento de fuerza: piernas y glúteos. Series de sentadillas, peso muerto y prensa.',
    comoSeSintio: 'El cliente se sintió bien durante la sesión, con buen nivel de energía.',
    observaciones: 'Notar progreso en la técnica de sentadillas.',
    proximosPasos: 'Continuar con el programa de fuerza, aumentar peso gradualmente.',
    tipoSesion: ['sesion-1-1'],
    usoFrecuente: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'plantilla-2',
    nombre: 'Sesión de Cardio',
    descripcion: 'Plantilla para sesiones de cardio',
    queSeTrabajo: 'Entrenamiento cardiovascular: HIIT de 30 minutos. Circuito de ejercicios aeróbicos.',
    comoSeSintio: 'El cliente completó el entrenamiento con buena resistencia.',
    observaciones: 'Mantener el ritmo constante durante todo el entrenamiento.',
    proximosPasos: 'Aumentar intensidad progresivamente en próximas sesiones.',
    tipoSesion: ['sesion-1-1'],
    usoFrecuente: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'plantilla-3',
    nombre: 'Evaluación de Progreso',
    descripcion: 'Plantilla para sesiones de evaluación',
    queSeTrabajo: 'Evaluación de progreso: medición de peso, medidas corporales y prueba de condición física.',
    comoSeSintio: 'El cliente está satisfecho con los resultados obtenidos.',
    observaciones: 'Se observan mejoras significativas en la condición física.',
    proximosPasos: 'Ajustar programa de entrenamiento según los nuevos objetivos.',
    tipoSesion: ['evaluacion'],
    usoFrecuente: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Obtiene todas las notas de sesión de un cliente
 */
export const getNotasSesionCliente = async (
  clienteId: string,
  userId?: string
): Promise<NotaSesion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notas = notasSesion.filter(n => n.clienteId === clienteId);
      resolve(notas);
    }, 300);
  });
};

/**
 * Obtiene una nota de sesión por ID
 */
export const getNotaSesion = async (notaId: string): Promise<NotaSesion | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nota = notasSesion.find(n => n.id === notaId);
      resolve(nota || null);
    }, 300);
  });
};

/**
 * Obtiene una nota de sesión por ID de cita
 */
export const getNotaSesionPorCita = async (citaId: string): Promise<NotaSesion | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nota = notasSesion.find(n => n.citaId === citaId);
      resolve(nota || null);
    }, 300);
  });
};

/**
 * Crea una nueva nota de sesión
 */
export const crearNotaSesion = async (
  nota: Omit<NotaSesion, 'id' | 'createdAt' | 'updatedAt'>,
  userId?: string
): Promise<NotaSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaNota: NotaSesion = {
        ...nota,
        id: `nota-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        creadoPor: userId,
      };
      
      notasSesion.push(nuevaNota);
      
      // Si se usó una plantilla, incrementar su contador de uso
      if (nota.plantillaId) {
        const plantilla = plantillasNotas.find(p => p.id === nota.plantillaId);
        if (plantilla) {
          plantilla.usoFrecuente++;
          plantilla.updatedAt = new Date();
        }
      }
      
      resolve(nuevaNota);
    }, 300);
  });
};

/**
 * Actualiza una nota de sesión
 */
export const actualizarNotaSesion = async (
  notaId: string,
  nota: Partial<NotaSesion>,
  userId?: string
): Promise<NotaSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notaIndex = notasSesion.findIndex(n => n.id === notaId);
      if (notaIndex === -1) {
        throw new Error('Nota no encontrada');
      }
      
      const notaActualizada: NotaSesion = {
        ...notasSesion[notaIndex],
        ...nota,
        id: notaId,
        updatedAt: new Date(),
      };
      
      notasSesion[notaIndex] = notaActualizada;
      resolve(notaActualizada);
    }, 300);
  });
};

/**
 * Elimina una nota de sesión
 */
export const eliminarNotaSesion = async (notaId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      notasSesion = notasSesion.filter(n => n.id !== notaId);
      resolve();
    }, 300);
  });
};

/**
 * Busca notas de sesión por texto
 */
export const buscarNotasSesion = async (
  query: string,
  clienteId?: string,
  userId?: string
): Promise<NotaSesion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let notas = notasSesion;
      
      if (clienteId) {
        notas = notas.filter(n => n.clienteId === clienteId);
      }
      
      if (query) {
        const queryLower = query.toLowerCase();
        notas = notas.filter(n =>
          n.queSeTrabajo.toLowerCase().includes(queryLower) ||
          n.comoSeSintio.toLowerCase().includes(queryLower) ||
          n.observaciones?.toLowerCase().includes(queryLower) ||
          n.proximosPasos?.toLowerCase().includes(queryLower)
        );
      }
      
      resolve(notas);
    }, 300);
  });
};

/**
 * Obtiene todas las plantillas de notas
 */
export const getPlantillasNotas = async (userId?: string): Promise<PlantillaNotaSesion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrar por usuario si se proporciona
      let plantillas = plantillasNotas;
      if (userId) {
        plantillas = plantillas.filter(p => !p.userId || p.userId === userId);
      }
      
      // Ordenar por uso frecuente (más usadas primero)
      plantillas.sort((a, b) => b.usoFrecuente - a.usoFrecuente);
      resolve(plantillas);
    }, 300);
  });
};

/**
 * Obtiene plantillas de notas por tipo de sesión
 */
export const getPlantillasNotasPorTipo = async (
  tipoSesion: TipoCita,
  userId?: string
): Promise<PlantillaNotaSesion[]> => {
  return new Promise(async (resolve) => {
    const todasLasPlantillas = await getPlantillasNotas(userId);
    const plantillasFiltradas = todasLasPlantillas.filter(
      p => !p.tipoSesion || p.tipoSesion.length === 0 || p.tipoSesion.includes(tipoSesion)
    );
    resolve(plantillasFiltradas);
  });
};

/**
 * Crea una nueva plantilla de nota
 */
export const crearPlantillaNota = async (
  plantilla: Omit<PlantillaNotaSesion, 'id' | 'usoFrecuente' | 'createdAt' | 'updatedAt'>,
  userId?: string
): Promise<PlantillaNotaSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaPlantilla: PlantillaNotaSesion = {
        ...plantilla,
        id: `plantilla-${Date.now()}`,
        usoFrecuente: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      };
      
      plantillasNotas.push(nuevaPlantilla);
      resolve(nuevaPlantilla);
    }, 300);
  });
};

/**
 * Actualiza una plantilla de nota
 */
export const actualizarPlantillaNota = async (
  plantillaId: string,
  plantilla: Partial<PlantillaNotaSesion>,
  userId?: string
): Promise<PlantillaNotaSesion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plantillaIndex = plantillasNotas.findIndex(p => p.id === plantillaId);
      if (plantillaIndex === -1) {
        throw new Error('Plantilla no encontrada');
      }
      
      const plantillaActualizada: PlantillaNotaSesion = {
        ...plantillasNotas[plantillaIndex],
        ...plantilla,
        id: plantillaId,
        updatedAt: new Date(),
      };
      
      plantillasNotas[plantillaIndex] = plantillaActualizada;
      resolve(plantillaActualizada);
    }, 300);
  });
};

/**
 * Elimina una plantilla de nota
 */
export const eliminarPlantillaNota = async (plantillaId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      plantillasNotas = plantillasNotas.filter(p => p.id !== plantillaId);
      resolve();
    }, 300);
  });
};


