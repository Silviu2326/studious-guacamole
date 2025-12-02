import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select, Input, Checkbox } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ExportService, ExportOptions, ReportOptions, ReportType } from '../services/exportService';
import { Lead, LeadSource, LeadStatus, PipelineStage } from '../types';
import { getLeads } from '../api/leads';
import {
  FileDown,
  FileText,
  Calendar,
  User,
  BarChart3,
  Settings,
  Mail,
  Clock,
  X,
  Download
} from 'lucide-react';

interface ReportGeneratorProps {
  businessType: 'entrenador' | 'gimnasio';
  leads?: Lead[];
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  businessType,
  leads: providedLeads,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'export' | 'report' | 'schedule'>('export');
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);

  const availableColumns = [
    { id: 'name', label: 'Nombre' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Teléfono' },
    { id: 'source', label: 'Origen' },
    { id: 'status', label: 'Estado' },
    { id: 'stage', label: 'Etapa' },
    { id: 'score', label: 'Score' },
    { id: 'assignedTo', label: 'Asignado a' },
    { id: 'createdAt', label: 'Fecha Creación' },
    { id: 'lastContactDate', label: 'Último Contacto' },
    { id: 'nextFollowUpDate', label: 'Próximo Seguimiento' },
    { id: 'notes', label: 'Notas' },
    { id: 'tags', label: 'Etiquetas' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Seleccionar todas las columnas por defecto
      setSelectedColumns(availableColumns.map(c => c.id));
      loadScheduledReports();
    }
  }, [isOpen]);

  const loadScheduledReports = () => {
    const reports = ExportService.getScheduledReports();
    setScheduledReports(reports.filter((r: any) => r.businessType === businessType));
  };

  const handleExport = async () => {
    if (!providedLeads) return;

    setLoading(true);
    try {
      const options: ExportOptions = {
        format: exportFormat,
        columns: selectedColumns.length > 0 ? selectedColumns : undefined
      };

      const blob = await ExportService.exportLeads(providedLeads, options);
      const extension = exportFormat === 'excel' ? 'xlsx' : exportFormat;
      const filename = `leads_export_${new Date().toISOString().split('T')[0]}.${extension}`;
      
      ExportService.downloadFile(blob, filename);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const period = reportType === 'monthly' ? {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date()
      } : undefined;

      const options: ReportOptions = {
        type: reportType,
        format: 'pdf',
        period,
        includeCharts: true
      };

      const blob = await ExportService.generateReport(businessType, options);
      const filename = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      ExportService.downloadFile(blob, filename);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReport = async () => {
    setLoading(true);
    try {
      const period = reportType === 'monthly' ? {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date()
      } : undefined;

      const options: ReportOptions = {
        type: reportType,
        format: 'pdf',
        period,
        includeCharts: true,
        emailRecipients: [user?.email || ''],
        schedule: {
          enabled: true,
          frequency: 'monthly',
          dayOfMonth: 1,
          time: '09:00'
        }
      };

      await ExportService.scheduleReport(businessType, options);
      loadScheduledReports();
      alert('Reporte programado correctamente');
    } catch (error) {
      console.error('Error scheduling report:', error);
      alert('Error al programar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScheduled = async (reportId: string) => {
    await ExportService.deleteScheduledReport(reportId);
    loadScheduledReports();
  };

  const toggleColumn = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportación y Reportes"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {mode === 'export' && (
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={loading || selectedColumns.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
          {mode === 'report' && (
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          )}
          {mode === 'schedule' && (
            <Button
              variant="primary"
              onClick={handleScheduleReport}
              disabled={loading}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Programar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs de modo */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#334155]">
          <button
            onClick={() => setMode('export')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'export'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-[#F1F5F9]'
            }`}
          >
            <FileDown className="w-4 h-4 inline mr-2" />
            Exportar Datos
          </button>
          <button
            onClick={() => setMode('report')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'report'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-[#F1F5F9]'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Generar Reporte
          </button>
          <button
            onClick={() => setMode('schedule')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'schedule'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-[#F1F5F9]'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Programar Reporte
          </button>
        </div>

        {/* Contenido según modo */}
        {mode === 'export' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                Formato de Exportación
              </label>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv' | 'pdf')}
                options={[
                  { value: 'excel', label: 'Excel (.xlsx)' },
                  { value: 'csv', label: 'CSV (.csv)' },
                  { value: 'pdf', label: 'PDF (.pdf)' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                Columnas a Incluir
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 dark:border-[#334155] rounded">
                {availableColumns.map(column => (
                  <label
                    key={column.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-[#1E1E2E] rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => toggleColumn(column.id)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                      {column.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setSelectedColumns(availableColumns.map(c => c.id))}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={() => setSelectedColumns([])}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Deseleccionar todas
                </button>
              </div>
            </div>

            {providedLeads && (
              <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                Se exportarán {providedLeads.length} leads
              </div>
            )}
          </div>
        )}

        {mode === 'report' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                Tipo de Reporte
              </label>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                options={[
                  { value: 'monthly', label: 'Reporte Mensual' },
                  { value: 'by_seller', label: 'Por Vendedor' },
                  { value: 'by_source', label: 'Por Fuente' },
                  { value: 'custom', label: 'Personalizado' }
                ]}
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
              {reportType === 'monthly' && 'Genera un reporte completo del mes actual con métricas y análisis.'}
              {reportType === 'by_seller' && 'Genera un reporte detallado de los leads asignados a un vendedor específico.'}
              {reportType === 'by_source' && 'Genera un reporte de leads y ROI por fuente de origen.'}
              {reportType === 'custom' && 'Genera un reporte personalizado con todos los leads.'}
            </div>
          </div>
        )}

        {mode === 'schedule' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                Tipo de Reporte
              </label>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                options={[
                  { value: 'monthly', label: 'Reporte Mensual' },
                  { value: 'by_seller', label: 'Por Vendedor' },
                  { value: 'by_source', label: 'Por Fuente' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                Frecuencia
              </label>
              <Select
                value="monthly"
                onChange={() => {}}
                options={[
                  { value: 'daily', label: 'Diario' },
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'monthly', label: 'Mensual' }
                ]}
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
              El reporte se enviará automáticamente por email a: {user?.email}
            </div>

            {/* Reportes programados */}
            {scheduledReports.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
                  Reportes Programados
                </h4>
                <div className="space-y-2">
                  {scheduledReports.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#1E1E2E] rounded"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-[#F1F5F9]">
                          {report.type === 'monthly' ? 'Reporte Mensual' :
                           report.type === 'by_seller' ? 'Por Vendedor' :
                           'Por Fuente'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-[#94A3B8]">
                          {report.schedule?.frequency === 'monthly' ? 'Mensual' :
                           report.schedule?.frequency === 'weekly' ? 'Semanal' :
                           'Diario'} - {report.schedule?.time || '09:00'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteScheduled(report.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-[#334155] rounded"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className={`animate-spin ${ds.radius.full} h-6 w-6 border-b-2 ${ds.color.primaryBg}`}></div>
          </div>
        )}
      </div>
    </Modal>
  );
};

