import {
  SessionSuggestion,
  SessionSuggestionFactors,
  SessionSuggestionConfig,
  SessionSuggestionResponse,
} from '../types/session-suggestions';

// Mock data storage
const MOCK_SUGGESTIONS: Map<string, SessionSuggestion[]> = new Map();
const MOCK_CONFIGS: Map<string, SessionSuggestionConfig> = new Map();

// Inicializar configuración por defecto
const getDefaultConfig = (entrenadorId: string): SessionSuggestionConfig => ({
  entrenadorId,
  activarSugerenciasAutomaticas: true,
  frecuenciaSugerencias: 'semanal',
  considerarProgreso: true,
  considerarDescanso: true,
  considerarObjetivos: true,
  considerarLesiones: true,
  considerarPreferencias: true,
  nivelVariedad: 'medio',
  nivelProgresion: 'moderado',
});

/**
 * Genera sugerencias automáticas de sesiones para un cliente
 */
export const generateSessionSuggestions = async (
  clienteId: string,
  entrenadorId: string
): Promise<SessionSuggestionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener o crear configuración
  let config = MOCK_CONFIGS.get(entrenadorId);
  if (!config) {
    config = getDefaultConfig(entrenadorId);
    MOCK_CONFIGS.set(entrenadorId, config);
  }

  // Si las sugerencias automáticas están desactivadas, retornar vacío
  if (!config.activarSugerenciasAutomaticas) {
    return {
      sugerencias: [],
      factores: await getSessionFactors(clienteId),
      configuracion: config,
      resumen: {
        totalSugerencias: 0,
        prioridadAlta: 0,
        prioridadMedia: 0,
        prioridadBaja: 0,
      },
    };
  }

  // Obtener factores del cliente
  const factores = await getSessionFactors(clienteId);

  // Generar sugerencias basadas en los factores
  const sugerencias: SessionSuggestion[] = [];

  // Sugerencia 1: Basada en el último entrenamiento y progreso
  if (factores.ultimaSesion) {
    const diasDesdeUltimaSesion = factores.descanso.diasDesdeUltimaSesion;
    const necesitaRecuperacion = factores.descanso.necesitaRecuperacion;

    if (necesitaRecuperacion && diasDesdeUltimaSesion < 3) {
      // Sesión de recuperación
      sugerencias.push({
        id: `sug-${Date.now()}-1`,
        clienteId,
        entrenadorId,
        tipo: 'recuperacion',
        nombre: 'Sesión de Recuperación Activa',
        descripcion: 'Sesión ligera para promover la recuperación muscular',
        duracionMinutos: 30,
        ejercicios: [
          { nombre: 'Caminata suave', duracion: 10, notas: 'Ritmo cómodo' },
          { nombre: 'Estiramientos dinámicos', duracion: 10, notas: 'Enfoque en grupos musculares trabajados' },
          { nombre: 'Foam rolling', duracion: 10, notas: 'Liberación miofascial' },
        ],
        razon: 'Tu última sesión fue intensa y necesitas tiempo de recuperación',
        prioridad: 'alta',
        confianza: 85,
        factores: [
          {
            tipo: 'descanso',
            descripcion: `Han pasado ${diasDesdeUltimaSesion} días desde tu última sesión`,
            impacto: 'alto',
          },
          {
            tipo: 'progreso',
            descripcion: 'Fatiga estimada: alta',
            impacto: 'medio',
          },
        ],
        fechaSugerida: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        fechaCreacion: new Date().toISOString(),
      });
    } else if (diasDesdeUltimaSesion >= 2) {
      // Sugerencia basada en el tipo de última sesión
      const ultimoTipo = factores.ultimaSesion.tipo;
      let siguienteTipo: SessionSuggestion['tipo'] = 'fuerza';

      if (ultimoTipo === 'fuerza') {
        siguienteTipo = factores.progreso.tendencia === 'mejorando' ? 'fuerza' : 'cardio';
      } else if (ultimoTipo === 'cardio') {
        siguienteTipo = 'fuerza';
      } else {
        siguienteTipo = 'mixto';
      }

      const ejercicios = generateExercisesForType(siguienteTipo, factores);

      sugerencias.push({
        id: `sug-${Date.now()}-2`,
        clienteId,
        entrenadorId,
        tipo: siguienteTipo,
        nombre: `Sesión de ${siguienteTipo.charAt(0).toUpperCase() + siguienteTipo.slice(1)}`,
        descripcion: `Sesión recomendada basada en tu progreso y última actividad`,
        duracionMinutos: 60,
        ejercicios,
        razon: `Tu última sesión fue de ${ultimoTipo}, es momento de variar y continuar progresando`,
        prioridad: diasDesdeUltimaSesion > 3 ? 'alta' : 'media',
        confianza: 75,
        factores: [
          {
            tipo: 'historial',
            descripcion: `Última sesión: ${ultimoTipo} hace ${diasDesdeUltimaSesion} días`,
            impacto: 'alto',
          },
          {
            tipo: 'progreso',
            descripcion: `Tendencia: ${factores.progreso.tendencia}`,
            impacto: 'medio',
          },
        ],
        fechaSugerida: new Date().toISOString().split('T')[0],
        fechaCreacion: new Date().toISOString(),
      });
    }
  }

  // Sugerencia 2: Basada en objetivos
  if (factores.objetivos.length > 0) {
    const objetivoPrincipal = factores.objetivos.sort((a, b) => b.prioridad - a.prioridad)[0];
    const progresoObjetivo = objetivoPrincipal.progreso;

    if (progresoObjetivo < 80) {
      // El objetivo necesita más trabajo
      let tipoSesion: SessionSuggestion['tipo'] = 'fuerza';
      if (objetivoPrincipal.tipo === 'cardio') tipoSesion = 'cardio';
      else if (objetivoPrincipal.tipo === 'flexibilidad') tipoSesion = 'flexibilidad';
      else if (objetivoPrincipal.tipo === 'perdida-peso') tipoSesion = 'hiit';

      const ejercicios = generateExercisesForObjective(objetivoPrincipal.tipo, factores);

      sugerencias.push({
        id: `sug-${Date.now()}-3`,
        clienteId,
        entrenadorId,
        tipo: tipoSesion,
        nombre: `Sesión para: ${objetivoPrincipal.nombre}`,
        descripcion: `Enfocada en avanzar hacia tu objetivo principal`,
        duracionMinutos: 60,
        ejercicios,
        razon: `Tu objetivo "${objetivoPrincipal.nombre}" está al ${progresoObjetivo}% de completarse`,
        prioridad: progresoObjetivo < 50 ? 'alta' : 'media',
        confianza: 80,
        factores: [
          {
            tipo: 'objetivo',
            descripcion: `Objetivo: ${objetivoPrincipal.nombre} (${progresoObjetivo}% completado)`,
            impacto: 'alto',
          },
        ],
        fechaSugerida: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        fechaCreacion: new Date().toISOString(),
      });
    }
  }

  // Sugerencia 3: Basada en frecuencia
  if (factores.frecuencia.sesionesEstaSemana < factores.frecuencia.sesionesObjetivoSemana) {
    const sesionesFaltantes = factores.frecuencia.sesionesObjetivoSemana - factores.frecuencia.sesionesEstaSemana;

    sugerencias.push({
      id: `sug-${Date.now()}-4`,
      clienteId,
      entrenadorId,
      tipo: 'mixto',
      nombre: 'Sesión de Mantenimiento',
      descripcion: 'Sesión equilibrada para mantener la consistencia semanal',
      duracionMinutos: 45,
      ejercicios: [
        { nombre: 'Calentamiento', duracion: 5, notas: 'Movilidad general' },
        { nombre: 'Circuito funcional', series: 3, repeticiones: 12, descanso: 30, notas: 'Ejercicios compuestos' },
        { nombre: 'Cardio ligero', duracion: 15, notas: 'Ritmo moderado' },
        { nombre: 'Estiramientos', duracion: 10, notas: 'Enfriamiento' },
      ],
      razon: `Te faltan ${sesionesFaltantes} sesión(es) para alcanzar tu objetivo semanal`,
      prioridad: sesionesFaltantes >= 2 ? 'alta' : 'media',
      confianza: 70,
      factores: [
        {
          tipo: 'historial',
          descripcion: `${factores.frecuencia.sesionesEstaSemana}/${factores.frecuencia.sesionesObjetivoSemana} sesiones esta semana`,
          impacto: 'alto',
        },
      ],
      fechaSugerida: new Date().toISOString().split('T')[0],
      fechaCreacion: new Date().toISOString(),
    });
  }

  // Guardar sugerencias
  MOCK_SUGGESTIONS.set(clienteId, sugerencias);

  // Ordenar por prioridad
  sugerencias.sort((a, b) => {
    const prioridadOrder = { alta: 3, media: 2, baja: 1 };
    return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
  });

  const resumen = {
    totalSugerencias: sugerencias.length,
    prioridadAlta: sugerencias.filter(s => s.prioridad === 'alta').length,
    prioridadMedia: sugerencias.filter(s => s.prioridad === 'media').length,
    prioridadBaja: sugerencias.filter(s => s.prioridad === 'baja').length,
    proximaSugerencia: sugerencias[0],
  };

  return {
    sugerencias,
    factores,
    configuracion: config,
    resumen,
  };
};

