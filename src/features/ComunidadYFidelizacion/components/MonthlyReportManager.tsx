import { useState } from 'react';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Star,
  Users,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import {
  MonthlyReport,
  MonthlyReportConfig,
  ReportStatus,
  ReportFormat,
} from '../types';

interface MonthlyReportManagerProps {
  reports?: MonthlyReport[];
  config?: MonthlyReportConfig;
  loading?: boolean;
  onGenerateReport?: (month?: string) => void;
  onDownloadReport?: (reportId: string) => void;
  onSendReport?: (reportId: string) => void;
  onUpdateConfig?: (config: MonthlyReportConfig) => void;
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pendiente',
  generating: 'Generando',
  completed: 'Completado',
  sent: 'Enviado',
  failed: 'Error',
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  generating: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
  sent: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  failed: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
};

export function MonthlyReportManager({
  reports = [],
  config,
  loading = false,
  onGenerateReport,
  onDownloadReport,
  onSendReport,
  onUpdateConfig,
}: MonthlyReportManagerProps) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [localConfig, setLocalConfig] = useState<MonthlyReportConfig | null>(config || null);

  const handleUpdateConfig = () => {
    if (localConfig && onUpdateConfig) {
      onUpdateConfig(localConfig);
      setShowConfigModal(false);
    }
  };

  const latestReport = reports.length > 0 ? reports[0] : null;
  const previousReport = reports.length > 1 ? reports[1] : null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Reportes Mensuales
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Reportes PDF/email automáticos con métricas de satisfacción, testimonios, clientes promotores y más
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowConfigModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onGenerateReport && onGenerateReport()}
              disabled={loading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Configuración actual */}
        {config && (
          <div className="mb-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Envío Automático
                  </span>
                  {config.enabled && config.autoSend ? (
                    <Badge variant="green" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="gray" size="sm">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactivo
                    </Badge>
                  )}
                </div>
                {config.enabled && config.autoSend && (
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Se enviará automáticamente el día {config.sendDate} de cada mes a{' '}
                    {config.recipients.length} destinatario(s)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Último reporte */}
        {latestReport && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Último Reporte: {latestReport.period}
            </h3>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">
                      Reporte de {latestReport.period}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {latestReport.generatedAt &&
                        `Generado el ${new Date(latestReport.generatedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <Badge className={STATUS_COLORS[latestReport.status]} size="md">
                  {STATUS_LABELS[latestReport.status]}
                </Badge>
              </div>

              {/* Métricas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Satisfacción
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {latestReport.averageSatisfaction.toFixed(1)}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {latestReport.comparisonWithPreviousMonth.averageSatisfaction.change > 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{latestReport.comparisonWithPreviousMonth.averageSatisfaction.change.toFixed(1)}%
                      </span>
                    ) : latestReport.comparisonWithPreviousMonth.averageSatisfaction.change < 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {latestReport.comparisonWithPreviousMonth.averageSatisfaction.change.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Minus className="w-3 h-3" />
                        Sin cambios
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Testimonios
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {latestReport.testimonialsCollected}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    {latestReport.comparisonWithPreviousMonth.testimonialsCollected.change > 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{latestReport.comparisonWithPreviousMonth.testimonialsCollected.change}
                      </span>
                    ) : latestReport.comparisonWithPreviousMonth.testimonialsCollected.change < 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {latestReport.comparisonWithPreviousMonth.testimonialsCollected.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Minus className="w-3 h-3" />
                        Sin cambios
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-300" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      Promotores
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {latestReport.promoterClients}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {latestReport.comparisonWithPreviousMonth.promoterClients.change > 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{latestReport.comparisonWithPreviousMonth.promoterClients.change}
                      </span>
                    ) : latestReport.comparisonWithPreviousMonth.promoterClients.change < 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {latestReport.comparisonWithPreviousMonth.promoterClients.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Minus className="w-3 h-3" />
                        Sin cambios
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Feedback Resuelto
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {latestReport.negativeFeedbackResolved}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    {latestReport.comparisonWithPreviousMonth.negativeFeedbackResolved.change > 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{latestReport.comparisonWithPreviousMonth.negativeFeedbackResolved.change}
                      </span>
                    ) : latestReport.comparisonWithPreviousMonth.negativeFeedbackResolved.change < 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {latestReport.comparisonWithPreviousMonth.negativeFeedbackResolved.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Minus className="w-3 h-3" />
                        Sin cambios
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tendencias */}
              {latestReport.trends.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                    Tendencias Principales
                  </h4>
                  <div className="space-y-2">
                    {latestReport.trends.map((trend, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100">
                            {trend.metric}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-slate-400">
                            {trend.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-slate-100">
                            {trend.value}
                          </span>
                          {trend.changeType === 'increase' ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : trend.changeType === 'decrease' ? (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {latestReport.status === 'completed' && (
                  <>
                    {latestReport.downloadUrl && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onDownloadReport && onDownloadReport(latestReport.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    )}
                    {latestReport.status !== 'sent' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSendReport && onSendReport(latestReport.id)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar por Email
                      </Button>
                    )}
                  </>
                )}
                {latestReport.status === 'generating' && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Generando reporte...</span>
                  </div>
                )}
                {latestReport.status === 'failed' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>Error al generar el reporte</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Historial de reportes */}
        {reports.length > 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Historial de Reportes
            </h3>
            <div className="space-y-2">
              {reports.slice(1).map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        Reporte de {report.period}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">
                        {report.generatedAt &&
                          `Generado el ${new Date(report.generatedAt).toLocaleDateString()}`}
                        {report.sentAt && ` • Enviado el ${new Date(report.sentAt).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_COLORS[report.status]} size="sm">
                      {STATUS_LABELS[report.status]}
                    </Badge>
                    {report.downloadUrl && report.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadReport && onDownloadReport(report.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              No hay reportes generados aún. Genera tu primer reporte mensual para comenzar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onGenerateReport && onGenerateReport()}
              disabled={loading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar Primer Reporte
            </Button>
          </div>
        )}
      </Card>

      {/* Modal de configuración */}
      {showConfigModal && localConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Configurar Reportes Mensuales
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Habilitar reportes automáticos
                </label>
                <input
                  type="checkbox"
                  checked={localConfig.enabled}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              {localConfig.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Envío automático
                    </label>
                    <input
                      type="checkbox"
                      checked={localConfig.autoSend}
                      onChange={(e) =>
                        setLocalConfig({ ...localConfig, autoSend: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  {localConfig.autoSend && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Día del mes para envío (1-31)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={localConfig.sendDate}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            sendDate: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-100"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Destinatarios (emails separados por comas)
                    </label>
                    <textarea
                      value={localConfig.recipients.join(', ')}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          recipients: e.target.value.split(',').map((email) => email.trim()),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-100"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Formato
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['pdf', 'email', 'both'] as ReportFormat[]).map((format) => (
                        <Button
                          key={format}
                          variant={localConfig.format === format ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setLocalConfig({ ...localConfig, format })}
                        >
                          {format === 'pdf' ? 'PDF' : format === 'email' ? 'Email' : 'Ambos'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowConfigModal(false);
                    setLocalConfig(config || null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleUpdateConfig} className="flex-1">
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

