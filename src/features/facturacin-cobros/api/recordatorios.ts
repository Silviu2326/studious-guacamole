import { RecordatorioPago } from '../types';

// Mock data para desarrollo
const mockRecordatorios: RecordatorioPago[] = [
  {
    id: 'rec1',
    facturaId: '3',
    fechaEnvio: new Date('2024-01-21'),
    tipo: 'automatico',
    medio: 'email',
    estado: 'enviado',
    proximoEnvio: new Date('2024-01-28')
  },
  {
    id: 'rec2',
    facturaId: '3',
    fechaEnvio: new Date('2024-01-22'),
    tipo: 'automatico',
    medio: 'email',
    estado: 'enviado'
  }
];

export const recordatoriosAPI = {
  // Obtener recordatorios de una factura
  async obtenerRecordatoriosFactura(facturaId: string): Promise<RecordatorioPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecordatorios.filter(r => r.facturaId === facturaId);
  },

  // Obtener todos los recordatorios
  async obtenerRecordatorios(): Promise<RecordatorioPago[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockRecordatorios].sort((a, b) => b.fechaEnvio.getTime() - a.fechaEnvio.getTime());
  },

  // Enviar recordatorio manual
  async enviarRecordatorio(recordatorio: Omit<RecordatorioPago, 'id' | 'fechaEnvio'>): Promise<RecordatorioPago> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nuevoRecordatorio: RecordatorioPago = {
      ...recordatorio,
      id: Date.now().toString(),
      fechaEnvio: new Date(),
      estado: 'pendiente'
    };
    
    // Simular envío
    setTimeout(() => {
      const index = mockRecordatorios.findIndex(r => r.id === nuevoRecordatorio.id);
      if (index !== -1) {
        mockRecordatorios[index].estado = 'enviado';
      }
    }, 1500);
    
    mockRecordatorios.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Programar recordatorio automático
  async programarRecordatorio(facturaId: string, fechaEnvio: Date, medio: 'email' | 'sms' | 'whatsapp'): Promise<RecordatorioPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoRecordatorio: RecordatorioPago = {
      id: Date.now().toString(),
      facturaId,
      fechaEnvio,
      tipo: 'automatico',
      medio,
      estado: 'pendiente'
    };
    
    mockRecordatorios.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Obtener recordatorios pendientes
  async obtenerRecordatoriosPendientes(): Promise<RecordatorioPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecordatorios.filter(r => r.estado === 'pendiente');
  }
};

