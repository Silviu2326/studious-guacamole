// API para obtener y descargar facturas del cliente
export interface FacturaCliente {
  id: string;
  numeroFactura: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  monto: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
  tipo: 'recurrente' | 'servicios' | 'adicionales';
  descripcion: string;
}

const mockFacturas: FacturaCliente[] = [
  {
    id: '1',
    numeroFactura: 'FAC-2024-001',
    fechaEmision: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-01-30'),
    monto: 238000,
    estado: 'pagada',
    tipo: 'recurrente',
    descripcion: 'Membresía Premium - Enero 2024'
  },
  {
    id: '2',
    numeroFactura: 'FAC-2024-002',
    fechaEmision: new Date('2024-02-15'),
    fechaVencimiento: new Date('2024-02-28'),
    monto: 238000,
    estado: 'pagada',
    tipo: 'recurrente',
    descripcion: 'Membresía Premium - Febrero 2024'
  },
  {
    id: '3',
    numeroFactura: 'FAC-2024-003',
    fechaEmision: new Date('2024-03-15'),
    fechaVencimiento: new Date('2024-03-30'),
    monto: 238000,
    estado: 'pendiente',
    tipo: 'recurrente',
    descripcion: 'Membresía Premium - Marzo 2024'
  },
  {
    id: '4',
    numeroFactura: 'FAC-2024-004',
    fechaEmision: new Date('2024-02-10'),
    fechaVencimiento: new Date('2024-02-25'),
    monto: 150000,
    estado: 'pagada',
    tipo: 'adicionales',
    descripcion: 'Plan Nutricional Premium'
  }
];

export const facturasAPI = {
  async obtenerFacturas(): Promise<FacturaCliente[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFacturas.sort((a, b) => b.fechaEmision.getTime() - a.fechaEmision.getTime());
  },

  async descargarFactura(id: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const factura = mockFacturas.find(f => f.id === id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    // Simular generación de PDF
    return new Blob(['PDF Content'], { type: 'application/pdf' });
  }
};

