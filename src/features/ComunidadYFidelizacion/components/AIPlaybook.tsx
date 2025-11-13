import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Target,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  RefreshCw,
  Plus,
  Eye,
  Check,
  X,
  AlertCircle,
  BarChart3,
  Award,
  Zap,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Input, Textarea, Tabs } from '../../../components/componentsreutilizables';
import {
  AIPlaybook,
  AIPlaybookSuggestion,
  SuggestionStatus,
  ChallengeType,
  EventType,
  SuggestionPriority,
} from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { useAuth } from '../../../context/AuthContext';

interface AIPlaybookProps {
  playbook?: AIPlaybook;
  suggestions?: AIPlaybookSuggestion[];
  loading?: boolean;
  onRefresh?: () => void;
}

const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  fitness: 'Fitness',
  nutricion: 'Nutrición',
  mental: 'Mental',
  social: 'Social',
  transformacion: 'Transformación',
  personalizado: 'Personalizado',
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  workshop: 'Workshop',
  retro: 'Retro',
  competencia: 'Competencia',
  masterclass: 'Masterclass',
  networking: 'Networking',
  celebracion: 'Celebración',
  personalizado: 'Personalizado',
};

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  scheduled: 'Programada',
  completed: 'Completada',
};

const STATUS_COLORS: Record<SuggestionStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const PRIORITY_LABELS: Record<SuggestionPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const PRIORITY_COLORS: Record<SuggestionPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

