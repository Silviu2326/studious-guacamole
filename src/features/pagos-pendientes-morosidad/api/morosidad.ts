import { PagoPendiente, FiltroMorosidad, EstadisticasMorosidad } from '../types';

// Mock data para desarrollo
const mockPagosPendientes: PagoPendiente[] = [
  {
    id: '1',
    facturaId: 'factura1',
    numeroFactura: 'FAC-2024-001',
    cliente: {
      id: 'cliente1',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+57 300 123 4567'
    },
    fechaEmision: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-01-30'),
    fechaVencida: new Date('2024-02-02'),
    diasRetraso: 3,
    montoTotal: 238000,
    montoPendiente: 238000,
    nivelMorosidad: 'verde',
    estado: 'vencido',
    recordatoriosEnviados: 1,
    ultimoRecordatorio: new Date('2024-02-01'),
    riesgo: 'bajo',
    historialAcciones: [
      {
        id: 'acc1',
        fecha: new Date('2024-02-01'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio amigable enviado',
        usuario: 'sistema'
      }
    ],
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-02-01')
  },
  {
    id: '2',
    facturaId: 'factura2',
    numeroFactura: 'FAC-2024-005',
    cliente: {
      id: 'cliente2',
      nombre: 'María García',
      email: 'maria@example.com',
      telefono: '+57 300 234 5678'
    },
    fechaEmision: new Date('2024-01-10'),
    fechaVencimiento: new Date('2024-01-25'),
    fechaVencida: new Date('2024-01-26'),
    diasRetraso: 12,
    montoTotal: 357000,
    montoPendiente: 357000,
    nivelMorosidad: 'amarillo',
    estado: 'vencido',
    recordatoriosEnviados: 2,
    ultimoRecordatorio: new Date('2024-02-04'),
    proximoRecordatorio: new Date('2024-02-06'),
    riesgo: 'medio',
    estrategiaCobro: 'recordatorio_automatico',
    historialAcciones: [
      {
        id: 'acc2',
        fecha: new Date('2024-01-28'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio amigable enviado',
        usuario: 'sistema'
      },
      {
        id: 'acc3',
        fecha: new Date('2024-02-04'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio firme enviado',
        usuario: 'sistema'
      }
    ],
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2024-02-04')
  },
  {
    id: '3',
    facturaId: 'factura3',
    numeroFactura: 'FAC-2024-003',
    cliente: {
      id: 'cliente3',
      nombre: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      telefono: '+57 300 345 6789'
    },
    fechaEmision: new Date('2024-01-05'),
    fechaVencimiento: new Date('2024-01-20'),
    fechaVencida: new Date('2024-01-21'),
    diasRetraso: 25,
    montoTotal: 95200,
    montoPendiente: 95200,
    nivelMorosidad: 'naranja',
    estado: 'vencido',
    recordatoriosEnviados: 3,
    ultimoRecordatorio: new Date('2024-02-05'),
    proximoRecordatorio: new Date('2024-02-07'),
    riesgo: 'alto',
    estrategiaCobro: 'contacto_directo',
    notas: 'Cliente ha sido contactado, esperando respuesta',
    historialAcciones: [
      {
        id: 'acc4',
        fecha: new Date('2024-01-22'),
        tipo: 'recordatorio',
        descripcion: 'Recordatorio urgente enviado',
        usuario: 'sistema'
      },
      {
        id: 'acc5',
        fecha: new Date('2024-02-01'),
        tipo: 'contacto',
        descripcion: 'Llamada telefónica realizada',
        usuario: 'admin1',
        resultado: 'Cliente prometió pagar esta semana'
      }
    ],
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2024-02-05')
  },
  {
    id: '4',
    facturaId: 'factura4',
    numeroFactura: 'FAC-2023-045',
    cliente: {
      id: 'cliente4',
      nombre: 'Ana Martínez',
      email: 'ana@example.com',
      telefono: '+57 300 456 7890'
    },
    fechaEmision: new Date('2023-12-01'),
    fechaVencimiento: new Date('2023-12-15'),
    fechaVencida: new Date('2023-12-16'),
    diasRetraso: 58,
    montoTotal: 180000,
    montoPendiente: 180000,
    nivelMorosidad: 'negro',
    estado: 'vencido',
    recordatoriosEnviados: 8,
    ultimoRecordatorio: new Date('2024-01-15'),
    riesgo: 'critico',
    estrategiaCobro: 'legal',
    notas: 'Caso escalado a gestión legal',
    historialAcciones: [
      {
        id: 'acc6',
        fecha: new Date('2024-01-10'),
        tipo: 'legal',
        descripcion: 'Documentación enviada a asesor legal',
        usuario: 'admin1'
      }
    ],
    fechaCreacion: new Date('2023-12-01'),
    fechaActualizacion: new Date('2024-01-15')
  },
  {
    id: '5',
    facturaId: 'factura5',
    numeroFactura: 'FAC-2024-008',
    cliente: {
      id: 'cliente5',
      nombre: 'Luis Hernández',
      email: 'luis@example.com',
      telefono: '+57 300 567 8901'
    },
    fechaEmision: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-02-05'),
    fechaVencida: new Date('2024-02-06'),
    diasRetraso: 35,
    montoTotal: 420000,
    montoPendiente: 420000,
    nivelMorosidad: 'rojo',
    estado: 'vencido',
    recordatoriosEnviados: 5,
    ultimoRecordatorio: new Date('2024-02-08'),
    proximoRecordatorio: new Date('2024-02-10'),
    riesgo: 'critico',
    estrategiaCobro: 'negociacion',
    notas: 'Cliente solicita plan de pagos',
    historialAcciones: [
      {
        id: 'acc7',
        fecha: new Date('2024-02-08'),
        tipo: 'negociacion',
        descripcion: 'Reunión para negociar plan de pagos',
        usuario: 'admin1',
        resultado: 'Pendiente de respuesta del cliente'
      }
    ],
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-02-08')
  }
];

export const morosidadAPI = {
  // Obtener todos los pagos pendientes
  async obtenerPagosPendientes(filtros?: FiltroMorosidad): Promise<PagoPendiente[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let pagos = [...mockPagosPendientes];
    
    if (filtros) {
      if (filtros.fechaInicio) {
        pagos = pagos.filter(p => p.fechaVencida >= filtros.fechaInicio!);
      }
      if (filtros.fechaFin) {
        pagos = pagos.filter(p => p.fechaVencida <= filtros.fechaFin!);
      }
      if (filtros.clienteId) {
        pagos = pagos.filter(p => p.cliente.id === filtros.clienteId);
      }
      if (filtros.nivelMorosidad && filtros.nivelMorosidad.length > 0) {
        pagos = pagos.filter(p => filtros.nivelMorosidad!.includes(p.nivelMorosidad));
      }
      if (filtros.riesgo && filtros.riesgo.length > 0) {
        pagos = pagos.filter(p => filtros.riesgo!.includes(p.riesgo));
      }
      if (filtros.diasRetrasoMin) {
        pagos = pagos.filter(p => p.diasRetraso >= filtros.diasRetrasoMin!);
      }
      if (filtros.diasRetrasoMax) {
        pagos = pagos.filter(p => p.diasRetraso <= filtros.diasRetrasoMax!);
      }
      if (filtros.montoMin) {
        pagos = pagos.filter(p => p.montoPendiente >= filtros.montoMin!);
      }
      if (filtros.montoMax) {
        pagos = pagos.filter(p => p.montoPendiente <= filtros.montoMax!);
      }
    }
    
    return pagos.sort((a, b) => b.diasRetraso - a.diasRetraso);
  },

  // Obtener un pago pendiente por ID
  async obtenerPagoPendiente(id: string): Promise<PagoPendiente | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPagosPendientes.find(p => p.id === id) || null;
  },

  // Obtener estadísticas de morosidad
  async obtenerEstadisticas(): Promise<EstadisticasMorosidad> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const pagos = mockPagosPendientes;
    const totalPendientes = pagos.length;
    const montoTotalPendiente = pagos.reduce((sum, p) => sum + p.montoPendiente, 0);
    const vencidos = pagos.filter(p => p.diasRetraso > 0);
    const totalVencidos = vencidos.length;
    const montoTotalVencido = vencidos.reduce((sum, p) => sum + p.montoPendiente, 0);
    
    const porNivel = {
      verde: { cantidad: 0, monto: 0 },
      amarillo: { cantidad: 0, monto: 0 },
      naranja: { cantidad: 0, monto: 0 },
      rojo: { cantidad: 0, monto: 0 },
      negro: { cantidad: 0, monto: 0 }
    };
    
    pagos.forEach(p => {
      porNivel[p.nivelMorosidad].cantidad++;
      porNivel[p.nivelMorosidad].monto += p.montoPendiente;
    });
    
    const promedioDiasRetraso = pagos.length > 0
      ? pagos.reduce((sum, p) => sum + p.diasRetraso, 0) / pagos.length
      : 0;
    
    const casosCriticos = pagos.filter(p => p.riesgo === 'critico').length;
    
    return {
      totalPendientes,
      montoTotalPendiente,
      totalVencidos,
      montoTotalVencido,
      porNivel,
      promedioDiasRetraso,
      tasaRecuperacion: 0.75, // Mock
      casosCriticos
    };
  },

  // Actualizar estado de pago
  async actualizarEstado(id: string, estado: string, notas?: string): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      estado: estado as any,
      notas: notas || mockPagosPendientes[index].notas,
      fechaActualizacion: new Date()
    };
    
    return mockPagosPendientes[index];
  },

  // Marcar como pagado
  async marcarComoPagado(id: string): Promise<PagoPendiente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockPagosPendientes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pago pendiente no encontrado');
    }
    
    mockPagosPendientes[index] = {
      ...mockPagosPendientes[index],
      estado: 'pagado',
      montoPendiente: 0,
      fechaActualizacion: new Date()
    };
    
    return mockPagosPendientes[index];
  }
};

