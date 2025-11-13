import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Sparkles,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Percent,
  Clock,
  Award,
  Activity,
  TrendingDown as TrendingDownIcon,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Select, Modal } from '../../../components/componentsreutilizables';
import {
  CommunityActivityCorrelationReport,
  CommunityActivityType,
  ActivityStatus,
  ActivityCorrelation,
} from '../types';

interface CommunityActivityCorrelationProps {
  report?: CommunityActivityCorrelationReport;
  loading?: boolean;
  onGenerateReport?: (period: '30d' | '90d' | '12m') => void;
  onRefresh?: () => void;
}

const PERIOD_OPTIONS: { value: '30d' | '90d' | '12m'; label: string }[] = [
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '12m', label: 'Últimos 12 meses' },
];

const ACTIVITY_TYPE_LABELS: Record<CommunityActivityType, string> = {
  programa: 'Programa',
  evento: 'Evento',
  reto: 'Reto',
  workshop: 'Workshop',
  webinar: 'Webinar',
  competencia: 'Competencia',
  networking: 'Networking',
  celebracion: 'Celebración',
};

const STATUS_LABELS: Record<ActivityStatus, string> = {
  activo: 'Activo',
  completado: 'Completado',
  planificado: 'Planificado',
  cancelado: 'Cancelado',
};

const RECOMMENDATION_LABELS: Record<'increase' | 'maintain' | 'reduce' | 'discontinue', string> = {
  increase: 'Aumentar inversión',
  maintain: 'Mantener inversión',
  reduce: 'Reducir inversión',
  discontinue: 'Descontinuar',
};

const RECOMMENDATION_COLORS: Record<'increase' | 'maintain' | 'reduce' | 'discontinue', string> = {
  increase: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  maintain: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
  reduce: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
  discontinue: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200',
};

