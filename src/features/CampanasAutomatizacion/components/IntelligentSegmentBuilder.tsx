import React, { useState } from 'react';
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Calendar,
  Plus,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  TrainingProgressMetric,
  TrainingProgressCriteria,
  ClientSegment,
  AutoUpdateRule,
  NPSClassification,
  FeedbackSource,
} from '../types';

interface IntelligentSegmentBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (segment: Partial<ClientSegment>) => void;
  existingSegment?: ClientSegment;
  className?: string;
}

const trainingProgressMetrics: Array<{
  value: TrainingProgressMetric;
  label: string;
  description: string;
  icon: React.ReactNode;
  unit: string;
}> = [
  {
    value: 'completion-rate',
    label: 'Tasa de Cumplimiento',
    description: 'Porcentaje de sesiones completadas vs programadas',
    icon: <Target className="w-4 h-4" />,
    unit: '%',
  },
  {
    value: 'weight-change',
    label: 'Cambio de Peso',
    description: 'Cambio de peso en el período seleccionado',
    icon: <TrendingUp className="w-4 h-4" />,
    unit: 'kg',
  },
  {
    value: 'strength-improvement',
    label: 'Mejora en Fuerza',
    description: 'Incremento en cargas o repeticiones',
    icon: <Activity className="w-4 h-4" />,
    unit: '%',
  },
  {
    value: 'consistency-score',
    label: 'Puntuación de Consistencia',
    description: 'Puntuación basada en regularidad de entrenamientos',
    icon: <Calendar className="w-4 h-4" />,
    unit: '/100',
  },
  {
    value: 'goal-achievement',
    label: 'Logro de Objetivos',
    description: 'Porcentaje de objetivos alcanzados',
    icon: <Award className="w-4 h-4" />,
    unit: '%',
  },
  {
    value: 'session-frequency',
    label: 'Frecuencia de Sesiones',
    description: 'Número de sesiones por semana',
    icon: <Activity className="w-4 h-4" />,
    unit: 'sesiones/semana',
  },
];

const operators = [
  { value: 'greater-than', label: 'Mayor que' },
  { value: 'less-than', label: 'Menor que' },
  { value: 'between', label: 'Entre' },
  { value: 'equals', label: 'Igual a' },
];

const periods = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'all', label: 'Todo el historial' },
];

