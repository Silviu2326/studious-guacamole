import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Tabs, TabItem } from '../../../components/componentsreutilizables';
import { QuarterlyPlan, QuarterlyPlanMilestone } from '../types';
import { getQuarterlyPlanService, generateQuarterlyPlanService, updateQuarterlyPlanService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import {
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Loader2,
  Map,
  Lightbulb,
  BarChart3,
} from 'lucide-react';

interface QuarterlyPlanSectionProps {
  trainerId?: string;
  quarter?: string;
}

export const QuarterlyPlanSection: React.FC<QuarterlyPlanSectionProps> = ({
  trainerId,
  quarter,
}) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<QuarterlyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'okrs' | 'milestones' | 'initiatives' | 'recommendations'>('overview');

  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId, quarter]);

  const loadPlan = async () => {
    setIsLoading(true);
    try {
      const response = await getQuarterlyPlanService({
        trainerId: trainerId || user?.id,
        quarter,
      });
      if (response.success && response.plan) {
        setPlan(response.plan);
      }
    } catch (error) {
      console.error('Error cargando plan trimestral', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const now = new Date();
      const currentQuarter = quarter || `Q${Math.floor(now.getMonth() / 3) + 1}-${now.getFullYear()}`;
      const response = await generateQuarterlyPlanService({
        trainerId: trainerId || user?.id,
        quarter: currentQuarter,
      });
      if (response.success && response.plan) {
        setPlan(response.plan);
      }
    } catch (error) {
      console.error('Error generando plan trimestral', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateMilestone = async (milestoneId: string, updates: Partial<QuarterlyPlanMilestone>) => {
    if (!plan) return;

    try {
      const response = await updateQuarterlyPlanService({
        planId: plan.id,
        updates: {
          milestones: [
            {
              id: milestoneId,
              ...updates,
            },
          ],
        },
      });
      if (response.success && response.plan) {
        setPlan(response.plan);
      }
    } catch (error) {
      console.error('Error actualizando milestone', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'blue';
      case 'at_risk':
        return 'yellow';
      case 'planned':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} />;
      case 'in_progress':
        return <Clock size={16} />;
      case 'at_risk':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const tabItems: TabItem[] = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 size={16} /> },
    { id: 'okrs', label: 'OKRs', icon: <Target size={16} /> },
    { id: 'milestones', label: 'Hitos', icon: <CheckCircle2 size={16} /> },
    { id: 'initiatives', label: 'Iniciativas', icon: <TrendingUp size={16} /> },
    { id: 'recommendations', label: 'Recomendaciones IA', icon: <Lightbulb size={16} /> },
  ];

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Cargando plan trimestral...</span>
        </div>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-indigo-100 text-indigo-600 inline-flex">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No hay plan trimestral configurado
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Genera un plan trimestral IA basado en tus OKRs y roadmap para alinear tu estrategia.
            </p>
            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              leftIcon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            >
              {isGenerating ? 'Generando plan...' : 'Generar plan trimestral IA'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{plan.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
        </div>
        <Badge variant="blue" size="lg">
          {plan.quarter}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Progreso General</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${plan.progress.overall}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-900">{plan.progress.overall}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">OKRs</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${plan.progress.okrs}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-900">{plan.progress.okrs}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Hitos</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${plan.progress.milestones}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-900">{plan.progress.milestones}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-2">Iniciativas</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${plan.progress.initiatives}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-900">{plan.progress.initiatives}%</span>
            </div>
          </div>
        </div>

        {/* Alignment Scores */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Alineación con OKRs</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${plan.alignment.okrAlignment}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-900">{plan.alignment.okrAlignment}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Alineación con Roadmap</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${plan.alignment.roadmapAlignment}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-900">{plan.alignment.roadmapAlignment}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Alineación Estratégica</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${plan.alignment.strategyAlignment}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-900">{plan.alignment.strategyAlignment}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        variant="pills"
        fullWidth
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Objetivos Estratégicos</h3>
              <div className="space-y-2">
                {plan.strategicObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target size={16} className="text-indigo-600" />
                    <span className="text-sm text-slate-700">{objective}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen de Roadmap</h3>
              <div className="space-y-3">
                {plan.roadmapItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Map size={16} className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">{item.title}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                      {item.status === 'planned' ? 'Planificado' :
                       item.status === 'in_progress' ? 'En progreso' :
                       item.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'okrs' && (
          <div className="space-y-4">
            {plan.okrs.map((okr) => (
              <Card key={okr.id} className="p-6 bg-white shadow-sm border border-slate-200/70">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{okr.objective}</h3>
                    <Badge variant={getStatusBadgeVariant(okr.status)} size="sm">
                      {okr.status === 'not_started' ? 'No iniciado' :
                       okr.status === 'in_progress' ? 'En progreso' :
                       okr.status === 'achieved' ? 'Logrado' :
                       okr.status === 'at_risk' ? 'En riesgo' : 'Fallido'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {okr.keyResults.map((kr) => (
                    <div key={kr.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{kr.description}</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {kr.current} / {kr.target} {kr.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${kr.progress}%` }} />
                    </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {plan.milestones.map((milestone) => (
              <Card key={milestone.id} className="p-6 bg-white shadow-sm border border-slate-200/70">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{milestone.title}</h3>
                      <Badge variant="secondary" size="sm">
                        Mes {milestone.month}
                        {milestone.week && ` - Semana ${milestone.week}`}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{milestone.description}</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(milestone.status)}
                      <Badge variant={getStatusBadgeVariant(milestone.status)} size="sm">
                        {milestone.status === 'planned' ? 'Planificado' :
                         milestone.status === 'in_progress' ? 'En progreso' :
                         milestone.status === 'completed' ? 'Completado' : 'En riesgo'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Entregables:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {milestone.deliverables.map((deliverable, index) => (
                        <li key={index} className="text-sm text-slate-600">{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Métricas de éxito:</p>
                    <div className="space-y-2">
                      {milestone.successMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{metric.metric}</span>
                          <span className="font-semibold text-slate-900">
                            {metric.target} {metric.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateMilestone(milestone.id, { status: 'in_progress' })}
                    disabled={milestone.status === 'completed'}
                  >
                    Iniciar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateMilestone(milestone.id, { status: 'completed' })}
                    disabled={milestone.status === 'completed'}
                  >
                    Completar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'initiatives' && (
          <div className="space-y-4">
            {plan.keyInitiatives.map((initiative) => (
              <Card key={initiative.id} className="p-6 bg-white shadow-sm border border-slate-200/70">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{initiative.name}</h3>
                      <Badge variant={initiative.priority === 'high' ? 'red' : initiative.priority === 'medium' ? 'yellow' : 'blue'} size="sm">
                        {initiative.priority === 'high' ? 'Alta' : initiative.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <Badge variant={initiative.expectedImpact === 'high' ? 'purple' : initiative.expectedImpact === 'medium' ? 'blue' : 'secondary'} size="sm">
                        Impacto {initiative.expectedImpact === 'high' ? 'Alto' : initiative.expectedImpact === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{initiative.description}</p>
                    {initiative.ownerName && (
                      <p className="text-sm text-slate-500 mb-2">
                        Dueño: <span className="font-medium">{initiative.ownerName}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Progreso</span>
                      <span className="text-sm font-semibold text-slate-900">{initiative.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${initiative.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(initiative.status)}
                    <Badge variant={getStatusBadgeVariant(initiative.status)} size="sm">
                      {initiative.status === 'planned' ? 'Planificada' :
                       initiative.status === 'in_progress' ? 'En progreso' :
                       initiative.status === 'completed' ? 'Completada' : 'En riesgo'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {plan.aiRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="p-6 bg-white shadow-sm border border-slate-200/70">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Lightbulb size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{recommendation.title}</h3>
                      <Badge variant={recommendation.priority === 'high' ? 'red' : recommendation.priority === 'medium' ? 'yellow' : 'blue'} size="sm">
                        {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        {recommendation.category === 'strategy' ? 'Estrategia' :
                         recommendation.category === 'timing' ? 'Timing' :
                         recommendation.category === 'resource' ? 'Recursos' : 'Riesgo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{recommendation.description}</p>
                    <p className="text-xs text-slate-500 italic mb-3">{recommendation.rationale}</p>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Acciones sugeridas:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {recommendation.suggestedActions.map((action, index) => (
                          <li key={index} className="text-sm text-slate-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuarterlyPlanSection;

