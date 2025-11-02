import { SeguimientoPago } from '../types';

// Mock data para desarrollo
const mockSeguimientos: SeguimientoPago[] = [
  {
    id: 'seg1',
    pagoPendienteId: '3',
    fecha: new Date('2024-02-01'),
    accion: 'Llamada telefónica realizada',
    tipo: 'contacto',
    usuario: 'admin1',
    notas: 'Cliente prometió pagar esta semana. Mencionó problemas de flujo de caja temporales.',
    proximaSeguimiento: new Date('2024-02-08')
  },
  {
    id: 'seg2',
    pagoPendienteId: '5',
    fecha: new Date('2024-02-08'),
    accion: 'Reunión para negociar plan de pagos',
    tipo: 'negociacion',
    usuario: 'admin1',
    notas: 'Cliente solicitó plan de pagos en 3 cuotas. Pendiente aprobación.',
    proximaSeguimiento: new Date('2024-02-10')
  },
  {
    id: 'seg3',
    pagoPendienteId: '4',
    fecha: new Date('2024-01-10'),
    accion: 'Documentación enviada a asesor legal',
    tipo: 'legal',
    usuario: 'admin1',
    notas: 'Caso escalado a gestión legal debido a extenso período de morosidad (58 días).'
  }
];

export const seguimientoAPI = {
  // Obtener seguimientos de un pago pendiente
  async obtenerSeguimientos(pagoPendienteId: string): Promise<SeguimientoPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSeguimientos
      .filter(s => s.pagoPendienteId === pagoPendienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  // Obtener todos los seguimientos
  async obtenerTodosSeguimientos(): Promise<SeguimientoPago[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSeguimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  },

  // Crear nuevo seguimiento
  async crearSeguimiento(seguimiento: Omit<SeguimientoPago, 'id' | 'fecha'>): Promise<SeguimientoPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nuevoSeguimiento: SeguimientoPago = {
      ...seguimiento,
      id: Date.now().toString(),
      fecha: new Date()
    };
    
    mockSeguimientos.push(nuevoSeguimiento);
    return nuevoSeguimiento;
  },

  // Actualizar seguimiento
  async actualizarSeguimiento(id: string, datos: Partial<SeguimientoPago>): Promise<SeguimientoPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSeguimientos.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Seguimiento no encontrado');
    }
    
    mockSeguimientos[index] = {
      ...mockSeguimientos[index],
      ...datos
    };
    
    return mockSeguimientos[index];
  }
};

