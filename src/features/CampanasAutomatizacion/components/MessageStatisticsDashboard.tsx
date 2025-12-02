import React, { useMemo } from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { BarChart3, Mail, MessageCircle, Smartphone, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { MessageStatisticsDashboard as MessageStatisticsDashboardType, MessageType, MessagingChannel } from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const messageTypeLabel: Record<MessageType, string> = {
  'recordatorio-sesion': 'Recordatorios de Sesión',
  'recordatorio-pago': 'Recordatorios de Pago',
  'bienvenida': 'Bienvenida',
  'seguimiento': 'Seguimiento',
  'ausencia': 'Ausencias',
  'inactividad': 'Inactividad',
  'fecha-importante': 'Fechas Importantes',
  'programado': 'Programados',
  'otro': 'Otros',
};

interface MessageStatisticsDashboardProps {
  dashboard: MessageStatisticsDashboardType;
  loading?: boolean;
  className?: string;
}

export const MessageStatisticsDashboard: React.FC<MessageStatisticsDashboardProps> = ({ dashboard, loading = false, className = '' }) => {
  const periodLabel = useMemo(() => {
    switch (dashboard.period) {
      case '7d':
        return 'Últimos 7 días';
      case '30d':
        return 'Últimos 30 días';
      case '90d':
        return 'Últimos 90 días';
      case 'all':
        return 'Todo el tiempo';
      default:
        return 'Últimos 30 días';
    }
  }, [dashboard.period]);

  if (loading) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Estadísticas de Mensajes Automáticos
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Dashboard que muestra estadísticas de mensajes automáticos: cuántos se enviaron, cuántos se abrieron, cuántos generaron respuesta, y comparativa entre diferentes tipos de mensajes
          </p>
        </div>
        <Badge variant="blue" size="md">
          {periodLabel}
        </Badge>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Enviados
            </span>
          </div>
          <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {dashboard.totalMessagesSent.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Abiertos
            </span>
          </div>
          <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {dashboard.totalMessagesOpened.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Respuestas
            </span>
          </div>
          <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {dashboard.totalMessagesReplied.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 border border-amber-100 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Tasa Apertura
            </span>
          </div>
          <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {dashboard.overallOpenRate.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 border border-pink-100 dark:border-pink-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-pink-600" />
            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Tasa Respuesta
            </span>
          </div>
          <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {dashboard.overallReplyRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabla de estadísticas por tipo */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-left py-3 px-4`}>
                Tipo de Mensaje
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-left py-3 px-4`}>
                Canal
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Enviados
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Abiertos
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Respuestas
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Tasa Apertura
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Tasa Respuesta
              </th>
              <th className={`${ds.typography.caption} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} text-right py-3 px-4`}>
                Tendencia
              </th>
            </tr>
          </thead>
          <tbody>
            {dashboard.statistics.map((stat) => {
              const channel = channelLabel[stat.channel];
              const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;
              return (
                <tr
                  key={stat.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.typeLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={channel.variant} size="sm">
                      <span className="flex items-center gap-1">
                        {channel.icon}
                        {channel.label}
                      </span>
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.totalSent.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.totalOpened.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.totalReplied.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.openRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {stat.replyRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {TrendIcon && (
                      <div className="flex items-center justify-end gap-1">
                        <TrendIcon
                          className={`w-4 h-4 ${
                            stat.trend === 'up'
                              ? 'text-green-500'
                              : stat.trend === 'down'
                              ? 'text-red-500'
                              : 'text-slate-400'
                          }`}
                        />
                        <span
                          className={`${ds.typography.caption} ${
                            stat.trend === 'up'
                              ? 'text-green-600 dark:text-green-400'
                              : stat.trend === 'down'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {stat.changePercentage > 0 ? '+' : ''}
                          {stat.changePercentage.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
          Última actualización: {new Date(dashboard.lastUpdated).toLocaleString('es-ES')}
        </span>
      </div>
    </Card>
  );
};

