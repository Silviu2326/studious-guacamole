import { PipelineReport, PipelineFilters, BusinessType } from '../types';
import { getPipelineMetrics } from './metrics';

export const generateReport = async (
  name: string,
  period: { start: Date; end: Date },
  filters: PipelineFilters,
  businessType: BusinessType,
  generatedBy: string
): Promise<PipelineReport> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const metrics = await getPipelineMetrics(businessType, filters.assignedTo?.[0]);
  
  const report: PipelineReport = {
    id: Date.now().toString(),
    name,
    period,
    filters,
    metrics,
    generatedAt: new Date(),
    generatedBy,
  };
  
  return report;
};

export const getReports = async (businessType: BusinessType): Promise<PipelineReport[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock de reportes guardados
  const reports: PipelineReport[] = [
    {
      id: '1',
      name: 'Reporte Mensual - Enero',
      description: 'Análisis completo del pipeline de enero',
      period: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      },
      metrics: await getPipelineMetrics(businessType),
      generatedAt: new Date('2024-02-01'),
      generatedBy: 'system',
    },
  ];
  
  return reports;
};

