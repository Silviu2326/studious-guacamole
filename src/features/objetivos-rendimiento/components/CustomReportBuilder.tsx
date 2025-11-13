import React, { useState, useEffect } from 'react';
import { Objective, Metric, CustomReportConfig, ReportComment } from '../types';
import { getObjectives } from '../api/objectives';
import { getPerformanceMetrics } from '../api/performance';
import { Card, Button, Modal, Input, Select, Textarea, Checkbox } from '../../../components/componentsreutilizables';
import { FileText, Download, Settings, BarChart3, MessageSquare, Target, X, Plus, Save, Presentation, FileDown } from 'lucide-react';

interface CustomReportBuilderProps {
  role: 'entrenador' | 'gimnasio';
  onGenerate: (config: CustomReportConfig, saveAsConfig?: boolean, configName?: string) => Promise<void>;
  onClose?: () => void;
  initialTemplate?: import('../types').ReportTemplate;
  initialUserConfig?: import('../types').UserReportConfig;
  hasPermission?: boolean;
}

/**
 * Componente para generar reportes personalizados con métricas, gráficos y comentarios
 * User Story: Como manager quiero generar reportes personalizados (PDF, presentación) 
 * con métricas, gráficos y comentarios sobre objetivos, para informar a dirección o inversores.
 */
