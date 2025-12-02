import { PipelineMetrics, BusinessType, PhaseMetrics } from '../types';
import { getPipeline } from './pipeline';

export const getPipelineMetrics = async (
  businessType: BusinessType,
  userId?: string
): Promise<PipelineMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const columns = await getPipeline(businessType, userId);
  
  const totalSales = columns.reduce((sum, col) => sum + col.sales.length, 0);
  const totalValue = columns.reduce((sum, col) => sum + col.metrics.value, 0);
  
  const byPhase: PhaseMetrics[] = columns.map(col => col.metrics);
  
  // Calcular tiempo promedio de conversión (días en pipeline hasta cierre)
  const closedSales = columns
    .find(col => col.phase.key === (businessType === 'entrenador' ? 'cerrado' : 'alta_cerrada'))
    ?.sales || [];
  
  const averageConversionTime = closedSales.length > 0
    ? closedSales.reduce((sum, sale) => {
        const days = Math.floor(
          (new Date(sale.updatedAt).getTime() - new Date(sale.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0) / closedSales.length
    : 0;
  
  // Calcular tasa de conversión (ventas cerradas / total ventas)
  const conversionRate = totalSales > 0
    ? (closedSales.length / totalSales) * 100
    : 0;
  
  // Generar tendencias (últimos 30 días)
  const trends = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Mock de datos de tendencia
    const value = Math.floor(Math.random() * 20) + 10;
    trends.push({
      date,
      value,
      label: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    });
  }
  
  return {
    totalSales,
    totalValue,
    averageConversionTime,
    conversionRate,
    byPhase,
    trends,
  };
};

