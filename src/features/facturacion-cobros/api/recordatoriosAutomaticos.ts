/**
 * API Mock de Recordatorios Automáticos - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de recordatorios automáticos de pago, incluyendo:
 * - Configuración de recordatorios automáticos (días antes/después, frecuencia, canales)
 * - Guardado y recuperación de configuración
 * - Simulación de recordatorios pendientes según la configuración
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/recordatorios-automaticos/configuracion - Obtener configuración
 * - PUT /api/recordatorios-automaticos/configuracion - Guardar configuración
 * - GET /api/recordatorios-automaticos/pendientes?fechaReferencia={fecha} - Obtener recordatorios pendientes
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. ConfiguracionRecordatoriosAutomaticos.tsx:
 *    - Utiliza `getConfiguracionRecordatoriosAuto()` al cargar el componente para
 *      mostrar la configuración actual en los campos del formulario.
 *    - Utiliza `guardarConfiguracionRecordatoriosAuto()` cuando el usuario hace clic
 *      en "Guardar Configuración" después de modificar los valores.
 *    - El componente permite configurar:
 *      - Días antes del vencimiento para enviar recordatorio
 *      - Días después del vencimiento para enviar recordatorio
 *      - Frecuencia en días para reenvío de recordatorios
 *      - Canales habilitados (email, whatsapp, sms) con checkboxes
 *    - Después de guardar, muestra una confirmación y puede ejecutar una simulación
 *      de recordatorios pendientes para mostrar al usuario qué facturas recibirán
 *      recordatorios según la nueva configuración.
 * 
 * 2. RecordatoriosPago.tsx (tab automático):
 *    - Utiliza `simularRecordatoriosPendientes()` para mostrar una vista previa de
 *      qué recordatorios se enviarían automáticamente según la configuración actual.
 *    - Muestra una lista de facturas que cumplen los criterios para recibir
 *      recordatorios automáticos (basándose en fecha de vencimiento y configuración).
 *    - Permite al usuario verificar que la configuración está correcta antes de
 *      activar el sistema automático.
 */

import { RecordatorioPagoConfig, NotificacionFactura } from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de configuración de recordatorios automáticos
 * En producción, esto sería una tabla/colección de configuración por usuario/entidad
 */
let mockConfiguracion: RecordatorioPagoConfig = {
  diasAntesVencimiento: 3,
  diasDespuesVencimiento: 3,
  frecuenciaDias: 7,
  canales: ['email', 'whatsapp']
};

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Obtiene la configuración actual de recordatorios automáticos
 * 
 * Endpoint real: GET /api/recordatorios-automaticos/configuracion
 * 
 * USO EN COMPONENTES:
 * - ConfiguracionRecordatoriosAutomaticos.tsx: Se llama en useEffect al montar
 *   el componente para cargar la configuración actual y mostrarla en los campos
 *   del formulario. Si no hay configuración guardada, muestra valores por defecto.
 * 
 * @returns Promise con la configuración actual de recordatorios automáticos
 */
export async function getConfiguracionRecordatoriosAuto(): Promise<RecordatorioPagoConfig> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Retornar configuración mock (en producción, se obtendría de la base de datos)
  return { ...mockConfiguracion };
}

/**
 * Guarda la configuración de recordatorios automáticos
 * 
 * Este método:
 * 1. Valida que la configuración tenga valores válidos
 * 2. Guarda la configuración en el sistema
 * 3. Retorna la configuración guardada
 * 
 * Endpoint real: PUT /api/recordatorios-automaticos/configuracion
 * Body: { diasAntesVencimiento, diasDespuesVencimiento, frecuenciaDias, canales }
 * 
 * USO EN COMPONENTES:
 * - ConfiguracionRecordatoriosAutomaticos.tsx: Se llama cuando el usuario:
 *   a) Modifica los valores en el formulario (días, frecuencia, canales)
 *   b) Hace clic en el botón "Guardar Configuración"
 *   c) Confirma el guardado en el modal de confirmación
 * 
 *   El componente muestra un estado de carga mientras se guarda, y luego
 *   muestra un mensaje de éxito. Después de guardar, puede ejecutar una
 *   simulación de recordatorios pendientes para mostrar al usuario el impacto
 *   de la nueva configuración.
 * 
 * @param config - Configuración a guardar
 * @returns Promise con la configuración guardada
 * @throws Error si la configuración es inválida
 */
export async function guardarConfiguracionRecordatoriosAuto(
  config: RecordatorioPagoConfig
): Promise<RecordatorioPagoConfig> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Validaciones
  if (config.diasAntesVencimiento < 0) {
    throw new Error('Los días antes del vencimiento deben ser mayor o igual a 0');
  }

  if (config.diasDespuesVencimiento < 0) {
    throw new Error('Los días después del vencimiento deben ser mayor o igual a 0');
  }

  if (config.frecuenciaDias <= 0) {
    throw new Error('La frecuencia en días debe ser mayor a 0');
  }

  if (!config.canales || config.canales.length === 0) {
    throw new Error('Debe seleccionar al menos un canal de comunicación');
  }

  // Guardar configuración (en producción, se guardaría en la base de datos)
  mockConfiguracion = { ...config };

  return { ...mockConfiguracion };
}

