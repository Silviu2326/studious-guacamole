import { MetricasChurn, ChurnData, PeriodoChurn } from '../types';

// ============================================================================
// DATOS MOCK - MÉTRICAS DE CHURN
// ============================================================================

/**
 * NOTA: En producción, estos cálculos vendrían de un motor analítico o servicio de BI.
 * Los datos aquí son simulados para desarrollo y testing.
 */

// Datos mock para métricas de churn mensuales
const generarMetricasChurnMensual = (anio: number, mes: number): MetricasChurn => {
  // Simulación de datos realistas con variación mensual
  const baseClientes = 450;
  const variacionMensual = Math.sin((mes - 1) * Math.PI / 6) * 20;
  const clientesInicio = Math.round(baseClientes + variacionMensual);
  
  // Tasa de churn varía entre 1.5% y 3.5%
  const tasaChurnBase = 2.5;
  const variacionChurn = (Math.random() - 0.5) * 2;
  const tasaChurn = Math.max(1.5, Math.min(3.5, tasaChurnBase + variacionChurn));
  
  const clientesBaja = Math.round((clientesInicio * tasaChurn) / 100);
  const clientesFin = clientesInicio - clientesBaja;
  const tasaRetencion = 100 - tasaChurn;
  
  // LTV medio simulado (en miles de unidades monetarias)
  const ltvMedio = 15 + (Math.random() * 10);
  
  // Permanencia media en meses (simulada)
  const permanenciaMedia = 12 + (Math.random() * 18);
  
  return {
    periodo: 'mensual',
    anio,
    mes,
    tasaChurn: Math.round(tasaChurn * 100) / 100,
    tasaRetencion: Math.round(tasaRetencion * 100) / 100,
    clientesActivosInicio: clientesInicio,
    clientesActivosFin: clientesFin,
    clientesBajaPeriodo: clientesBaja,
    ltvMedio: Math.round(ltvMedio * 100) / 100,
    permanenciaMediaMeses: Math.round(permanenciaMedia * 100) / 100,
  };
};

// Datos mock para métricas de churn anuales
const generarMetricasChurnAnual = (anio: number): MetricasChurn => {
  // Para anual, promediamos los datos mensuales
  const metricasMensuales = Array.from({ length: 12 }, (_, i) => 
    generarMetricasChurnMensual(anio, i + 1)
  );
  
  const clientesInicioAnual = metricasMensuales[0].clientesActivosInicio;
  const clientesFinAnual = metricasMensuales[11].clientesActivosFin;
  const totalBajas = metricasMensuales.reduce((sum, m) => sum + m.clientesBajaPeriodo, 0);
  const tasaChurnAnual = (totalBajas / clientesInicioAnual) * 100;
  const ltvMedioAnual = metricasMensuales.reduce((sum, m) => sum + (m.ltvMedio || 0), 0) / 12;
  const permanenciaMediaAnual = metricasMensuales.reduce((sum, m) => sum + (m.permanenciaMediaMeses || 0), 0) / 12;
  
  return {
    periodo: 'anual',
    anio,
    tasaChurn: Math.round(tasaChurnAnual * 100) / 100,
    tasaRetencion: Math.round((100 - tasaChurnAnual) * 100) / 100,
    clientesActivosInicio: clientesInicioAnual,
    clientesActivosFin: clientesFinAnual,
    clientesBajaPeriodo: totalBajas,
    ltvMedio: Math.round(ltvMedioAnual * 100) / 100,
    permanenciaMediaMeses: Math.round(permanenciaMediaAnual * 100) / 100,
  };
};

