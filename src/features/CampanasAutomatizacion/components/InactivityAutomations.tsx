import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Calendar, Clock, Mail, MessageCircle, Pause, Smartphone, TrendingUp, Users } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { InactivityAutomation, InactivityMessageType } from '../types';

const channelLabel: Record<'email' | 'whatsapp' | 'sms', { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
};

const messageTypeLabel: Record<InactivityMessageType, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; description: string }> = {
  motivational: { label: 'Motivacional', variant: 'blue', description: 'Mensaje motivacional' },
  'special-offer': { label: 'Oferta Especial', variant: 'orange', description: 'Oferta especial' },
  invitation: { label: 'Invitación', variant: 'green', description: 'Invitación a retomar' },
  'check-in': { label: 'Check-in', variant: 'purple', description: 'Seguimiento' },
};

interface InactivityAutomationsProps {
  automations: InactivityAutomation[];
  loading?: boolean;
  className?: string;
}

export const InactivityAutomations: React.FC<InactivityAutomationsProps> = ({ automations, loading = false, className = '' }) => {
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
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Automatización de Inactividad
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Detecta inactividad (sin sesiones en X días) y envía una secuencia progresiva de mensajes motivacionales, ofertas especiales o invitaciones a retomar, con posibilidad de pausar si el cliente responde
          </p>
        </div>
        <Badge variant="rose" size="md">
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
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Umbral: {automation.inactivityThresholdDays} días sin sesiones
                  </span>
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

            {/* Secuencia de mensajes */}
            <div className="mb-4">
              <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Secuencia progresiva ({automation.messages.length} mensajes):
              </p>
              <div className="space-y-2">
                {automation.messages
                  .sort((a, b) => a.step - b.step)
                  .map((message) => {
                    const channel = channelLabel[message.channel];
                    const type = messageTypeLabel[message.type];
                    return (
                      <div
                        key={message.id}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="purple" size="sm">
                                Paso {message.step}
                              </Badge>
                              <Badge variant={type.variant} size="sm">
                                {type.label}
                              </Badge>
                              <Badge variant={channel.variant} size="sm" leftIcon={channel.icon}>
                                {channel.label}
                              </Badge>
                              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                                Día {message.daysAfterInactivity}
                              </span>
                              {message.pauseOnResponse && (
                                <Badge variant="yellow" size="sm" leftIcon={<Pause className="w-3 h-3" />}>
                                  Pausa si responde
                                </Badge>
                              )}
                            </div>
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2`}>
                              {message.messageTemplate.substring(0, 120)}...
                            </p>
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
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Clientes activos</p>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-rose-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.activeClients.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Pausados</p>
                <div className="flex items-center gap-2 mt-1">
                  <Pause className="w-4 h-4 text-yellow-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.pausedClients.toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de respuesta</p>
                <div className="flex items-center gap-2 mt-1">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatPercentage(automation.responseRate)}
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de reactivación</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatPercentage(automation.reactivationRate)}
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

