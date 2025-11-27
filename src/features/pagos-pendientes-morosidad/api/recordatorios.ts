import { RecordatorioPago, TipoRecordatorio, MedioRecordatorio, Recordatorio } from '../types';

// Mock data para desarrollo
const mockRecordatorios: RecordatorioPago[] = [
  {
    id: 'rec1',
    pagoPendienteId: '1',
    tipo: 'amigable',
    medio: 'email',
    fechaEnvio: new Date('2024-02-01'),
    contenido: 'Estimado Juan, le recordamos que tiene un pago pendiente de $238,000 con fecha de vencimiento el 30/01/2024. Agradecemos su pronta atención.',
    estado: 'enviado'
  },
  {
    id: 'rec2',
    pagoPendienteId: '2',
    tipo: 'amigable',
    medio: 'email',
    fechaEnvio: new Date('2024-01-28'),
    contenido: 'Recordatorio amigable de pago pendiente',
    estado: 'enviado'
  },
  {
    id: 'rec3',
    pagoPendienteId: '2',
    tipo: 'firme',
    medio: 'sms',
    fechaEnvio: new Date('2024-02-04'),
    contenido: 'Sr/Sra García: Su factura FAC-2024-005 por $357,000 está vencida. Por favor, realice el pago a la brevedad.',
    estado: 'enviado',
    siguienteRecordatorio: new Date('2024-02-06')
  },
  {
    id: 'rec4',
    pagoPendienteId: '3',
    tipo: 'urgente',
    medio: 'whatsapp',
    fechaEnvio: new Date('2024-02-05'),
    contenido: 'URGENTE: Su factura FAC-2024-003 está vencida hace 25 días. Contacte con nosotros inmediatamente.',
    estado: 'enviado',
    siguienteRecordatorio: new Date('2024-02-07')
  }
];

export const recordatoriosAPI = {
  // Obtener recordatorios de un pago pendiente
  async obtenerRecordatorios(pagoPendienteId: string): Promise<RecordatorioPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecordatorios.filter(r => r.pagoPendienteId === pagoPendienteId);
  },

  // Obtener todos los recordatorios
  async obtenerTodosRecordatorios(): Promise<RecordatorioPago[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRecordatorios;
  },

  // Crear nuevo recordatorio
  async crearRecordatorio(recordatorio: Omit<RecordatorioPago, 'id' | 'fechaEnvio'>): Promise<RecordatorioPago> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const nuevoRecordatorio: RecordatorioPago = {
      ...recordatorio,
      id: Date.now().toString(),
      fechaEnvio: new Date()
    };
    
    mockRecordatorios.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Enviar recordatorio
  async enviarRecordatorio(id: string): Promise<RecordatorioPago> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockRecordatorios.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Recordatorio no encontrado');
    }
    
    mockRecordatorios[index] = {
      ...mockRecordatorios[index],
      estado: 'enviado',
      fechaEnvio: new Date()
    };
    
    return mockRecordatorios[index];
  },

  // Programar recordatorio
  async programarRecordatorio(
    pagoPendienteId: string,
    tipo: TipoRecordatorio,
    medio: MedioRecordatorio,
    contenido: string,
    fechaProgramada: Date
  ): Promise<RecordatorioPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoRecordatorio: RecordatorioPago = {
      id: Date.now().toString(),
      pagoPendienteId,
      tipo,
      medio,
      fechaEnvio: new Date(),
      fechaProgramada,
      contenido,
      estado: 'pendiente'
    };
    
    mockRecordatorios.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Cancelar recordatorio
  async cancelarRecordatorio(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatorios.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Recordatorio no encontrado');
    }
    
    mockRecordatorios[index] = {
      ...mockRecordatorios[index],
      estado: 'cancelado'
    };
  }
};

// ============================================================================
// API DE RECORDATORIOS (Tipo Recordatorio)
// ============================================================================
// 
// Este módulo proporciona funciones mock para gestionar recordatorios de pago
// utilizando el tipo Recordatorio. Los datos generados aquí serán consumidos
// por los siguientes componentes:
// - GestorRecordatorios.tsx: Para gestionar y programar recordatorios
// - AlertasVencidos.tsx: Para mostrar alertas y recordatorios de pagos vencidos
//
// ============================================================================

/**
 * Filtros para obtener recordatorios programados
 */
