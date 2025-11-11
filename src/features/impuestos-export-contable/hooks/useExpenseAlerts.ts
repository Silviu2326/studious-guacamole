import { useState, useEffect, useCallback } from 'react';
import { GastoDeducible, CategoriaGasto, CATEGORIAS_GASTO } from '../types/expenses';
import { expensesAPI } from '../api/expenses';

export interface ExpenseAlert {
  id: string;
  gasto: GastoDeducible;
  promedioCategoria: number;
  porcentajeSobreMedia: number;
  esAnomalo: boolean;
  mensaje: string;
}

export interface ExpenseStatistics {
  categoria: CategoriaGasto;
  promedio: number;
  cantidad: number;
  total: number;
  maximo: number;
  minimo: number;
  desviacionEstandar: number;
}

/**
 * Hook para calcular estadísticas de gastos y detectar alertas
 * cuando un gasto supera la media histórica de su categoría
 */
export const useExpenseAlerts = (userId?: string) => {
  const [statistics, setStatistics] = useState<Map<CategoriaGasto, ExpenseStatistics>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Umbral por defecto: si un gasto supera el 150% de la media, es una alerta
  const UMBRAL_ALERTA = 1.5; // 150% de la media
  // Mínimo de gastos necesarios para calcular estadísticas confiables
  const MIN_GASTOS_PARA_ESTADISTICAS = 3;

  /**
   * Calcula las estadísticas históricas por categoría
   */
  const calcularEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener todos los gastos históricos (últimos 12 meses)
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 12);
      
      const gastos = await expensesAPI.obtenerGastos({
        fechaInicio,
        fechaFin
      });

      // Agrupar por categoría y calcular estadísticas
      const statsMap = new Map<CategoriaGasto, ExpenseStatistics>();
      
      // Agrupar gastos por categoría
      const gastosPorCategoria = new Map<CategoriaGasto, number[]>();
      
      gastos.forEach(gasto => {
        if (!gastosPorCategoria.has(gasto.categoria)) {
          gastosPorCategoria.set(gasto.categoria, []);
        }
        gastosPorCategoria.get(gasto.categoria)!.push(gasto.importe);
      });

      // Calcular estadísticas para cada categoría
      gastosPorCategoria.forEach((importes, categoria) => {
        if (importes.length < MIN_GASTOS_PARA_ESTADISTICAS) {
          // No hay suficientes datos para estadísticas confiables
          return;
        }

        const cantidad = importes.length;
        const total = importes.reduce((sum, imp) => sum + imp, 0);
        const promedio = total / cantidad;
        const maximo = Math.max(...importes);
        const minimo = Math.min(...importes);
        
        // Calcular desviación estándar
        const varianza = importes.reduce((sum, imp) => {
          return sum + Math.pow(imp - promedio, 2);
        }, 0) / cantidad;
        const desviacionEstandar = Math.sqrt(varianza);

        statsMap.set(categoria, {
          categoria,
          promedio,
          cantidad,
          total,
          maximo,
          minimo,
          desviacionEstandar
        });
      });

      setStatistics(statsMap);
    } catch (err) {
      console.error('Error al calcular estadísticas de gastos:', err);
      setError('Error al calcular estadísticas de gastos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verifica si un gasto es anómalo comparándolo con la media histórica
   */
  const verificarAlerta = useCallback((gasto: GastoDeducible): ExpenseAlert | null => {
    const stats = statistics.get(gasto.categoria);
    
    // Si no hay estadísticas para esta categoría, no hay alerta
    if (!stats || stats.cantidad < MIN_GASTOS_PARA_ESTADISTICAS) {
      return null;
    }

    // Calcular el porcentaje sobre la media
    const porcentajeSobreMedia = gasto.importe / stats.promedio;
    
    // Si el gasto supera el umbral, es una alerta
    if (porcentajeSobreMedia >= UMBRAL_ALERTA) {
      const diferencia = gasto.importe - stats.promedio;
      const nombreCategoria = CATEGORIAS_GASTO[gasto.categoria]?.nombre || gasto.categoria;
      const mensaje = `Este gasto es ${(porcentajeSobreMedia * 100).toFixed(0)}% superior a tu media histórica de ${stats.promedio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} en la categoría "${nombreCategoria}". La diferencia es de ${diferencia.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}.`;
      
      return {
        id: `alert-${gasto.id}-${Date.now()}`,
        gasto,
        promedioCategoria: stats.promedio,
        porcentajeSobreMedia,
        esAnomalo: true,
        mensaje
      };
    }

    return null;
  }, [statistics, UMBRAL_ALERTA]);

  /**
   * Obtiene las estadísticas de una categoría específica
   */
  const obtenerEstadisticasCategoria = useCallback((categoria: CategoriaGasto): ExpenseStatistics | null => {
    return statistics.get(categoria) || null;
  }, [statistics]);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    calcularEstadisticas();
  }, [calcularEstadisticas]);

  return {
    statistics,
    loading,
    error,
    verificarAlerta,
    obtenerEstadisticasCategoria,
    recalcularEstadisticas: calcularEstadisticas,
    umbralAlerta: UMBRAL_ALERTA,
    minGastosParaEstadisticas: MIN_GASTOS_PARA_ESTADISTICAS
  };
};

