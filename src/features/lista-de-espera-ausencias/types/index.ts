// Tipos para el sistema de Lista de Espera y Ausencias

export interface Clase {
  id: string;
  nombre: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  instructor: string;
  capacidadMaxima: number;
  reservasConfirmadas: number;
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';
}

export interface Socio {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  membresia?: string;
}

export interface Reserva {
  id: string;
  claseId: string;
  socioId: string;
  fechaReserva: Date;
  estado: 'confirmada' | 'en_lista_espera' | 'cancelada' | 'ausente' | 'asistio';
  posicionListaEspera?: number;
  fechaNotificacion?: Date;
  fechaConfirmacion?: Date;
  tiempoRespuesta?: number; // en minutos
}

export interface ListaEspera {
  id: string;
  claseId: string;
  socioId: string;
  fechaIngreso: Date;
  posicion: number;
  prioridad: 'normal' | 'premium' | 'alta';
  estado: 'activa' | 'notificada' | 'confirmada' | 'expirada';
  tiempoLimiteRespuesta: number; // en minutos
  fechaNotificacion?: Date;
  fechaConfirmacion?: Date;
}

export interface Ausencia {
  id: string;
  reservaId: string;
  claseId: string;
  socioId: string;
  fechaAusencia: Date;
  tipo: 'no_show' | 'cancelacion_tardia' | 'ausencia_justificada';
  notificadoListaEspera: boolean;
  penalizacion?: {
    tipo: 'multa' | 'bloqueo_temporal' | 'sin_penalizacion';
    monto?: number;
    fechaBloqueo?: Date;
    diasBloqueo?: number;
  };
}

export interface Notificacion {
  id: string;
  tipo: 'disponibilidad_plaza' | 'recordatorio_clase' | 'confirmacion_reserva' | 'cancelacion';
  destinatario: string; // socioId
  claseId: string;
  mensaje: string;
  fechaEnvio: Date;
  estado: 'pendiente' | 'enviada' | 'leida' | 'expirada';
  canal: 'email' | 'sms' | 'push' | 'interno';
}

export interface ConfiguracionTiempoRespuesta {
  tiempoDisponibilidadPlaza: number; // minutos que tiene el socio para confirmar
  recordatorio24h: boolean;
  recordatorio2h: boolean;
  penalizacionNoShow: {
    habilitada: boolean;
    tipo: 'multa' | 'bloqueo' | 'ambos';
    multaMonto?: number;
    diasBloqueo?: number;
  };
}

export interface PrioridadListaEspera {
  id: string;
  nombre: string;
  descripcion: string;
  reglas: {
    tipo: 'membresia' | 'antiguedad' | 'frecuencia' | 'manual';
    valor?: string | number;
  };
  orden: number;
}

export interface ControlAforo {
  claseId: string;
  capacidadMaxima: number;
  reservasConfirmadas: number;
  listaEsperaActiva: number;
  ocupacionPorcentaje: number;
  estado: 'disponible' | 'llena' | 'sobrevendida';
}

export interface AnalyticsAusencias {
  periodo: 'diario' | 'semanal' | 'mensual';
  totalAusencias: number;
  ausenciasPorTipo: {
    no_show: number;
    cancelacion_tardia: number;
    ausencia_justificada: number;
  };
  clasesMasAfectadas: {
    claseId: string;
    nombreClase: string;
    ausencias: number;
  }[];
  sociosMasAusentes: {
    socioId: string;
    nombre: string;
    ausencias: number;
  }[];
  tasaAusencias: number; // porcentaje
  tendencia: 'aumentando' | 'disminuyendo' | 'estable';
  impactoFinanciero: number; // pérdidas por ausencias
}

export interface AnalyticsOcupacion {
  periodo: 'diario' | 'semanal' | 'mensual';
  ocupacionPromedio: number; // porcentaje
  clasesLlenas: number;
  clasesConListaEspera: number;
  plazasLiberadas: number;
  plazasOcupadasListaEspera: number;
  eficienciaOcupacion: number; // porcentaje de plazas realmente ocupadas vs disponibles
  tendencia: 'aumentando' | 'disminuyendo' | 'estable';
}

// Filtros y búsquedas
export interface FiltroListaEspera {
  claseId?: string;
  socioId?: string;
  estado?: 'activa' | 'notificada' | 'confirmada' | 'expirada';
  prioridad?: 'normal' | 'premium' | 'alta';
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface FiltroAusencias {
  claseId?: string;
  socioId?: string;
  tipo?: 'no_show' | 'cancelacion_tardia' | 'ausencia_justificada';
  fechaInicio?: Date;
  fechaFin?: Date;
  conPenalizacion?: boolean;
}

