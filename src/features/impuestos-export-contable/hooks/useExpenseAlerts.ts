import { useState, useEffect, useCallback } from 'react';
import { GastoDeducible, CategoriaGasto, CATEGORIAS_GASTO, Expense } from '../types/expenses';
import { expensesAPI, getExpenses } from '../api/expenses';

export type AlertType = 
  | 'exceso_media'
  | 'no_deducible_marcado_deducible'
  | 'categoria_exceso_gasto'
  | 'gasto_sin_adjunto'
  | 'gasto_duplicado';

export interface ExpenseAlert {
  id: string;
  tipo: AlertType;
  gasto: GastoDeducible;
  promedioCategoria?: number;
  porcentajeSobreMedia?: number;
  esAnomalo: boolean;
  mensaje: string;
  severidad: 'info' | 'warning' | 'error';
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
   * Verifica si un gasto es anómalo comparándolo con la media histórica y otras reglas
   */
  const verificarAlerta = useCallback(async (gasto: GastoDeducible): Promise<ExpenseAlert | null> => {
    const alertas: ExpenseAlert[] = [];

    // 1. Verificar si supera la media histórica
    const stats = statistics.get(gasto.categoria);
    if (stats && stats.cantidad >= MIN_GASTOS_PARA_ESTADISTICAS) {
      const porcentajeSobreMedia = gasto.importe / stats.promedio;
      if (porcentajeSobreMedia >= UMBRAL_ALERTA) {
        const diferencia = gasto.importe - stats.promedio;
        const nombreCategoria = CATEGORIAS_GASTO[gasto.categoria]?.nombre || gasto.categoria;
        alertas.push({
          id: `alert-exceso-${gasto.id}`,
          tipo: 'exceso_media',
          gasto,
          promedioCategoria: stats.promedio,
          porcentajeSobreMedia,
          esAnomalo: true,
          mensaje: `Este gasto es ${(porcentajeSobreMedia * 100).toFixed(0)}% superior a tu media histórica de ${stats.promedio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} en la categoría "${nombreCategoria}". La diferencia es de ${diferencia.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}.`,
          severidad: 'warning'
        });
      }
    }

    // 2. Verificar si un gasto no deducible está marcado como deducible
    // Categorías que típicamente NO son deducibles
    const categoriasNoDeducibles: CategoriaGasto[] = ['otros']; // Puedes expandir esta lista
    const gastosNoDeduciblesComunes = ['multa', 'sanción', 'penalización', 'donación personal', 'regalo personal'];
    const descripcionLower = gasto.concepto.toLowerCase();
    
    if (gasto.deducible) {
      // Verificar si la descripción sugiere que no es deducible
      const esNoDeduciblePorDescripcion = gastosNoDeduciblesComunes.some(termino => 
        descripcionLower.includes(termino)
      );
      
      if (esNoDeduciblePorDescripcion || categoriasNoDeducibles.includes(gasto.categoria)) {
        alertas.push({
          id: `alert-no-deducible-${gasto.id}`,
          tipo: 'no_deducible_marcado_deducible',
          gasto,
          esAnomalo: true,
          mensaje: `Este gasto está marcado como deducible, pero por su descripción o categoría podría no ser deducible fiscalmente. Revisa si realmente es un gasto necesario para tu actividad profesional.`,
          severidad: 'error'
        });
      }
    }

    // 3. Verificar si falta adjunto (solo para gastos importantes)
    if (!gasto.archivosAdjuntos || gasto.archivosAdjuntos.length === 0) {
      if (gasto.importe > 100000) { // Umbral para considerar importante
        alertas.push({
          id: `alert-sin-adjunto-${gasto.id}`,
          tipo: 'gasto_sin_adjunto',
          gasto,
          esAnomalo: false,
          mensaje: `Este gasto no tiene archivos adjuntos. Es recomendable adjuntar la factura o comprobante para justificarlo ante Hacienda.`,
          severidad: 'info'
        });
      }
    }

    // 4. Verificar duplicados potenciales
    try {
      const todosLosGastos = await getExpenses();
      const gastosSimilares = todosLosGastos.filter(e => 
        e.id !== gasto.id &&
        e.descripcion.toLowerCase() === gasto.concepto.toLowerCase() &&
        Math.abs(e.importe - gasto.importe) < 1000 && // Diferencia menor a 1000
        Math.abs(e.fecha.getTime() - gasto.fecha.getTime()) < 7 * 24 * 60 * 60 * 1000 // Dentro de 7 días
      );
      
      if (gastosSimilares.length > 0) {
        alertas.push({
          id: `alert-duplicado-${gasto.id}`,
          tipo: 'gasto_duplicado',
          gasto,
          esAnomalo: true,
          mensaje: `Se encontró ${gastosSimilares.length} gasto(s) similar(es) en los últimos 7 días. Verifica que no sea un duplicado.`,
          severidad: 'warning'
        });
      }
    } catch (error) {
      // Silenciar error de verificación de duplicados
      console.warn('Error al verificar duplicados:', error);
    }

    // Retornar la alerta de mayor severidad
    if (alertas.length === 0) return null;
    
    // Ordenar por severidad: error > warning > info
    const ordenSeveridad = { error: 3, warning: 2, info: 1 };
    alertas.sort((a, b) => ordenSeveridad[b.severidad] - ordenSeveridad[a.severidad]);
    
    return alertas[0];
  }, [statistics, UMBRAL_ALERTA]);