export function AIPlaybook({ playbook, suggestions = [], loading = false, onRefresh }: AIPlaybookProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'config'>('suggestions');
  const [selectedStatus, setSelectedStatus] = useState<SuggestionStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'challenge' | 'event' | 'all'>('all');
  const [viewingSuggestion, setViewingSuggestion] = useState<AIPlaybookSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playbookConfig, setPlaybookConfig] = useState<AIPlaybook | null>(playbook || null);

  useEffect(() => {
    if (playbook) {
      setPlaybookConfig(playbook);
    }
  }, [playbook]);

  const filteredSuggestions = useMemo(() => {
    let filtered = suggestions;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter((s) => s.type === selectedType);
    }
    return filtered;
  }, [suggestions, selectedStatus, selectedType]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No programada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAccept = async (suggestionId: string) => {
    try {
      await CommunityFidelizacionService.acceptAIPlaybookSuggestion(suggestionId);
      onRefresh?.();
    } catch (error) {
      console.error('Error aceptando sugerencia:', error);
    }
  };

  const handleReject = async (suggestionId: string, reason?: string) => {
    try {
      await CommunityFidelizacionService.rejectAIPlaybookSuggestion(suggestionId, reason);
      onRefresh?.();
    } catch (error) {
      console.error('Error rechazando sugerencia:', error);
    }
  };

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    try {
      if (playbookConfig) {
        await CommunityFidelizacionService.generateAIPlaybookSuggestions(playbookConfig.id);
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error generando sugerencias:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                AI Playbook - Retos y Eventos
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Sugerencias inteligentes de retos y eventos basadas en tu estilo y calendario
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleGenerateSuggestions}
            disabled={isGenerating || !playbookConfig?.enabled}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Generar Sugerencias
          </Button>
          {onRefresh && (
            <Button variant="ghost" onClick={onRefresh} className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {playbookConfig && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Sugerencias</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {playbookConfig.stats?.totalSuggestions || 0}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Aceptadas</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {playbookConfig.stats?.acceptedSuggestions || 0}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Engagement Promedio</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {playbookConfig.stats?.averageEngagement || 0}%
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Impacto Promedio</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {playbookConfig.stats?.averageImpact || 0}%
            </div>
          </div>
        </div>
      )}

      <Tabs
        items={[
          { id: 'suggestions', label: 'Sugerencias', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'suggestions' | 'config')}
        variant="pills"
        size="sm"
      />

      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as SuggestionStatus | 'all')}
              className="w-48"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'challenge' | 'event' | 'all')}
              className="w-48"
            >
              <option value="all">Todos los tipos</option>
              <option value="challenge">Retos</option>
              <option value="event">Eventos</option>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-slate-400">Cargando sugerencias...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-400">No hay sugerencias disponibles</p>
              <Button
                variant="secondary"
                onClick={handleGenerateSuggestions}
                disabled={isGenerating}
                className="mt-4"
              >
                Generar Sugerencias
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setViewingSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {suggestion.type === 'challenge' ? (
                          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                          {suggestion.type === 'challenge'
                            ? suggestion.challenge?.title
                            : suggestion.event?.title}
                        </h3>
                        <Badge className={PRIORITY_COLORS[suggestion.priority]}>
                          {PRIORITY_LABELS[suggestion.priority]}
                        </Badge>
                        <Badge className={STATUS_COLORS[suggestion.status]}>
                          {STATUS_LABELS[suggestion.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {suggestion.type === 'challenge'
                          ? suggestion.challenge?.description
                          : suggestion.event?.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-slate-400">Alineación:</span>
                          <span className={`font-semibold ${getScoreColor(suggestion.alignmentScore)}`}>
                            {suggestion.alignmentScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-slate-400">Calendario:</span>
                          <span className={`font-semibold ${getScoreColor(suggestion.calendarFit)}`}>
                            {suggestion.calendarFit}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-slate-400">Comunidad:</span>
                          <span className={`font-semibold ${getScoreColor(suggestion.communityFit)}`}>
                            {suggestion.communityFit}%
                          </span>
                        </div>
                      </div>
                      {suggestion.scheduledFor && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Programada para: {formatDate(suggestion.scheduledFor)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {suggestion.status === 'pending' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(suggestion.id);
                            }}
                            className="inline-flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Aceptar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(suggestion.id);
                            }}
                            className="inline-flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingSuggestion(suggestion);
                        }}
                        className="inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'config' && playbookConfig && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Configuración de Estilo</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-slate-400">Tono:</span>{' '}
                <span className="font-medium">{playbookConfig.trainerStyle.tone || 'No configurado'}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-slate-400">Valores:</span>{' '}
                <span className="font-medium">
                  {playbookConfig.trainerStyle.values?.join(', ') || 'No configurados'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Restricciones de Calendario</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-slate-400">Días preferidos:</span>{' '}
                <span className="font-medium">
                  {playbookConfig.calendarConstraints.preferredDays?.join(', ') || 'Todos'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-slate-400">Horarios preferidos:</span>{' '}
                <span className="font-medium">
                  {playbookConfig.calendarConstraints.preferredTimes?.join(', ') || 'Todos'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingSuggestion && (
        <Modal
          isOpen={!!viewingSuggestion}
          onClose={() => setViewingSuggestion(null)}
          title={
            viewingSuggestion.type === 'challenge'
              ? viewingSuggestion.challenge?.title
              : viewingSuggestion.event?.title
          }
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Descripción</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {viewingSuggestion.type === 'challenge'
                  ? viewingSuggestion.challenge?.description
                  : viewingSuggestion.event?.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Razonamiento de la IA</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">{viewingSuggestion.reasoning}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Alineación</div>
                <div className={`text-lg font-bold ${getScoreColor(viewingSuggestion.alignmentScore)}`}>
                  {viewingSuggestion.alignmentScore}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Calendario</div>
                <div className={`text-lg font-bold ${getScoreColor(viewingSuggestion.calendarFit)}`}>
                  {viewingSuggestion.calendarFit}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Comunidad</div>
                <div className={`text-lg font-bold ${getScoreColor(viewingSuggestion.communityFit)}`}>
                  {viewingSuggestion.communityFit}%
                </div>
              </div>
            </div>
            {viewingSuggestion.type === 'challenge' && viewingSuggestion.challenge && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Detalles del Reto</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Duración:</span>{' '}
                    <span className="font-medium">{viewingSuggestion.challenge.duration} días</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Dificultad:</span>{' '}
                    <span className="font-medium capitalize">{viewingSuggestion.challenge.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Engagement estimado:</span>{' '}
                    <span className="font-medium">{viewingSuggestion.challenge.estimatedEngagement}%</span>
                  </div>
                </div>
              </div>
            )}
            {viewingSuggestion.type === 'event' && viewingSuggestion.event && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Detalles del Evento</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Duración:</span>{' '}
                    <span className="font-medium">{viewingSuggestion.event.duration} horas</span>
                  </div>
                  {viewingSuggestion.event.suggestedDate && (
                    <div>
                      <span className="text-gray-600 dark:text-slate-400">Fecha sugerida:</span>{' '}
                      <span className="font-medium">{formatDate(viewingSuggestion.event.suggestedDate)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">Asistencia estimada:</span>{' '}
                    <span className="font-medium">{viewingSuggestion.event.estimatedAttendance} personas</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              {viewingSuggestion.status === 'pending' && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleAccept(viewingSuggestion.id);
                      setViewingSuggestion(null);
                    }}
                  >
                    Aceptar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleReject(viewingSuggestion.id);
                      setViewingSuggestion(null);
                    }}
                  >
                    Rechazar
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={() => setViewingSuggestion(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

