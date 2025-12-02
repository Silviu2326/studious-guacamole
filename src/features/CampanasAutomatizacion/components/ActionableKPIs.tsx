import React, { useMemo } from 'react';
import { Badge, Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MessageSquare,
  Target,
  ArrowRight,
  Mail,
  MessageCircle,
  Smartphone,
  BarChart3,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  ActionableKPIDashboard,
  MessagingChannel,
  MessageType,
} from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const messageTypeLabels: Record<MessageType, string> = {
  'recordatorio-sesion': 'Recordatorio Sesión',
  'recordatorio-pago': 'Recordatorio Pago',
  'bienvenida': 'Bienvenida',
  'seguimiento': 'Seguimiento',
  'ausencia': 'Ausencia',
  'inactividad': 'Inactividad',
  'fecha-importante': 'Fecha Importante',
  'programado': 'Programado',
  'otro': 'Otro',
};

interface ActionableKPIsProps {
  dashboard: ActionableKPIDashboard;
  loading?: boolean;
  className?: string;
  onPeriodChange?: (period: '7d' | '30d' | '90d' | 'all') => void;
  onViewDetails?: (messageId: string) => void;
  onViewCampaign?: (campaignId: string) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const ActionableKPIs: React.FC<ActionableKPIsProps> = ({
  dashboard,
  loading = false,
  className = '',
  onPeriodChange,
  onViewDetails,
  onViewCampaign,
}) => {
  const metricCardsData = useMemo<MetricCardData[]>(() => {
    return [
      {
        id: 'total-messages',
        title: 'Mensajes Enviados',
        value: dashboard.summary.totalMessagesSent.toLocaleString('es-ES'),
        icon: <MessageSquare className="w-5 h-5 text-white" />,
        color: 'info',
      },
      {
        id: 'bookings-generated',
        title: 'Reservas Generadas',
        value: dashboard.summary.totalBookingsGenerated.toLocaleString('es-ES'),
        subtitle: `${formatPercentage(dashboard.summary.overallBookingConversionRate)} tasa de conversión`,
        icon: <Calendar className="w-5 h-5 text-white" />,
        color: 'success',
        trend: {
          value: Math.abs(dashboard.trends.changePercentage.bookings),
          direction: dashboard.trends.bookingConversionTrend,
          label: 'vs. período anterior',
        },
      },
      {
        id: 'sales-generated',
        title: 'Ventas Generadas',
        value: dashboard.summary.totalSalesGenerated.toLocaleString('es-ES'),
        subtitle: `${formatPercentage(dashboard.summary.overallSaleConversionRate)} tasa de conversión`,
        icon: <Target className="w-5 h-5 text-white" />,
        color: 'success',
        trend: {
          value: Math.abs(dashboard.trends.changePercentage.sales),
          direction: dashboard.trends.saleConversionTrend,
          label: 'vs. período anterior',
        },
      },
      {
        id: 'total-revenue',
        title: 'Ingresos Totales',
        value: formatCurrency(dashboard.summary.totalRevenue),
        subtitle: `${formatCurrency(dashboard.summary.averageRevenuePerMessage)} por mensaje`,
        icon: <DollarSign className="w-5 h-5 text-white" />,
        color: 'success',
        trend: {
          value: Math.abs(dashboard.trends.changePercentage.revenue),
          direction: dashboard.trends.revenueTrend,
          label: 'vs. período anterior',
        },
      },
    ];
  }, [dashboard]);

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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                KPIs Accionables - Impacto Real
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Relación entre mensajes enviados, reservas generadas y ventas realizadas para entender el impacto real
            </p>
          </div>
          <select
            value={dashboard.period}
            onChange={(e) => onPeriodChange?.(e.target.value as '7d' | '30d' | '90d' | 'all')}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="all">Todo el tiempo</option>
          </select>
        </div>

        {/* Summary Metrics */}
        <MetricCards data={metricCardsData} columns={4} />
      </Card>

      {/* Actionable Insights */}
      {dashboard.actionableInsights.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Insights Accionables
            </h3>
          </div>
          <div className="space-y-3">
            {dashboard.actionableInsights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 border ${
                  insight.impact === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : insight.impact === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          insight.impact === 'high' ? 'red' : insight.impact === 'medium' ? 'yellow' : 'blue'
                        }
                      >
                        Impacto {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                      {insight.insight}
                    </p>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {insight.action}
                      </p>
                    </div>
                    {insight.estimatedImpact && (
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
                        💡 Impacto estimado: {insight.estimatedImpact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Performing Messages */}
      {dashboard.topPerformingMessages.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Mensajes con Mayor Impacto
          </h3>
          <div className="space-y-3">
            {dashboard.topPerformingMessages.slice(0, 10).map((message) => {
              const channelInfo = channelLabel[message.channel];
              return (
                <div
                  key={message.messageId}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828] hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer"
                  onClick={() => onViewDetails?.(message.messageId)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                          {channelInfo.label}
                        </Badge>
                        <Badge variant="outline">{messageTypeLabels[message.messageType]}</Badge>
                        <Badge variant="green">Score: {message.conversionScore.toFixed(1)}</Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                        {message.clientName}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            Reservas:
                          </span>
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {message.bookingsGenerated}
                          </p>
                        </div>
                        <div>
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            Ventas:
                          </span>
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {message.salesGenerated}
                          </p>
                        </div>
                        <div>
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            Ingresos:
                          </span>
                          <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                            {formatCurrency(message.revenue)}
                          </p>
                        </div>
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(message.sentAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onViewDetails?.(message.messageId)}>
                      Ver detalles
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Performance by Message Type */}
      {dashboard.byMessageType.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Rendimiento por Tipo de Mensaje
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Tipo</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Enviados</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Reservas</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Ventas</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Conv. Reservas</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">Conv. Ventas</th>
                  <th className="text-right p-3 text-sm font-medium text-slate-600 dark:text-slate-400">€/Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.byMessageType.map((item) => (
                  <tr
                    key={item.messageType}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="p-3">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {item.messageTypeLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {item.messagesSent.toLocaleString('es-ES')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {item.bookingsGenerated}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {item.salesGenerated}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                        {formatCurrency(item.revenue)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {formatPercentage(item.bookingConversionRate)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {formatPercentage(item.saleConversionRate)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`${ds.typography.bodySmall} font-semibold text-indigo-600 dark:text-indigo-400`}>
                        {formatCurrency(item.revenuePerMessage)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Performance by Channel */}
      {dashboard.byChannel.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Rendimiento por Canal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.byChannel.map((channel) => {
              const channelInfo = channelLabel[channel.channel];
              return (
                <div
                  key={channel.channel}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {channelInfo.icon}
                    <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {channelInfo.label}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={ds.color.textMuted}>Enviados:</span>
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {channel.messagesSent.toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.color.textMuted}>Reservas:</span>
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {channel.bookingsGenerated} ({formatPercentage(channel.bookingConversionRate)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.color.textMuted}>Ventas:</span>
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {channel.salesGenerated} ({formatPercentage(channel.saleConversionRate)})
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        Ingresos:
                      </span>
                      <span className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                        {formatCurrency(channel.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.color.textMuted}>€/Mensaje:</span>
                      <span className={`${ds.typography.bodySmall} font-semibold text-indigo-600 dark:text-indigo-400`}>
                        {formatCurrency(channel.revenuePerMessage)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Campaign Impact */}
      {dashboard.campaignImpact.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Impacto por Campaña
          </h3>
          <div className="space-y-3">
            {dashboard.campaignImpact.map((campaign) => (
              <div
                key={campaign.campaignId}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828] hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer"
                onClick={() => onViewCampaign?.(campaign.campaignId)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {campaign.campaignName}
                      </h4>
                      <Badge variant="outline">{campaign.campaignType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Mensajes
                        </span>
                        <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {campaign.totalMessagesSent.toLocaleString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Reservas
                        </span>
                        <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {campaign.bookingsGenerated} ({formatPercentage(campaign.bookingConversionRate)})
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Ventas
                        </span>
                        <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {campaign.salesGenerated} ({formatPercentage(campaign.saleConversionRate)})
                        </p>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Ingresos
                        </span>
                        <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                          {formatCurrency(campaign.totalRevenue)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className={ds.color.textMuted}>
                        €/Mensaje: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(campaign.revenuePerMessage)}</span>
                      </span>
                      {campaign.roi > 0 && (
                        <span className={ds.color.textMuted}>
                          ROI: <span className="font-semibold text-green-600 dark:text-green-400">{formatPercentage(campaign.roi)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onViewCampaign?.(campaign.campaignId)}>
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Última actualización: {new Date(dashboard.lastUpdated).toLocaleString('es-ES')}
      </div>
    </div>
  );
};

