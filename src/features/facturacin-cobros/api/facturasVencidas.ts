import { Factura, FiltroFacturas } from '../types';
import { facturasAPI } from './facturas';
import { notificacionesAPI } from './notificaciones';

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
 */
export async function obtenerFacturasVencidas(
  diasMinimos?: number
): Promise<FacturaVencida[]> {
  const diasVencimiento = diasMinimos ?? configuracionActual.diasVencimientoMinimo;
  
  // Obtener todas las facturas
  const todasFacturas = await facturasAPI.obtenerFacturas();
  
  // Filtrar facturas vencidas y pendientes/parciales
  const facturasVencidas: FacturaVencida[] = todasFacturas
    .filter(factura => {
      const diasVencidos = calcularDiasVencidos(factura);
      const estaVencida = diasVencidos > 0;
      const tienePendiente = factura.montoPendiente > 0;
      const cumpleDiasMinimos = diasVencidos >= diasVencimiento;
      const estadoValido = factura.estado === 'pendiente' || 
                          factura.estado === 'parcial' || 
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
      // Ordenar por días vencidos (mayor a menor) y luego por monto pendiente (mayor a menor)
      if (b.diasVencidos !== a.diasVencidos) {
        return b.diasVencidos - a.diasVencidos;
      }
      return b.montoPendiente - a.montoPendiente;
    });
  
  return facturasVencidas;
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
      
      let notificacionExitosa = false;
      
      // Notificar en el sistema
      if (configuracionActual.notificarEnSistema) {
        // Crear notificación en el sistema (esto se integraría con el sistema de notificaciones)
        console.log(`[Notificación Sistema] Factura ${factura.numeroFactura} vencida por ${factura.diasVencidos} días`);
        notificacionExitosa = true;
      }
      
      // Enviar email si está configurado
      if (configuracionActual.notificarPorEmail) {
        try {
          await notificacionesAPI.enviarFactura(factura, 'email');
          notificacionExitosa = true;
        } catch (error) {
          console.error(`Error al enviar email para factura ${factura.numeroFactura}:`, error);
          // Si solo email está configurado y falla, marcamos como fallida
          if (!configuracionActual.notificarEnSistema) {
            fallidas++;
            continue;
          }
        }
      }
      
      // Contar como enviada si al menos una notificación fue exitosa
      if (notificacionExitosa) {
        enviadas++;
      } else {
        fallidas++;
        continue;
      }
      
      // Registrar que se envió la notificación
      const facturaId = factura.id;
      const notificacionesPrevias = notificacionesEnviadas.get(facturaId) || [];
      notificacionesPrevias.push(new Date());
      notificacionesEnviadas.set(facturaId, notificacionesPrevias);
      
      // Actualizar contador en la factura
      await facturasAPI.actualizarFactura(facturaId, {
        recordatoriosEnviados: factura.recordatoriosEnviados + 1,
        ultimoRecordatorio: new Date()
      });
      
    } catch (error) {
      console.error(`Error al procesar notificación para factura ${factura.numeroFactura}:`, error);
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
  
  const montoTotal = facturasVencidas.reduce((sum, f) => sum + f.montoPendiente, 0);
  const promedioDias = facturasVencidas.reduce((sum, f) => sum + f.diasVencidos, 0) / facturasVencidas.length;
  const facturaMasVencida = facturasVencidas[0]; // Ya está ordenada por días vencidos
  
  return {
    totalFacturasVencidas: facturasVencidas.length,
    montoTotalVencido: montoTotal,
    promedioDiasVencidos: Math.round(promedioDias * 10) / 10,
    facturaMasVencida
  };
}

// ============================================================================
// FUNCIONES MOCK PARA FACTURAS VENCIDAS E IMPAGOS
// ============================================================================
// Estas funciones proporcionan datos mock para el componente FacturasVencidas.tsx
// y para la generación de reportes de facturas vencidas e impagos.
// En producción, estas funciones se conectarán con la API real del backend.

/**
 * Obtiene las facturas vencidas aplicando los filtros especificados.
 * 
 * Esta función es utilizada por:
 * - El componente FacturasVencidas.tsx para mostrar el listado de facturas vencidas
 * - Los reportes de facturas vencidas para generar análisis y exportaciones
 * 
 * @param filtros - Filtros opcionales para refinar la búsqueda de facturas vencidas
 * @returns Promise con un array de facturas vencidas que cumplen los criterios
 */
