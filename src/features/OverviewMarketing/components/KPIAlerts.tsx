import React from 'react';
import { AlertTriangle, X, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { KPIAlert as KPIAlertType } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface KPIAlertsProps {
  alerts: KPIAlertType[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

const severityConfig: Record<
  KPIAlertType['severity'],
  { icon: React.ReactNode; color: string; bgColor: string; label: string }
> = {
  critical: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    label: 'Crítica',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    label: 'Advertencia',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    label: 'Informativa',
  },
};

export const KPIAlerts: React.FC<KPIAlertsProps> = ({ alerts, onDismiss, className = '' }) => {
  if (alerts.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Todos los indicadores están dentro del rango esperado
            </p>
            <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              No hay alertas activas en este momento
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Agrupar alertas por severidad
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
  const warningAlerts = alerts.filter((a) => a.severity === 'warning');
  const infoAlerts = alerts.filter((a) => a.severity === 'info');

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Alertas de Indicadores
            </h3>
            <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {alerts.length} indicador{alerts.length !== 1 ? 'es' : ''} fuera del rango esperado
            </p>
          </div>
        </div>
        {alerts.length > 0 && (
          <Badge
            variant={criticalAlerts.length > 0 ? 'error' : warningAlerts.length > 0 ? 'warning' : 'info'}
            size="md"
          >
            {criticalAlerts.length > 0 && `${criticalAlerts.length} crítica${criticalAlerts.length !== 1 ? 's' : ''}`}
            {criticalAlerts.length > 0 && warningAlerts.length > 0 && ' • '}
            {warningAlerts.length > 0 && `${warningAlerts.length} advertencia${warningAlerts.length !== 1 ? 's' : ''}`}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {/* Alertas críticas */}
        {criticalAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${config.bgColor} ${ds.animation.normal} hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${config.color}`}>{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Badge variant="error" size="sm" className="mb-2">
                        {config.label}
                      </Badge>
                      <p className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {alert.message}
                      </p>
                      {alert.expectedRange && (
                        <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Rango esperado:{' '}
                          {alert.expectedRange.min !== undefined && `Min: ${alert.expectedRange.min}`}
                          {alert.expectedRange.min !== undefined && alert.expectedRange.max !== undefined && ' - '}
                          {alert.expectedRange.max !== undefined && `Max: ${alert.expectedRange.max}`}
                          {' • '}Valor actual: <strong>{alert.currentValue.toFixed(2)}</strong>
                        </p>
                      )}
                      {alert.buyerPersonaId && (
                        <Badge variant="info" size="sm" className="mt-2">
                          Segmento: {alert.buyerPersonaId}
                        </Badge>
                      )}
                    </div>
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(alert.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Alertas de advertencia */}
        {warningAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${config.bgColor} ${ds.animation.normal} hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${config.color}`}>{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Badge variant="warning" size="sm" className="mb-2">
                        {config.label}
                      </Badge>
                      <p className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {alert.message}
                      </p>
                      {alert.expectedRange && (
                        <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Rango esperado:{' '}
                          {alert.expectedRange.min !== undefined && `Min: ${alert.expectedRange.min}`}
                          {alert.expectedRange.min !== undefined && alert.expectedRange.max !== undefined && ' - '}
                          {alert.expectedRange.max !== undefined && `Max: ${alert.expectedRange.max}`}
                          {' • '}Valor actual: <strong>{alert.currentValue.toFixed(2)}</strong>
                        </p>
                      )}
                      {alert.buyerPersonaId && (
                        <Badge variant="info" size="sm" className="mt-2">
                          Segmento: {alert.buyerPersonaId}
                        </Badge>
                      )}
                    </div>
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(alert.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Alertas informativas */}
        {infoAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${config.bgColor} ${ds.animation.normal} hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${config.color}`}>{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Badge variant="info" size="sm" className="mb-2">
                        {config.label}
                      </Badge>
                      <p className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {alert.message}
                      </p>
                      {alert.expectedRange && (
                        <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Rango esperado:{' '}
                          {alert.expectedRange.min !== undefined && `Min: ${alert.expectedRange.min}`}
                          {alert.expectedRange.min !== undefined && alert.expectedRange.max !== undefined && ' - '}
                          {alert.expectedRange.max !== undefined && `Max: ${alert.expectedRange.max}`}
                          {' • '}Valor actual: <strong>{alert.currentValue.toFixed(2)}</strong>
                        </p>
                      )}
                      {alert.buyerPersonaId && (
                        <Badge variant="info" size="sm" className="mt-2">
                          Segmento: {alert.buyerPersonaId}
                        </Badge>
                      )}
                    </div>
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(alert.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

