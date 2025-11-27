/**
 * API de Facturas Vencidas - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica para gestionar facturas vencidas,
 * incluyendo cálculo de días vencidos, notificaciones y seguimiento.
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/facturas-vencidas - Obtener listado de facturas vencidas
 * - POST /api/facturas-vencidas/notificar - Enviar notificaciones
 * - GET /api/facturas-vencidas/resumen - Obtener resumen de impagos
 */

import { Factura, FiltroFacturas, EstadoFactura } from '../types';
import { getFacturas, getFacturaById, actualizarFactura } from './facturas';
import { esFacturaVencida } from '../utils/paymentStatus';

export interface FacturaVencida extends Factura {
  diasVencidos: number;
  ultimaNotificacionEnviada?: Date;
  vecesNotificada: number;
}

export interface ConfiguracionNotificacionesVencidas {
  diasVencimientoMinimo: number; // Número mínimo de días vencidos para notificar (default: 7)
  notificarPorEmail: boolean;
  notificarEnSistema: boolean;
  frecuenciaNotificacion: 'diaria' | 'semanal' | 'una_vez'; // Frecuencia de notificaciones
}

const CONFIGURACION_DEFAULT: ConfiguracionNotificacionesVencidas = {
  diasVencimientoMinimo: 7,
  notificarPorEmail: true,
  notificarEnSistema: true,
  frecuenciaNotificacion: 'diaria'
};

// Almacenar configuración (en producción, esto vendría de la base de datos)
let configuracionActual: ConfiguracionNotificacionesVencidas = { ...CONFIGURACION_DEFAULT };

// Almacenar notificaciones enviadas (en producción, esto estaría en la base de datos)
const notificacionesEnviadas: Map<string, Date[]> = new Map();

/**
 * Calcula los días que una factura lleva vencida
 */
function calcularDiasVencidos(factura: Factura): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVencimiento = new Date(factura.fechaVencimiento);
  fechaVencimiento.setHours(0, 0, 0, 0);
  
  if (fechaVencimiento >= hoy) {
    return 0;
  }
  
  const diferenciaMs = hoy.getTime() - fechaVencimiento.getTime();
  const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  return diferenciaDias;
}

/**
 * Obtiene todas las facturas vencidas por más de X días
 * 
 * @param diasMinimos - Número mínimo de días vencidos (opcional)
 * @returns Promise con array de facturas vencidas
 */
export async function obtenerFacturasVencidas(
  diasMinimos?: number
): Promise<FacturaVencida[]> {
  const diasVencimiento = diasMinimos ?? configuracionActual.diasVencimientoMinimo;
  
  // Obtener todas las facturas
  const todasFacturas = await getFacturas();
  
  // Filtrar facturas vencidas y pendientes/parciales
  const facturasVencidas: FacturaVencida[] = todasFacturas
    .filter(factura => {
      const diasVencidos = calcularDiasVencidos(factura);
      const estaVencida = diasVencidos > 0;
      const tienePendiente = factura.saldoPendiente > 0;
      const cumpleDiasMinimos = diasVencidos >= diasVencimiento;
      const estadoValido = factura.estado === 'pendiente' || 
                          factura.estado === 'parcialmentePagada' || 
                          factura.estado === 'vencida';
      
      return estaVencida && tienePendiente && cumpleDiasMinimos && estadoValido;
    })
    .map(factura => {
      const diasVencidos = calcularDiasVencidos(factura);
      const facturaId = factura.id;
      const notificaciones = notificacionesEnviadas.get(facturaId) || [];
      const ultimaNotificacion = notificaciones.length > 0 
        ? notificaciones[notificaciones.length - 1]
        : undefined;
      
      return {
        ...factura,
        diasVencidos,
        ultimaNotificacionEnviada: ultimaNotificacion,
        vecesNotificada: notificaciones.length
      };
    })
    .sort((a, b) => {
      // Ordenar por días vencidos (mayor a menor) y luego por saldo pendiente (mayor a menor)
      if (b.diasVencidos !== a.diasVencidos) {
        return b.diasVencidos - a.diasVencidos;
      }
      return b.saldoPendiente - a.saldoPendiente;
    });
  
  return facturasVencidas;
}

/**
 * Obtiene las facturas vencidas aplicando los filtros especificados
 * 
 * @param filtros - Filtros opcionales para refinar la búsqueda
 * @returns Promise con array de facturas vencidas
 */
export async function getFacturasVencidas(
  filtros?: FiltroFacturas
): Promise<Factura[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener todas las facturas
  let facturas = await getFacturas(filtros);
  
  // Filtrar solo facturas vencidas (fecha de vencimiento pasada y con saldo pendiente)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  facturas = facturas.filter(factura => {
    return esFacturaVencida(factura.estado, factura.fechaVencimiento) && 
           factura.saldoPendiente > 0;
  });
  
  // Ordenar por fecha de vencimiento (más antiguas primero) y luego por saldo pendiente (mayor a menor)
  return facturas.sort((a, b) => {
    const fechaA = new Date(a.fechaVencimiento).getTime();
    const fechaB = new Date(b.fechaVencimiento).getTime();
    
    if (fechaA !== fechaB) {
      return fechaA - fechaB; // Más antiguas primero
    }
    
    return b.saldoPendiente - a.saldoPendiente; // Mayor saldo primero
  });
}

/**
 * Obtiene un resumen consolidado de impagos y facturas vencidas
 * 
 * @param filtros - Filtros opcionales para calcular el resumen
 * @returns Promise con el resumen de impagos
 */
