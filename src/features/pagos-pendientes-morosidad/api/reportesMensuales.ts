import { 
  ReporteMensualSimple, 
  PagoPendiente,
  ReporteMensualMorosidadSimple,
  ReporteMorosidad,
  FiltroMorosidad,
  ComparativaMesAnterior,
  NivelRiesgo,
  ClienteMorosoTop,
  MetricasMorosidad
} from '../types';
import { morosidadAPI } from './morosidad';

// Mock data para pagos pagados (en producción vendría de la base de datos)
const mockPagosPagados: Array<{
  id: string;
  facturaId: string;
  numeroFactura: string;
  clienteId: string;
  clienteNombre: string;
  monto: number;
  fechaPago: Date;
  metodoPago?: string;
}> = [
  {
    id: 'pago1',
    facturaId: 'factura1',
    numeroFactura: 'FAC-2024-001',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    monto: 238000,
    fechaPago: new Date('2024-02-05'),
    metodoPago: 'nequi'
  },
  {
    id: 'pago2',
    facturaId: 'factura6',
    numeroFactura: 'FAC-2024-010',
    clienteId: 'cliente6',
    clienteNombre: 'Pedro López',
    monto: 150000,
    fechaPago: new Date('2024-02-10'),
    metodoPago: 'transferencia'
  },
  {
    id: 'pago3',
    facturaId: 'factura7',
    numeroFactura: 'FAC-2024-011',
    clienteId: 'cliente7',
    clienteNombre: 'Laura Sánchez',
    monto: 300000,
    fechaPago: new Date('2024-02-15'),
    metodoPago: 'efectivo'
  }
];

/**
 * Genera métricas mock coherentes para un mes específico
 */
const generarMetricasMock = (mes: number, anio: number) => {
  // Base de datos mock con variaciones mensuales realistas
  const variacionBase = (mes * 7 + anio * 3) % 100; // Variación determinística pero coherente
  
  // Total de morosidad: entre 2M y 8M COP con variaciones
  const totalMorosidad = 2000000 + (variacionBase * 60000);
  
  // Número de clientes: entre 15 y 45
  const numeroClientes = 15 + Math.floor(variacionBase * 0.3);
  
  // Tasa de recuperación: entre 0.45 y 0.85 (45% a 85%)
  const tasaRecuperacion = 0.45 + (variacionBase * 0.004);
  
  return { totalMorosidad, numeroClientes, tasaRecuperacion };
};

/**
 * Calcula la comparativa con el mes anterior
 */
const calcularComparativaMesAnterior = (
  mesActual: number,
  anioActual: number,
  totalMorosidadActual: number
): ComparativaMesAnterior => {
  // Calcular mes anterior
  let mesAnterior = mesActual - 1;
  let anioAnterior = anioActual;
  
  if (mesAnterior < 1) {
    mesAnterior = 12;
    anioAnterior = anioActual - 1;
  }
  
  // Obtener métricas del mes anterior
  const { totalMorosidad: totalMorosidadAnterior } = generarMetricasMock(mesAnterior, anioAnterior);
  
  // Calcular diferencia porcentual
  const diferencia = totalMorosidadActual - totalMorosidadAnterior;
  const diferenciaPorcentual = (diferencia / totalMorosidadAnterior) * 100;
  
  // Si la diferencia es menor al 2%, se considera igual
  if (Math.abs(diferenciaPorcentual) < 2) {
    return 'igual';
  }
  
  return diferenciaPorcentual > 0 ? 'sube' : 'baja';
};

