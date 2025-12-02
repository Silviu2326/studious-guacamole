import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Calendar, Mail, MessageCircle, Sparkles, Users } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { WelcomeSequence } from '../types';

const channelLabel: Record<'email' | 'whatsapp', { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const statusLabel: Record<string, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  running: { label: 'Activa', variant: 'green' },
  paused: { label: 'Pausada', variant: 'yellow' },
  scheduled: { label: 'Programada', variant: 'blue' },
  draft: { label: 'Borrador', variant: 'gray' },
  completed: { label: 'Completada', variant: 'gray' },
};

interface WelcomeSequencesProps {
  sequences: WelcomeSequence[];
  loading?: boolean;
  className?: string;
}

export const WelcomeSequences: React.FC<WelcomeSequencesProps> = ({ sequences, loading = false, className = '' }) => {
  if (loading && sequences.length === 0) {
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
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Secuencias de Bienvenida
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Mensajes automáticos programados para nuevos clientes (día 1: bienvenida, día 2: qué esperar, día 3: preparación primera sesión)
          </p>
        </div>
        <Badge variant="emerald" size="md">
          {sequences.length} secuencias
        </Badge>
      </div>

      <div className="space-y-4">
        {sequences.map((sequence) => {
          const status = statusLabel[sequence.status] || statusLabel.draft;
          return (
            <div
              key={sequence.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.name}
                    </h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                    {sequence.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Trigger: {sequence.trigger === 'new-client' ? 'Nuevo cliente' : sequence.trigger === 'first-session-booked' ? 'Primera sesión agendada' : 'Manual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensajes de la secuencia */}
              <div className="mb-4">
                <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                  Mensajes programados ({sequence.messages.length}):
                </p>
                <div className="space-y-2">
                  {sequence.messages
                    .sort((a, b) => a.day - b.day)
                    .map((message) => {
                      const channel = channelLabel[message.channel];
                      return (
                        <div
                          key={message.id}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/30"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="purple" size="sm">
                                  Día {message.day}
                                </Badge>
                                <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                                  {message.title}
                                </span>
                                <Badge variant={channel.variant} size="sm" leftIcon={channel.icon}>
                                  {channel.label}
                                </Badge>
                              </div>
                              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2`}>
                                {message.messageTemplate.substring(0, 100)}...
                              </p>
                            </div>
                            {message.scheduledTime && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="w-3 h-3" />
                                {message.scheduledTime}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Clientes activos</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {sequence.activeClients.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de finalización</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatPercentage(sequence.completionRate)}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Última actualización</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {new Date(sequence.updatedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

