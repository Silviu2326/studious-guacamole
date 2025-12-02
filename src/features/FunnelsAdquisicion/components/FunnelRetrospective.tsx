import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, TrendingUp, BookOpen, Lightbulb, CheckCircle2, Calendar, DollarSign, Users, Target, AlertCircle } from 'lucide-react';
import { Button, Card } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  AcquisitionFunnelPerformance,
  FunnelRetrospective,
  CreateFunnelRetrospectiveRequest,
  UpdateFunnelRetrospectiveRequest,
  FunnelRealResults,
  FunnelLearning,
  FunnelImprovement,
  FunnelStatus,
} from '../types';

interface FunnelRetrospectiveProps {
  funnel: AcquisitionFunnelPerformance;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: FunnelRetrospective) => void;
}

const categoryLabels: Record<FunnelLearning['category'], string> = {
  copy: 'Copy',
  offer: 'Oferta',
  timing: 'Timing',
  audience: 'Audiencia',
  channel: 'Canal',
  process: 'Proceso',
  other: 'Otro',
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const impactColors = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-gray-600 dark:text-gray-400',
};

export const FunnelRetrospectiveComponent: React.FC<FunnelRetrospectiveProps> = ({
  funnel,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingRetrospective, setExistingRetrospective] = useState<FunnelRetrospective | null>(null);
  const [status, setStatus] = useState<FunnelStatus>('completed');
  const [completedAt, setCompletedAt] = useState(new Date().toISOString().split('T')[0]);
  const [realResults, setRealResults] = useState<FunnelRealResults>({
    totalVisitors: 0,
    totalLeads: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    actualStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actualEndDate: new Date().toISOString().split('T')[0],
    durationDays: 30,
  });
  const [learnings, setLearnings] = useState<Omit<FunnelLearning, 'id'>[]>([]);
  const [newLearning, setNewLearning] = useState<Omit<FunnelLearning, 'id'>>({
    category: 'other',
    title: '',
    description: '',
    impact: 'medium',
    actionable: false,
  });
  const [notes, setNotes] = useState('');
  const [nextIterationPlan, setNextIterationPlan] = useState('');

  const loadExistingRetrospective = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const existing = await FunnelsAdquisicionService.getFunnelRetrospective(funnel.id);
      if (existing) {
        setExistingRetrospective(existing);
        setStatus(existing.status);
        setCompletedAt(existing.completedAt.split('T')[0]);
        setRealResults(existing.realResults);
        setLearnings(existing.learnings);
        setNotes(existing.notes || '');
        setNextIterationPlan(existing.nextIterationPlan || '');
      }
    } catch (error) {
      console.error('[FunnelRetrospective] Error cargando retrospectiva:', error);
    } finally {
      setLoading(false);
    }
  }, [funnel.id, isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadExistingRetrospective();
    } else {
      // Reset form when closing
      setExistingRetrospective(null);
      setStatus('completed');
      setCompletedAt(new Date().toISOString().split('T')[0]);
      setRealResults({
        totalVisitors: 0,
        totalLeads: 0,
        totalConversions: 0,
        totalRevenue: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        actualStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actualEndDate: new Date().toISOString().split('T')[0],
        durationDays: 30,
      });
      setLearnings([]);
      setNewLearning({
        category: 'other',
        title: '',
        description: '',
        impact: 'medium',
        actionable: false,
      });
      setNotes('');
      setNextIterationPlan('');
    }
  }, [isOpen, loadExistingRetrospective]);

  const handleAddLearning = () => {
    if (!newLearning.title || !newLearning.description) return;
    setLearnings([...learnings, newLearning]);
    setNewLearning({
      category: 'other',
      title: '',
      description: '',
      impact: 'medium',
      actionable: false,
    });
  };

  const handleRemoveLearning = (index: number) => {
    setLearnings(learnings.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const durationDays = Math.ceil(
        (new Date(realResults.actualEndDate).getTime() - new Date(realResults.actualStartDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const request: CreateFunnelRetrospectiveRequest | UpdateFunnelRetrospectiveRequest = existingRetrospective
        ? ({
            retrospectiveId: existingRetrospective.id,
            realResults,
            learnings: learnings.map((l, idx) => ({
              ...l,
              id: existingRetrospective.learnings[idx]?.id || `learning-${idx}`,
            })),
            notes,
            nextIterationPlan,
          } as UpdateFunnelRetrospectiveRequest)
        : ({
            funnelId: funnel.id,
            status,
            completedAt: new Date(completedAt).toISOString(),
            realResults: { ...realResults, durationDays },
            learnings,
            notes,
            nextIterationPlan,
          } as CreateFunnelRetrospectiveRequest);

      const response = existingRetrospective
        ? await FunnelsAdquisicionService.updateFunnelRetrospective(request as UpdateFunnelRetrospectiveRequest)
        : await FunnelsAdquisicionService.createFunnelRetrospective(request as CreateFunnelRetrospectiveRequest);

      onSuccess?.(response.retrospective);
      onClose();
    } catch (error) {
      console.error('[FunnelRetrospective] Error guardando retrospectiva:', error);
      alert('Error al guardar la retrospectiva. Por favor, intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const updateRealResults = (field: keyof FunnelRealResults, value: any) => {
    setRealResults((prev) => ({ ...prev, [field]: value }));
    // Auto-calculate conversion rate
    if (field === 'totalLeads' || field === 'totalVisitors') {
      const leads = field === 'totalLeads' ? value : prev.totalLeads;
      const visitors = field === 'totalVisitors' ? value : prev.totalVisitors;
      if (visitors > 0) {
        setRealResults((p) => ({ ...p, conversionRate: (leads / visitors) * 100 }));
      }
    }
    // Auto-calculate average order value
    if (field === 'totalRevenue' || field === 'totalConversions') {
      const revenue = field === 'totalRevenue' ? value : prev.totalRevenue;
      const conversions = field === 'totalConversions' ? value : prev.totalConversions;
      if (conversions > 0) {
        setRealResults((p) => ({ ...p, averageOrderValue: revenue / conversions }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Retrospectiva del Funnel
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">{funnel.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <>
              {/* Status and Dates */}
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as FunnelStatus)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    >
                      <option value="completed">Completado</option>
                      <option value="paused">Pausado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={realResults.actualStartDate}
                      onChange={(e) => updateRealResults('actualStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Fecha de finalización
                    </label>
                    <input
                      type="date"
                      value={realResults.actualEndDate}
                      onChange={(e) => updateRealResults('actualEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </Card>

              {/* Real Results */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Resultados Reales</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Visitantes
                    </label>
                    <input
                      type="number"
                      value={realResults.totalVisitors}
                      onChange={(e) => updateRealResults('totalVisitors', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Leads
                    </label>
                    <input
                      type="number"
                      value={realResults.totalLeads}
                      onChange={(e) => updateRealResults('totalLeads', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Conversiones
                    </label>
                    <input
                      type="number"
                      value={realResults.totalConversions}
                      onChange={(e) => updateRealResults('totalConversions', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Revenue (€)
                    </label>
                    <input
                      type="number"
                      value={realResults.totalRevenue}
                      onChange={(e) => updateRealResults('totalRevenue', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Tasa de conversión (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={realResults.conversionRate.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Ticket promedio (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={realResults.averageOrderValue.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </Card>

              {/* Learnings */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Aprendizajes</h3>
                  </div>
                </div>

                {/* Add Learning Form */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={newLearning.title}
                        onChange={(e) => setNewLearning({ ...newLearning, title: e.target.value })}
                        placeholder="Ej: El CTA funcionó mejor en móvil"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Categoría
                      </label>
                      <select
                        value={newLearning.category}
                        onChange={(e) => setNewLearning({ ...newLearning, category: e.target.value as FunnelLearning['category'] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                      >
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={newLearning.description}
                      onChange={(e) => setNewLearning({ ...newLearning, description: e.target.value })}
                      placeholder="Describe el aprendizaje..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Impacto
                      </label>
                      <select
                        value={newLearning.impact}
                        onChange={(e) => setNewLearning({ ...newLearning, impact: e.target.value as FunnelLearning['impact'] })}
                        className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                      >
                        <option value="high">Alto</option>
                        <option value="medium">Medio</option>
                        <option value="low">Bajo</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={newLearning.actionable}
                        onChange={(e) => setNewLearning({ ...newLearning, actionable: e.target.checked })}
                        className="rounded border-gray-300 dark:border-slate-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300">Requiere acción</span>
                    </label>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAddLearning}
                      disabled={!newLearning.title || !newLearning.description}
                      className="mt-6"
                    >
                      Agregar aprendizaje
                    </Button>
                  </div>
                </div>

                {/* Learnings List */}
                {learnings.length > 0 && (
                  <div className="space-y-3">
                    {learnings.map((learning, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                {categoryLabels[learning.category]}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[learning.impact]}`}>
                                {learning.impact === 'high' ? 'Alto' : learning.impact === 'medium' ? 'Medio' : 'Bajo'} impacto
                              </span>
                              {learning.actionable && (
                                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                  Requiere acción
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{learning.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{learning.description}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveLearning(index)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors ml-2"
                          >
                            <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Notes */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Notas adicionales</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales sobre el funnel..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                />
              </Card>

              {/* Next Iteration Plan */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Plan para la próxima iteración</h3>
                <textarea
                  value={nextIterationPlan}
                  onChange={(e) => setNextIterationPlan(e.target.value)}
                  placeholder="Qué cambios harás en la próxima iteración..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                />
              </Card>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar retrospectiva
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

