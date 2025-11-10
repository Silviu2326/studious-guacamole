// Tipos para el sistema de Pagos Pendientes & Morosidad

export type NivelMorosidad = 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'negro';
export type EstadoPago = 'pendiente' | 'vencido' | 'pagado' | 'en_proceso' | 'cancelado';
export type TipoRecordatorio = 'amigable' | 'firme' | 'urgente' | 'escalado';
export type MedioRecordatorio = 'email' | 'sms' | 'whatsapp' | 'llamada';
export type RiesgoCobro = 'bajo' | 'medio' | 'alto' | 'critico';
export type EstrategiaCobro = 'recordatorio_automatico' | 'contacto_directo' | 'negociacion' | 'legal';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'nequi' | 'daviplata' | 'pse' | 'otro';
export type PlataformaPago = 'wompi' | 'payu' | 'otro';

export interface PagoPendiente {
  id: string;
  facturaId: string;
  numeroFactura: string;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    metodoPagoPreferido?: MetodoPago; // Método de pago preferido del cliente
  };
  fechaEmision: Date;
  fechaVencimiento: Date;
  fechaVencida: Date; // Fecha cuando realmente venció
  diasRetraso: number;
  montoTotal: number;
  montoPendiente: number;
  nivelMorosidad: NivelMorosidad;
  estado: EstadoPago;
  recordatoriosEnviados: number;
  ultimoRecordatorio?: Date;
  proximoRecordatorio?: Date;
  riesgo: RiesgoCobro;
  estrategiaCobro?: EstrategiaCobro;
  notas?: string;
  notasPrivadas?: string; // Notas privadas sobre situación financiera o personal del cliente
  historialAcciones: AccionCobro[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Información de pago recibido
  metodoPago?: MetodoPago;
  fechaPago?: Date;
  notaPago?: string;
  // Información de membresía pausada
  membresiaPausada?: {
    pausada: boolean;
    fechaPausa?: Date;
    fechaReactivacion?: Date;
    motivoPausa?: string;
  };
  membresiaId?: string; // ID de la membresía asociada
  // Información de asistencia
  asistencia?: {
    ultimaAsistencia?: Date; // Fecha de la última sesión asistida
    sesionesEsteMes: number; // Número de sesiones del mes actual
  };
  // Información de descuentos/condonaciones
  ajustesDeuda?: {
    montoOriginal: number; // Monto original antes del ajuste
    montoAjustado: number; // Monto después del ajuste
    descuentoAplicado: number; // Monto descontado/condonado
    motivo: string; // Motivo del ajuste
    fechaAjuste: Date; // Fecha en que se aplicó el ajuste
    usuarioAjuste: string; // Usuario que aplicó el ajuste
  }[];
  // Cliente de confianza - reduce alertas y priorización
  clienteDeConfianza?: boolean;
  // Último contacto registrado con el cliente
  ultimoContacto?: Date;
}

export interface EnlacePago {
  id: string;
  pagoPendienteId: string;
  url: string;
  plataforma: PlataformaPago;
  estado: 'activo' | 'expirado' | 'usado' | 'cancelado';
  fechaCreacion: Date;
  fechaExpiracion?: Date;
  fechaUso?: Date;
  monto: number;
  referencia: string;
}

export interface AlertaMorosidad {
  id: string;
  pagoPendienteId: string;
  nivel: NivelMorosidad;
  titulo: string;
  descripcion: string;
  fechaGeneracion: Date;
  fechaVencimiento?: Date;
  estado: 'activa' | 'resuelta' | 'archivada';
  accionesRecomendadas: string[];
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
}

export interface RecordatorioPago {
  id: string;
  pagoPendienteId: string;
  tipo: TipoRecordatorio;
  medio: MedioRecordatorio;
  fechaEnvio: Date;
  fechaProgramada?: Date;
  contenido: string;
  estado: 'pendiente' | 'enviado' | 'fallido' | 'cancelado';
  respuesta?: string;
  siguienteRecordatorio?: Date;
  usuarioEnvio?: string;
}

// Recordatorio programado para contactar a un cliente en una fecha específica
export interface RecordatorioContacto {
  id: string;
  pagoPendienteId: string;
  clienteId: string;
  clienteNombre: string;
  fechaRecordatorio: Date;
  nota?: string;
  completado: boolean;
  fechaCompletado?: Date;
  fechaCreacion: Date;
  creadoPor: string;
}

export interface SeguimientoPago {
  id: string;
  pagoPendienteId: string;
  fecha: Date;
  accion: string;
  tipo: 'recordatorio' | 'contacto' | 'negociacion' | 'pago_parcial' | 'pago_completo' | 'legal' | 'otro';
  usuario: string;
  notas?: string;
  documentos?: string[];
  proximaSeguimiento?: Date;
}