export interface FiltrosRecordatoriosProgramados {
  clienteId?: string;
  facturaId?: string;
  planPagoId?: string;
  canal?: Recordatorio['canal'][];
  tipo?: Recordatorio['tipo'][];
  estadoEnvio?: Recordatorio['estadoEnvio'][];
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// Mock data para recordatorios con distintos canales y tipos
const mockRecordatoriosData: Recordatorio[] = [
  // Recordatorios por email
  {
    id: 'rec-email-1',
    clienteId: 'cliente-1',
    facturaId: 'factura-1',
    fechaProgramada: new Date('2024-02-15'),
    fechaEnviado: new Date('2024-02-15'),
    canal: 'email',
    tipo: 'recordatorioVencido',
    estadoEnvio: 'enviado',
    mensaje: 'Estimado cliente, le recordamos que tiene un pago vencido por la factura FAC-2024-001. Monto pendiente: $238,000 COP.'
  },
  {
    id: 'rec-email-2',
    clienteId: 'cliente-2',
    planPagoId: 'plan-1',
    fechaProgramada: new Date('2024-02-20'),
    canal: 'email',
    tipo: 'recordatorioPlan',
    estadoEnvio: 'pendiente',
    mensaje: 'Recordatorio de cuota del plan de pago. Próxima cuota vence el 25/02/2024.'
  },
  {
    id: 'rec-email-3',
    clienteId: 'cliente-3',
    fechaProgramada: new Date('2024-02-18'),
    fechaEnviado: new Date('2024-02-18'),
    canal: 'email',
    tipo: 'recordatorioGeneral',
    estadoEnvio: 'enviado',
    mensaje: 'Recordatorio general de pago pendiente. Por favor, revise su estado de cuenta.'
  },
  
  // Recordatorios por teléfono
  {
    id: 'rec-telefono-1',
    clienteId: 'cliente-1',
    facturaId: 'factura-2',
    fechaProgramada: new Date('2024-02-16'),
    fechaEnviado: new Date('2024-02-16'),
    canal: 'telefono',
    tipo: 'recordatorioVencido',
    estadoEnvio: 'enviado',
    mensaje: 'Llamada realizada: Recordatorio de pago vencido. Cliente comprometido a pagar antes del 20/02/2024.'
  },
  {
    id: 'rec-telefono-2',
    clienteId: 'cliente-4',
    planPagoId: 'plan-2',
    fechaProgramada: new Date('2024-02-22'),
    canal: 'telefono',
    tipo: 'recordatorioPlan',
    estadoEnvio: 'pendiente',
    mensaje: 'Programar llamada para recordar cuota del plan de pago.'
  },
  {
    id: 'rec-telefono-3',
    clienteId: 'cliente-5',
    fechaProgramada: new Date('2024-02-19'),
    canal: 'telefono',
    tipo: 'recordatorioGeneral',
    estadoEnvio: 'pendiente',
    mensaje: 'Llamada programada para seguimiento general de pagos.'
  },
  
  // Recordatorios por WhatsApp
  {
    id: 'rec-whatsapp-1',
    clienteId: 'cliente-2',
    facturaId: 'factura-3',
    fechaProgramada: new Date('2024-02-17'),
    fechaEnviado: new Date('2024-02-17'),
    canal: 'whatsapp',
    tipo: 'recordatorioVencido',
    estadoEnvio: 'enviado',
    mensaje: 'Hola, le recordamos que su factura FAC-2024-003 está vencida. Monto: $357,000 COP. ¿Puede confirmar cuándo realizará el pago?'
  },
  {
    id: 'rec-whatsapp-2',
    clienteId: 'cliente-6',
    planPagoId: 'plan-3',
    fechaProgramada: new Date('2024-02-21'),
    canal: 'whatsapp',
    tipo: 'recordatorioPlan',
    estadoEnvio: 'pendiente',
    mensaje: 'Recordatorio: Su próxima cuota del plan de pago vence el 24/02/2024. Monto: $150,000 COP.'
  },
  {
    id: 'rec-whatsapp-3',
    clienteId: 'cliente-1',
    fechaProgramada: new Date('2024-02-19'),
    fechaEnviado: new Date('2024-02-19'),
    canal: 'whatsapp',
    tipo: 'recordatorioGeneral',
    estadoEnvio: 'enviado',
    mensaje: 'Recordatorio general: Tiene pagos pendientes. Por favor, revise su estado de cuenta.'
  },
  
  // Recordatorios por SMS
  {
    id: 'rec-sms-1',
    clienteId: 'cliente-3',
    facturaId: 'factura-4',
    fechaProgramada: new Date('2024-02-18'),
    fechaEnviado: new Date('2024-02-18'),
    canal: 'sms',
    tipo: 'recordatorioVencido',
    estadoEnvio: 'enviado',
    mensaje: 'Recordatorio: Factura FAC-2024-004 vencida. Monto: $125,000 COP. Favor realizar pago.'
  },
  {
    id: 'rec-sms-2',
    clienteId: 'cliente-7',
    planPagoId: 'plan-4',
    fechaProgramada: new Date('2024-02-23'),
    canal: 'sms',
    tipo: 'recordatorioPlan',
    estadoEnvio: 'pendiente',
    mensaje: 'Recordatorio: Cuota plan de pago vence 25/02. Monto: $200,000 COP.'
  },
  {
    id: 'rec-sms-3',
    clienteId: 'cliente-2',
    fechaProgramada: new Date('2024-02-20'),
    canal: 'sms',
    tipo: 'recordatorioGeneral',
    estadoEnvio: 'pendiente',
    mensaje: 'Tiene pagos pendientes. Revise su estado de cuenta.'
  },
  
  // Recordatorios con estado error
  {
    id: 'rec-error-1',
    clienteId: 'cliente-8',
    facturaId: 'factura-5',
    fechaProgramada: new Date('2024-02-14'),
    canal: 'email',
    tipo: 'recordatorioVencido',
    estadoEnvio: 'error',
    mensaje: 'Error al enviar recordatorio: Email inválido o no disponible.'
  },
  {
    id: 'rec-error-2',
    clienteId: 'cliente-9',
    fechaProgramada: new Date('2024-02-15'),
    canal: 'sms',
    tipo: 'recordatorioGeneral',
    estadoEnvio: 'error',
    mensaje: 'Error al enviar SMS: Número de teléfono no válido.'
  }
];

/**
 * API para gestionar recordatorios de morosidad
 * 
 * Este módulo proporciona funciones para:
 * - Programar nuevos recordatorios
 * - Marcar recordatorios como enviados
 * - Obtener recordatorios por cliente
 * - Obtener recordatorios programados con filtros
 * 
 * Los datos son consumidos por:
 * - GestorRecordatorios.tsx: Para la gestión y visualización de recordatorios
 * - AlertasVencidos.tsx: Para mostrar alertas de pagos vencidos con recordatorios asociados
 */
export const recordatoriosMorosidadAPI = {
  /**
   * Programa un nuevo recordatorio de pago.
   * Crea el recordatorio con estadoEnvio = "pendiente" y genera un ID único.
   * 
   * @param datos - Datos del recordatorio (sin id ni estadoEnvio)
   * @returns Promise con el recordatorio creado
   */
  async programarRecordatorio(
    datos: Omit<Recordatorio, 'id' | 'estadoEnvio'>
  ): Promise<Recordatorio> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoRecordatorio: Recordatorio = {
      ...datos,
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      estadoEnvio: 'pendiente'
    };
    
    mockRecordatoriosData.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  /**
   * Marca un recordatorio como enviado.
   * Actualiza el estadoEnvio a "enviado" y establece fechaEnviado.
   * 
   * @param id - ID del recordatorio a marcar como enviado
   * @returns Promise con el recordatorio actualizado
   * @throws Error si el recordatorio no se encuentra
   */
  async marcarRecordatorioEnviado(id: string): Promise<Recordatorio> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatoriosData.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Recordatorio no encontrado');
    }
    