/**
 * Simula qué recordatorios estarían pendientes de envío según la configuración actual
 * 
 * Este método:
 * 1. Obtiene la configuración actual de recordatorios automáticos
 * 2. Obtiene todas las facturas pendientes o vencidas
 * 3. Calcula qué facturas cumplen los criterios para recibir recordatorios:
 *    - Facturas que vencen en X días (según diasAntesVencimiento)
 *    - Facturas vencidas hace Y días (según diasDespuesVencimiento)
 *    - Facturas que cumplen la frecuencia de reenvío
 * 4. Genera notificaciones simuladas para cada factura y canal configurado
 * 
 * Endpoint real: GET /api/recordatorios-automaticos/pendientes?fechaReferencia={fecha}
 * 
 * USO EN COMPONENTES:
 * - RecordatoriosPago.tsx (tab automático): Se llama para mostrar una vista previa
 *   de qué recordatorios se enviarían automáticamente si el sistema estuviera activo.
 *   Muestra una lista de facturas con:
 *   - Número de factura y cliente
 *   - Fecha de vencimiento
 *   - Días hasta/pasados el vencimiento
 *   - Canales que recibirían el recordatorio
 *   - Estado (pendiente de envío)
 * 
 * - ConfiguracionRecordatoriosAutomaticos.tsx: Se puede llamar después de guardar
 *   la configuración para mostrar al usuario el impacto inmediato de los cambios.
 * 
 * @param fechaReferencia - Fecha de referencia para calcular recordatorios pendientes (por defecto: hoy)
 * @returns Promise con array de notificaciones simuladas que estarían pendientes
 */
export async function simularRecordatoriosPendientes(
  fechaReferencia: Date = new Date()
): Promise<NotificacionFactura[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener configuración actual
  const config = await getConfiguracionRecordatoriosAuto();

  // Obtener facturas pendientes o vencidas
  // En producción: GET /api/facturas?estado=pendiente,vencida,parcialmentePagada
  let facturas: any[] = [];
  try {
    const { getFacturas } = await import('./facturas');
    facturas = await getFacturas({
      estado: undefined // Obtener todas las facturas no canceladas ni completamente pagadas
    });
    // Filtrar solo las que no están pagadas completamente
    facturas = facturas.filter(f => f.estado !== 'pagada' && f.estado !== 'cancelada');
  } catch (error) {
    console.warn('No se pudieron obtener facturas (módulo facturas.ts no disponible):', error);
    // En caso de error, retornar array vacío
    return [];
  }

  const recordatoriosPendientes: NotificacionFactura[] = [];
  const fechaRef = new Date(fechaReferencia);
  fechaRef.setHours(0, 0, 0, 0);

  // Procesar cada factura
  for (const factura of facturas) {
    const fechaVencimiento = new Date(factura.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);

    const diasHastaVencimiento = Math.floor(
      (fechaVencimiento.getTime() - fechaRef.getTime()) / (1000 * 60 * 60 * 24)
    );
    const diasDespuesVencimiento = -diasHastaVencimiento; // Negativo si ya pasó

    let debeEnviarRecordatorio = false;

    // Verificar si cumple criterio de días antes del vencimiento
    if (diasHastaVencimiento >= 0 && diasHastaVencimiento <= config.diasAntesVencimiento) {
      debeEnviarRecordatorio = true;
    }

    // Verificar si cumple criterio de días después del vencimiento
    if (diasDespuesVencimiento >= 0 && diasDespuesVencimiento <= config.diasDespuesVencimiento) {
      debeEnviarRecordatorio = true;
    }

    // Si debe enviar recordatorio, crear notificaciones para cada canal configurado
    if (debeEnviarRecordatorio) {
      for (const canal of config.canales) {
        recordatoriosPendientes.push({
          id: `sim_${factura.id}_${canal}_${Date.now()}`,
          facturaId: factura.id,
          tipo: 'recordatorio',
          canal,
          enviadoEn: fechaRef, // Fecha de referencia (simulado)
          estadoEnvio: 'pendiente'
        });
      }
    }
  }

  // Ordenar por fecha de vencimiento de la factura (más urgentes primero)
  recordatoriosPendientes.sort((a, b) => {
    const facturaA = facturas.find(f => f.id === a.facturaId);
    const facturaB = facturas.find(f => f.id === b.facturaId);
    if (!facturaA || !facturaB) return 0;
    const fechaVencA = new Date(facturaA.fechaVencimiento).getTime();
    const fechaVencB = new Date(facturaB.fechaVencimiento).getTime();
    return fechaVencA - fechaVencB;
  });

  return recordatoriosPendientes;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de recordatorios automáticos
 * Similar a facturasAPI en facturas.ts, cobrosAPI en cobros.ts y recordatoriosAPI en recordatorios.ts
 * 
 * USO:
 * import { recordatoriosAutomaticosAPI } from './api/recordatoriosAutomaticos';
 * 
 * const config = await recordatoriosAutomaticosAPI.getConfiguracionRecordatoriosAuto();
 * const configGuardada = await recordatoriosAutomaticosAPI.guardarConfiguracionRecordatoriosAuto(nuevaConfig);
 * const pendientes = await recordatoriosAutomaticosAPI.simularRecordatoriosPendientes();
 */
export const recordatoriosAutomaticosAPI = {
  getConfiguracionRecordatoriosAuto,
  guardarConfiguracionRecordatoriosAuto,
  simularRecordatoriosPendientes
};

