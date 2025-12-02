import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Calendar, Clock, Gift, Mail, MessageCircle, Smartphone, Sparkles, TrendingUp } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { ImportantDateAutomation, ImportantDateType } from '../types';

const channelLabel: Record<'email' | 'whatsapp' | 'sms', { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
};

const dateTypeLabel: Record<ImportantDateType, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  birthday: { label: 'Cumpleaños', variant: 'pink', icon: <Sparkles className="w-3.5 h-3.5" /> },
  anniversary: { label: 'Aniversario', variant: 'purple', icon: <Calendar className="w-3.5 h-3.5" /> },
  milestone: { label: 'Hito', variant: 'blue', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  custom: { label: 'Personalizada', variant: 'gray', icon: <Calendar className="w-3.5 h-3.5" /> },
};

interface ImportantDateAutomationsProps {
  automations: ImportantDateAutomation[];
  loading?: boolean;
  className?: string;
}

export const ImportantDateAutomations: React.FC<ImportantDateAutomationsProps> = ({ automations, loading = false, className = '' }) => {
  if (loading && automations.length === 0) {
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

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center">
              <Gift className="w-5 h-5 text-violet-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Fechas Importantes
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Sistema que detecta fechas importantes de cada cliente y envía mensajes personalizados automáticamente, con posibilidad de incluir ofertas especiales o recordatorios de sesiones
          </p>
        </div>
        <Badge variant="violet" size="md">
          {automations.length} automatizaciones
        </Badge>
      </div>

      <div className="space-y-4">
        {automations.map((automation) => (
          <div
            key={automation.id}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {automation.name}
                  </h3>
                  <Badge variant={automation.isActive ? 'green' : 'gray'}>
                    {automation.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                  {automation.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Último disparo: {new Date(automation.lastTriggered).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Mensajes por tipo de fecha */}
            <div className="mb-4">
              <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Mensajes por tipo de fecha ({automation.messages.length}):
              </p>
              <div className="space-y-2">
                {automation.messages.map((message) => {
                  const channel = channelLabel[message.channel];
                  const dateType = dateTypeLabel[message.dateType];
                  return (
                    <div
                      key={message.id}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={dateType.variant} size="sm" leftIcon={dateType.icon}>
                              {dateType.label}
                            </Badge>
                            <Badge variant={channel.variant} size="sm" leftIcon={channel.icon}>
                              {channel.label}
                            </Badge>
                            {message.includeSpecialOffer && (
                              <Badge variant="orange" size="sm" leftIcon={<Gift className="w-3 h-3" />}>
                                Con oferta
                              </Badge>
                            )}
                            {message.includeSessionReminder && (
                              <Badge variant="blue" size="sm" leftIcon={<Calendar className="w-3 h-3" />}>
                                Con recordatorio
                              </Badge>
                            )}
                            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                              {message.sendDaysBefore !== undefined && message.sendDaysBefore > 0
                                ? `${message.sendDaysBefore} días antes`
                                : 'El mismo día'} a las {message.sendTime}
                            </span>
                          </div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2`}>
                            {message.messageTemplate.substring(0, 120)}...
                          </p>
                          {message.specialOfferTemplate && (
                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimaryDark} mb-1`}>
                                Oferta especial:
                              </p>
                              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-1`}>
                                {message.specialOfferTemplate.substring(0, 100)}...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Fechas activas</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.activeDates.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Próximas (30 días)</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.upcomingDates.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Enviados este mes</p>
                <div className="flex items-center gap-2 mt-1">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.sentThisMonth.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de respuesta</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatPercentage(automation.responseRate)}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Última actualización</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {new Date(automation.updatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

