import type { RespuestasCuestionario, PlantillaRecomendada, TipoColumnas } from '../types';

/**
 * Genera plantillas recomendadas basadas en las respuestas del cuestionario
 */
export function generarPlantillasRecomendadas(
  respuestas: RespuestasCuestionario
): PlantillaRecomendada[] {
  const plantillas: PlantillaRecomendada[] = [];

  // Plantilla 1: Fuerza con énfasis en tonelaje
  if (
    respuestas.rol === 'fuerza' ||
    respuestas.prioridades.includes('tonelaje') ||
    respuestas.enfasisTonelaje
  ) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'fuerza',
      prioridades: ['tonelaje'],
      columnas: ['tonelaje', 'series', 'repeticiones', 'peso', 'rpe'],
      enfasisTonelaje: true,
    });

    plantillas.push({
      id: 'fuerza-tonelaje',
      nombre: 'Fuerza - Enfoque en Tonelaje',
      descripcion: 'Plantilla optimizada para seguimiento de fuerza con énfasis en tonelaje total',
      columnas: ['tonelaje', 'series', 'repeticiones', 'rpe', 'intensidad'],
      calculos: ['tonelajeTotal', 'volumenTotal', 'rpePromedio'],
      resumenes: ['resumenSemanal', 'resumenPorModalidad'],
      razon: 'Basado en tu rol de fuerza y prioridad en tonelaje, esta plantilla incluye más columnas de tonelaje y cálculos de peso total.',
      relevancia,
      categoria: 'fuerza',
    });
  }

  // Plantilla 2: Hipertrofia con volumen
  if (
    respuestas.rol === 'hipertrofia' ||
    respuestas.prioridades.includes('volumen')
  ) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'hipertrofia',
      prioridades: ['volumen'],
      columnas: ['volumen', 'series', 'repeticiones', 'intensidad'],
      enfasisTonelaje: false,
    });

    plantillas.push({
      id: 'hipertrofia-volumen',
      nombre: 'Hipertrofia - Enfoque en Volumen',
      descripcion: 'Plantilla para crecimiento muscular con seguimiento de volumen y series',
      columnas: ['volumen', 'series', 'repeticiones', 'intensidad', 'duracion'],
      calculos: ['volumenTotal', 'intensidadPromedio'],
      resumenes: ['resumenSemanal', 'resumenDiario', 'resumenPorIntensidad'],
      razon: 'Perfecta para hipertrofia, con columnas de volumen y series para maximizar el crecimiento muscular.',
      relevancia,
      categoria: 'hipertrofia',
    });
  }

  // Plantilla 3: Cardio con duración y calorías
  if (
    respuestas.rol === 'cardio' ||
    respuestas.prioridades.includes('intensidad')
  ) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'cardio',
      prioridades: ['intensidad'],
      columnas: ['duracion', 'calorias', 'intensidad', 'rpe'],
      enfasisTonelaje: false,
    });

    plantillas.push({
      id: 'cardio-intensidad',
      nombre: 'Cardio - Enfoque en Intensidad',
      descripcion: 'Plantilla para entrenamiento cardiovascular con seguimiento de duración y calorías',
      columnas: ['duracion', 'calorias', 'intensidad', 'rpe'],
      calculos: ['caloriasEstimadas', 'intensidadPromedio', 'rpePromedio'],
      resumenes: ['resumenSemanal', 'resumenPorIntensidad'],
      razon: 'Ideal para cardio, con columnas de duración, calorías e intensidad para optimizar el entrenamiento cardiovascular.',
      relevancia,
      categoria: 'cardio',
    });
  }

  // Plantilla 4: Movilidad con menos columnas
  if (
    respuestas.rol === 'movilidad' ||
    respuestas.prioridades.includes('movilidad') ||
    respuestas.enfasisMovilidad
  ) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'movilidad',
      prioridades: ['movilidad'],
      columnas: ['movilidad', 'duracion', 'recuperacion'],
      enfasisMovilidad: true,
    });

    plantillas.push({
      id: 'movilidad-simplificada',
      nombre: 'Movilidad - Vista Simplificada',
      descripcion: 'Plantilla simplificada para movilidad con menos columnas y enfoque en flexibilidad',
      columnas: ['movilidad', 'duracion', 'recuperacion'],
      calculos: ['intensidadPromedio'],
      resumenes: ['resumenSemanal'],
      razon: 'Vista simplificada con menos columnas de movilidad, perfecta para entrenamientos de flexibilidad y movilidad.',
      relevancia,
      categoria: 'movilidad',
    });
  }

  // Plantilla 5: Recuperación
  if (
    respuestas.rol === 'rehabilitacion' ||
    respuestas.prioridades.includes('recuperacion') ||
    respuestas.enfasisRecuperacion
  ) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'rehabilitacion',
      prioridades: ['recuperacion'],
      columnas: ['recuperacion', 'duracion', 'intensidad'],
      enfasisRecuperacion: true,
    });

    plantillas.push({
      id: 'recuperacion',
      nombre: 'Recuperación y Rehabilitación',
      descripcion: 'Plantilla para seguimiento de recuperación y rehabilitación',
      columnas: ['recuperacion', 'duracion', 'intensidad', 'movilidad'],
      calculos: ['intensidadPromedio'],
      resumenes: ['resumenSemanal', 'resumenDiario'],
      razon: 'Enfoque en recuperación con columnas de descanso y movilidad para optimizar la rehabilitación.',
      relevancia,
      categoria: 'rehabilitacion',
    });
  }

  // Plantilla 6: General equilibrado
  if (respuestas.rol === 'general' || respuestas.prioridades.includes('equilibrio')) {
    const relevancia = calcularRelevancia(respuestas, {
      rol: 'general',
      prioridades: ['equilibrio'],
      columnas: ['volumen', 'intensidad', 'duracion', 'calorias'],
      enfasisTonelaje: false,
    });

    plantillas.push({
      id: 'general-equilibrado',
      nombre: 'General - Vista Equilibrada',
      descripcion: 'Plantilla equilibrada con columnas y cálculos generales',
      columnas: ['volumen', 'intensidad', 'duracion', 'calorias', 'rpe'],
      calculos: ['volumenTotal', 'intensidadPromedio', 'caloriasEstimadas'],
      resumenes: ['resumenSemanal', 'resumenPorModalidad'],
      razon: 'Vista equilibrada con columnas generales para un enfoque completo del entrenamiento.',
      relevancia,
      categoria: 'general',
    });
  }

  // Plantilla 7: Personalizada basada en columnas seleccionadas
  if (respuestas.columnasPreferidas.length > 0) {
    const relevancia = calcularRelevanciaPersonalizada(respuestas);

    plantillas.push({
      id: 'personalizada',
      nombre: 'Plantilla Personalizada',
      descripcion: 'Plantilla basada en tus columnas seleccionadas',
      columnas: respuestas.columnasPreferidas,
      calculos: Object.entries(respuestas.calculosNecesarios)
        .filter(([_, activo]) => activo)
        .map(([key]) => key),
      resumenes: Object.entries(respuestas.resumenesNecesarios)
        .filter(([_, activo]) => activo)
        .map(([key]) => key),
      razon: 'Plantilla personalizada basada exactamente en tus preferencias de columnas, cálculos y resúmenes.',
      relevancia,
      categoria: respuestas.rol,
    });
  }

  // Ordenar por relevancia descendente
  return plantillas.sort((a, b) => b.relevancia - a.relevancia);
}

