import { 
  MovimientoBancario, 
  ConciliacionBancaria, 
  FiltroConciliacion,
  CuentaBancaria 
} from '../types';

// Mock data para desarrollo
const mockMovimientosBancarios: MovimientoBancario[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15T09:00:00'),
    banco: 'Banco de Bogotá',
    cuenta: '****1234',
    tipo: 'ingreso',
    monto: 500000,
    concepto: 'Transferencia cliente',
    referencia: 'TRF001234',
    conciliado: true,
    fechaConciliacion: new Date('2024-01-15T18:00:00')
  },
  {
    id: '2',
    fecha: new Date('2024-01-15T14:30:00'),
    banco: 'Banco de Bogotá',
    cuenta: '****1234',
    tipo: 'egreso',
    monto: 150000,
    concepto: 'Pago proveedor',
    referencia: 'PAG001234',
    conciliado: false
  },
  {
    id: '3',
    fecha: new Date('2024-01-14T16:45:00'),
    banco: 'Bancolombia',
    cuenta: '****5678',
    tipo: 'ingreso',
    monto: 300000,
    concepto: 'Depósito efectivo',
    referencia: 'DEP001234',
    conciliado: true,
    fechaConciliacion: new Date('2024-01-14T18:00:00')
  }
];

const mockConciliaciones: ConciliacionBancaria[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15T18:00:00'),
    banco: 'Banco de Bogotá',
    cuenta: '****1234',
    saldoInicial: 2000000,
    saldoFinal: 2350000,
    movimientosConciliados: ['1'],
    movimientosPendientes: ['2'],
    diferencias: [
      {
        id: '1',
        tipo: 'tiempo',
        descripcion: 'Pago proveedor pendiente de conciliar',
        montoEsperado: 150000,
        montoReal: 150000,
        fechaEsperada: new Date('2024-01-15T14:30:00'),
        resuelto: false
      }
    ],
    estado: 'pendiente'
  }
];

export class BancosService {
  // Movimientos bancarios
  static async obtenerMovimientosBancarios(filtros?: FiltroConciliacion): Promise<MovimientoBancario[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let movimientos = [...mockMovimientosBancarios];
    
    if (filtros) {
      if (filtros.banco) {
        movimientos = movimientos.filter(m => m.banco === filtros.banco);
      }
      if (filtros.cuenta) {
        movimientos = movimientos.filter(m => m.cuenta === filtros.cuenta);
      }
      if (filtros.fechaInicio) {
        movimientos = movimientos.filter(m => m.fecha >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        movimientos = movimientos.filter(m => m.fecha <= filtros.fechaFin!);
      }
      if (filtros.conciliado !== undefined) {
        movimientos = movimientos.filter(m => m.conciliado === filtros.conciliado);
      }
    }
    
    return movimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  static async importarMovimientosBancarios(archivo: File): Promise<MovimientoBancario[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular importación de archivo CSV/Excel
    const nuevosMovimientos: MovimientoBancario[] = [
      {
        id: Date.now().toString(),
        fecha: new Date(),
        banco: 'Banco Importado',
        cuenta: '****9999',
        tipo: 'ingreso',
        monto: 100000,
        concepto: 'Movimiento importado',
        referencia: 'IMP001',
        conciliado: false
      }
    ];
    
    mockMovimientosBancarios.push(...nuevosMovimientos);
    return nuevosMovimientos;
  }

  static async marcarConciliado(movimientoId: string): Promise<MovimientoBancario> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const movimiento = mockMovimientosBancarios.find(m => m.id === movimientoId);
    if (!movimiento) {
      throw new Error('Movimiento no encontrado');
    }
    
    movimiento.conciliado = true;
    movimiento.fechaConciliacion = new Date();
    
    return movimiento;
  }

  // Conciliaciones bancarias
  static async obtenerConciliaciones(): Promise<ConciliacionBancaria[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockConciliaciones].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  static async crearConciliacion(datos: {
    banco: string;
    cuenta: string;
    fechaInicio: Date;
    fechaFin: Date;
  }): Promise<ConciliacionBancaria> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Obtener movimientos del período
    const movimientos = mockMovimientosBancarios.filter(m => 
      m.banco === datos.banco &&
      m.cuenta === datos.cuenta &&
      m.fecha >= datos.fechaInicio &&
      m.fecha <= datos.fechaFin
    );
    
    const conciliados = movimientos.filter(m => m.conciliado).map(m => m.id);
    const pendientes = movimientos.filter(m => !m.conciliado).map(m => m.id);
    
    const saldoInicial = 2000000; // Mock
    const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
    const egresos = movimientos.filter(m => m.tipo === 'egreso').reduce((sum, m) => sum + m.monto, 0);
    const saldoFinal = saldoInicial + ingresos - egresos;
    
    const nuevaConciliacion: ConciliacionBancaria = {
      id: Date.now().toString(),
      fecha: new Date(),
      banco: datos.banco,
      cuenta: datos.cuenta,
      saldoInicial,
      saldoFinal,
      movimientosConciliados: conciliados,
      movimientosPendientes: pendientes,
      diferencias: pendientes.map(id => {
        const mov = movimientos.find(m => m.id === id)!;
        return {
          id: Date.now().toString() + Math.random(),
          tipo: 'tiempo' as const,
          descripcion: `${mov.concepto} pendiente de conciliar`,
          montoEsperado: mov.monto,
          montoReal: mov.monto,
          fechaEsperada: mov.fecha,
          resuelto: false
        };
      }),
      estado: pendientes.length > 0 ? 'pendiente' : 'completada'
    };
    
    mockConciliaciones.push(nuevaConciliacion);
    return nuevaConciliacion;
  }

