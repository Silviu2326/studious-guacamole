import { SeguimientoMensual } from '../types';

const mockSeguimiento: SeguimientoMensual[] = [
  {
    id: 's1',
    membresiaId: '1',
    mes: '2024-10',
    pagosEsperados: 1,
    pagosRecibidos: 1,
    montoTotal: 150,
    montoRecibido: 150,
    estado: 'completo',
  },
  {
    id: 's2',
    membresiaId: '2',
    mes: '2024-10',
    pagosEsperados: 1,
    pagosRecibidos: 0,
    montoTotal: 150,
    montoRecibido: 0,
    estado: 'pendiente',
  },
  {
    id: 's3',
    membresiaId: '3',
    mes: '2024-10',
    pagosEsperados: 1,
    pagosRecibidos: 0,
    montoTotal: 80,
    montoRecibido: 0,
    estado: 'atrasado',
  },
  {
    id: 's4',
    membresiaId: '4',
    mes: '2024-10',
    pagosEsperados: 1,
    pagosRecibidos: 1,
    montoTotal: 50,
    montoRecibido: 50,
    estado: 'completo',
  },
];

export const getSeguimientoMensual = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string,
  mes?: string
): Promise<SeguimientoMensual[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mesFiltro = mes || new Date().toISOString().slice(0, 7); // YYYY-MM
  
  return mockSeguimiento.filter(s => s.mes === mesFiltro);
};

export const getEstadisticasMensuales = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalEsperado: 430,
    totalRecibido: 200,
    pagosCompletados: 2,
    pagosPendientes: 1,
    pagosAtrasados: 1,
    tasaCobro: 46.5,
  };
};

