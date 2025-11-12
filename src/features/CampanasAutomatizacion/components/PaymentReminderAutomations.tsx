import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Calendar, Clock, DollarSign, Mail, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { PaymentReminderAutomation, PaymentReminderTone } from '../types';

const channelLabel: Record<'email' | 'whatsapp', { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const toneLabel: Record<PaymentReminderTone, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; description: string }> = {
  friendly: { label: 'Amigable', variant: 'blue', description: 'Próximo a vencer o 1 día de retraso' },
  gentle: { label: 'Suave', variant: 'yellow', description: '2-5 días de retraso' },
  urgent: { label: 'Urgente', variant: 'red', description: 'Más de 5 días de retraso' },
};

interface PaymentReminderAutomationsProps {
  automations: PaymentReminderAutomation[];
  loading?: boolean;
  className?: string;
}

export const PaymentReminderAutomations: React.FC<PaymentReminderAutomationsProps> = ({ automations, loading = false, className = '' }) => {
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
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Recordatorios de Pagos
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Automatización que detecta pagos pendientes o próximos a vencer y envía recordatorios amables por WhatsApp o email, con diferentes mensajes según los días de retraso
          </p>
        </div>
        <Badge variant="green" size="md">
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

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Activos
                  </span>
                </div>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {automation.activeReminders}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Este mes
                  </span>
                </div>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {automation.sentThisMonth}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Recuperación
                  </span>
                </div>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {automation.paymentRecoveryRate.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Respuesta
                  </span>
                </div>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {automation.responseRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Mensajes por días de retraso */}
            <div className="mb-4">
              <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Mensajes por días de retraso ({automation.messages.length}):
              </p>
              <div className="space-y-2">
                {automation.messages
                  .sort((a, b) => a.daysDelay - b.daysDelay)
                  .map((message) => {
                    const channel = channelLabel[message.channel];
                    const tone = toneLabel[message.tone];
                    return (
                      <div
                        key={message.id}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800/30"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={tone.variant} size="sm">
                              {tone.label}
                            </Badge>
                            <Badge variant={channel.variant} size="sm">
                              <span className="flex items-center gap-1">
                                {channel.icon}
                                {channel.label}
                              </span>
                            </Badge>
                            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                              {message.daysDelay === 0 ? 'Próximo a vencer' : message.daysDelay === 1 ? '1 día vencido' : `${message.daysDelay} días vencidos`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {message.sendTime}
                          </div>
                        </div>
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} whitespace-pre-wrap`}>
                          {message.messageTemplate}
                        </p>
                        {message.variables.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} text-xs`}>
                              Variables:
                            </span>
                            {message.variables.map((variable, idx) => (
                              <Badge key={idx} variant="gray" size="xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