/**
 * Obtiene los factores que influyen en las sugerencias de sesiones
 */
export const getSessionFactors = async (clienteId: string): Promise<SessionSuggestionFactors> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock data - en producción esto vendría de la base de datos
  return {
    clienteId,
    ultimaSesion: {
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tipo: 'fuerza',
      ejercicios: ['Press banca', 'Sentadillas', 'Remo'],
      intensidad: 8,
    },
    historialReciente: [
      {
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tipo: 'fuerza',
        completada: true,
      },
      {
        fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tipo: 'cardio',
        completada: true,
      },
      {
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tipo: 'fuerza',
        completada: true,
      },
    ],
    progreso: {
      mejoraFuerza: 15,
      mejoraCardio: 10,
      mejoraFlexibilidad: 5,
      tendencia: 'mejorando' as const,
    },
    objetivos: [
      {
        id: 'obj1',
        nombre: 'Aumentar fuerza en press banca',
        tipo: 'fuerza',
        prioridad: 5,
        progreso: 65,
      },
      {
        id: 'obj2',
        nombre: 'Mejorar resistencia cardiovascular',
        tipo: 'cardio',
        prioridad: 3,
        progreso: 45,
      },
    ],
    preferencias: {
      tiposPreferidos: ['fuerza', 'mixto'],
      ejerciciosFavoritos: ['Press banca', 'Sentadillas', 'Peso muerto'],
      ejerciciosEvitados: ['Burpees', 'Mountain climbers'],
      horariosPreferidos: ['mañana', 'tarde'],
    },
    restricciones: {
      lesiones: [],
      limitaciones: [],
    },
    descanso: {
      diasDesdeUltimaSesion: 2,
      fatigaEstimada: 3,
      necesitaRecuperacion: false,
    },
    frecuencia: {
      sesionesEstaSemana: 2,
      sesionesObjetivoSemana: 4,
      promedioSemanal: 3.5,
    },
  };
};

