import { Cobro, Pago, FiltroCobros } from '../types';

// Mock data para desarrollo
const mockCobros: Cobro[] = [
  {
    id: 'cobro1',
    facturaId: '2',
    fechaCobro: new Date('2024-01-12'),
    monto: 357000,
    metodoPago: 'transferencia',
    referencia: 'TXN-123456',
    estado: 'confirmado',
    usuario: 'sistema',
    notas: 'Pago completo recibido'
  }
];

const mockPagos: Pago[] = [
  {
    id: 'pago1',
    facturaId: '2',
    fecha: new Date('2024-01-12'),
    monto: 357000,
    metodoPago: 'transferencia',
    referencia: 'TXN-123456',
    usuario: 'sistema'
  }
];

export const cobrosAPI = {
  // Obtener todos los cobros
  async obtenerCobros(filtros?: FiltroCobros): Promise<Cobro[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let cobros = [...mockCobros];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        cobros = cobros.filter(c => c.fechaCobro >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        cobros = cobros.filter(c => c.fechaCobro <= filtros.fechaFin!);
      }
      if (filtros.facturaId) {
        cobros = cobros.filter(c => c.facturaId === filtros.facturaId);
      }
      if (filtros.metodoPago) {
        cobros = cobros.filter(c => c.metodoPago === filtros.metodoPago);
      }
      if (filtros.estado) {
        cobros = cobros.filter(c => c.estado === filtros.estado);
      }
    }
    
    return cobros.sort((a, b) => b.fechaCobro.getTime() - a.fechaCobro.getTime());
  },

  // Obtener un cobro por ID
  async obtenerCobro(id: string): Promise<Cobro | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCobros.find(c => c.id === id) || null;
  },

  // Registrar nuevo cobro
  async registrarCobro(cobro: Omit<Cobro, 'id'>): Promise<Cobro> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoCobro: Cobro = {
      ...cobro,
      id: Date.now().toString()
    };
    
    mockCobros.push(nuevoCobro);
    
    // También crear el pago asociado
    const nuevoPago: Pago = {
      id: `pago-${nuevoCobro.id}`,
      facturaId: cobro.facturaId,
      fecha: cobro.fechaCobro,
      monto: cobro.monto,
      metodoPago: cobro.metodoPago,
      referencia: cobro.referencia,
      usuario: cobro.usuario,
      notas: cobro.notas
    };
    mockPagos.push(nuevoPago);
    
    return nuevoCobro;
  },

  // Obtener pagos de una factura
  async obtenerPagosFactura(facturaId: string): Promise<Pago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPagos.filter(p => p.facturaId === facturaId);
  },

  // Actualizar estado de cobro
  async actualizarEstadoCobro(id: string, estado: 'pendiente' | 'confirmado' | 'rechazado'): Promise<Cobro> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockCobros.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cobro no encontrado');
    }
    
    mockCobros[index] = {
      ...mockCobros[index],
      estado
    };
    return mockCobros[index];
  },

  // Eliminar cobro
  async eliminarCobro(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockCobros.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cobro no encontrado');
    }
    
    mockCobros.splice(index, 1);
  }
};

