import React, { useState } from 'react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  FileDown,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { ExportReport, ReportFormat, ReportPeriod, AutomationType, MessagingChannel } from '../types';

const formatLabel: Record<ReportFormat, { label: string; icon: React.ReactNode; color: string }> = {
  pdf: { label: 'PDF', icon: <FileText className="w-4 h-4" />, color: 'text-red-600' },
  excel: { label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" />, color: 'text-green-600' },
  csv: { label: 'CSV', icon: <FileDown className="w-4 h-4" />, color: 'text-blue-600' },
};

const periodLabel: Record<ReportPeriod, string> = {
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
  'custom': 'Personalizado',
  'monthly': 'Mensual',
  'quarterly': 'Trimestral',
  'yearly': 'Anual',
};

const automationTypeLabel: Record<AutomationType, string> = {
  'session-reminder': 'Recordatorios de Sesión',
  'welcome-sequence': 'Secuencias de Bienvenida',
  'absence-follow-up': 'Seguimiento de Ausencias',
  'inactivity-sequence': 'Secuencias de Inactividad',
  'payment-reminder': 'Recordatorios de Pago',
  'important-date': 'Fechas Importantes',
  'scheduled-message': 'Mensajes Programados',
  'promotional-campaign': 'Campañas Promocionales',
  'newsletter': 'Newsletters',
  'after-hours-reply': 'Respuestas Fuera de Horario',
  'reservation-integration': 'Integración de Reservas',
};

const channelLabel: Record<MessagingChannel, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
  'in-app': 'In-App',
};

interface ReportExporterProps {
  reports: ExportReport[];
  loading?: boolean;
  className?: string;
  onGenerateReport?: (config: any) => void;
  onDownload?: (reportId: string) => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ 
  reports, 
  loading = false, 
  className = '',
  onGenerateReport,
  onDownload,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  if (loading && reports.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusIcon = (status: ExportReport['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'generating':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: ExportReport['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      case 'generating':
        return 'Generando...';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Exportación de Reportes
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Funcionalidad de exportación de reportes en diferentes formatos (PDF, Excel) que incluya métricas de comunicación, comparativas de períodos, y análisis de efectividad de cada tipo de automatización
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="indigo" size="md">
            {reports.length} reportes
          </Badge>
          {onGenerateReport && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Settings className="w-4 h-4" />}
              onClick={() => setShowConfig(!showConfig)}
            >
              Generar Reporte
            </Button>
          )}
        </div>
      </div>

      {/* Configuración rápida de reporte */}
      {showConfig && onGenerateReport && (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Configuración del Reporte
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} block mb-2`}>
                Formato
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div>
              <label className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} block mb-2`}>
                Período
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Aquí se llamaría a onGenerateReport con la configuración
                  setShowConfig(false);
                }}
              >
                Generar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de reportes */}
      <div className="space-y-4">
        {reports.map((report) => {
          const format = formatLabel[report.configuration.format];
          const period = periodLabel[report.configuration.period];
          
          return (
            <div
              key={report.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {report.configuration.name}
                    </h3>
                    <Badge variant="indigo" size="sm" leftIcon={format.icon}>
                      {format.label}
                    </Badge>
                    <Badge variant="gray" size="sm">
                      {period}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </div>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                    Generado el {new Date(report.generatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {report.fileSize && (
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Tamaño: {formatFileSize(report.fileSize)}
                    </p>
                  )}
                </div>
                {report.status === 'completed' && report.fileUrl && onDownload && (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => onDownload(report.id)}
                  >
                    Descargar
                  </Button>
                )}
              </div>

              {/* Resumen de métricas incluidas */}
              {report.metrics && (
                <div className="mb-4">
                  <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Métricas incluidas:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-lg bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-2">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Enviados</p>
                      <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {report.metrics.totalMessagesSent.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-2">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de apertura</p>
                      <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {report.metrics.openRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-2">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de respuesta</p>
                      <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {report.metrics.replyRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-2">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Canales</p>
                      <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {report.metrics.byChannel.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparativa de períodos */}
              {report.periodComparison && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Comparativa con período anterior:
                  </p>
                  <div className="space-y-1">
                    {report.periodComparison.changes.slice(0, 3).map((change, index) => {
                      const TrendIcon = change.trend === 'up' ? TrendingUp : change.trend === 'down' ? TrendingDown : Minus;
                      const trendColor = change.trend === 'up' ? 'text-green-600' : change.trend === 'down' ? 'text-red-600' : 'text-gray-600';
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            {change.metric}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`${ds.typography.caption} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {change.currentValue.toLocaleString()}
                            </span>
                            <div className={`flex items-center gap-1 ${trendColor}`}>
                              <TrendIcon className="w-3 h-3" />
                              <span className={`${ds.typography.caption}`}>
                                {change.changePercentage > 0 ? '+' : ''}{change.changePercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Efectividad de automatizaciones */}
              {report.automationEffectiveness && report.automationEffectiveness.length > 0 && (
                <div className="mb-4">
                  <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                    Análisis de efectividad ({report.automationEffectiveness.length} automatizaciones):
                  </p>
                  <div className="space-y-2">
                    {report.automationEffectiveness.slice(0, 3).map((automation) => {
                      const TrendIcon = automation.trend === 'up' ? TrendingUp : automation.trend === 'down' ? TrendingDown : Minus;
                      const trendColor = automation.trend === 'up' ? 'text-green-600' : automation.trend === 'down' ? 'text-red-600' : 'text-gray-600';
                      return (
                        <div
                          key={automation.automationId}
                          className="rounded-lg bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {automation.automationName}
                            </span>
                            <div className={`flex items-center gap-1 ${trendColor}`}>
                              <TrendIcon className="w-3 h-3" />
                              <span className={`${ds.typography.caption}`}>
                                {automation.changePercentage > 0 ? '+' : ''}{automation.changePercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                              Apertura: {automation.openRate.toFixed(1)}%
                            </span>
                            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                              Respuesta: {automation.replyRate.toFixed(1)}%
                            </span>
                            {automation.conversionRate && (
                              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                                Conversión: {automation.conversionRate.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Configuración del reporte */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                  Incluye: {report.configuration.includeMetrics.communicationMetrics && 'Métricas de comunicación'} 
                  {report.configuration.includeMetrics.periodComparison && ', Comparativa de períodos'} 
                  {report.configuration.includeMetrics.automationEffectiveness && ', Análisis de efectividad'}
                  {report.configuration.includeCharts && ', Gráficos'}
                  {report.configuration.includeRawData && ', Datos sin procesar'}
                </p>
              </div>

              {report.errorMessage && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className={`${ds.typography.caption} text-red-700 dark:text-red-300`}>
                    Error: {report.errorMessage}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reports.length === 0 && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
            No hay reportes generados aún
          </p>
          {onGenerateReport && (
            <Button
              variant="primary"
              leftIcon={<Settings className="w-4 h-4" />}
              onClick={() => setShowConfig(true)}
            >
              Generar Primer Reporte
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

