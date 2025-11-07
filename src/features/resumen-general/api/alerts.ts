/**
 * API para alertas del dashboard
 */

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
}

export async function getAlerts(role: 'entrenador' | 'gimnasio', userId?: string): Promise<Alert[]> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve([
          {
            id: '1',
            type: 'warning',
            title: 'Cliente sin check-in',
            message: '3 clientes no han realizado check-in esta semana',
            timestamp: new Date(),
            actionUrl: '/check-ins-de-entreno',
            actionLabel: 'Ver detalles',
          },
          {
            id: '2',
            type: 'info',
            title: 'Nueva consulta',
            message: 'Tienes una nueva consulta de un lead',
            timestamp: new Date(Date.now() - 3600000),
            actionUrl: '/leads',
            actionLabel: 'Responder',
          },
        ]);
      } else {
        resolve([
          {
            id: '1',
            type: 'error',
            title: 'Equipo roto',
            message: 'Cinta de correr #3 requiere mantenimiento urgente',
            timestamp: new Date(),
            actionUrl: '/mantenimiento-incidencias',
            actionLabel: 'Ver incidencia',
          },
          {
            id: '2',
            type: 'warning',
            title: 'Aforo alto',
            message: 'La sala de cardio está al 95% de capacidad',
            timestamp: new Date(Date.now() - 1800000),
            actionUrl: '/control-de-acceso-aforo',
            actionLabel: 'Ver estado',
          },
          {
            id: '3',
            type: 'info',
            title: 'Nuevos leads',
            message: '12 nuevos leads en el pipeline',
            timestamp: new Date(Date.now() - 7200000),
            actionUrl: '/leads',
            actionLabel: 'Ver leads',
          },
        ]);
      }
    }, 300);
  });
}

