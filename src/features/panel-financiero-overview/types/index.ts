export type UserRole = 'entrenador' | 'gimnasio';

// Tipos comunes
export interface MetricasFinancieras {
  total: number;
  periodoActual: string;
  periodoAnterior?: string;
  variacion?: number;
  tendencia: 'up' | 'down' | 'neutral';
}

// Entrenadores
export interface IngresosEntrenador {
  sesiones1a1: number;
  paquetesEntrenamiento: number;
  consultasOnline: number;
  total: number;
}

export interface ClientePagoPendiente {
  id: string;
  nombre: string;
  servicio: string;
  monto: number;
  diasVencidos: number;
  fechaVencimiento: string;
  riesgo: 'bajo' | 'medio' | 'alto';
}

export interface RendimientoEntrenador {
  mesActual: number;
  mesAnterior: number;
  variacion: number;
  tendencia: 'up' | 'down' | 'neutral';
}

// Gimnasios
export interface FacturacionGimnasio {
  total: number;
  cuotasSocios: number;
  entrenamientoPersonal: number;
  tienda: number;
  serviciosAdicionales: number;
}

export interface CostesEstructurales {
  alquiler: number;
  salarios: number;
  equipamiento: number;
  serviciosBasicos: number;
  total: number;
}

export interface AnalisisRentabilidad {
  ingresosTotales: number;
  costesTotales: number;
  beneficioNeto: number;
  margenRentabilidad: number;
  estado: 'saludable' | 'advertencia' | 'critico';
}

// Comunes
export interface AlertaPago {
  id: string;
  tipo: 'vencido' | 'por_vencer' | 'recordatorio';
  cliente: string;
  monto: number;
  fecha: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface ProyeccionFinanciera {
  periodo: string;
  ingresos: number;
  gastos: number;
  beneficio: number;
  confianza: number; // 0-100
}

export interface ReportePersonalizado {
  id: string;
  nombre: string;
  tipo: string;
  datos: any;
  fechaGeneracion: string;
}

