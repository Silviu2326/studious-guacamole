import React, { useMemo, useState } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  AIHeatMapSendingSchedulesDashboard,
  HeatMapTimeSlot,
  HeatMapChannelData,
  MessagingChannel,
} from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dayNamesFull = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const recommendationColors: Record<HeatMapTimeSlot['recommendation'], { bg: string; text: string; border: string }> = {
  optimal: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-600' },
  good: { bg: 'bg-emerald-400', text: 'text-emerald-700', border: 'border-emerald-500' },
  fair: { bg: 'bg-yellow-400', text: 'text-yellow-700', border: 'border-yellow-500' },
  poor: { bg: 'bg-orange-400', text: 'text-orange-700', border: 'border-orange-500' },
  avoid: { bg: 'bg-red-400', text: 'text-red-700', border: 'border-red-500' },
};

interface AIHeatMapSendingSchedulesProps {
  dashboard: AIHeatMapSendingSchedulesDashboard;
  loading?: boolean;
  className?: string;
  onPeriodChange?: (period: '7d' | '30d' | '90d' | 'all') => void;
  onApplyRecommendations?: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-emerald-400';
  if (score >= 40) return 'bg-yellow-400';
  if (score >= 20) return 'bg-orange-400';
  return 'bg-red-400';
};

const getScoreIntensity = (score: number): number => {
  // Intensidad del color basada en el score (0.3 a 1.0)
  return Math.max(0.3, score / 100);
};