  /**
   * Obtiene las estadísticas de una categoría específica
   */
  const obtenerEstadisticasCategoria = useCallback((categoria: CategoriaGasto): ExpenseStatistics | null => {
    return statistics.get(categoria) || null;
  }, [statistics]);

  /**
   * Detecta categorías con exceso de gasto comparado con períodos anteriores
   */
  const detectarCategoriasConExceso = useCallback(async (): Promise<ExpenseAlert[]> => {
    const alertas: ExpenseAlert[] = [];
    
    try {
      const hoy = new Date();
      const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      
      // Gastos del mes actual
      const gastosMesActual = await getExpenses({
        fechaInicio: mesActual,
        fechaFin: hoy
      });
      
      // Gastos del mes anterior
      const gastosMesAnterior = await getExpenses({
        fechaInicio: mesAnterior,
        fechaFin: finMesAnterior
      });
      
      // Agrupar por categoría
      const gastosPorCategoriaActual = new Map<CategoriaGasto, number>();
      const gastosPorCategoriaAnterior = new Map<CategoriaGasto, number>();
      
      gastosMesActual.forEach(g => {
        const total = gastosPorCategoriaActual.get(g.categoria) || 0;
        gastosPorCategoriaActual.set(g.categoria, total + g.importe);
      });
      
      gastosMesAnterior.forEach(g => {
        const total = gastosPorCategoriaAnterior.get(g.categoria) || 0;
        gastosPorCategoriaAnterior.set(g.categoria, total + g.importe);
      });
      
      // Comparar y detectar excesos
      gastosPorCategoriaActual.forEach((totalActual, categoria) => {
        const totalAnterior = gastosPorCategoriaAnterior.get(categoria) || 0;
        
        if (totalAnterior > 0) {
          const incremento = (totalActual / totalAnterior) - 1;
          
          // Si el incremento es mayor al 200%, es una alerta
          if (incremento > 2.0) {
            const nombreCategoria = CATEGORIAS_GASTO[categoria]?.nombre || categoria;
            alertas.push({
              id: `alert-categoria-exceso-${categoria}-${Date.now()}`,
              tipo: 'categoria_exceso_gasto',
              gasto: {
                id: 'categoria-agregada',
                fecha: new Date(),
                concepto: `Gastos de ${nombreCategoria}`,
                importe: totalActual,
                categoria,
                deducible: true,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                usuarioCreacion: 'system'
              },
              esAnomalo: true,
              mensaje: `Los gastos de "${nombreCategoria}" han aumentado un ${(incremento * 100).toFixed(0)}% respecto al mes anterior (de ${totalAnterior.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} a ${totalActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}).`,
              severidad: 'warning'
            });
          }
        }
      });
    } catch (error) {
      console.error('Error al detectar categorías con exceso:', error);
    }
    
    return alertas;
  }, []);

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
    detectarCategoriasConExceso,
    recalcularEstadisticas: calcularEstadisticas,
    umbralAlerta: UMBRAL_ALERTA,
    minGastosParaEstadisticas: MIN_GASTOS_PARA_ESTADISTICAS
  };
};