export async function getResumenImpagos(
  filtros?: FiltroFacturas
): Promise<{
  numeroFacturasVencidas: number;
  importeTotalVencido: number;
  clientesConImpagos: number;
}> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Obtener facturas vencidas con los filtros aplicados
  const facturasVencidas = await getFacturasVencidas(filtros);
  
  // Calcular métricas
  const numeroFacturasVencidas = facturasVencidas.length;
  const importeTotalVencido = facturasVencidas.reduce(
    (suma, factura) => suma + factura.saldoPendiente,
    0
  );
  
  // Contar clientes únicos con impagos
  const clientesUnicos = new Set(
    facturasVencidas.map(factura => factura.clienteId)
  );
  const clientesConImpagos = clientesUnicos.size;
  
  return {
    numeroFacturasVencidas,
    importeTotalVencido,
    clientesConImpagos
  };
}

/**
 * Marca una factura como en seguimiento activo para cobro
 * 
 * @param facturaId - ID de la factura a marcar como en seguimiento
 * @returns Promise con la factura actualizada
 */
export async function marcarComoEnSeguimiento(
  facturaId: string
): Promise<Factura> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener la factura actual
  const factura = await getFacturaById(facturaId);
  
  if (!factura) {
    throw new Error(`Factura con ID ${facturaId} no encontrada`);
  }
  
  // Actualizar notas internas para indicar seguimiento
  const notasActualizadas = factura.notasInternas 
    ? `${factura.notasInternas}\n[En seguimiento] ${new Date().toLocaleDateString()}`
    : `[En seguimiento] ${new Date().toLocaleDateString()}`;
  
  // Actualizar la factura
  const facturaActualizada = await actualizarFactura(facturaId, {
    notasInternas: notasActualizadas
  });
  
  return facturaActualizada;
}

/**
 * Obtiene la configuración de notificaciones de facturas vencidas
 */
export async function obtenerConfiguracionNotificacionesVencidas(): Promise<ConfiguracionNotificacionesVencidas> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...configuracionActual };
}

/**
 * Actualiza la configuración de notificaciones de facturas vencidas
 */
export async function actualizarConfiguracionNotificacionesVencidas(
  configuracion: Partial<ConfiguracionNotificacionesVencidas>
): Promise<ConfiguracionNotificacionesVencidas> {
  await new Promise(resolve => setTimeout(resolve, 300));
  configuracionActual = {
    ...configuracionActual,
    ...configuracion
  };
  return { ...configuracionActual };
}

/**
 * Obtiene estadísticas de facturas vencidas
 */
export async function obtenerEstadisticasFacturasVencidas(): Promise<{
  totalFacturasVencidas: number;
  montoTotalVencido: number;
  promedioDiasVencidos: number;
  facturaMasVencida?: FacturaVencida;
}> {
  const facturasVencidas = await obtenerFacturasVencidas();
  
  if (facturasVencidas.length === 0) {
    return {
      totalFacturasVencidas: 0,
      montoTotalVencido: 0,
      promedioDiasVencidos: 0
    };
  }
  
  const montoTotal = facturasVencidas.reduce((sum, f) => sum + f.saldoPendiente, 0);
  const promedioDias = facturasVencidas.reduce((sum, f) => sum + f.diasVencidos, 0) / facturasVencidas.length;
  const facturaMasVencida = facturasVencidas[0]; // Ya está ordenada por días vencidos
  
  return {
    totalFacturasVencidas: facturasVencidas.length,
    montoTotalVencido: montoTotal,
    promedioDiasVencidos: Math.round(promedioDias * 10) / 10,
    facturaMasVencida
  };
}

/**
 * Envía notificaciones para facturas vencidas
 */
export async function enviarNotificacionesFacturasVencidas(
  facturas?: FacturaVencida[]
): Promise<{ enviadas: number; fallidas: number }> {
  const facturasAVerificar = facturas || await obtenerFacturasVencidas();
  
  let enviadas = 0;
  let fallidas = 0;
  
  for (const factura of facturasAVerificar) {
    try {
      // Verificar si debemos notificar según la frecuencia configurada
      const debeNotificar = debeEnviarNotificacion(factura);
      
      if (!debeNotificar) {
        continue;
      }
      
      // Registrar que se envió la notificación
      const facturaId = factura.id;
      const notificacionesPrevias = notificacionesEnviadas.get(facturaId) || [];
      notificacionesPrevias.push(new Date());
      notificacionesEnviadas.set(facturaId, notificacionesPrevias);
      
      enviadas++;
    } catch (error) {
      console.error(`Error al procesar notificación para factura ${factura.numero}:`, error);
      fallidas++;
    }
  }
  
  return { enviadas, fallidas };
}

/**
 * Determina si se debe enviar una notificación según la frecuencia configurada
 */
function debeEnviarNotificacion(factura: FacturaVencida): boolean {
  const notificaciones = notificacionesEnviadas.get(factura.id) || [];
  
  if (notificaciones.length === 0) {
    return true; // Primera notificación siempre se envía
  }
  
  const ultimaNotificacion = notificaciones[notificaciones.length - 1];
  const ahora = new Date();
  const diasDesdeUltimaNotificacion = Math.floor(
    (ahora.getTime() - ultimaNotificacion.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  switch (configuracionActual.frecuenciaNotificacion) {
    case 'una_vez':
      return false; // Ya se envió una vez
    case 'diaria':
      return diasDesdeUltimaNotificacion >= 1;
    case 'semanal':
      return diasDesdeUltimaNotificacion >= 7;
    default:
      return true;
  }
}

