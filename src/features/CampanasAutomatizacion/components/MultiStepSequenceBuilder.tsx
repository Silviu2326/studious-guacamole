import React from 'react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import { 
  Workflow, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Clock, 
  Pause, 
  Play, 
  Plus, 
  GitBranch,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { MultiStepSequence, MessagingChannel, DelayUnit, CampaignStatus } from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const statusLabel: Record<CampaignStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  draft: { label: 'Borrador', variant: 'gray' },
  scheduled: { label: 'Programada', variant: 'blue' },
  running: { label: 'Activa', variant: 'green' },
  paused: { label: 'Pausada', variant: 'yellow' },
  completed: { label: 'Completada', variant: 'gray' },
};

const triggerLabel: Record<string, string> = {
  'new-client': 'Nuevo Cliente',
  'first-session-booked': 'Primera Sesión Agendada',
  'inactivity': 'Inactividad',
  'custom-event': 'Evento Personalizado',
  'manual': 'Manual',
};

const delayUnitLabel: Record<DelayUnit, string> = {
  minutes: 'minutos',
  hours: 'horas',
  days: 'días',
};

interface MultiStepSequenceBuilderProps {
  sequences: MultiStepSequence[];
  loading?: boolean;
  className?: string;
  onCreateNew?: () => void;
  onEdit?: (sequenceId: string) => void;
  onPause?: (sequenceId: string) => void;
  onResume?: (sequenceId: string) => void;
}

export const MultiStepSequenceBuilder: React.FC<MultiStepSequenceBuilderProps> = ({ 
  sequences, 
  loading = false, 
  className = '',
  onCreateNew,
  onEdit,
  onPause,
  onResume,
}) => {
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
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-violet-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Constructor de Secuencias Multi-Paso
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Constructor de secuencias de múltiples pasos con lógica condicional (si responde X, enviar Y), delays entre mensajes, y posibilidad de pausar si el cliente responde o toma acción
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="violet" size="md">
            {sequences.length} secuencias
          </Badge>
          {onCreateNew && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onCreateNew}
            >
              Nueva Secuencia
            </Button>
          )}
        </div>
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
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.name}
                    </h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                    {sequence.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Trigger: {triggerLabel[sequence.trigger] || sequence.trigger}
                    </span>
                    {sequence.triggerCondition && (
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Condición: {sequence.triggerCondition.type} = {sequence.triggerCondition.value}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(sequence.id)}
                    >
                      Editar
                    </Button>
                  )}
                  {sequence.status === 'running' && onPause && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Pause className="w-4 h-4" />}
                      onClick={() => onPause(sequence.id)}
                    >
                      Pausar
                    </Button>
                  )}
                  {sequence.status === 'paused' && onResume && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Play className="w-4 h-4" />}
                      onClick={() => onResume(sequence.id)}
                    >
                      Reanudar
                    </Button>
                  )}
                </div>
              </div>

              {/* Pasos de la secuencia */}
              <div className="mb-4">
                <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
                  Pasos de la secuencia ({sequence.steps.length}):
                </p>
                <div className="space-y-3">
                  {sequence.steps
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map((step, index) => {
                      const channel = channelLabel[step.channel];
                      const isLast = index === sequence.steps.length - 1;
                      return (
                        <div key={step.id} className="relative">
                          {/* Línea conectora */}
                          {!isLast && (
                            <div className="absolute left-5 top-12 w-0.5 h-6 bg-gradient-to-b from-violet-300 to-violet-200 dark:from-violet-600 dark:to-violet-700" />
                          )}
                          
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/30">
                            <div className="flex items-start gap-3">
                              {/* Número de paso */}
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center border-2 border-violet-300 dark:border-violet-700">
                                <span className={`${ds.typography.bodySmall} font-bold text-violet-700 dark:text-violet-300`}>
                                  {step.stepNumber}
                                </span>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                                    {step.name}
                                  </span>
                                  <Badge variant={channel.variant} size="sm" leftIcon={channel.icon}>
                                    {channel.label}
                                  </Badge>
                                  {step.delay && (
                                    <Badge variant="gray" size="sm" leftIcon={<Clock className="w-3 h-3" />}>
                                      Delay: {step.delay.value} {delayUnitLabel[step.delay.unit]}
                                    </Badge>
                                  )}
                                  {step.pauseOnResponse && (
                                    <Badge variant="yellow" size="sm" leftIcon={<Pause className="w-3 h-3" />}>
                                      Pausa si responde
                                    </Badge>
                                  )}
                                  {step.pauseOnAction && (
                                    <Badge variant="orange" size="sm" leftIcon={<Pause className="w-3 h-3" />}>
                                      Pausa si actúa
                                    </Badge>
                                  )}
                                  {step.conditionalRules && step.conditionalRules.length > 0 && (
                                    <Badge variant="purple" size="sm" leftIcon={<GitBranch className="w-3 h-3" />}>
                                      {step.conditionalRules.length} regla{step.conditionalRules.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  {!step.isActive && (
                                    <Badge variant="gray" size="sm">
                                      Inactivo
                                    </Badge>
                                  )}
                                </div>
                                
                                {step.description && (
                                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                                    {step.description}
                                  </p>
                                )}
                                
                                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2 mb-2`}>
                                  {step.messageTemplate.substring(0, 150)}
                                  {step.messageTemplate.length > 150 && '...'}
                                </p>

                                {/* Reglas condicionales */}
                                {step.conditionalRules && step.conditionalRules.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {step.conditionalRules.map((rule) => (
                                      <div
                                        key={rule.id}
                                        className="rounded-md bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-2"
                                      >
                                        <div className="flex items-center gap-2">
                                          <GitBranch className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                          <span className={`${ds.typography.caption} text-purple-700 dark:text-purple-300`}>
                                            Si {rule.condition.type} {rule.condition.operator} "{rule.condition.value}" → {rule.thenAction.type === 'send-message' ? 'Enviar mensaje' : rule.thenAction.type === 'jump-to-step' ? `Saltar al paso ${rule.thenAction.stepId}` : rule.thenAction.type === 'pause-sequence' ? 'Pausar secuencia' : rule.thenAction.type === 'end-sequence' ? 'Finalizar secuencia' : 'Saltar paso'}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Clientes activos</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-violet-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.activeClients}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Pausados</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Pause className="w-4 h-4 text-yellow-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.pausedClients}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de finalización</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.completionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tiempo promedio</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.averageCompletionTime.toFixed(1)} días
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa de respuesta</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.responseRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sequences.length === 0 && !loading && (
        <div className="text-center py-12">
          <Workflow className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
            No hay secuencias configuradas aún
          </p>
          {onCreateNew && (
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onCreateNew}
            >
              Crear Primera Secuencia
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

