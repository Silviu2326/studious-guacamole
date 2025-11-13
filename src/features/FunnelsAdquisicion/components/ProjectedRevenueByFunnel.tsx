import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ProjectedRevenueByFunnel, ProjectedRevenueByFunnelResponse } from '../types';

interface ProjectedRevenueByFunnelProps {
  data: ProjectedRevenueByFunnelResponse | null;
  loading?: boolean;
  className?: string;
}

const stageColor: Record<'TOFU' | 'MOFU' | 'BOFU', string> = {
  TOFU: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  MOFU: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  BOFU: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const stageLabel: Record<'TOFU' | 'MOFU' | 'BOFU', string> = {
  TOFU: 'Captación (TOFU)',
  MOFU: 'Nurturing (MOFU)',
  BOFU: 'Cierre (BOFU)',
};

const impactColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const categoryLabels = {
  capacity: 'Capacidad',
  pricing: 'Precios',
  conversion: 'Conversión',
  marketing: 'Marketing',
};

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export const ProjectedRevenueByFunnelComponent: React.FC<ProjectedRevenueByFunnelProps> = ({
  data,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.funnels.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No hay datos de revenue proyectado
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Los datos de revenue proyectado aparecerán aquí cuando haya funnels activos
          </p>
        </div>
      </Card>
    );
  }

  // Ordenar funnels por prioridad (priorityScore)
  const sortedFunnels = [...data.funnels].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-5 h-5 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Revenue Proyectado por Funnel
        </h2>
        <span className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
          {data.funnels.length} funnels
        </span>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 p-4">
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Revenue Proyectado Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {currencyFormatter.format(data.totalProjectedRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 p-4">
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Revenue Actual Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {currencyFormatter.format(data.totalCurrentRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 p-4">
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Gap de Revenue</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {currencyFormatter.format(data.totalRevenueGap)}
            </p>
            {data.totalRevenueGap > 0 && (
              <TrendingUp className="w-5 h-5 text-orange-500" />
            )}
          </div>
        </div>
      </div>

      {/* Lista de funnels ordenados por prioridad */}
      <div className="space-y-4">
        {sortedFunnels.map((funnel) => (
          <div
            key={funnel.funnelId}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColor[funnel.stage]}`}>
                  {stageLabel[funnel.stage]}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {funnel.funnelName}
                </h3>
                {data.prioritizedFunnels.indexOf(funnel.funnelId) < 3 && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                    Prioridad Alta
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Prioridad: {funnel.priorityScore}/100
                </span>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Revenue Proyectado</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {currencyFormatter.format(funnel.projectedRevenue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Revenue Actual</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {currencyFormatter.format(funnel.currentRevenue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Gap de Revenue</p>
                <div className="flex items-center gap-1">
                  <p className={`text-lg font-semibold ${funnel.revenueGap > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    {currencyFormatter.format(funnel.revenueGap)}
                  </p>
                  {funnel.revenueGap > 0 ? (
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Tasa Conversión</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {funnel.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Capacidad y Precios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Capacidad</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Capacidad máxima:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">{funnel.capacity.maxCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Utilización:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {funnel.capacity.currentUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Espacios disponibles:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {funnel.capacity.availableSlots}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Precios</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Precio base:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {currencyFormatter.format(funnel.pricing.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Ticket promedio:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {currencyFormatter.format(funnel.pricing.averageTicket)}
                    </span>
                  </div>
                  {funnel.pricing.discountPercentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Descuento:</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        -{funnel.pricing.discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leads proyectados vs actuales */}
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Leads Proyectados</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {funnel.projectedLeads}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Leads Actuales</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {funnel.currentLeads}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Diferencia</p>
                  <p className={`text-lg font-semibold ${funnel.projectedLeads > funnel.currentLeads ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    {funnel.projectedLeads - funnel.currentLeads > 0 ? '+' : ''}
                    {funnel.projectedLeads - funnel.currentLeads}
                  </p>
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            {funnel.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-500" />
                  Recomendaciones para priorizar
                </h4>
                <div className="space-y-2">
                  {funnel.recommendations.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              {rec.title}
                            </h5>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[rec.impact]}`}>
                              {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Medio' : 'Bajo'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {categoryLabels[rec.category]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">{rec.description}</p>
                          {rec.estimatedRevenueIncrease && (
                            <p className="text-xs font-medium text-green-600 dark:text-green-400">
                              Revenue adicional estimado: {currencyFormatter.format(rec.estimatedRevenueIncrease)}
                              {rec.estimatedLift && ` (+${rec.estimatedLift.toFixed(1)}%)`}
                            </p>
                          )}
                        </div>
                      </div>
                      {rec.steps.length > 0 && (
                        <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1 mt-2">
                          {rec.steps.slice(0, 2).map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ArrowUpRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

