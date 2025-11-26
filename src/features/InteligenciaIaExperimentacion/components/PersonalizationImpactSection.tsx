import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select } from '../../../components/componentsreutilizables';
import { PersonalizationImpactSnapshot } from '../types';
import { getPersonalizationImpactService } from '../services/intelligenceService';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Target,
  Loader2,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface PersonalizationImpactSectionProps {
  period?: '7d' | '30d' | '90d' | '180d' | '365d';
  onPeriodChange?: (period: '7d' | '30d' | '90d' | '180d' | '365d') => void;
  trainerId?: string;
}

export const PersonalizationImpactSection: React.FC<PersonalizationImpactSectionProps> = ({
  period = '30d',
  onPeriodChange,
  trainerId,
}) => {
  const [data, setData] = useState<PersonalizationImpactSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [period, trainerId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await getPersonalizationImpactService({ period, trainerId, includeROI: true });
      setData(response.impact);
    } catch (error) {
      console.error('Error cargando impacto de personalización', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Cargando impacto de personalización...</span>
        </div>
      </Card>
    );
  }

  if (hasError || !data) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Error al cargar datos</p>
            <p className="text-sm text-red-500 mt-1">
              No se pudieron cargar los datos de impacto de personalización. Intenta de nuevo.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw size={16} />}
            className="ml-auto"
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <BarChart3 size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Impacto de la Personalización en Métricas Clave
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Visualiza el impacto de la personalización en reservas, retención y ROI para justificar inversión.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={period}
              onChange={(e) => onPeriodChange?.(e.target.value as any)}
              className="w-32"
            >
              <option value="7d">7 días</option>
              <option value="30d">30 días</option>
              <option value="90d">90 días</option>
              <option value="180d">180 días</option>
              <option value="365d">365 días</option>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              leftIcon={<RefreshCw size={16} />}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-indigo-900">{data.summary}</p>
        </div>
      </Card>

      {/* ROI Card */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <DollarSign size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">ROI de la Personalización</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Inversión</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.roi.investment)}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Ingresos Generados</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(data.roi.revenueGenerated)}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">ROI</p>
            <p className="text-2xl font-bold text-emerald-600">{formatPercentage(data.roi.roiPercentage)}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Período de Recuperación</p>
            <p className="text-2xl font-bold text-slate-900">{data.roi.breakevenPoint}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Ingresos por Reservas</p>
            <p className="text-xl font-semibold text-blue-900">{formatCurrency(data.roi.bookingsRevenue)}</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-sm text-purple-600 mb-1">Ingresos por Retención</p>
            <p className="text-xl font-semibold text-purple-900">{formatCurrency(data.roi.retentionRevenue)}</p>
          </div>
        </div>
      </Card>

      {/* Bookings Impact */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Calendar size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Impacto en Reservas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Reservas Personalizadas</p>
            <p className="text-2xl font-bold text-slate-900">{data.bookings.personalized}</p>
            <p className="text-sm text-slate-500 mt-1">
              Tasa de conversión: {data.bookings.conversionRatePersonalized}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Reservas No Personalizadas</p>
            <p className="text-2xl font-bold text-slate-900">{data.bookings.nonPersonalized}</p>
            <p className="text-sm text-slate-500 mt-1">
              Tasa de conversión: {data.bookings.conversionRateNonPersonalized}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-600 mb-1">Incremento</p>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">{formatPercentage(data.bookings.increasePercentage)}</p>
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              {data.bookings.bookingLift} reservas adicionales
            </p>
          </div>
        </div>
      </Card>

      {/* Retention Impact */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <Users size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Impacto en Retención</h3>
          <Badge variant="blue" size="sm">
            {data.retention.retentionPeriod}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Retención Personalizada</p>
            <p className="text-2xl font-bold text-slate-900">{data.retention.retentionRatePersonalized}%</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Retención No Personalizada</p>
            <p className="text-2xl font-bold text-slate-900">{data.retention.retentionRateNonPersonalized}%</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-600 mb-1">Mejora en Retención</p>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">+{data.retention.retentionLift}pp</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 mb-1">Reducción en Abandono</p>
            <div className="flex items-center gap-2">
              <TrendingDown size={20} className="text-red-600" />
              <p className="text-2xl font-bold text-red-600">-{data.retention.churnReduction}pp</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Metrics */}
      {data.metrics && data.metrics.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Otras Métricas de Impacto</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.metrics.map((metric) => (
              <div
                key={metric.metricId}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900">{metric.metricName}</p>
                  <Badge
                    variant={metric.significance === 'high' ? 'green' : metric.significance === 'medium' ? 'yellow' : 'blue'}
                    size="sm"
                  >
                    {metric.significance}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Antes</p>
                    <p className="text-lg font-semibold text-slate-600">{metric.beforeValue}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Después</p>
                    <p className="text-lg font-semibold text-slate-900">{metric.afterValue}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      {metric.trendDirection === 'up' ? (
                        <TrendingUp size={16} className="text-emerald-600" />
                      ) : metric.trendDirection === 'down' ? (
                        <TrendingDown size={16} className="text-red-600" />
                      ) : null}
                      <p
                        className={`text-sm font-semibold ${
                          metric.trendDirection === 'up'
                            ? 'text-emerald-600'
                            : metric.trendDirection === 'down'
                            ? 'text-red-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {formatPercentage(metric.changePercentage)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Insights Clave</h3>
          </div>
          <ul className="space-y-2">
            {data.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700">{insight}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border border-indigo-200 bg-indigo-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Recomendaciones para Justificar Inversión</h3>
          </div>
          <ul className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-indigo-200">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700">{recommendation}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