export async function getFacturasVencidas(
  filtros?: FiltroFacturas
): Promise<Factura[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener todas las facturas
  let facturas = await facturasAPI.obtenerFacturas();
  
  // Filtrar solo facturas vencidas (fecha de vencimiento pasada y con saldo pendiente)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  facturas = facturas.filter(factura => {
    const fechaVencimiento = new Date(factura.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    
    // Debe estar vencida (fecha de vencimiento pasada)
    const estaVencida = fechaVencimiento < hoy;
    
    // Debe tener saldo pendiente
    const tieneSaldoPendiente = factura.montoPendiente > 0;
    
    // Debe estar en estado pendiente, parcial o vencida
    const estadoValido = factura.estado === 'pendiente' || 
                        factura.estado === 'parcial' || 
                        factura.estado === 'vencida';
    
    return estaVencida && tieneSaldoPendiente && estadoValido;
  });
  
  // Aplicar filtros adicionales si se proporcionan
  if (filtros) {
    if (filtros.clienteId) {
      facturas = facturas.filter(f => f.cliente.id === filtros.clienteId);
    }
    
    if (filtros.estado) {
      facturas = facturas.filter(f => f.estado === filtros.estado);
    }
    
    if (filtros.tipo) {
      facturas = facturas.filter(f => f.tipo === filtros.tipo);
    }
    
    if (filtros.fechaInicio) {
      facturas = facturas.filter(f => f.fechaEmision >= filtros.fechaInicio!);
    }
    
    if (filtros.fechaFin) {
      facturas = facturas.filter(f => f.fechaEmision <= filtros.fechaFin!);
    }
    
    if (filtros.montoMin) {
      facturas = facturas.filter(f => f.montoPendiente >= filtros.montoMin!);
    }
    
    if (filtros.montoMax) {
      facturas = facturas.filter(f => f.montoPendiente <= filtros.montoMax!);
    }
    
    if (filtros.numeroFactura) {
      facturas = facturas.filter(f => 
        f.numeroFactura.toLowerCase().includes(filtros.numeroFactura!.toLowerCase())
      );
    }
  }
  
  // Ordenar por fecha de vencimiento (más antiguas primero) y luego por monto pendiente (mayor a menor)
  return facturas.sort((a, b) => {
    const fechaA = new Date(a.fechaVencimiento).getTime();
    const fechaB = new Date(b.fechaVencimiento).getTime();
    
    if (fechaA !== fechaB) {
      return fechaA - fechaB; // Más antiguas primero
    }
    
    return b.montoPendiente - a.montoPendiente; // Mayor monto primero
  });
}

/**
 * Obtiene un resumen consolidado de impagos y facturas vencidas.
 * 
 * Esta función es utilizada por:
 * - El componente FacturasVencidas.tsx para mostrar métricas y resúmenes
 * - Los reportes ejecutivos de facturación y cobros
 * - Los dashboards de gestión de cartera de clientes
 * 
 * @param filtros - Filtros opcionales para calcular el resumen sobre un subconjunto de facturas
 * @returns Promise con el resumen de impagos incluyendo número de facturas, importe total y clientes afectados
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
    (suma, factura) => suma + factura.montoPendiente,
    0
  );
  
  // Contar clientes únicos con impagos
  const clientesUnicos = new Set(
    facturasVencidas.map(factura => factura.cliente.id)
  );
  const clientesConImpagos = clientesUnicos.size;
  
  return {
    numeroFacturasVencidas,
    importeTotalVencido,
    clientesConImpagos
  };
}

/**
 * Marca una factura como en seguimiento activo para cobro.
 * 
 * Esta función es utilizada por:
 * - El componente FacturasVencidas.tsx para permitir a los usuarios marcar facturas en seguimiento
 * - Los reportes de seguimiento de cobros para identificar facturas prioritarias
 * - Los workflows de gestión de cartera para priorizar acciones de cobro
 * 
 * @param facturaId - ID de la factura a marcar como en seguimiento
 * @returns Promise con la factura actualizada incluyendo el campo enSeguimiento en true
 */
export async function marcarComoEnSeguimiento(
  facturaId: string
): Promise<Factura> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener la factura actual
  const factura = await facturasAPI.obtenerFactura(facturaId);
  
  if (!factura) {
    throw new Error(`Factura con ID ${facturaId} no encontrada`);
  }
  
  // Actualizar la factura marcándola como en seguimiento
  const facturaActualizada = await facturasAPI.actualizarFactura(facturaId, {
    enSeguimiento: true
  });
  
  return facturaActualizada;
}

