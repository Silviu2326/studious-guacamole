import { Lead, ExportOptions, ReportOptions } from '../types';
import { ExportService } from '../services/exportService';

export const exportLeads = async (
  leads: Lead[],
  options: ExportOptions
): Promise<Blob> => {
  return ExportService.exportLeads(leads, options);
};

export const generateReport = async (
  businessType: 'entrenador' | 'gimnasio',
  options: ReportOptions
): Promise<Blob> => {
  return ExportService.generateReport(businessType, options);
};

export const scheduleReport = async (
  businessType: 'entrenador' | 'gimnasio',
  options: ReportOptions
): Promise<void> => {
  return ExportService.scheduleReport(businessType, options);
};

export const getScheduledReports = (): Array<ReportOptions & { id: string; createdAt: Date }> => {
  return ExportService.getScheduledReports();
};

export const deleteScheduledReport = async (reportId: string): Promise<void> => {
  return ExportService.deleteScheduledReport(reportId);
};

export const exportChart = async (
  chartElement: HTMLElement | null,
  format?: 'png' | 'pdf'
): Promise<Blob> => {
  return ExportService.exportChart(chartElement, format);
};

export const downloadFile = (blob: Blob, filename: string): void => {
  ExportService.downloadFile(blob, filename);
};

