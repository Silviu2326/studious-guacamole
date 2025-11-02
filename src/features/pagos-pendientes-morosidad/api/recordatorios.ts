import { RecordatorioPago, TipoRecordatorio, MedioRecordatorio } from '../types';

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

