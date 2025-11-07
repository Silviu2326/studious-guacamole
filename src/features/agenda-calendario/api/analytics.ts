import { AnalyticsOcupacion } from '../types';

export const getAnalyticsOcupacion = async (
  fechaInicio: Date,
  fechaFin: Date,
  role: 'entrenador' | 'gimnasio'
): Promise<AnalyticsOcupacion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analytics: AnalyticsOcupacion[] = [
        {
          periodo: 'Enero 2024',
          totalCitas: 45,
          citasConfirmadas: 42,
          citasCompletadas: 40,
          ocupacionPromedio: 88.9,
          ingresosEstimados: 3600,
          claseMasPopular: role === 'gimnasio' ? {
            nombre: 'Yoga Matutino',
            ocupacion: 95
          } : undefined,
        },
      ];
      resolve(analytics);
    }, 300);
  });
};

