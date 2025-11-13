import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Sparkles,
  RefreshCw,
  Target,
  Users,
  Heart,
  MessageCircle,
  ArrowRight,
  Bell,
  AlertCircle,
  XCircle,
  Info,
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Select, Modal } from '../../../components/componentsreutilizables';
import {
  CommunityHealthRadar as CommunityHealthRadarType,
  HealthMetric,
  CommunityHealthAlert,
  HealthStatus,
  AlertPriority,
  HealthMetricType,
  CustomerSegmentType,
} from '../types';

interface CommunityHealthRadarProps {
  radar?: CommunityHealthRadarType;
  loading?: boolean;
  onRefresh?: () => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  onDismissAlert?: (alertId: string) => void;
}

const PERIOD_OPTIONS: { value: '30d' | '90d' | '12m'; label: string }[] = [
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '12m', label: 'Últimos 12 meses' },
];

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  excelente: 'Excelente',
  buena: 'Buena',
  regular: 'Regular',
  baja: 'Baja',
  critica: 'Crítica',
};

const HEALTH_STATUS_COLORS: Record<HealthStatus, string> = {
  excelente: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  buena: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
  regular: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
  baja: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-200',
  critica: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200',
};

const ALERT_PRIORITY_COLORS: Record<AlertPriority, string> = {
  critical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200 border-rose-200 dark:border-rose-800',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-200 border-orange-200 dark:border-orange-800',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200 border-amber-200 dark:border-amber-800',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800',
};

const METRIC_TYPE_LABELS: Record<HealthMetricType, string> = {
  engagement: 'Engagement',
  satisfaccion: 'Satisfacción',
  referidos: 'Referidos',
  retencion: 'Retención',
  advocacy: 'Advocacy',
  comunidad: 'Comunidad',
};

const METRIC_TYPE_ICONS: Record<HealthMetricType, React.ReactNode> = {
  engagement: <Activity className="w-4 h-4" />,
  satisfaccion: <Heart className="w-4 h-4" />,
  referidos: <Users className="w-4 h-4" />,
  retencion: <Target className="w-4 h-4" />,
  advocacy: <MessageCircle className="w-4 h-4" />,
  comunidad: <Users className="w-4 h-4" />,
};

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  if (score >= 20) return 'text-orange-600 dark:text-orange-400';
  return 'text-rose-600 dark:text-rose-400';
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

const getStatusIcon = (status: HealthStatus) => {
  switch (status) {
    case 'excelente':
      return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    case 'buena':
      return <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    case 'regular':
      return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    case 'baja':
      return <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
    case 'critica':
      return <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
  }
};

