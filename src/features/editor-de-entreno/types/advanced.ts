// Tipos extendidos para el editor avanzado según Editorentrenamiento.md

export type VistaEditor = 'diario' | 'semana' | 'calendario' | 'excel';

export type TipoBloque = 'calentamiento' | 'movilidad' | 'superset' | 'circuito' | 'finisher';

export type PatronMovimiento = 'empuje' | 'tiron' | 'rodilla' | 'cadera' | 'vertical' | 'horizontal' | 'core';

export interface ClientePerfil {
  id: string;
  nombre: string;
  tiempoSemana: number; // minutos
  materialDisponible: string[];
  lesiones: string[];
  preferencias: string[];
  cronotipo: 'matutino' | 'vespertino' | 'indiferente';
  e1RM?: Record<string, number>; // ejercicio -> e1RM estimado
}

export interface EstadoCliente {
  adherenciaSemana: number; // porcentaje
  fatigaReportada: 'baja' | 'media' | 'alta';
  dolorActual: {
    zona?: string;
    intensidad: 'verde' | 'amarillo' | 'rojo';
  };
  hrv?: number;
  sueño?: number; // horas
  estrés?: number; // 1-10
}

export interface Restricciones {
  tiempoDisponible?: number; // minutos
  materialDisponible?: string[];
  molestias?: string[];
  nivel?: 'principiante' | 'intermedio' | 'avanzado';
  objetivo?: 'fuerza' | 'hipertrofia' | 'resistencia' | 'general';
}

export interface SmartFillResult {
  ejercicios: EjercicioEnSesion[];
  cambios: string[];
  estimadoTiempo: number;
}

export interface AutoprogressionConfig {
  habilitada: boolean;
  objetivo: 'fuerza' | 'hipertrofia' | 'resistencia';
  semaforoRiesgo: 'verde' | 'amarillo' | 'rojo';
  sugerenciaVariante?: string;
}

export interface HeatmapData {
  dia: Date;
  ejercicioId?: string;
  cumplimiento: number; // 0-100
  feedbackDolor?: 'verde' | 'amarillo' | 'rojo';
  sueño?: number;
  estres?: number;
}

export interface BalanceadorCarga {
  empuje: { actual: number; objetivo: number };
  tiron: { actual: number; objetivo: number };
  rodilla: { actual: number; objetivo: number };
  cadera: { actual: number; objetivo: number };
  vertical: { actual: number; objetivo: number };
  horizontal: { actual: number; objetivo: number };
  core: { actual: number; objetivo: number };
}

export interface ChecklistSesion {
  ejercicios: Array<{
    ejercicioId: string;
    nombre: string;
    series: number;
    repeticiones: string;
    peso?: number;
    notas?: string;
  }>;
  mensajesPreRellenos: {
    whatsapp?: string;
    sms?: string;
    push?: string;
  };
}

export interface Temporizador {
  tipo: 'EMOM' | 'AMRAP' | 'For-Time' | 'Tradicional';
  duracion?: number; // segundos
  rondas?: number;
}

export interface AuditoriaCambio {
  id: string;
  fecha: Date;
  usuario: string;
  usuarioId: string;
  accion: string;
  cambios: string[];
  versionId?: string;
}

export interface PlanificacionSemana {
  lunes?: SesionEntrenamiento;
  martes?: SesionEntrenamiento;
  miercoles?: SesionEntrenamiento;
  jueves?: SesionEntrenamiento;
  viernes?: SesionEntrenamiento;
  sabado?: SesionEntrenamiento;
  domingo?: SesionEntrenamiento;
}

// Re-exportar tipos existentes
import { Ejercicio, Serie, EjercicioEnSesion, SesionEntrenamiento, ProgresionConfig } from '../api/editor';

export type { Ejercicio, Serie, EjercicioEnSesion, SesionEntrenamiento, ProgresionConfig };

