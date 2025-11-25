import React from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { 
  ArrowLeft, 
  BotMessageSquare, 
  MessageCircle, 
  Signal, 
  Smartphone,
  Settings,
  BarChart3,
  Code,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { MessagingAutomation } from '../types';

const channelLabel: Record<MessagingAutomation['channel'], { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-4 h-4" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-4 h-4" /> },
  push: { label: 'Push', variant: 'blue', icon: <Signal className="w-4 h-4" /> },
};

interface MessagingAutomationDetailProps {
  automation: MessagingAutomation;
  onBack: () => void;
  className?: string;
}

export const MessagingAutomationDetail: React.FC<MessagingAutomationDetailProps> = ({ 
  automation, 
  onBack, 
  className = '' 
}) => {
  const channel = channelLabel[automation.channel];

  return (
    <div className={className}>
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Volver a la lista
        </Button>
      </div>

      {/* Información principal */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-200 flex items-center justify-center">
                <BotMessageSquare className="w-6 h-6 text-sky-600" />
              </span>
              <div>
                <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {automation.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
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
              </div>
            </div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
              Trigger: <strong>{automation.trigger}</strong> · Owner: <strong>{automation.ownedBy}</strong>
            </p>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-500" />
              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Audiencia</p>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {automation.audienceSize.toLocaleString('es-ES')}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Response Rate</p>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {CampanasAutomatizacionService.formatPercentage(automation.responseRate)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-slate-500" />
              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Variantes</p>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {automation.variantCount}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>SLA</p>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {automation.SLA}
            </p>
          </div>
        </div>

        {/* Última activación */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className={`${ds.typography.bodySmall} font-semibold text-blue-900 dark:text-blue-100`}>
              Último disparo
            </p>
          </div>
          <p className={`${ds.typography.body} text-blue-800 dark:text-blue-200`}>
            {new Date(automation.lastTriggered).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </Card>

      {/* Configuración detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variantes y mensajes */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Variantes de mensaje
            </h2>
          </div>
          <div className="space-y-3">
            {Array.from({ length: automation.variantCount }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="blue" size="sm">
                    Variante {index + 1}
                  </Badge>
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {index === 0 ? 'Control' : 'Test'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Plantilla de mensaje configurada para {channel.label}
                  </p>
                  <div className="mt-2 rounded-md bg-slate-50 dark:bg-slate-900/50 p-3">
                    <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} font-mono`}>
                      [Contenido del mensaje variante {index + 1}]
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Condiciones y reglas */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Condiciones y reglas
            </h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Trigger principal
                </p>
              </div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {automation.trigger}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Segmento objetivo
                </p>
              </div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Audiencia de {automation.audienceSize.toLocaleString('es-ES')} contactos
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  SLA configurado
                </p>
              </div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {automation.SLA}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mejora sugerida */}
      {automation.recommendedImprovement && (
        <Card className="mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
            <div className="flex-1">
              <h3 className={`${ds.typography.h3} text-cyan-900 dark:text-cyan-100 mb-2`}>
                Mejora sugerida
              </h3>
              <p className={`${ds.typography.body} text-cyan-800 dark:text-cyan-200`}>
                {automation.recommendedImprovement}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" size="md">
          Editar automatización
        </Button>
        <Button variant="secondary" size="md">
          Ver estadísticas completas
        </Button>
        {automation.status === 'running' ? (
          <Button variant="secondary" size="md">
            Pausar automatización
          </Button>
        ) : (
          <Button variant="secondary" size="md">
            Activar automatización
          </Button>
        )}
      </div>
    </div>
  );
};

