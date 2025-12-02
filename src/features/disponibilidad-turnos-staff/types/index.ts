export type TipoTurno = 'mañana' | 'tarde' | 'noche' | 'completo' | 'parcial';
export type EstadoTurno = 'asignado' | 'confirmado' | 'completado' | 'cancelado';
export type TipoPersonal = 'entrenador' | 'fisioterapeuta' | 'recepcionista' | 'limpieza' | 'gerente';
export type EstadoPersonal = 'activo' | 'vacaciones' | 'baja' | 'inactivo';
export type TipoAusencia = 'vacaciones' | 'baja_medica' | 'permiso' | 'personal';

export interface Personal {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  tipo: TipoPersonal;
  especialidad?: string;
  estado: EstadoPersonal;
  fechaIngreso: string;
  horarioBase?: {
    inicio: string;
    fin: string;
    dias: number[];
  };
}

export interface Turno {
  id: string;
  personalId: string;
  personal?: Personal;
  fecha: string;
  tipo: TipoTurno;
  horaInicio: string;
  horaFin: string;
  estado: EstadoTurno;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vacacion {
  id: string;
  personalId: string;
  personal?: Personal;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoAusencia;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
  reemplazoId?: string;
  reemplazo?: Personal;
  createdAt: string;
  updatedAt: string;
}

export interface Reemplazo {
  id: string;
  turnoId: string;
  personalOriginalId: string;
  personalReemplazoId: string;
  fecha: string;
  motivo: string;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
}

export interface Cuadrante {
  id: string;
  semana: number;
  año: number;
  turnos: Turno[];
  personal: Personal[];
  createdAt: string;
}

export interface DisponibilidadPersonal {
  personalId: string;
  personal?: Personal;
  fecha: string;
  disponible: boolean;
  razon?: string;
  horariosDisponibles: {
    inicio: string;
    fin: string;
  }[];
}

export interface AnalyticsPersonal {
  personalId: string;
  personal?: Personal;
  totalHoras: number;
  turnosCompletados: number;
  turnosCancelados: number;
  puntualidad: number;
  periodo: {
    inicio: string;
    fin: string;
  };
}

export interface TurnoFilters {
  personalId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: TipoTurno;
  estado?: EstadoTurno;
}

export interface VacacionFilters {
  personalId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  tipo?: TipoAusencia;
}

