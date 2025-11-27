/**
 * API para alertas del dashboard
 * 
 * Este módulo define la interfaz de alertas y proporciona funciones para obtener
 * y gestionar notificaciones del sistema (pagos, incidencias, mensajes, etc.).
 */

/**
 * Tipos de alertas disponibles en el sistema
 * 
 * - payment: Alertas relacionadas con pagos (pendientes, recibidos, fallidos, etc.)
 * - incident: Alertas sobre incidencias o problemas que requieren atención
 * - message: Alertas de mensajes o comunicaciones de clientes
 * - system: Alertas del sistema (mantenimiento, actualizaciones, configuraciones, etc.)
 */
export type AlertType = 'payment' | 'incident' | 'message' | 'system';

/**
 * Niveles de severidad de las alertas
 * 
 * - info: Información general que no requiere acción inmediata
 * - warning: Advertencia que requiere atención pero no es urgente
 * - error: Error que requiere acción pero no es crítico
 * - critical: Crítico, requiere acción inmediata
 */
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Interfaz que representa una alerta en el sistema
 */
export interface Alert {
  /** Identificador único de la alerta */
  id: string | number;
  
  /** Tipo de alerta (payment, incident, message, system) */
  type: AlertType;
  
  /** Título descriptivo de la alerta */
  title: string;
  
  /** Descripción detallada de la alerta */
  description: string;
  
  /** Fecha y hora de creación de la alerta */
  createdAt: Date;
  
  /** Nivel de severidad de la alerta */
  severity: AlertSeverity;
  
  /** Indica si la alerta ha sido leída por el usuario */
  isRead: boolean;
  
  /** URL opcional para una acción relacionada con la alerta */
  actionUrl?: string;
  
  /** Etiqueta opcional para el botón de acción */
  actionLabel?: string;
}

/**
 * Obtiene las alertas del dashboard según el rol del usuario
 * 
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @param userId - ID opcional del usuario
 * @returns Promise con un array de alertas ordenadas de más reciente a más antigua
 * 
 * @example
 * ```typescript
 * const alerts = await getAlerts('entrenador', 'user123');
 * ```
 */
