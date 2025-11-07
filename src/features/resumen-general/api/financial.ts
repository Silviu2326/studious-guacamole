/**
 * API para resumen financiero del dashboard
 */

export interface FinancialSummary {
  ingresosMes: number;
  ingresosMesAnterior: number;
  gastosMes: number;
  gananciaNeta: number;
  tendencia: 'up' | 'down' | 'neutral';
  porcentajeVariacion: number;
  proximosVencimientos: number;
  montoPendiente: number;
}

export async function getFinancialSummary(role: 'entrenador' | 'gimnasio', userId?: string): Promise<FinancialSummary> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          ingresosMes: 4850.00,
          ingresosMesAnterior: 4200.00,
          gastosMes: 850.00,
          gananciaNeta: 4000.00,
          tendencia: 'up',
          porcentajeVariacion: 15.5,
          proximosVencimientos: 3,
          montoPendiente: 1200.00,
        });
      } else {
        resolve({
          ingresosMes: 125000.00,
          ingresosMesAnterior: 118000.00,
          gastosMes: 45000.00,
          gananciaNeta: 80000.00,
          tendencia: 'up',
          porcentajeVariacion: 5.9,
          proximosVencimientos: 12,
          montoPendiente: 8500.00,
        });
      }
    }, 400);
  });
}