export function CommunityHealthRadar({
  radar,
  loading = false,
  onRefresh,
  onAcknowledgeAlert,
  onResolveAlert,
  onDismissAlert,
}: CommunityHealthRadarProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'alerts' | 'insights'>('overview');
  const [selectedAlert, setSelectedAlert] = useState<CommunityHealthAlert | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);

  const activeAlerts = useMemo(() => {
    return radar?.alerts.filter((alert) => alert.status === 'active') || [];
  }, [radar]);

  const criticalAlerts = useMemo(() => {
    return activeAlerts.filter((alert) => alert.priority === 'critical');
  }, [activeAlerts]);

  if (!radar && !loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
            <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Radar IA de Salud Comunitaria
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Monitorea engagement, satisfacción y referidos para actuar proactivamente.
            </p>
          </div>
          {onRefresh && (
            <Button variant="primary" onClick={onRefresh} className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Generar Radar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-8 w-8 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Generando radar de salud comunitaria...</p>
        </div>
      </Card>
    );
  }

  if (!radar) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Radar IA de Salud Comunitaria
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitorea engagement, satisfacción y referidos para actuar proactivamente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onRefresh && (
              <Button
                variant="secondary"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            )}
          </div>
        </div>

        {/* Score general de salud */}
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
                {getStatusIcon(radar.healthStatus)}
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Salud General de la Comunidad</p>
                <div className="flex items-center gap-3">
                  <p className={`text-4xl font-bold ${getHealthScoreColor(radar.overallHealthScore)}`}>
                    {radar.overallHealthScore}
                  </p>
                  <Badge variant="blue" size="sm" className={HEALTH_STATUS_COLORS[radar.healthStatus]}>
                    {HEALTH_STATUS_LABELS[radar.healthStatus]}
                  </Badge>
                </div>
                {radar.previousHealthScore !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    {getTrendIcon(radar.healthTrend)}
                    <span
                      className={`text-sm font-medium ${
                        radar.healthTrend === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : radar.healthTrend === 'down'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {radar.previousHealthScore} → {radar.overallHealthScore} (
                      {radar.overallHealthScore - radar.previousHealthScore > 0 ? '+' : ''}
                      {radar.overallHealthScore - radar.previousHealthScore})
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              {criticalAlerts.length > 0 && (
                <div className="mb-2">
                  <Badge variant="red" size="sm" className="bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
                    {criticalAlerts.length} {criticalAlerts.length === 1 ? 'Alerta Crítica' : 'Alertas Críticas'}
                  </Badge>
                </div>
              )}
              {activeAlerts.length > 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activeAlerts.length} {activeAlerts.length === 1 ? 'alerta activa' : 'alertas activas'}
                </p>
              )}
            </div>
          </div>
        </div>

        <Tabs
          items={[
            { id: 'overview', label: 'Resumen' },
            { id: 'metrics', label: 'Métricas' },
            { id: 'alerts', label: `Alertas ${activeAlerts.length > 0 ? `(${activeAlerts.length})` : ''}` },
            { id: 'insights', label: 'Insights IA' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'metrics' | 'alerts' | 'insights')}
          variant="pills"
          size="sm"
          className="mb-6"
        />

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {radar.metrics.slice(0, 6).map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedMetric(metric)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          metric.status === 'excelente' || metric.status === 'buena'
                            ? 'bg-emerald-100 dark:bg-emerald-900/20'
                            : metric.status === 'regular'
                              ? 'bg-amber-100 dark:bg-amber-900/20'
                              : 'bg-rose-100 dark:bg-rose-900/20'
                        }`}
                      >
                        <div
                          className={
                            metric.status === 'excelente' || metric.status === 'buena'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : metric.status === 'regular'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {METRIC_TYPE_ICONS[metric.type]}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {METRIC_TYPE_LABELS[metric.type]}
                      </span>
                    </div>
                    <Badge variant="blue" size="sm" className={HEALTH_STATUS_COLORS[metric.status]}>
                      {HEALTH_STATUS_LABELS[metric.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-3xl font-bold ${getHealthScoreColor(metric.value)}`}>{metric.value}</p>
                    {metric.previousValue !== undefined && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span
                          className={`text-sm font-medium ${
                            metric.trend === 'up'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : metric.trend === 'down'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {metric.changePercentage !== undefined
                            ? `${metric.changePercentage > 0 ? '+' : ''}${metric.changePercentage.toFixed(1)}%`
                            : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {metric.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{metric.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Alertas críticas */}
            {criticalAlerts.length > 0 && (
              <div className="rounded-xl border border-rose-200/60 dark:border-rose-800/60 bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/10 dark:to-slate-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Alertas Críticas ({criticalAlerts.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {criticalAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>{METRIC_TYPE_LABELS[alert.metric]}</span>
                            <span>
                              {alert.currentValue} ({alert.changePercentage > 0 ? '+' : ''}
                              {alert.changePercentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <Badge variant="red" size="sm">
                          Crítica
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {criticalAlerts.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setActiveTab('alerts')}
                  >
                    Ver todas las alertas ({activeAlerts.length})
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            {radar.metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        metric.status === 'excelente' || metric.status === 'buena'
                          ? 'bg-emerald-100 dark:bg-emerald-900/20'
                          : metric.status === 'regular'
                            ? 'bg-amber-100 dark:bg-amber-900/20'
                            : 'bg-rose-100 dark:bg-rose-900/20'
                      }`}
                    >
                      <div
                        className={
                          metric.status === 'excelente' || metric.status === 'buena'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : metric.status === 'regular'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {METRIC_TYPE_ICONS[metric.type]}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {METRIC_TYPE_LABELS[metric.type]}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</p>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm" className={HEALTH_STATUS_COLORS[metric.status]}>
                    {HEALTH_STATUS_LABELS[metric.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Valor Actual</p>
                    <p className={`text-3xl font-bold ${getHealthScoreColor(metric.value)}`}>{metric.value}</p>
                  </div>
                  {metric.previousValue !== undefined && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Valor Anterior</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {metric.previousValue}
                      </p>
                    </div>
                  )}
                  {metric.target && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Objetivo</p>
                      <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{metric.target}</p>
                    </div>
                  )}
                  {metric.previousValue !== undefined && (
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span
                        className={`text-lg font-semibold ${
                          metric.trend === 'up'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : metric.trend === 'down'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {metric.changePercentage !== undefined
                          ? `${metric.changePercentage > 0 ? '+' : ''}${metric.changePercentage.toFixed(1)}%`
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
                {metric.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{metric.description}</p>
                )}
                {metric.threshold && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Crítico</p>
                      <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                        {'<'}{metric.threshold.critical}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Advertencia</p>
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {'<'}{metric.threshold.warning}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Bueno</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {'>='}{metric.threshold.good}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No hay alertas activas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Todas las métricas están dentro de los rangos esperados.
                </p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl border ${ALERT_PRIORITY_COLORS[alert.priority]} bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle
                          className={`w-5 h-5 ${
                            alert.priority === 'critical'
                              ? 'text-rose-600 dark:text-rose-400'
                              : alert.priority === 'high'
                                ? 'text-orange-600 dark:text-orange-400'
                                : alert.priority === 'medium'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{alert.title}</h3>
                        <Badge
                          variant={alert.priority === 'critical' ? 'red' : 'blue'}
                          size="sm"
                          className={ALERT_PRIORITY_COLORS[alert.priority]}
                        >
                          {alert.priority === 'critical'
                            ? 'Crítica'
                            : alert.priority === 'high'
                              ? 'Alta'
                              : alert.priority === 'medium'
                                ? 'Media'
                                : 'Baja'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{alert.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 mb-1">Métrica</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {METRIC_TYPE_LABELS[alert.metric]}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Actual</p>
                          <p className="font-semibold text-rose-600 dark:text-rose-400">{alert.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Anterior</p>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{alert.previousValue}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 mb-1">Cambio</p>
                          <p className="font-semibold text-rose-600 dark:text-rose-400">
                            {alert.changePercentage > 0 ? '+' : ''}
                            {alert.changePercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {alert.aiRecommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Recomendaciones IA
                      </p>
                      <div className="space-y-2">
                        {alert.aiRecommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                            <span>{rec.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAcknowledgeAlert) onAcknowledgeAlert(alert.id);
                      }}
                    >
                      Reconocer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onResolveAlert) onResolveAlert(alert.id);
                      }}
                    >
                      Resolver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDismissAlert) onDismissAlert(alert.id);
                      }}
                    >
                      Descartar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-slate-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Análisis IA</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{radar.aiAnalysis.overallAssessment}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Fortalezas</h4>
                  <ul className="space-y-2">
                    {radar.aiAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Debilidades</h4>
                  <ul className="space-y-2">
                    {radar.aiAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Recomendaciones</h4>
              <div className="space-y-3">
                {radar.aiAnalysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rec.action}</h5>
                      <Badge
                        variant={rec.priority === 'critical' ? 'red' : 'blue'}
                        size="sm"
                        className={ALERT_PRIORITY_COLORS[rec.priority]}
                      >
                        {rec.priority === 'critical'
                          ? 'Crítica'
                          : rec.priority === 'high'
                            ? 'Alta'
                            : rec.priority === 'medium'
                              ? 'Media'
                              : 'Baja'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{rec.rationale}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>Impacto: {rec.expectedImpact}</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {radar.aiAnalysis.predictiveInsights && radar.aiAnalysis.predictiveInsights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Insights Predictivos</h4>
                <div className="space-y-3">
                  {radar.aiAnalysis.predictiveInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-blue-200/60 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/10 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {METRIC_TYPE_LABELS[insight.metric]}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{insight.prediction}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>Confianza: {insight.confidence}%</span>
                            <span>Periodo: {insight.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal de detalles de alerta */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={selectedAlert.title}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{selectedAlert.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Métrica</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {METRIC_TYPE_LABELS[selectedAlert.metric]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Prioridad</p>
                  <Badge
                    variant={selectedAlert.priority === 'critical' ? 'red' : 'blue'}
                    size="sm"
                    className={ALERT_PRIORITY_COLORS[selectedAlert.priority]}
                  >
                    {selectedAlert.priority === 'critical'
                      ? 'Crítica'
                      : selectedAlert.priority === 'high'
                        ? 'Alta'
                        : selectedAlert.priority === 'medium'
                          ? 'Media'
                          : 'Baja'}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Actual</p>
                  <p className="font-semibold text-rose-600 dark:text-rose-400">{selectedAlert.currentValue}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Anterior</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedAlert.previousValue}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Cambio</p>
                  <p className="font-semibold text-rose-600 dark:text-rose-400">
                    {selectedAlert.changePercentage > 0 ? '+' : ''}
                    {selectedAlert.changePercentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Umbral</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedAlert.threshold}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Recomendaciones IA
              </h4>
              <div className="space-y-3">
                {selectedAlert.aiRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rec.action}</h5>
                      <Badge
                        variant={rec.expectedImpact === 'high' ? 'blue' : 'gray'}
                        size="sm"
                        className={
                          rec.expectedImpact === 'high'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200'
                            : rec.expectedImpact === 'medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-200'
                        }
                      >
                        {rec.expectedImpact === 'high'
                          ? 'Alto Impacto'
                          : rec.expectedImpact === 'medium'
                            ? 'Impacto Medio'
                            : 'Bajo Impacto'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{rec.rationale}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span>
                        Urgencia:{' '}
                        {rec.urgency === 'immediate'
                          ? 'Inmediata'
                          : rec.urgency === 'soon'
                            ? 'Pronto'
                            : 'Planificada'}
                      </span>
                    </div>
                    {rec.actionableSteps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          Pasos Accionables:
                        </p>
                        <ul className="space-y-1">
                          {rec.actionableSteps.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                            >
                              <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de detalles de métrica */}
      {selectedMetric && (
        <Modal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          title={METRIC_TYPE_LABELS[selectedMetric.type]}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{selectedMetric.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Actual</p>
                  <p className={`text-2xl font-bold ${getHealthScoreColor(selectedMetric.value)}`}>
                    {selectedMetric.value}
                  </p>
                </div>
                {selectedMetric.previousValue !== undefined && (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Valor Anterior</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {selectedMetric.previousValue}
                    </p>
                  </div>
                )}
                {selectedMetric.target && (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Objetivo</p>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{selectedMetric.target}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Estado</p>
                  <Badge variant="blue" size="sm" className={HEALTH_STATUS_COLORS[selectedMetric.status]}>
                    {HEALTH_STATUS_LABELS[selectedMetric.status]}
                  </Badge>
                </div>
                {selectedMetric.previousValue !== undefined && (
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Tendencia</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(selectedMetric.trend)}
                      <span
                        className={`text-lg font-semibold ${
                          selectedMetric.trend === 'up'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : selectedMetric.trend === 'down'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {selectedMetric.changePercentage !== undefined
                          ? `${selectedMetric.changePercentage > 0 ? '+' : ''}${selectedMetric.changePercentage.toFixed(1)}%`
                          : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedMetric.threshold && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Umbrales</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10 p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Crítico</p>
                    <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                      {'<'}{selectedMetric.threshold.critical}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Advertencia</p>
                    <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {'<'}{selectedMetric.threshold.warning}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Bueno</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {'>='}{selectedMetric.threshold.good}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