/**
 * Genera ejercicios para un tipo de sesión
 */
const generateExercisesForType = (
  tipo: SessionSuggestion['tipo'],
  factores: SessionSuggestionFactors
): SessionSuggestion['ejercicios'] => {
  switch (tipo) {
    case 'fuerza':
      return [
        { nombre: 'Calentamiento', duracion: 5, notas: 'Movilidad y activación' },
        { nombre: 'Press banca', series: 4, repeticiones: 8, peso: 0, descanso: 90, notas: 'Aumentar peso si es posible' },
        { nombre: 'Sentadillas', series: 4, repeticiones: 10, peso: 0, descanso: 90, notas: 'Forma perfecta' },
        { nombre: 'Remo con barra', series: 3, repeticiones: 10, peso: 0, descanso: 60, notas: 'Controlar el movimiento' },
        { nombre: 'Peso muerto', series: 3, repeticiones: 8, peso: 0, descanso: 120, notas: 'Técnica primero' },
        { nombre: 'Estiramientos', duracion: 10, notas: 'Enfriamiento' },
      ];
    case 'cardio':
      return [
        { nombre: 'Calentamiento', duracion: 5, notas: 'Activación cardiovascular' },
        { nombre: 'Correr', duracion: 20, notas: 'Ritmo constante' },
        { nombre: 'Bicicleta', duracion: 15, notas: 'Intensidad moderada' },
        { nombre: 'Estiramientos', duracion: 10, notas: 'Enfriamiento' },
      ];
    case 'hiit':
      return [
        { nombre: 'Calentamiento', duracion: 5, notas: 'Activación' },
        { nombre: 'Burpees', series: 4, repeticiones: 10, descanso: 30, notas: 'Alta intensidad' },
        { nombre: 'Mountain climbers', series: 4, duracion: 30, descanso: 30, notas: 'Ritmo rápido' },
        { nombre: 'Jumping jacks', series: 4, repeticiones: 20, descanso: 20, notas: 'Máxima intensidad' },
        { nombre: 'Estiramientos', duracion: 10, notas: 'Recuperación' },
      ];
    case 'flexibilidad':
      return [
        { nombre: 'Calentamiento ligero', duracion: 5, notas: 'Movilidad suave' },
        { nombre: 'Estiramientos estáticos', duracion: 20, notas: 'Mantener 30-60 segundos por estiramiento' },
        { nombre: 'Yoga flow', duracion: 20, notas: 'Movimientos fluidos' },
        { nombre: 'Relajación', duracion: 5, notas: 'Respiración profunda' },
      ];
    case 'mixto':
      return [
        { nombre: 'Calentamiento', duracion: 5, notas: 'Activación general' },
        { nombre: 'Circuito fuerza', series: 3, repeticiones: 12, descanso: 45, notas: 'Ejercicios compuestos' },
        { nombre: 'Cardio intermedio', duracion: 15, notas: 'Intensidad moderada' },
        { nombre: 'Estiramientos', duracion: 10, notas: 'Enfriamiento' },
      ];
    case 'recuperacion':
      return [
        { nombre: 'Caminata suave', duracion: 10, notas: 'Ritmo cómodo' },
        { nombre: 'Estiramientos dinámicos', duracion: 10, notas: 'Movilidad' },
        { nombre: 'Foam rolling', duracion: 10, notas: 'Liberación miofascial' },
        { nombre: 'Relajación', duracion: 10, notas: 'Respiración' },
      ];
    default:
      return [];
  }
};

