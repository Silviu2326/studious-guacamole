import React, { useState } from 'react';
import {
  AlertTriangle,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  Users,
  MessageSquare,
  Settings,
  Bell,
  X,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MessageSaturationDashboard, MessageSaturationAlert, SaturationLevel } from '../types';

interface MessageSaturationDetectorProps {
  dashboard?: MessageSaturationDashboard;
  loading?: boolean;
  className?: string;
  onApplyPause?: (alertId: string) => void;
  onDismissAlert?: (alertId: string) => void;
  onSettingsEdit?: () => void;
}

const saturationLevelColors: Record<SaturationLevel, string> = {
  low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  critical: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200',
};

const saturationLevelLabels: Record<SaturationLevel, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

const saturationLevelIcons: Record<SaturationLevel, React.ReactNode> = {
  low: <AlertTriangle className="w-4 h-4" />,
  medium: <AlertTriangle className="w-4 h-4" />,
  high: <AlertTriangle className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4" />,
};

export const MessageSaturationDetector: React.FC<MessageSaturationDetectorProps> = ({
  dashboard,
  loading = false,
  className = '',
  onApplyPause,
  onDismissAlert,
  onSettingsEdit,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<MessageSaturationAlert | null>(null);

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card className={className} padding="lg">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de saturación disponibles
          </p>
        </div>
      </Card>
    );
  }

  const pendingAlerts = dashboard.alerts.filter((a) => a.status === 'pending');
  const criticalAlerts = pendingAlerts.filter((a) => a.saturationLevel === 'critical' || a.saturationLevel === 'high');

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Detección de Saturación de Mensajes
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              El sistema detecta cuando se están enviando demasiados mensajes y propone pausas automatizadas para no quemar a la audiencia
            </p>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Settings size={16} />} onClick={onSettingsEdit}>
            Configuración
          </Button>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Mensajes últimos 7 días
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.globalMetrics.totalMessagesSentLast7Days.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Promedio por cliente/día
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.globalMetrics.averageMessagesPerClientPerDay.toFixed(1)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Tasa de engagement
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.globalMetrics.overallEngagementRate.toFixed(1)}%
            </p>
            <Badge
              variant={dashboard.globalMetrics.engagementTrend === 'down' ? 'error' : 'success'}
              size="sm"
              className="mt-1"
            >
              {dashboard.globalMetrics.engagementTrend === 'down' ? '↓ Baja' : dashboard.globalMetrics.engagementTrend === 'up' ? '↑ Sube' : '→ Estable'}
            </Badge>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Cancelaciones últimos 7 días
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.globalMetrics.unsubscribesLast7Days}
            </p>
          </div>
        </div>

        {/* Alerts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Alertas pendientes
              </span>
            </div>
            <p className={`${ds.typography.h3} text-yellow-700 dark:text-yellow-300`}>
              {dashboard.byStatus.pending}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Críticas/Altas
              </span>
            </div>
            <p className={`${ds.typography.h3} text-red-700 dark:text-red-300`}>
              {dashboard.byLevel.critical + dashboard.byLevel.high}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Pausas aplicadas
              </span>
            </div>
            <p className={`${ds.typography.h3} text-green-700 dark:text-green-300`}>
              {dashboard.byStatus.applied}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total alertas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalAlerts}
            </p>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="space-y-3">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center gap-2`}>
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Alertas Críticas Requieren Atención
            </h3>
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={saturationLevelColors[alert.saturationLevel]}>
                        <span className="flex items-center gap-1">
                          {saturationLevelIcons[alert.saturationLevel]}
                          {saturationLevelLabels[alert.saturationLevel]}
                        </span>
                      </Badge>
                      <Badge variant="secondary">{alert.channel.toUpperCase()}</Badge>
                      {alert.clientName && (
                        <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Cliente: {alert.clientName}
                        </span>
                      )}
                      {alert.segmentName && (
                        <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Segmento: {alert.segmentName}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Mensajes últimos 7 días
                        </span>
                        <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {alert.metrics.messagesSentLast7Days}
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Promedio/día
                        </span>
                        <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {alert.metrics.averageMessagesPerDay.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Caída engagement
                        </span>
                        <p className={`${ds.typography.body} font-semibold text-red-600`}>
                          -{alert.metrics.engagementDrop.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Cancelaciones
                        </span>
                        <p className={`${ds.typography.body} font-semibold text-red-600`}>
                          {alert.metrics.unsubscribes}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Pause className="w-4 h-4 text-red-600" />
                        <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Pausa Recomendada
                        </span>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {alert.recommendedPause.reason}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Duración: {alert.recommendedPause.durationDays} días
                        </span>
                        <span>
                          Desde: {new Date(alert.recommendedPause.startDate).toLocaleDateString('es-ES')}
                        </span>
                        <span>
                          Hasta: {new Date(alert.recommendedPause.endDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-red-200 dark:border-red-800">
                  <Button
                    size="sm"
                    variant="default"
                    leftIcon={<Pause size={14} />}
                    onClick={() => onApplyPause?.(alert.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Aplicar Pausa Automática
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<X size={14} />}
                    onClick={() => onDismissAlert?.(alert.id)}
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Pending Alerts */}
        {pendingAlerts.length > criticalAlerts.length && (
          <div className="space-y-3">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Otras Alertas Pendientes
            </h3>
            {pendingAlerts
              .filter((a) => a.saturationLevel !== 'critical' && a.saturationLevel !== 'high')
              .map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={saturationLevelColors[alert.saturationLevel]}>
                          <span className="flex items-center gap-1">
                            {saturationLevelIcons[alert.saturationLevel]}
                            {saturationLevelLabels[alert.saturationLevel]}
                          </span>
                        </Badge>
                        <Badge variant="secondary">{alert.channel.toUpperCase()}</Badge>
                        {alert.clientName && (
                          <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Cliente: {alert.clientName}
                          </span>
                        )}
                        {alert.segmentName && (
                          <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Segmento: {alert.segmentName}
                          </span>
                        )}
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {alert.metrics.averageMessagesPerDay.toFixed(1)} mensajes/día (recomendado: {alert.metrics.recommendedMaxPerDay})
                      </p>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Pause className="w-4 h-4 text-slate-500" />
                          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Pausa Recomendada: {alert.recommendedPause.durationDays} días
                          </span>
                        </div>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {alert.recommendedPause.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Pause size={14} />}
                      onClick={() => onApplyPause?.(alert.id)}
                    >
                      Aplicar Pausa
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<X size={14} />}
                      onClick={() => onDismissAlert?.(alert.id)}
                    >
                      Descartar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {pendingAlerts.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
              No hay alertas de saturación pendientes
            </p>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              El sistema está monitoreando activamente la frecuencia de mensajes
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

