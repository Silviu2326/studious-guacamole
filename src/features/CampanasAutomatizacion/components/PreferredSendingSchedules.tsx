import React, { useMemo } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  Settings,
  Smartphone,
  Users,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  PreferredSendingSchedulesDashboard,
  ClientPreferredSchedule,
  GroupPreferredSchedule,
  PreferredScheduleRule,
  MessagingChannel,
} from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface PreferredSendingSchedulesProps {
  dashboard: PreferredSendingSchedulesDashboard;
  loading?: boolean;
  className?: string;
  onClientScheduleCreate?: () => void;
  onClientScheduleEdit?: (schedule: ClientPreferredSchedule) => void;
  onClientScheduleDelete?: (scheduleId: string) => void;
  onGroupScheduleCreate?: () => void;
  onGroupScheduleEdit?: (schedule: GroupPreferredSchedule) => void;
  onGroupScheduleDelete?: (scheduleId: string) => void;
  onRuleCreate?: () => void;
  onRuleEdit?: (rule: PreferredScheduleRule) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleToggle?: (ruleId: string, isActive: boolean) => void;
}

const formatTime = (time: string): string => {
  return time;
};

const formatWindows = (windows: Array<{ dayName: string; startTime: string; endTime: string; isEnabled: boolean }>): string => {
  const enabledWindows = windows.filter((w) => w.isEnabled);
  if (enabledWindows.length === 0) return 'Sin horarios configurados';
  if (enabledWindows.length === 1) {
    const w = enabledWindows[0];
    return `${w.dayName} ${w.startTime}-${w.endTime}`;
  }
  return `${enabledWindows.length} días configurados`;
};

export const PreferredSendingSchedules: React.FC<PreferredSendingSchedulesProps> = ({
  dashboard,
  loading = false,
  className = '',
  onClientScheduleCreate,
  onClientScheduleEdit,
  onClientScheduleDelete,
  onGroupScheduleCreate,
  onGroupScheduleEdit,
  onGroupScheduleDelete,
  onRuleCreate,
  onRuleEdit,
  onRuleDelete,
  onRuleToggle,
}) => {
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
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Horarios Preferidos de Envío
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Sistema que permite configurar horarios de envío preferidos por cliente o grupo, y que los mensajes automáticos se programen dentro de esas ventanas de tiempo
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onRuleCreate}>
              Nueva Regla
            </Button>
            <Button size="sm" variant="primary" onClick={onClientScheduleCreate}>
              Nuevo Horario
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Clientes con Horario
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalClientsWithSchedule}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Grupos con Horario
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalGroupsWithSchedule}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Reglas Activas
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalRules}
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Próximos Envíos
              </span>
            </div>
            <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.nextScheduledMessages.length}
            </p>
          </div>
        </div>

        {/* Rules Section */}
        {dashboard.rules.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Reglas de Horarios
              </h3>
            </div>
            <div className="space-y-3">
              {dashboard.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={rule.isActive ? 'green' : 'gray'}>
                          {rule.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <Badge variant="outline">Prioridad: {rule.priority}</Badge>
                        {rule.channels.map((channel) => {
                          const channelInfo = channelLabel[channel];
                          return (
                            <Badge key={channel} variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                              {channelInfo.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {rule.name}
                      </h4>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {rule.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatWindows(rule.schedule.windows)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{rule.schedule.timezone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onRuleEdit?.(rule)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={rule.isActive ? 'ghost' : 'primary'}
                        onClick={() => onRuleToggle?.(rule.id, !rule.isActive)}
                      >
                        {rule.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onRuleDelete?.(rule.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Schedules Section */}
        {dashboard.clientSchedules.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Horarios por Cliente
              </h3>
            </div>
            <div className="space-y-3">
              {dashboard.clientSchedules.slice(0, 5).map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={schedule.isActive ? 'green' : 'gray'}>
                          {schedule.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {schedule.appliesTo.channels.map((channel) => {
                          const channelInfo = channelLabel[channel];
                          return (
                            <Badge key={channel} variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                              {channelInfo.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {schedule.clientName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatWindows(schedule.windows)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{schedule.timezone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onClientScheduleEdit?.(schedule)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onClientScheduleDelete?.(schedule.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group Schedules Section */}
        {dashboard.groupSchedules.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Horarios por Grupo
              </h3>
            </div>
            <div className="space-y-3">
              {dashboard.groupSchedules.slice(0, 5).map((schedule) => (
                <div
                  key={schedule.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={schedule.isActive ? 'green' : 'gray'}>
                          {schedule.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline">{schedule.clientCount} clientes</Badge>
                        {schedule.appliesTo.channels.map((channel) => {
                          const channelInfo = channelLabel[channel];
                          return (
                            <Badge key={channel} variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                              {channelInfo.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        {schedule.groupName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatWindows(schedule.windows)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{schedule.timezone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onGroupScheduleEdit?.(schedule)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onGroupScheduleDelete?.(schedule.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Scheduled Messages */}
        {dashboard.nextScheduledMessages.length > 0 && (
          <div className="space-y-4">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Próximos Envíos Programados
            </h3>
            <div className="space-y-2">
              {dashboard.nextScheduledMessages.slice(0, 5).map((msg, index) => {
                const channelInfo = channelLabel[msg.channel];
                return (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                          {channelInfo.label}
                        </Badge>
                        <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {msg.clientName}
                        </span>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {msg.messageType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(msg.scheduledTime).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          ({msg.preferredWindow.startTime}-{msg.preferredWindow.endTime})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

