/**
 * API Mock de Análisis de Ingresos - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de análisis de ingresos totales y por período,
 * incluyendo:
 * - Análisis de ingresos agrupados por período (mensual, trimestral, anual, personalizado)
 * - Resumen general de facturación con métricas clave
 * - Cálculo de variaciones porcentuales entre períodos
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/ingresos/por-periodo?fechaInicio={fechaInicio}&fechaFin={fechaFin} - Obtener ingresos por período
 * - GET /api/ingresos/resumen?periodo={periodo} - Obtener resumen de facturación
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. ReportesFacturacion.tsx:
 *    - Utiliza `getResumenFacturacion()` para mostrar el resumen general del período seleccionado
 *    - Muestra métricas como total facturado, total cobrado, total pendiente, número de facturas pendientes/vencidas
 *    - Permite al usuario seleccionar un rango de fechas y ver el resumen correspondiente
 *    - Los datos se actualizan automáticamente cuando el usuario cambia el período de análisis
 * 
 * 2. CalendarioIngresos.tsx:
 *    - Utiliza `getIngresosPorPeriodo()` para mostrar ingresos agrupados por día/semana/mes en el calendario
 *    - Permite visualizar la distribución temporal de ingresos esperados vs reales
 *    - Muestra tendencias y patrones de ingresos a lo largo del tiempo
 *    - Los datos se agrupan por período según la vista seleccionada (diaria, semanal, mensual)
 * 
 * 3. Dashboard y widgets de resumen:
 *    - Utilizan `getResumenFacturacion()` para mostrar métricas rápidas en widgets
 *    - Permiten ver de un vistazo el estado general de la facturación
 *    - Se actualizan periódicamente o cuando el usuario refresca la página
 */

import { IngresoPorPeriodo, ResumenFacturacion, FiltroFacturas, Factura, Cobro, IngresoDia } from '../types';
import { getFacturas } from './facturas';
import { getCobrosPorFactura } from './cobros';

// ============================================================================
// TIPOS Y HELPERS INTERNOS
// ============================================================================

/**
 * Filtros para consultas de ingresos por período
 */
export interface FiltroIngresosPorPeriodo {
  fechaInicio?: Date;
  fechaFin?: Date;
  agrupacion?: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  clienteId?: string;
  rol?: 'entrenador' | 'gimnasio';
}

/**
 * Obtiene el nombre del mes en español
 */
const obtenerNombreMes = (mes: number): string => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1] || '';
};

/**
 * Agrupa una fecha en un período según el tipo de agrupación
 */