export const reportesMensualesAPI = {
  // Obtener reporte mensual simple
  async obtenerReporteMensual(mes: number, año: number): Promise<ReporteMensualSimple> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calcular fechas del mes
    const fechaInicio = new Date(año, mes - 1, 1);
    const fechaFin = new Date(año, mes, 0, 23, 59, 59, 999);
    
    // Obtener pagos pagados en el mes
    const pagosRecibidos = mockPagosPagados.filter(pago => {
      const fechaPago = new Date(pago.fechaPago);
      return fechaPago >= fechaInicio && fechaPago <= fechaFin;
    });
    
    // Obtener pagos pendientes que deberían haberse pagado en el mes
    const todosLosPagos = await morosidadAPI.obtenerPagosPendientes();
    
    // Pagos que vencen en el mes o están pendientes
    const pagosFaltantes = todosLosPagos
      .filter(pago => {
        const fechaVenc = new Date(pago.fechaVencimiento);
        // Incluir pagos que vencieron en el mes o antes
        return fechaVenc <= fechaFin && pago.estado !== 'pagado';
      })
      .map(pago => ({
        id: pago.id,
        facturaId: pago.facturaId,
        numeroFactura: pago.numeroFactura,
        clienteNombre: pago.cliente.nombre,
        montoPendiente: pago.montoPendiente,
        fechaVencimiento: pago.fechaVencimiento,
        diasRetraso: pago.diasRetraso
      }));
    
    const totalCobrado = pagosRecibidos.reduce((sum, p) => sum + p.monto, 0);
    const totalPendiente = pagosFaltantes.reduce((sum, p) => sum + p.montoPendiente, 0);
    
    return {
      mes,
      año,
      totalCobrado,
      totalPendiente,
      pagosRecibidos: pagosRecibidos.map(p => ({
        id: p.id,
        facturaId: p.facturaId,
        numeroFactura: p.numeroFactura,
        clienteNombre: p.clienteNombre,
        monto: p.monto,
        fechaPago: p.fechaPago,
        metodoPago: p.metodoPago as any
      })),
      pagosFaltantes
    };
  },

  /**
   * Obtiene un reporte mensual simplificado de morosidad con métricas clave.
   * Este tipo de reporte se utiliza en ReporteMensualSimple.tsx para mostrar
   * un resumen ejecutivo de la morosidad del mes.
   * 
   * @param mes - Número del mes (1-12)
   * @param anio - Año
   * @returns Reporte mensual simplificado con métricas de morosidad y comparativa
   */
  async getReporteMensualMorosidadSimple(
    mes: number, 
    anio: number
  ): Promise<ReporteMensualMorosidadSimple> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generar métricas mock coherentes
    const { totalMorosidad, numeroClientes, tasaRecuperacion } = generarMetricasMock(mes, anio);
    
    // Calcular comparativa con el mes anterior
    const comparativaMesAnterior = calcularComparativaMesAnterior(mes, anio, totalMorosidad);
    
    // Generar comentario ejecutivo basado en la comparativa
    const comentarioEjecutivo = comparativaMesAnterior === 'sube'
      ? `La morosidad ha aumentado respecto al mes anterior. Se recomienda intensificar las acciones de cobro.`
      : comparativaMesAnterior === 'baja'
      ? `La morosidad ha disminuido respecto al mes anterior. Las estrategias de recuperación están siendo efectivas.`
      : `La morosidad se mantiene estable respecto al mes anterior. Continuar con las estrategias actuales.`;
    
    return {
      id: `reporte-${anio}-${mes.toString().padStart(2, '0')}`,
      mes,
      anio,
      totalMorosidad,
      numeroClientes,
      tasaRecuperacion,
      comparativaMesAnterior,
      comentarioEjecutivo
    };
  },

  /**
   * Obtiene reportes de morosidad por período con análisis detallado.
   * Este tipo de reporte se utiliza en ReportesMorosidad.tsx para mostrar
   * análisis completos de morosidad con métricas agregadas, distribución por riesgo
   * y top clientes morosos.
   * 
   * @param filtros - Filtros para el período y criterios de búsqueda
   * @returns Array de reportes de morosidad que cumplen con los filtros
   */
  async getReportesMorosidadPorPeriodo(
    filtros?: FiltroMorosidad
  ): Promise<ReporteMorosidad[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtener pagos pendientes aplicando filtros
    const pagosPendientes = await morosidadAPI.obtenerPagosPendientes(filtros);
    
    // Si no hay filtros de fecha, generar reportes para los últimos 3 meses
    const fechaInicio = filtros?.fechaInicio || new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
    const fechaFin = filtros?.fechaFin || new Date();
    
    // Generar reportes mensuales para el período
    const reportes: ReporteMorosidad[] = [];
    const fechaActual = new Date(fechaInicio);
    
    while (fechaActual <= fechaFin) {
      const mes = fechaActual.getMonth() + 1;
      const anio = fechaActual.getFullYear();
      
      // Calcular fechas del mes
      const inicioMes = new Date(anio, mes - 1, 1);
      const finMes = new Date(anio, mes, 0, 23, 59, 59, 999);
      
      // Filtrar pagos del mes
      const pagosDelMes = pagosPendientes.filter(pago => {
        const fechaVenc = new Date(pago.fechaVencimiento);
        return fechaVenc >= inicioMes && fechaVenc <= finMes;
      });
      
      // Calcular métricas agregadas
      const totalMorosidad = pagosDelMes.reduce((sum, p) => sum + p.montoPendiente, 0);
      const numeroClientesMorosos = new Set(pagosDelMes.map(p => p.cliente.id)).size;
      const diasPromedioRetraso = pagosDelMes.length > 0
        ? pagosDelMes.reduce((sum, p) => sum + p.diasRetraso, 0) / pagosDelMes.length
        : 0;
      
      // Calcular tasa de recuperación (mock: basada en pagos pagados vs pendientes)
      const pagosPagados = pagosDelMes.filter(p => p.estado === 'pagado').length;
      const tasaRecuperacion = pagosDelMes.length > 0
        ? pagosPagados / pagosDelMes.length
        : 0;
      
      // Distribución por nivel de riesgo
      const distribucionPorRiesgo: Record<NivelRiesgo, { cantidad: number; importe: number }> = {
        bajo: { cantidad: 0, importe: 0 },
        medio: { cantidad: 0, importe: 0 },
        alto: { cantidad: 0, importe: 0 },
        critico: { cantidad: 0, importe: 0 }
      };
      
      // Mapear riesgo de PagoPendiente a NivelRiesgo
      pagosDelMes.forEach(pago => {
        const nivelRiesgo: NivelRiesgo = 
          pago.riesgo === 'critico' ? 'critico' :
          pago.riesgo === 'alto' ? 'alto' :
          pago.riesgo === 'medio' ? 'medio' : 'bajo';
        
        distribucionPorRiesgo[nivelRiesgo].cantidad++;
        distribucionPorRiesgo[nivelRiesgo].importe += pago.montoPendiente;
      });
      
      // Top 10 clientes morosos del mes
      const clientesMap = new Map<string, { clienteId: string; clienteNombre: string; importeTotal: number; diasMaximo: number; nivelRiesgo: NivelRiesgo }>();
      
      pagosDelMes.forEach(pago => {
        const clienteId = pago.cliente.id;
        const nivelRiesgo: NivelRiesgo = 
          pago.riesgo === 'critico' ? 'critico' :
          pago.riesgo === 'alto' ? 'alto' :
          pago.riesgo === 'medio' ? 'medio' : 'bajo';
        
        if (clientesMap.has(clienteId)) {
          const cliente = clientesMap.get(clienteId)!;
          cliente.importeTotal += pago.montoPendiente;
          cliente.diasMaximo = Math.max(cliente.diasMaximo, pago.diasRetraso);
          // Actualizar nivel de riesgo al más alto
          if (nivelRiesgo === 'critico' || 
              (nivelRiesgo === 'alto' && cliente.nivelRiesgo !== 'critico') ||
              (nivelRiesgo === 'medio' && !['critico', 'alto'].includes(cliente.nivelRiesgo))) {
            cliente.nivelRiesgo = nivelRiesgo;
          }
        } else {
          clientesMap.set(clienteId, {
            clienteId: pago.cliente.id,
            clienteNombre: pago.cliente.nombre,
            importeTotal: pago.montoPendiente,
            diasMaximo: pago.diasRetraso,
            nivelRiesgo
          });
        }
      });
      
      const topClientesMorosos: ClienteMorosoTop[] = Array.from(clientesMap.values())
        .sort((a, b) => b.importeTotal - a.importeTotal)
        .slice(0, 10)
        .map(cliente => ({
          clienteId: cliente.clienteId,
          clienteNombre: cliente.clienteNombre,
          importeTotalAdeudado: cliente.importeTotal,
          diasMaximoRetraso: cliente.diasMaximo,
          nivelRiesgo: cliente.nivelRiesgo
        }));
      
      // Crear métricas agregadas
      const resumenMetricas: MetricasMorosidad = {
        totalMorosidad,
        numeroClientesMorosos,
        distribucionPorNivelRiesgo: distribucionPorRiesgo,
        diasPromedioRetraso,
        tasaRecuperacion,
        periodo: {
          inicio: inicioMes,
          fin: finMes
        }
      };
      
      // Generar comentario resumen
      const comentariosResumen = `Reporte de morosidad para ${mes}/${anio}. ` +
        `Total en mora: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalMorosidad)}. ` +
        `Clientes afectados: ${numeroClientesMorosos}. ` +
        `Tasa de recuperación: ${(tasaRecuperacion * 100).toFixed(1)}%.`;
      
      reportes.push({
        id: `reporte-morosidad-${anio}-${mes.toString().padStart(2, '0')}`,
        periodoInicio: inicioMes,
        periodoFin: finMes,
        fechaGeneracion: new Date(),
        resumenMetricas,
        distribucionPorRiesgo,
        topClientesMorosos,
        comentariosResumen
      });
      
      // Avanzar al siguiente mes
      fechaActual.setMonth(fechaActual.getMonth() + 1);
    }
    
    return reportes;
  }
};