export const IntelligentSegmentBuilder: React.FC<IntelligentSegmentBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSegment,
}) => {
  const [segmentName, setSegmentName] = useState(existingSegment?.name || '');
  const [segmentDescription, setSegmentDescription] = useState(existingSegment?.description || '');
  const [trainingCriteria, setTrainingCriteria] = useState<TrainingProgressCriteria[]>(
    existingSegment?.trainingProgressCriteria || []
  );
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(existingSegment?.autoUpdateEnabled || false);
  const [autoUpdateFrequency, setAutoUpdateFrequency] = useState<
    'realtime' | 'hourly' | 'daily' | 'weekly'
  >(existingSegment?.autoUpdateFrequency || 'daily');
  const [autoUpdateRules, setAutoUpdateRules] = useState<AutoUpdateRule[]>(
    existingSegment?.autoUpdateRules || []
  );

  const [showAddCriteria, setShowAddCriteria] = useState(false);
  const [newCriteria, setNewCriteria] = useState<Partial<TrainingProgressCriteria>>({
    metric: 'completion-rate',
    operator: 'greater-than',
    value: 0,
    period: '30d',
  });

  const [showAddAutoUpdateRule, setShowAddAutoUpdateRule] = useState(false);
  const [newAutoUpdateRule, setNewAutoUpdateRule] = useState<Partial<AutoUpdateRule>>({
    source: 'nps',
    condition: {
      type: 'nps-score',
      operator: 'greater-than',
      value: 8,
    },
    action: {
      type: 'add-to-segment',
    },
    isActive: true,
  });

  const handleAddCriteria = () => {
    if (newCriteria.metric && newCriteria.operator && newCriteria.value !== undefined) {
      setTrainingCriteria([
        ...trainingCriteria,
        {
          metric: newCriteria.metric!,
          operator: newCriteria.operator!,
          value: newCriteria.value!,
          value2: newCriteria.value2,
          period: newCriteria.period || '30d',
        },
      ]);
      setNewCriteria({
        metric: 'completion-rate',
        operator: 'greater-than',
        value: 0,
        period: '30d',
      });
      setShowAddCriteria(false);
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setTrainingCriteria(trainingCriteria.filter((_, i) => i !== index));
  };

  const handleAddAutoUpdateRule = () => {
    if (
      newAutoUpdateRule.source &&
      newAutoUpdateRule.condition?.type &&
      newAutoUpdateRule.condition?.operator &&
      newAutoUpdateRule.condition?.value !== undefined &&
      newAutoUpdateRule.action?.type
    ) {
      setAutoUpdateRules([
        ...autoUpdateRules,
        {
          id: `rule-${Date.now()}`,
          source: newAutoUpdateRule.source!,
          condition: newAutoUpdateRule.condition!,
          action: newAutoUpdateRule.action!,
          isActive: newAutoUpdateRule.isActive ?? true,
        },
      ]);
      setNewAutoUpdateRule({
        source: 'nps',
        condition: {
          type: 'nps-score',
          operator: 'greater-than',
          value: 8,
        },
        action: {
          type: 'add-to-segment',
        },
        isActive: true,
      });
      setShowAddAutoUpdateRule(false);
    }
  };

  const handleRemoveAutoUpdateRule = (id: string) => {
    setAutoUpdateRules(autoUpdateRules.filter((rule) => rule.id !== id));
  };

  const handleSave = () => {
    if (!segmentName.trim()) {
      alert('Por favor, ingresa un nombre para el segmento');
      return;
    }

    if (trainingCriteria.length === 0) {
      alert('Por favor, agrega al menos un criterio de progreso de entrenamiento');
      return;
    }

    const segment: Partial<ClientSegment> = {
      name: segmentName,
      description: segmentDescription,
      isIntelligentSegment: true,
      trainingProgressCriteria: trainingCriteria,
      autoUpdateEnabled,
      autoUpdateFrequency: autoUpdateEnabled ? autoUpdateFrequency : undefined,
      autoUpdateRules: autoUpdateEnabled ? autoUpdateRules : undefined,
      isActive: true,
      criteria: [], // Los criterios tradicionales se pueden agregar después
    };

    onSave(segment);
    onClose();
  };

  const selectedMetric = trainingProgressMetrics.find((m) => m.value === newCriteria.metric);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Segmento Inteligente"
      size="large"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" leftIcon={<Save size={16} />} onClick={handleSave}>
            Guardar Segmento
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              Segmento Inteligente basado en Progreso de Entrenamientos
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Crea segmentos que se actualizan automáticamente según el progreso de entrenamientos de tus clientes
            </p>
          </div>
        </div>

        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
              Nombre del Segmento *
            </label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="Ej: Clientes con alto progreso"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
              Descripción
            </label>
            <textarea
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
              placeholder="Describe el propósito de este segmento..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Criterios de progreso de entrenamiento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                Criterios de Progreso de Entrenamiento
              </h4>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Define las métricas de progreso que deben cumplir los clientes
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setShowAddCriteria(true)}
            >
              Agregar Criterio
            </Button>
          </div>

          {trainingCriteria.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay criterios agregados. Agrega al menos uno para crear el segmento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trainingCriteria.map((criterion, index) => {
                const metric = trainingProgressMetrics.find((m) => m.value === criterion.metric);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3">
                      {metric?.icon}
                      <div>
                        <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-medium`}>
                          {metric?.label}
                        </p>
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {operators.find((o) => o.value === criterion.operator)?.label}{' '}
                          {criterion.value}
                          {criterion.value2 !== undefined ? ` y ${criterion.value2}` : ''} {metric?.unit} (
                          {periods.find((p) => p.value === criterion.period)?.label})
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<X size={14} />}
                      onClick={() => handleRemoveCriteria(index)}
                    >
                      Eliminar
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Formulario para agregar criterio */}
          {showAddCriteria && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
              <h5 className={`${ds.typography.h5} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
                Nuevo Criterio de Progreso
              </h5>
              <div className="space-y-4">
                <div>
                  <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                    Métrica
                  </label>
                  <select
                    value={newCriteria.metric}
                    onChange={(e) =>
                      setNewCriteria({ ...newCriteria, metric: e.target.value as TrainingProgressMetric })
                    }
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {trainingProgressMetrics.map((metric) => (
                      <option key={metric.value} value={metric.value}>
                        {metric.label} - {metric.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                      Operador
                    </label>
                    <select
                      value={newCriteria.operator}
                      onChange={(e) =>
                        setNewCriteria({ ...newCriteria, operator: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                      Período
                    </label>
                    <select
                      value={newCriteria.period}
                      onChange={(e) =>
                        setNewCriteria({ ...newCriteria, period: e.target.value as any })
                      }
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {periods.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                      Valor {selectedMetric?.unit}
                    </label>
                    <input
                      type="number"
                      value={newCriteria.value || ''}
                      onChange={(e) =>
                        setNewCriteria({ ...newCriteria, value: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {newCriteria.operator === 'between' && (
                    <div>
                      <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                        Valor 2 {selectedMetric?.unit}
                      </label>
                      <input
                        type="number"
                        value={newCriteria.value2 || ''}
                        onChange={(e) =>
                          setNewCriteria({ ...newCriteria, value2: parseFloat(e.target.value) || undefined })
                        }
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="primary" size="sm" onClick={handleAddCriteria}>
                    Agregar Criterio
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddCriteria(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auto-actualización con feedback/NPS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                Auto-actualización con Feedback y NPS
              </h4>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Configura reglas para que el segmento se actualice automáticamente según feedback y NPS
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpdateEnabled}
                onChange={(e) => setAutoUpdateEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Habilitar auto-actualización
              </span>
            </label>
          </div>

          {autoUpdateEnabled && (
            <div className="space-y-4">
              <div>
                <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                  Frecuencia de Auto-actualización
                </label>
                <select
                  value={autoUpdateFrequency}
                  onChange={(e) =>
                    setAutoUpdateFrequency(e.target.value as 'realtime' | 'hourly' | 'daily' | 'weekly')
                  }
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="realtime">Tiempo real</option>
                  <option value="hourly">Cada hora</option>
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className={`${ds.typography.h5} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Reglas de Auto-actualización
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={() => setShowAddAutoUpdateRule(true)}
                  >
                    Agregar Regla
                  </Button>
                </div>

                {autoUpdateRules.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      No hay reglas configuradas. Agrega reglas para nutrir embajadores o recuperar detractores.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {autoUpdateRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                      >
                        <div>
                          <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-medium`}>
                            {rule.source === 'nps' ? 'NPS' : rule.source === 'csat' ? 'CSAT' : 'Feedback personalizado'}:{' '}
                            {rule.condition.type === 'nps-score'
                              ? `Puntuación ${rule.condition.operator} ${rule.condition.value}`
                              : rule.condition.type === 'nps-classification'
                              ? `Clasificación: ${rule.condition.value}`
                              : `Puntuación ${rule.condition.operator} ${rule.condition.value}`}
                          </p>
                          <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Acción: {rule.action.type === 'add-to-segment' ? 'Agregar al segmento' : rule.action.type === 'remove-from-segment' ? 'Remover del segmento' : 'Mover a otro segmento'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<X size={14} />}
                          onClick={() => handleRemoveAutoUpdateRule(rule.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para agregar regla de auto-actualización */}
                {showAddAutoUpdateRule && (
                  <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                    <h5 className={`${ds.typography.h5} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
                      Nueva Regla de Auto-actualización
                    </h5>
                    <div className="space-y-4">
                      <div>
                        <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                          Fuente
                        </label>
                        <select
                          value={newAutoUpdateRule.source}
                          onChange={(e) =>
                            setNewAutoUpdateRule({
                              ...newAutoUpdateRule,
                              source: e.target.value as FeedbackSource,
                              condition: {
                                ...newAutoUpdateRule.condition!,
                                type:
                                  e.target.value === 'nps'
                                    ? 'nps-score'
                                    : e.target.value === 'csat'
                                    ? 'feedback-score'
                                    : 'feedback-score',
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="nps">NPS (Net Promoter Score)</option>
                          <option value="csat">CSAT (Customer Satisfaction)</option>
                          <option value="custom-feedback">Feedback Personalizado</option>
                        </select>
                      </div>
                      <div>
                        <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                          Condición
                        </label>
                        <select
                          value={newAutoUpdateRule.condition?.type}
                          onChange={(e) =>
                            setNewAutoUpdateRule({
                              ...newAutoUpdateRule,
                              condition: {
                                ...newAutoUpdateRule.condition!,
                                type: e.target.value as any,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {newAutoUpdateRule.source === 'nps' ? (
                            <>
                              <option value="nps-score">Puntuación NPS</option>
                              <option value="nps-classification">Clasificación (Promotor/Neutral/Detractor)</option>
                            </>
                          ) : (
                            <option value="feedback-score">Puntuación de Feedback</option>
                          )}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                            Operador
                          </label>
                          <select
                            value={newAutoUpdateRule.condition?.operator}
                            onChange={(e) =>
                              setNewAutoUpdateRule({
                                ...newAutoUpdateRule,
                                condition: {
                                  ...newAutoUpdateRule.condition!,
                                  operator: e.target.value as any,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {operators.map((op) => (
                              <option key={op.value} value={op.value}>
                                {op.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                            Valor
                          </label>
                          {newAutoUpdateRule.condition?.type === 'nps-classification' ? (
                            <select
                              value={newAutoUpdateRule.condition?.value as string}
                              onChange={(e) =>
                                setNewAutoUpdateRule({
                                  ...newAutoUpdateRule,
                                  condition: {
                                    ...newAutoUpdateRule.condition!,
                                    value: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="promoter">Promotor (9-10)</option>
                              <option value="neutral">Neutral (7-8)</option>
                              <option value="detractor">Detractor (0-6)</option>
                            </select>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={newAutoUpdateRule.source === 'nps' ? 10 : 5}
                              value={(newAutoUpdateRule.condition?.value as number) || ''}
                              onChange={(e) =>
                                setNewAutoUpdateRule({
                                  ...newAutoUpdateRule,
                                  condition: {
                                    ...newAutoUpdateRule.condition!,
                                    value: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={`${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2 block`}>
                          Acción
                        </label>
                        <select
                          value={newAutoUpdateRule.action?.type}
                          onChange={(e) =>
                            setNewAutoUpdateRule({
                              ...newAutoUpdateRule,
                              action: {
                                ...newAutoUpdateRule.action!,
                                type: e.target.value as any,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="add-to-segment">Agregar al segmento</option>
                          <option value="remove-from-segment">Remover del segmento</option>
                          <option value="move-to-segment">Mover a otro segmento</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="primary" size="sm" onClick={handleAddAutoUpdateRule}>
                          Agregar Regla
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddAutoUpdateRule(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