// Datos mock para segmentación de churn
const segmentosMock: Record<string, Array<{ segmento: string; tasaChurn: number; clientes: number }>> = {
  plan: [
    { segmento: 'Plan Básico', tasaChurn: 3.2, clientes: 150 },
    { segmento: 'Plan Intermedio', tasaChurn: 2.1, clientes: 200 },
    { segmento: 'Plan Premium', tasaChurn: 1.5, clientes: 100 },
  ],
  canal: [
    { segmento: 'Online', tasaChurn: 2.8, clientes: 180 },
    { segmento: 'Presencial', tasaChurn: 2.3, clientes: 200 },
    { segmento: 'Referido', tasaChurn: 1.9, clientes: 70 },
  ],
  antiguedad: [
    { segmento: '0-3 meses', tasaChurn: 4.5, clientes: 80 },
    { segmento: '3-6 meses', tasaChurn: 3.2, clientes: 120 },
    { segmento: '6-12 meses', tasaChurn: 2.1, clientes: 150 },
    { segmento: '12+ meses', tasaChurn: 1.2, clientes: 100 },
  ],
};

// Datos mock para predicción de churn
const clientesMock = Array.from({ length: 50 }, (_, i) => ({
  clienteId: `cl-${String(i + 1).padStart(3, '0')}`,
  probabilidadChurn: Math.random() * 100,
}));

// ============================================================================
// FUNCIONES DE API - ANÁLISIS DE CHURN
// ============================================================================

/**
 * Obtiene las métricas de churn para un período determinado
 * 
 * NOTA: En producción, este cálculo vendría de un motor analítico o servicio de BI.
 * Endpoint sugerido: GET /api/churn/metricas?anio={anio}&mes={mes}
 * 
 * @param periodo - Período de análisis (año y opcionalmente mes)
 * @returns Promise con las métricas de churn del período
 */
export async function getMetricasChurn(
  periodo: { anio: number; mes?: number }
): Promise<MetricasChurn> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (periodo.mes !== undefined) {
    return generarMetricasChurnMensual(periodo.anio, periodo.mes);
  } else {
    return generarMetricasChurnAnual(periodo.anio);
  }
}

/**
 * Obtiene una serie temporal de métricas de churn para un año completo
 * Retorna un registro por cada mes del año
 * 
 * NOTA: En producción, este cálculo vendría de un motor analítico o servicio de BI.
 * Endpoint sugerido: GET /api/churn/serie-temporal?anio={anio}
 * 
 * @param anio - Año para el cual obtener la serie temporal
 * @returns Promise con array de métricas de churn (un registro por mes)
 */
export async function getSerieTemporalChurn(
  anio: number
): Promise<MetricasChurn[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return Array.from({ length: 12 }, (_, i) => 
    generarMetricasChurnMensual(anio, i + 1)
  );
}

/**
 * Obtiene el análisis de churn segmentado por un criterio específico
 * 
 * NOTA: En producción, este cálculo vendría de un motor analítico o servicio de BI.
 * Endpoint sugerido: GET /api/churn/por-segmento?segmento={segmento}
 * 
 * @param segmento - Tipo de segmentación: "plan", "canal", "antiguedad" o cualquier otro string
 * @returns Promise con array de datos de churn por segmento
 */
export async function getChurnPorSegmento(
  segmento: "plan" | "canal" | "antiguedad" | string
): Promise<Array<{ segmento: string; tasaChurn: number; clientes: number }>> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Si el segmento existe en los datos mock, retornarlo
  if (segmento in segmentosMock) {
    return [...segmentosMock[segmento]];
  }
  
  // Para segmentos personalizados, generar datos mock genéricos
  return [
    { segmento: 'Segmento A', tasaChurn: 2.5, clientes: 100 },
    { segmento: 'Segmento B', tasaChurn: 2.8, clientes: 150 },
    { segmento: 'Segmento C', tasaChurn: 2.1, clientes: 200 },
  ];
}

/**
 * Predice la probabilidad de churn para los clientes
 * 
 * NOTA: En producción, este cálculo vendría de un motor analítico o servicio de BI
 * con modelos de machine learning entrenados.
 * Endpoint sugerido: GET /api/churn/prediccion
 * 
 * @returns Promise con array de predicciones de churn por cliente
 */
export async function predecirChurnClientes(): Promise<
  Array<{ clienteId: string; probabilidadChurn: number; riesgo: "bajo" | "medio" | "alto" }>
> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return clientesMock.map(cliente => {
    const probabilidad = Math.round(cliente.probabilidadChurn * 100) / 100;
    let riesgo: "bajo" | "medio" | "alto";
    
    if (probabilidad < 30) {
      riesgo = "bajo";
    } else if (probabilidad < 70) {
      riesgo = "medio";
    } else {
      riesgo = "alto";
    }
    
    return {
      clienteId: cliente.clienteId,
      probabilidadChurn: probabilidad,
      riesgo,
    };
  });
}

// ============================================================================
// FUNCIONES LEGACY (mantenidas para compatibilidad con componentes existentes)
// ============================================================================

/**
 * @deprecated Usar getMetricasChurn y getSerieTemporalChurn en su lugar
 * Obtiene análisis de churn en formato legacy
 */
export async function getAnalisisChurn(periodo: PeriodoChurn): Promise<ChurnData[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos falsos para análisis de churn (formato legacy)
  const datosFalsosChurnMensual: ChurnData[] = [
    {
      periodo: 'Enero 2024',
      sociosIniciales: 450,
      bajas: 12,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles'],
      tasaChurn: 2.67,
    },
    {
      periodo: 'Febrero 2024',
      sociosIniciales: 438,
      bajas: 8,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia'],
      tasaChurn: 1.83,
    },
    {
      periodo: 'Marzo 2024',
      sociosIniciales: 430,
      bajas: 15,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de motivación', 'Cambio de residencia', 'Problema de salud'],
      tasaChurn: 3.49,
    },
    {
      periodo: 'Abril 2024',
      sociosIniciales: 415,
      bajas: 10,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Horarios no disponibles'],
      tasaChurn: 2.41,
    },
    {
      periodo: 'Mayo 2024',
      sociosIniciales: 405,
      bajas: 9,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Problema de salud'],
      tasaChurn: 2.22,
    },
    {
      periodo: 'Junio 2024',
      sociosIniciales: 396,
      bajas: 11,
      motivosBaja: ['Precio elevado de la membresía', 'Cambio de residencia', 'Horarios no disponibles', 'Falta de motivación'],
      tasaChurn: 2.78,
    },
  ];

  const datosFalsosChurnTrimestral: ChurnData[] = [
    {
      periodo: 'Q1 2024',
      sociosIniciales: 450,
      bajas: 35,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación'],
      tasaChurn: 7.78,
    },
    {
      periodo: 'Q2 2024',
      sociosIniciales: 415,
      bajas: 30,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Horarios no disponibles', 'Cambio de residencia', 'Falta de motivación'],
      tasaChurn: 7.23,
    },
  ];

  const datosFalsosChurnAnual: ChurnData[] = [
    {
      periodo: '2023',
      sociosIniciales: 420,
      bajas: 145,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación', 'Instalaciones necesitan mejoras'],
      tasaChurn: 34.52,
    },
    {
      periodo: '2024',
      sociosIniciales: 450,
      bajas: 65,
      motivosBaja: ['Precio elevado de la membresía', 'Falta de tiempo', 'Cambio de residencia', 'Problema de salud', 'Horarios no disponibles', 'Falta de motivación'],
      tasaChurn: 14.44,
    },
  ];
  
  switch (periodo.tipo) {
    case 'mensual':
      return datosFalsosChurnMensual;
    case 'trimestral':
      return datosFalsosChurnTrimestral;
    case 'anual':
      return datosFalsosChurnAnual;
    default:
      return datosFalsosChurnMensual;
  }
}

/**
 * @deprecated Usar funciones de exportación específicas del módulo en su lugar
 * Exporta un reporte de churn en formato CSV
 */
export async function exportarReporteChurn(periodo: PeriodoChurn): Promise<Blob | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const datos = await getAnalisisChurn(periodo);
  
  // Crear un blob CSV simple
  const csv = 'Período,Socios Iniciales,Bajas,Tasa Churn %,Motivos de Baja\n' +
    datos.map(d => 
      `"${d.periodo}",${d.sociosIniciales},${d.bajas},${d.tasaChurn.toFixed(2)},"${d.motivosBaja.join(', ')}"`
    ).join('\n');
  
  return new Blob([csv], { type: 'text/csv' });
}
