import { useState, useMemo } from 'react';
import {
  Sparkles,
  Send,
  FileText,
  Users,
  Calendar,
  Settings,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Copy,
  Clock,
  Target,
  Award,
  BarChart3,
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal, Select, Input, Textarea, Table } from '../../../components/componentsreutilizables';
import {
  AIAdaptedSurvey,
  AIAdaptedSurveyTemplate,
  AIAdaptedSurveyStats,
  ExperienceType,
  SurveyAdaptationLevel,
  SurveyQuestionType,
} from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';

interface AIAdaptedSurveysProps {
  surveys?: AIAdaptedSurvey[];
  templates?: AIAdaptedSurveyTemplate[];
  stats?: AIAdaptedSurveyStats[];
  loading?: boolean;
  onGenerateSurvey?: (templateId: string, clientId: string, experienceId: string, experienceType: ExperienceType) => void;
  onSendSurvey?: (surveyId: string) => void;
  onRefresh?: () => void;
}

const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
  'sesion-1-1': 'Sesión 1:1',
  reto: 'Reto',
  evento: 'Evento',
  programa: 'Programa',
  webinar: 'Webinar',
  workshop: 'Workshop',
};

const EXPERIENCE_TYPE_ICONS: Record<ExperienceType, React.ReactNode> = {
  'sesion-1-1': <Users className="w-4 h-4" />,
  reto: <Target className="w-4 h-4" />,
  evento: <Calendar className="w-4 h-4" />,
  programa: <FileText className="w-4 h-4" />,
  webinar: <MessageSquare className="w-4 h-4" />,
  workshop: <Award className="w-4 h-4" />,
};

const ADAPTATION_LEVEL_LABELS: Record<SurveyAdaptationLevel, string> = {
  basic: 'Básica',
  advanced: 'Avanzada',
  personalized: 'Personalizada',
};

const STATUS_LABELS: Record<AIAdaptedSurvey['status'], string> = {
  draft: 'Borrador',
  active: 'Activa',
  sent: 'Enviada',
  completed: 'Completada',
  archived: 'Archivada',
};

const STATUS_COLORS: Record<AIAdaptedSurvey['status'], string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  sent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
};

const QUESTION_TYPE_LABELS: Record<SurveyQuestionType, string> = {
  rating: 'Calificación',
  'multiple-choice': 'Opción múltiple',
  text: 'Texto libre',
  'yes-no': 'Sí/No',
  scale: 'Escala',
};