export async function getAlerts(
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<Alert[]> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = Date.now();
      
      if (role === 'entrenador') {
        const alerts: Alert[] = [
          // Pagos pendientes
          {
            id: '1',
            type: 'payment',
            title: 'Pago pendiente de cliente',
            description: 'Juan Pérez tiene un pago pendiente de €120.00 desde hace 3 días',
            createdAt: new Date(now - 2 * 60 * 60 * 1000), // Hace 2 horas
            severity: 'warning',
            isRead: false,
            actionUrl: '/pagos',
            actionLabel: 'Ver pagos',
          },
          {
            id: '2',
            type: 'payment',
            title: 'Pago recibido',
            description: 'María García ha realizado un pago de €80.00 por sesión personalizada',
            createdAt: new Date(now - 4 * 60 * 60 * 1000), // Hace 4 horas
            severity: 'info',
            isRead: false,
            actionUrl: '/pagos',
            actionLabel: 'Ver detalles',
          },
          // Incidencias
          {
            id: '3',
            type: 'incident',
            title: 'Cliente sin check-in',
            description: '3 clientes no han realizado check-in esta semana. Revisa su actividad',
            createdAt: new Date(now - 6 * 60 * 60 * 1000), // Hace 6 horas
            severity: 'warning',
            isRead: true,
            actionUrl: '/check-ins-de-entreno',
            actionLabel: 'Ver check-ins',
          },
          {
            id: '4',
            type: 'incident',
            title: 'Sesión cancelada',
            description: 'Pedro López ha cancelado su sesión programada para mañana a las 10:00',
            createdAt: new Date(now - 12 * 60 * 60 * 1000), // Hace 12 horas
            severity: 'info',
            isRead: false,
            actionUrl: '/sesiones',
            actionLabel: 'Reagendar',
          },
          // Mensajes
          {
            id: '5',
            type: 'message',
            title: 'Nuevo mensaje de cliente',
            description: 'Ana Martínez ha enviado un mensaje sobre su plan de entrenamiento',
            createdAt: new Date(now - 1 * 60 * 60 * 1000), // Hace 1 hora
            severity: 'info',
            isRead: false,
            actionUrl: '/mensajes',
            actionLabel: 'Responder',
          },
          {
            id: '6',
            type: 'message',
            title: 'Consulta urgente',
            description: 'Carlos Ruiz necesita una consulta urgente sobre lesión',
            createdAt: new Date(now - 30 * 60 * 1000), // Hace 30 minutos
            severity: 'error',
            isRead: false,
            actionUrl: '/mensajes',
            actionLabel: 'Ver mensaje',
          },
          // Sistema
          {
            id: '7',
            type: 'system',
            title: 'Nueva consulta de lead',
            description: 'Tienes una nueva consulta de un lead potencial',
            createdAt: new Date(now - 8 * 60 * 60 * 1000), // Hace 8 horas
            severity: 'info',
            isRead: true,
            actionUrl: '/leads',
            actionLabel: 'Responder',
          },
        ];
        
        // Ordenar de más reciente a más antigua
        resolve(alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } else {
        // Alertas para gimnasio
        const alerts: Alert[] = [
          // Pagos pendientes
          {
            id: '1',
            type: 'payment',
            title: 'Pago pendiente de membresía',
            description: '5 miembros tienen pagos pendientes de membresía mensual',
            createdAt: new Date(now - 1 * 60 * 60 * 1000), // Hace 1 hora
            severity: 'warning',
            isRead: false,
            actionUrl: '/pagos',
            actionLabel: 'Ver pagos',
          },
          {
            id: '2',
            type: 'payment',
            title: 'Pago procesado exitosamente',
            description: 'Membresía anual de €450.00 procesada correctamente',
            createdAt: new Date(now - 3 * 60 * 60 * 1000), // Hace 3 horas
            severity: 'info',
            isRead: false,
            actionUrl: '/pagos',
            actionLabel: 'Ver detalles',
          },
          {
            id: '3',
            type: 'payment',
            title: 'Pago fallido',
            description: 'El pago de €60.00 de Laura Sánchez ha fallado. Revisar método de pago',
            createdAt: new Date(now - 5 * 60 * 60 * 1000), // Hace 5 horas
            severity: 'error',
            isRead: false,
            actionUrl: '/pagos',
            actionLabel: 'Resolver',
          },
          // Incidencias
          {
            id: '4',
            type: 'incident',
            title: 'Equipo roto',
            description: 'Cinta de correr #3 requiere mantenimiento urgente. No está operativa',
            createdAt: new Date(now - 2 * 60 * 60 * 1000), // Hace 2 horas
            severity: 'critical',
            isRead: false,
            actionUrl: '/mantenimiento-incidencias',
            actionLabel: 'Ver incidencia',
          },
          {
            id: '5',
            type: 'incident',
            title: 'Aforo alto',
            description: 'La sala de cardio está al 95% de capacidad. Considerar medidas',
            createdAt: new Date(now - 4 * 60 * 60 * 1000), // Hace 4 horas
            severity: 'warning',
            isRead: true,
            actionUrl: '/control-de-acceso-aforo',
            actionLabel: 'Ver estado',
          },
          {
            id: '6',
            type: 'incident',
            title: 'Clase llena',
            description: 'Clase de Yoga 19:00 al 100% de capacidad. Hay lista de espera',
            createdAt: new Date(now - 6 * 60 * 60 * 1000), // Hace 6 horas
            severity: 'info',
            isRead: false,
            actionUrl: '/clases',
            actionLabel: 'Gestionar',
          },
          // Mensajes
          {
            id: '7',
            type: 'message',
            title: 'Mensaje de miembro',
            description: 'Roberto Fernández ha enviado un mensaje sobre renovación de membresía',
            createdAt: new Date(now - 7 * 60 * 60 * 1000), // Hace 7 horas
            severity: 'info',
            isRead: false,
            actionUrl: '/mensajes',
            actionLabel: 'Responder',
          },
          // Sistema
          {
            id: '8',
            type: 'system',
            title: 'Nuevos leads',
            description: '12 nuevos leads en el pipeline. Revisar y contactar',
            createdAt: new Date(now - 8 * 60 * 60 * 1000), // Hace 8 horas
            severity: 'info',
            isRead: true,
            actionUrl: '/leads',
            actionLabel: 'Ver leads',
          },
        ];
        
        // Ordenar de más reciente a más antigua
        resolve(alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }
    }, 300);
  });
}

/**
 * FUTURA IMPLEMENTACIÓN: Marcar una alerta como leída
 * 
 * Esta función se implementará en el futuro para permitir marcar alertas como leídas.
 * 
 * @param alertId - ID de la alerta a marcar como leída
 * @param userId - ID del usuario que marca la alerta como leída
 * @returns Promise que se resuelve cuando la operación se completa
 * 
 * Implementación sugerida:
 * ```typescript
 * export async function markAsRead(
 *   alertId: string | number,
 *   userId?: string
 * ): Promise<void> {
 *   // Llamada a API para actualizar el estado de la alerta
 *   // await api.put(`/alerts/${alertId}/read`, { userId });
 * }
 * ```
 * 
 * Uso en componentes:
 * ```typescript
 * const handleMarkAsRead = async (alertId: string | number) => {
 *   await markAsRead(alertId, user?.id);
 *   // Actualizar estado local o recargar alertas
 *   await loadAlerts();
 * };
 * ```
 */
// export async function markAsRead(
//   alertId: string | number,
//   userId?: string
// ): Promise<void> {
//   // Implementación futura
// }
