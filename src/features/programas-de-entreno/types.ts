// User Story 2: Tipos de entrenamiento y grupos musculares
export type TipoEntrenamiento = 'fuerza' | 'cardio' | 'hiit' | 'flexibilidad' | 'mixto' | 'recuperacion' | 'resistencia' | 'movilidad';
export type GrupoMuscular = 'pecho' | 'espalda' | 'hombros' | 'brazos' | 'piernas' | 'gluteos' | 'core' | 'full-body' | 'cardio' | 'movilidad';

export type DaySession = {
  id: string;
  time: string;
  block: string;
  duration: string;
  modality: string;
  intensity: string;
  notes: string;
  tags?: string[]; // Tags para activar reglas basadas en condiciones dinámicas
  // User Story 2: Información de tipo de entrenamiento y grupo muscular
  tipoEntrenamiento?: TipoEntrenamiento;
  gruposMusculares?: GrupoMuscular[];
  // User Story: Edición inline - series y repeticiones
  series?: number;
  repeticiones?: string;
  // User Story: Modo de edición completa - campos avanzados
  peso?: number; // Peso en kg
  tempo?: string; // Tempo del ejercicio (ej: "3-1-1", "4-0-2")
  descanso?: number; // Descanso en segundos
  materialAlternativo?: string; // Material alternativo disponible
  fechaSesion?: string; // Fecha de la sesión para comparación
};

export type DayPlan = {
  microCycle: string;
  focus: string;
  volume: string;
  intensity: string;
  restorative: string;
  summary: string[];
  sessions: DaySession[];
  targetDuration?: number; // Objetivo de duración en minutos
  targetCalories?: number; // Objetivo de calorías
  tags?: string[]; // Tags para activar reglas basadas en condiciones dinámicas
};

// Tipo para ejercicios con tags
export type Exercise = {
  id: string;
  name: string;
  tags?: string[]; // Tags para activar reglas basadas en condiciones dinámicas
};

// User Story 1: Contexto del Cliente - Datos biométricos, lesiones, hábitos, material y cronotipo
export type Cronotipo = 'matutino' | 'vespertino' | 'indiferente';

export interface DatosBiometricos {
  peso?: {
    valor: number; // kg
    fecha: string;
    tendencia?: 'subiendo' | 'bajando' | 'estable';
  };
  altura?: number; // cm
  imc?: number;
  grasaCorporal?: {
    porcentaje: number;
    fecha: string;
  };
  masaMuscular?: {
    kg: number;
    fecha: string;
  };
  medidas?: {
    cintura?: number; // cm
    cadera?: number; // cm
    pecho?: number; // cm
    brazo?: number; // cm
    muslo?: number; // cm
    fecha: string;
  };
  frecuenciaCardiaca?: {
    reposo: number; // bpm
    maxima: number; // bpm
  };
  vo2Max?: number;
}

export interface Lesion {
  id: string;
  nombre: string;
  ubicacion: string;
  severidad: 'leve' | 'moderada' | 'grave';
  fechaInicio: string;
  fechaRecuperacion?: string;
  estado: 'activa' | 'recuperada' | 'cronica';
  restricciones: string[];
  notas?: string;
}

export interface HabitoCliente {
  id: string;
  nombre: string;
  tipo: 'rutina-semanal' | 'consistencia' | 'nutricion' | 'sueño' | 'otro';
  objetivo: number;
  unidad: string;
  cumplimiento: number; // 0-100
  activo: boolean;
}

export interface DisponibilidadMaterial {
  material: string;
  disponible: boolean;
  ubicacion?: string;
  notas?: string;
}

export interface ContextoCliente {
  clienteId: string;
  clienteNombre: string;
  datosBiometricos: DatosBiometricos;
  lesiones: Lesion[];
  habitos: HabitoCliente[];
  disponibilidadMaterial: DisponibilidadMaterial[];
  cronotipo: Cronotipo;
  ultimaActualizacion: string;
}

// User Story 2: Objetivos y Progreso - Objetivos a corto, medio y largo plazo con métricas
export type HorizonteObjetivo = 'corto' | 'medio' | 'largo';
export type EstadoObjetivo = 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';

