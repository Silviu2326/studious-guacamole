/**
 * API Mock de Notificaciones - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de consulta de notificaciones de facturación, incluyendo:
 * - Consulta de todas las notificaciones con filtros avanzados
 * - Historial completo de comunicaciones de facturación
 * - Filtrado por tipo, canal, estado, factura, fechas, etc.
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/notificaciones - Obtener notificaciones con filtros
 * - GET /api/notificaciones/:id - Obtener notificación específica
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. RecordatoriosPago.tsx:
 *    - Utiliza `getNotificacionesFacturacion()` para mostrar el historial completo
 *    - de notificaciones relacionadas con facturas (recordatorios, notificaciones
 *    - de nueva factura, confirmaciones de pago, alertas de factura vencida).
 *    - Permite filtrar por:
 *      - Tipo de notificación (nuevaFactura, recordatorio, pagoRecibido, facturaVencida)
 *      - Canal (email, whatsapp, sms)
 *      - Estado de envío (enviado, pendiente, fallido)
 *      - Rango de fechas
 *      - Factura específica
 *    - Muestra métricas como:
 *      - Total de notificaciones enviadas
 *      - Tasa de éxito de envíos
 *      - Notificaciones por canal
 *      - Notificaciones por tipo
 * 
 * 2. Dashboard de Facturación:
 *    - Puede utilizar esta API para mostrar widgets con:
 *      - Últimas notificaciones enviadas
 *      - Notificaciones fallidas que requieren atención
 *      - Estadísticas de comunicaciones
 * 
 * 3. Reportes de Comunicaciones:
 *    - Utiliza esta API para generar reportes de todas las comunicaciones
 *      enviadas a clientes relacionadas con facturación, permitiendo
 *      análisis de efectividad de recordatorios y canales preferidos.
 */

import { NotificacionFactura, FiltroNotificaciones } from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de notificaciones en memoria
 * En producción, esto sería una base de datos con una tabla/colección de notificaciones
 * 
 * NOTA: Este array se comparte con recordatorios.ts en el mock, pero en producción
 * estarían en la misma tabla de base de datos. Para el mock, importamos las notificaciones
 * desde recordatorios.ts para mantener consistencia.
 */
let mockNotificacionesCompletas: NotificacionFactura[] = [];

/**
 * Inicializa las notificaciones mock con datos de ejemplo
 * En producción, esto vendría de la base de datos
 */
