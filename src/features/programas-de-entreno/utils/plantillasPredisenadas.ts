import type { TipoColumnas, PlantillaRecomendada } from '../types';

export type RolTemplate = 'fuerza' | 'maraton' | 'hiit';

export interface PlantillaPredisenada {
  id: string;
  nombre: string;
  descripcion: string;
  rol: RolTemplate;
  columnas: TipoColumnas[];
  formulas: FormulaTemplate[];
  resumenes: string[];
  icono?: string;
  categoria: string;
}

export interface FormulaTemplate {
  id: string;
  nombre: string;
  formula: string;
  descripcion: string;
  tipo: 'volumen' | 'tonelaje' | 'densidad' | 'custom';
  variables: string[];
  unidad: string;
  recalculoAutomatico: boolean;
}

/**
 * Plantillas prediseñadas según el rol del coach
 */
export const PLANTILLAS_PREDISENADAS: PlantillaPredisenada[] = [
  {
    id: 'fuerza-basica',
    nombre: 'Fuerza - Básica',
    descripcion: 'Plantilla para entrenamiento de fuerza con seguimiento de tonelaje y volumen',
    rol: 'fuerza',
    columnas: ['tonelaje', 'series', 'repeticiones', 'peso', 'rpe', 'intensidad'],
    formulas: [
      {
        id: 'tonelaje-total',
        nombre: 'Tonelaje Total',
        formula: 'SUM(peso * series * repeticiones)',
        descripcion: 'Suma total del peso levantado (peso × series × repeticiones)',
        tipo: 'tonelaje',
        variables: ['peso', 'series', 'repeticiones'],
        unidad: 'kg',
        recalculoAutomatico: true,
      },
      {
        id: 'volumen-total',
        nombre: 'Volumen Total',
        formula: 'SUM(series * repeticiones)',
        descripcion: 'Total de series multiplicado por repeticiones',
        tipo: 'volumen',
        variables: ['series', 'repeticiones'],
        unidad: 'series×rep',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-fuerza',
        nombre: 'Densidad de Fuerza',
        formula: 'tonelajeTotal / duracion',
        descripcion: 'Tonelaje por minuto de entrenamiento',
        tipo: 'densidad',
        variables: ['tonelajeTotal', 'duracion'],
        unidad: 'kg/min',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenPorModalidad'],
    categoria: 'fuerza',
  },
  {
    id: 'fuerza-avanzada',
    nombre: 'Fuerza - Avanzada',
    descripcion: 'Plantilla avanzada para fuerza con métricas detalladas y análisis de densidad',
    rol: 'fuerza',
    columnas: ['tonelaje', 'series', 'repeticiones', 'peso', 'rpe', 'intensidad', 'duracion', 'descanso'],
    formulas: [
      {
        id: 'tonelaje-total',
        nombre: 'Tonelaje Total',
        formula: 'SUM(peso * series * repeticiones)',
        descripcion: 'Suma total del peso levantado',
        tipo: 'tonelaje',
        variables: ['peso', 'series', 'repeticiones'],
        unidad: 'kg',
        recalculoAutomatico: true,
      },
      {
        id: 'volumen-total',
        nombre: 'Volumen Total',
        formula: 'SUM(series * repeticiones)',
        descripcion: 'Total de series multiplicado por repeticiones',
        tipo: 'volumen',
        variables: ['series', 'repeticiones'],
        unidad: 'series×rep',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-fuerza',
        nombre: 'Densidad de Fuerza',
        formula: 'tonelajeTotal / duracion',
        descripcion: 'Tonelaje por minuto de entrenamiento',
        tipo: 'densidad',
        variables: ['tonelajeTotal', 'duracion'],
        unidad: 'kg/min',
        recalculoAutomatico: true,
      },
      {
        id: 'intensidad-promedio',
        nombre: 'Intensidad Promedio',
        formula: 'AVG(rpe)',
        descripcion: 'Promedio de RPE en todas las series',
        tipo: 'custom',
        variables: ['rpe'],
        unidad: 'RPE',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenDiario', 'resumenPorModalidad', 'resumenPorIntensidad'],
    categoria: 'fuerza',
  },
  {
    id: 'maraton-basica',
    nombre: 'Maratón - Básica',
    descripcion: 'Plantilla para entrenamiento de maratón con seguimiento de distancia, tiempo y ritmo',
    rol: 'maraton',
    columnas: ['duracion', 'calorias', 'intensidad', 'distancia', 'ritmo'],
    formulas: [
      {
        id: 'distancia-total',
        nombre: 'Distancia Total',
        formula: 'SUM(distancia)',
        descripcion: 'Suma total de kilómetros recorridos',
        tipo: 'volumen',
        variables: ['distancia'],
        unidad: 'km',
        recalculoAutomatico: true,
      },
      {
        id: 'ritmo-promedio',
        nombre: 'Ritmo Promedio',
        formula: 'AVG(ritmo)',
        descripcion: 'Ritmo promedio en minutos por kilómetro',
        tipo: 'custom',
        variables: ['ritmo'],
        unidad: 'min/km',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-maraton',
        nombre: 'Densidad de Entrenamiento',
        formula: 'distanciaTotal / duracion',
        descripcion: 'Kilómetros por hora de entrenamiento',
        tipo: 'densidad',
        variables: ['distanciaTotal', 'duracion'],
        unidad: 'km/h',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenPorIntensidad'],
    categoria: 'cardio',
  },
  {
    id: 'maraton-avanzada',
    nombre: 'Maratón - Avanzada',
    descripcion: 'Plantilla avanzada para maratón con análisis de volumen, intensidad y progresión',
    rol: 'maraton',
    columnas: ['duracion', 'calorias', 'intensidad', 'distancia', 'ritmo', 'elevacion', 'frecuencia-cardiaca'],
    formulas: [
      {
        id: 'distancia-total',
        nombre: 'Distancia Total',
        formula: 'SUM(distancia)',
        descripcion: 'Suma total de kilómetros recorridos',
        tipo: 'volumen',
        variables: ['distancia'],
        unidad: 'km',
        recalculoAutomatico: true,
      },
      {
        id: 'volumen-tiempo',
        nombre: 'Volumen de Tiempo',
        formula: 'SUM(duracion)',
        descripcion: 'Tiempo total de entrenamiento',
        tipo: 'volumen',
        variables: ['duracion'],
        unidad: 'min',
        recalculoAutomatico: true,
      },
      {
        id: 'ritmo-promedio',
        nombre: 'Ritmo Promedio',
        formula: 'AVG(ritmo)',
        descripcion: 'Ritmo promedio en minutos por kilómetro',
        tipo: 'custom',
        variables: ['ritmo'],
        unidad: 'min/km',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-maraton',
        nombre: 'Densidad de Entrenamiento',
        formula: 'distanciaTotal / (volumenTiempo / 60)',
        descripcion: 'Kilómetros por hora de entrenamiento',
        tipo: 'densidad',
        variables: ['distanciaTotal', 'volumenTiempo'],
        unidad: 'km/h',
        recalculoAutomatico: true,
      },
      {
        id: 'calorias-totales',
        nombre: 'Calorías Totales',
        formula: 'SUM(calorias)',
        descripcion: 'Total de calorías quemadas',
        tipo: 'custom',
        variables: ['calorias'],
        unidad: 'kcal',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenDiario', 'resumenPorIntensidad'],
    categoria: 'cardio',
  },
  {
    id: 'hiit-basica',
    nombre: 'HIIT - Básica',
    descripcion: 'Plantilla para entrenamiento HIIT con seguimiento de trabajo y descanso',
    rol: 'hiit',
    columnas: ['duracion', 'calorias', 'intensidad', 'trabajo', 'descanso', 'rpe'],
    formulas: [
      {
        id: 'volumen-trabajo',
        nombre: 'Volumen de Trabajo',
        formula: 'SUM(trabajo)',
        descripcion: 'Tiempo total de trabajo activo',
        tipo: 'volumen',
        variables: ['trabajo'],
        unidad: 'min',
        recalculoAutomatico: true,
      },
      {
        id: 'ratio-trabajo-descanso',
        nombre: 'Ratio Trabajo/Descanso',
        formula: 'AVG(trabajo / descanso)',
        descripcion: 'Promedio de ratio trabajo/descanso',
        tipo: 'custom',
        variables: ['trabajo', 'descanso'],
        unidad: 'ratio',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-hiit',
        nombre: 'Densidad HIIT',
        formula: 'volumenTrabajo / duracion',
        descripcion: 'Porcentaje de tiempo en trabajo activo',
        tipo: 'densidad',
        variables: ['volumenTrabajo', 'duracion'],
        unidad: '%',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenPorIntensidad'],
    categoria: 'hiit',
  },
  {
    id: 'hiit-avanzada',
    nombre: 'HIIT - Avanzada',
    descripcion: 'Plantilla avanzada para HIIT con análisis de densidad y eficiencia',
    rol: 'hiit',
    columnas: ['duracion', 'calorias', 'intensidad', 'trabajo', 'descanso', 'rpe', 'rounds', 'repeticiones'],
    formulas: [
      {
        id: 'volumen-trabajo',
        nombre: 'Volumen de Trabajo',
        formula: 'SUM(trabajo)',
        descripcion: 'Tiempo total de trabajo activo',
        tipo: 'volumen',
        variables: ['trabajo'],
        unidad: 'min',
        recalculoAutomatico: true,
      },
      {
        id: 'volumen-rounds',
        nombre: 'Volumen de Rounds',
        formula: 'SUM(rounds)',
        descripcion: 'Total de rounds completados',
        tipo: 'volumen',
        variables: ['rounds'],
        unidad: 'rounds',
        recalculoAutomatico: true,
      },
      {
        id: 'ratio-trabajo-descanso',
        nombre: 'Ratio Trabajo/Descanso',
        formula: 'AVG(trabajo / descanso)',
        descripcion: 'Promedio de ratio trabajo/descanso',
        tipo: 'custom',
        variables: ['trabajo', 'descanso'],
        unidad: 'ratio',
        recalculoAutomatico: true,
      },
      {
        id: 'densidad-hiit',
        nombre: 'Densidad HIIT',
        formula: '(volumenTrabajo / duracion) * 100',
        descripcion: 'Porcentaje de tiempo en trabajo activo',
        tipo: 'densidad',
        variables: ['volumenTrabajo', 'duracion'],
        unidad: '%',
        recalculoAutomatico: true,
      },
      {
        id: 'eficiencia-hiit',
        nombre: 'Eficiencia HIIT',
        formula: 'caloriasTotales / volumenTrabajo',
        descripcion: 'Calorías quemadas por minuto de trabajo',
        tipo: 'densidad',
        variables: ['caloriasTotales', 'volumenTrabajo'],
        unidad: 'kcal/min',
        recalculoAutomatico: true,
      },
    ],
    resumenes: ['resumenSemanal', 'resumenDiario', 'resumenPorIntensidad'],
    categoria: 'hiit',
  },
];

/**
 * Obtiene plantillas prediseñadas según el rol
 */
export function obtenerPlantillasPorRol(rol: RolTemplate): PlantillaPredisenada[] {
  return PLANTILLAS_PREDISENADAS.filter((p) => p.rol === rol);
}

/**
 * Obtiene una plantilla por ID
 */
export function obtenerPlantillaPorId(id: string): PlantillaPredisenada | undefined {
  return PLANTILLAS_PREDISENADAS.find((p) => p.id === id);
}

/**
 * Convierte una plantilla prediseñada a PlantillaRecomendada
 */
export function convertirAPlantillaRecomendada(
  plantilla: PlantillaPredisenada
): PlantillaRecomendada {
  return {
    id: plantilla.id,
    nombre: plantilla.nombre,
    descripcion: plantilla.descripcion,
    columnas: plantilla.columnas,
    calculos: plantilla.formulas.map((f) => f.id),
    resumenes: plantilla.resumenes,
    razon: `Plantilla prediseñada para ${plantilla.rol}`,
    relevancia: 100,
    categoria: plantilla.categoria as any,
  };
}

