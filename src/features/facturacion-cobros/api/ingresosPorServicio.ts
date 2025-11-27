/**
 * API Mock de Análisis de Ingresos por Servicio - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de análisis de ingresos desglosados por servicio,
 * incluyendo:
 * - Agrupación de ingresos por servicio individual
 * - Cálculo de totales, número de facturas y ticket medio por servicio
 * - Análisis de rentabilidad y distribución de ingresos
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/ingresos/por-servicio?fechaInicio={fechaInicio}&fechaFin={fechaFin} - Obtener ingresos por servicio
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. ReporteIngresosPorServicio.tsx:
 *    - Utiliza `getIngresosPorServicio()` para mostrar el desglose de ingresos por tipo de servicio
 *    - Muestra gráficos de barras y gráficos de pastel (pie charts) con la distribución de ingresos
 *    - Permite al usuario seleccionar un rango de fechas y ver cómo se distribuyen los ingresos
 *    - Muestra métricas como total de ingresos por servicio, número de facturas, ticket medio
 *    - Calcula porcentajes del total para cada servicio
 *    - Los datos se actualizan automáticamente cuando el usuario cambia el período de análisis
 *    - Permite exportar los datos a Excel/CSV para análisis externo
 * 
 * 2. Dashboard y widgets de análisis:
 *    - Utilizan `getIngresosPorServicio()` para mostrar los servicios más rentables
 *    - Permiten identificar qué servicios generan más ingresos
 *    - Ayudan a tomar decisiones sobre qué servicios promocionar o descontinuar
 * 
 * 3. Reportes ejecutivos:
 *    - Utilizan estos datos para crear reportes de rentabilidad por servicio
 *    - Permiten comparar el rendimiento de diferentes servicios a lo largo del tiempo
 */

import { IngresoPorServicio, FiltroFacturas, Factura, LineaFactura } from '../types';
import { getFacturas } from './facturas';

// ============================================================================
// TIPOS Y HELPERS INTERNOS
// ============================================================================

/**
 * Filtros para consultas de ingresos por servicio
 */
export interface FiltroIngresosPorServicio {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  rol?: 'entrenador' | 'gimnasio';
  servicioId?: string; // Filtrar por un servicio específico
}

/**
 * Mapa de IDs de servicio a nombres (mock)
 * En producción, esto vendría de la base de datos de servicios
 */
const nombresServicios: Record<string, string> = {
  'servicio_001': 'Entrenamiento Personal',
  'servicio_002': 'Plan Nutricional Premium',
  'servicio_003': 'Consulta Nutricional',
  'servicio_004': 'Membresía Mensual',
  'servicio_005': 'Paquete de 10 Sesiones',
  'servicio_006': 'Evaluación Física',
  'servicio_007': 'Sesión Grupal',
  'servicio_008': 'Consulta Online',
  'servicio_009': 'Programa de Pérdida de Peso',
  'servicio_010': 'Programa de Ganancia Muscular'
};

/**
 * Obtiene el nombre de un servicio por su ID
 * Si no existe en el mapa, retorna un nombre genérico
 */
const obtenerNombreServicio = (servicioId: string): string => {
  return nombresServicios[servicioId] || `Servicio ${servicioId}`;
};

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Obtiene ingresos desglosados por servicio según los filtros proporcionados
 * 
 * Esta función:
 * 1. Obtiene todas las facturas que cumplen los filtros
 * 2. Filtra solo las facturas pagadas (ingresos reales)
 * 3. Agrupa los ingresos por servicio basándose en las líneas de factura
 * 4. Calcula totales, número de facturas, ticket medio y porcentajes
 * 
 * Endpoint real: GET /api/ingresos/por-servicio
 * Query params: fechaInicio, fechaFin, clienteId, rol, servicioId
 * 
 * USO EN COMPONENTES:
 * - ReporteIngresosPorServicio.tsx: 
 *   * Muestra gráfico de barras horizontal con ingresos por servicio
 *   * Muestra gráfico de pastel con distribución porcentual
 *   * Tabla detallada con todas las métricas por servicio
 *   * Permite cambiar entre vista de barras y pastel
 *   * Calcula y muestra el total general de ingresos
 *   * Permite exportar los datos a Excel/CSV
 *   * Los datos se recalculan cuando el usuario cambia el rango de fechas
 * 
 * - Dashboard de servicios:
 *   * Muestra los top 5 servicios más rentables
 *   * Permite ver rápidamente qué servicios generan más ingresos
 *   * Ayuda a identificar oportunidades de negocio
 * 
 * - Reportes de rentabilidad:
 *   * Compara ingresos por servicio entre diferentes períodos
 *   * Identifica tendencias y cambios en la demanda de servicios
 *   * Ayuda a tomar decisiones estratégicas sobre el catálogo de servicios
 * 
 * @param filtros - Filtros para la consulta de ingresos por servicio
 * @returns Promise con array de ingresos agrupados por servicio, ordenados por total descendente
 */
