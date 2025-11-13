import type { Dieta, IndicadorAdherenciaDia, Comida, TipoComida } from '../types';
import { calcularMacrosActualesDia, getBloquesActivosDia } from './distribucionBloques';

const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;

/**
 * Calcula los indicadores de adherencia prevista para todos los días de la semana
 * basándose en feedback histórico del cliente
 */
export async function calcularIndicadoresAdherencia(
  dieta: Dieta,
  clienteId: string
): Promise<IndicadorAdherenciaDia[]> {
  const indicadores: IndicadorAdherenciaDia[] = [];

  for (const dia of diasSemana) {
    const indicador = await calcularIndicadorAdherenciaDia(dieta, dia, clienteId);
    indicadores.push(indicador);
  }

  return indicadores;
}

/**
 * Calcula el indicador de adherencia prevista para un día específico
 */
async function calcularIndicadorAdherenciaDia(
  dieta: Dieta,
  dia: string,
  clienteId: string
): Promise<IndicadorAdherenciaDia> {
  // Obtener comidas del día
  const comidasDelDia = dieta.comidas.filter(c => c.dia === dia);
  const bloquesActivos = getBloquesActivosDia(dieta, dia);
  const macrosActuales = calcularMacrosActualesDia(dieta, dia);

  // Factores de riesgo iniciales
  const factoresRiesgo: string[] = [];

  // 1. Analizar número de bloques activos
  if (bloquesActivos.length > 5) {
    factoresRiesgo.push('Muchos bloques de comida pueden dificultar el cumplimiento');
  } else if (bloquesActivos.length < 3) {
    factoresRiesgo.push('Pocos bloques pueden generar hambre entre comidas');
  }

  // 2. Analizar distribución de macros
  const macrosObjetivo = dieta.macros;
  const desviacionCalorias = Math.abs(macrosActuales.calorias - macrosObjetivo.calorias) / macrosObjetivo.calorias;
  if (desviacionCalorias > 0.2) {
    factoresRiesgo.push('Desviación significativa en calorías objetivo');
  }

  // 3. Analizar tipos de comida (basado en feedback histórico simulado)
  const tiposComidaDia = comidasDelDia.map(c => c.tipo);
  const adherenciaPorTipo = await obtenerAdherenciaHistoricaPorTipo(clienteId, tiposComidaDia);
  
  // 4. Analizar horarios
  const comidasSinHorario = comidasDelDia.filter(c => !c.horario);
  if (comidasSinHorario.length > 0) {
    factoresRiesgo.push('Algunas comidas no tienen horario definido');
  }

  // 5. Calcular adherencia prevista basada en factores
  let adherenciaPrevista = 75; // Base del 75%

  // Ajustar según adherencia histórica por tipo de comida
  if (adherenciaPorTipo.promedio > 0) {
    adherenciaPrevista = adherenciaPorTipo.promedio;
  }

  // Reducir adherencia según factores de riesgo
  if (factoresRiesgo.length > 2) {
    adherenciaPrevista -= 10;
  } else if (factoresRiesgo.length > 0) {
    adherenciaPrevista -= 5;
  }

  // Ajustar según número de bloques
  if (bloquesActivos.length > 5) {
    adherenciaPrevista -= 5;
  }

  // Asegurar que esté en rango 0-100
  adherenciaPrevista = Math.max(0, Math.min(100, adherenciaPrevista));

  // Determinar nivel de riesgo
  let nivelRiesgo: 'bajo' | 'medio' | 'alto';
  if (adherenciaPrevista >= 80) {
    nivelRiesgo = 'bajo';
  } else if (adherenciaPrevista >= 60) {
    nivelRiesgo = 'medio';
  } else {
    nivelRiesgo = 'alto';
  }

  return {
    dia,
    adherenciaPrevista: Math.round(adherenciaPrevista),
    nivelRiesgo,
    factoresRiesgo,
    feedbackHistorico: {
      diasSimilares: adherenciaPorTipo.diasSimilares,
      adherenciaPromedio: adherenciaPorTipo.promedio,
      tendencia: adherenciaPorTipo.tendencia,
    },
  };
}

/**
 * Obtiene la adherencia histórica por tipo de comida (simulado)
 * En producción, esto consultaría la base de datos de feedback histórico
 */
async function obtenerAdherenciaHistoricaPorTipo(
  clienteId: string,
  tiposComida: TipoComida[]
): Promise<{
  promedio: number;
  diasSimilares: number;
  tendencia: 'mejora' | 'estable' | 'empeora';
}> {
  // Simulación: en producción esto consultaría datos reales
  await new Promise(resolve => setTimeout(resolve, 100));

  // Valores simulados basados en tipos de comida comunes
  const adherenciaPorTipo: Record<TipoComida, number> = {
    'desayuno': 85,
    'media-manana': 70,
    'almuerzo': 90,
    'merienda': 65,
    'cena': 80,
    'post-entreno': 60,
  };

  // Calcular promedio de adherencia para los tipos de comida del día
  const adherencias = tiposComida.map(tipo => adherenciaPorTipo[tipo] || 75);
  const promedio = adherencias.length > 0
    ? adherencias.reduce((acc, val) => acc + val, 0) / adherencias.length
    : 75;

  // Simular número de días similares y tendencia
  const diasSimilares = Math.floor(Math.random() * 20) + 5;
  const tendencia: 'mejora' | 'estable' | 'empeora' = 
    promedio > 80 ? 'mejora' : promedio > 65 ? 'estable' : 'empeora';

  return {
    promedio: Math.round(promedio),
    diasSimilares,
    tendencia,
  };
}

/**
 * Obtiene el indicador de adherencia para un día específico
 */
export function getIndicadorAdherenciaDia(
  dieta: Dieta,
  dia: string
): IndicadorAdherenciaDia | null {
  return dieta.indicadoresAdherencia?.find(i => i.dia === dia) || null;
}

