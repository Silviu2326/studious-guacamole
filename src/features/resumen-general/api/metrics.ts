/**
 * API para métricas del dashboard
 * 
 * Este módulo define los tipos y funciones para obtener las métricas clave (KPIs)
 * del dashboard del CRM para entrenadores y gimnasios.
 * 
 * En una implementación real con backend, estos datos se obtendrían mediante:
 * - GET /api/metrics?role={role}&userId={userId}
 * - El backend calcularía estos KPIs desde la base de datos (clientes, sesiones, pagos, etc.)
 * - Los campos numéricos se mapearían directamente desde las respuestas JSON del API
 */

/**
 * Interfaz que representa los KPIs clave del dashboard de entrenadores y gimnasios.
 * 
 * Estos métricas son esenciales para:
 * - Monitorear el rendimiento del negocio en tiempo real
 * - Identificar tendencias de crecimiento o problemas de retención
 * - Tomar decisiones informadas sobre capacidad, marketing y operaciones
 * 
 * Mapeo desde backend (ejemplo):
 * - totalClients: COUNT(DISTINCT clients.id) WHERE status = 'active'
 * - activeClientsToday: COUNT(DISTINCT sessions.client_id) WHERE DATE(session_date) = TODAY
 * - sessionsToday: COUNT(sessions.id) WHERE DATE(session_date) = TODAY
 * - occupancyRate: (AVG(daily_sessions) / max_capacity) * 100
 * - newClientsThisMonth: COUNT(clients.id) WHERE created_at >= start_of_month
 * - churnThisMonth: COUNT(clients.id) WHERE cancelled_at >= start_of_month
 * - monthlyRevenue: SUM(payments.amount) WHERE payment_date >= start_of_month
 * - averageSessionDuration: AVG(sessions.duration_minutes)
 * - clientRetentionRate: (active_clients / total_clients_at_start) * 100
 * - classAttendanceRate: (attended_classes / booked_classes) * 100
 * - leadConversionRate: (converted_leads / total_leads) * 100
 * - equipmentUtilizationRate: (hours_used / total_available_hours) * 100
 */
export interface DashboardMetrics {
  /** Número total de clientes activos en el sistema */
  totalClients: number;
  
  /** Número de clientes que tienen una sesión programada o completada hoy */
  activeClientsToday: number;
  
  /** Número total de sesiones (completadas + programadas) para hoy */
  sessionsToday: number;
  
  /** Porcentaje de ocupación media del día/semana (0-100) */
  occupancyRate: number;
  
  /** Número de nuevos clientes registrados este mes */
  newClientsThisMonth: number;
  
  /** Número de clientes que se han dado de baja este mes */
  churnThisMonth: number;
  
  /** Ingresos totales del mes actual (en euros) */
  monthlyRevenue: number;
  
  /** Duración promedio de las sesiones en minutos */
  averageSessionDuration: number;
  
  /** Porcentaje de retención de clientes (0-100) */
  clientRetentionRate: number;
  
  /** Porcentaje de asistencia a clases grupales (0-100) - solo para gimnasios */
  classAttendanceRate?: number;
  
  /** Porcentaje de conversión de leads a clientes (0-100) */
  leadConversionRate: number;
  
  /** Porcentaje de utilización de equipamiento (0-100) - solo para gimnasios */
  equipmentUtilizationRate?: number;
  
  /** Datos semanales de sesiones y ocupación (7 puntos, uno por día) */
  weeklyTrends?: {
    day: string;
    sessions: number;
    occupancy: number;
  }[];
  