    mockRecordatoriosData[index] = {
      ...mockRecordatoriosData[index],
      estadoEnvio: 'enviado',
      fechaEnviado: new Date()
    };
    
    return mockRecordatoriosData[index];
  },

  /**
   * Obtiene todos los recordatorios de un cliente específico.
   * 
   * @param clienteId - ID del cliente
   * @returns Promise con la lista de recordatorios del cliente
   */
  async getRecordatoriosPorCliente(clienteId: string): Promise<Recordatorio[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockRecordatoriosData.filter(r => r.clienteId === clienteId);
  },

  /**
   * Obtiene recordatorios programados aplicando filtros opcionales.
   * 
   * @param filtros - Filtros opcionales para buscar recordatorios
   * @returns Promise con la lista de recordatorios que cumplen los filtros
   */
  async getRecordatoriosProgramados(
    filtros?: FiltrosRecordatoriosProgramados
  ): Promise<Recordatorio[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let resultados = [...mockRecordatoriosData];
    
    if (filtros) {
      if (filtros.clienteId) {
        resultados = resultados.filter(r => r.clienteId === filtros.clienteId);
      }
      
      if (filtros.facturaId) {
        resultados = resultados.filter(r => r.facturaId === filtros.facturaId);
      }
      
      if (filtros.planPagoId) {
        resultados = resultados.filter(r => r.planPagoId === filtros.planPagoId);
      }
      
      if (filtros.canal && filtros.canal.length > 0) {
        resultados = resultados.filter(r => filtros.canal!.includes(r.canal));
      }
      
      if (filtros.tipo && filtros.tipo.length > 0) {
        resultados = resultados.filter(r => filtros.tipo!.includes(r.tipo));
      }
      
      if (filtros.estadoEnvio && filtros.estadoEnvio.length > 0) {
        resultados = resultados.filter(r => filtros.estadoEnvio!.includes(r.estadoEnvio));
      }
      
      if (filtros.fechaDesde) {
        resultados = resultados.filter(r => r.fechaProgramada >= filtros.fechaDesde!);
      }
      
      if (filtros.fechaHasta) {
        resultados = resultados.filter(r => r.fechaProgramada <= filtros.fechaHasta!);
      }
    }
    
    return resultados;
  }
};