/**
 * Genera ejercicios para un objetivo específico
 */
const generateExercisesForObjective = (
  tipoObjetivo: string,
  factores: SessionSuggestionFactors
): SessionSuggestion['ejercicios'] => {
  switch (tipoObjetivo) {
    case 'fuerza':
      return generateExercisesForType('fuerza', factores);
    case 'cardio':
      return generateExercisesForType('cardio', factores);
    case 'flexibilidad':
      return generateExercisesForType('flexibilidad', factores);
    case 'perdida-peso':
      return generateExercisesForType('hiit', factores);
    case 'ganancia-masa':
      return generateExercisesForType('fuerza', factores);
    default:
      return generateExercisesForType('mixto', factores);
  }
};

/**
 * Obtiene las sugerencias de sesiones para un cliente
 */
export const getSessionSuggestions = async (
  clienteId: string,
  entrenadorId: string
): Promise<SessionSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const sugerencias = MOCK_SUGGESTIONS.get(clienteId) || [];
  return sugerencias.filter(s => !s.rechazada && !s.aceptada);
};

/**
 * Acepta una sugerencia de sesión
 */
export const acceptSuggestion = async (
  sugerenciaId: string,
  clienteId: string,
  sesionCreadaId?: string
): Promise<SessionSuggestion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const sugerencias = MOCK_SUGGESTIONS.get(clienteId) || [];
  const sugerencia = sugerencias.find(s => s.id === sugerenciaId);

  if (!sugerencia) {
    throw new Error('Sugerencia no encontrada');
  }

  sugerencia.aceptada = true;
  sugerencia.fechaAceptacion = new Date().toISOString();
  if (sesionCreadaId) {
    sugerencia.sesionCreadaId = sesionCreadaId;
  }

  MOCK_SUGGESTIONS.set(clienteId, sugerencias);

  return sugerencia;
};

/**
 * Rechaza una sugerencia de sesión
 */
export const rejectSuggestion = async (
  sugerenciaId: string,
  clienteId: string
): Promise<SessionSuggestion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const sugerencias = MOCK_SUGGESTIONS.get(clienteId) || [];
  const sugerencia = sugerencias.find(s => s.id === sugerenciaId);

  if (!sugerencia) {
    throw new Error('Sugerencia no encontrada');
  }

  sugerencia.rechazada = true;
  sugerencia.fechaRechazo = new Date().toISOString();

  MOCK_SUGGESTIONS.set(clienteId, sugerencias);

  return sugerencia;
};

/**
 * Obtiene o actualiza la configuración de sugerencias
 */
export const getSuggestionConfig = async (entrenadorId: string): Promise<SessionSuggestionConfig> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  let config = MOCK_CONFIGS.get(entrenadorId);
  if (!config) {
    config = getDefaultConfig(entrenadorId);
    MOCK_CONFIGS.set(entrenadorId, config);
  }

  return config;
};

/**
 * Actualiza la configuración de sugerencias
 */
export const updateSuggestionConfig = async (
  entrenadorId: string,
  updates: Partial<SessionSuggestionConfig>
): Promise<SessionSuggestionConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let config = MOCK_CONFIGS.get(entrenadorId);
  if (!config) {
    config = getDefaultConfig(entrenadorId);
  }

  config = { ...config, ...updates };
  MOCK_CONFIGS.set(entrenadorId, config);

  return config;
};

