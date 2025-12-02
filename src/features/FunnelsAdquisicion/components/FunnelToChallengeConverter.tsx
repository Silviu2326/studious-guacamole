import { useState, useCallback } from 'react';
import { Users, Target, Calendar, Settings, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Card, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelToChallengeConversion,
  FunnelToChallengeConversionResponse,
  ChallengeType,
  ChallengeDuration,
} from '../types';

interface FunnelToChallengeConverterProps {
  funnelId: string;
  funnelName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: FunnelToChallengeConversionResponse) => void;
}

const challengeTypes: { value: ChallengeType; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'reto', label: 'Reto', icon: Target },
  { value: 'comunidad', label: 'Comunidad', icon: Users },
  { value: 'evento', label: 'Evento', icon: Calendar },
];

const durations: { value: ChallengeDuration; label: string }[] = [
  { value: '7d', label: '7 días' },
  { value: '14d', label: '14 días' },
  { value: '21d', label: '21 días' },
  { value: '30d', label: '30 días' },
  { value: '60d', label: '60 días' },
  { value: '90d', label: '90 días' },
  { value: 'custom', label: 'Personalizado' },
];

export function FunnelToChallengeConverter({
  funnelId,
  funnelName,
  isOpen,
  onClose,
  onSuccess,
}: FunnelToChallengeConverterProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'basic' | 'settings' | 'success'>('basic');
  const [formData, setFormData] = useState<FunnelToChallengeConversion>({
    funnelId,
    funnelName,
    challengeType: 'reto',
    challengeName: `${funnelName} - Reto`,
    challengeDescription: '',
    duration: '30d',
    startDate: new Date().toISOString().split('T')[0],
    objectives: [],
    rules: [],
    metrics: [],
    includeParticipants: true,
    includeContent: true,
    includeAutomation: true,
    communitySettings: {
      isPrivate: false,
      allowUserPosts: true,
      moderationRequired: false,
      categories: [],
    },
    challengeSettings: {
      enableRanking: true,
      enableProgressTracking: true,
      enableMilestones: true,
      rewards: [],
    },
  });
  const [response, setResponse] = useState<FunnelToChallengeConversionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newObjective, setNewObjective] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newMetric, setNewMetric] = useState('');

  const handleConvert = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await FunnelsAdquisicionService.convertFunnelToChallenge(formData);
      setResponse(result);
      setStep('success');
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      setError(err.message || 'Error al convertir el funnel');
    } finally {
      setLoading(false);
    }
  }, [formData, onSuccess]);

  const handleAddObjective = useCallback(() => {
    if (newObjective.trim()) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...(prev.objectives || []), newObjective.trim()],
      }));
      setNewObjective('');
    }
  }, [newObjective]);

  const handleRemoveObjective = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...(prev.rules || []), newRule.trim()],
      }));
      setNewRule('');
    }
  }, [newRule]);

  const handleRemoveRule = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  const handleAddMetric = useCallback(() => {
    if (newMetric.trim()) {
      setFormData((prev) => ({
        ...prev,
        metrics: [...(prev.metrics || []), newMetric.trim()],
      }));
      setNewMetric('');
    }
  }, [newMetric]);

  const handleRemoveMetric = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  if (!isOpen) return null;

  if (step === 'success' && response) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card className="max-w-2xl w-full mx-4 p-6 bg-white dark:bg-slate-900">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              ¡Funnel convertido exitosamente!
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              El funnel "{funnelName}" ha sido convertido a {response.challengeType}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                  {response.convertedParticipants || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Participantes</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {response.convertedContent || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Contenidos</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-300">
                  {response.convertedAutomations || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Automatizaciones</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <Button variant="primary" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  // Navegar al reto/comunidad creado
                  window.location.href = `/dashboard/experiencias/eventos?challengeId=${response.challengeId}`;
                }}
              >
                Ver {response.challengeType}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl w-full mx-4 p-6 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Convertir Funnel en Reto/Comunidad
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-medium text-red-800 dark:text-red-200">Error</div>
              <div className="text-sm text-red-600 dark:text-red-300">{error}</div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Paso 1: Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Información básica
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tipo de reto/comunidad
              </label>
              <div className="grid grid-cols-3 gap-3">
                {challengeTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.challengeType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, challengeType: type.value }))}
                      className={`
                        p-4 rounded-lg border-2 transition-all
                        ${isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
                        }
                      `}
                    >
                      <Icon size={24} className={`mx-auto mb-2 ${isSelected ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-400'}`} />
                      <div className={`font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-slate-300'}`}>
                        {type.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Nombre del reto/comunidad
              </label>
              <Input
                value={formData.challengeName}
                onChange={(e) => setFormData((prev) => ({ ...prev, challengeName: e.target.value }))}
                placeholder="Ej: Reto 30 días de transformación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Descripción
              </label>
              <Textarea
                value={formData.challengeDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, challengeDescription: e.target.value }))}
                placeholder="Describe el reto/comunidad..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Duración
                </label>
                <Select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value as ChallengeDuration,
                    }))
                  }
                  options={durations.map((d) => ({ value: d.value, label: d.label }))}
                />
                {formData.duration === 'custom' && (
                  <Input
                    type="number"
                    value={formData.customDurationDays || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customDurationDays: parseInt(e.target.value) || undefined,
                      }))
                    }
                    placeholder="Días"
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Fecha de inicio
                </label>
                <Input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Objetivos, reglas y métricas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objetivos, reglas y métricas
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Objetivos
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Ej: Perder 5kg en 30 días"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                />
                <Button variant="secondary" onClick={handleAddObjective}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.objectives?.map((objective, index) => (
                  <Badge key={index} variant="blue" className="flex items-center gap-1">
                    {objective}
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Reglas
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Ej: Subir progreso diario"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                />
                <Button variant="secondary" onClick={handleAddRule}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.rules?.map((rule, index) => (
                  <Badge key={index} variant="purple" className="flex items-center gap-1">
                    {rule}
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Métricas a trackear
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="Ej: Peso, % grasa corporal"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMetric()}
                />
                <Button variant="secondary" onClick={handleAddMetric}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.metrics?.map((metric, index) => (
                  <Badge key={index} variant="pink" className="flex items-center gap-1">
                    {metric}
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Paso 3: Configuraciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuraciones
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeParticipants || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, includeParticipants: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  Incluir participantes actuales del funnel
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeContent || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, includeContent: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Incluir contenido del funnel</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeAutomation || false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, includeAutomation: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Incluir automatizaciones del funnel</span>
              </label>
            </div>

            {formData.challengeType === 'comunidad' && (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-slate-100">Configuración de comunidad</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.communitySettings?.isPrivate || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        communitySettings: { ...prev.communitySettings!, isPrivate: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Comunidad privada</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.communitySettings?.allowUserPosts || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        communitySettings: { ...prev.communitySettings!, allowUserPosts: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Permitir publicaciones de usuarios</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.communitySettings?.moderationRequired || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        communitySettings: { ...prev.communitySettings!, moderationRequired: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Moderación requerida</span>
                </label>
              </div>
            )}

            {formData.challengeType === 'reto' && (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-slate-100">Configuración de reto</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.challengeSettings?.enableRanking || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        challengeSettings: { ...prev.challengeSettings!, enableRanking: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Habilitar ranking</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.challengeSettings?.enableProgressTracking || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        challengeSettings: { ...prev.challengeSettings!, enableProgressTracking: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Habilitar seguimiento de progreso</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.challengeSettings?.enableMilestones || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        challengeSettings: { ...prev.challengeSettings!, enableMilestones: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">Habilitar hitos/milestones</span>
                </label>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConvert} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Convirtiendo...
                </>
              ) : (
                <>
                  Convertir a {formData.challengeType}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

