import React from 'react';
import { AlertTriangle, Clock, TrendingDown, Users, Target, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { FunnelLeadGenerationAlert, FunnelLeadGenerationAlertsResponse } from '../types';

interface FunnelLeadGenerationAlertsProps {
  data: FunnelLeadGenerationAlertsResponse | null;
  loading?: boolean;
  className?: string;
}

const severityColors = {
  critical: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
};

const severityLabels = {
  critical: 'Crítica',
  warning: 'Advertencia',
  info: 'Informativa',
};

const riskLevelColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const riskLevelLabels = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const alertTypeLabels = {
  insufficient_leads: 'Leads insuficientes',
  low_generation_rate: 'Tasa de generación baja',
  capacity_mismatch: 'Desajuste de capacidad',
  timing_risk: 'Riesgo de timing',
};

const actionTypeLabels = {
  boost_funnel: 'Potenciar funnel',
  extend_timeline: 'Extender timeline',
  adjust_campaign: 'Ajustar campaña',
  increase_capacity: 'Aumentar capacidad',
  optimize_conversion: 'Optimizar conversión',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const impactColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export const FunnelLeadGenerationAlerts: React.FC<FunnelLeadGenerationAlertsProps> = ({
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

  if (!data || data.alerts.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No hay alertas de generación de leads
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Todos los funnels están generando suficientes leads para las campañas programadas
          </p>
        </div>
      </Card>
    );
  }

  // Ordenar alertas por severidad (critical primero) y luego por días hasta campaña
  const sortedAlerts = [...data.alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return a.daysUntilCampaign - b.daysUntilCampaign;
  });

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Alertas de Generación de Leads
        </h2>
        <div className="ml-auto flex items-center gap-2">
          {data.criticalAlerts > 0 && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
              {data.criticalAlerts} críticas
            </span>
          )}
          {data.warningAlerts > 0 && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
              {data.warningAlerts} advertencias
            </span>
          )}
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
            {data.totalAlerts} alertas
          </span>
        </div>
      </div>

      {/* Resumen de campañas próximas */}
      {data.upcomingCampaigns.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Campañas Próximas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.upcomingCampaigns.map((campaign) => (
              <div
                key={campaign.campaignId}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-indigo-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {campaign.campaignName}
                  </h4>
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium">
                    {campaign.daysUntilCampaign} días
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Leads requeridos:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">{campaign.requiredLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Leads actuales:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">{campaign.currentLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Gap:</span>
                    <span className={`font-medium ${campaign.leadGap > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {campaign.leadGap > 0 ? '+' : ''}{campaign.leadGap}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Tasa generación/día:</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {campaign.leadGenerationRate.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-slate-400">Proyección al inicio:</span>
                    <span className={`font-medium ${campaign.projectedLeadsAtStart < campaign.requiredLeads ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                      {campaign.projectedLeadsAtStart}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de alertas */}
      <div className="space-y-4">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border-2 p-5 ${severityColors[alert.severity]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{alert.funnelName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[alert.severity]}`}>
                    {severityLabels[alert.severity]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/50 dark:bg-black/20">
                    {alertTypeLabels[alert.alertType]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskLevelColors[alert.riskLevel]}`}>
                    Riesgo {riskLevelLabels[alert.riskLevel]}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2 font-medium">{alert.message}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs opacity-75">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Campaña: {alert.campaignName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.daysUntilCampaign} días hasta inicio
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {alert.currentLeads} / {alert.requiredLeads} leads
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Gap: {alert.leadGap > 0 ? '+' : ''}{alert.leadGap} leads
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {alert.leadGenerationRate.toFixed(1)} leads/día
                  </span>
                </div>
                <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300">Proyección al inicio de campaña:</span>
                    <span className={`font-semibold ${alert.projectedLeadsAtStart < alert.requiredLeads ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {alert.projectedLeadsAtStart} leads
                      {alert.projectedLeadsAtStart < alert.requiredLeads && (
                        <span className="ml-1">⚠️</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones recomendadas */}
            {alert.recommendedActions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-current/20">
                <h4 className="text-sm font-semibold mb-3">Acciones recomendadas:</h4>
                <div className="space-y-2">
                  {alert.recommendedActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20"
                    >
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{action.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[action.priority]}`}>
                            {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${impactColors[action.estimatedImpact]}`}>
                            {action.estimatedImpact === 'high' ? 'Alto impacto' : action.estimatedImpact === 'medium' ? 'Medio impacto' : 'Bajo impacto'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {actionTypeLabels[action.actionType]}
                          </span>
                        </div>
                        <p className="text-xs opacity-80 mb-2">{action.description}</p>
                        {action.estimatedLeadsIncrease && (
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                            Leads adicionales estimados: +{action.estimatedLeadsIncrease}
                          </p>
                        )}
                        {action.steps.length > 0 && (
                          <ul className="text-xs opacity-70 space-y-1 mt-2">
                            {action.steps.slice(0, 3).map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {action.canExecute && (
                        <button className="px-3 py-1 text-xs font-medium bg-current/20 hover:bg-current/30 rounded transition-colors flex-shrink-0">
                          Ejecutar
                        </button>
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

