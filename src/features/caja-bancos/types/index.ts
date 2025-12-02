// Tipos para el sistema de Caja & Bancos

export interface MovimientoCaja {
  id: string;
  fecha: Date;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  categoria: string;
  descripcion?: string;
  comprobante?: string;
  usuario: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

export interface ArqueoCaja {
  id: string;
  fecha: Date;
  usuario: string;
  montoSistema: number;
  montoFisico: number;
  diferencia: number;
  billetes: {
    [denominacion: string]: number;
  };
  monedas: {
    [denominacion: string]: number;
  };
  observaciones?: string;
  estado: 'abierto' | 'cerrado' | 'revisado';
}

export interface MovimientoBancario {
  id: string;
  fecha: Date;
  banco: string;
  cuenta: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  concepto: string;
  referencia?: string;
  conciliado: boolean;
  fechaConciliacion?: Date;
}

export interface ConciliacionBancaria {
  id: string;
  fecha: Date;
  banco: string;
  cuenta: string;
  saldoInicial: number;
  saldoFinal: number;
  movimientosConciliados: string[];
  movimientosPendientes: string[];
  diferencias: MovimientoDiferencia[];
  estado: 'pendiente' | 'completada' | 'revisada';
}

export interface MovimientoDiferencia {
  id: string;
  tipo: 'tiempo' | 'monto' | 'no_registrado';
  descripcion: string;
  montoEsperado?: number;
  montoReal?: number;
  fechaEsperada?: Date;
  fechaReal?: Date;
  resuelto: boolean;
}

export interface TransaccionTPV {
  id: string;
  fecha: Date;
  terminal: string;
  monto: number;
  tipo: 'venta' | 'devolucion';
  tarjeta: string; // últimos 4 dígitos
  autorizacion: string;
  lote: string;
  estado: 'aprobada' | 'rechazada' | 'cancelada';
}

export interface ReporteCaja {
  id: string;
  fecha: Date;
  periodo: 'diario' | 'semanal' | 'mensual';
  ingresosTotales: number;
  egresosTotales: number;
  saldoNeto: number;
  movimientosPorCategoria: {
    [categoria: string]: number;
  };
  movimientosPorMetodo: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
  };
  diferenciasEncontradas: number;
  observaciones?: string;
}

export interface ConfiguracionCaja {
  denominacionesBilletes: number[];
  denominacionesMonedas: number[];
  limiteEfectivo: number;
  alertaDiferencia: number;
  requiereAutorizacion: boolean;
  terminalesTPV: string[];
  cuentasBancarias: CuentaBancaria[];
}

export interface CuentaBancaria {
  id: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: 'corriente' | 'ahorros';
  saldoActual: number;
  activa: boolean;
}

// Estados de la aplicación
export interface CajaBancosState {
  movimientos: MovimientoCaja[];
  arqueos: ArqueoCaja[];
  movimientosBancarios: MovimientoBancario[];
  conciliaciones: ConciliacionBancaria[];
  transaccionesTPV: TransaccionTPV[];
  reportes: ReporteCaja[];
  configuracion: ConfiguracionCaja;
  loading: boolean;
  error: string | null;
}

// Filtros y búsquedas
export interface FiltroMovimientos {
  fechaInicio?: Date;
  fechaFin?: Date;
  tipo?: 'ingreso' | 'egreso';
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
  categoria?: string;
  estado?: 'pendiente' | 'confirmado' | 'cancelado';
  montoMin?: number;
  montoMax?: number;
}

export interface FiltroConciliacion {
  banco?: string;
  cuenta?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: 'pendiente' | 'completada' | 'revisada';
  conciliado?: boolean;
}