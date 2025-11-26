export type EstadoMembresia = 'activa' | 'pendiente' | 'vencida' | 'suspendida' | 'cancelada';
export type EstadoPago = 'pagado' | 'pendiente' | 'vencido' | 'suspendido';

export interface Membresia {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipo: 'privada-pt' | 'gimnasio';
  planId: string;
  planNombre: string;
  precioMensual: number;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoMembresia;
  estadoPago: EstadoPago;
  ultimoPago?: Pago;
  proximoVencimiento?: string;
  entrenadorId?: string; // Para membresías privadas PT
  diasMorosidad?: number;
  historialPagos: Pago[];
  notas?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Pago {
  id: string;
  membresiaId: string;
  monto: number;
  fecha: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  estado: 'completado' | 'pendiente' | 'fallido';
  referencia?: string;
  notas?: string;
}

export interface Socio {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  membresia: Membresia;
  fechaRegistro: string;
  ultimaVisita?: string;
  diasDesdeUltimaVisita?: number;
  estadoPago: EstadoPago;
}

export interface SeguimientoMensual {
  id: string;
  membresiaId: string;
  mes: string; // YYYY-MM
  pagosEsperados: number;
  pagosRecibidos: number;
  montoTotal: number;
  montoRecibido: number;
  estado: 'completo' | 'pendiente' | 'atrasado';
}

export interface AlertaVencimiento {
  id: string;
  membresiaId: string;
  clienteNombre: string;
  clienteEmail: string;
  fechaVencimiento: string;
  diasRestantes: number;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'enviada' | 'procesada';
  fechaCreacion: string;
}

export interface UpdateMembresiaRequest {
  precioMensual?: number;
  fechaVencimiento?: string;
  estado?: EstadoMembresia;
  notas?: string;
}

export interface UpdateSocioRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
}

