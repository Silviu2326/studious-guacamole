export type UserRole = 'entrenador' | 'gimnasio';

export interface PrecioConfig {
  base: number;
  descuento: number;
  moneda: string;
}

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'bono_pt' | 'cuota_gimnasio';
  precio: PrecioConfig;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Campos específicos para bonos PT
  sesiones?: number;
  validezMeses?: number;
  // Campos específicos para cuotas gimnasio
  tipoAcceso?: 'basica' | 'premium' | 'libre_acceso';
  clasesIlimitadas?: boolean;
  instalacionesIncluidas?: string[];
}

export interface Bono {
  id: string;
  planId: string;
  clienteId: string;
  sesionesTotal: number;
  sesionesUsadas: number;
  sesionesRestantes: number;
  fechaCompra: Date;
  fechaVencimiento: Date;
  estado: 'activo' | 'vencido' | 'agotado' | 'suspendido';
  precio: number;
}

export interface TipoCuota {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string[];
  limitaciones?: string[];
  activo: boolean;
}

export interface PlanAsignado {
  id: string;
  clienteId: string;
  planId: string;
  fechaAsignacion: Date;
  fechaVencimiento: Date;
  estado: 'activo' | 'vencido' | 'suspendido';
  pagado: boolean;
}

export interface CreateBonoRequest {
  planId: string;
  clienteId: string;
  sesiones: number;
  validezMeses: number;
  precio: number;
}

export interface UpdateBonoRequest {
  sesiones?: number;
  validezMeses?: number;
  precio?: number;
  estado?: 'activo' | 'vencido' | 'agotado' | 'suspendido';
}

export interface CreateTipoCuotaRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMeses: number;
  beneficios: string[];
  limitaciones?: string[];
}

export interface UpdateTipoCuotaRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  duracionMeses?: number;
  beneficios?: string[];
  limitaciones?: string[];
  activo?: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
}

export interface EstadisticasPlanes {
  totalPlanes: number;
  planesActivos: number;
  bonosVendidos: number;
  ingresosMensuales: number;
  clientesActivos: number;
}