export interface AccionCobro {
  id: string;
  fecha: Date;
  tipo: string;
  descripcion: string;
  usuario: string;
  resultado?: string;
}

// Tipo para ajuste de deuda (descuento o condonación)
export interface AjusteDeudaData {
  nuevoMonto: number; // Nuevo monto pendiente después del ajuste
  motivo: string; // Motivo obligatorio del ajuste
}

export interface ClasificacionRiesgo {
  pagoPendienteId: string;
  riesgo: RiesgoCobro;
  puntuacion: number; // 0-100
  factores: {
    historialPago: number;
    diasRetraso: number;
    monto: number;
    frecuenciaContacto: number;
    patronPago: number;
  };
  recomendaciones: string[];
  probabilidadCobro: number; // 0-100
  fechaEvaluacion: Date;
}

export interface EstrategiaCobro {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: EstrategiaCobro;
  nivelAplicacion: NivelMorosidad[];
  pasos: PasoEstrategia[];
  activa: boolean;
  fechaCreacion: Date;
}

export interface PasoEstrategia {
  orden: number;
  accion: string;
  descripcion: string;
  tiempoEstimado: number; // días
  responsable?: string;
}

export interface ReporteMorosidad {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  resumen: {
    totalPendientes: number;
    montoTotalPendiente: number;
    totalVencidos: number;
    montoTotalVencido: number;
    porNivel: {
      [key in NivelMorosidad]: {
        cantidad: number;
        monto: number;
      };
    };
  };
  tendencias: {
    fecha: Date;
    cantidad: number;
    monto: number;
  }[];
  clientesTopMorosos: {
    clienteId: string;
    clienteNombre: string;
    cantidadFacturas: number;
    montoTotal: number;
  }[];
  efectividadCobro: {
    recordatoriosEnviados: number;
    respuestasPositivas: number;
    pagosRecibidos: number;
    tasaExito: number;
  };
}

export interface EstadisticasMorosidad {
  totalPendientes: number;
  montoTotalPendiente: number;
  totalVencidos: number;
  montoTotalVencido: number;
  porNivel: {
    [key in NivelMorosidad]: {
      cantidad: number;
      monto: number;
    };
  };
  promedioDiasRetraso: number;
  tasaRecuperacion: number;
  casosCriticos: number;
}

export interface FiltroMorosidad {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  nivelMorosidad?: NivelMorosidad[];
  riesgo?: RiesgoCobro[];
  montoMin?: number;
  montoMax?: number;
  diasRetrasoMin?: number;
  diasRetrasoMax?: number;
  estrategiaCobro?: EstrategiaCobro;
  // Nuevos filtros simples
  vencidosMasDe15Dias?: boolean;
  montoMayorA?: number;
  sinContactoReciente?: boolean; // Sin contacto en los últimos 7 días
  excluirClientesDeConfianza?: boolean; // Para priorizar casos urgentes
}

// Reporte mensual simple
export interface ReporteMensualSimple {
  mes: number; // 1-12
  año: number;
  totalCobrado: number;
  totalPendiente: number;
  pagosRecibidos: {
    id: string;
    facturaId: string;
    numeroFactura: string;
    clienteNombre: string;
    monto: number;
    fechaPago: Date;
    metodoPago?: MetodoPago;
  }[];
  pagosFaltantes: {
    id: string;
    facturaId: string;
    numeroFactura: string;
    clienteNombre: string;
    montoPendiente: number;
    fechaVencimiento: Date;
    diasRetraso: number;
  }[];
}

// Tipos para Planes de Pago
export type EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
export type EstadoPlanPago = 'activo' | 'completado' | 'cancelado' | 'vencido';

export interface CuotaPlanPago {
  id: string;
  planPagoId: string;
  numeroCuota: number;
  monto: number;
  fechaVencimiento: Date;
  fechaPago?: Date;
  estado: EstadoCuota;
  metodoPago?: MetodoPago;
  nota?: string;
}

export interface PlanPago {
  id: string;
  pagoPendienteId: string;
  clienteId: string;
  clienteNombre: string;
  montoTotal: number;
  montoPagado: number;
  montoPendiente: number;
  numeroCuotas: number;
  cuotas: CuotaPlanPago[];
  fechaCreacion: Date;
  fechaInicio: Date;
  fechaFin?: Date;
  estado: EstadoPlanPago;
  notas?: string;
  creadoPor: string;
  fechaActualizacion: Date;
}