export const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({
  role,
  onGenerate,
  onClose,
  initialTemplate,
  initialUserConfig,
  hasPermission = false,
}) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saveConfigName, setSaveConfigName] = useState('');
  const [showSaveConfig, setShowSaveConfig] = useState(false);

  // User Story 1: Inicializar configuración desde plantilla o configuración guardada
  const getInitialConfig = (): CustomReportConfig => {
    if (initialUserConfig) {
      return initialUserConfig.config;
    }
    if (initialTemplate) {
      return initialTemplate.config;
    }
    return {
      audience: 'management',
      includeMetrics: true,
      includeCharts: true,
      includeComments: false,
      selectedObjectives: [],
      selectedMetrics: [],
      chartTypes: ['bar', 'line'],
      comments: [],
      template: 'executive',
      customSections: [],
    };
  };

  const [config, setConfig] = useState<CustomReportConfig>(getInitialConfig());

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    type: 'insight' as ReportComment['type'],
    objectiveId: '',
    metricId: '',
  });

  useEffect(() => {
    loadData();
  }, [role]);

  // User Story 1: Actualizar configuración cuando cambia la plantilla o configuración inicial
  useEffect(() => {
    if (initialTemplate || initialUserConfig) {
      setConfig(getInitialConfig());
    }
  }, [initialTemplate, initialUserConfig]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [objectivesData, metricsData] = await Promise.all([
        getObjectives({}, role),
        getPerformanceMetrics(role, 'mes'),
      ]);
      setObjectives(objectivesData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleObjective = (objectiveId: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedObjectives: prev.selectedObjectives?.includes(objectiveId)
        ? prev.selectedObjectives.filter((id) => id !== objectiveId)
        : [...(prev.selectedObjectives || []), objectiveId],
    }));
  };

  const handleToggleMetric = (metricId: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics?.includes(metricId)
        ? prev.selectedMetrics.filter((id) => id !== metricId)
        : [...(prev.selectedMetrics || []), metricId],
    }));
  };

  const handleToggleChartType = (chartType: 'bar' | 'line' | 'pie' | 'area') => {
    setConfig((prev) => ({
      ...prev,
      chartTypes: prev.chartTypes?.includes(chartType)
        ? prev.chartTypes.filter((type) => type !== chartType)
        : [...(prev.chartTypes || []), chartType],
    }));
  };

  const handleAddComment = () => {
    if (!newComment.content.trim()) {
      alert('Por favor, ingresa un comentario');
      return;
    }

    const comment: ReportComment = {
      id: `comment_${Date.now()}`,
      content: newComment.content,
      type: newComment.type,
      objectiveId: newComment.objectiveId || undefined,
      metricId: newComment.metricId || undefined,
      author: 'user', // En producción usar el ID del usuario actual
      authorName: 'Manager', // En producción usar el nombre del usuario actual
      createdAt: new Date().toISOString(),
    };

    setConfig((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), comment],
    }));

    setNewComment({
      content: '',
      type: 'insight',
      objectiveId: '',
      metricId: '',
    });
    setShowCommentModal(false);
  };

  const handleRemoveComment = (commentId: string) => {
    setConfig((prev) => ({
      ...prev,
      comments: prev.comments?.filter((c) => c.id !== commentId) || [],
    }));
  };

  const handleGenerate = async (format: 'pdf' | 'presentation', saveAsConfig?: boolean) => {
    if (!config.includeMetrics && !config.includeCharts && !config.includeComments) {
      alert('Selecciona al menos una opción: métricas, gráficos o comentarios');
      return;
    }

    if (config.includeMetrics && (!config.selectedObjectives?.length && !config.selectedMetrics?.length)) {
      alert('Selecciona al menos un objetivo o métrica para incluir en el reporte');
      return;
    }

    // User Story 1: Si se solicita guardar configuración, pedir nombre
    if (saveAsConfig && hasPermission) {
      if (!saveConfigName.trim()) {
        setShowSaveConfig(true);
        return;
      }
    }

    setGenerating(true);
    try {
      await onGenerate(
        {
          ...config,
          template: format === 'presentation' ? 'presentation' : config.template,
        },
        saveAsConfig && hasPermission,
        saveConfigName.trim() || undefined
      );
      setSaveConfigName('');
      setShowSaveConfig(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setGenerating(false);
    }
  };

  const getCommentTypeColor = (type: ReportComment['type']) => {
    switch (type) {
      case 'insight':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recommendation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'observation':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Cargando datos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Generador de Reportes Personalizados
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Crea reportes personalizados con métricas, gráficos y comentarios para dirección o inversores
          </p>
        </div>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
        )}
      </div>

      {/* Configuración General */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audiencia
            </label>
            <Select
              value={config.audience}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  audience: e.target.value as CustomReportConfig['audience'],
                  template:
                    e.target.value === 'investors'
                      ? 'presentation'
                      : e.target.value === 'management'
                      ? 'executive'
                      : prev.template,
                }))
              }
              options={[
                { value: 'management', label: 'Dirección' },
                { value: 'investors', label: 'Inversores' },
                { value: 'team', label: 'Equipo' },
                { value: 'custom', label: 'Personalizado' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plantilla
            </label>
            <Select
              value={config.template}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  template: e.target.value as CustomReportConfig['template'],
                }))
              }
              options={[
                { value: 'executive', label: 'Ejecutivo' },
                { value: 'detailed', label: 'Detallado' },
                { value: 'presentation', label: 'Presentación' },
                { value: 'custom', label: 'Personalizado' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Contenido a Incluir */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Contenido a Incluir
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={config.includeMetrics}
              onChange={(checked) =>
                setConfig((prev) => ({ ...prev, includeMetrics: checked }))
              }
              label="Incluir Métricas"
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={config.includeCharts}
              onChange={(checked) =>
                setConfig((prev) => ({ ...prev, includeCharts: checked }))
              }
              label="Incluir Gráficos"
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={config.includeComments}
              onChange={(checked) =>
                setConfig((prev) => ({ ...prev, includeComments: checked }))
              }
              label="Incluir Comentarios"
            />
          </div>
        </div>
      </Card>

      {/* Selección de Objetivos */}
      {config.includeMetrics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Seleccionar Objetivos
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleToggleObjective(objective.id)}
              >
                <Checkbox
                  checked={config.selectedObjectives?.includes(objective.id) || false}
                  onChange={() => handleToggleObjective(objective.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{objective.title}</p>
                  <p className="text-xs text-gray-500">
                    Progreso: {objective.progress.toFixed(0)}% - {objective.currentValue} /{' '}
                    {objective.targetValue} {objective.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selección de Métricas */}
      {config.includeMetrics && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Seleccionar Métricas
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleToggleMetric(metric.id)}
              >
                <Checkbox
                  checked={config.selectedMetrics?.includes(metric.id) || false}
                  onChange={() => handleToggleMetric(metric.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                  <p className="text-xs text-gray-500">
                    {metric.value} {metric.unit} - {metric.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tipos de Gráficos */}
      {config.includeCharts && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tipos de Gráficos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['bar', 'line', 'pie', 'area'] as const).map((chartType) => (
              <div
                key={chartType}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  config.chartTypes?.includes(chartType)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleToggleChartType(chartType)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={config.chartTypes?.includes(chartType) || false}
                    onChange={() => handleToggleChartType(chartType)}
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {chartType === 'bar' ? 'Barras' : chartType === 'line' ? 'Líneas' : chartType === 'pie' ? 'Circular' : 'Área'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Comentarios */}
      {config.includeComments && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comentarios
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCommentModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Comentario
            </Button>
          </div>
          <div className="space-y-3">
            {config.comments && config.comments.length > 0 ? (
              config.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getCommentTypeColor(
                          comment.type
                        )}`}
                      >
                        {comment.type === 'insight'
                          ? 'Insight'
                          : comment.type === 'recommendation'
                          ? 'Recomendación'
                          : comment.type === 'observation'
                          ? 'Observación'
                          : 'Advertencia'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.authorName} -{' '}
                        {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveComment(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  {comment.objectiveId && (
                    <p className="text-xs text-gray-500 mt-2">
                      Objetivo: {objectives.find((o) => o.id === comment.objectiveId)?.title}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay comentarios agregados. Haz clic en "Agregar Comentario" para añadir uno.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between gap-3">
        <div>
          {/* User Story 1: Botón para guardar configuración si tiene permiso */}
          {hasPermission && (
            <Button
              variant="secondary"
              onClick={() => setShowSaveConfig(true)}
              disabled={generating}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="secondary" onClick={onClose} disabled={generating}>
              Cancelar
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => handleGenerate('pdf')}
            disabled={generating}
            loading={generating}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Generar PDF
          </Button>
          <Button
            variant="primary"
            onClick={() => handleGenerate('presentation')}
            disabled={generating}
            loading={generating}
          >
            <Presentation className="w-4 h-4 mr-2" />
            Generar Presentación
          </Button>
        </div>
      </div>

      {/* User Story 1: Modal para guardar configuración */}
      {showSaveConfig && (
        <Modal
          isOpen={showSaveConfig}
          onClose={() => {
            setShowSaveConfig(false);
            setSaveConfigName('');
          }}
          title="Guardar Configuración Personalizada"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Configuración
              </label>
              <Input
                value={saveConfigName}
                onChange={(e) => setSaveConfigName(e.target.value)}
                placeholder="Ej: Mi Reporte Semanal"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSaveConfig(false);
                  setSaveConfigName('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleGenerate('pdf', true)}
                disabled={!saveConfigName.trim() || generating}
              >
                Guardar y Generar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para Agregar Comentario */}
      {showCommentModal && (
        <Modal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          title="Agregar Comentario"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comentario
              </label>
              <Select
                value={newComment.type}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    type: e.target.value as ReportComment['type'],
                  }))
                }
                options={[
                  { value: 'insight', label: 'Insight' },
                  { value: 'recommendation', label: 'Recomendación' },
                  { value: 'observation', label: 'Observación' },
                  { value: 'warning', label: 'Advertencia' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo (Opcional)
              </label>
              <Select
                value={newComment.objectiveId}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, objectiveId: e.target.value }))
                }
                options={[
                  { value: '', label: 'Ninguno' },
                  ...objectives.map((obj) => ({
                    value: obj.id,
                    label: obj.title,
                  })),
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario
              </label>
              <Textarea
                value={newComment.content}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                placeholder="Escribe tu comentario aquí..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowCommentModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleAddComment}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

