/**
 * API Mock de Envío de Recibos y Facturas por Email - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de envío de recibos y facturas por correo electrónico.
 * Incluye:
 * - Envío de facturas por email
 * - Envío de recibos de cobro por email
 * - Consulta del historial de envíos con filtros
 * - Registro del estado de cada envío (enviado, pendiente, fallido)
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - POST /api/recibos-email/enviar-factura - Enviar factura por email
 * - POST /api/recibos-email/enviar-recibo - Enviar recibo de cobro por email
 * - GET /api/recibos-email - Obtener historial de envíos con filtros
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. HistorialPagosCliente.tsx:
 *    - Utiliza `getEnviosRecibos()` para mostrar el historial de envíos de facturas y recibos
 *    - Permite verificar si se han enviado recibos por email y su estado
 *    - Muestra el historial completo de comunicaciones por email con el cliente
 * 
 * 2. ModalPagoRapido.tsx:
 *    - Puede utilizar `enviarReciboCobroPorEmail()` después de registrar un pago
 *    - Ofrece al usuario la opción de enviar automáticamente el recibo por email
 *    - Muestra el estado del envío en el modal
 * 
 * 3. FacturacionManager.tsx:
 *    - Utiliza `enviarFacturaPorEmail()` para enviar facturas desde el listado
 *    - Muestra el historial de envíos de cada factura
 *    - Permite reenviar facturas o recibos que fallaron
 */

import { EnvioReciboEmail, FiltroEnviosRecibos, EstadoEnvio, TipoDocumentoEmail } from '../types';
import { getFacturaById } from './facturas';
import { getCobrosPorFactura } from './cobros';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de envíos de recibos por email en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 * con una tabla/colección de envíos relacionados con facturas y clientes
 */
const mockEnviosRecibos: EnvioReciboEmail[] = [
  {
    id: 'envio_001',
    facturaId: '2',
    clienteId: 'cliente_002',
    emailDestino: 'maria.garcia@example.com',
    tipo: 'factura',
    enviadoEn: new Date('2025-01-10T09:15:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'envio_002',
    facturaId: '2',
    clienteId: 'cliente_002',
    emailDestino: 'maria.garcia@example.com',
    tipo: 'recibo',
    enviadoEn: new Date('2025-01-12T14:30:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'envio_003',
    facturaId: '3',
    clienteId: 'cliente_003',
    emailDestino: 'carlos.lopez@example.com',
    tipo: 'factura',
    enviadoEn: new Date('2025-01-05T08:00:00'),
    estadoEnvio: 'enviado'
  },
  {
    id: 'envio_004',
    facturaId: '3',
    clienteId: 'cliente_003',
    emailDestino: 'carlos.lopez@example.com',
    tipo: 'recordatorio',
    enviadoEn: new Date('2025-01-21T10:00:00'),
    estadoEnvio: 'fallido',
    mensajeErrorOpcional: 'Dirección de email inválida o no existe'
  }
];

// Contador para IDs únicos (simula secuencia de base de datos)
let contadorEnvios = 4;

// ============================================================================
// HELPERS INTERNOS
// ============================================================================

/**
 * Simula el proceso de envío de email
 * En producción, esto se integraría con un servicio de email (SendGrid, AWS SES, etc.)
 * 
 * @param emailDestino - Dirección de email destino
 * @param tipoDocumento - Tipo de documento a enviar
 * @returns Promise que se resuelve con éxito o falla con un error simulado
 */
async function simularEnvioEmail(
  emailDestino: string,
  tipoDocumento: TipoDocumentoEmail
): Promise<{ exito: boolean; mensajeError?: string }> {
  // Simular latencia de red y procesamiento
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailDestino)) {
    return {
      exito: false,
      mensajeError: 'Dirección de email inválida'
    };
  }

  // Simular fallos aleatorios (10% de probabilidad) para testing
  if (Math.random() < 0.1) {
    return {
      exito: false,
      mensajeError: 'Error de conexión con el servidor de email. Intente nuevamente.'
    };
  }

  // Simular rechazo de algunos dominios
  if (emailDestino.includes('rechazado') || emailDestino.includes('bounce')) {
    return {
      exito: false,
      mensajeError: 'El servidor de email rechazó el mensaje. Verifique la dirección.'
    };
  }

  return { exito: true };
}

/**
 * Genera un ID único para un nuevo registro de envío
 * 
 * @returns ID único generado
 */