export function AIAdaptedSurveys({
  surveys = [],
  templates = [],
  stats = [],
  loading = false,
  onGenerateSurvey,
  onSendSurvey,
  onRefresh,
}: AIAdaptedSurveysProps) {
  const [activeTab, setActiveTab] = useState<'surveys' | 'templates' | 'stats'>('surveys');
  const [selectedExperienceType, setSelectedExperienceType] = useState<ExperienceType | 'all'>('all');
  const [isViewingSurvey, setIsViewingSurvey] = useState<AIAdaptedSurvey | null>(null);
  const [isViewingTemplate, setIsViewingTemplate] = useState<AIAdaptedSurveyTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredSurveys = useMemo(() => {
    if (selectedExperienceType === 'all') {
      return surveys;
    }
    return surveys.filter((survey) => survey.experienceType === selectedExperienceType);
  }, [surveys, selectedExperienceType]);

  const filteredTemplates = useMemo(() => {
    if (selectedExperienceType === 'all') {
      return templates;
    }
    return templates.filter((template) => template.experienceType === selectedExperienceType);
  }, [templates, selectedExperienceType]);

  const experienceTypeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    ...Object.entries(EXPERIENCE_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleGenerateSurvey = async () => {
    // This would typically open a modal to select template, client, and experience
    setIsGenerating(true);
    try {
      // Simulate survey generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error generating survey:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendSurvey = async (surveyId: string) => {
    try {
      await CommunityFidelizacionService.sendAIAdaptedSurvey(surveyId);
      if (onSendSurvey) {
        onSendSurvey(surveyId);
      }
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error sending survey:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-6 p-6">
          <div className="h-8 w-64 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-48 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'surveys', label: 'Encuestas', icon: <FileText className="w-4 h-4" /> },
    { id: 'templates', label: 'Plantillas', icon: <Copy className="w-4 h-4" /> },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Encuestas IA Adaptadas por Experiencia
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Encuestas IA adaptadas a cada experiencia (sesión 1:1, reto, evento) para recibir feedback accionable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedExperienceType}
            onChange={(value) => setSelectedExperienceType(value as ExperienceType | 'all')}
            options={experienceTypeOptions}
            className="w-48"
            size="sm"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateSurvey}
            disabled={isGenerating}
            className="inline-flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generar Encuesta IA
              </>
            )}
          </Button>
          {onRefresh && (
            <Button variant="secondary" size="sm" onClick={onRefresh} className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>
          )}
        </div>
      </header>

      <Tabs
        items={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        variant="pills"
        size="sm"
        className="mb-6"
      />

      {activeTab === 'surveys' && (
        <div className="space-y-4">
          {filteredSurveys.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No hay encuestas disponibles
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Genera una encuesta IA adaptada para comenzar a recibir feedback accionable.
              </p>
              <Button variant="primary" onClick={handleGenerateSurvey} className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Generar Encuesta IA
              </Button>
            </div>
          ) : (
            filteredSurveys.map((survey) => (
              <div
                key={survey.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        {EXPERIENCE_TYPE_ICONS[survey.experienceType]}
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{survey.name}</h4>
                      <Badge size="sm" className={STATUS_COLORS[survey.status]}>
                        {STATUS_LABELS[survey.status]}
                      </Badge>
                      <Badge size="sm" variant="blue">
                        {ADAPTATION_LEVEL_LABELS[survey.adaptationLevel]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{survey.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Tipo:</span>
                        <span>{EXPERIENCE_TYPE_LABELS[survey.experienceType]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Creada: {formatDate(survey.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Preguntas:</span>
                        <span>{survey.questions.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsViewingSurvey(survey)}
                      className="inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                    {survey.status === 'draft' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSendSurvey(survey.id)}
                        className="inline-flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
                {survey.personalization.adaptedToClient && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Personalización IA</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {survey.personalization.adaptedToClient.clientName && (
                        <Badge size="sm" variant="blue">
                          Cliente: {survey.personalization.adaptedToClient.clientName}
                        </Badge>
                      )}
                      {survey.personalization.adaptedToClient.clientSegment && (
                        <Badge size="sm" variant="green">
                          Segmento: {survey.personalization.adaptedToClient.clientSegment}
                        </Badge>
                      )}
                      {survey.aiMetadata.expectedResponseRate && (
                        <Badge size="sm" variant="purple">
                          Tasa esperada: {formatPercentage(survey.aiMetadata.expectedResponseRate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Copy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No hay plantillas disponibles
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Las plantillas de encuestas se crearán automáticamente para cada tipo de experiencia.
              </p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        {EXPERIENCE_TYPE_ICONS[template.experienceType]}
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{template.name}</h4>
                      {template.isActive && (
                        <Badge size="sm" variant="green">
                          Activa
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{template.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Tipo:</span>
                        <span>{EXPERIENCE_TYPE_LABELS[template.experienceType]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Preguntas:</span>
                        <span>{template.baseQuestions.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Delay: {template.defaultConfig.delayHours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Canal:</span>
                        <span>{template.defaultConfig.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsViewingTemplate(template)}
                      className="inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                    <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-4">
          {stats.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No hay estadísticas disponibles
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Las estadísticas se generarán cuando se envíen y reciban respuestas de las encuestas.
              </p>
            </div>
          ) : (
            stats.map((stat) => (
              <div
                key={stat.surveyId}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        {EXPERIENCE_TYPE_ICONS[stat.experienceType]}
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {stat.surveyName}
                      </h4>
                      <Badge size="sm" variant="blue">
                        {EXPERIENCE_TYPE_LABELS[stat.experienceType]}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Enviadas</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stat.totalSent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Respuestas</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {stat.totalResponses}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tasa de Respuesta</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercentage(stat.responseRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Feedback Accionable</p>
                        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatPercentage(stat.actionableFeedbackRate)}
                        </p>
                      </div>
                    </div>
                    {stat.averageSatisfaction && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Satisfacción Promedio</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < Math.round(stat.averageSatisfaction!)
                                    ? 'text-yellow-400'
                                    : 'text-slate-300 dark:text-slate-700'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {stat.averageSatisfaction.toFixed(1)}/5.0
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {stat.topInsights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Insights Clave</p>
                    <ul className="space-y-1">
                      {stat.topInsights.slice(0, 3).map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal para ver encuesta */}
      <Modal
        isOpen={isViewingSurvey !== null}
        onClose={() => setIsViewingSurvey(null)}
        title={isViewingSurvey?.name || 'Ver Encuesta'}
        size="lg"
      >
        {isViewingSurvey && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Descripción</p>
              <p className="text-base text-slate-900 dark:text-slate-100">{isViewingSurvey.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Preguntas</p>
              <div className="space-y-4">
                {isViewingSurvey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {index + 1}. {question.question}
                      </p>
                      <Badge size="sm" variant="blue">
                        {QUESTION_TYPE_LABELS[question.type]}
                      </Badge>
                    </div>
                    {question.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{question.description}</p>
                    )}
                    {question.aiReasoning && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          Razón IA:
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{question.aiReasoning}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isViewingSurvey.aiMetadata.adaptationReasons.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Razones de Adaptación IA</p>
                <ul className="space-y-2">
                  {isViewingSurvey.aiMetadata.adaptationReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal para ver plantilla */}
      <Modal
        isOpen={isViewingTemplate !== null}
        onClose={() => setIsViewingTemplate(null)}
        title={isViewingTemplate?.name || 'Ver Plantilla'}
        size="lg"
      >
        {isViewingTemplate && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Descripción</p>
              <p className="text-base text-slate-900 dark:text-slate-100">{isViewingTemplate.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Preguntas Base</p>
              <div className="space-y-4">
                {isViewingTemplate.baseQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {index + 1}. {question.question}
                      </p>
                      <Badge size="sm" variant="blue">
                        {QUESTION_TYPE_LABELS[question.type]}
                      </Badge>
                    </div>
                    {question.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{question.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Delay</p>
                <p className="text-base text-slate-900 dark:text-slate-100">
                  {isViewingTemplate.defaultConfig.delayHours} horas
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Canal</p>
                <p className="text-base text-slate-900 dark:text-slate-100">
                  {isViewingTemplate.defaultConfig.channel}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

