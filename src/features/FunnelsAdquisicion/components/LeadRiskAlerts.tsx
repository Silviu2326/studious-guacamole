import React from 'react';
import { AlertTriangle, Clock, Mail, MessageCircle, Phone, Gift, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { LeadRiskAlert, SuggestedActionType } from '../types';

interface LeadRiskAlertsProps {
  alerts: LeadRiskAlert[];
  loading?: boolean;
  className?: string;
}

const riskLevelColors = {
  high: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
  low: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
};

const riskLevelLabels = {
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
};

const stageLabels = {
  consulta_solicitada: 'Consulta solicitada',
  consulta_realizada: 'Consulta realizada',
  primera_sesion_pagada: 'Primera sesión pagada',
  cliente_activo: 'Cliente activo',
};

const actionIcons: Record<SuggestedActionType, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  whatsapp: MessageCircle,
  llamada: Phone,
  oferta_especial: Gift,
  recordatorio: Clock,
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const LeadRiskAlerts: React.FC<LeadRiskAlertsProps> = ({
  alerts,
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
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No hay leads en riesgo
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Todos tus leads están siendo seguidos correctamente
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Alertas de Leads en Riesgo
        </h2>
        <span className="ml-auto px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
          {alerts.length} alertas
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border-2 p-4 ${riskLevelColors[alert.riskLevel]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{alert.leadName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      riskLevelColors[alert.riskLevel]
                    }`}
                  >
                    {riskLevelLabels[alert.riskLevel]}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">{alert.reason}</p>
                <div className="flex items-center gap-4 text-xs opacity-75">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.daysSinceLastAction} días sin acción
                  </span>
                  <span>Etapa: {stageLabels[alert.currentStage]}</span>
                  {alert.leadEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {alert.leadEmail}
                    </span>
                  )}
                  {alert.leadPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {alert.leadPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-current/20">
              <h4 className="text-sm font-semibold mb-2">Acciones sugeridas:</h4>
              <div className="space-y-2">
                {alert.suggestedActions.map((action) => {
                  const Icon = actionIcons[action.type];
                  return (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 p-2 rounded-lg bg-white/50 dark:bg-black/20"
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{action.title}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[action.priority]}`}
                          >
                            {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                        <p className="text-xs opacity-80">{action.description}</p>
                        {action.template && (
                          <div className="mt-2 p-2 bg-white/70 dark:bg-black/30 rounded text-xs font-mono opacity-70">
                            {action.template}
                          </div>
                        )}
                      </div>
                      {action.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <button className="px-3 py-1 text-xs font-medium bg-current/20 hover:bg-current/30 rounded transition-colors">
                          Ejecutar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

