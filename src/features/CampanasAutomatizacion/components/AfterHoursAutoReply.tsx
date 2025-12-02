import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Clock, Mail, MessageCircle, Smartphone, Calendar } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { AfterHoursAutoReply } from '../types';

const channelLabel: Record<'email' | 'whatsapp' | 'sms', { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
};

interface AfterHoursAutoReplyProps {
  autoReplies: AfterHoursAutoReply[];
  loading?: boolean;
  className?: string;
  onAutoReplyCreate?: () => void;
  onAutoReplyEdit?: (autoReply: AfterHoursAutoReply) => void;
  onAutoReplyDelete?: (autoReplyId: string) => void;
  onAutoReplyToggle?: (autoReplyId: string, isActive: boolean) => void;
}

export const AfterHoursAutoReplyComponent: React.FC<AfterHoursAutoReplyProps> = ({
  autoReplies,
  loading = false,
  className = '',
  onAutoReplyCreate,
  onAutoReplyEdit,
  onAutoReplyDelete,
  onAutoReplyToggle,
}) => {
  if (loading && autoReplies.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  const formatBusinessHours = (businessHours: AfterHoursAutoReply['businessHours']) => {
    const enabledDays = businessHours.filter((h) => h.isEnabled);
    if (enabledDays.length === 0) return 'No configurado';
    if (enabledDays.length === 7) {
      const times = enabledDays.map((h) => `${h.startTime}-${h.endTime}`);
      const allSame = times.every((t) => t === times[0]);
      if (allSame) {
        return `Todos los días: ${times[0]}`;
      }
    }
    return `${enabledDays.length} días configurados`;
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Respuestas Automáticas Fuera de Horario
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Sistema que detecta mensajes entrantes fuera del horario configurado y envía una respuesta automática informando el horario de atención y tiempo estimado de respuesta
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="indigo" size="md">
            {autoReplies.length} configuraciones
          </Badge>
          {onAutoReplyCreate && (
            <button
              onClick={onAutoReplyCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Nueva configuración
            </button>
          )}
        </div>
      </div>

      {autoReplies.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            No hay configuraciones de respuestas automáticas fuera de horario
          </p>
          {onAutoReplyCreate && (
            <button
              onClick={onAutoReplyCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Crear primera configuración
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {autoReplies.map((autoReply) => {
            const channelInfo = channelLabel[autoReply.channel];
            return (
              <div
                key={autoReply.id}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {autoReply.name}
                      </h3>
                      <Badge variant={autoReply.isActive ? 'green' : 'gray'}>
                        {autoReply.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <Badge variant={channelInfo.variant} size="sm">
                        <span className="flex items-center gap-1">
                          {channelInfo.icon}
                          {channelInfo.label}
                        </span>
                      </Badge>
                    </div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-3`}>
                      {autoReply.description}
                    </p>

                    {/* Horarios de atención */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Horarios de atención:
                        </span>
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} ml-6`}>
                        {formatBusinessHours(autoReply.businessHours)}
                      </p>
                      <div className="ml-6 mt-2 space-y-1">
                        {autoReply.businessHours
                          .filter((h) => h.isEnabled)
                          .slice(0, 3)
                          .map((hour) => (
                            <div key={hour.id} className="text-xs text-slate-600 dark:text-slate-400">
                              {hour.dayName}: {hour.startTime} - {hour.endTime}
                            </div>
                          ))}
                        {autoReply.businessHours.filter((h) => h.isEnabled).length > 3 && (
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            +{autoReply.businessHours.filter((h) => h.isEnabled).length - 3} días más
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tiempo estimado de respuesta */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Tiempo estimado de respuesta:
                        </span>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {autoReply.estimatedResponseTime}
                        </span>
                      </div>
                    </div>

                    {/* Mensaje de respuesta */}
                    <div className="mb-3">
                      <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                        Mensaje de respuesta automática:
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} whitespace-pre-wrap`}>
                          {autoReply.messageTemplate}
                        </p>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Respuestas enviadas: <strong className={ds.color.textPrimary}>{autoReply.totalRepliesSent}</strong>
                      </span>
                      {autoReply.lastTriggered && (
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Última activación: {new Date(autoReply.lastTriggered).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  {onAutoReplyToggle && (
                    <button
                      onClick={() => onAutoReplyToggle(autoReply.id, !autoReply.isActive)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        autoReply.isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      }`}
                    >
                      {autoReply.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                  {onAutoReplyEdit && (
                    <button
                      onClick={() => onAutoReplyEdit(autoReply)}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      Editar
                    </button>
                  )}
                  {onAutoReplyDelete && (
                    <button
                      onClick={() => onAutoReplyDelete(autoReply.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

