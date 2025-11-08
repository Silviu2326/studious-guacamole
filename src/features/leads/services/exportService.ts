import { Lead, LeadSource, LeadStatus, PipelineStage, ExportFormat, ReportType, ExportOptions, ReportOptions } from '../types';
import { getLeads } from '../api/leads';
import { getLeadAnalytics } from '../api/analytics';
import { ROIService } from './roiService';

// Re-exportar tipos para compatibilidad
export type { ExportFormat, ReportType, ExportOptions, ReportOptions };

// Simular exportación a Excel usando CSV (en producción usaría xlsx)
export class ExportService {
  // Exportar leads a Excel/CSV
  static async exportLeads(
    leads: Lead[],
    options: ExportOptions
  ): Promise<Blob> {
    const { format, columns, filters } = options;

    // Aplicar filtros si existen
    let filteredLeads = [...leads];
    if (filters) {
      if (filters.status) {
        filteredLeads = filteredLeads.filter(l => filters.status!.includes(l.status));
      }
      if (filters.source) {
        filteredLeads = filteredLeads.filter(l => filters.source!.includes(l.source));
      }
      if (filters.stage) {
        filteredLeads = filteredLeads.filter(l => filters.stage!.includes(l.stage));
      }
      if (filters.dateRange) {
        filteredLeads = filteredLeads.filter(l => {
          const created = new Date(l.createdAt);
          return created >= filters.dateRange!.start && created <= filters.dateRange!.end;
        });
      }
      if (filters.assignedTo) {
        filteredLeads = filteredLeads.filter(l => filters.assignedTo!.includes(l.assignedTo || ''));
      }
    }

    // Definir columnas por defecto
    const defaultColumns = [
      'name',
      'email',
      'phone',
      'source',
      'status',
      'stage',
      'score',
      'assignedTo',
      'createdAt',
      'lastContactDate',
      'nextFollowUpDate'
    ];

    const selectedColumns = columns && columns.length > 0 ? columns : defaultColumns;

    if (format === 'csv' || format === 'excel') {
      return this.exportToCSV(filteredLeads, selectedColumns);
    } else if (format === 'pdf') {
      return this.exportToPDF(filteredLeads, selectedColumns);
    }

    throw new Error('Unsupported export format');
  }

