import { RecordatorioContacto } from '../types';

// Mock data para recordatorios de contacto programados
const mockRecordatoriosContacto: RecordatorioContacto[] = [
  {
    id: 'rec-cont-1',
    pagoPendienteId: '3',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos Rodríguez',
    fechaRecordatorio: new Date('2024-02-20'),
    nota: 'Cliente prometió pagar esta semana, recordar contactar',
    completado: false,
    fechaCreacion: new Date('2024-02-08'),
    creadoPor: 'usuario_actual'
  },
  {
    id: 'rec-cont-2',
    pagoPendienteId: '5',
    clienteId: 'cliente5',
    clienteNombre: 'Luis Hernández',
    fechaRecordatorio: new Date('2024-02-18'),
    nota: 'Revisar respuesta sobre plan de pagos',
    completado: false,
    fechaCreacion: new Date('2024-02-10'),
    creadoPor: 'usuario_actual'
  }
];

export const recordatoriosContactoAPI = {
  // Obtener todos los recordatorios de contacto
  async obtenerTodos(): Promise<RecordatorioContacto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecordatoriosContacto.filter(r => !r.completado);
  },

  // Obtener recordatorios pendientes (no completados y con fecha <= hoy)
  async obtenerPendientes(): Promise<RecordatorioContacto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return mockRecordatoriosContacto.filter(r => {
      const fechaRec = new Date(r.fechaRecordatorio);
      fechaRec.setHours(0, 0, 0, 0);
      return !r.completado && fechaRec <= hoy;
    });
  },

  // Crear nuevo recordatorio de contacto
  async crear(recordatorio: Omit<RecordatorioContacto, 'id' | 'fechaCreacion' | 'completado'>): Promise<RecordatorioContacto> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoRecordatorio: RecordatorioContacto = {
      ...recordatorio,
      id: `rec-cont-${Date.now()}`,
      fechaCreacion: new Date(),
      completado: false
    };
    
    mockRecordatoriosContacto.push(nuevoRecordatorio);
    return nuevoRecordatorio;
  },

  // Marcar recordatorio como completado
  async marcarCompletado(id: string): Promise<RecordatorioContacto> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatoriosContacto.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Recordatorio no encontrado');
    }
    
    mockRecordatoriosContacto[index] = {
      ...mockRecordatoriosContacto[index],
      completado: true,
      fechaCompletado: new Date()
    };
    
    return mockRecordatoriosContacto[index];
  },

  // Eliminar recordatorio
  async eliminar(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRecordatoriosContacto.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRecordatoriosContacto.splice(index, 1);
    }
  }
};