export async function getIngresosPorServicio(
  filtros?: FiltroIngresosPorServicio
): Promise<IngresoPorServicio[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Determinar rango de fechas por defecto (último mes si no se especifica)
  const fechaFin = filtros?.fechaFin || new Date();
  const fechaInicio = filtros?.fechaInicio || (() => {
    const inicio = new Date(fechaFin);
    inicio.setMonth(inicio.getMonth() - 1);
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  })();

  // Construir filtros para obtener facturas
  const filtrosFacturas: FiltroFacturas = {
    fechaInicio,
    fechaFin,
    clienteId: filtros?.clienteId,
    rol: filtros?.rol
  };

  // Obtener facturas que cumplen los filtros
  const facturas = await getFacturas(filtrosFacturas);

  // Solo contar facturas pagadas para calcular ingresos reales
  const facturasPagadas = facturas.filter(f => f.estado === 'pagada');

  // Agrupar ingresos por servicio
  const ingresosPorServicioMap = new Map<string, {
    totalIngresos: number;
    numeroFacturas: Set<string>; // Usar Set para evitar contar la misma factura múltiples veces
    facturas: Factura[];
  }>();

  // Procesar cada factura pagada
  for (const factura of facturasPagadas) {
    // Si se especificó un servicioId, filtrar facturas que contengan ese servicio
    if (filtros?.servicioId) {
      const tieneServicio = factura.lineas.some(
        linea => linea.servicioIdOpcional === filtros.servicioId
      );
      if (!tieneServicio) continue;
    }

    // Procesar cada línea de la factura
    for (const linea of factura.lineas) {
      // Solo procesar líneas que tienen un servicioId asociado
      if (!linea.servicioIdOpcional) continue;

      const servicioId = linea.servicioIdOpcional;
      const actual = ingresosPorServicioMap.get(servicioId) || {
        totalIngresos: 0,
        numeroFacturas: new Set<string>(),
        facturas: []
      };

      // Sumar el total de la línea al servicio
      actual.totalIngresos += linea.totalLinea;

      // Agregar la factura al Set (evita duplicados)
      actual.numeroFacturas.add(factura.id);

      // Agregar la factura al array si no está ya
      if (!actual.facturas.find(f => f.id === factura.id)) {
        actual.facturas.push(factura);
      }

      ingresosPorServicioMap.set(servicioId, actual);
    }
  }

  // Calcular total general para calcular porcentajes
  const totalGeneral = Array.from(ingresosPorServicioMap.values())
    .reduce((suma, datos) => suma + datos.totalIngresos, 0);

  // Convertir a array y calcular métricas adicionales
  const resultado: IngresoPorServicio[] = Array.from(ingresosPorServicioMap.entries())
    .map(([servicioId, datos]) => {
      const numeroFacturas = datos.numeroFacturas.size;
      const ticketMedio = numeroFacturas > 0
        ? datos.totalIngresos / numeroFacturas
        : 0;

      return {
        servicioId,
        nombreServicio: obtenerNombreServicio(servicioId),
        totalIngresos: datos.totalIngresos,
        numeroFacturas,
        ticketMedio
      };
    })
    .sort((a, b) => b.totalIngresos - a.totalIngresos); // Ordenar por ingresos descendente

  return resultado;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de análisis de ingresos por servicio
 * 
 * USO:
 * import { ingresosPorServicioAPI } from './api/ingresosPorServicio';
 * 
 * const ingresos = await ingresosPorServicioAPI.getIngresosPorServicio({ 
 *   fechaInicio: new Date('2025-01-01'), 
 *   fechaFin: new Date('2025-01-31') 
 * });
 */
export const ingresosPorServicioAPI = {
  getIngresosPorServicio
};

