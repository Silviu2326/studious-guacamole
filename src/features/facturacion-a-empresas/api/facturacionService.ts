import { 
  Factura, 
  RespuestaFacturas, 
  FiltrosFacturas,
  KPIsFacturacion,
  NuevaFactura,
  NuevoPago,
  Empresa
} from '../types';

// Mock data para desarrollo
const mockFacturas: Factura[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'CORP-2024-001',
    company: {
      id: 'comp_001',
      name: 'Innovate Corp'
    },
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'),
    totalAmount: 4000,
    balanceDue: 4000,
    status: 'sent',
    lineItems: [
      {
        id: 'li_001',
        description: 'Acceso Corporativo - 80 empleados',
        quantity: 80,
        unitPrice: 45,
        total: 3600,
        taxRate: 19
      },
      {
        id: 'li_002',
        description: 'Servicios de entrenamiento personalizado',
        quantity: 10,
        unitPrice: 40,
        total: 400,
        taxRate: 19
      }
    ],
    taxAmount: 760,
    subtotal: 4000,
    currency: 'EUR',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'inv_002',
    invoiceNumber: 'CORP-2024-002',
    company: {
      id: 'comp_002',
      name: 'Global Tech'
    },
    issueDate: new Date('2024-01-02'),
    dueDate: new Date('2024-02-01'),
    totalAmount: 6000,
    balanceDue: 2000,
    status: 'partially_paid',
    lineItems: [
      {
        id: 'li_003',
        description: 'Acceso Corporativo - 120 empleados',
        quantity: 120,
        unitPrice: 50,
        total: 6000,
        taxRate: 19
      }
    ],
    taxAmount: 1140,
    subtotal: 6000,
    currency: 'EUR',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'inv_003',
    invoiceNumber: 'CORP-2024-003',
    company: {
      id: 'comp_003',
      name: 'HealthFirst Partners'
    },
    issueDate: new Date('2024-12-01'),
    dueDate: new Date('2023-12-31'),
    totalAmount: 12000,
    balanceDue: 12000,
    status: 'overdue',
    lineItems: [
      {
        id: 'li_004',
        description: 'Programa Wellness Completo - 200 empleados',
        quantity: 200,
        unitPrice: 60,
        total: 12000,
        taxRate: 19
      }
    ],
    taxAmount: 2280,
    subtotal: 12000,
    currency: 'EUR',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'inv_004',
    invoiceNumber: 'CORP-2024-004',
    company: {
      id: 'comp_001',
      name: 'Innovate Corp'
    },
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-29'),
    totalAmount: 2400,
    balanceDue: 0,
    status: 'paid',
    lineItems: [
      {
        id: 'li_005',
        description: 'Acceso Corporativo - 50 empleados',
        quantity: 50,
        unitPrice: 40,
        total: 2000,
        taxRate: 19
      },
      {
        id: 'li_006',
        description: 'Servicios adicionales',
        quantity: 1,
        unitPrice: 400,
        total: 400,
        taxRate: 19
      }
    ],
    taxAmount: 456,
    subtotal: 2400,
    currency: 'EUR',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'inv_005',
    invoiceNumber: 'CORP-2024-005',
    company: {
      id: 'comp_004',
      name: 'Tech Solutions Inc'
    },
    issueDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-31'),
    totalAmount: 3500,
    balanceDue: 3500,
    status: 'draft',
    lineItems: [
      {
        id: 'li_007',
        description: 'Acceso Corporativo - 70 empleados',
        quantity: 70,
        unitPrice: 50,
        total: 3500,
        taxRate: 19
      }
    ],
    taxAmount: 665,
    subtotal: 3500,
    currency: 'EUR',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

const mockEmpresas: Empresa[] = [
  {
    id: 'comp_001',
    name: 'Innovate Corp',
    taxId: 'B12345678',
    email: 'finanzas@innovatecorp.com',
    phone: '+34 912 345 678',
    address: 'Calle Principal 123, Madrid',
    contactPerson: 'María González',
    active: true
  },
  {
    id: 'comp_002',
    name: 'Global Tech',
    taxId: 'B87654321',
    email: 'accounting@globaltech.com',
    phone: '+34 987 654 321',
    address: 'Avenida Tecnología 456, Barcelona',
    contactPerson: 'Juan Martínez',
    active: true
  },
  {
    id: 'comp_003',
    name: 'HealthFirst Partners',
    taxId: 'B11223344',
    email: 'finance@healthfirst.com',
    phone: '+34 911 222 333',
    address: 'Plaza Salud 789, Valencia',
    contactPerson: 'Ana López',
    active: true
  },
  {
    id: 'comp_004',
    name: 'Tech Solutions Inc',
    taxId: 'B99887766',
    email: 'contabilidad@techsolutions.com',
    phone: '+34 933 444 555',
    address: 'Calle Digital 321, Sevilla',
    contactPerson: 'Carlos Ruiz',
    active: true
  }
];

export class FacturacionService {
  // Obtener facturas con filtros y paginación
  static async obtenerFacturas(filtros?: FiltrosFacturas): Promise<RespuestaFacturas> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let facturas = [...mockFacturas];
    
    // Aplicar filtros
    if (filtros) {
      if (filtros.status) {
        facturas = facturas.filter(f => f.status === filtros.status);
      }
      if (filtros.companyId) {
        facturas = facturas.filter(f => f.company.id === filtros.companyId);
      }
      if (filtros.dateFrom) {
        facturas = facturas.filter(f => f.issueDate >= filtros.dateFrom!);
      }
      if (filtros.dateTo) {
        facturas = facturas.filter(f => f.issueDate <= filtros.dateTo!);
      }
      if (filtros.query) {
        const query = filtros.query.toLowerCase();
        facturas = facturas.filter(f => 
          f.invoiceNumber.toLowerCase().includes(query) ||
          f.company.name.toLowerCase().includes(query)
        );
      }
    }
    
    // Ordenar
    if (filtros?.sortBy) {
      const [key, direction] = filtros.sortBy.split(',');
      facturas.sort((a, b) => {
        const aVal = (a as any)[key];
        const bVal = (b as any)[key];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return direction === '-' ? -comparison : comparison;
      });
    } else {
      facturas.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
    }
    
    // Paginación
    const page = filtros?.page || 1;
    const limit = filtros?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = facturas.slice(start, end);
    
    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(facturas.length / limit),
        totalItems: facturas.length,
        limit
      }
    };
  }

  // Obtener factura por ID
  static async obtenerFacturaPorId(id: string): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const factura = mockFacturas.find(f => f.id === id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    return factura;
  }

  // Crear nueva factura
  static async crearFactura(datos: NuevaFactura): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const empresa = mockEmpresas.find(e => e.id === datos.companyId);
    if (!empresa) {
      throw new Error('Empresa no encontrada');
    }
    
    // Calcular totales
    const subtotal = datos.lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = datos.lineItems.reduce((sum, item) => {
      return sum + (item.total * (item.taxRate || 0) / 100);
    }, 0);
    const totalAmount = subtotal + taxAmount;
    
    // Generar número de factura
    const year = new Date().getFullYear();
    const invoiceNumber = `CORP-${year}-${String(mockFacturas.length + 1).padStart(3, '0')}`;
    
    const nuevaFactura: Factura = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      company: {
        id: empresa.id,
        name: empresa.name
      },
      issueDate: datos.issueDate,
      dueDate: datos.dueDate,
      totalAmount,
      balanceDue: totalAmount,
      status: 'draft',
      lineItems: datos.lineItems.map((item, idx) => ({
        ...item,
        id: `li_${Date.now()}_${idx}`
      })),
      taxAmount,
      subtotal,
      currency: 'EUR',
      notes: datos.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockFacturas.unshift(nuevaFactura);
    return nuevaFactura;
  }

  // Registrar pago
  static async registrarPago(datos: NuevoPago): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const factura = mockFacturas.find(f => f.id === datos.invoiceId);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    // Verificar que el pago no exceda el saldo pendiente
    if (datos.amount > factura.balanceDue) {
      throw new Error('El monto del pago excede el saldo pendiente');
    }
    
    // Actualizar factura
    factura.balanceDue = factura.balanceDue - datos.amount;
    
    if (factura.balanceDue === 0) {
      factura.status = 'paid';
    } else if (factura.status === 'sent' || factura.status === 'overdue') {
      factura.status = 'partially_paid';
    }
    
    factura.updatedAt = new Date();
    
    return factura;
  }

  // Enviar factura
  static async enviarFactura(id: string): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const factura = mockFacturas.find(f => f.id === id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    if (factura.status !== 'draft') {
      throw new Error('Solo se pueden enviar facturas en borrador');
    }
    
    factura.status = 'sent';
    factura.updatedAt = new Date();
    
    return factura;
  }

  // Anular factura
  static async anularFactura(id: string): Promise<Factura> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const factura = mockFacturas.find(f => f.id === id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    if (factura.status === 'paid') {
      throw new Error('No se pueden anular facturas pagadas');
    }
    
    factura.status = 'void';
    factura.updatedAt = new Date();
    
    return factura;
  }

  // Descargar PDF (simulado)
  static async descargarPDF(id: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const factura = mockFacturas.find(f => f.id === id);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    // En producción, esto generaría un PDF real
    const content = `Factura ${factura.invoiceNumber}\nEmpresa: ${factura.company.name}\nTotal: ${factura.totalAmount} EUR`;
    return new Blob([content], { type: 'application/pdf' });
  }

  // Obtener KPIs
  static async obtenerKPIs(periodo: 'month' | 'quarter' | 'year' = 'month'): Promise<KPIsFacturacion> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ahora = new Date();
    let fechaInicio: Date;
    
    switch (periodo) {
      case 'month':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case 'quarter':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
        break;
      case 'year':
        fechaInicio = new Date(ahora.getFullYear(), 0, 1);
        break;
    }
    
    const facturasPeriodo = mockFacturas.filter(f => f.issueDate >= fechaInicio);
    
    const totalFacturado = facturasPeriodo.reduce((sum, f) => sum + f.totalAmount, 0);
    const totalCobrado = facturasPeriodo.reduce((sum, f) => sum + (f.totalAmount - f.balanceDue), 0);
    const cuentasPorCobrar = facturasPeriodo.reduce((sum, f) => sum + f.balanceDue, 0);
    
    // Calcular DSO (días promedio de cobro)
    const facturasPagadas = facturasPeriodo.filter(f => f.status === 'paid');
    const now = new Date();
    const diasPromedioCobro = facturasPagadas.length > 0
      ? facturasPagadas.reduce((sum, f) => {
          const dias = Math.floor((now.getTime() - f.issueDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + dias;
        }, 0) / facturasPagadas.length
      : 0;
    
    // Porcentaje de facturas vencidas
    const facturasVencidas = facturasPeriodo.filter(f => f.status === 'overdue').length;
    const porcentajeFacturasVencidas = facturasPeriodo.length > 0
      ? (facturasVencidas / facturasPeriodo.length) * 100
      : 0;
    
    // Ingreso promedio por cuenta
    const empresasUnicas = new Set(facturasPeriodo.map(f => f.company.id));
    const ingresoPromedioPorCuenta = empresasUnicas.size > 0
      ? totalFacturado / empresasUnicas.size
      : 0;
    
    return {
      totalFacturado,
      totalCobrado,
      cuentasPorCobrar,
      diasPromedioCobro: Math.round(diasPromedioCobro),
      porcentajeFacturasVencidas,
      ingresoPromedioPorCuenta,
      periodo
    };
  }

  // Obtener empresas
  static async obtenerEmpresas(): Promise<Empresa[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEmpresas.filter(e => e.active);
  }

  // Exportar a CSV (simulado)
  static async exportarCSV(filtros?: FiltrosFacturas): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data } = await this.obtenerFacturas({ ...filtros, limit: 1000 });
    
    const headers = ['Número', 'Empresa', 'Fecha Emisión', 'Fecha Vencimiento', 'Total', 'Saldo Pendiente', 'Estado'];
    const rows = data.map(f => [
      f.invoiceNumber,
      f.company.name,
      f.issueDate.toLocaleDateString('es-ES'),
      f.dueDate.toLocaleDateString('es-ES'),
      f.totalAmount.toString(),
      f.balanceDue.toString(),
      f.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

