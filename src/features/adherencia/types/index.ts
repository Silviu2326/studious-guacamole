export type TipoNegocio = 'entrenador' | 'gimnasio';

export interface SesionEntrenamiento {
  id: string;
  clienteId: string;
  entrenadorId: string;
  fechaProgramada: Date;
  fechaEjecucion?: Date;
  completada: boolean;
  duracionMinutos: number;
  ejercicios: string[];
  notas?: string;
  motivoIncumplimiento?: string;
}

export interface ClaseGimnasio {
  id: string;
  nombre: string;
  fechaHora: Date;
  duracionMinutos: number;
  plazasDisponibles: number;
  plazasOcupadas: number;
  instructorId: string;
  salaId: string;
  tipoClase: string;
  asistentes: string[];
}

export interface AdherenciaCliente {
  clienteId: string;
  entrenadorId: string;
  sesionesTotales: number;
  sesionesCompletadas: number;
  porcentajeAdherencia: number;
  ultimaSesion?: Date;
  tendencia: 'mejorando' | 'estable' | 'empeorando';
  alertaActiva: boolean;
}

export interface OcupacionClase {
  claseId: string;
  fecha: Date;
  porcentajeOcupacion: number;
  plazasDisponibles: number;
  plazasOcupadas: number;
  tendenciaOcupacion: 'creciente' | 'estable' | 'decreciente';
}

export interface MetricasAdherencia {
  tipoNegocio: TipoNegocio;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  // Métricas para entrenadores
  adherenciaPromedio?: number;
  clientesActivos?: number;
  clientesConBajaAdherencia?: number;
  sesionesTotalesProgramadas?: number;
  sesionesCompletadas?: number;
  // Métricas para gimnasios
  ocupacionPromedio?: number;
  clasesTotales?: number;
  clasesConBajaOcupacion?: number;
  asistenciaTotal?: number;
  capacidadTotal?: number;
}

export interface AlertaAdherencia {
  id: string;
  tipo: 'baja_adherencia_cliente' | 'baja_ocupacion_clase' | 'tendencia_negativa';
  mensaje: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaCreacion: Date;
  leida: boolean;
  accionRecomendada?: string;
  // Para entrenadores
  clienteId?: string;
  // Para gimnasios
  claseId?: string;
}

export interface TendenciaAdherencia {
  periodo: string;
  valor: number;
  cambio: number;
  porcentajeCambio: number;
}

export interface RecomendacionMejora {
  id: string;
  tipo: 'horario' | 'programa' | 'comunicacion' | 'motivacion';
  titulo: string;
  descripcion: string;
  impactoEstimado: number;
  facilidadImplementacion: 'facil' | 'medio' | 'dificil';
  // Para entrenadores
  clienteId?: string;
  // Para gimnasios
  claseId?: string;
}

export interface FiltrosAdherencia {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  entrenadorId?: string;
  claseId?: string;
  tipoClase?: string;
  umbralAdherencia?: number;
  soloAlertas?: boolean;
}