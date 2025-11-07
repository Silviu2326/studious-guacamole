// Tipos para el sistema de restricciones alimentarias y alertas de seguridad sanitaria

export type TipoRestriccion = 'alergia' | 'intolerancia' | 'religiosa' | 'cultural';

export type SeveridadRestriccion = 'leve' | 'moderada' | 'severa' | 'critica';

export type EstadoAlerta = 'activa' | 'resuelta' | 'ignorada';

export interface RestriccionAlimentaria {
  id: string;
  clienteId: string;
  tipo: TipoRestriccion;
  nombre: string;
  descripcion?: string;
  severidad: SeveridadRestriccion;
  ingredientesProhibidos: string[];
  ingredientesPermitidos?: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  activa: boolean;
  notas?: string;
}

export interface Alergeno {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ingredientesRelacionados: string[];
  nivelRiesgo: SeveridadRestriccion;
  simbolo?: string;
}

export interface Ingrediente {
  id: string;
  nombre: string;
  categoria: string;
  alergenos: string[];
  descripcion?: string;
  alternativas?: string[];
  esVegano: boolean;
  esVegetariano: boolean;
  esHalal: boolean;
  esKosher: boolean;
  sinGluten: boolean;
  sinLactosa: boolean;
}

export interface AlertaSeguridad {
  id: string;
  clienteId: string;
  restriccionId: string;
  ingredienteId: string;
  tipo: TipoRestriccion;
  severidad: SeveridadRestriccion;
  mensaje: string;
  descripcion: string;
  estado: EstadoAlerta;
  fechaCreacion: Date;
  fechaResolucion?: Date;
  accionesTomadas?: string[];
  responsable?: string;
}

export interface ValidacionIngrediente {
  ingredienteId: string;
  clienteId: string;
  esSeguro: boolean;
  restriccionesVioladas: RestriccionAlimentaria[];
  alertasGeneradas: AlertaSeguridad[];
  alternativasSugeridas: Ingrediente[];
  razonRechazo?: string;
}

export interface SustitucionSegura {
  id: string;
  ingredienteOriginal: string;
  ingredienteSustituto: string;
  tipoRestriccion: TipoRestriccion;
  compatibilidad: number; // 0-100
  descripcion: string;
  notas?: string;
}

export interface HistorialAlerta {
  id: string;
  clienteId: string;
  fecha: Date;
  tipo: TipoRestriccion;
  severidad: SeveridadRestriccion;
  descripcion: string;
  accion: string;
  resultado: string;
  responsable: string;
}

export interface ReporteCompliance {
  id: string;
  fechaGeneracion: Date;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  totalAlertas: number;
  alertasPorTipo: Record<TipoRestriccion, number>;
  alertasPorSeveridad: Record<SeveridadRestriccion, number>;
  clientesAfectados: number;
  tiempoPromedioResolucion: number;
  cumplimientoNormativo: number; // 0-100
  recomendaciones: string[];
  detalles: HistorialAlerta[];
}

export interface ConfiguracionRestricciones {
  alertasAutomaticas: boolean;
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  validacionAutomatica: boolean;
  nivelSeguridadMinimo: SeveridadRestriccion;
  tiempoMaximoRespuesta: number; // en minutos
  requiereAprobacionManual: boolean;
}

export interface EstadisticasRestricciones {
  totalRestricciones: number;
  restriccionesPorTipo: Record<TipoRestriccion, number>;
  restriccionesPorSeveridad: Record<SeveridadRestriccion, number>;
  clientesConRestricciones: number;
  alertasUltimos30Dias: number;
  tendenciaAlertas: 'aumentando' | 'disminuyendo' | 'estable';
  ingredientesMasProblematicos: Array<{
    ingrediente: string;
    alertas: number;
  }>;
}

// Tipos para formularios
export interface FormularioRestriccion {
  tipo: TipoRestriccion;
  nombre: string;
  descripcion: string;
  severidad: SeveridadRestriccion;
  ingredientesProhibidos: string[];
  ingredientesPermitidos: string[];
  notas: string;
}

export interface FiltrosRestricciones {
  tipo?: TipoRestriccion[];
  severidad?: SeveridadRestriccion[];
  activa?: boolean;
  clienteId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  busqueda?: string;
}

export interface FiltrosAlertas {
  estado?: EstadoAlerta[];
  tipo?: TipoRestriccion[];
  severidad?: SeveridadRestriccion[];
  clienteId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  responsable?: string;
}

// Tipos para hooks y servicios
export interface UseRestriccionesResult {
  restricciones: RestriccionAlimentaria[];
  loading: boolean;
  error: string | null;
  crearRestriccion: (restriccion: FormularioRestriccion, clienteId: string) => Promise<void>;
  actualizarRestriccion: (id: string, restriccion: Partial<FormularioRestriccion>) => Promise<void>;
  eliminarRestriccion: (id: string) => Promise<void>;
  validarIngrediente: (ingredienteId: string, clienteId: string) => Promise<ValidacionIngrediente>;
  obtenerSustituciones: (ingredienteId: string, tipoRestriccion: TipoRestriccion) => Promise<SustitucionSegura[]>;
}

export interface UseAlertasResult {
  alertas: AlertaSeguridad[];
  loading: boolean;
  error: string | null;
  marcarComoResuelta: (alertaId: string, accion: string) => Promise<void>;
  ignorarAlerta: (alertaId: string, razon: string) => Promise<void>;
  generarReporte: (periodo: { inicio: Date; fin: Date }) => Promise<ReporteCompliance>;
}