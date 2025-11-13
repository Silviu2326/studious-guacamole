/**
 * Sistema de reglas inteligentes para sustituciones automáticas
 * User Story: Como coach quiero disponer de reglas inteligentes para automatizar reemplazos recurrentes
 */

export type TipoCondicion = 'lesion' | 'patron' | 'modalidad' | 'intensidad' | 'equipamiento' | 'tag';
export type TipoAccion = 'reemplazar' | 'modificar' | 'eliminar';

export interface CondicionRegla {
  tipo: TipoCondicion;
  valor: string; // Ej: "dolor hombro", "press", "Strength", "RPE 8", "barra", "heavy lower"
  operador?: 'contiene' | 'igual' | 'no_contiene' | 'tiene_tag' | 'no_tiene_tag'; // Por defecto 'contiene'
}

export interface AccionRegla {
  tipo: TipoAccion;
  bloqueReemplazo?: {
    nombre: string;
    modality: string;
    duration: string;
    intensity?: string;
    equipment?: string;
  };
  modificaciones?: {
    modality?: string;
    duration?: string;
    intensity?: string;
  };
}

export interface ReglaInteligente {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  condiciones: CondicionRegla[];
  accion: AccionRegla;
  prioridad: number; // 1-10, mayor número = mayor prioridad
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Reglas predefinidas comunes
 */
export const REGLAS_PREDEFINIDAS: Omit<ReglaInteligente, 'id' | 'fechaCreacion' | 'fechaActualizacion'>[] = [
  {
    nombre: 'Lesión de hombro - Reemplazar presses',
    descripcion: 'Si el cliente tiene lesión de hombro, reemplazar presses por variantes en máquina',
    activa: false,
    condiciones: [
      { tipo: 'lesion', valor: 'hombro', operador: 'contiene' },
      { tipo: 'patron', valor: 'press', operador: 'contiene' },
    ],
    accion: {
      tipo: 'reemplazar',
      bloqueReemplazo: {
        nombre: 'Press en máquina',
        modality: 'Strength',
        duration: '40 min',
        intensity: 'RPE 7',
        equipment: 'Máquina',
      },
    },
    prioridad: 8,
  },
  {
    nombre: 'Lesión de rodilla - Reemplazar sentadillas',
    descripcion: 'Si el cliente tiene lesión de rodilla, reemplazar sentadillas por variantes seguras',
    activa: false,
    condiciones: [
      { tipo: 'lesion', valor: 'rodilla', operador: 'contiene' },
      { tipo: 'patron', valor: 'squat', operador: 'contiene' },
    ],
    accion: {
      tipo: 'reemplazar',
      bloqueReemplazo: {
        nombre: 'Goblet squat o split-squat',
        modality: 'Strength',
        duration: '35 min',
        intensity: 'RPE 6.5',
        equipment: 'Mancuernas',
      },
    },
    prioridad: 8,
  },
  {
    nombre: 'Lesión lumbar - Reemplazar deadlifts',
    descripcion: 'Si el cliente tiene lesión lumbar, reemplazar deadlifts por variantes seguras',
    activa: false,
    condiciones: [
      { tipo: 'lesion', valor: 'lumbar', operador: 'contiene' },
      { tipo: 'patron', valor: 'deadlift', operador: 'contiene' },
    ],
    accion: {
      tipo: 'reemplazar',
      bloqueReemplazo: {
        nombre: 'Hip thrust o puente de glúteo',
        modality: 'Strength',
        duration: '30 min',
        intensity: 'RPE 6',
        equipment: 'Mancuernas, Bandas',
      },
    },
    prioridad: 8,
  },
  {
    nombre: 'Sin equipamiento - Reemplazar ejercicios con barra',
    descripcion: 'Si no hay barra disponible, reemplazar ejercicios que requieren barra',
    activa: false,
    condiciones: [
      { tipo: 'equipamiento', valor: 'barra', operador: 'no_contiene' },
      { tipo: 'equipamiento', valor: 'barra', operador: 'contiene' },
    ],
    accion: {
      tipo: 'reemplazar',
      bloqueReemplazo: {
        nombre: 'Variante con mancuernas o peso corporal',
        modality: 'Strength',
        duration: '35 min',
        intensity: 'RPE 7',
        equipment: 'Mancuernas, Peso corporal',
      },
    },
    prioridad: 5,
  },
  {
    nombre: 'Reducir intensidad en días de alta fatiga',
    descripcion: 'Reducir intensidad de RPE 8+ a RPE 7 en sesiones de fuerza',
    activa: false,
    condiciones: [
      { tipo: 'modalidad', valor: 'Strength', operador: 'igual' },
      { tipo: 'intensidad', valor: 'RPE 8', operador: 'contiene' },
    ],
    accion: {
      tipo: 'modificar',
      modificaciones: {
        intensity: 'RPE 7',
      },
    },
    prioridad: 6,
  },
];

/**
 * Almacenamiento de reglas en localStorage
 */
const STORAGE_KEY = 'intelligent-substitution-rules';

export function obtenerReglas(): ReglaInteligente[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando reglas inteligentes:', error);
  }
  
