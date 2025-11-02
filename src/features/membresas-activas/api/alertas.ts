import { AlertaVencimiento } from '../types';

const mockAlertas: AlertaVencimiento[] = [
  {
    id: 'a1',
    membresiaId: '3',
    clienteNombre: 'Carlos López',
    clienteEmail: 'carlos@example.com',
    fechaVencimiento: '2024-11-01',
    diasRestantes: -5,
    prioridad: 'alta',
    estado: 'pendiente',
    fechaCreacion: '2024-10-25',
  },
  {
    id: 'a2',
    membresiaId: '2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    fechaVencimiento: '2024-11-01',
    diasRestantes: 0,
    prioridad: 'media',
    estado: 'enviada',
    fechaCreacion: '2024-10-28',
  },
  {
    id: 'a3',
    membresiaId: '4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana@example.com',
    fechaVencimiento: '2024-11-15',
    diasRestantes: 9,
    prioridad: 'baja',
    estado: 'pendiente',
    fechaCreacion: '2024-11-01',
  },
];

export const getAlertasVencimiento = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<AlertaVencimiento[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filtrar alertas según el rol y usuario
  return mockAlertas;
};

export const marcarAlertaComoLeida = async (alertaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, actualizaría el estado de la alerta
};

export const procesarAlerta = async (alertaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, procesaría la acción de la alerta
};