/**
 * Calcula la relevancia de una plantilla basada en las respuestas
 */
function calcularRelevancia(
  respuestas: RespuestasCuestionario,
  criterios: {
    rol?: string;
    prioridades?: string[];
    columnas?: TipoColumnas[];
    enfasisTonelaje?: boolean;
    enfasisMovilidad?: boolean;
    enfasisRecuperacion?: boolean;
  }
): number {
  let relevancia = 0;

  // Match de rol (40 puntos)
  if (criterios.rol && respuestas.rol === criterios.rol) {
    relevancia += 40;
  }

  // Match de prioridades (30 puntos)
  if (criterios.prioridades) {
    const matches = criterios.prioridades.filter((p) =>
      respuestas.prioridades.includes(p as any)
    ).length;
    relevancia += (matches / criterios.prioridades.length) * 30;
  }

  // Match de columnas (20 puntos)
  if (criterios.columnas) {
    const matches = criterios.columnas.filter((c) =>
      respuestas.columnasPreferidas.includes(c)
    ).length;
    relevancia += (matches / criterios.columnas.length) * 20;
  }

  // Match de énfasis (10 puntos)
  if (criterios.enfasisTonelaje && respuestas.enfasisTonelaje) {
    relevancia += 10;
  }
  if (criterios.enfasisMovilidad && respuestas.enfasisMovilidad) {
    relevancia += 10;
  }
  if (criterios.enfasisRecuperacion && respuestas.enfasisRecuperacion) {
    relevancia += 10;
  }

  return Math.min(100, Math.round(relevancia));
}

/**
 * Calcula relevancia para plantilla personalizada
 */
function calcularRelevanciaPersonalizada(respuestas: RespuestasCuestionario): number {
  let relevancia = 50; // Base para personalizada

  // Más columnas seleccionadas = más relevante
  if (respuestas.columnasPreferidas.length >= 5) {
    relevancia += 20;
  } else if (respuestas.columnasPreferidas.length >= 3) {
    relevancia += 10;
  }

  // Más cálculos activos = más relevante
  const calculosActivos = Object.values(respuestas.calculosNecesarios).filter((v) => v).length;
  relevancia += calculosActivos * 5;

  // Más resúmenes activos = más relevante
  const resumenesActivos = Object.values(respuestas.resumenesNecesarios).filter((v) => v).length;
  relevancia += resumenesActivos * 5;

  return Math.min(100, relevancia);
}

