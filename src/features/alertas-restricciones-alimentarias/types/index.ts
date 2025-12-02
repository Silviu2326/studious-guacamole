export type TipoRestriccion = 'alergia' | 'intolerancia' | 'religiosa' | 'cultural';
export type SeveridadRestriccion = 'leve' | 'moderada' | 'severa' | 'critica';
export type EstadoAlerta = 'pendiente' | 'resuelta' | 'ignorada';

export interface RestriccionAlimentaria {
  id: string;
  clienteId?: string;
  clienteNombre?: string;
  tipo: TipoRestriccion;
  descripcion: string;
  ingredientesAfectados: string[];
  severidad: SeveridadRestriccion;
  fechaRegistro: string;
  fechaActualizacion?: string;
  notas?: string;
  activa: boolean;
}

export interface AlertaAlergia {
  id: string;
  restriccionId: string;
  clienteId?: string;
  clienteNombre?: string;
  tipo: TipoRestriccion;
  ingredienteProblema: string;
  severidad: SeveridadRestriccion;
  descripcion: string;
  estado: EstadoAlerta;
  fechaDetectada: string;
  fechaResuelta?: string;
  planNutricionalId?: string;
  recetaId?: string;
  accionTomada?: string;
  notificado: boolean;
}

export interface ValidacionIngrediente {
  ingrediente: string;
  esSeguro: boolean;
  restriccionesAfectadas: string[];
  clientesAfectados: string[];
  recomendaciones?: string[];
}

export interface SustitucionSegura {
  ingredienteOriginal: string;
  ingredienteSustituto: string;
  razon: string;
  compatibilidad: number; // 0-100
  notas?: string;
}

export interface HistorialAlerta {
  id: string;
  alertaId: string;
  accion: string;
  usuario: string;
  fecha: string;
  detalles?: string;
}

export interface ReporteCompliance {
  periodo: string;
  totalRestricciones: number;
  totalAlertas: number;
  alertasResueltas: number;
  alertasPendientes: number;
  clientesAfectados: number;
  tiempoPromedioResolucion: number; // en horas
  cumplimientoNormativo: number; // 0-100
}

export interface EstadisticasRestricciones {
  totalRestricciones: number;
  restriccionesPorTipo: Record<TipoRestriccion, number>;
  restriccionesPorSeveridad: Record<SeveridadRestriccion, number>;
  alertasUltimos30Dias: number;
  tendenciaAlertas: 'aumentando' | 'disminuyendo' | 'estable';
  ingredientesMasProblematicos: Array<{
    ingrediente: string;
    alertas: number;
  }>;
  clientesConRestricciones: number;
}

