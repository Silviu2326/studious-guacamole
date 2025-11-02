import { Factura, FiltroFacturas } from '../types';

// Mock data para desarrollo
const mockFacturas: Factura[] = [
  {
    id: '1',
    numeroFactura: 'FAC-2024-001',
    fechaEmision: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-01-30'),
    cliente: {
      id: 'cliente1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67'
    },
    items: [
      {
        id: 'item1',
        descripcion: 'Entrenamiento Personal - Enero',
        cantidad: 1,
        precioUnitario: 200000,
        subtotal: 200000,
        tipo: 'servicio'
      }
    ],
    subtotal: 200000,
    descuentos: 0,
    impuestos: 38000,
    total: 238000,
    tipo: 'servicios',
    estado: 'pendiente',
    pagos: [],
    montoPendiente: 238000,
    recordatoriosEnviados: 0,
    usuarioCreacion: 'entrenador1',
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15')
  },
  {
    id: '2',
    numeroFactura: 'FAC-2024-002',
    fechaEmision: new Date('2024-01-10'),
    fechaVencimiento: new Date('2024-01-25'),
    cliente: {
      id: 'cliente2',
      nombre: 'María García',
      email: 'maria@example.com',
      nit: '98765432-1'
    },
    items: [
      {
        id: 'item2',
        descripcion: 'Plan Nutricional Premium',
        cantidad: 1,
        precioUnitario: 150000,
        subtotal: 150000,
        tipo: 'servicio'
      },
      {
        id: 'item3',
        descripcion: 'Consulta Nutricional',
        cantidad: 2,
        precioUnitario: 80000,
        subtotal: 160000,
        tipo: 'servicio'
      }
    ],
    subtotal: 310000,
    descuentos: 10000,
    impuestos: 57000,
    total: 357000,
    tipo: 'adicionales',
    estado: 'pagada',
    metodoPago: 'transferencia',
    pagos: [
      {
        id: 'pago1',
        facturaId: '2',
        fecha: new Date('2024-01-12'),
        monto: 357000,
        metodoPago: 'transferencia',
        referencia: 'TXN-123456',
        usuario: 'sistema'
      }
    ],
    montoPendiente: 0,
    recordatoriosEnviados: 0,
    usuarioCreacion: 'entrenador1',
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2024-01-12')
  },
  {
    id: '3',
    numeroFactura: 'FAC-2024-003',
    fechaEmision: new Date('2024-01-05'),
    fechaVencimiento: new Date('2024-01-20'),
    cliente: {
      id: 'cliente3',
      nombre: 'Carlos Rodríguez',
      email: 'carlos@example.com'
    },
    items: [
      {
        id: 'item4',
        descripcion: 'Membresía Mensual',
        cantidad: 1,
        precioUnitario: 80000,
        subtotal: 80000,
        tipo: 'servicio'
      }
    ],
    subtotal: 80000,
    descuentos: 0,
    impuestos: 15200,
    total: 95200,
    tipo: 'recurrente',
    estado: 'vencida',
    pagos: [],
    montoPendiente: 95200,
    recordatoriosEnviados: 2,
    ultimoRecordatorio: new Date('2024-01-21'),
    usuarioCreacion: 'admin1',
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2024-01-21')
  }
];

export const facturasAPI = {
  // Obtener todas las facturas
  async obtenerFacturas(filtros?: FiltroFacturas): Promise<Factura[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let facturas = [...mockFacturas];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        facturas = facturas.filter(f => f.fechaEmision >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        facturas = facturas.filter(f => f.fechaEmision <= filtros.fechaFin!);
      }
      if (filtros.clienteId) {
        facturas = facturas.filter(f => f.cliente.id === filtros.clienteId);
      }
      if (filtros.estado) {
        facturas = facturas.filter(f => f.estado === filtros.estado);
      }
      if (filtros.tipo) {
        facturas = facturas.filter(f => f.tipo === filtros.tipo);
      }
      if (filtros.numeroFactura) {
        facturas = facturas.filter(f => 
          f.numeroFactura.toLowerCase().includes(filtros.numeroFactura!.toLowerCase())
        );
      }
    }
    
    return facturas.sort((a, b) => b.fechaEmision.getTime() - a.fechaEmision.getTime());
  },

  // Obtener una factura por ID
  async obtenerFactura(id: string): Promise<Factura | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFacturas.find(f => f.id === id) || null;
  },

  // Crear nueva factura
  async crearFactura(factura: Omit<Factura, 'id' | 'numeroFactura' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const numeroFactura = `FAC-${new Date().getFullYear()}-${String(mockFacturas.length + 1).padStart(3, '0')}`;
    const nuevaFactura: Factura = {
      ...factura,
      id: Date.now().toString(),
      numeroFactura,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    mockFacturas.push(nuevaFactura);
    return nuevaFactura;
  },

  // Actualizar factura
  async actualizarFactura(id: string, datos: Partial<Factura>): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockFacturas.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    mockFacturas[index] = {
      ...mockFacturas[index],
      ...datos,
      fechaActualizacion: new Date()
    };
    return mockFacturas[index];
  },

  // Eliminar factura
  async eliminarFactura(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockFacturas.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    mockFacturas.splice(index, 1);
  },

  // Marcar factura como pagada
  async marcarComoPagada(id: string): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockFacturas.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    mockFacturas[index] = {
      ...mockFacturas[index],
      estado: 'pagada',
      montoPendiente: 0,
      fechaActualizacion: new Date()
    };
    return mockFacturas[index];
  },

  // Exportar factura a PDF
  async exportarPDF(id: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simular generación de PDF
    return new Blob(['PDF Content'], { type: 'application/pdf' });
  }
};

