export type TipoCita = 'sesion-1-1' | 'videollamada' | 'evaluacion' | 'clase-colectiva' | 'fisioterapia' | 'mantenimiento' | 'otro';
export type EstadoCita = 'pendiente' | 'confirmada' | 'en-curso' | 'completada' | 'cancelada';
export type VistaCalendario = 'mes' | 'semana' | 'dia';

export interface Cita {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: TipoCita;
  estado: EstadoCita;
  fechaInicio: Date;
  fechaFin: Date;
  clienteId?: string;
  clienteNombre?: string;
  instructorId?: string;
  instructorNombre?: string;
  capacidadMaxima?: number;
  inscritos?: number;
  ubicacion?: string;
  notas?: string;
  recordatorioEnviado?: boolean;
}

export interface BloqueoAgenda {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: 'vacaciones' | 'mantenimiento' | 'feriado' | 'otro';
  recurrente?: boolean;
}

export interface HorarioDisponibilidad {
  id: string;
  diaSemana: number; // 0 = Domingo, 6 = Sábado
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  disponible: boolean;
}

export interface Recordatorio {
  id: string;
  citaId: string;
  tipo: 'email' | 'sms' | 'push';
  tiempoAnticipacion: number; // minutos antes
  activo: boolean;
}

export interface AnalyticsOcupacion {
  periodo: string;
  totalCitas: number;
  citasConfirmadas: number;
  citasCompletadas: number;
  ocupacionPromedio: number;
  ingresosEstimados: number;
  claseMasPopular?: {
    nombre: string;
    ocupacion: number;
  };
}

