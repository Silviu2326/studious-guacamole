export type UserType = 'entrenador' | 'gimnasio';
export type EstadoRenovacion = 'pendiente' | 'procesada' | 'cancelada';
export type PrioridadAlerta = 'alta' | 'media' | 'baja';
export type CategoriaMotivoBaja = 
  | 'Motivos Economicos' 
  | 'Motivos Personales' 
  | 'Motivos de Servicio' 
  | 'Motivos de Ubicacion' 
  | 'Motivos de Salud';

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

export interface Membresia {
  id: string;
  clienteId: string;
  tipo: 'bono-pt' | 'cuota-mensual' | 'otro';
  fechaVencimiento: string;
  activa: boolean;
}

export interface Renovacion {
  id: string;
  membresiaId: string;
  cliente: Cliente;
  membresia: Membresia;
  estado: EstadoRenovacion;
  fechaCreacion: string;
  fechaVencimiento: string;
  diasRestantes: number;
  intentosRecordatorio: number;
  fechaProcesamiento?: string;
}

export interface ProcessRenovacionRequest {
  renovacionId: string;
  nuevaFechaVencimiento?: string;
  notas?: string;
}

export interface Baja {
  id: string;
  cliente: Cliente;
  membresiaId: string;
  motivoId?: string;
  motivoTexto?: string;
  categoria?: CategoriaMotivoBaja;
  fechaBaja: string;
  fechaRegistro: string;
  notas?: string;
}

export interface MotivoBaja {
  id: string;
  nombre: string;
  categoria: CategoriaMotivoBaja;
  descripcion?: string;
  activo: boolean;
}

export interface CreateMotivoBajaRequest {
  nombre: string;
  categoria: CategoriaMotivoBaja;
  descripcion?: string;
}

export interface UpdateMotivoBajaRequest {
  nombre?: string;
  categoria?: CategoriaMotivoBaja;
  descripcion?: string;
  activo?: boolean;
}

export interface AlertaVencimiento {
  id: string;
  renovacionId: string;
  cliente: Cliente;
  tipo: 'bono-pt' | 'cuota-mensual';
  fechaVencimiento: string;
  diasRestantes: number;
  prioridad: PrioridadAlerta;
  leida: boolean;
  fechaCreacion: string;
  mensaje: string;
}

export type AccionAlerta = 'renovar' | 'contactar' | 'posponer';

export interface ChurnData {
  periodo: string;
  sociosIniciales: number;
  bajas: number;
  motivosBaja: string[];
  tasaChurn: number;
}

export interface PeriodoChurn {
  tipo: 'mensual' | 'trimestral' | 'anual';
  fechaInicio: string;
  fechaFin: string;
}
