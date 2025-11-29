import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ForecastSnapshot, CampaignForecast } from '../types';

interface ForecastLeadsIngresosProps {
  forecast: ForecastSnapshot | null;
  loading?: boolean;
  className?: string;
}

const trendIcon: Record<string, React.ReactNode> = {
  up: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  down: <TrendingDown className="w-4 h-4 text-red-500" />,
  neutral: <Minus className="w-4 h-4 text-gray-500" />,
};

const confidenceColor: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const capacityAdjustmentIcon: Record<string, React.ReactNode> = {
  increase: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  decrease: <TrendingDown className="w-4 h-4 text-red-500" />,
  maintain: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}K`;
  }
  return value.toString();
}

function formatPercentage(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export const ForecastLeadsIngresos: React.FC<ForecastLeadsIngresosProps> = ({
  forecast,
  loading = false,
  className = '',
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`forecast-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  if (loading && !forecast) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">{placeholders}</div>
      </Card>
    );
  }

  if (!forecast) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de forecast disponibles
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Forecast de Leads e Ingresos
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Predicción automatizada basada en tus campañas en curso para ajustar recursos y cupos.
          </p>
        </div>
        <Badge variant="blue" size="sm">
          {forecast.forecastPeriod}
        </Badge>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Leads Proyectados
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {formatNumber(forecast.totalForecastedLeads)}
            </span>
            <span className={`text-sm ${forecast.growthPercentage > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatPercentage(forecast.growthPercentage)}
            </span>
          </div>
          <p className={`text-xs mt-1 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Actual: {formatNumber(forecast.currentTotalLeads)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Ingresos Proyectados
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {formatCurrency(forecast.totalForecastedRevenue)}
            </span>
            <span className={`text-sm ${forecast.growthPercentage > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatPercentage(forecast.growthPercentage)}
            </span>
          </div>
          <p className={`text-xs mt-1 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Actual: {formatCurrency(forecast.currentTotalRevenue)}
          </p>
        </div>
      </div>

      {/* Recomendación de Recursos */}
      {forecast.resourceRecommendations && (
        <div className={`mb-6 p-4 rounded-lg border ${
          forecast.resourceRecommendations.capacityAdjustment === 'increase'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
            : forecast.resourceRecommendations.capacityAdjustment === 'decrease'
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-start gap-3">
            {capacityAdjustmentIcon[forecast.resourceRecommendations.capacityAdjustment]}
            <div className="flex-1">
              <h3 className={`${ds.typography.bodyMedium} font-semibold mb-1 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Recomendación de Recursos
              </h3>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {forecast.resourceRecommendations.message}
              </p>
              {forecast.resourceRecommendations.suggestedCapacity && (
                <p className={`text-sm mt-2 font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Cupos sugeridos: {forecast.resourceRecommendations.suggestedCapacity}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forecast por Campaña */}
      <div className="space-y-4 mb-6">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Forecast por Campaña
        </h3>
        {forecast.campaigns.map((campaign: CampaignForecast) => (
          <div
            key={campaign.campaignId}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className={`${ds.typography.bodyMedium} font-semibold mb-1 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {campaign.campaignName}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" size="sm">
                    {campaign.channel}
                  </Badge>
                  <Badge className={confidenceColor[campaign.confidence]} size="sm">
                    Confianza: {campaign.confidence === 'high' ? 'Alta' : campaign.confidence === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {trendIcon[campaign.trendDirection]}
                    <span className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {formatPercentage(campaign.growthRate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                  Leads Actuales
                </p>
                <p className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {formatNumber(campaign.currentLeads)}
                </p>
              </div>
              <div>
                <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                  Leads Proyectados
                </p>
                <p className={`${ds.typography.bodyMedium} font-semibold text-indigo-600 dark:text-indigo-300`}>
                  {formatNumber(campaign.forecastedLeads)}
                </p>
              </div>
              <div>
                <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                  Ingresos Actuales
                </p>
                <p className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {formatCurrency(campaign.currentRevenue)}
                </p>
              </div>
              <div>
                <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                  Ingresos Proyectados
                </p>
                <p className={`${ds.typography.bodyMedium} font-semibold text-emerald-600 dark:text-emerald-300`}>
                  {formatCurrency(campaign.forecastedRevenue)}
                </p>
              </div>
            </div>

            {campaign.recommendations && campaign.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-xs font-medium mb-2 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Recomendaciones:
                </p>
                <ul className="space-y-1">
                  {campaign.recommendations.map((rec, idx) => (
                    <li key={idx} className={`text-xs flex items-start gap-2 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Insights */}
      {forecast.insights && forecast.insights.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className={`${ds.typography.bodyMedium} font-semibold mb-2 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Insights Clave
              </h3>
              <ul className="space-y-2">
                {forecast.insights.map((insight, idx) => (
                  <li key={idx} className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