  // Exportar a CSV
  private static async exportToCSV(leads: Lead[], columns: string[]): Promise<Blob> {
    // Encabezados
    const headers = columns.map(col => this.getColumnLabel(col));
    const csvRows = [headers.join(',')];

    // Datos
    leads.forEach(lead => {
      const row = columns.map(col => {
        const value = this.getColumnValue(lead, col);
        // Escapar comillas y envolver en comillas si contiene comas
        const stringValue = String(value || '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
    return blob;
  }

  // Exportar a PDF (simulado - en producción usaría jsPDF)
  private static async exportToPDF(leads: Lead[], columns: string[]): Promise<Blob> {
    // En producción, esto usaría jsPDF para generar PDF real
    // Por ahora, generamos un CSV con extensión .pdf para simular
    const csv = await this.exportToCSV(leads, columns);
    return new Blob([csv], { type: 'application/pdf' });
  }

  // Obtener etiqueta de columna
  private static getColumnLabel(column: string): string {
    const labels: Record<string, string> = {
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      source: 'Origen',
      status: 'Estado',
      stage: 'Etapa',
      score: 'Score',
      assignedTo: 'Asignado a',
      createdAt: 'Fecha Creación',
      lastContactDate: 'Último Contacto',
      nextFollowUpDate: 'Próximo Seguimiento',
      businessType: 'Tipo Negocio',
      notes: 'Notas',
      tags: 'Etiquetas'
    };
    return labels[column] || column;
  }

  // Obtener valor de columna
  private static getColumnValue(lead: Lead, column: string): any {
    switch (column) {
      case 'name':
        return lead.name;
      case 'email':
        return lead.email || '';
      case 'phone':
        return lead.phone || '';
      case 'source':
        return lead.source;
      case 'status':
        return lead.status;
      case 'stage':
        return lead.stage;
      case 'score':
        return lead.score;
      case 'assignedTo':
        return lead.assignedTo || '';
      case 'createdAt':
        return new Date(lead.createdAt).toLocaleDateString();
      case 'lastContactDate':
        return lead.lastContactDate ? new Date(lead.lastContactDate).toLocaleDateString() : '';
      case 'nextFollowUpDate':
        return lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString() : '';
      case 'businessType':
        return lead.businessType;
      case 'notes':
        return lead.notes?.join('; ') || '';
      case 'tags':
        return lead.tags?.join('; ') || '';
      default:
        return '';
    }
  }

  // Generar reporte predefinido
  static async generateReport(
    businessType: 'entrenador' | 'gimnasio',
    options: ReportOptions
  ): Promise<Blob> {
    const { type, period, sellerId, source } = options;

    let leads: Lead[] = [];
    let reportData: any = {};

    // Obtener datos según el tipo de reporte
    switch (type) {
      case 'monthly':
        leads = await getLeads({
          businessType,
          ...(period && {
            createdAt: {
              start: period.start,
              end: period.end
            }
          } as any)
        });
        const analytics = await getLeadAnalytics(businessType);
        reportData = {
          title: `Reporte Mensual - ${period ? new Date(period.start).toLocaleDateString() : 'Actual'}`,
          period: period || { start: new Date(), end: new Date() },
          analytics,
          leads
        };
        break;

      case 'by_seller':
        if (!sellerId) throw new Error('sellerId required for by_seller report');
        leads = await getLeads({
          businessType,
          assignedTo: [sellerId]
        });
        reportData = {
          title: `Reporte por Vendedor - ${sellerId}`,
          sellerId,
          leads
        };
        break;

      case 'by_source':
        if (!source) throw new Error('source required for by_source report');
        leads = await getLeads({
          businessType,
          source: [source]
        } as any);
        const roiMetrics = await ROIService.calculateROIBySource(businessType);
        const sourceROI = roiMetrics.find(m => m.source === source);
        reportData = {
          title: `Reporte por Fuente - ${source}`,
          source,
          leads,
          roi: sourceROI
        };
        break;

      case 'custom':
        leads = await getLeads({ businessType });
        reportData = {
          title: 'Reporte Personalizado',
          leads
        };
        break;
    }

    // Generar PDF del reporte
    return this.generatePDFReport(reportData, options);
  }

  // Generar PDF del reporte (simulado)
  private static async generatePDFReport(data: any, options: ReportOptions): Promise<Blob> {
    // En producción, esto usaría jsPDF para generar PDF real con gráficos
    // Por ahora, generamos un texto formateado
    const lines: string[] = [];
    
    lines.push('='.repeat(80));
    lines.push(data.title);
    lines.push('='.repeat(80));
    lines.push('');

    if (data.period) {
      lines.push(`Período: ${new Date(data.period.start).toLocaleDateString()} - ${new Date(data.period.end).toLocaleDateString()}`);
      lines.push('');
    }

    if (data.analytics) {
      lines.push('RESUMEN GENERAL');
      lines.push('-'.repeat(80));
      lines.push(`Total Leads: ${data.analytics.overview.totalLeads}`);
      lines.push(`Nuevos: ${data.analytics.overview.newLeads}`);
      lines.push(`Convertidos: ${data.analytics.overview.convertedLeads}`);
      lines.push(`Tasa de Conversión: ${data.analytics.overview.conversionRate.toFixed(2)}%`);
      lines.push('');
    }

    if (data.roi) {
      lines.push('MÉTRICAS DE ROI');
      lines.push('-'.repeat(80));
      lines.push(`Inversión Total: ${data.roi.totalCost.toFixed(2)} EUR`);
      lines.push(`Leads Totales: ${data.roi.totalLeads}`);
      lines.push(`Conversiones: ${data.roi.convertedLeads}`);
      lines.push(`ROI: ${data.roi.roi.toFixed(2)}%`);
      lines.push('');
    }

    lines.push('LEADS');
    lines.push('-'.repeat(80));
    data.leads.slice(0, 50).forEach((lead: Lead, index: number) => {
      lines.push(`${index + 1}. ${lead.name} - ${lead.status} - ${lead.source}`);
    });

    if (data.leads.length > 50) {
      lines.push(`... y ${data.leads.length - 50} leads más`);
    }

    const content = lines.join('\n');
    return new Blob([content], { type: 'application/pdf' });
  }

  // Programar reporte automático
  static async scheduleReport(
    businessType: 'entrenador' | 'gimnasio',
    options: ReportOptions
  ): Promise<void> {
    if (!options.schedule?.enabled) {
      throw new Error('Schedule must be enabled');
    }

    // En producción, esto guardaría la configuración en la base de datos
    // y un servicio de background ejecutaría los reportes programados
    console.log('[ExportService] Report scheduled:', {
      businessType,
      type: options.type,
      schedule: options.schedule,
      recipients: options.emailRecipients
    });

    // Simular guardado de configuración
    const scheduledReports = this.getScheduledReports();
    scheduledReports.push({
      id: Date.now().toString(),
      businessType,
      ...options,
      createdAt: new Date()
    });
    this.saveScheduledReports(scheduledReports);
  }

  // Obtener reportes programados
  static getScheduledReports(): Array<ReportOptions & { id: string; createdAt: Date }> {
    const stored = localStorage.getItem('scheduled_reports');
    return stored ? JSON.parse(stored) : [];
  }

  // Guardar reportes programados
  private static saveScheduledReports(reports: any[]): void {
    localStorage.setItem('scheduled_reports', JSON.stringify(reports));
  }

  // Eliminar reporte programado
  static async deleteScheduledReport(reportId: string): Promise<void> {
    const reports = this.getScheduledReports();
    const filtered = reports.filter(r => r.id !== reportId);
    this.saveScheduledReports(filtered);
  }

  // Exportar gráfico como imagen
  static async exportChart(
    chartElement: HTMLElement | null,
    format: 'png' | 'pdf' = 'png'
  ): Promise<Blob> {
    if (!chartElement) {
      throw new Error('Chart element not found');
    }

    // En producción, esto usaría html2canvas o similar para convertir el elemento a imagen
    // Por ahora, simulamos la exportación
    const canvas = document.createElement('canvas');
    canvas.width = chartElement.offsetWidth;
    canvas.height = chartElement.offsetHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText('Chart Export', 10, 30);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to export chart');
        }
      }, format === 'png' ? 'image/png' : 'application/pdf');
    });
  }

  // Descargar archivo
  static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