function generarIdEnvio(): string {
  contadorEnvios += 1;
  return `envio_${String(contadorEnvios).padStart(3, '0')}`;
}

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Envía una factura por correo electrónico
 * 
 * Este método:
 * 1. Valida que la factura exista
 * 2. Obtiene el clienteId de la factura
 * 3. Simula el envío del email
 * 4. Registra el envío en el historial
 * 5. Retorna el registro de envío creado
 * 
 * Endpoint real: POST /api/recibos-email/enviar-factura
 * Body: { facturaId, emailDestino }
 * 
 * USO EN COMPONENTES:
 * - FacturacionManager.tsx: Se llama cuando el usuario hace clic en "Enviar factura por email"
 *   desde el listado de facturas. El componente muestra un mensaje de confirmación y actualiza
 *   el estado del botón según el resultado del envío.
 * 
 * @param facturaId - ID de la factura a enviar
 * @param emailDestino - Dirección de email a la que se enviará la factura
 * @returns Promise con el registro de envío creado
 */
export async function enviarFacturaPorEmail(
  facturaId: string,
  emailDestino: string
): Promise<EnvioReciboEmail> {
  // Simular latencia de red inicial
  await new Promise(resolve => setTimeout(resolve, 200));

  // Validar que la factura exista
  const factura = await getFacturaById(facturaId);
  if (!factura) {
    throw new Error(`Factura con ID ${facturaId} no encontrada`);
  }

  // Validar que el email no esté vacío
  if (!emailDestino || !emailDestino.trim()) {
    throw new Error('La dirección de email no puede estar vacía');
  }

  // Normalizar el email (trim y lowercase)
  const emailNormalizado = emailDestino.trim().toLowerCase();

  // Obtener clienteId de la factura
  const clienteId = factura.clienteId;

  // Simular el envío del email
  const resultado = await simularEnvioEmail(emailNormalizado, 'factura');

  // Determinar el estado del envío
  const estadoEnvio: EstadoEnvio = resultado.exito ? 'enviado' : 'fallido';

  // Crear el registro de envío
  const id = generarIdEnvio();
  const enviadoEn = new Date();

  const nuevoEnvio: EnvioReciboEmail = {
    id,
    facturaId,
    clienteId,
    emailDestino: emailNormalizado,
    tipo: 'factura',
    enviadoEn,
    estadoEnvio,
    mensajeErrorOpcional: resultado.mensajeError
  };

  // Agregar al historial mock
  mockEnviosRecibos.push(nuevoEnvio);

  return nuevoEnvio;
}

/**
 * Envía un recibo de cobro por correo electrónico
 * 
 * Este método:
 * 1. Valida que el cobro exista
 * 2. Obtiene la factura asociada al cobro para obtener el clienteId
 * 3. Simula el envío del email con el recibo de pago
 * 4. Registra el envío en el historial
 * 5. Retorna el registro de envío creado
 * 
 * Endpoint real: POST /api/recibos-email/enviar-recibo
 * Body: { cobroId, emailDestino }
 * 
 * USO EN COMPONENTES:
 * - ModalPagoRapido.tsx: Se llama después de registrar un pago cuando el usuario marca
 *   la opción "Enviar recibo por email". El componente muestra un loading durante el envío
 *   y un mensaje de éxito o error según el resultado. Si el envío es exitoso, el modal
 *   puede cerrarse automáticamente o mostrar un mensaje de confirmación.
 * 
 * - HistorialPagosCliente.tsx: Puede mostrar un botón "Reenviar recibo" junto a cada
 *   cobro registrado, permitiendo al usuario enviar nuevamente el recibo por email
 *   en caso de que no haya llegado al cliente.
 * 
 * @param cobroId - ID del cobro del que se enviará el recibo
 * @param emailDestino - Dirección de email a la que se enviará el recibo
 * @returns Promise con el registro de envío creado
 */
export async function enviarReciboCobroPorEmail(
  cobroId: string,
  emailDestino: string
): Promise<EnvioReciboEmail> {
  // Simular latencia de red inicial
  await new Promise(resolve => setTimeout(resolve, 200));

  // Validar que el email no esté vacío
  if (!emailDestino || !emailDestino.trim()) {
    throw new Error('La dirección de email no puede estar vacía');
  }

  // Normalizar el email (trim y lowercase)
  const emailNormalizado = emailDestino.trim().toLowerCase();

  // Obtener el cobro para acceder a la facturaId
  // En producción, esto se haría con: GET /api/cobros/:cobroId
  // Para el mock, necesitamos buscar el cobro en todas las facturas
  // En producción, habría un endpoint directo: GET /api/cobros/:cobroId
  let cobroEncontrado = null;
  let facturaAsociada = null;

  // Buscar el cobro iterando por todas las facturas (no es eficiente, pero es mock)
  // En producción, esto sería una query directa a la base de datos
  const { getFacturas } = await import('./facturas');
  const todasLasFacturas = await getFacturas();

  for (const factura of todasLasFacturas) {
    const cobros = await getCobrosPorFactura(factura.id);
    const cobro = cobros.find(c => c.id === cobroId);
    if (cobro) {
      cobroEncontrado = cobro;
      facturaAsociada = factura;
      break;
    }
  }

  if (!cobroEncontrado || !facturaAsociada) {
    throw new Error(`Cobro con ID ${cobroId} no encontrado`);
  }

  // Obtener clienteId de la factura
  const clienteId = facturaAsociada.clienteId;
  const facturaId = facturaAsociada.id;

  // Simular el envío del email
  const resultado = await simularEnvioEmail(emailNormalizado, 'recibo');

  // Determinar el estado del envío
  const estadoEnvio: EstadoEnvio = resultado.exito ? 'enviado' : 'fallido';

  // Crear el registro de envío
  const id = generarIdEnvio();
  const enviadoEn = new Date();

  const nuevoEnvio: EnvioReciboEmail = {
    id,
    facturaId,
    clienteId,
    emailDestino: emailNormalizado,
    tipo: 'recibo',
    enviadoEn,
    estadoEnvio,
    mensajeErrorOpcional: resultado.mensajeError
  };

  // Agregar al historial mock
  mockEnviosRecibos.push(nuevoEnvio);

  return nuevoEnvio;
}

