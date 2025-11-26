// Tipos para el módulo de Mantenimiento & Incidencias

export type PrioridadIncidencia = 'critica' | 'media' | 'baja';
export type TipoIncidencia = 'seguridad' | 'limpieza' | 'suministros' | 'climatizacion' | 'general';
export type EstadoIncidencia = 'pendiente' | 'en_proceso' | 'resuelta' | 'cancelada';
export type EstadoMantenimiento = 'programado' | 'en_proceso' | 'completado' | 'cancelado';
export type TipoMantenimiento = 'preventivo' | 'correctivo';
export type FrecuenciaChecklist = 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';

export interface Equipamiento {
  id: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  estado: 'operativo' | 'fuera_de_servicio' | 'mantenimiento';
  fechaInstalacion?: string;
  ultimoMantenimiento?: string;
  proximoMantenimiento?: string;
  modelo?: string;
  marca?: string;
  numeroSerie?: string;
}

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  equipamientoId: string;
  equipamiento?: Equipamiento;
  tipo: TipoIncidencia;
  prioridad: PrioridadIncidencia;
  estado: EstadoIncidencia;
  tecnicoAsignado?: string;
  tecnicoNombre?: string;
  fechaReporte: string;
  fechaResolucion?: string;
  notas?: string;
  costoReparacion?: number;
  servicioExterno?: boolean;
}

export interface TareaMantenimiento {
  id: string;
  titulo: string;
  descripcion: string;
  equipamientoId: string;
  equipamiento?: Equipamiento;
  tipo: TipoMantenimiento;
  fechaProgramada: string;
  fechaCompletada?: string;
  estado: EstadoMantenimiento;
  tecnicoAsignado?: string;
  tecnicoNombre?: string;
  checklistCompletado?: boolean;
  costo?: number;
}

export interface ChecklistItem {
  id: string;
  tarea: string;
  completado: boolean;
  observaciones?: string;
  completadoPor?: string;
  fechaCompletado?: string;
}

export interface Checklist {
  id: string;
  nombre: string;
  tipoEquipamiento: string;
  frecuencia: FrecuenciaChecklist;
  items: ChecklistItem[];
  fechaCreacion: string;
  fechaUltimaEjecucion?: string;
}

export interface Reparacion {
  id: string;
  incidenciaId: string;
  incidencia?: Incidencia;
  diagnostico: string;
  repuestosNecesarios?: string[];
  tecnicoAsignado: string;
  tecnicoNombre?: string;
  fechaInicio: string;
  fechaFin?: string;
  costoRepuestos?: number;
  costoServicio?: number;
  costoTotal?: number;
  notas?: string;
  estado: 'diagnostico' | 'esperando_repuestos' | 'en_reparacion' | 'pruebas' | 'completada';
}

export interface AlertaMantenimiento {
  id: string;
  tipo: 'vencimiento_mantenimiento' | 'incidencia_critica' | 'tarea_pendiente' | 'repuesto_faltante';
  titulo: string;
  mensaje: string;
  prioridad: PrioridadIncidencia;
  fechaCreacion: string;
  fechaVencimiento?: string;
  relacionadoId?: string;
  relacionadoTipo?: 'incidencia' | 'mantenimiento' | 'reparacion';
  resuelta: boolean;
  fechaResolucion?: string;
}

export interface EstadisticasMantenimiento {
  totalEquipamiento: number;
  equipamientoOperativo: number;
  equipamientoFueraServicio: number;
  incidenciasPendientes: number;
  incidenciasCriticas: number;
  mantenimientosProgramados: number;
  mantenimientosAtrasados: number;
  reparacionesEnCurso: number;
  costoTotalMes: number;
  alertasPendientes: number;
}

