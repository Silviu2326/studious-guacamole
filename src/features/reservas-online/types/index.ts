export interface Reserva {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  tipoSesion?: 'presencial' | 'videollamada';
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no-show';
  precio: number;
  pagado: boolean;
  claseId?: string;
  claseNombre?: string;
  capacidad?: number;
  ocupacion?: number;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disponibilidad {
  id: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  tipo?: 'sesion-1-1' | 'clase-grupal';
  claseId?: string;
  claseNombre?: string;
  capacidad?: number;
  ocupacion?: number;
}

export interface Clase {
  id: string;
  nombre: string;
  tipo: 'spinning' | 'boxeo' | 'hiit' | 'fisio' | 'nutricion' | 'masaje';
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  capacidad: number;
  ocupacion: number;
  entrenadorId?: string;
  entrenadorNombre?: string;
  salaId?: string;
  salaNombre?: string;
  precio: number;
  disponible: boolean;
}

export interface ListaEspera {
  id: string;
  claseId: string;
  claseNombre: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  hora: string;
  posicion: number;
  notificado: boolean;
  createdAt: Date;
}

export interface Recordatorio {
  id: string;
  reservaId: string;
  tipo: 'email' | 'sms' | 'push';
  enviado: boolean;
  fechaEnvio?: Date;
  programadoPara: Date;
}

export interface AnalyticsReservas {
  totalReservas: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  tasaOcupacion: number;
  ingresosTotales: number;
  promedioPorReserva: number;
  reservasPorTipo: Record<string, number>;
  reservasPorMes: Array<{ mes: string; cantidad: number }>;
  horariosMasReservados: Array<{ hora: string; cantidad: number }>;
}
