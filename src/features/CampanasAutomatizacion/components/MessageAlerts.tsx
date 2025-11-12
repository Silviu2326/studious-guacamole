import React, { useMemo } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  MessageAlertsDashboard,
  MessageAlert,
  MessageAlertPriority,
  MessageAlertStatus,
  MessagingChannel,
} from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const priorityLabel: Record<MessageAlertPriority, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  urgent: { label: 'Urgente', variant: 'red', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  high: { label: 'Alta', variant: 'orange', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  medium: { label: 'Media', variant: 'yellow', icon: <Clock className="w-3.5 h-3.5" /> },
  low: { label: 'Baja', variant: 'blue', icon: <Bell className="w-3.5 h-3.5" /> },
};

const statusLabel: Record<MessageAlertStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  active: { label: 'Activa', variant: 'red', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  acknowledged: { label: 'Reconocida', variant: 'yellow', icon: <Clock className="w-3.5 h-3.5" /> },
  resolved: { label: 'Resuelta', variant: 'green', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  dismissed: { label: 'Descartada', variant: 'gray', icon: <XCircle className="w-3.5 h-3.5" /> },
};

interface MessageAlertsProps {
  dashboard: MessageAlertsDashboard;
  loading?: boolean;
  className?: string;
  onAlertAcknowledge?: (alertId: string) => void;
  onAlertResolve?: (alertId: string) => void;
  onAlertDismiss?: (alertId: string) => void;
  onAlertView?: (alert: MessageAlert) => void;
  onSettingsEdit?: () => void;
}

const formatTimeAgo = (hours: number, days: number): string => {
  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''}`;
  }
  return `${hours} hora${hours > 1 ? 's' : ''}`;
};

export const MessageAlerts: React.FC<MessageAlertsProps> = ({
  dashboard,
  loading = false,
  className = '',
  onAlertAcknowledge,
  onAlertResolve,
  onAlertDismiss,
  onAlertView,
  onSettingsEdit,
}) => {
  const sortedAlerts = useMemo(() => {
    const priorityOrder: Record<MessageAlertPriority, number> = {
      urgent: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    return [...dashboard.activeAlerts].sort((a, b) => {
      if (a.status !== b.status) {
        const statusOrder: Record<MessageAlertStatus, number> = {
          active: 0,
          acknowledged: 1,
          resolved: 2,
          dismissed: 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [dashboard.activeAlerts]);

  if (loading) {
    return (
      <Card className={className} padding="lg">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/40">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Alertas de Mensajes Importantes
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Sistema de alertas que detecta cuando mensajes importantes no han sido abiertos o respondidos después de X tiempo y notifica al entrenador para que tome acción manual
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={onSettingsEdit}>
            Configurar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 border border-red-100 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Total Activas
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalActive}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 border border-red-100 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Urgentes
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.byPriority.urgent}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Alta
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.byPriority.high}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 border border-yellow-100 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Media
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.byPriority.medium}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Baja
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.byPriority.low}
            </p>
          </div>
        </div>

        {/* Alerts List */}
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              No hay alertas activas en este momento
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAlerts.map((alert) => {
              const priority = priorityLabel[alert.priority];
              const status = statusLabel[alert.status];
              const channel = channelLabel[alert.channel];
              const timeAgo = formatTimeAgo(alert.timeSinceSent.hours, alert.timeSinceSent.days);

              return (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828] hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={priority.variant} leftIcon={priority.icon}>
                          {priority.label}
                        </Badge>
                        <Badge variant={status.variant} leftIcon={status.icon}>
                          {status.label}
                        </Badge>
                        <Badge variant={channel.variant} leftIcon={channel.icon}>
                          {channel.label}
                        </Badge>
                        <Badge variant="outline">
                          {alert.messageTypeLabel}
                        </Badge>
                      </div>
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {alert.clientName}
                      </h3>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {alert.messageContent.length > 150
                          ? `${alert.messageContent.substring(0, 150)}...`
                          : alert.messageContent}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Enviado hace {timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>
                            No {alert.threshold.type === 'opened' ? 'abierto' : 'respondido'} después de {alert.threshold.hours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {alert.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onAlertAcknowledge?.(alert.id)}
                          >
                            Reconocer
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onAlertView?.(alert)}
                          >
                            Ver Detalles
                          </Button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onAlertResolve?.(alert.id)}
                          >
                            Marcar Resuelta
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAlertDismiss?.(alert.id)}
                          >
                            Descartar
                          </Button>
                        </>
                      )}
                      {alert.status === 'resolved' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAlertView?.(alert)}
                        >
                          Ver Detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

