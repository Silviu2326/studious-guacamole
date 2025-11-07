// Tipos para el sistema de Pagos Pendientes & Morosidad

export type NivelMorosidad = 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'negro';
export type EstadoPago = 'pendiente' | 'vencido' | 'pagado' | 'en_proceso' | 'cancelado';
export type TipoRecordatorio = 'amigable' | 'firme' | 'urgente' | 'escalado';
export type MedioRecordatorio = 'email' | 'sms' | 'whatsapp' | 'llamada';
export type RiesgoCobro = 'bajo' | 'medio' | 'alto' | 'critico';
export type EstrategiaCobro = 'recordatorio_automatico' | 'contacto_directo' | 'negociacion' | 'legal';

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
  historialAcciones: AccionCobro[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
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
}
