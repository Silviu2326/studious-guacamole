import { useState } from 'react';
import { FlaskConical, Plus, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock, Play } from 'lucide-react';
import { Badge, Button } from '../../../../components/componentsreutilizables';
import {
  MarketingExperiment,
  ExperimentsSnapshot,
  ExperimentStatus,
  ExperimentKPIImpact,
} from '../types';

interface ExperimentsTrackerProps {
  snapshot: ExperimentsSnapshot | null;
  loading: boolean;
  onSaveExperiment?: (experiment: MarketingExperiment) => Promise<void>;
  onUpdateExperiment?: (experimentId: string, updates: Partial<MarketingExperiment>) => Promise<void>;
  className?: string;
}

export function ExperimentsTracker({
  snapshot,
  loading,
  onSaveExperiment,
  onUpdateExperiment,
  className = '',
}: ExperimentsTrackerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<MarketingExperiment>>({
    name: '',
    description: '',
    hypothesis: '',
    type: 'campaign',
    status: 'draft',
    kpiImpacts: [],
    results: {
      success: false,
      shouldRepeat: false,
      keyLearnings: [],
    },
    tags: [],
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.hypothesis) {
      return;
    }

    const newExperiment: MarketingExperiment = {
      id: `exp-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      hypothesis: formData.hypothesis,
      type: formData.type || 'campaign',
      startDate: new Date().toISOString(),
      status: formData.status || 'draft',
      kpiImpacts: formData.kpiImpacts || [],
      results: formData.results || {
        success: false,
        shouldRepeat: false,
        keyLearnings: [],
      },
      tags: formData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onSaveExperiment) {
      await onSaveExperiment(newExperiment);
    }

    setShowCreateForm(false);
    setFormData({
      name: '',
      description: '',
      hypothesis: '',
      type: 'campaign',
      status: 'draft',
      kpiImpacts: [],
      results: {
        success: false,
        shouldRepeat: false,
        keyLearnings: [],
      },
      tags: [],
    });
  };

  const getStatusBadge = (status: ExperimentStatus) => {
    const variants: Record<ExperimentStatus, { variant: 'blue' | 'success' | 'warning' | 'danger'; label: string; icon: any }> = {
      draft: { variant: 'blue', label: 'Borrador', icon: Clock },
      active: { variant: 'success', label: 'Activo', icon: Play },
      completed: { variant: 'success', label: 'Completado', icon: CheckCircle2 },
      cancelled: { variant: 'danger', label: 'Cancelado', icon: XCircle },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      campaign: 'Campaña',
      content: 'Contenido',
      funnel: 'Funnel',
      email: 'Email',
      social: 'Redes Sociales',
      other: 'Otro',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <FlaskConical className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Experimentos Realizados</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Registra experimentos y su impacto en KPIs para saber qué repetir
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Experimento
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Crear Nuevo Experimento</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Nombre del Experimento
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
                placeholder="Ej: Campaña de retargeting con UGC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
                rows={3}
                placeholder="Describe qué hiciste en este experimento..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Hipótesis
              </label>
              <textarea
                value={formData.hypothesis}
                onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
                rows={2}
                placeholder="Qué esperabas lograr con este experimento..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-slate-100"
              >
                <option value="campaign">Campaña</option>
                <option value="content">Contenido</option>
                <option value="funnel">Funnel</option>
                <option value="email">Email</option>
                <option value="social">Redes Sociales</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleSubmit}>
                Guardar Experimento
              </Button>
              <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {snapshot && snapshot.experiments.length > 0 ? (
        <div className="space-y-4">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{snapshot.totalCount}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Total</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{snapshot.activeCount}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Activos</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{snapshot.completedCount}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Completados</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{snapshot.successfulCount}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Exitosos</div>
            </div>
          </div>

          {/* Top Experimentos */}
          {snapshot.topPerformingExperiments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Top Experimentos Exitosos</h3>
              <div className="space-y-3">
                {snapshot.topPerformingExperiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{exp.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{exp.description}</p>
                      </div>
                      {getStatusBadge(exp.status)}
                    </div>
                    {exp.results.keyLearnings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Aprendizajes:</p>
                        <ul className="text-sm text-gray-600 dark:text-slate-400 list-disc list-inside">
                          {exp.results.keyLearnings.map((learning, idx) => (
                            <li key={idx}>{learning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Experimentos */}
          <div className="space-y-3">
            {snapshot.experiments.map((experiment) => (
              <div
                key={experiment.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100">{experiment.name}</h4>
                      <Badge variant="blue" size="sm">
                        {getTypeLabel(experiment.type)}
                      </Badge>
                      {getStatusBadge(experiment.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{experiment.description}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500 italic">
                      <strong>Hipótesis:</strong> {experiment.hypothesis}
                    </p>
                  </div>
                </div>

                {experiment.kpiImpacts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Impacto en KPIs:</p>
                    <div className="space-y-2">
                      {experiment.kpiImpacts.map((impact, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-slate-400">{impact.kpiLabel}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 dark:text-slate-500">
                              {impact.beforeValue.toFixed(1)} → {impact.afterValue.toFixed(1)}
                            </span>
                            {impact.changeDirection === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : impact.changeDirection === 'down' ? (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            ) : (
                              <Minus className="w-4 h-4 text-gray-400" />
                            )}
                            <span
                              className={`font-semibold ${
                                impact.changeDirection === 'up'
                                  ? 'text-green-600 dark:text-green-400'
                                  : impact.changeDirection === 'down'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-slate-400'
                              }`}
                            >
                              {impact.changePercentage > 0 ? '+' : ''}
                              {impact.changePercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {experiment.results.shouldRepeat && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Badge variant="success" className="flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      Recomendado repetir
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Insights */}
          {snapshot.insights.length > 0 && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Insights</h3>
              <ul className="space-y-1">
                {snapshot.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-slate-300">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-slate-400 mb-4">No hay experimentos registrados aún</p>
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Experimento
          </Button>
        </div>
      )}
    </div>
  );
}