/**
 * Obtiene el historial de envíos de recibos y facturas por email con filtros opcionales
 * 
 * Este método permite consultar todos los envíos realizados aplicando diversos filtros:
 * - Por factura
 * - Por cliente
 * - Por tipo de documento (factura, recibo, recordatorio)
 * - Por estado de envío
 * - Por rango de fechas
 * - Por dirección de email
 * 
 * Endpoint real: GET /api/recibos-email
 * Query params: facturaId, clienteId, tipo, estadoEnvio, fechaInicio, fechaFin, emailDestino
 * 
 * USO EN COMPONENTES:
 * - HistorialPagosCliente.tsx: Utiliza esta función para mostrar todos los envíos de
 *   facturas y recibos realizados a un cliente específico. Permite verificar:
 *   - Si se han enviado recibos después de cada pago
 *   - Si hay envíos fallidos que requieren reenvío
 *   - El historial completo de comunicaciones por email
 *   - Fechas y estados de todos los envíos
 * 
 *   El componente puede filtrar por `clienteId` para obtener solo los envíos del cliente
 *   que se está visualizando, creando un timeline completo de facturas, pagos y envíos.
 * 
 * - FacturacionManager.tsx: Puede utilizar esta función para mostrar el historial de
 *   envíos de una factura específica, filtrando por `facturaId`. Esto permite ver
 *   cuántas veces se ha enviado una factura y si algún envío falló.
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con array de registros de envío que cumplen los filtros
 */
export async function getEnviosRecibos(
  filtros?: FiltroEnviosRecibos
): Promise<EnvioReciboEmail[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let envios = [...mockEnviosRecibos];

  // Aplicar filtros si existen
  if (filtros) {
    // Filtro por factura
    if (filtros.facturaId) {
      envios = envios.filter(e => e.facturaId === filtros.facturaId);
    }

    // Filtro por cliente
    if (filtros.clienteId) {
      envios = envios.filter(e => e.clienteId === filtros.clienteId);
    }

    // Filtro por tipo de documento
    if (filtros.tipo) {
      envios = envios.filter(e => e.tipo === filtros.tipo);
    }

    // Filtro por estado de envío
    if (filtros.estadoEnvio) {
      envios = envios.filter(e => e.estadoEnvio === filtros.estadoEnvio);
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      envios = envios.filter(e => {
        const fechaEnvio = new Date(e.enviadoEn);
        fechaEnvio.setHours(0, 0, 0, 0);
        return fechaEnvio >= fechaInicio;
      });
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      envios = envios.filter(e => {
        const fechaEnvio = new Date(e.enviadoEn);
        fechaEnvio.setHours(0, 0, 0, 0);
        return fechaEnvio <= fechaFin;
      });
    }

    // Búsqueda por email destino (búsqueda parcial, case-insensitive)
    if (filtros.emailDestino) {
      const busqueda = filtros.emailDestino.toLowerCase().trim();
      envios = envios.filter(e =>
        e.emailDestino.toLowerCase().includes(busqueda)
      );
    }
  }

  // Ordenar por fecha de envío descendente (más recientes primero)
  envios.sort((a, b) => {
    const fechaA = new Date(a.enviadoEn).getTime();
    const fechaB = new Date(b.enviadoEn).getTime();
    return fechaB - fechaA;
  });

  return envios;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de envío de recibos por email
 * Similar a facturasAPI en facturas.ts y cobrosAPI en cobros.ts
 * 
 * USO:
 * import { recibosEmailAPI } from './api/recibosEmail';
 * 
 * const envio = await recibosEmailAPI.enviarFacturaPorEmail('factura_123', 'cliente@example.com');
 * const historial = await recibosEmailAPI.getEnviosRecibos({ clienteId: 'cliente_001' });
 */
export const recibosEmailAPI = {
  enviarFacturaPorEmail,
  enviarReciboCobroPorEmail,
  getEnviosRecibos
};

