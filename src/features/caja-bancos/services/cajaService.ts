import { 
  MovimientoCaja, 
  ArqueoCaja, 
  FiltroMovimientos,
  ConfiguracionCaja 
} from '../types';

// Mock data para desarrollo
const mockMovimientos: MovimientoCaja[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15T10:30:00'),
    tipo: 'ingreso',
    concepto: 'Pago mensualidad',
    monto: 50000,
    metodoPago: 'efectivo',
    categoria: 'Membresías',
    descripcion: 'Pago mensualidad enero - Juan Pérez',
    usuario: 'recepcion1',
    estado: 'confirmado'
  },
  {
    id: '2',
    fecha: new Date('2024-01-15T11:15:00'),
    tipo: 'ingreso',
    concepto: 'Venta producto',
    monto: 25000,
    metodoPago: 'tarjeta',
    categoria: 'Retail',
    descripcion: 'Proteína whey - María García',
    usuario: 'recepcion1',
    estado: 'confirmado'
  },
  {
    id: '3',
    fecha: new Date('2024-01-15T14:20:00'),
    tipo: 'egreso',
    concepto: 'Compra insumos',
    monto: 15000,
    metodoPago: 'efectivo',
    categoria: 'Gastos operativos',
    descripcion: 'Productos de limpieza',
    usuario: 'admin1',
    estado: 'confirmado'
  }
];

const mockArqueos: ArqueoCaja[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15T18:00:00'),
    usuario: 'recepcion1',
    montoSistema: 235000,
    montoFisico: 234500,
    diferencia: -500,
    billetes: {
      '50000': 3,
      '20000': 4,
      '10000': 2,
      '5000': 1,
      '2000': 2,
      '1000': 1
    },
    monedas: {
      '500': 10,
      '200': 5,
      '100': 15,
      '50': 8
    },
    observaciones: 'Diferencia menor, posible error en cambio',
    estado: 'cerrado'
  }
];

const mockConfiguracion: ConfiguracionCaja = {
  denominacionesBilletes: [100000, 50000, 20000, 10000, 5000, 2000, 1000],
  denominacionesMonedas: [1000, 500, 200, 100, 50],
  limiteEfectivo: 500000,
  alertaDiferencia: 1000,
  requiereAutorizacion: true,
  terminalesTPV: ['TPV001', 'TPV002'],
  cuentasBancarias: [
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
    }
  ]
};

export class CajaService {
  // Movimientos de caja
  static async obtenerMovimientos(filtros?: FiltroMovimientos): Promise<MovimientoCaja[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let movimientos = [...mockMovimientos];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        movimientos = movimientos.filter(m => m.fecha >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        movimientos = movimientos.filter(m => m.fecha <= filtros.fechaFin!);
      }
      if (filtros.tipo) {
        movimientos = movimientos.filter(m => m.tipo === filtros.tipo);
      }
      if (filtros.metodoPago) {
        movimientos = movimientos.filter(m => m.metodoPago === filtros.metodoPago);
      }
      if (filtros.categoria) {
        movimientos = movimientos.filter(m => m.categoria === filtros.categoria);
      }
      if (filtros.estado) {
        movimientos = movimientos.filter(m => m.estado === filtros.estado);
      }
    }
    
    return movimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  static async crearMovimiento(movimiento: Omit<MovimientoCaja, 'id'>): Promise<MovimientoCaja> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoMovimiento: MovimientoCaja = {
      ...movimiento,
      id: Date.now().toString()
    };
    
    mockMovimientos.push(nuevoMovimiento);
    return nuevoMovimiento;
  }

  static async actualizarMovimiento(id: string, datos: Partial<MovimientoCaja>): Promise<MovimientoCaja> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockMovimientos.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Movimiento no encontrado');
    }
    
    mockMovimientos[index] = { ...mockMovimientos[index], ...datos };
    return mockMovimientos[index];
  }

  static async eliminarMovimiento(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockMovimientos.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Movimiento no encontrado');
    }
    
    mockMovimientos.splice(index, 1);
  }

  // Arqueos de caja
  static async obtenerArqueos(): Promise<ArqueoCaja[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockArqueos].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  static async crearArqueo(arqueo: Omit<ArqueoCaja, 'id'>): Promise<ArqueoCaja> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoArqueo: ArqueoCaja = {
      ...arqueo,
      id: Date.now().toString()
    };
    
    mockArqueos.push(nuevoArqueo);
    return nuevoArqueo;
  }

  static async obtenerArqueoActual(): Promise<ArqueoCaja | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return mockArqueos.find(a => {
      const fechaArqueo = new Date(a.fecha);
      fechaArqueo.setHours(0, 0, 0, 0);
      return fechaArqueo.getTime() === hoy.getTime();
    }) || null;
  }

  // Configuración
  static async obtenerConfiguracion(): Promise<ConfiguracionCaja> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...mockConfiguracion };
  }

  static async actualizarConfiguracion(config: Partial<ConfiguracionCaja>): Promise<ConfiguracionCaja> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    Object.assign(mockConfiguracion, config);
    return { ...mockConfiguracion };
  }

  // Estadísticas y reportes
  static async obtenerEstadisticasDiarias(fecha: Date): Promise<{
    ingresos: number;
    egresos: number;
    saldo: number;
    movimientos: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const fechaStr = fecha.toDateString();
    const movimientosDia = mockMovimientos.filter(m => 
      m.fecha.toDateString() === fechaStr && m.estado === 'confirmado'
    );
    
    const ingresos = movimientosDia
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresos = movimientosDia
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + m.monto, 0);
    
    return {
      ingresos,
      egresos,
      saldo: ingresos - egresos,
      movimientos: movimientosDia.length
    };
  }

  static async calcularSaldoCaja(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const movimientosConfirmados = mockMovimientos.filter(m => m.estado === 'confirmado');
    const ingresos = movimientosConfirmados
      .filter(m => m.tipo === 'ingreso' && m.metodoPago === 'efectivo')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresos = movimientosConfirmados
      .filter(m => m.tipo === 'egreso' && m.metodoPago === 'efectivo')
      .reduce((sum, m) => sum + m.monto, 0);
    
    return ingresos - egresos;
  }
}