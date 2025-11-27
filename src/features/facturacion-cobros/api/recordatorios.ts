/**
 * API Mock de Recordatorios Manuales - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de recordatorios manuales de pago, incluyendo:
 * - Envío de recordatorios manuales por canal específico
 * - Consulta de recordatorios enviados para una factura
 * - Historial de recordatorios manuales
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - POST /api/recordatorios/manual - Enviar recordatorio manual
 * - GET /api/recordatorios?facturaId={facturaId} - Obtener recordatorios de una factura
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. RecordatoriosPago.tsx:
 *    - Utiliza `enviarRecordatorioManual()` cuando el usuario selecciona una factura
 *      y hace clic en "Enviar Recordatorio" desde el modal de envío manual.
 *    - Utiliza `getRecordatoriosEnviados()` para mostrar el historial de recordatorios
 *      enviados para cada factura en la tabla de facturas pendientes.
 *    - El componente muestra el estado de cada recordatorio (enviado, pendiente, fallido)
 *      y permite filtrar por canal (email, whatsapp, sms).
 *    - Después de enviar un recordatorio, el componente actualiza automáticamente
 *      la lista de recordatorios enviados y muestra una confirmación al usuario.
 */

import { NotificacionFactura, CanalNotificacion } from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de notificaciones (recordatorios) en memoria
 * En producción, esto sería una base de datos con una tabla/colección de notificaciones
 */
const mockNotificaciones: NotificacionFactura[] = [
  {
    id: 'notif_001',
    facturaId: '1',
    tipo: 'recordatorio',
    canal: 'email',
    enviadoEn: new Date('2025-01-20T10:00:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'notif_002',
    facturaId: '1',
    tipo: 'recordatorio',
    canal: 'whatsapp',
    enviadoEn: new Date('2025-01-22T14:30:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'notif_003',
    facturaId: '3',
    tipo: 'recordatorio',
    canal: 'email',
    enviadoEn: new Date('2025-01-18T09:15:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'notif_004',
    facturaId: '3',
    tipo: 'recordatorio',
    canal: 'sms',
    enviadoEn: new Date('2025-01-21T16:45:00'),
    estadoEnvio: 'fallido'
  }
];

// Contador para IDs únicos (simula secuencia de base de datos)
let contadorNotificaciones = 4;

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Envía un recordatorio manual de pago para una factura por un canal específico
 * 
 * Este método:
 * 1. Valida que la factura exista (verificando con el módulo de facturas)
 * 2. Crea una nueva notificación de tipo 'recordatorio'
 * 3. Simula el envío por el canal especificado
 * 4. Registra la notificación en el sistema
 * 
 * Endpoint real: POST /api/recordatorios/manual
 * Body: { facturaId, canal }
 * 
 * USO EN COMPONENTES:
 * - RecordatoriosPago.tsx: Se llama cuando el usuario:
 *   a) Selecciona una factura de la tabla
 *   b) Abre el modal de envío manual
 *   c) Selecciona un canal (email, whatsapp, sms)
 *   d) Hace clic en "Enviar Recordatorio"
 * 
 *   El componente muestra un estado de carga mientras se envía, y luego
 *   actualiza automáticamente la lista de recordatorios enviados. Si el
 *   envío falla, muestra un mensaje de error al usuario.
 * 
 * @param facturaId - ID de la factura para la cual enviar el recordatorio
 * @param canal - Canal por el cual enviar el recordatorio (email, whatsapp, sms)
 * @returns Promise con la notificación creada
 * @throws Error si la factura no existe o si hay un problema con el envío
 */
