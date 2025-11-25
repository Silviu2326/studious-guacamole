import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { AlarmClock, BotMessageSquare, MessageCircle, Signal, Smartphone } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { MessagingAutomation } from '../types';

const channelLabel: Record<MessagingAutomation['channel'], { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'blue', icon: <Signal className="w-3.5 h-3.5" /> },
};

interface MessagingAutomationsProps {
  automations: MessagingAutomation[];
  loading?: boolean;
  className?: string;
  onSelectAutomation?: (automationId: string) => void;
}

export const MessagingAutomations: React.FC<MessagingAutomationsProps> = ({ automations, loading = false, className = '', onSelectAutomation }) => {
  if (loading && automations.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-24`} />
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
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-200 flex items-center justify-center">
              <BotMessageSquare className="w-5 h-5 text-sky-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              SMS & WhatsApp automation
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Resumen de automatizaciones críticas con SLA en tiempo real.
          </p>
        </div>
        <Badge variant="blue" size="md" className="bg-cyan-100 text-cyan-800 border border-cyan-200">
          {automations.length} workflows
        </Badge>
      </div>

      <div className="space-y-4">
        {automations.map((automation) => {
          const channel = channelLabel[automation.channel];
          return (
            <div
              key={automation.id}
              onClick={() => onSelectAutomation?.(automation.id)}
              className={`rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f1a2d] dark:to-[#111f37] ${
                onSelectAutomation ? 'cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-colors' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {automation.name}
                    </h3>
                    <Badge variant={channel.variant} leftIcon={channel.icon}>
                      {channel.label}
                    </Badge>
                    <Badge variant={automation.status === 'running' ? 'green' : automation.status === 'paused' ? 'yellow' : 'gray'}>
                      {automation.status === 'running'
                        ? 'Live'
                        : automation.status === 'paused'
                        ? 'Pausado'
                        : automation.status === 'scheduled'
                        ? 'Programado'
                        : 'Borrador'}
                    </Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Trigger: {automation.trigger} · Owner: {automation.ownedBy}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-300">
                  <AlarmClock className="w-4 h-4" />
                  SLA {automation.SLA}
                </div>
              </div>

              {/* Resumen de métricas principales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Variantes</p>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.variantCount}
                  </p>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Audiencia</p>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {automation.audienceSize.toLocaleString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Response rate</p>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatPercentage(automation.responseRate)}
                  </p>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Último disparo</p>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                    {new Date(automation.lastTriggered).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};