  // Si no hay reglas guardadas, retornar las predefinidas con IDs
  return REGLAS_PREDEFINIDAS.map((regla, index) => ({
    ...regla,
    id: `predefinida-${index}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  }));
}

export function guardarReglas(reglas: ReglaInteligente[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reglas));
  } catch (error) {
    console.warn('Error guardando reglas inteligentes:', error);
  }
}

export function crearRegla(regla: Omit<ReglaInteligente, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): ReglaInteligente {
  const nuevaRegla: ReglaInteligente = {
    ...regla,
    id: `regla-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };
  
  const reglas = obtenerReglas();
  reglas.push(nuevaRegla);
  guardarReglas(reglas);
  
  return nuevaRegla;
}

export function actualizarRegla(id: string, actualizaciones: Partial<ReglaInteligente>): ReglaInteligente | null {
  const reglas = obtenerReglas();
  const index = reglas.findIndex((r) => r.id === id);
  
  if (index === -1) return null;
  
  reglas[index] = {
    ...reglas[index],
    ...actualizaciones,
    fechaActualizacion: new Date().toISOString(),
  };
  
  guardarReglas(reglas);
  return reglas[index];
}

export function eliminarRegla(id: string): boolean {
  const reglas = obtenerReglas();
  const filtradas = reglas.filter((r) => r.id !== id);
  
  if (filtradas.length === reglas.length) return false;
  
  guardarReglas(filtradas);
  return true;
}

/**
 * Evaluar si una sesión cumple con las condiciones de una regla
 */
export function evaluarCondiciones(
  condiciones: CondicionRegla[],
  contexto: {
    lesiones?: string[];
    bloqueNombre?: string;
    modality?: string;
    intensity?: string;
    equipment?: string[];
    tags?: string[]; // Tags de la sesión o día
  }
): boolean {
  return condiciones.every((condicion) => {
    const operador = condicion.operador || 'contiene';
    let valorContexto: string | string[] | undefined;
    
    switch (condicion.tipo) {
      case 'lesion':
        valorContexto = contexto.lesiones?.join(' ').toLowerCase() || '';
        break;
      case 'patron':
        valorContexto = contexto.bloqueNombre?.toLowerCase() || '';
        break;
      case 'modalidad':
        valorContexto = contexto.modality?.toLowerCase() || '';
        break;
      case 'intensidad':
        valorContexto = contexto.intensity?.toLowerCase() || '';
        break;
      case 'equipamiento':
        valorContexto = contexto.equipment?.join(' ').toLowerCase() || '';
        break;
      case 'tag':
        // Para tags, trabajamos directamente con el array
        if (operador === 'tiene_tag' || operador === 'no_tiene_tag') {
          const tags = contexto.tags || [];
          const tagBuscado = condicion.valor.toLowerCase();
          const tieneTag = tags.some((tag) => tag.toLowerCase() === tagBuscado);
          return operador === 'tiene_tag' ? tieneTag : !tieneTag;
        }
        valorContexto = contexto.tags?.join(' ').toLowerCase() || '';
        break;
    }
    
    if (typeof valorContexto === 'string') {
      const valorBusqueda = condicion.valor.toLowerCase();
      switch (operador) {
        case 'contiene':
          return valorContexto.includes(valorBusqueda);
        case 'igual':
          return valorContexto === valorBusqueda;
        case 'no_contiene':
          return !valorContexto.includes(valorBusqueda);
        default:
          return false;
      }
    }
    
    return false;
  });
}

/**
 * Aplicar reglas inteligentes a un bloque de sesión
 */
export function aplicarReglasInteligentes(
  bloque: {
    block: string;
    modality: string;
    intensity: string;
    duration: string;
    notes?: string;
    tags?: string[];
  },
  contexto: {
    lesiones?: string[];
    equipment?: string[];
    tags?: string[]; // Tags del día o sesión
  }
): {
  modificado: boolean;
  nuevoBloque?: Partial<typeof bloque>;
  reglaAplicada?: ReglaInteligente;
} {
  const reglas = obtenerReglas().filter((r) => r.activa);
  
  // Ordenar por prioridad (mayor primero)
  reglas.sort((a, b) => b.prioridad - a.prioridad);
  
  // Combinar tags del bloque y del contexto
  const allTags = [...(bloque.tags || []), ...(contexto.tags || [])];
  
  for (const regla of reglas) {
    const cumpleCondiciones = evaluarCondiciones(regla.condiciones, {
      lesiones: contexto.lesiones,
      bloqueNombre: bloque.block,
      modality: bloque.modality,
      intensity: bloque.intensity,
      equipment: contexto.equipment,
      tags: allTags,
    });
    
    if (cumpleCondiciones) {
      if (regla.accion.tipo === 'reemplazar' && regla.accion.bloqueReemplazo) {
        return {
          modificado: true,
          nuevoBloque: {
            block: regla.accion.bloqueReemplazo.nombre,
            modality: regla.accion.bloqueReemplazo.modality,
            duration: regla.accion.bloqueReemplazo.duration,
            intensity: regla.accion.bloqueReemplazo.intensity || bloque.intensity,
            notes: `${bloque.notes || ''} [Aplicada regla: ${regla.nombre}]`.trim(),
            tags: bloque.tags, // Mantener tags originales
          },
          reglaAplicada: regla,
        };
      } else if (regla.accion.tipo === 'modificar' && regla.accion.modificaciones) {
        return {
          modificado: true,
          nuevoBloque: {
            ...bloque,
            ...regla.accion.modificaciones,
            notes: `${bloque.notes || ''} [Aplicada regla: ${regla.nombre}]`.trim(),
            tags: bloque.tags, // Mantener tags originales
          },
          reglaAplicada: regla,
        };
      }
    }
  }
  
  return { modificado: false };
}

