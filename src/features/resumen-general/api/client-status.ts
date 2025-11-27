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

let clientStatusData = {
  entrenador: {
    total: 24,
    activos: 20,
    nuevos: 3,
    inactivos: 1,
    leadsPendientes: 5,
  },
  gimnasio: {
    total: 450,
    activos: 380,
    nuevos: 25,
    inactivos: 45,
    leadsPendientes: 42,
  },
};

export async function getClientStatus(role: 'entrenador' | 'gimnasio', userId?: string): Promise<ClientStatus> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clientStatusData[role]);
    }, 350);
  });
}

export async function updateClientStatus(role: 'entrenador' | 'gimnasio', data: Partial<ClientStatus>): Promise<ClientStatus> {
  return new Promise((resolve) => {
    setTimeout(() => {
      clientStatusData[role] = {
        ...clientStatusData[role],
        ...data,
      };
      resolve(clientStatusData[role]);
    }, 300);
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

