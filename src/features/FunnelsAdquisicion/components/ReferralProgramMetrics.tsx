import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Lightbulb, UserCheck, UserCircle, Briefcase, Star } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ReferralProgramMetrics as ReferralProgramMetricsType, TrendDirection } from '../types';

interface ReferralProgramMetricsProps {
  metrics: ReferralProgramMetricsType;
  loading?: boolean;
  className?: string;
}

const trendIcons: Record<TrendDirection, React.ComponentType<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors: Record<TrendDirection, string> = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-600 dark:text-gray-400',
};

const impactColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const categoryLabels = {
  incentives: 'Incentivos',
  communication: 'Comunicación',
  tracking: 'Tracking',
  promotion: 'Promoción',
  optimization: 'Optimización',
};

const referrerTypeIcons = {
  cliente: UserCheck,
  colaborador: Briefcase,
  influencer: Star,
  otro: UserCircle,
};

const referrerTypeLabels = {
  cliente: 'Cliente',
  colaborador: 'Colaborador',
  influencer: 'Influencer',
  otro: 'Otro',
};

export const ReferralProgramMetricsComponent: React.FC<ReferralProgramMetricsProps> = ({
  metrics,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const currencyFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  const periodLabels = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
  };

  const TrendIcon = metrics.comparison ? trendIcons[metrics.comparison.trendDirection] : Minus;
  const trendColor = metrics.comparison ? trendColors[metrics.comparison.trendDirection] : '';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Programa de Referidos
        </h2>
        <Badge variant="blue" size="sm" className="ml-auto">
          {periodLabels[metrics.period]}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Referidos Totales
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {metrics.totalReferrals}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            {metrics.convertedReferrals} convertidos
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Tasa de Conversión
          </div>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {metrics.conversionRate}%
          </div>
          {metrics.comparison && (
            <div className="text-xs text-gray-500 dark:text-slate-500 mt-1 flex items-center gap-1">
              <TrendIcon className="w-3 h-3" />
              {metrics.comparison.conversionRateChangePercentage > 0 ? '+' : ''}
              {metrics.comparison.conversionRateChangePercentage.toFixed(1)}% vs período anterior
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            Ingresos Totales
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {currencyFormatter.format(metrics.totalRevenue)}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            {currencyFormatter.format(metrics.averageCustomerValue)} promedio
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Users className="w-4 h-4" />
            Participantes Activos
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {metrics.programPerformance.activeReferrers}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            de {metrics.programPerformance.totalParticipants} totales
          </div>
        </div>
      </div>

      {/* Métricas del programa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            Promedio Referidos por Persona
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
            {metrics.programPerformance.averageReferralsPerPerson.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            ROI del Programa
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {metrics.programPerformance.programROI.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            Valor Promedio Cliente Referido
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
            {currencyFormatter.format(metrics.averageCustomerValue)}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Top Referrers
        </h3>
        <div className="space-y-3">
          {metrics.topReferrers.map((referrer, index) => {
            const ReferrerIcon = referrerTypeIcons[referrer.referrerType];

            return (
              <div
                key={referrer.id}
                className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <ReferrerIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    {index === 0 && (
                      <div className="mt-1 text-center">
                        <Badge variant="yellow" size="sm">#1</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-semibold text-gray-900 dark:text-slate-100">
                        {referrer.referrerName}
                      </span>
                      <Badge variant="gray" size="sm">
                        {referrerTypeLabels[referrer.referrerType]}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">Referidos</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {referrer.totalReferrals} ({referrer.convertedReferrals} convertidos)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">Tasa Conversión</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {referrer.conversionRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">Ingresos</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {currencyFormatter.format(referrer.totalRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-500">Lifetime Value</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {currencyFormatter.format(referrer.lifetimeValue)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-500">
                      Primera referencia: {new Date(referrer.firstReferralDate).toLocaleDateString('es-ES')} | 
                      Última: {new Date(referrer.lastReferralDate).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sugerencias de mejora */}
      {metrics.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Sugerencias de Mejora
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <Badge className={impactColors[suggestion.impact]} size="sm">
                    {suggestion.impact === 'high' ? 'Alto' : suggestion.impact === 'medium' ? 'Medio' : 'Bajo'}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 dark:text-slate-100 mb-1">
                      {suggestion.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                      {suggestion.description}
                    </div>
                    <Badge variant="gray" size="sm">
                      {categoryLabels[suggestion.category]}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

