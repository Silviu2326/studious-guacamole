import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Report, GlobalFilters, CustomReportConfig, ReportTemplate, UserReportConfig } from '../types';
import { 
  getReports, 
  generateReport, 
  exportReport, 
  generateCustomReport,
  getReportTemplates,
  getUserReportConfigs,
  saveUserReportConfig,
  hasReportCustomizationPermission,
  exportRawData
} from '../api/reports';
import { exportRawDataToCSV, exportRawDataToJSON, exportRawDataToExcel } from '../utils/export';
import { CustomReportBuilder } from './CustomReportBuilder';
import { ScheduledReportsManager } from './ScheduledReportsManager';
import { IntelligentSummaryGenerator } from './IntelligentSummaryGenerator';
import { Card, Button, Table, Modal, Select } from '../../../components/componentsreutilizables';
import { FileText, Download, Calendar, RefreshCw, Loader2, Settings, Presentation, Sparkles, Target, AlertTriangle, CheckCircle2, Eye, Clock, TrendingUp, TrendingDown, Minus, Database, Save, FileDown } from 'lucide-react';

interface ReportsGeneratorProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

export interface ReportsGeneratorRef {
  exportReport: () => void;
}

export const ReportsGenerator = forwardRef<ReportsGeneratorRef, ReportsGeneratorProps>(({ role, globalFilters, periodo }, ref) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [showScheduledReports, setShowScheduledReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'scheduled' | 'summaries'>('reports');
  
  // User Story 1: Estados para plantillas y configuraciones personalizadas
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [userConfigs, setUserConfigs] = useState<UserReportConfig[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedUserConfig, setSelectedUserConfig] = useState<string>('');
  const [hasPermission, setHasPermission] = useState(false);
  const [exportingRawData, setExportingRawData] = useState(false);

  const handleExportLatest = async () => {
    if (reports.length > 0) {
      const latestReport = reports[0];
      await handleExport(latestReport.id, 'pdf');
    } else {
      alert('No hay reportes disponibles para exportar. Genera un reporte primero.');
    }
  };

  useImperativeHandle(ref, () => ({
    exportReport: handleExportLatest,
  }));

  useEffect(() => {
    loadReports();
    loadTemplatesAndConfigs();
  }, [globalFilters, user]);

  // User Story 1: Cargar plantillas y configuraciones personalizadas
  const loadTemplatesAndConfigs = async () => {
    if (!user?.id) return;
    
    try {
      const [templatesData, configsData, permission] = await Promise.all([
        getReportTemplates(user.id),
        getUserReportConfigs(user.id),
        hasReportCustomizationPermission(user.id),
      ]);
      
      setTemplates(templatesData);
      setUserConfigs(configsData);
      setHasPermission(permission);
      
      // Seleccionar plantilla por defecto si existe
      const defaultTemplate = templatesData.find(t => t.isDefault);
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate.id);
      }
      
      // Seleccionar configuración por defecto del usuario si existe
      const defaultConfig = configsData.find(c => c.isDefault);
      if (defaultConfig) {
        setSelectedUserConfig(defaultConfig.id);
      }
    } catch (error) {
      console.error('Error loading templates and configs:', error);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type: Report['type']) => {
    setGenerating(true);
    try {
      const period = type === 'daily' ? new Date().toISOString().split('T')[0] :
                     type === 'weekly' ? `Semana ${getWeekNumber(new Date())}` :
                     type === 'monthly' ? new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) :
                     type === 'quarterly' ? `Q${Math.floor((new Date().getMonth() + 3) / 3)} ${new Date().getFullYear()}` :
                     new Date().getFullYear().toString();
      
      // User Story 1 & 2: Incluir todas las nuevas secciones por defecto
      const report = await generateReport(type, period, role, {
        includeAINarrative: true,
        includeObjectivesVsTargets: true,
        includeRisks: true,
        includeProposedActions: true,
      });
      await loadReports();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (reportId: string, format: 'pdf' | 'excel' | 'csv' | 'presentation') => {
    try {
      const filename = await exportReport(reportId, format);
      alert(`Reporte exportado: ${filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el reporte');
    }
  };

  const handleGenerateCustomReport = async (config: CustomReportConfig, saveAsConfig?: boolean, configName?: string) => {
    setGenerating(true);
    try {
      await generateCustomReport(config, role);
      await loadReports();
      
      // User Story 1: Guardar configuración personalizada si se solicita
      if (saveAsConfig && configName && user?.id && hasPermission) {
        await saveUserReportConfig({
          userId: user.id,
          userName: user.name || 'Usuario',
          name: configName,
          config,
          templateId: selectedTemplate || undefined,
        });
        await loadTemplatesAndConfigs();
        alert('Configuración guardada exitosamente');
      }
      
      setShowCustomBuilder(false);
    } catch (error) {
      console.error('Error generating custom report:', error);
      alert('Error al generar el reporte personalizado');
    } finally {
      setGenerating(false);
    }
  };

  // User Story 1: Aplicar plantilla seleccionada
  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    setShowCustomBuilder(true);
    // La configuración de la plantilla se aplicará en CustomReportBuilder
  };

  // User Story 1: Aplicar configuración personalizada del usuario
  const handleApplyUserConfig = async () => {
    if (!selectedUserConfig) return;
    
    const config = userConfigs.find(c => c.id === selectedUserConfig);
    if (!config) return;
    
    setShowCustomBuilder(true);
    // La configuración se aplicará en CustomReportBuilder
  };

  // User Story 2: Exportar datos en bruto
  const handleExportRawData = async (format: 'csv' | 'excel' | 'json') => {
    setExportingRawData(true);
    try {
      const rawData = await exportRawData(role, format, globalFilters, periodo);
      
      switch (format) {
        case 'csv':
          exportRawDataToCSV(rawData, 'datos-objetivos-bruto');
          break;
        case 'excel':
          exportRawDataToExcel(rawData, 'datos-objetivos-bruto');
          break;
        case 'json':
          exportRawDataToJSON(rawData, 'datos-objetivos-bruto');
          break;
      }
      
      alert(`Datos en bruto exportados exitosamente en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting raw data:', error);
      alert('Error al exportar los datos en bruto');
    } finally {
      setExportingRawData(false);
    }
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const columns = [
    {
      key: 'title',
      label: 'Reporte',
      render: (value: string, row: Report) => (
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">
              {row.type} - {row.period}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'generatedAt',
      label: 'Generado',
      render: (value: string) => new Date(value).toLocaleString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Exportar',
      render: (_: any, row: Report) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleExport(row.id, 'pdf')}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            title="Exportar PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExport(row.id, 'excel')}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Exportar Excel"
          >
            <Download className="w-4 h-4" />
          </button>
          {row.type === 'custom' && (
            <button
              onClick={() => handleExport(row.id, 'presentation')}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
              title="Exportar Presentación"
            >
              <Presentation className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
      case 'exceeded':
        return 'text-green-600 bg-green-50';
      case 'at_risk':
        return 'text-yellow-600 bg-yellow-50';
      case 'behind':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-700 bg-red-100';
      case 'high':
        return 'text-orange-700 bg-orange-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'reports'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reportes
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'scheduled'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reportes Programados
        </button>
        <button
          onClick={() => setActiveTab('summaries')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'summaries'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Resúmenes Inteligentes
        </button>
      </div>

      {activeTab === 'reports' ? (
        <>
          {/* Toolbar superior */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="primary"
                onClick={() => setShowCustomBuilder(true)}
                disabled={generating}
              >
                <Settings size={20} className="mr-2" />
                Reporte Personalizado
              </Button>
              
              {/* User Story 2: Botón para exportar datos en bruto */}
              <div className="relative">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const menu = document.getElementById('raw-export-menu');
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                  disabled={exportingRawData}
                >
                  <Database size={20} className="mr-2" />
                  Exportar Datos en Bruto
                  {exportingRawData && <Loader2 size={16} className="ml-2 animate-spin" />}
                </Button>
                <div
                  id="raw-export-menu"
                  className="hidden absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]"
                >
                  <button
                    onClick={() => {
                      handleExportRawData('csv');
                      document.getElementById('raw-export-menu')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Exportar CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExportRawData('excel');
                      document.getElementById('raw-export-menu')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Exportar Excel
                  </button>
                  <button
                    onClick={() => {
                      handleExportRawData('json');
                      document.getElementById('raw-export-menu')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Exportar JSON
                  </button>
                </div>
              </div>
            </div>
            
            <Button variant="secondary" onClick={loadReports} disabled={loading}>
              <RefreshCw size={20} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          {/* User Story 1: Selector de plantillas y configuraciones personalizadas */}
          {hasPermission && (templates.length > 0 || userConfigs.length > 0) && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-4 flex-wrap">
                {templates.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plantillas Comunes
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        options={[
                          { value: '', label: 'Seleccionar plantilla...' },
                          ...templates.map(t => ({
                            value: t.id,
                            label: t.name,
                          })),
                        ]}
                        className="flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleApplyTemplate}
                        disabled={!selectedTemplate}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}
                
                {userConfigs.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mis Configuraciones
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedUserConfig}
                        onChange={(e) => setSelectedUserConfig(e.target.value)}
                        options={[
                          { value: '', label: 'Seleccionar configuración...' },
                          ...userConfigs.map(c => ({
                            value: c.id,
                            label: c.name,
                          })),
                        ]}
                        className="flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleApplyUserConfig}
                        disabled={!selectedUserConfig}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                💡 Puedes personalizar tus reportes basándote en plantillas comunes o usar tus configuraciones guardadas
              </p>
            </Card>
          )}

      {/* Card para generar reportes */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Generar Nuevo Reporte
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as Report['type'][]).map((type) => (
            <Button
              key={type}
              variant="secondary"
              onClick={() => handleGenerate(type)}
              disabled={generating}
              className="w-full"
            >
              <Calendar size={20} className="mr-2" />
              {type === 'daily' ? 'Diario' :
               type === 'weekly' ? 'Semanal' :
               type === 'monthly' ? 'Mensual' :
               type === 'quarterly' ? 'Trimestral' :
               'Anual'}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tabla de reportes */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : (
        <Table
          data={reports}
          columns={[
            ...columns,
            {
              key: 'view',
              label: 'Ver Detalles',
              render: (_: any, row: Report) => (
                <button
                  onClick={() => setSelectedReport(row)}
                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                  title="Ver detalles del reporte"
                >
                  <Eye className="w-4 h-4" />
                </button>
              ),
            },
          ]}
          loading={false}
          emptyMessage="No hay reportes generados"
        />
      )}
        </>
      ) : activeTab === 'scheduled' ? (
        <ScheduledReportsManager role={role} />
      ) : (
        <IntelligentSummaryGenerator 
          role={role} 
          period={periodo ? new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : undefined} 
        />
      )}

      {/* Modal de detalles del reporte */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
          size="xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* User Story 1: Resumen narrativo de IA */}
            {selectedReport.aiNarrativeSummary && (
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Resumen Narrativo Generado por IA</h3>
                  <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {selectedReport.aiNarrativeSummary.confidence}% confianza
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{selectedReport.aiNarrativeSummary.summary}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Puntos Destacados</h4>
                    <ul className="space-y-1">
                      {selectedReport.aiNarrativeSummary.keyHighlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tendencias</h4>
                    <ul className="space-y-1">
                      {selectedReport.aiNarrativeSummary.trends.map((trend, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <TrendingUp size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                  <ul className="space-y-2">
                    {selectedReport.aiNarrativeSummary.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-purple-600 font-bold">{idx + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* User Story 2: Comparativas Objetivos vs Targets */}
            {selectedReport.objectivesVsTargets && selectedReport.objectivesVsTargets.length > 0 && (
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Comparativa Objetivos vs Targets</h3>
                </div>
                <div className="space-y-4">
                  {selectedReport.objectivesVsTargets.map((comparison) => (
                    <div key={comparison.objectiveId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{comparison.objectiveTitle}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(comparison.status)}`}>
                          {comparison.status === 'on_track' ? 'En camino' :
                           comparison.status === 'at_risk' ? 'En riesgo' :
                           comparison.status === 'behind' ? 'Retrasado' : 'Superado'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Valor Actual</p>
                          <p className="text-base font-semibold text-gray-900">
                            {comparison.currentValue.toFixed(2)} {comparison.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Target</p>
                          <p className="text-base font-semibold text-gray-900">
                            {comparison.targetValue.toFixed(2)} {comparison.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Progreso</p>
                          <p className="text-base font-semibold text-gray-900">
                            {comparison.progress.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Días Restantes</p>
                          <p className="text-base font-semibold text-gray-900 flex items-center gap-1">
                            <Clock size={14} />
                            {comparison.daysRemaining}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        {comparison.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {comparison.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {comparison.trend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
                        <span className="text-gray-600">
                          Tendencia: {comparison.trend === 'improving' ? 'Mejorando' :
                                     comparison.trend === 'declining' ? 'Declinando' : 'Estable'}
                        </span>
                        {comparison.gap !== 0 && (
                          <span className={`ml-auto ${comparison.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {comparison.gap > 0 ? '-' : '+'}{Math.abs(comparison.gap).toFixed(2)} {comparison.unit}
                            ({comparison.gapPercentage > 0 ? '-' : '+'}{Math.abs(comparison.gapPercentage).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* User Story 2: Riesgos Detectados */}
            {selectedReport.detectedRisks && selectedReport.detectedRisks.length > 0 && (
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Riesgos Detectados</h3>
                  <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                    {selectedReport.detectedRisks.length} riesgo(s)
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedReport.detectedRisks.map((risk) => (
                    <div key={risk.id} className={`border-l-4 rounded-lg p-4 ${getSeverityColor(risk.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                          {risk.severity === 'critical' ? 'Crítico' :
                           risk.severity === 'high' ? 'Alto' :
                           risk.severity === 'medium' ? 'Medio' : 'Bajo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Probabilidad</p>
                          <p className="font-semibold">{risk.probability}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Impacto Actual</p>
                          <p className="font-semibold">{risk.currentImpact}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Impacto Potencial</p>
                          <p className="font-semibold">{risk.potentialImpact}%</p>
                        </div>
                      </div>
                      {risk.mitigationActions && risk.mitigationActions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Acciones de Mitigación:</p>
                          <ul className="space-y-1">
                            {risk.mitigationActions.map((action, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <span className="text-red-600">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* User Story 2: Acciones Propuestas */}
            {selectedReport.proposedActions && selectedReport.proposedActions.length > 0 && (
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Acciones Propuestas</h3>
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {selectedReport.proposedActions.length} acción(es)
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedReport.proposedActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{action.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(action.priority)}`}>
                          {action.priority === 'urgent' ? 'Urgente' :
                           action.priority === 'high' ? 'Alta' :
                           action.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{action.description}</p>
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Razón:</p>
                        <p className="text-xs text-blue-800">{action.rationale}</p>
                      </div>
                      {action.steps && action.steps.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Pasos:</p>
                          <ol className="space-y-2">
                            {action.steps.map((step) => (
                              <li key={step.id} className="text-xs text-gray-600 flex items-start gap-2">
                                <span className="font-semibold text-gray-900">{step.order}.</span>
                                <div>
                                  <p className="font-medium">{step.title}</p>
                                  <p className="text-gray-500">{step.description}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de Generador de Reportes Personalizados */}
      {showCustomBuilder && (
        <Modal
          isOpen={showCustomBuilder}
          onClose={() => setShowCustomBuilder(false)}
          title="Generar Reporte Personalizado"
          size="xl"
        >
          <CustomReportBuilder
            role={role}
            onGenerate={handleGenerateCustomReport}
            onClose={() => setShowCustomBuilder(false)}
            initialTemplate={selectedTemplate ? templates.find(t => t.id === selectedTemplate) : undefined}
            initialUserConfig={selectedUserConfig ? userConfigs.find(c => c.id === selectedUserConfig) : undefined}
            hasPermission={hasPermission}
          />
        </Modal>
      )}
    </div>
  );
});

ReportsGenerator.displayName = 'ReportsGenerator';