export async function enviarRecordatorioManual(
  facturaId: string,
  canal: CanalNotificacion
): Promise<NotificacionFactura> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validar que la factura exista
  // En producción: GET /api/facturas/:id
  try {
    const { getFacturaById } = await import('./facturas');
    const factura = await getFacturaById(facturaId);
    
    if (!factura) {
      throw new Error(`Factura con ID ${facturaId} no encontrada`);
    }

    // Validar que la factura no esté cancelada o completamente pagada
    if (factura.estado === 'cancelada') {
      throw new Error('No se puede enviar recordatorio para una factura cancelada');
    }

    if (factura.estado === 'pagada') {
      throw new Error('No se puede enviar recordatorio para una factura completamente pagada');
    }
  } catch (error) {
    // Si el error es de validación, relanzarlo
    if (error instanceof Error && error.message.includes('no encontrada')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('cancelada')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('completamente pagada')) {
      throw error;
    }
    // Si es otro error (módulo no disponible), continuar de todas formas en el mock
    console.warn('No se pudo validar factura (módulo facturas.ts no disponible):', error);
  }

  // Generar ID único para la notificación
  contadorNotificaciones += 1;
  const id = `notif_${String(contadorNotificaciones).padStart(3, '0')}`;

  // Simular probabilidad de fallo (10% de probabilidad de fallo en el mock)
  const exito = Math.random() > 0.1;
  const estadoEnvio: 'enviado' | 'fallido' = exito ? 'enviado' : 'fallido';

  // Crear la notificación
  const notificacion: NotificacionFactura = {
    id,
    facturaId,
    tipo: 'recordatorio',
    canal,
    enviadoEn: new Date(),
    estadoEnvio
  };

  // Agregar a la lista mock
  mockNotificaciones.push(notificacion);

  // Si falló, lanzar error para que el componente pueda manejarlo
  if (!exito) {
    throw new Error(`Error al enviar recordatorio por ${canal}. Por favor, intente nuevamente.`);
  }

  return notificacion;
}

/**
 * Obtiene todos los recordatorios enviados para una factura específica
 * 
 * Este método:
 * 1. Filtra las notificaciones de tipo 'recordatorio' para la factura
 * 2. Ordena por fecha de envío descendente (más recientes primero)
 * 
 * Endpoint real: GET /api/recordatorios?facturaId={facturaId}&tipo=recordatorio
 * 
 * USO EN COMPONENTES:
 * - RecordatoriosPago.tsx: Se llama para:
 *   a) Mostrar el historial de recordatorios enviados en la tabla de facturas
 *   b) Actualizar la lista después de enviar un nuevo recordatorio
 *   c) Mostrar detalles de recordatorios en el modal de envío
 * 
 *   El componente muestra:
 *   - Fecha y hora de cada recordatorio enviado
 *   - Canal utilizado (email, whatsapp, sms) con iconos
 *   - Estado del envío (enviado, fallido) con badges de color
 *   - Permite al usuario ver qué recordatorios ya se han enviado antes
 *     de enviar uno nuevo
 * 
 * @param facturaId - ID de la factura
 * @returns Promise con array de notificaciones de tipo recordatorio ordenadas por fecha
 */
export async function getRecordatoriosEnviados(
  facturaId: string
): Promise<NotificacionFactura[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Filtrar notificaciones de tipo 'recordatorio' para la factura
  const recordatorios = mockNotificaciones.filter(
    n => n.facturaId === facturaId && n.tipo === 'recordatorio'
  );

  // Ordenar por fecha de envío descendente (más recientes primero)
  recordatorios.sort((a, b) => {
    const fechaA = new Date(a.enviadoEn).getTime();
    const fechaB = new Date(b.enviadoEn).getTime();
    return fechaB - fechaA;
  });

  return recordatorios;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de recordatorios manuales
 * Similar a facturasAPI en facturas.ts y cobrosAPI en cobros.ts
 * 
 * USO:
 * import { recordatoriosAPI } from './api/recordatorios';
 * 
 * const notificacion = await recordatoriosAPI.enviarRecordatorioManual('factura_123', 'email');
 * const recordatorios = await recordatoriosAPI.getRecordatoriosEnviados('factura_123');
 */
export const recordatoriosAPI = {
  enviarRecordatorioManual,
  getRecordatoriosEnviados
};

