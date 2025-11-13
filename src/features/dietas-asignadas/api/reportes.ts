import {
  ReporteEvolucion,
  OpcionesGeneracionReporte,
  EvolucionMetrica,
  EvolucionHabito,
  ResumenPeriodo,
  TipoPeriodoReporte,
} from '../types';
import { getDieta, getSeguimientoMacros } from './dietas';

// Mock storage para reportes
const reportesMock: ReporteEvolucion[] = [];

/**
 * Genera un reporte de evolución semanal o mensual
 */
export async function generarReporteEvolucion(
  opciones: OpcionesGeneracionReporte
): Promise<ReporteEvolucion> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const dieta = await getDieta(opciones.dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Calcular fechas del período
  const fechaInicio = new Date(opciones.fechaInicio);
  const fechaFin = new Date(opciones.fechaFin);
  const diasDiferencia = Math.ceil(
    (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Generar datos de evolución de métricas
  const evolucionMetricas: EvolucionMetrica[] = [
    generarEvolucionMetrica('calorias', dieta.macros.calorias, fechaInicio, fechaFin),
    generarEvolucionMetrica('proteinas', dieta.macros.proteinas, fechaInicio, fechaFin),
    generarEvolucionMetrica('carbohidratos', dieta.macros.carbohidratos, fechaInicio, fechaFin),
    generarEvolucionMetrica('grasas', dieta.macros.grasas, fechaInicio, fechaFin),
    generarEvolucionMetrica('adherencia', dieta.adherencia || 80, fechaInicio, fechaFin, true),
  ];

  // Generar datos de evolución de hábitos
  const evolucionHabitos: EvolucionHabito[] = [
    generarEvolucionHabito('comidas-completadas', fechaInicio, fechaFin),
    generarEvolucionHabito('hidratacion', fechaInicio, fechaFin),
    generarEvolucionHabito('ejercicio', fechaInicio, fechaFin),
  ];

  // Calcular resumen del período
  const resumen: ResumenPeriodo = {
    fechaInicio: opciones.fechaInicio,
    fechaFin: opciones.fechaFin,
    periodo: opciones.periodo,
    metricas: {
      calorias: {
        promedio: dieta.macros.calorias * 0.95,
        objetivo: dieta.macros.calorias,
        cumplimiento: 95,
      },
      proteinas: {
        promedio: dieta.macros.proteinas * 0.92,
        objetivo: dieta.macros.proteinas,
        cumplimiento: 92,
      },
      carbohidratos: {
        promedio: dieta.macros.carbohidratos * 0.88,
        objetivo: dieta.macros.carbohidratos,
        cumplimiento: 88,
      },
      grasas: {
        promedio: dieta.macros.grasas * 0.90,
        objetivo: dieta.macros.grasas,
        cumplimiento: 90,
      },
      adherencia: {
        promedio: dieta.adherencia || 85,
        tendencia: 'mejora',
      },
    },
    habitos: {
      comidasCompletadas: {
        porcentaje: 87,
        tendencia: 'mejora',
      },
      hidratacion: {
        porcentaje: 82,
        tendencia: 'estable',
      },
      ejercicio: {
        dias: Math.floor(diasDiferencia * 0.6),
        tendencia: 'mejora',
      },
    },
    logros: [
      'Cumplimiento de proteínas superior al 90%',
      'Mejora en adherencia del 5% respecto al período anterior',
      'Consistencia en hidratación mantenida',
    ],
    areasMejora: [
      'Aumentar cumplimiento de carbohidratos',
      'Mejorar consistencia en días de ejercicio',
    ],
  };

  const reporte: ReporteEvolucion = {
    id: `reporte-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    dietaId: opciones.dietaId,
    clienteId: opciones.clienteId,
    clienteNombre: dieta.clienteNombre,
    periodo: opciones.periodo,
    fechaInicio: opciones.fechaInicio,
    fechaFin: opciones.fechaFin,
    resumen,
    evolucionMetricas,
    evolucionHabitos,
    generadoEn: new Date().toISOString(),
    generadoPor: 'dietista1', // En producción vendría del contexto de autenticación
  };

  reportesMock.push(reporte);
  return reporte;
}

/**
 * Obtiene todos los reportes de una dieta
 */
export async function getReportesDieta(dietaId: string): Promise<ReporteEvolucion[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reportesMock.filter(r => r.dietaId === dietaId).sort((a, b) => 
    new Date(b.generadoEn).getTime() - new Date(a.generadoEn).getTime()
  );
}

/**
 * Obtiene un reporte específico
 */
export async function getReporte(id: string): Promise<ReporteEvolucion | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reportesMock.find(r => r.id === id) || null;
}

/**
 * Comparte un reporte con otros usuarios/equipos
 */
export async function compartirReporte(
  reporteId: string,
  usuariosIds: string[]
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const reporte = reportesMock.find(r => r.id === reporteId);
  if (!reporte) return false;
  
  reporte.compartidoCon = [...(reporte.compartidoCon || []), ...usuariosIds];
  return true;
}

/**
 * Exporta un reporte en el formato especificado
 */
export async function exportarReporte(
  reporteId: string,
  formato: 'pdf' | 'excel' | 'html'
): Promise<Blob | string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const reporte = reportesMock.find(r => r.id === reporteId);
  if (!reporte) {
    throw new Error('Reporte no encontrado');
  }

  // En producción, esto generaría el archivo real
  // Por ahora, retornamos un string con la URL o datos simulados
  return `data:application/${formato};base64,simulated-export-${reporteId}`;
}

// Funciones auxiliares para generar datos mock

function generarEvolucionMetrica(
  nombre: string,
  valorObjetivo: number,
  fechaInicio: Date,
  fechaFin: Date,
  esPorcentaje: boolean = false
): EvolucionMetrica {
  const valores: { fecha: string; valor: number; objetivo?: number }[] = [];
  const fechaActual = new Date(fechaInicio);
  let variacion = 0.85; // Empezar con 85% del objetivo

  while (fechaActual <= fechaFin) {
    // Simular variación con tendencia de mejora
    variacion += (Math.random() * 0.05 - 0.01); // Pequeña variación aleatoria
    variacion = Math.min(1.05, Math.max(0.75, variacion)); // Mantener entre 75% y 105%

    valores.push({
      fecha: fechaActual.toISOString().split('T')[0],
      valor: esPorcentaje ? variacion * 100 : valorObjetivo * variacion,
      objetivo: esPorcentaje ? 100 : valorObjetivo,
    });

    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  const valoresNumericos = valores.map(v => v.valor);
  const promedio = valoresNumericos.reduce((a, b) => a + b, 0) / valoresNumericos.length;
  const minimo = Math.min(...valoresNumericos);
  const maximo = Math.max(...valoresNumericos);
  const cambioPorcentual = ((valoresNumericos[valoresNumericos.length - 1] - valoresNumericos[0]) / valoresNumericos[0]) * 100;

  let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';
  if (cambioPorcentual > 2) tendencia = 'mejora';
  else if (cambioPorcentual < -2) tendencia = 'empeora';

  return {
    metrica: nombre,
    valores,
    tendencia,
    cambioPorcentual,
    promedio,
    minimo,
    maximo,
  };
}

function generarEvolucionHabito(
  nombre: string,
  fechaInicio: Date,
  fechaFin: Date
): EvolucionHabito {
  const valores: { fecha: string; cumplimiento: number; observaciones?: string }[] = [];
  const fechaActual = new Date(fechaInicio);
  let cumplimiento = 75; // Empezar con 75%

  while (fechaActual <= fechaFin) {
    // Simular variación con tendencia de mejora
    cumplimiento += (Math.random() * 10 - 2); // Variación aleatoria
    cumplimiento = Math.min(100, Math.max(50, cumplimiento)); // Mantener entre 50% y 100%

    valores.push({
      fecha: fechaActual.toISOString().split('T')[0],
      cumplimiento: Math.round(cumplimiento),
    });

    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  const cumplimientos = valores.map(v => v.cumplimiento);
  const cumplimientoPromedio = cumplimientos.reduce((a, b) => a + b, 0) / cumplimientos.length;
  const diasCompletados = cumplimientos.filter(c => c >= 80).length;
  const diasTotales = cumplimientos.length;
  
  const cambioPorcentual = ((cumplimientos[cumplimientos.length - 1] - cumplimientos[0]) / cumplimientos[0]) * 100;
  let tendencia: 'mejora' | 'estable' | 'empeora' = 'estable';
  if (cambioPorcentual > 2) tendencia = 'mejora';
  else if (cambioPorcentual < -2) tendencia = 'empeora';

  return {
    habito: nombre,
    valores,
    tendencia,
    cumplimientoPromedio: Math.round(cumplimientoPromedio),
    diasCompletados,
    diasTotales,
  };
}

