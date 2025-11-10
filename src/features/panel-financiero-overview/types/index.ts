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
  ingresosConTiempo?: IngresosConTiempo[]; // Métricas expandidas con tiempo
}

export interface ClientePagoPendiente {
  id: string;
  nombre: string;
  servicio: string;
  monto: number;
  diasVencidos: number;
  fechaVencimiento: string;
  riesgo: 'bajo' | 'medio' | 'alto';
  email?: string;
  telefono?: string;
  clienteId?: string;
  estado?: 'pendiente' | 'en_gestion' | 'resuelto' | 'cancelado';
  notas?: string;
  historial?: HistorialGestionPago[];
}

export interface HistorialGestionPago {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
  estadoAnterior?: string;
  estadoNuevo?: string;
  notas?: string;
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

// Ranking de clientes por ingresos
export interface ClienteRanking {
  clienteId: string;
  nombre: string;
  totalIngresos: number;
  numeroTransacciones: number;
  ultimaTransaccion?: string;
  promedioTransaccion: number;
}

export type PeriodoFiltro = '7d' | '30d' | '90d' | 'ytd' | 'custom';

// Objetivos financieros
export interface ObjetivosFinancieros {
  objetivoMensual: number;
  objetivoAnual: number;
  fechaActualizacion: Date;
  rol: UserRole;
}

export interface ProgresoObjetivo {
  objetivo: number;
  actual: number;
  porcentaje: number;
  restante: number;
  tendencia: 'up' | 'down' | 'neutral';
}

// Gastos profesionales para entrenadores
export type CategoriaGasto = 
  | 'equipamiento'
  | 'formacion'
  | 'marketing'
  | 'software'
  | 'transporte'
  | 'seguro'
  | 'nutricion'
  | 'otros';

export interface GastoProfesional {
  id: string;
  concepto: string;
  categoria: CategoriaGasto;
  monto: number;
  fecha: string;
  descripcion?: string;
  factura?: string;
  entrenadorId: string;
}

export interface ResumenGastos {
  total: number;
  porCategoria: Record<CategoriaGasto, number>;
  porPeriodo: {
    mes: string;
    total: number;
  }[];
  periodoActual: {
    mes: string;
    total: number;
    variacion: number;
  };
}

// Evolución mensual de ingresos
export interface IngresoMensual {
  mes: string;
  mesCorto: string; // Para el gráfico (ej: "Ene", "Feb")
  año: number;
  ingresos: number;
  fecha: Date; // Para ordenamiento
}

// Comparación año actual vs año anterior
export interface ComparacionAnual {
  añoActual: number;
  añoAnterior: number;
  datos: ComparacionMensual[];
  crecimientoTotal: number;
  crecimientoPorcentaje: number;
}

export interface ComparacionMensual {
  mes: string;
  mesCorto: string;
  mesNumero: number;
  añoActual: number;
  añoAnterior: number;
  diferencia: number;
  diferenciaPorcentaje: number;
}

// Métricas de tiempo e ingreso por hora por servicio
export interface IngresosConTiempo {
  tipoServicio: 'sesion-1-1' | 'paquetesEntrenamiento' | 'consultasOnline';
  nombreServicio: string;
  ingresos: number;
  tiempoInvertidoHoras: number;
  tiempoInvertidoMinutos: number;
  ingresoPorHora: number;
  numeroSesiones: number;
  promedioPorSesion: number;
  duracionPromedioMinutos: number;
}

// Proyección de ingresos simple basada en clientes activos
export interface ProyeccionIngresosSimple {
  mesProyeccion: string; // Mes proyectado (ej: "Noviembre 2024")
  numeroClientesActivos: number;
  precioMedio: number;
  frecuenciaPago: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  ingresosEsperados: number;
  desglosePorFrecuencia: {
    frecuencia: 'mensual' | 'trimestral' | 'semestral' | 'anual';
    numeroClientes: number;
    precioPromedio: number;
    ingresosEsperados: number;
  }[];
  fechaCalculo: string;
}

// Configuración de recordatorios automáticos de pagos
export interface ConfiguracionRecordatoriosPagos {
  id?: string;
  activo: boolean;
  diasAnticipacion: number[]; // Array de días antes del vencimiento (ej: [1, 3, 7])
  canalesEnvio: ('whatsapp' | 'email')[];
  plantillaWhatsApp?: string;
  plantillaEmail?: {
    asunto: string;
    cuerpo: string;
  };
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// Historial de recordatorios enviados
export interface RecordatorioEnviado {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  pagoId: string;
  monto: number;
  fechaVencimiento: string;
  diasAnticipacion: number;
  canal: 'whatsapp' | 'email';
  estado: 'enviado' | 'fallido' | 'pendiente';
  fechaEnvio: string;
  mensaje?: string;
}

// Métricas de retención de clientes
export interface MetricasRetencionClientes {
  antiguedadPromedio: {
    dias: number;
    meses: number;
    años: number;
    texto: string; // Formato legible (ej: "8 meses y 15 días")
  };
  tasaRetencion: {
    porcentaje: number;
    clientesActivos: number;
    clientesTotales: number;
    tendencia: 'up' | 'down' | 'neutral';
    variacionPeriodoAnterior: number;
  };
  altasBajasPeriodo: {
    periodo: string; // Ej: "Octubre 2024"
    altas: number;
    bajas: number;
    saldoNeto: number;
    tendencia: 'up' | 'down' | 'neutral';
  };
  distribucionAntiguedad: {
    menos3Meses: number;
    entre3y6Meses: number;
    entre6y12Meses: number;
    mas12Meses: number;
  };
}

// Resumen semanal por email
export interface ResumenSemanalEmail {
  id?: string;
  entrenadorId: string;
  activo: boolean;
  diaEnvio: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  horaEnvio: string; // Formato HH:mm
  emailDestinatario: string;
  incluirIngresos: boolean;
  incluirPagosPendientes: boolean;
  incluirProximasSesiones: boolean;
  incluirMetricasRetencion: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  ultimoEnvio?: string;
}

// Contenido del resumen semanal
export interface ContenidoResumenSemanal {
  periodo: string; // Ej: "Semana del 28 de octubre al 3 de noviembre"
  ingresos: {
    total: number;
    periodoAnterior: number;
    variacion: number;
    tendencia: 'up' | 'down' | 'neutral';
  };
  pagosPendientes: {
    total: number;
    cantidad: number;
    clientes: Array<{
      nombre: string;
      monto: number;
      diasVencidos: number;
    }>;
  };
  proximasSesiones: {
    total: number;
    estaSemana: number;
    proximaSemana: number;
    sesiones: Array<{
      fecha: string;
      hora: string;
      cliente: string;
      tipo: string;
    }>;
  };
  metricasRetencion?: {
    antiguedadPromedio: string;
    tasaRetencion: number;
    altas: number;
    bajas: number;
  };
}