export function CommunityActivityCorrelation({
  report,
  loading = false,
  onGenerateReport,
  onRefresh,
}: CommunityActivityCorrelationProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '12m'>('30d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewingInsights, setIsViewingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'insights'>('overview');
  const [selectedActivity, setSelectedActivity] = useState<ActivityCorrelation | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'steady') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'steady') => {
    switch (direction) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-rose-600 dark:text-rose-400';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-emerald-600 dark:text-emerald-400';
    if (roi >= 100) return 'text-blue-600 dark:text-blue-400';
    if (roi >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const handleGenerateReport = async () => {
    if (!onGenerateReport) return;
    setIsGenerating(true);
    try {
      await onGenerateReport(selectedPeriod);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!report && !loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
            <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Correlación de Actividades de Comunidad
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Analiza la correlación entre actividades de comunidad, retención e ingresos para justificar inversión.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '30d' | '90d' | '12m')}
              options={PERIOD_OPTIONS}
              className="min-w-[180px]"
            />
            <Button
              variant="primary"
              onClick={handleGenerateReport}
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
                  <Sparkles className="w-4 h-4" />
                  Generar Reporte
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-8 w-8 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Generando reporte de correlación...</p>
        </div>
      </Card>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Correlación de Actividades de Comunidad
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Analiza la correlación entre actividades de comunidad, retención e ingresos para justificar inversión.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '30d' | '90d' | '12m')}
              options={PERIOD_OPTIONS}
              className="min-w-[180px]"
            />
            <Button
              variant="secondary"
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsViewingInsights(!isViewingInsights)}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Insights IA
            </Button>
          </div>
        </div>

        <Tabs
          items={[
            { id: 'overview', label: 'Resumen' },
            { id: 'activities', label: 'Actividades' },
            { id: 'insights', label: 'Insights' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'activities' | 'insights')}
          variant="pills"
          size="sm"
          className="mb-6"
        />

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Resumen de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Actividades</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{report.summary.totalActivities}</p>
              </div>

              <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Inversión Total</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(report.summary.totalInvestment)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos Generados</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(report.summary.totalRevenueGenerated)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">ROI Promedio</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPercentage(report.summary.averageROI)}
                </p>
              </div>
            </div>

            {/* Top performer */}
            {report.summary.topPerformer && (
              <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-900 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mejor Actividad</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {report.summary.topPerformer.activity.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="green" size="sm">
                    Top Performer
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ROI</p>
                    <p className={`text-2xl font-bold ${getROIColor(report.summary.topPerformer.revenueImpact.roi)}`}>
                      {formatPercentage(report.summary.topPerformer.revenueImpact.roi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Retención</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPercentage(report.summary.topPerformer.retentionImpact.retentionLift)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ingresos</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(report.summary.topPerformer.revenueImpact.revenueAttributed)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Recomendación</p>
                  <Badge
                    variant="blue"
                    size="sm"
                    className={RECOMMENDATION_COLORS[report.summary.topPerformer.investmentJustification.recommendation]}
                  >
                    {RECOMMENDATION_LABELS[report.summary.topPerformer.investmentJustification.recommendation]}
                  </Badge>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {report.summary.topPerformer.investmentJustification.reasoning}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-4">
            {report.correlations.map((correlation) => (
              <div
                key={correlation.activity.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedActivity(correlation)}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {correlation.activity.name}
                      </h3>
                      <Badge variant="blue" size="sm">
                        {ACTIVITY_TYPE_LABELS[correlation.activity.type]}
                      </Badge>
                      <Badge
                        variant="blue"
                        size="sm"
                        className={
                          correlation.activity.status === 'completado'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200'
                            : correlation.activity.status === 'activo'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200'
                        }
                      >
                        {STATUS_LABELS[correlation.activity.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{correlation.activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ROI</p>
                    <p className={`text-2xl font-bold ${getROIColor(correlation.revenueImpact.roi)}`}>
                      {formatPercentage(correlation.revenueImpact.roi)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Inversión</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(correlation.activity.investment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Ingresos</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(correlation.revenueImpact.revenueAttributed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Retención</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(correlation.retentionImpact.retentionTrend)}
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {formatPercentage(correlation.retentionImpact.retentionLift)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Participantes</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {correlation.activity.participants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Recomendación</p>
                    <Badge
                      variant="blue"
                      size="sm"
                      className={RECOMMENDATION_COLORS[correlation.investmentJustification.recommendation]}
                    >
                      {RECOMMENDATION_LABELS[correlation.investmentJustification.recommendation]}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
                    Ver detalles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-slate-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Insights de IA</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Hallazgos Clave</h4>
                  <ul className="space-y-2">
                    {report.aiInsights.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Recomendaciones</h4>
                  <ul className="space-y-2">
                    {report.aiInsights.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Oportunidades</h4>
                  <ul className="space-y-2">
                    {report.aiInsights.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {report.aiInsights.risks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Riesgos</h4>
                    <ul className="space-y-2">
                      {report.aiInsights.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Recomendaciones de Inversión
              </h4>
              <div className="space-y-3">
                {report.aiInsights.investmentRecommendations.map((rec) => (
                  <div
                    key={rec.activityId}
                    className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {rec.activityName}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{rec.reasoning}</p>
                        {rec.suggestedInvestment && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Inversión sugerida: {formatCurrency(rec.suggestedInvestment)}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="blue"
                        size="sm"
                        className={RECOMMENDATION_COLORS[rec.recommendation]}
                      >
                        {RECOMMENDATION_LABELS[rec.recommendation]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modal de detalles de actividad */}
      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title={selectedActivity.activity.name}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Información de la Actividad</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Tipo</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {ACTIVITY_TYPE_LABELS[selectedActivity.activity.type]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Estado</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {STATUS_LABELS[selectedActivity.activity.status]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Inversión</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedActivity.activity.investment)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Participantes</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedActivity.activity.participants}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Impacto en Retención</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Tasa de Retención</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedActivity.retentionImpact.retentionRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Incremento en Retención</p>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatPercentage(selectedActivity.retentionImpact.retentionLift)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Participantes Retenidos</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedActivity.retentionImpact.participantsRetained} /{' '}
                    {selectedActivity.retentionImpact.totalParticipants}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Retención Baseline</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedActivity.retentionImpact.baselineRetention.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Impacto en Ingresos</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Ingresos Atribuidos</p>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedActivity.revenueImpact.revenueAttributed)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">ROI</p>
                  <p className={`font-medium ${getROIColor(selectedActivity.revenueImpact.roi)}`}>
                    {formatPercentage(selectedActivity.revenueImpact.roi)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">ARPU</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(selectedActivity.revenueImpact.averageRevenuePerParticipant)}
                  </p>
                </div>
                {selectedActivity.revenueImpact.paybackPeriod && (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Periodo de Recuperación</p>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedActivity.revenueImpact.paybackPeriod} días
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Justificación de Inversión</h4>
              <div className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recomendación</p>
                  <Badge
                    variant="blue"
                    size="sm"
                    className={RECOMMENDATION_COLORS[selectedActivity.investmentJustification.recommendation]}
                  >
                    {RECOMMENDATION_LABELS[selectedActivity.investmentJustification.recommendation]}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {selectedActivity.investmentJustification.reasoning}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Valor Total Generado</p>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedActivity.investmentJustification.totalValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Valor de Retención</p>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedActivity.investmentJustification.retentionValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Valor de Ingresos</p>
                    <p className="font-medium text-purple-600 dark:text-purple-400">
                      {formatCurrency(selectedActivity.investmentJustification.revenueValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