const agruparPorPeriodo = (
  fecha: Date,
  agrupacion: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual'
): string => {
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  switch (agrupacion) {
    case 'diaria':
      return `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    case 'semanal':
      // Calcular semana del año
      const inicioAño = new Date(año, 0, 1);
      const diasTranscurridos = Math.floor((fecha.getTime() - inicioAño.getTime()) / (1000 * 60 * 60 * 24));
      const semana = Math.ceil((diasTranscurridos + inicioAño.getDay() + 1) / 7);
      return `${año}-S${String(semana).padStart(2, '0')}`;
    case 'mensual':
      return `${año}-${String(mes).padStart(2, '0')}`;
    case 'trimestral':
      const trimestre = Math.ceil(mes / 3);
      return `${año}-T${trimestre}`;
    case 'anual':
      return String(año);
    default:
      return `${año}-${String(mes).padStart(2, '0')}`;
  }
};

/**
 * Formatea un período para mostrarlo al usuario
 */
const formatearPeriodo = (
  periodo: string,
  agrupacion: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual'
): string => {
  if (agrupacion === 'diaria') {
    const [año, mes, dia] = periodo.split('-');
    return `${dia}/${mes}/${año}`;
  }
  if (agrupacion === 'semanal') {
    const [año, semana] = periodo.split('-S');
    return `Semana ${semana} de ${año}`;
  }
  if (agrupacion === 'mensual') {
    const [año, mes] = periodo.split('-');
    return `${obtenerNombreMes(parseInt(mes))} ${año}`;
  }
  if (agrupacion === 'trimestral') {
    const [año, trimestre] = periodo.split('-T');
    return `T${trimestre} ${año}`;
  }
  if (agrupacion === 'anual') {
    return `Año ${periodo}`;
  }
  return periodo;
};

/**
 * Calcula la variación porcentual entre dos valores
 */
const calcularVariacionPorcentual = (valorActual: number, valorAnterior: number): number => {
  if (valorAnterior === 0) {
    return valorActual > 0 ? 100 : 0;
  }
  return ((valorActual - valorAnterior) / valorAnterior) * 100;
};

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Obtiene ingresos agrupados por período según los filtros proporcionados
 * 
 * Esta función:
 * 1. Obtiene todas las facturas que cumplen los filtros
 * 2. Obtiene todos los cobros asociados a esas facturas
 * 3. Agrupa los ingresos por período según la agrupación especificada
 * 4. Calcula totales, número de facturas y variaciones porcentuales
 * 
 * Endpoint real: GET /api/ingresos/por-periodo
 * Query params: fechaInicio, fechaFin, agrupacion, clienteId, rol
 * 
 * USO EN COMPONENTES:
 * - ReportesFacturacion.tsx: Muestra gráficos de ingresos por período (líneas de tiempo, barras)
 * - CalendarioIngresos.tsx: Muestra ingresos agrupados por día/semana/mes en vista de calendario
 * - Dashboard: Muestra tendencias de ingresos en widgets de resumen
 * 
 * @param filtros - Filtros para la consulta de ingresos
 * @returns Promise con array de ingresos agrupados por período
 */
export async function getIngresosPorPeriodo(
  filtros?: FiltroIngresosPorPeriodo
): Promise<IngresoPorPeriodo[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Determinar rango de fechas por defecto (últimos 6 meses si no se especifica)
  const fechaFin = filtros?.fechaFin || new Date();
  const fechaInicio = filtros?.fechaInicio || (() => {
    const inicio = new Date(fechaFin);
    inicio.setMonth(inicio.getMonth() - 6);
    return inicio;
  })();

  const agrupacion = filtros?.agrupacion || 'mensual';

  // Construir filtros para obtener facturas
  const filtrosFacturas: FiltroFacturas = {
    fechaInicio,
    fechaFin,
    clienteId: filtros?.clienteId,
    rol: filtros?.rol
  };

  // Obtener facturas que cumplen los filtros
  const facturas = await getFacturas(filtrosFacturas);

  // Obtener todos los cobros de las facturas
  const todosLosCobros: Cobro[] = [];
  for (const factura of facturas) {
    try {
      const cobros = await getCobrosPorFactura(factura.id);
      todosLosCobros.push(...cobros);
    } catch (error) {
      console.warn(`Error obteniendo cobros de factura ${factura.id}:`, error);
    }
  }

  // Agrupar ingresos por período
  const ingresosPorPeriodoMap = new Map<string, {
    totalIngresos: number;
    numeroFacturas: number;
    facturas: Factura[];
  }>();

  // Procesar facturas pagadas (ingresos reales)
  const facturasPagadas = facturas.filter(f => f.estado === 'pagada');
  for (const factura of facturasPagadas) {
    const periodo = agruparPorPeriodo(factura.fechaEmision, agrupacion);
    const actual = ingresosPorPeriodoMap.get(periodo) || {
      totalIngresos: 0,
      numeroFacturas: 0,
      facturas: []
    };
    actual.totalIngresos += factura.total;
    actual.numeroFacturas += 1;
    actual.facturas.push(factura);
    ingresosPorPeriodoMap.set(periodo, actual);
  }

  // También considerar cobros directos (pueden ser de facturas fuera del rango)
  for (const cobro of todosLosCobros) {
    const fechaCobro = new Date(cobro.fechaCobro);
    if (fechaCobro >= fechaInicio && fechaCobro <= fechaFin) {
      const periodo = agruparPorPeriodo(fechaCobro, agrupacion);
      const actual = ingresosPorPeriodoMap.get(periodo) || {
        totalIngresos: 0,
        numeroFacturas: 0,
        facturas: []
      };
      // Solo sumar si no se contó ya en la factura
      const facturaAsociada = facturas.find(f => f.id === cobro.facturaId);
      if (!facturaAsociada || facturaAsociada.estado !== 'pagada') {
        actual.totalIngresos += cobro.importe;
      }
      ingresosPorPeriodoMap.set(periodo, actual);
    }
  }

  // Convertir a array y formatear
  const resultado: IngresoPorPeriodo[] = Array.from(ingresosPorPeriodoMap.entries())
    .map(([periodoKey, datos]) => {
      // Formatear período para mostrar
      const periodoFormateado = formatearPeriodo(periodoKey, agrupacion);

      return {
        periodo: periodoFormateado,
        totalIngresos: datos.totalIngresos,
        numeroFacturas: datos.numeroFacturas,
        variacionPorcentualOpcional: undefined // Se calculará después si hay período anterior
      };
    })
    .sort((a, b) => {
      // Ordenar por período (más antiguos primero)
      const periodoA = typeof a.periodo === 'string' ? a.periodo : '';
      const periodoB = typeof b.periodo === 'string' ? b.periodo : '';
      return periodoA.localeCompare(periodoB);
    });

  // Calcular variaciones porcentuales
  for (let i = 1; i < resultado.length; i++) {
    const actual = resultado[i];
    const anterior = resultado[i - 1];
    actual.variacionPorcentualOpcional = calcularVariacionPorcentual(
      actual.totalIngresos,
      anterior.totalIngresos
    );
  }

  return resultado;
}

/**
 * Obtiene un resumen general de facturación para un período específico
 * 
 * Esta función:
 * 1. Obtiene todas las facturas del período
 * 2. Calcula total facturado (suma de todos los totales de facturas)
 * 3. Calcula total cobrado (suma de todos los cobros del período)
 * 4. Calcula total pendiente (suma de saldos pendientes)
 * 5. Cuenta facturas pendientes y vencidas
 * 
 * Endpoint real: GET /api/ingresos/resumen
 * Query params: fechaInicio, fechaFin, rol
 * 
 * USO EN COMPONENTES:
 * - ReportesFacturacion.tsx: Muestra el resumen principal en la parte superior del reporte
 *   con tarjetas de métricas (total facturado, total cobrado, pendiente, etc.)
 *   El usuario puede seleccionar diferentes períodos y ver cómo cambian las métricas
 * 
 * - Dashboard: Muestra widgets con el resumen del mes actual o período seleccionado
 *   Permite ver de un vistazo el estado general de la facturación
 * 
 * - Widgets de resumen: Se actualizan automáticamente cuando cambia el período
 *   o cuando se registran nuevos cobros/facturas
 * 
 * @param periodo - Período para el resumen (puede ser un objeto con fechaInicio/fechaFin o mes/año)
 * @returns Promise con el resumen de facturación del período
 */
export async function getResumenFacturacion(
  periodo: {
    fechaInicio: Date;
    fechaFin: Date;
  } | {
    mes: number;
    año: number;
  }
): Promise<ResumenFacturacion> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Determinar rango de fechas
  let fechaInicio: Date;
  let fechaFin: Date;

  if ('fechaInicio' in periodo && 'fechaFin' in periodo) {
    fechaInicio = new Date(periodo.fechaInicio);
    fechaFin = new Date(periodo.fechaFin);
  } else {
    // Calcular inicio y fin del mes
    fechaInicio = new Date(periodo.año, periodo.mes - 1, 1);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin = new Date(periodo.año, periodo.mes, 0);
    fechaFin.setHours(23, 59, 59, 999);
  }

  // Obtener todas las facturas del período
  const facturas = await getFacturas({
    fechaInicio,
    fechaFin
  });

  // Calcular total facturado (suma de todos los totales)
  const totalFacturado = facturas.reduce((suma, factura) => suma + factura.total, 0);

  // Obtener todos los cobros del período
  const todosLosCobros: Cobro[] = [];
  for (const factura of facturas) {
    try {
      const cobros = await getCobrosPorFactura(factura.id);
      // Filtrar cobros que están dentro del período
      const cobrosEnPeriodo = cobros.filter(cobro => {
        const fechaCobro = new Date(cobro.fechaCobro);
        return fechaCobro >= fechaInicio && fechaCobro <= fechaFin;
      });
      todosLosCobros.push(...cobrosEnPeriodo);
    } catch (error) {
      console.warn(`Error obteniendo cobros de factura ${factura.id}:`, error);
    }
  }

  // Calcular total cobrado (suma de todos los cobros del período)
  const totalCobrado = todosLosCobros.reduce((suma, cobro) => suma + cobro.importe, 0);

  // Calcular total pendiente (suma de saldos pendientes de facturas del período)
  const totalPendiente = facturas.reduce((suma, factura) => suma + factura.saldoPendiente, 0);

  // Contar facturas pendientes
  const numeroFacturasPendientes = facturas.filter(
    f => f.estado === 'pendiente' || f.estado === 'parcialmentePagada'
  ).length;

  // Contar facturas vencidas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const numeroFacturasVencidas = facturas.filter(f => {
    if (f.estado !== 'vencida') return false;
    const fechaVencimiento = new Date(f.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    return fechaVencimiento < hoy && f.saldoPendiente > 0;
  }).length;

  return {
    totalFacturado,
    totalCobrado,
    totalPendiente,
    numeroFacturasPendientes,
    numeroFacturasVencidas,
    periodo: {
      fechaInicio,
      fechaFin
    }
  };
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Obtiene ingresos agrupados por día de un mes específico
 * 
 * Esta función es utilizada por CalendarioIngresos.tsx para mostrar
 * ingresos esperados y reales por día en la vista de calendario.
 * 
 * @param año - Año del mes
 * @param mes - Mes (1-12)
 * @returns Promise con array de IngresoDia para cada día del mes
 */
export async function obtenerIngresosPorMes(año: number, mes: number): Promise<IngresoDia[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Calcular inicio y fin del mes
  const inicioMes = new Date(año, mes - 1, 1);
  inicioMes.setHours(0, 0, 0, 0);
  const finMes = new Date(año, mes, 0);
  finMes.setHours(23, 59, 59, 999);

  // Obtener facturas del mes
  const facturas = await getFacturas({
    fechaInicio: inicioMes,
    fechaFin: finMes
  });

  // Obtener todos los cobros del mes
  const todosLosCobros: Cobro[] = [];
  for (const factura of facturas) {
    try {
      const cobros = await getCobrosPorFactura(factura.id);
      const cobrosEnMes = cobros.filter(cobro => {
        const fechaCobro = new Date(cobro.fechaCobro);
        return fechaCobro >= inicioMes && fechaCobro <= finMes;
      });
      todosLosCobros.push(...cobrosEnMes);
    } catch (error) {
      console.warn(`Error obteniendo cobros de factura ${factura.id}:`, error);
    }
  }

  // Crear mapa de ingresos por día
  const ingresosPorDia: Map<string, IngresoDia> = new Map();
  const diasEnMes = finMes.getDate();

  // Inicializar todos los días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(año, mes - 1, dia);
    fecha.setHours(0, 0, 0, 0);
    const clave = fecha.toISOString().split('T')[0];
    ingresosPorDia.set(clave, {
      fecha,
      ingresosEsperados: 0,
      ingresosReales: 0,
      facturasPendientes: [],
      cobrosConfirmados: []
    });
  }

  // Agregar facturas pendientes (ingresos esperados) por fecha de vencimiento
  facturas.forEach(factura => {
    if (factura.estado === 'pendiente' || factura.estado === 'vencida' || factura.estado === 'parcialmentePagada') {
      const fechaVencimiento = new Date(factura.fechaVencimiento);
      fechaVencimiento.setHours(0, 0, 0, 0);
      const clave = fechaVencimiento.toISOString().split('T')[0];
      
      const ingresoDia = ingresosPorDia.get(clave);
      if (ingresoDia && factura.saldoPendiente > 0) {
        ingresoDia.ingresosEsperados += factura.saldoPendiente;
        ingresoDia.facturasPendientes.push(factura);
      }
    }
  });

  // Agregar cobros confirmados (ingresos reales) por fecha de cobro
  todosLosCobros.forEach(cobro => {
    const fechaCobro = new Date(cobro.fechaCobro);
    fechaCobro.setHours(0, 0, 0, 0);
    const clave = fechaCobro.toISOString().split('T')[0];
    
    const ingresoDia = ingresosPorDia.get(clave);
    if (ingresoDia) {
      ingresoDia.ingresosReales += cobro.importe;
      ingresoDia.cobrosConfirmados.push(cobro);
    }
  });

  // Convertir a array y ordenar por fecha
  return Array.from(ingresosPorDia.values()).sort((a, b) => 
    a.fecha.getTime() - b.fecha.getTime()
  );
}

/**
 * Objeto API que agrupa todas las funciones de análisis de ingresos
 * 
 * USO:
 * import { ingresosAPI } from './api/ingresos';
 * 
 * const ingresosPorPeriodo = await ingresosAPI.getIngresosPorPeriodo({ fechaInicio, fechaFin });
 * const resumen = await ingresosAPI.getResumenFacturacion({ mes: 1, año: 2025 });
 * const ingresosPorMes = await ingresosAPI.obtenerIngresosPorMes(2025, 1);
 */
export const ingresosAPI = {
  getIngresosPorPeriodo,
  getResumenFacturacion,
  obtenerIngresosPorMes
};

