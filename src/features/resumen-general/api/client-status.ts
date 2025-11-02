/**
 * API para estado de clientes/leads
 */

export interface ClientStatus {
  total: number;
  activos: number;
  nuevos: number;
  inactivos: number;
  leadsPendientes: number;
}

export async function getClientStatus(role: 'entrenador' | 'gimnasio', userId?: string): Promise<ClientStatus> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          total: 24,
          activos: 20,
          nuevos: 3,
          inactivos: 1,
          leadsPendientes: 5,
        });
      } else {
        resolve({
          total: 450,
          activos: 380,
          nuevos: 25,
          inactivos: 45,
          leadsPendientes: 42,
        });
      }
    }, 350);
  });
}

export async function getQuickStats(role: 'entrenador' | 'gimnasio', userId?: string): Promise<any> {
  // Simulación de API para estadísticas rápidas
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          proximasSesiones: 6,
          clientesConObjetivos: 18,
          adherenciaPromedio: 85,
        });
      } else {
        resolve({
          ocupacionActual: 68,
          clasesHoy: 12,
          miembrosOnline: 45,
        });
      }
    }, 300);
  });
}

