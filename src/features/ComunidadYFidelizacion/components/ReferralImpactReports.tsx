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
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Select, Modal } from '../../../components/componentsreutilizables';
import { ReferralROIReport, ReferralImpactPeriod, FunnelStage, CustomerSegmentType } from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';

interface ReferralImpactReportsProps {
  report?: ReferralROIReport;
  loading?: boolean;
  onGenerateReport?: (period: ReferralImpactPeriod) => void;
  onRefresh?: () => void;
}

const PERIOD_OPTIONS: { value: ReferralImpactPeriod; label: string }[] = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '12m', label: 'Últimos 12 meses' },
];

const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  awareness: 'Conciencia',
  interest: 'Interés',
  consideration: 'Consideración',
  conversion: 'Conversión',
  retention: 'Retención',
};

const SEGMENT_TYPE_LABELS: Record<CustomerSegmentType, string> = {
  embajador: 'Embajador',
  nuevo: 'Nuevo',
  riesgo: 'Riesgo',
  regular: 'Regular',
  vip: 'VIP',
};

export function ReferralImpactReports({
  report,
  loading = false,
  onGenerateReport,
  onRefresh,
}: ReferralImpactReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReferralImpactPeriod>('30d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewingInsights, setIsViewingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState<'revenue' | 'funnel' | 'segments' | 'insights'>('revenue');

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

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await CommunityFidelizacionService.generateReferralROIReport(selectedPeriod);
      if (onGenerateReport) {
        onGenerateReport(selectedPeriod);
      }
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
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

  if (!report) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Reportes IA de Impacto de Referidos
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Genera reportes IA que muestren el impacto de referidos en ingresos y funnel para ver el ROI real.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value as ReferralImpactPeriod)}
              options={PERIOD_OPTIONS}
              className="w-48"
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
                  Generar reporte IA
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'revenue', label: 'Ingresos', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'funnel', label: 'Funnel', icon: <Target className="w-4 h-4" /> },
    { id: 'segments', label: 'Segmentos', icon: <Users className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights IA', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Reportes IA de Impacto de Referidos
            </h3>
            <Badge variant="blue" size="sm">
              ROI: {report.revenueImpact.returnOnInvestment}%
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Reporte generado el {new Date(report.generatedAt).toLocaleDateString('es-ES')} • Periodo: {PERIOD_OPTIONS.find(p => p.value === report.period)?.label}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedPeriod}
            onChange={(value) => setSelectedPeriod(value as ReferralImpactPeriod)}
            options={PERIOD_OPTIONS}
            className="w-40"
            size="sm"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
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

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {getTrendIcon(report.revenueImpact.trendDirection)}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(report.revenueImpact.referralRevenue)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ingresos por Referidos</p>
              {report.revenueImpact.changePercentage && (
                <p className={`text-xs font-medium mt-2 ${getTrendColor(report.revenueImpact.trendDirection)}`}>
                  {formatPercentage(report.revenueImpact.changePercentage)} vs periodo anterior
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {report.revenueImpact.referralRevenuePercentage}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">% del Total de Ingresos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Total: {formatCurrency(report.revenueImpact.totalRevenue)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {report.revenueImpact.returnOnInvestment}%
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ROI</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Costo por referido: {formatCurrency(report.revenueImpact.costPerReferral)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(report.revenueImpact.lifetimeValue)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">LTV Promedio</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Por referido: {formatCurrency(report.revenueImpact.averageRevenuePerReferral)}
              </p>
            </div>
          </div>

          {report.comparison && (
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Comparación con Periodo Anterior
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cambio en Ingresos</p>
                  <p className={`text-lg font-semibold ${getTrendColor('up')}`}>
                    {formatPercentage(report.comparison.revenueChange)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cambio en Tasa de Conversión</p>
                  <p className={`text-lg font-semibold ${getTrendColor('up')}`}>
                    {formatPercentage(report.comparison.conversionRateChange)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cambio en ROI</p>
                  <p className={`text-lg font-semibold ${getTrendColor('up')}`}>
                    {formatPercentage(report.comparison.roiChange)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="space-y-4">
          {report.funnelMetrics.map((metric, index) => (
            <div
              key={metric.stage}
              className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {FUNNEL_STAGE_LABELS[metric.stage]}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Referidos</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{metric.referrals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Conversiones</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{metric.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tasa de Conversión</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {metric.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ingresos</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(metric.revenue)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trendDirection)}
                  {metric.changePercentage && (
                    <span className={`text-sm font-medium ${getTrendColor(metric.trendDirection)}`}>
                      {formatPercentage(metric.changePercentage)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Tiempo promedio: {metric.timeToConvert.toFixed(1)} días</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>AOV: {formatCurrency(metric.averageOrderValue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.segmentImpact.map((segment) => (
            <div
              key={segment.segmentType}
              className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {SEGMENT_TYPE_LABELS[segment.segmentType]}
                </h4>
                <Badge variant="green" size="sm">
                  ROI: {segment.roi}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Referidos</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {segment.referralsCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Conversiones</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {segment.conversionsCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tasa de Conversión</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {segment.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ingresos</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(segment.revenue)}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">AOV Promedio</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(segment.averageOrderValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 p-5">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Hallazgos Clave
            </h4>
            <ul className="space-y-2">
              {report.aiInsights.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-blue-50 dark:bg-blue-900/20 p-5">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recomendaciones IA
            </h4>
            <ul className="space-y-2">
              {report.aiInsights.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">→</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-amber-50 dark:bg-amber-900/20 p-5">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Oportunidades de Mejora
            </h4>
            <ul className="space-y-2">
              {report.aiInsights.improvementOpportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">⚡</span>
                  <span>{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>

          {report.aiInsights.predictedROI && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-5">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ROI Proyectado
              </h4>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {report.aiInsights.predictedROI}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Proyección para el próximo periodo basada en tendencias actuales
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

