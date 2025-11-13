import type { ContenidoEntrenamiento, EstadoEntrenamiento } from '../types';

const STORAGE_KEY_ESTADO = 'dietas_estado_entrenamiento';
const STORAGE_KEY_CONTENIDO = 'dietas_contenido_entrenamiento';

// Contenido de entrenamiento por defecto
const CONTENIDO_ENTRENAMIENTO_DEFAULT: ContenidoEntrenamiento[] = [
  {
    id: 'tooltip-biblioteca-recursos',
    featureId: 'biblioteca-recursos',
    featureNombre: 'Biblioteca de Recursos',
    tipo: 'tooltip',
    titulo: 'Biblioteca de Recursos',
    descripcion: 'Accede a plantillas, recetas y alimentos desde la biblioteca',
    contenido: {
      tooltip: {
        texto: 'Arrastra recursos desde la biblioteca directamente a tu dieta. Puedes filtrar por tipo, macros o etiquetas.',
        posicion: 'right',
        duracion: 5000,
      },
    },
    nivel: 'basico',
    tags: ['biblioteca', 'recursos', 'arrastrar'],
    visto: false,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: 'video-balanceo-macros',
    featureId: 'balanceo-macros',
    featureNombre: 'Balanceo de Macros con IA',
    tipo: 'video',
    titulo: 'Cómo usar el Balanceo de Macros con IA',
    descripcion: 'Aprende a usar la IA para balancear automáticamente los macronutrientes',
    contenido: {
      video: {
        url: 'https://example.com/videos/balanceo-macros-ia.mp4',
        duracion: 120,
        thumbnail: 'https://example.com/thumbnails/balanceo-macros.jpg',
        subtitulos: 'https://example.com/subtitles/balanceo-macros.vtt',
      },
    },
    nivel: 'intermedio',
    tags: ['ia', 'macros', 'balanceo'],
    visto: false,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: 'tooltip-vista-excel',
    featureId: 'vista-excel',
    featureNombre: 'Vista Excel',
    tipo: 'tooltip',
    titulo: 'Vista Excel',
    descripcion: 'Edita tu dieta como una hoja de cálculo',
    contenido: {
      tooltip: {
        texto: 'La vista Excel te permite editar múltiples días a la vez. Usa Ctrl+C y Ctrl+V para copiar y pegar celdas.',
        posicion: 'bottom',
        duracion: 6000,
      },
    },
    nivel: 'basico',
    tags: ['vista', 'excel', 'edicion'],
    visto: false,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: 'video-variaciones-automaticas',
    featureId: 'variaciones-automaticas',
    featureNombre: 'Variaciones Automáticas',
    tipo: 'ambos',
    titulo: 'Configurar Variaciones Automáticas',
    descripcion: 'Aprende a configurar variaciones automáticas para tus dietas',
    contenido: {
      tooltip: {
        texto: 'Las variaciones automáticas permiten que el sistema genere alternativas de comidas manteniendo los macros.',
        posicion: 'left',
        duracion: 5000,
      },
      video: {
        url: 'https://example.com/videos/variaciones-automaticas.mp4',
        duracion: 90,
        thumbnail: 'https://example.com/thumbnails/variaciones.jpg',
      },
    },
    nivel: 'avanzado',
    tags: ['variaciones', 'automatico', 'macros'],
    visto: false,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
];

// Estado por defecto
const ESTADO_DEFAULT: Omit<EstadoEntrenamiento, 'dietistaId' | 'ultimaActualizacion'> = {
  contenidoVisto: [],
  preferencias: {
    mostrarTooltips: true,
    mostrarVideos: true,
    autoMostrarNuevasFunciones: true,
    nivelPreferido: 'todos',
  },
};

/**
 * Obtiene el estado de entrenamiento del dietista
 */
export async function getEstadoEntrenamiento(dietistaId: string): Promise<EstadoEntrenamiento> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_ESTADO}_${dietistaId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar estado de entrenamiento:', error);
  }

  return {
    dietistaId,
    ...ESTADO_DEFAULT,
    ultimaActualizacion: new Date().toISOString(),
  };
}

/**
 * Guarda el estado de entrenamiento del dietista
 */
export async function guardarEstadoEntrenamiento(
  estado: EstadoEntrenamiento
): Promise<EstadoEntrenamiento> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const estadoActualizado: EstadoEntrenamiento = {
    ...estado,
    ultimaActualizacion: new Date().toISOString(),
  };

  try {
    localStorage.setItem(
      `${STORAGE_KEY_ESTADO}_${estado.dietistaId}`,
      JSON.stringify(estadoActualizado)
    );
  } catch (error) {
    console.error('Error al guardar estado de entrenamiento:', error);
  }

  return estadoActualizado;
}

/**
 * Obtiene todo el contenido de entrenamiento disponible
 */
export async function getContenidoEntrenamiento(): Promise<ContenidoEntrenamiento[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_CONTENIDO);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar contenido de entrenamiento:', error);
  }

  // Guardar contenido por defecto
  try {
    localStorage.setItem(STORAGE_KEY_CONTENIDO, JSON.stringify(CONTENIDO_ENTRENAMIENTO_DEFAULT));
  } catch (error) {
    console.error('Error al guardar contenido de entrenamiento por defecto:', error);
  }

  return CONTENIDO_ENTRENAMIENTO_DEFAULT;
}

/**
 * Obtiene contenido de entrenamiento para una función específica
 */
export async function getContenidoPorFeature(
  featureId: string
): Promise<ContenidoEntrenamiento | null> {
  const contenido = await getContenidoEntrenamiento();
  return contenido.find(c => c.featureId === featureId) || null;
}

/**
 * Marca contenido como visto
 */
export async function marcarContenidoVisto(
  dietistaId: string,
  contenidoId: string
): Promise<void> {
  const estado = await getEstadoEntrenamiento(dietistaId);
  if (!estado.contenidoVisto.includes(contenidoId)) {
    estado.contenidoVisto.push(contenidoId);
    await guardarEstadoEntrenamiento(estado);
  }
}

/**
 * Obtiene contenido no visto para el dietista
 */
export async function getContenidoNoVisto(
  dietistaId: string
): Promise<ContenidoEntrenamiento[]> {
  const [estado, contenido] = await Promise.all([
    getEstadoEntrenamiento(dietistaId),
    getContenidoEntrenamiento(),
  ]);

  return contenido.filter(c => !estado.contenidoVisto.includes(c.id));
}

/**
 * Actualiza las preferencias de entrenamiento
 */
export async function actualizarPreferenciasEntrenamiento(
  dietistaId: string,
  preferencias: Partial<EstadoEntrenamiento['preferencias']>
): Promise<EstadoEntrenamiento> {
  const estado = await getEstadoEntrenamiento(dietistaId);
  estado.preferencias = {
    ...estado.preferencias,
    ...preferencias,
  };
  return guardarEstadoEntrenamiento(estado);
}