export const AIHeatMapSendingSchedules: React.FC<AIHeatMapSendingSchedulesProps> = ({
  dashboard,
  loading = false,
  className = '',
  onPeriodChange,
  onApplyRecommendations,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<MessagingChannel | 'all'>('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const channelData = useMemo(() => {
    if (selectedChannel === 'all') {
      // Combinar todos los canales
      const allSlots: Record<string, HeatMapTimeSlot> = {};
      dashboard.channels.forEach((channel) => {
        channel.timeSlots.forEach((slot) => {
          const key = `${slot.dayOfWeek}-${slot.hour}`;
          if (!allSlots[key]) {
            allSlots[key] = {
              ...slot,
              totalSent: 0,
              totalOpened: 0,
              totalReplied: 0,
            };
          }
          allSlots[key].totalSent += slot.totalSent;
          allSlots[key].totalOpened += slot.totalOpened;
          allSlots[key].totalReplied += slot.totalReplied;
        });
      });
      // Recalcular tasas y scores
      Object.values(allSlots).forEach((slot) => {
        slot.openRate = slot.totalSent > 0 ? (slot.totalOpened / slot.totalSent) * 100 : 0;
        slot.replyRate = slot.totalSent > 0 ? (slot.totalReplied / slot.totalSent) * 100 : 0;
        slot.score = (slot.openRate * 0.6 + slot.replyRate * 0.4);
        if (slot.score >= 80) slot.recommendation = 'optimal';
        else if (slot.score >= 60) slot.recommendation = 'good';
        else if (slot.score >= 40) slot.recommendation = 'fair';
        else if (slot.score >= 20) slot.recommendation = 'poor';
        else slot.recommendation = 'avoid';
      });
      return {
        channel: 'all' as MessagingChannel,
        timeSlots: Object.values(allSlots),
        optimalSlots: Object.values(allSlots)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5),
        worstSlots: Object.values(allSlots)
          .sort((a, b) => a.score - b.score)
          .slice(0, 5),
        averageOpenRate: 0,
        averageReplyRate: 0,
        aiRecommendations: dashboard.aiInsights.recommendations,
      };
    }
    return dashboard.channels.find((c) => c.channel === selectedChannel) || dashboard.channels[0];
  }, [selectedChannel, dashboard]);

  const heatMapData = useMemo(() => {
    const data: Record<number, Record<number, HeatMapTimeSlot>> = {};
    channelData.timeSlots.forEach((slot) => {
      if (!data[slot.dayOfWeek]) {
        data[slot.dayOfWeek] = {};
      }
      data[slot.dayOfWeek][slot.hour] = slot;
    });
    return data;
  }, [channelData]);

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
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Mapa de Calor IA - Horarios Preferidos
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Visualiza los horarios óptimos de envío basados en IA para maximizar aperturas y respuestas
            </p>
          </div>
          <div className="flex gap-2">
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
            <Button size="sm" variant="primary" onClick={onApplyRecommendations}>
              Aplicar Recomendaciones
            </Button>
          </div>
        </div>

        {/* Channel Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={selectedChannel === 'all' ? 'primary' : 'secondary'}
            onClick={() => setSelectedChannel('all')}
          >
            Todos los Canales
          </Button>
          {dashboard.channels.map((channel) => {
            const channelInfo = channelLabel[channel.channel];
            return (
              <Button
                key={channel.channel}
                size="sm"
                variant={selectedChannel === channel.channel ? 'primary' : 'secondary'}
                onClick={() => setSelectedChannel(channel.channel)}
                leftIcon={channelInfo.icon}
              >
                {channelInfo.label}
              </Button>
            );
          })}
        </div>

        {/* Optimal/Worst Times Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} font-medium`}>
                Mejor Horario
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.overallOptimalTime.dayName} {dashboard.overallOptimalTime.hour}:00
            </p>
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
              Score: {dashboard.overallOptimalTime.score.toFixed(1)}/100
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} font-medium`}>
                Peor Horario
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.overallWorstTime.dayName} {dashboard.overallWorstTime.hour}:00
            </p>
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
              Score: {dashboard.overallWorstTime.score.toFixed(1)}/100
            </p>
          </div>
        </div>

        {/* Heat Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Mapa de Calor por Día y Hora
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={ds.color.textMuted}>Bajo</span>
              <div className="flex gap-1">
                {[0, 25, 50, 75, 100].map((score) => (
                  <div
                    key={score}
                    className={`w-6 h-6 rounded ${getScoreColor(score)}`}
                    style={{ opacity: getScoreIntensity(score) }}
                  />
                ))}
              </div>
              <span className={ds.color.textMuted}>Alto</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-xs font-medium text-slate-600 dark:text-slate-400 text-left">Hora</th>
                    {dayNames.map((day, index) => (
                      <th
                        key={index}
                        className={`p-2 text-xs font-medium text-slate-600 dark:text-slate-400 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          selectedDay === index ? 'bg-indigo-100 dark:bg-indigo-900/40' : ''
                        }`}
                        onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hour) => (
                    <tr key={hour}>
                      <td className="p-2 text-xs font-medium text-slate-600 dark:text-slate-400 text-right">
                        {hour}:00
                      </td>
                      {dayNames.map((_, dayIndex) => {
                        const slot = heatMapData[dayIndex]?.[hour];
                        if (!slot) {
                          return (
                            <td key={dayIndex} className="p-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                              <div className="w-full h-8 rounded" />
                            </td>
                          );
                        }
                        const colorClass = getScoreColor(slot.score);
                        const intensity = getScoreIntensity(slot.score);
                        return (
                          <td
                            key={dayIndex}
                            className={`p-1 border border-slate-200 dark:border-slate-700 relative group cursor-pointer ${
                              selectedDay === dayIndex ? 'ring-2 ring-indigo-500' : ''
                            }`}
                            title={`${slot.dayName} ${hour}:00 - Apertura: ${slot.openRate.toFixed(1)}%, Respuesta: ${slot.replyRate.toFixed(1)}%`}
                          >
                            <div
                              className={`w-full h-8 rounded ${colorClass} transition-all hover:scale-110`}
                              style={{ opacity: intensity }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs font-bold text-white drop-shadow">
                                {slot.score.toFixed(0)}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Optimal and Worst Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top 5 Horarios Óptimos
            </h3>
            <div className="space-y-2">
              {channelData.optimalSlots.map((slot, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="green">{slot.recommendation === 'optimal' ? 'Óptimo' : 'Bueno'}</Badge>
                      <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {slot.dayName} {slot.hour}:00
                      </span>
                    </div>
                    <span className={`${ds.typography.bodySmall} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {slot.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span>Apertura: {slot.openRate.toFixed(1)}%</span>
                    <span>Respuesta: {slot.replyRate.toFixed(1)}%</span>
                    <span>Envíos: {slot.totalSent}</span>
                  </div>
                  {slot.aiInsight && (
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
                      💡 {slot.aiInsight}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center gap-2`}>
              <TrendingDown className="w-5 h-5 text-red-600" />
              Top 5 Horarios a Evitar
            </h3>
            <div className="space-y-2">
              {channelData.worstSlots.map((slot, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="red">Evitar</Badge>
                      <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {slot.dayName} {slot.hour}:00
                      </span>
                    </div>
                    <span className={`${ds.typography.bodySmall} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {slot.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span>Apertura: {slot.openRate.toFixed(1)}%</span>
                    <span>Respuesta: {slot.replyRate.toFixed(1)}%</span>
                    <span>Envíos: {slot.totalSent}</span>
                  </div>
                  {slot.aiInsight && (
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
                      ⚠️ {slot.aiInsight}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Insights y Recomendaciones IA
            </h3>
          </div>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            {dashboard.aiInsights.summary}
          </p>
          <div className="space-y-3">
            <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-medium`}>
              Recomendaciones Accionables:
            </h4>
            <ul className="space-y-2">
              {dashboard.aiInsights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-300 mt-1">•</span>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {dashboard.aiInsights.trends.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-medium`}>
                Tendencias Detectadas:
              </h4>
              {dashboard.aiInsights.trends.map((trend, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 border ${
                    trend.impact === 'high'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : trend.impact === 'medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                    {trend.trend}
                  </p>
                  {trend.action && (
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      💡 Acción: {trend.action}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Última actualización: {new Date(dashboard.lastUpdated).toLocaleString('es-ES')}</span>
          </div>
          <span>Análisis IA: {new Date(dashboard.lastAIAnalysis).toLocaleString('es-ES')}</span>
        </div>
      </div>
    </Card>
  );
};