export interface ObjetivoCliente {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: 'fitness' | 'nutricion' | 'salud' | 'peso' | 'fuerza' | 'resistencia' | 'otro';
  horizonte: HorizonteObjetivo;
  valorObjetivo: number;
  valorActual: number;
  unidad: string;
  fechaLimite: string;
  estado: EstadoObjetivo;
  progreso: number; // 0-100
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MetricaProgreso {
  id: string;
  nombre: string;
  categoria: string;
  valorActual: number;
  valorAnterior?: number;
  cambio?: number;
  cambioPorcentual?: number;
  unidad: string;
  tendencia: 'up' | 'down' | 'neutral';
  fecha: string;
}

export interface ResumenObjetivosProgreso {
  clienteId: string;
  clienteNombre: string;
  objetivos: ObjetivoCliente[];
  metricas: MetricaProgreso[];
  resumen: {
    totalObjetivos: number;
    objetivosCortoPlazo: number;
    objetivosMedioPlazo: number;
    objetivosLargoPlazo: number;
    objetivosEnProgreso: number;
    objetivosCompletados: number;
    objetivosEnRiesgo: number;
    progresoPromedio: number; // 0-100
  };
  ultimaActualizacion: string;
}

// User Story 1: Alertas Activas - Dolores, contraindicaciones, incidencias recientes
export type TipoAlerta = 'dolor' | 'contraindicacion' | 'incidencia';
export type NivelPrioridad = 'critica' | 'alta' | 'media' | 'baja';

export interface AlertaActiva {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descripcion: string;
  prioridad: NivelPrioridad;
  clienteId: string;
  clienteNombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  relacionadoCon?: {
    tipo: 'lesion' | 'ejercicio' | 'sesion' | 'checkin';
    id: string;
    nombre?: string;
  };
  ejerciciosRiesgosos?: string[]; // Ejercicios que deben evitarse
  recomendaciones?: string[];
  resuelta: boolean;
  resueltaEn?: string;
}

// User Story 2: Timeline de Sesiones, Feedback y Resultados
export type TipoEventoTimeline = 'sesion' | 'feedback' | 'resultado' | 'checkin' | 'objetivo';

export interface EventoTimeline {
  id: string;
  tipo: TipoEventoTimeline;
  fecha: string;
  titulo: string;
  descripcion?: string;
  clienteId: string;
  clienteNombre: string;
  metadata?: {
    // Para sesiones
    sesionId?: string;
    duracionMinutos?: number;
    ejerciciosCompletados?: number;
    ejerciciosTotales?: number;
    programaId?: string;
    programaNombre?: string;
    // User Story 2: Tipo de entrenamiento y grupos musculares
    tipoEntrenamiento?: TipoEntrenamiento;
    gruposMusculares?: GrupoMuscular[];
    // Para feedback
    puntuacion?: number;
    comentarios?: string;
    tipoFeedback?: 'post-sesion' | 'semanal' | 'mensual' | 'nps';
    // Para resultados
    metrica?: string;
    valorAnterior?: number;
    valorActual?: number;
    unidad?: string;
    // Para check-ins
    checkInId?: string;
    tipoCheckIn?: 'entreno' | 'nutricion' | 'bienestar';
    // Para objetivos
    objetivoId?: string;
    estadoObjetivo?: EstadoObjetivo;
  };
}

export interface TimelineSesiones {
  clienteId: string;
  clienteNombre: string;
  eventos: EventoTimeline[];
  resumen: {
    totalSesiones: number;
    sesionesCompletadas: number;
    sesionesPendientes: number;
    promedioAdherencia: number; // 0-100
    promedioFeedback: number; // 0-10
    ultimaSesion?: string;
    patronesDetectados?: {
      tipo: 'adherencia' | 'fatiga' | 'progreso' | 'riesgo';
      descripcion: string;
      severidad: 'alta' | 'media' | 'baja';
    }[];
  };
  ultimaActualizacion: string;
}

// User Story 1: Reglas Encadenadas con Condicionales
export type OperadorLogico = 'AND' | 'OR';
export type TipoCondicionAvanzada = 
  | 'lesion' 
  | 'patron' 
  | 'modalidad' 
  | 'intensidad' 
  | 'duracion' 
  | 'equipamiento' 
  | 'tag'
  | 'peso_cliente'
  | 'imc'
  | 'adherencia'
  | 'progreso'
  | 'dias_semana'
  | 'hora_dia';

export type OperadorComparacion = 
  | 'contiene' 
  | 'igual' 
  | 'no_contiene' 
  | 'mayor_que' 
  | 'menor_que' 
  | 'mayor_igual' 
  | 'menor_igual'
  | 'entre'
  | 'tiene_tag'
  | 'no_tiene_tag';

export type TipoModificacion = 'duracion' | 'intensidad' | 'modalidad' | 'notas';
export type TipoAccionModificacion = 'establecer' | 'aumentar' | 'disminuir' | 'multiplicar' | 'limitar';

export interface CondicionAvanzada {
  id: string;
  tipo: TipoCondicionAvanzada;
  operador: OperadorComparacion;
  valor: string | number; // Valor a comparar
  valor2?: number; // Para operador 'entre'
  operadorLogico?: OperadorLogico; // AND/OR con la siguiente condición
}

export interface LimiteModificacion {
  tipo: TipoModificacion;
  minimo?: string | number;
  maximo?: string | number;
}

export interface AccionModificacion {
  tipo: TipoModificacion;
  accion: TipoAccionModificacion;
  valor: string | number; // Valor a establecer, incremento, factor, etc.
  limites?: LimiteModificacion; // Límites para la modificación
}

export interface ReglaEncadenada {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  condiciones: CondicionAvanzada[]; // Condiciones encadenadas con AND/OR
  acciones: AccionModificacion[]; // Múltiples acciones a aplicar
  prioridad: number; // 1-10, mayor número = mayor prioridad
  programaId?: string; // Si es específica de un programa
  clienteId?: string; // Si es específica de un cliente
  fechaCreacion: string;
  fechaActualizacion: string;
}

// User Story 2: Automatizaciones Recurrentes
export type FrecuenciaRecurrencia = 
  | 'diaria' 
  | 'semanal' 
  | 'mensual' 
  | 'personalizada';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export type TipoAccionAutomatizacion = 
  | 'recalcular_objetivos'
  | 'refrescar_finisher'
  | 'actualizar_intensidad'
  | 'ajustar_volumen'
  | 'aplicar_reglas'
  | 'enviar_recordatorio'
  | 'generar_reporte'
  | 'personalizada';

export interface ConfiguracionRecurrencia {
  frecuencia: FrecuenciaRecurrencia;
  diaSemana?: DiaSemana; // Para frecuencia semanal
  diaMes?: number; // Para frecuencia mensual (1-31)
  hora?: string; // Formato HH:mm
  intervalo?: number; // Para personalizada (cada X días)
  fechaInicio?: string; // ISO date
  fechaFin?: string; // ISO date (opcional)
}

export interface AccionAutomatizacion {
  tipo: TipoAccionAutomatizacion;
  parametros?: Record<string, any>; // Parámetros específicos de la acción
  programaId?: string;
  clienteId?: string;
}

export interface AutomatizacionRecurrente {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  configuracion: ConfiguracionRecurrencia;
  acciones: AccionAutomatizacion[];
  ultimaEjecucion?: string;
  proximaEjecucion?: string;
  totalEjecuciones: number;
  errores: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: string;
}

// User Story 1: Simulación de Reglas con Métricas
export interface MetricasPrograma {
  volumenTotal: number; // Total de series o ejercicios
  caloriasTotales: number; // Calorías estimadas
  duracionTotal: number; // Duración total en minutos
  balanceIntensidades: {
    baja: number; // Porcentaje de sesiones con intensidad baja
    media: number; // Porcentaje de sesiones con intensidad media
    alta: number; // Porcentaje de sesiones con intensidad alta
  };
  distribucionModalidades: Record<string, number>; // Modalidad -> cantidad de sesiones
  sesionesPorDia: Record<string, number>; // Día -> cantidad de sesiones
}

export interface ResultadoSimulacion {
  programaOriginal: Record<string, DayPlan>;
  programaSimulado: Record<string, DayPlan>;
  metricasOriginales: MetricasPrograma;
  metricasSimuladas: MetricasPrograma;
  diferencias: {
    volumenTotal: number;
    caloriasTotales: number;
    duracionTotal: number;
    balanceIntensidades: {
      baja: number;
      media: number;
      alta: number;
    };
  };
  reglasAplicadas: Array<{
    reglaId: string;
    reglaNombre: string;
    sesionesModificadas: number;
  }>;
  fechaSimulacion: string;
}

// User Story 2: Presets de Automatizaciones
export interface PresetAutomatizacion {
  id: string;
  nombre: string;
  descripcion: string;
  version: string; // Formato: "1.0.0"
  reglasEncadenadas: string[]; // IDs de reglas encadenadas
  automatizacionesRecurrentes: string[]; // IDs de automatizaciones recurrentes
  tags: string[]; // Tags para categorizar
  categoria?: string; // Categoría del preset
  publico: boolean; // Si es compartible con otros entrenadores
  compartidoCon: string[]; // IDs de usuarios con los que se ha compartido
  creadoPor: string; // ID del usuario creador
  creadoPorNombre: string; // Nombre del usuario creador
  fechaCreacion: string;
  fechaActualizacion: string;
  versionesAnteriores?: string[]; // IDs de versiones anteriores
  estadisticas?: {
    vecesUsado: number;
    vecesCompartido: number;
    rating?: number; // 1-5
  };
}

export interface VersionPreset {
  id: string;
  presetId: string;
  version: string;
  cambios: string; // Descripción de cambios en esta versión
  fechaCreacion: string;
  creadoPor: string;
  datos: Omit<PresetAutomatizacion, 'id' | 'version' | 'versionesAnteriores' | 'fechaCreacion' | 'fechaActualizacion'>;
}

// User Story: Comparación de ejercicios con sesión anterior
export type TipoCambio = 'mejora' | 'retroceso' | 'sin_cambio';

export interface ComparacionEjercicio {
  ejercicioId: string;
  ejercicioNombre: string;
  sesionActual: DaySession;
  sesionAnterior?: DaySession;
  cambios: {
    series?: { actual: number; anterior?: number; tipo: TipoCambio };
    repeticiones?: { actual: string; anterior?: string; tipo: TipoCambio };
    peso?: { actual?: number; anterior?: number; tipo: TipoCambio; cambioPorcentual?: number };
    tempo?: { actual?: string; anterior?: string; tipo: TipoCambio };
    descanso?: { actual?: number; anterior?: number; tipo: TipoCambio; cambioPorcentual?: number };
    materialAlternativo?: { actual?: string; anterior?: string; tipo: TipoCambio };
  };
  resumen: {
    tieneMejoras: boolean;
    tieneRetrocesos: boolean;
    mejorasDestacadas: string[];
    retrocesosDestacados: string[];
  };
}

// User Story: Historial de sesiones para comparación
export interface SesionHistorica {
  id: string;
  fecha: string;
  dayPlan: DayPlan;
  clienteId?: string;
}

// User Story: Preferencias del Coach para Vista Excel
export type FrecuenciaRevision = 'diaria' | 'semanal' | 'mensual' | 'por-programa';
export type NivelDetalle = 'basico' | 'intermedio' | 'avanzado' | 'completo';

export interface MetricasClave {
  volumen: boolean;
  intensidad: boolean;
  duracion: boolean;
  calorias: boolean;
  series: boolean;
  repeticiones: boolean;
  peso: boolean;
  rpe: boolean;
  frecuencia: boolean;
  adherencia: boolean;
  progreso: boolean;
}

export interface PreferenciasCoachExcel {
  id: string;
  coachId: string;
  metricasClave: MetricasClave;
  frecuenciaRevision: FrecuenciaRevision;
  nivelDetalle: NivelDetalle;
  columnasPersonalizadas: string[]; // IDs de columnas adicionales
  ordenColumnas: string[]; // Orden preferido de columnas
  mostrarGraficos: boolean;
  mostrarTotales: boolean;
  mostrarPromedios: boolean;
  formatoNumerico: 'decimal' | 'entero' | 'porcentaje';
  fechaCreacion: string;
  fechaActualizacion: string;
}

// User Story: Cuestionario de configuración de layout y plantillas
export type RolCoach = 'fuerza' | 'hipertrofia' | 'cardio' | 'movilidad' | 'general' | 'rehabilitacion';
export type PrioridadCoach = 'tonelaje' | 'volumen' | 'intensidad' | 'movilidad' | 'recuperacion' | 'equilibrio';
export type TipoColumnas = 'tonelaje' | 'volumen' | 'intensidad' | 'movilidad' | 'recuperacion' | 'duracion' | 'calorias' | 'rpe' | 'series' | 'repeticiones';

export interface RespuestasCuestionario {
  rol: RolCoach;
  prioridades: PrioridadCoach[];
  columnasPreferidas: TipoColumnas[];
  enfasisTonelaje: boolean;
  enfasisMovilidad: boolean;
  enfasisRecuperacion: boolean;
  calculosNecesarios: {
    tonelajeTotal: boolean;
    volumenTotal: boolean;
    intensidadPromedio: boolean;
    caloriasEstimadas: boolean;
    rpePromedio: boolean;
  };
  resumenesNecesarios: {
    resumenSemanal: boolean;
    resumenDiario: boolean;
    resumenPorModalidad: boolean;
    resumenPorIntensidad: boolean;
  };
  fechaCompletado?: string;
  fechaUltimaModificacion?: string;
}

export interface PlantillaRecomendada {
  id: string;
  nombre: string;
  descripcion: string;
  columnas: TipoColumnas[];
  calculos: string[];
  resumenes: string[];
  razon: string; // Por qué se recomienda esta plantilla
  relevancia: number; // 0-100, qué tan relevante es para las respuestas
  icono?: string;
  categoria: 'fuerza' | 'hipertrofia' | 'cardio' | 'movilidad' | 'general' | 'rehabilitacion';
}

// User Story 1: Notas, Acuerdos y Recordatorios
export type TipoNota = 'nota' | 'acuerdo' | 'recordatorio';

export interface NotaAcuerdoRecordatorio {
  id: string;
  tipo: TipoNota;
  titulo: string;
  contenido: string;
  tags: string[]; // Etiquetas como "Revisar fatiga", "Enviar vídeo"
  programaId?: string;
  clienteId?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaRecordatorio?: string; // Para recordatorios, fecha/hora en que debe mostrarse
  completado: boolean;
  completadoEn?: string;
  creadoPor: string; // ID del entrenador
  prioridad?: 'alta' | 'media' | 'baja';
}

// User Story 2: Datos externos para insights
export interface DatosSueño {
  fecha: string;
  horasSueño: number;
  calidadSueño: number; // 1-10
  horasProfundo?: number;
  horasREM?: number;
  latenciaSueño?: number; // minutos para conciliar el sueño
  vecesDespertado?: number;
  fuente?: 'wearable' | 'manual' | 'app';
}

export interface DatosMeteorologicos {
  fecha: string;
  temperatura: number; // Celsius
  humedad: number; // Porcentaje
  condiciones: string; // "soleado", "lluvia", "nublado", etc.
  velocidadViento?: number; // km/h
  presionAtmosferica?: number; // hPa
  indiceUV?: number;
}

export interface FeedbackCliente {
  id: string;
  clienteId: string;
  sesionId?: string;
  fecha: string;
  tipo: 'post-sesion' | 'checkin' | 'semanal' | 'mensual';
  puntuacion?: number; // 1-10
  comentarios?: string;
  nivelFatiga?: number; // 1-10
  nivelDolor?: number; // 1-10
  motivacion?: number; // 1-10
  cumplimiento?: number; // Porcentaje
  dificultad?: 'muy_facil' | 'facil' | 'adecuado' | 'duro' | 'muy_duro';
  satisfaccion?: number; // 1-5
}

export interface InsightCombinado {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'oportunidad' | 'alerta' | 'logro' | 'recomendacion' | 'tendencia' | 'correlacion';
  prioridad: 'alta' | 'media' | 'baja';
  fuentes: {
    feedback?: FeedbackCliente[];
    metricas?: MetricaProgreso[];
    sueno?: DatosSueño[];
    meteorologia?: DatosMeteorologicos[];
    contextoCliente?: ContextoCliente;
    objetivos?: ObjetivoCliente[];
  };
  correlaciones?: {
    tipo: string;
    descripcion: string;
    fuerza: number; // 0-100
  }[];
  recomendaciones: string[];
  relevancia: number; // 0-100
  timestamp: Date;
  clienteId?: string;
  programaId?: string;
}




