import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Target,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelPerformanceAnalysis,
  FunnelBottleneck,
  FunnelStageMetrics,
  BottleneckSeverity,
  FunnelsAcquisitionPeriod,
  TrendDirection,
} from '../types';

interface FunnelPerformanceProps {
  funnelId: string;
  period?: FunnelsAcquisitionPeriod;
  className?: string;
}

const severityColors = {
  critical: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  high: 'bg-orange-50 border-orange-500 text-orange-900 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
  medium: 'bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
  low: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  none: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
};

const severityLabels = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
  none: 'Sin problemas',
};

const stageTypeLabels = {
  visitas: 'Visitas',
  formulario: 'Formulario',
  cierre: 'Cierre',
  consulta: 'Consulta',
  primera_sesion: 'Primera Sesión',
  conversion: 'Conversión',
};

const actionTypeLabels = {
  improve_offer: 'Mejorar oferta',
  nurture_leads: 'Nurture leads',
  optimize_form: 'Optimizar formulario',
  adjust_timing: 'Ajustar timing',
  improve_copy: 'Mejorar copy',
  add_urgency: 'Añadir urgencia',
  simplify_process: 'Simplificar proceso',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const FunnelPerformance: React.FC<FunnelPerformanceProps> = ({
  funnelId,
  period = '30d',
  className = '',
}) => {
  const [analysis, setAnalysis] = useState<FunnelPerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FunnelsAdquisicionService.getFunnelPerformanceAnalysisData(funnelId, period);
      setAnalysis(data);
    } catch (error) {
      console.error('[FunnelPerformance] Error cargando análisis:', error);
    } finally {
      setLoading(false);
    }
  }, [funnelId, period]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No se pudo cargar el análisis
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Intenta recargar la página
          </p>
        </div>
      </Card>
    );
  }

  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Análisis de Cuellos de Botella
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-slate-400">Health Score</p>
            <p className={`text-2xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
              {analysis.healthScore}
            </p>
          </div>
          {analysis.topBottleneck && (
            <Badge
              variant={analysis.topBottleneck.severity === 'critical' ? 'error' : 'warning'}
              size="md"
            >
              {severityLabels[analysis.topBottleneck.severity]}
            </Badge>
          )}
        </div>
      </div>

      {/* Resumen del funnel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-slate-400">Total Visitantes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {analysis.totalVisitors.toLocaleString('es-ES')}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-slate-400">Conversiones</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {analysis.totalConversions.toLocaleString('es-ES')}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-slate-400">Tasa de Conversión</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {analysis.overallConversionRate.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-slate-400">Cuellos de Botella</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {analysis.bottlenecks.length}
          </p>
        </div>
      </div>

      {/* Visualización del funnel */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Etapas del Funnel
        </h3>
        <div className="space-y-3">
          {analysis.stages.map((stage, index) => (
            <StageCard key={stage.stageId} stage={stage} isLast={index === analysis.stages.length - 1} />
          ))}
        </div>
      </div>

      {/* Cuellos de botella */}
      {analysis.bottlenecks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
            Cuellos de Botella Detectados
          </h3>
          <div className="space-y-4">
            {analysis.bottlenecks.map((bottleneck) => (
              <BottleneckCard key={bottleneck.id} bottleneck={bottleneck} />
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {analysis.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Recomendaciones IA
            </h3>
          </div>
          <div className="space-y-3">
            {analysis.recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

interface StageCardProps {
  stage: FunnelStageMetrics;
  isLast: boolean;
}

const StageCard: React.FC<StageCardProps> = ({ stage, isLast }) => {
  const getStageIcon = (stageType: string) => {
    switch (stageType) {
      case 'visitas':
        return <Users className="w-4 h-4" />;
      case 'formulario':
        return <FileText className="w-4 h-4" />;
      case 'cierre':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'consulta':
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: BottleneckSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60';
    }
  };

  return (
    <div className="relative">
      <div
        className={`rounded-lg border-2 p-4 ${getSeverityColor(stage.severity)} ${
          stage.severity !== 'none' ? 'shadow-md' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
              {getStageIcon(stage.stageType)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100">{stage.stageName}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {stageTypeLabels[stage.stageType]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-slate-400">Conversión</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {stage.conversionRate.toFixed(1)}%
              </p>
            </div>
            {stage.severity !== 'none' && (
              <Badge
                variant={stage.severity === 'critical' ? 'error' : 'warning'}
                size="sm"
              >
                {severityLabels[stage.severity]}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Visitantes</p>
            <p className="font-semibold text-gray-900 dark:text-slate-100">
              {stage.visitors.toLocaleString('es-ES')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Conversiones</p>
            <p className="font-semibold text-gray-900 dark:text-slate-100">
              {stage.conversions.toLocaleString('es-ES')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Abandono</p>
            <p className="font-semibold text-red-600 dark:text-red-400">
              {stage.dropoffRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${stage.conversionRate}%` }}
          ></div>
        </div>

        {stage.comparison && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            {getTrendIcon(stage.comparison.trendDirection)}
            <span>
              {stage.comparison.trendDirection === 'up' ? '+' : ''}
              {stage.comparison.conversionRateChangePercentage.toFixed(1)}% vs período anterior
            </span>
          </div>
        )}
      </div>

      {!isLast && (
        <div className="flex justify-center my-2">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  );
};

interface BottleneckCardProps {
  bottleneck: FunnelBottleneck;
}

const BottleneckCard: React.FC<BottleneckCardProps> = ({ bottleneck }) => {
  return (
    <div
      className={`rounded-xl border-2 p-5 ${severityColors[bottleneck.severity]} shadow-md`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="text-lg font-semibold">{bottleneck.stageName}</h4>
            <Badge
              variant={bottleneck.severity === 'critical' ? 'error' : 'warning'}
              size="sm"
            >
              {severityLabels[bottleneck.severity]}
            </Badge>
          </div>
          <p className="text-sm font-medium mb-2">{bottleneck.problem}</p>
          <p className="text-sm opacity-90 mb-3">{bottleneck.impact}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs opacity-75">Leads afectados</p>
              <p className="font-semibold">{bottleneck.affectedLeads}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Pérdida potencial</p>
              <p className="font-semibold">{bottleneck.potentialLoss} leads</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Revenue potencial</p>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(bottleneck.potentialRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      {bottleneck.aiRecommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" />
            <h5 className="text-sm font-semibold">Recomendaciones IA</h5>
          </div>
          <div className="space-y-3">
            {bottleneck.aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-current/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h6 className="font-medium text-sm mb-1">{rec.title}</h6>
                    <p className="text-xs opacity-80 mb-2">{rec.description}</p>
                    {rec.estimatedLift && (
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">
                        Mejora esperada: +{rec.estimatedLift}%
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'secondary'}
                    size="sm"
                  >
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                </div>
                {rec.steps && rec.steps.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Pasos:</p>
                    <ul className="text-xs space-y-1 opacity-80">
                      {rec.steps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="mt-2 text-xs">
                  Ver detalles
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedLift?: number;
    actionType: string;
  };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h5 className="font-medium text-gray-900 dark:text-slate-100">{recommendation.title}</h5>
            <Badge
              variant={recommendation.priority === 'high' ? 'error' : recommendation.priority === 'medium' ? 'warning' : 'secondary'}
              size="sm"
            >
              {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
            {recommendation.description}
          </p>
          {recommendation.estimatedLift && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Impacto esperado: +{recommendation.estimatedLift}%
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm">
          Aplicar
        </Button>
      </div>
    </div>
  );
};

