import { Report, PerformanceData } from '../types';

const createReportData = (
  id: string,
  type: Report['type'],
  period: string,
  data: PerformanceData
): Report => {
  return {
    id,
    title: `Reporte ${type === 'daily' ? 'Diario' : type === 'weekly' ? 'Semanal' : type === 'monthly' ? 'Mensual' : type === 'quarterly' ? 'Trimestral' : 'Anual'} - ${period}`,
    type,
    period,
    data,
    generatedAt: new Date().toISOString(),
  };
};

export const getReports = async (type?: Report['type']): Promise<Report[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockReports: Report[] = [
    createReportData('1', 'monthly', 'Noviembre 2024', {
      period: '2024-11',
      metrics: [],
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 2,
        inProgressObjectives: 2,
        atRiskObjectives: 1,
      },
    }),
    createReportData('2', 'weekly', 'Semana 46', {
      period: '2024-11-11',
      metrics: [],
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 2,
        inProgressObjectives: 2,
        atRiskObjectives: 1,
      },
    }),
  ];
  
  if (type) {
    return mockReports.filter(r => r.type === type);
  }
  
  return mockReports;
};

export const getReport = async (id: string): Promise<Report | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const reports = await getReports();
  return reports.find(r => r.id === id) || null;
};

export const generateReport = async (
  type: Report['type'],
  period: string,
  role: 'entrenador' | 'gimnasio'
): Promise<Report> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data: PerformanceData = {
    period,
    metrics: [],
    objectives: [],
    summary: {
      totalObjectives: 5,
      achievedObjectives: 2,
      inProgressObjectives: 2,
      atRiskObjectives: 1,
    },
  };
  
  return createReportData(Date.now().toString(), type, period, data);
};

export const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular generación de archivo
  const filename = `reporte-${reportId}.${format}`;
  return filename;
};

