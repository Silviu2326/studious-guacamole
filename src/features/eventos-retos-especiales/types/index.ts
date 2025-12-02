export type TipoEvento = 'reto' | 'evento';
export type TipoReto = 'personal' | 'grupal';
export type EstadoEvento = 'borrador' | 'publicado' | 'en_curso' | 'finalizado' | 'cancelado';
export type DuracionReto = 7 | 14 | 21 | 30 | 60 | 90;
export type ObjetivoReto = 'perdida_peso' | 'ganancia_muscular' | 'resistencia' | 'flexibilidad' | 'general';
export type TipoActividad = 'pasos_diarios' | 'entrenamientos' | 'comidas_saludables' | 'agua' | 'sueño';
export type TipoPremio = 'medalla' | 'certificado' | 'descuento' | 'producto' | 'experiencia';

export interface Participante {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  progreso: number;
  puntos: number;
  posicion: number;
  ultimoCheckIn?: Date;
  inscripcionFecha: Date;
}

export interface ContenidoMotivacional {
  id: string;
  tipo: 'mensaje' | 'video' | 'imagen' | 'articulo';
  titulo: string;
  contenido: string;
  fechaPublicacion: Date;
  url?: string;
}

export interface Premio {
  id: string;
  tipo: TipoPremio;
  nombre: string;
  descripcion: string;
  imagen?: string;
  requisito: string;
}

export interface ProgresoParticipante {
  participanteId: string;
  fecha: Date;
  actividad?: TipoActividad;
  valor?: number;
  completado: boolean;
  notas?: string;
}

export interface RankingEntry {
  posicion: number;
  participanteId: string;
  nombre: string;
  puntos: number;
  progreso: number;
  avatar?: string;
}

export interface EventoReto {
  id: string;
  tipo: TipoEvento;
  tipoReto?: TipoReto;
  titulo: string;
  descripcion: string;
  duracionDias?: DuracionReto;
  fechaInicio: Date;
  fechaFin?: Date;
  objetivo?: ObjetivoReto;
  reglas: string[];
  estado: EstadoEvento;
  capacidadMaxima?: number;
  requisitos?: string[];
  creadorId: string;
  creadorNombre: string;
  participantes: Participante[];
  contenidoMotivacional: ContenidoMotivacional[];
  premios: Premio[];
  ranking: RankingEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventoFilters {
  tipo?: TipoEvento;
  estado?: EstadoEvento;
  objetivo?: ObjetivoReto;
  fechaInicioDesde?: Date;
  fechaInicioHasta?: Date;
}

export interface AnalyticsEvento {
  eventoId: string;
  totalParticipantes: number;
  participantesActivos: number;
  tasaAdherencia: number;
  promedioProgreso: number;
  tasaFinalizacion: number;
  engagementScore: number;
  puntosTotales: number;
}

