import { Renovacion } from '../types';

const BASE_DATE = new Date();
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (days: number) =>
  formatDate(new Date(BASE_DATE.getTime() + days * DAY_IN_MS));
const addMonths = (months: number) => {
  const date = new Date(BASE_DATE);
  date.setMonth(date.getMonth() + months);
  return formatDate(date);
};

// Mock data
const mockRenovaciones: Renovacion[] = [
  {
    id: 'ren-sub1',
    suscripcionId: 'sub1',
    fechaRenovacion: addDays(9),
    monto: 280,
    estado: 'programada',
  },
  {
    id: 'ren-sub2',
    suscripcionId: 'sub2',
    fechaRenovacion: addDays(4),
    monto: 195,
    estado: 'programada',
  },
  {
    id: 'ren-sub6',
    suscripcionId: 'sub6',
    fechaRenovacion: addDays(14),
    monto: 520,
    estado: 'programada',
  },
  {
    id: 'ren-sub10',
    suscripcionId: 'sub10',
    fechaRenovacion: addDays(12),
    monto: 99,
    estado: 'programada',
  },
  {
    id: 'ren-sub11',
    suscripcionId: 'sub11',
    fechaRenovacion: addDays(-18),
    monto: 180,
    estado: 'procesada',
    fechaProcesamiento: addDays(-18),
  },
  {
    id: 'ren-sub5',
    suscripcionId: 'sub5',
    fechaRenovacion: addDays(11),
    monto: 540,
    estado: 'programada',
  },
  {
    id: 'ren-sub5-m1',
    suscripcionId: 'sub5-m1',
    fechaRenovacion: addDays(11),
    monto: 180,
    estado: 'programada',
  },
  {
    id: 'ren-sub5-m2',
    suscripcionId: 'sub5-m2',
    fechaRenovacion: addDays(11),
    monto: 180,
    estado: 'programada',
  },
  {
    id: 'ren-sub3',
    suscripcionId: 'sub3',
    fechaRenovacion: addDays(18),
    monto: 85,
    estado: 'programada',
  },
  {
    id: 'ren-sub4',
    suscripcionId: 'sub4',
    fechaRenovacion: addDays(20),
    monto: 55,
    estado: 'programada',
  },
  {
    id: 'ren-sub7',
    suscripcionId: 'sub7',
    fechaRenovacion: addMonths(2),
    monto: 240,
    estado: 'programada',
  },
  {
    id: 'ren-sub8',
    suscripcionId: 'sub8',
    fechaRenovacion: addDays(-12),
    monto: 50,
    estado: 'fallida',
  },
  {
    id: 'ren-sub9',
    suscripcionId: 'sub9',
    fechaRenovacion: addMonths(1),
    monto: 1440,
    estado: 'programada',
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

