import { Renovacion } from '../types';

// Mock data
const mockRenovaciones: Renovacion[] = [
  {
    id: 'ren1',
    suscripcionId: 'sub1',
    fechaRenovacion: '2024-11-01',
    monto: 150,
    estado: 'programada',
  },
  {
    id: 'ren2',
    suscripcionId: 'sub2',
    fechaRenovacion: '2024-10-15',
    monto: 280,
    estado: 'procesada',
    fechaProcesamiento: '2024-10-15',
  },
  {
    id: 'ren3',
    suscripcionId: 'sub3',
    fechaRenovacion: '2024-11-01',
    monto: 80,
    estado: 'programada',
  },
  {
    id: 'ren4',
    suscripcionId: 'sub5',
    fechaRenovacion: '2024-11-01',
    monto: 120,
    estado: 'programada',
  },
  {
    id: 'ren5',
    suscripcionId: 'sub6',
    fechaRenovacion: '2024-11-01',
    monto: 480,
    estado: 'programada',
  },
  {
    id: 'ren6',
    suscripcionId: 'sub7',
    fechaRenovacion: '2025-01-01',
    monto: 240,
    estado: 'programada',
  },
  {
    id: 'ren7',
    suscripcionId: 'sub9',
    fechaRenovacion: '2025-01-01',
    monto: 1440,
    estado: 'programada',
  },
  {
    id: 'ren8',
    suscripcionId: 'sub3',
    fechaRenovacion: '2024-10-01',
    monto: 80,
    estado: 'procesada',
    fechaProcesamiento: '2024-09-30',
  },
];

export const getRenovaciones = async (
  suscripcionId?: string,
  estado?: 'programada' | 'procesada' | 'fallida'
): Promise<Renovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let renovaciones = mockRenovaciones;
  
  if (suscripcionId) {
    renovaciones = renovaciones.filter(r => r.suscripcionId === suscripcionId);
  }
  
  if (estado) {
    renovaciones = renovaciones.filter(r => r.estado === estado);
  }
  
  return renovaciones;
};

export const getRenovacionesProgramadas = async (): Promise<Renovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockRenovaciones.filter(r => r.estado === 'programada');
};

export const procesarRenovacion = async (
  renovacionId: string
): Promise<Renovacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const renovacion = mockRenovaciones.find(r => r.id === renovacionId);
  if (!renovacion) {
    throw new Error('Renovación no encontrada');
  }
  
  return {
    ...renovacion,
    estado: 'procesada',
    fechaProcesamiento: new Date().toISOString().split('T')[0],
  };
};

export const cancelarRenovacion = async (
  renovacionId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, cancelaría la renovación programada
};

export const getProximasRenovaciones = async (
  dias: number = 30
): Promise<Renovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  return mockRenovaciones.filter(r => {
    if (r.estado !== 'programada') return false;
    const fechaRenovacion = new Date(r.fechaRenovacion);
    return fechaRenovacion <= fechaLimite;
  });
};

