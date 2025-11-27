/**
 * API para estado de clientes/leads
 * 
 * Este módulo define los tipos y funciones para obtener el estado de la base de clientes
 * y leads del CRM para entrenadores y gimnasios.
 * 
 * En una implementación real con backend, estos datos se obtendrían mediante:
 * - GET /api/client-status?role={role}&userId={userId}
 * - El backend calcularía estos valores desde la base de datos (clientes, membresías, leads, etc.)
 * - Los campos numéricos y porcentajes se mapearían directamente desde las respuestas JSON del API
 */

/**
 * Interfaz que representa el estado de la base de clientes y leads.
 * 
 * Estos datos son esenciales para:
 * - Monitorear el crecimiento y la salud de la base de clientes
 * - Identificar tendencias de adquisición y retención
 * - Gestionar el pipeline de leads y oportunidades de conversión
 * - Tomar decisiones informadas sobre capacidad y recursos
 * 
 * Mapeo desde backend (ejemplo):
 * - total: COUNT(DISTINCT clients.id) WHERE status IN ('active', 'inactive')
 * - active: COUNT(DISTINCT clients.id) WHERE status = 'active' AND subscription_active = true
 * - newThisMonth: COUNT(DISTINCT clients.id) WHERE created_at >= start_of_month
 * - inactive: COUNT(DISTINCT clients.id) WHERE status = 'inactive' OR subscription_paused = true
 * - leads: COUNT(DISTINCT leads.id) WHERE status = 'pending' AND converted = false
 * - activeVariation: ((active_current_month - active_previous_month) / active_previous_month) * 100
 * - newVariation: ((new_current_month - new_previous_month) / new_previous_month) * 100
 * - inactiveVariation: ((inactive_current_month - inactive_previous_month) / inactive_previous_month) * 100
 */
export interface ClientStatus {
  /** Número total de clientes registrados (activos + inactivos) */
  total: number;
  
  /** Número de clientes activos con suscripción vigente */
  active: number;
  
  /** Número de nuevos clientes registrados este mes */
  newThisMonth: number;
  
  /** Número de clientes inactivos o con suscripción en pausa */
  inactive: number;
  
  /** Número de leads pendientes aún no convertidos */
  leads: number;
  
  /** Variación porcentual de clientes activos respecto al mes anterior (puede ser positivo o negativo) */
  activeVariation?: number;
  
  /** Variación porcentual de nuevos clientes respecto al mes anterior (puede ser positivo o negativo) */
  newVariation?: number;
  
  /** Variación porcentual de clientes inactivos respecto al mes anterior (puede ser positivo o negativo) */
  inactiveVariation?: number;
  
  /** Variación porcentual de leads respecto al mes anterior (puede ser positivo o negativo) */
  leadsVariation?: number;

  // Campos legacy para compatibilidad con componentes existentes
  /** @deprecated Usar active en su lugar */
  activos?: number;
  /** @deprecated Usar newThisMonth en su lugar */
  nuevos?: number;
  /** @deprecated Usar inactive en su lugar */
  inactivos?: number;
  /** @deprecated Usar leads en su lugar */
  leadsPendientes?: number;
}

/**
 * Obtiene el estado de la base de clientes y leads según el rol del usuario.
 * 
 * Esta función simula una llamada asíncrona al backend con un pequeño delay
 * para permitir visualizar estados de carga en la UI.
 * 
 * En una implementación real, reemplazar el contenido con:
 * ```typescript
 * const response = await fetch(`/api/client-status?role=${role}&userId=${userId}`, {
 *   method: 'GET',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * if (!response.ok) throw new Error('Failed to fetch client status');
 * return await response.json() as ClientStatus;
 * ```
 * 
 * Endpoint esperado en backend:
 * - GET /api/client-status
 * - Query params: role (entrenador | gimnasio), userId (opcional)
 * - Respuesta esperada: objeto ClientStatus con todos los campos numéricos y variaciones
 * 
 * @param role - Rol del usuario: 'entrenador' (personal trainer) o 'gimnasio' (gym)
 * @param userId - ID opcional del usuario para filtrar datos específicos
 * @returns Promise que resuelve con el estado de clientes y leads
 */
export async function getClientStatus(role: 'entrenador' | 'gimnasio', userId?: string): Promise<ClientStatus> {
  // Simulación de delay de red (300-500ms típico para APIs)
  // En producción, este delay vendría del tiempo de respuesta real del servidor
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve({
          total: 24,
          active: 20,
          newThisMonth: 3,
          inactive: 1,
          leads: 5,
          activeVariation: 5.3, // +5.3% respecto al mes anterior
          newVariation: 50.0, // +50% más nuevos clientes que el mes anterior
          inactiveVariation: -33.3, // -33.3% menos inactivos que el mes anterior
          leadsVariation: 25.0, // +25% más leads que el mes anterior
          // Campos legacy para compatibilidad
          activos: 20,
          nuevos: 3,
          inactivos: 1,
          leadsPendientes: 5,
        });
      } else {
        resolve({
          total: 450,
          active: 380,
          newThisMonth: 28,
          inactive: 45,
          leads: 42,
          activeVariation: 2.7, // +2.7% respecto al mes anterior
          newVariation: 12.0, // +12% más nuevos clientes que el mes anterior
          inactiveVariation: -10.0, // -10% menos inactivos que el mes anterior
          leadsVariation: 5.0, // +5% más leads que el mes anterior
          // Campos legacy para compatibilidad
          activos: 380,
          nuevos: 28,
          inactivos: 45,
          leadsPendientes: 42,
        });
      }
    }, 400);
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

