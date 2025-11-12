import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, Calendar, Euro } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { FirstSessionConversionMetric as FirstSessionConversionMetricType, TrendDirection } from '../types';

interface FirstSessionConversionMetricProps {
  metric: FirstSessionConversionMetricType;
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
  follow_up: 'Seguimiento',
  pricing: 'Precios',
  offer: 'Ofertas',
  timing: 'Timing',
  communication: 'Comunicación',
};

export const FirstSessionConversionMetricComponent: React.FC<FirstSessionConversionMetricProps> = ({
  metric,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
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

  const TrendIcon = metric.comparison ? trendIcons[metric.comparison.trendDirection] : Minus;
  const trendColor = metric.comparison ? trendColors[metric.comparison.trendDirection] : '';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Conversión Primera Sesión → Cliente
        </h2>
        <Badge variant="blue" size="sm" className="ml-auto">
          {periodLabels[metric.period]}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            Tasa de conversión total
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {metric.conversionRate}%
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500">
            {metric.totalConverted} de {metric.totalFirstSessions} primera sesiones
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            A planes recurrentes
          </div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {metric.conversionRateRecurring}%
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500">
            {metric.convertedToRecurring} clientes · {currencyFormatter.format(metric.averageValueRecurring)}/mes
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
            A bonos de sesiones
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {metric.conversionRateBonus}%
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500">
            {metric.convertedToBonus} clientes · {currencyFormatter.format(metric.averageValueBonus)} promedio
          </div>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Tiempo promedio de conversión
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {metric.averageDaysToConvert.toFixed(1)} días
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Revenue total generado
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {currencyFormatter.format(metric.totalRevenue)}
          </div>
        </div>
      </div>

      {/* Comparativa con período anterior */}
      {metric.comparison && (
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendIcon className={`w-5 h-5 ${trendColor}`} />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Comparativa con {periodLabels[metric.comparison.previousPeriod]}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                Cambio en tasa de conversión
              </div>
              <div className={`text-xl font-bold ${trendColor} flex items-center gap-1`}>
                {metric.comparison.conversionRateChange > 0 ? '+' : ''}
                {metric.comparison.conversionRateChange}% (
                {metric.comparison.conversionRateChangePercentage > 0 ? '+' : ''}
                {metric.comparison.conversionRateChangePercentage}%)
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                Cambio en conversiones totales
              </div>
              <div className={`text-xl font-bold ${trendColor} flex items-center gap-1`}>
                {metric.comparison.totalConvertedChange > 0 ? '+' : ''}
                {metric.comparison.totalConvertedChange} clientes (
                {metric.comparison.totalConvertedChangePercentage > 0 ? '+' : ''}
                {metric.comparison.totalConvertedChangePercentage}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sugerencias de mejora */}
      {metric.suggestions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">
              Sugerencias de mejora
            </h3>
          </div>
          <div className="space-y-3">
            {metric.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">
                        {suggestion.title}
                      </h4>
                      <Badge
                        variant={suggestion.impact === 'high' ? 'error' : suggestion.impact === 'medium' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {suggestion.impact === 'high' ? 'Alto impacto' : suggestion.impact === 'medium' ? 'Medio impacto' : 'Bajo impacto'}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        {categoryLabels[suggestion.category]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {suggestion.description}
                    </p>
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