  static async resolverDiferencia(conciliacionId: string, diferenciaId: string): Promise<ConciliacionBancaria> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const conciliacion = mockConciliaciones.find(c => c.id === conciliacionId);
    if (!conciliacion) {
      throw new Error('Conciliación no encontrada');
    }
    
    const diferencia = conciliacion.diferencias.find(d => d.id === diferenciaId);
    if (!diferencia) {
      throw new Error('Diferencia no encontrada');
    }
    
    diferencia.resuelto = true;
    
    // Verificar si todas las diferencias están resueltas
    const todasResueltas = conciliacion.diferencias.every(d => d.resuelto);
    if (todasResueltas && conciliacion.movimientosPendientes.length === 0) {
      conciliacion.estado = 'completada';
    }
    
    return conciliacion;
  }

  // Cuentas bancarias
  static async obtenerCuentasBancarias(): Promise<CuentaBancaria[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        banco: 'Banco de Bogotá',
        numeroCuenta: '****1234',
        tipoCuenta: 'corriente',
        saldoActual: 2500000,
        activa: true
      },
      {
        id: '2',
        banco: 'Bancolombia',
        numeroCuenta: '****5678',
        tipoCuenta: 'ahorros',
        saldoActual: 1800000,
        activa: true
      },
      {
        id: '3',
        banco: 'Davivienda',
        numeroCuenta: '****9012',
        tipoCuenta: 'corriente',
        saldoActual: 950000,
        activa: false
      }
    ];
  }

  static async actualizarSaldoCuenta(cuentaId: string, nuevoSaldo: number): Promise<CuentaBancaria> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En una implementación real, esto actualizaría la base de datos
    const cuenta: CuentaBancaria = {
      id: cuentaId,
      banco: 'Banco Mock',
      numeroCuenta: '****0000',
      tipoCuenta: 'corriente',
      saldoActual: nuevoSaldo,
      activa: true
    };
    
    return cuenta;
  }

  // Estadísticas bancarias
  static async obtenerEstadisticasBancarias(periodo: 'semana' | 'mes' | 'trimestre'): Promise<{
    totalIngresos: number;
    totalEgresos: number;
    saldoNeto: number;
    movimientosPendientes: number;
    porcentajeConciliado: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const ahora = new Date();
    let fechaInicio: Date;
    
    switch (periodo) {
      case 'semana':
        fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case 'trimestre':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
        break;
    }
    
    const movimientosPeriodo = mockMovimientosBancarios.filter(m => m.fecha >= fechaInicio);
    
    const totalIngresos = movimientosPeriodo
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const totalEgresos = movimientosPeriodo
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const movimientosPendientes = movimientosPeriodo.filter(m => !m.conciliado).length;
    const porcentajeConciliado = movimientosPeriodo.length > 0 
      ? ((movimientosPeriodo.length - movimientosPendientes) / movimientosPeriodo.length) * 100 
      : 100;
    
    return {
      totalIngresos,
      totalEgresos,
      saldoNeto: totalIngresos - totalEgresos,
      movimientosPendientes,
      porcentajeConciliado
    };
  }
}