  // Campos legacy para mantener compatibilidad con componentes existentes
  /** @deprecated Usar totalClients en su lugar */
  clientesActivos?: number;
  /** @deprecated Usar monthlyRevenue en su lugar */
  ingresosMes?: number;
  /** @deprecated Usar sessionsToday en su lugar */
  sesionesHoy?: number;
  /** @deprecated Usar occupancyRate en su lugar */
  ocupacionCentro?: number;
  /** @deprecated Usar monthlyRevenue / días del mes en su lugar */
  facturacionDia?: number;
  /** @deprecated Mantener para compatibilidad */
  incidenciasSalas?: number;
  /** @deprecated Usar newClientsThisMonth en su lugar */
  leadsNuevos?: number;
  /** @deprecated Mantener para compatibilidad */
  equiposRot?: number;
  /** @deprecated Usar classAttendanceRate en su lugar */
  ocupacionClases?: number;
  /** @deprecated Usar clientRetentionRate en su lugar */
  progresoClientes?: number;
}

/**
 * Obtiene las métricas del dashboard según el rol del usuario.
 * 
 * Esta función simula una llamada asíncrona al backend con un pequeño delay
 * para permitir visualizar estados de carga en la UI.
 * 
 * En una implementación real, reemplazar el contenido con:
 * ```typescript
 * const response = await fetch(`/api/metrics?role=${role}&userId=${userId}`, {
 *   method: 'GET',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * if (!response.ok) throw new Error('Failed to fetch metrics');
 * return await response.json() as DashboardMetrics;
 * ```
 * 
 * @param role - Rol del usuario: 'entrenador' (personal trainer) o 'gimnasio' (gym)
 * @param userId - ID opcional del usuario para filtrar métricas específicas
 * @returns Promise que resuelve con las métricas del dashboard
 */
export async function getMetrics(role: 'entrenador' | 'gimnasio', userId?: string): Promise<DashboardMetrics> {
  // Simulación de delay de red (500-800ms típico para APIs)
  // En producción, este delay vendría del tiempo de respuesta real del servidor
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          totalClients: 24,
          activeClientsToday: 8,
          sessionsToday: 6,
          occupancyRate: 75,
          newClientsThisMonth: 3,
          churnThisMonth: 1,
          monthlyRevenue: 4850.00,
          averageSessionDuration: 60,
          clientRetentionRate: 87,
          leadConversionRate: 42,
          weeklyTrends: [
            { day: 'Lun', sessions: 8, occupancy: 67 },
            { day: 'Mar', sessions: 12, occupancy: 80 },
            { day: 'Mié', sessions: 10, occupancy: 75 },
            { day: 'Jue', sessions: 15, occupancy: 88 },
            { day: 'Vie', sessions: 14, occupancy: 85 },
            { day: 'Sáb', sessions: 6, occupancy: 50 },
            { day: 'Dom', sessions: 4, occupancy: 33 },
          ],
          // Campos legacy para compatibilidad
          clientesActivos: 24,
          ingresosMes: 4850.00,
          sesionesHoy: 6,
          progresoClientes: 87,
        });
      } else {
        resolve({
          totalClients: 450,
          activeClientsToday: 180,
          sessionsToday: 180,
          occupancyRate: 68,
          newClientsThisMonth: 28,
          churnThisMonth: 5,
          monthlyRevenue: 125000.00,
          averageSessionDuration: 45,
          clientRetentionRate: 92,
          classAttendanceRate: 82,
          leadConversionRate: 35,
          equipmentUtilizationRate: 74,
          weeklyTrends: [
            { day: 'Lun', sessions: 145, occupancy: 65 },
            { day: 'Mar', sessions: 168, occupancy: 75 },
            { day: 'Mié', sessions: 152, occupancy: 68 },
            { day: 'Jue', sessions: 180, occupancy: 80 },
            { day: 'Vie', sessions: 175, occupancy: 78 },
            { day: 'Sáb', sessions: 120, occupancy: 54 },
            { day: 'Dom', sessions: 95, occupancy: 42 },
          ],
          // Campos legacy para compatibilidad
          clientesActivos: 450,
          ingresosMes: 125000.00,
          sesionesHoy: 180,
          ocupacionCentro: 68,
          facturacionDia: 3200.00,
          incidenciasSalas: 2,
          leadsNuevos: 28,
          equiposRot: 1,
          ocupacionClases: 82,
        });
      }
    }, 500);
  });
}