async function inicializarNotificacionesMock(): Promise<void> {
  if (mockNotificacionesCompletas.length > 0) {
    return; // Ya inicializado
  }

  // Intentar obtener notificaciones de recordatorios.ts
  try {
    // En el mock, las notificaciones de recordatorios también son notificaciones
    // En producción, todas estarían en la misma tabla
    const { getRecordatoriosEnviados } = await import('./recordatorios');
    
    // Obtener recordatorios de las facturas mock existentes
    const facturasMock = ['1', '2', '3', '4'];
    for (const facturaId of facturasMock) {
      try {
        const recordatorios = await getRecordatoriosEnviados(facturaId);
        mockNotificacionesCompletas.push(...recordatorios);
      } catch (error) {
        // Continuar si hay error
      }
    }
  } catch (error) {
    // Si no se puede importar, crear datos mock básicos
    console.warn('No se pudieron cargar notificaciones de recordatorios:', error);
  }

  // Agregar otros tipos de notificaciones de ejemplo
  mockNotificacionesCompletas.push(
    {
      id: 'notif_nueva_001',
      facturaId: '1',
      tipo: 'nuevaFactura',
      canal: 'email',
      enviadoEn: new Date('2025-01-15T08:00:00'),
      estadoEnvio: 'enviado'
    },
    {
      id: 'notif_pago_001',
      facturaId: '2',
      tipo: 'pagoRecibido',
      canal: 'email',
      enviadoEn: new Date('2025-01-12T15:30:00'),
      estadoEnvio: 'enviado'
    },
    {
      id: 'notif_vencida_001',
      facturaId: '3',
      tipo: 'facturaVencida',
      canal: 'whatsapp',
      enviadoEn: new Date('2025-01-21T09:00:00'),
      estadoEnvio: 'enviado'
    },
    {
      id: 'notif_nueva_002',
      facturaId: '4',
      tipo: 'nuevaFactura',
      canal: 'email',
      enviadoEn: new Date('2025-01-20T10:00:00'),
      estadoEnvio: 'enviado'
    }
  );
}

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Obtiene todas las notificaciones de facturación con filtros opcionales
 * 
 * Este método:
 * 1. Inicializa las notificaciones mock si es necesario
 * 2. Aplica los filtros especificados
 * 3. Ordena por fecha de envío descendente (más recientes primero)
 * 
 * Endpoint real: GET /api/notificaciones
 * Query params: facturaId, tipo, canal, estadoEnvio, fechaInicio, fechaFin
 * 
 * USO EN COMPONENTES:
 * - RecordatoriosPago.tsx: Se llama para mostrar el historial completo de
 *   notificaciones en la sección de historial. El componente permite al usuario:
 *   - Ver todas las notificaciones enviadas (no solo recordatorios)
 *   - Filtrar por tipo, canal, estado, factura, fechas
 *   - Exportar el historial a CSV/Excel
 *   - Ver detalles de cada notificación (fecha, canal, estado, factura asociada)
 * 
 * - Dashboard de Facturación: Puede llamar esta función con filtros específicos
 *   para mostrar widgets como "Últimas 5 notificaciones", "Notificaciones fallidas
 *   del día", etc.
 * 
 * - Reportes: Utiliza esta función para generar reportes completos de comunicaciones,
 *   analizando patrones de envío, efectividad por canal, etc.
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con array de notificaciones que cumplen los filtros
 */
export async function getNotificacionesFacturacion(
  filtros?: FiltroNotificaciones
): Promise<NotificacionFactura[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Inicializar notificaciones mock
  await inicializarNotificacionesMock();

  let notificaciones = [...mockNotificacionesCompletas];

  // Aplicar filtros si existen
  if (filtros) {
    // Filtro por factura
    if (filtros.facturaId) {
      notificaciones = notificaciones.filter(n => n.facturaId === filtros.facturaId);
    }

    // Filtro por tipo
    if (filtros.tipo) {
      notificaciones = notificaciones.filter(n => n.tipo === filtros.tipo);
    }

    // Filtro por canal
    if (filtros.canal) {
      notificaciones = notificaciones.filter(n => n.canal === filtros.canal);
    }

    // Filtro por estado de envío
    if (filtros.estadoEnvio) {
      notificaciones = notificaciones.filter(n => n.estadoEnvio === filtros.estadoEnvio);
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      notificaciones = notificaciones.filter(n => {
        const fechaEnvio = new Date(n.enviadoEn);
        fechaEnvio.setHours(0, 0, 0, 0);
        return fechaEnvio >= fechaInicio;
      });
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      notificaciones = notificaciones.filter(n => {
        const fechaEnvio = new Date(n.enviadoEn);
        fechaEnvio.setHours(0, 0, 0, 0);
        return fechaEnvio <= fechaFin;
      });
    }
  }

  // Ordenar por fecha de envío descendente (más recientes primero)
  notificaciones.sort((a, b) => {
    const fechaA = new Date(a.enviadoEn).getTime();
    const fechaB = new Date(b.enviadoEn).getTime();
    return fechaB - fechaA;
  });

  return notificaciones;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de notificaciones
 * Similar a facturasAPI en facturas.ts, cobrosAPI en cobros.ts, etc.
 * 
 * USO:
 * import { notificacionesAPI } from './api/notificaciones';
 * 
 * const todas = await notificacionesAPI.getNotificacionesFacturacion();
 * const filtradas = await notificacionesAPI.getNotificacionesFacturacion({
 *   tipo: 'recordatorio',
 *   canal: 'email',
 *   fechaInicio: new Date('2025-01-01')
 * });
 */
export const notificacionesAPI = {
  getNotificacionesFacturacion
};

