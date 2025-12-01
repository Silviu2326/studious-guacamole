import React, { useState, useEffect } from 'react';
import { Report, ReportType, ReportFormat, ReportStatus } from '../types';
import { getReports, generateReport, simulateDownload } from '../api/reports';
import { Card, Button, Table, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Download, 
  Calendar, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  FileDown,
  Info,
  BarChart3,
  Target,
  TrendingUp,
  Bell
} from 'lucide-react';

interface ReportsGeneratorProps {
  role: 'entrenador' | 'gimnasio';
  onError?: (errorMessage: string) => void;
}

interface ReportFormData {
  type: ReportType | '';
  dateFrom: string;
  dateTo: string;
  sections: {
    kpis: boolean;
    objetivos: boolean;
    metricas: boolean;
    alertas: boolean;
  };
  format: ReportFormat | '';
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({ role, onError }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    type: ReportType.MONTHLY,
    dateFrom: '',
    dateTo: '',
    sections: {
      kpis: true,
      objetivos: true,
      metricas: true,
      alertas: true,
    },
    format: ReportFormat.PDF,
  });

  useEffect(() => {
    loadReports();
    // Set default date range to last month
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    setFormData(prev => ({
      ...prev,
      dateFrom: lastMonth.toISOString().split('T')[0],
      dateTo: lastDayOfLastMonth.toISOString().split('T')[0],
    }));
  }, []);

  // Auto-update date range when report type changes
  useEffect(() => {
    if (!formData.type || formData.type === ReportType.CUSTOM) return;
    
    const now = new Date();
    let dateFrom = new Date();
    let dateTo = new Date();

    switch (formData.type) {
      case ReportType.DAILY:
        // Yesterday
        dateFrom.setDate(now.getDate() - 1);
        dateTo.setDate(now.getDate() - 1);
        break;
      case ReportType.WEEKLY:
        // Last week (Monday to Sunday)
        const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
        dateFrom.setDate(now.getDate() - daysFromMonday - 7);
        dateTo.setDate(dateFrom.getDate() + 6);
        break;
      case ReportType.MONTHLY:
        // Last month
        dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        dateTo = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case ReportType.QUARTERLY:
        // Last quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
        dateFrom = new Date(now.getFullYear(), lastQuarter * 3, 1);
        dateTo = new Date(now.getFullYear(), (lastQuarter + 1) * 3, 0);
        break;
      case ReportType.YEARLY:
        // Last year
        dateFrom = new Date(now.getFullYear() - 1, 0, 1);
        dateTo = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }

    setFormData(prev => ({
      ...prev,
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0],
    }));
  }, [formData.type]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar los reportes';
      showToast('Error al cargar los reportes', 'error');
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.format) {
      showToast('Por favor, completa todos los campos requeridos', 'error');
      return;
    }

    if (!formData.dateFrom || !formData.dateTo) {
      showToast('Por favor, selecciona un rango de fechas', 'error');
      return;
    }

    if (new Date(formData.dateFrom) > new Date(formData.dateTo)) {
      showToast('La fecha de inicio debe ser anterior a la fecha de fin', 'error');
      return;
    }

    // Check if at least one section is selected
    const hasSections = Object.values(formData.sections).some(v => v);
    if (!hasSections) {
      showToast('Por favor, selecciona al menos una sección', 'error');
      return;
    }

    setGenerating(true);
    try {
      await generateReport({
        tipo: formData.type as ReportType,
        formato: formData.format as ReportFormat,
        rangoFechas: {
          desde: formData.dateFrom,
          hasta: formData.dateTo,
        },
        role,
      });
      
      showToast('Reporte generado exitosamente', 'success');
      await loadReports();
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        type: ReportType.MONTHLY,
        format: ReportFormat.PDF,
      }));
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Error al generar el reporte', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      const downloadUrl = await simulateDownload(reportId);
      // Simulate download by opening in new tab
      window.open(downloadUrl, '_blank');
      showToast('Descarga iniciada', 'success');
    } catch (error) {
      console.error('Error downloading report:', error);
      showToast('Error al descargar el reporte', 'error');
    }
  };

  const getStatusBadge = (status: ReportStatus | string) => {
    const statusConfig: Record<string, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' }> = {
      [ReportStatus.PENDING]: { label: 'Pendiente', variant: 'blue' },
      [ReportStatus.GENERATING]: { label: 'Generando', variant: 'yellow' },
      [ReportStatus.COMPLETED]: { label: 'Completado', variant: 'green' },
      [ReportStatus.FAILED]: { label: 'Error', variant: 'red' },
    };
    
    const statusKey = status as string;
    const config = statusConfig[statusKey] || { label: statusKey, variant: 'blue' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getFormatBadge = (format: ReportFormat | string) => {
    const formatConfig: Record<string, { label: string; variant: 'red' | 'green' | 'blue' }> = {
      [ReportFormat.PDF]: { label: 'PDF', variant: 'red' },
      [ReportFormat.EXCEL]: { label: 'Excel', variant: 'green' },
      [ReportFormat.CSV]: { label: 'CSV', variant: 'blue' },
    };
    
    const formatKey = format as string;
    const config = formatConfig[formatKey] || { label: formatKey, variant: 'blue' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      label: 'Nombre',
      render: (value: string, row: Report) => (
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">{value}</div>
            <div className="text-xs text-gray-500 truncate">
              {row.type === ReportType.DAILY ? 'Diario' :
               row.type === ReportType.WEEKLY ? 'Semanal' :
               row.type === ReportType.MONTHLY ? 'Mensual' :
               row.type === ReportType.QUARTERLY ? 'Trimestral' :
               row.type === ReportType.YEARLY ? 'Anual' :
               'Personalizado'} - {row.period}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (_: any, row: Report) => (
        <div className="text-sm text-gray-700 hidden md:block">
          {row.type === ReportType.DAILY ? 'Diario' :
           row.type === ReportType.WEEKLY ? 'Semanal' :
           row.type === ReportType.MONTHLY ? 'Mensual' :
           row.type === ReportType.QUARTERLY ? 'Trimestral' :
           row.type === ReportType.YEARLY ? 'Anual' :
           'Personalizado'}
        </div>
      ),
    },
    {
      key: 'rangoFechas',
      label: 'Fechas',
      render: (_: any, row: Report) => (
        <div className="text-sm text-gray-700 hidden lg:block">
          {row.rangoFechas ? (
            <>
              <div>{new Date(row.rangoFechas.desde).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</div>
              <div className="text-xs text-gray-500">
                {new Date(row.rangoFechas.hasta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              </div>
            </>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: 'generatedAt',
      label: 'Creado',
      render: (value: string) => (
        <div className="text-sm text-gray-700">
          <div className="hidden md:block">
            {new Date(value).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short',
              year: 'numeric'
            })}
          </div>
          <div className="md:hidden text-xs">
            {new Date(value).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: '2-digit'
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: any, row: Report) => (
        <div className="hidden sm:block">
          {getStatusBadge(row.status || row.estado || ReportStatus.PENDING)}
        </div>
      ),
    },
    {
      key: 'format',
      label: 'Formato',
      render: (_: any, row: Report) => (
        <div className="hidden lg:block">
          {getFormatBadge(row.format || row.formato || ReportFormat.PDF)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Report) => {
        const status = row.status || row.estado || ReportStatus.PENDING;
        const isCompleted = status === ReportStatus.COMPLETED;
        
        return (
          <div className="flex gap-2">
            {isCompleted ? (
              <button
                onClick={() => handleDownload(row.id)}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                title="Descargar"
              >
                <Download className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-gray-400 p-2 hidden sm:inline">No disponible</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right-full fade-in duration-300`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-green-600" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} className="text-red-600" />
            ) : (
              <Info size={20} className="text-blue-600" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar superior */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Generador de Reportes</h2>
        </div>
        <Button variant="secondary" onClick={loadReports} disabled={loading}>
          <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>

      {/* Información de casos de uso */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Casos de Uso Típicos</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Reporte Mensual de Facturación:</strong> Genera un reporte mensual para analizar los ingresos, 
                comparar con objetivos establecidos y identificar tendencias. Ideal para revisión mensual con el equipo.
              </p>
              <p>
                <strong>Reporte de Retención:</strong> Crea reportes personalizados para analizar la tasa de retención 
                de clientes en períodos específicos. Útil para evaluar estrategias de fidelización.
              </p>
              <p>
                <strong>Reporte Semanal de KPIs:</strong> Genera reportes semanales con los indicadores clave de rendimiento 
                para seguimiento continuo del progreso hacia los objetivos.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Formulario de generación */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          Generar Nuevo Reporte
        </h3>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de reporte */}
            <div>
              <Select
                label="Tipo de Reporte"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportType })}
                options={[
                  { value: ReportType.DAILY, label: 'Diario' },
                  { value: ReportType.WEEKLY, label: 'Semanal' },
                  { value: ReportType.MONTHLY, label: 'Mensual' },
                  { value: ReportType.QUARTERLY, label: 'Trimestral' },
                  { value: ReportType.YEARLY, label: 'Anual' },
                  { value: ReportType.CUSTOM, label: 'Personalizado' },
                ]}
                required
              />
            </div>

            {/* Formato */}
            <div>
              <Select
                label="Formato"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as ReportFormat })}
                options={[
                  { value: ReportFormat.PDF, label: 'PDF' },
                  { value: ReportFormat.EXCEL, label: 'Excel (.xlsx)' },
                ]}
                required
              />
            </div>

            {/* Rango de fechas */}
            <div>
              <Input
                label="Fecha Desde"
                type="date"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                required
              />
            </div>

            <div>
              <Input
                label="Fecha Hasta"
                type="date"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Secciones incluidas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Secciones Incluidas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.sections.kpis}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: { ...formData.sections, kpis: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">KPIs</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.sections.objetivos}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: { ...formData.sections, objetivos: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Objetivos</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.sections.metricas}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: { ...formData.sections, metricas: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Métricas</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.sections.alertas}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: { ...formData.sections, alertas: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Alertas</span>
                </div>
              </label>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const now = new Date();
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                setFormData({
                  type: ReportType.MONTHLY,
                  dateFrom: lastMonth.toISOString().split('T')[0],
                  dateTo: lastDayOfLastMonth.toISOString().split('T')[0],
                  sections: {
                    kpis: true,
                    objetivos: true,
                    metricas: true,
                    alertas: true,
                  },
                  format: ReportFormat.PDF,
                });
              }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileDown size={18} className="mr-2" />
                  Generar Reporte
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Listado de reportes */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Reportes Generados
        </h3>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando reportes...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reportes generados</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comienza generando tu primer reporte usando el formulario de arriba.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              data={reports}
              columns={columns}
              loading={false}
              emptyMessage="No hay reportes generados"
            />
          </div>
        )}
      </Card>
    </div>
  );
};
