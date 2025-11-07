/**
 * API para métricas del dashboard
 */

export interface DashboardMetrics {
  clientesActivos: number;
  ingresosMes: number;
  sesionesHoy: number;
  ocupacionCentro?: number;
  facturacionDia?: number;
  incidenciasSalas?: number;
  leadsNuevos?: number;
  equiposRot?: number;
  ocupacionClases?: number;
  progresoClientes?: number;
}

export async function getMetrics(role: 'entrenador' | 'gimnasio', userId?: string): Promise<DashboardMetrics> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          clientesActivos: 24,
          ingresosMes: 4850.00,
          sesionesHoy: 6,
          progresoClientes: 78,
        });
      } else {
        resolve({
          clientesActivos: 450,
          ingresosMes: 125000.00,
          sesionesHoy: 180,
          ocupacionCentro: 68,
          facturacionDia: 3200.00,
          incidenciasSalas: 2,
          leadsNuevos: 12,
          equiposRot: 1,
          ocupacionClases: 82,
        });
      }
    }, 500);
  });
}

