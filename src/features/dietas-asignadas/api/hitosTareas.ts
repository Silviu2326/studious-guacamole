import type { Hito, TareaPendiente } from '../types';

// Mock data - En producción vendría de la API real
const hitosMock: Hito[] = [
  {
    id: '1',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'competicion',
    titulo: 'Maratón de Madrid',
    descripcion: 'Maratón completa - objetivo: 3h 30min',
    fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 días desde hoy
    hora: '09:00',
    ubicacion: 'Madrid',
    importancia: 'alta',
    impactoNutricional: {
      ajusteMacrosRecomendado: {
        carbohidratos: 50, // Aumentar carbohidratos
        proteinas: 10,
      },
      recomendaciones: [
        'Aumentar carbohidratos 3 días antes',
        'Hidratación extra el día anterior',
        'Comida pre-competición ligera y rica en carbohidratos',
      ],
      diasPreparacion: 3,
      diasRecuperacion: 2,
    },
    completado: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '2',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'control-medico',
    titulo: 'Revisión médica anual',
    descripcion: 'Control de analíticas y estado general',
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 días desde hoy
    hora: '10:30',
    ubicacion: 'Clínica San José',
    importancia: 'media',
    impactoNutricional: {
      recomendaciones: [
        'Ayuno de 12 horas antes',
        'Evitar suplementos el día anterior',
      ],
      diasPreparacion: 1,
    },
    completado: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '3',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'sesion-clave',
    titulo: 'Sesión de evaluación física',
    descripcion: 'Evaluación de composición corporal y fuerza',
    fecha: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 21 días desde hoy
    hora: '18:00',
    importancia: 'media',
    completado: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

const tareasMock: TareaPendiente[] = [
  {
    id: '1',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'preparacion-hito',
    titulo: 'Ajustar macros para maratón',
    descripcion: 'Aumentar carbohidratos 3 días antes del evento',
    fechaLimite: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    prioridad: 'alta',
    relacionadaConHito: '1',
    completada: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '2',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'revisar-macros',
    titulo: 'Revisar cumplimiento de macros semanal',
    descripcion: 'Analizar adherencia y ajustar si es necesario',
    fechaLimite: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    prioridad: 'media',
    completada: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: '3',
    dietaId: 'dieta-1',
    clienteId: 'cliente-1',
    tipo: 'coordinar-entrenador',
    titulo: 'Coordinar plan de entrenamiento con entrenador',
    descripcion: 'Sincronizar nutrición con sesiones de fuerza',
    prioridad: 'media',
    completada: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

/**
 * Obtiene los hitos asociados a una dieta
 */
export async function getHitos(dietaId: string): Promise<Hito[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto haría una llamada real a la API
  return hitosMock.filter(h => h.dietaId === dietaId);
}

/**
 * Obtiene las tareas pendientes asociadas a una dieta
 */
export async function getTareasPendientes(dietaId: string): Promise<TareaPendiente[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto haría una llamada real a la API
  return tareasMock.filter(t => t.dietaId === dietaId && !t.completada);
}

/**
 * Crea un nuevo hito
 */
export async function crearHito(hito: Omit<Hito, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Hito> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoHito: Hito = {
    ...hito,
    id: `hito-${Date.now()}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  hitosMock.push(nuevoHito);
  return nuevoHito;
}

/**
 * Actualiza un hito existente
 */
export async function actualizarHito(hitoId: string, cambios: Partial<Hito>): Promise<Hito> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const indice = hitosMock.findIndex(h => h.id === hitoId);
  if (indice === -1) {
    throw new Error('Hito no encontrado');
  }
  
  hitosMock[indice] = {
    ...hitosMock[indice],
    ...cambios,
    actualizadoEn: new Date().toISOString(),
  };
  
  return hitosMock[indice];
}

/**
 * Marca una tarea como completada
 */
export async function completarTarea(tareaId: string): Promise<TareaPendiente> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const indice = tareasMock.findIndex(t => t.id === tareaId);
  if (indice === -1) {
    throw new Error('Tarea no encontrada');
  }
  
  tareasMock[indice] = {
    ...tareasMock[indice],
    completada: true,
    fechaCompletado: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  return tareasMock[indice];
}

/**
 * Crea una nueva tarea pendiente
 */
export async function crearTarea(tarea: Omit<TareaPendiente, 'id' | 'creadoEn' | 'actualizadoEn' | 'completada'>): Promise<TareaPendiente> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevaTarea: TareaPendiente = {
    ...tarea,
    id: `tarea-${Date.now()}`,
    completada: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  tareasMock.push(nuevaTarea);
  return nuevaTarea;
}

