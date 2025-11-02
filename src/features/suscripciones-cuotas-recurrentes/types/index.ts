export type EstadoSuscripcion = 'activa' | 'pausada' | 'cancelada' | 'vencida' | 'pendiente';
export type TipoSuscripcion = 'pt-mensual' | 'membresia-gimnasio' | 'servicio' | 'contenido' | 'evento' | 'hibrida';
export type FrecuenciaPago = 'mensual' | 'trimestral' | 'semestral' | 'anual';

export interface Suscripcion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipo: TipoSuscripcion;
  planId: string;
  planNombre: string;
  
  // Para Entrenadores: Paquetes PT
  sesionesIncluidas?: number; // 4, 8, 12 sesiones/mes
  sesionesUsadas?: number;
  sesionesDisponibles?: number;
  
  // Para Gimnasios: Membresías
  nivelPlan?: 'basico' | 'premium' | 'vip';
  permiteFreeze?: boolean;
  permiteMultisesion?: boolean;
  serviciosAcceso?: string[]; // Para multisesión
  
  precio: number;
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  fechaVencimiento: string;
  proximaRenovacion?: string;
  estado: EstadoSuscripcion;
  
  // Cuotas recurrentes
  pagoRecurrente?: PagoRecurrente;
  historialCuotas: Cuota[];
  
  // Freeze
  freezeActivo?: boolean;
  fechaFreezeInicio?: string;
  fechaFreezeFin?: string;
  diasFreezeRestantes?: number;
  
  // Multisesión (para gimnasios)
  multisesionActivo?: boolean;
  serviciosMultisesion?: string[];
  
  entrenadorId?: string; // Para PT
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
}

export interface PagoRecurrente {
  id: string;
  suscripcionId: string;
  metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
  numeroTarjeta?: string; // Últimos 4 dígitos
  activo: boolean;
  fechaProximoCargo?: string;
  frecuencia: FrecuenciaPago;
}

export interface Cuota {
  id: string;
  suscripcionId: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'fallida';
  metodoPago?: string;
  referencia?: string;
  notas?: string;
}

export interface UpgradeDowngrade {
  id: string;
  suscripcionId: string;
  planOrigen: string;
  planDestino: string;
  fechaSolicitud: string;
  fechaAplicacion: string;
  tipoCambio: 'upgrade' | 'downgrade';
  diferenciaPrecio: number;
  estado: 'pendiente' | 'aplicado' | 'cancelado';
}

export interface FreezeRequest {
  suscripcionId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  diasTotales: number;
}

export interface MultisesionRequest {
  suscripcionId: string;
  servicios: string[];
  precioAdicional?: number;
}

export interface Renovacion {
  id: string;
  suscripcionId: string;
  fechaRenovacion: string;
  monto: number;
  estado: 'programada' | 'procesada' | 'fallida';
  fechaProcesamiento?: string;
  notas?: string;
}

export interface CreateSuscripcionRequest {
  clienteId: string;
  tipo: TipoSuscripcion;
  planId: string;
  precio: number;
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  pagoRecurrente?: {
    metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
    datosPago?: any;
  };
  sesionesIncluidas?: number; // Para PT
  entrenadorId?: string; // Para PT
}

export interface UpdateSuscripcionRequest {
  precio?: number;
  fechaVencimiento?: string;
  estado?: EstadoSuscripcion;
  notas?: string;
}

