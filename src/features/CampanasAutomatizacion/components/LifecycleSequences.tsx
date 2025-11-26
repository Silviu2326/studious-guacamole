import React, { useState } from 'react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import { Clock3, Flag, Navigation, Workflow, Zap, Sparkles, Plus, Users, TrendingUp, Filter, Download } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { LifecycleSequence, PostLeadMagnetSequence, LeadMagnetFunnel, MessagingChannel } from '../types';

const goalLabel: Record<LifecycleSequence['goal'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  activation: { label: 'Activación', variant: 'blue' },
  retention: { label: 'Retención', variant: 'green' },
  upsell: { label: 'Upsell', variant: 'purple' },
  'winback': { label: 'Winback', variant: 'orange' },
  'churn-prevention': { label: 'Anti-churn', variant: 'red' },
};

interface LifecycleSequencesProps {
  sequences: LifecycleSequence[];
  postLeadMagnetSequences?: PostLeadMagnetSequence[];
  leadMagnetFunnels?: LeadMagnetFunnel[];
  loading?: boolean;
  className?: string;
  onGeneratePostLeadMagnetSequence?: (funnelId: string) => void;
  onEditPostLeadMagnetSequence?: (sequence: PostLeadMagnetSequence) => void;
  onViewPostLeadMagnetSequence?: (sequenceId: string) => void;
  onSelectSequence?: (sequenceId: string) => void;
}

const funnelTypeLabels: Record<LeadMagnetFunnel['type'], { label: string; icon: React.ReactNode }> = {
  ebook: { label: 'Ebook', icon: <Workflow className="w-4 h-4" /> },
  calculator: { label: 'Calculadora', icon: <Workflow className="w-4 h-4" /> },
  challenge: { label: 'Desafío', icon: <Workflow className="w-4 h-4" /> },
  quiz: { label: 'Quiz', icon: <Workflow className="w-4 h-4" /> },
  'video-series': { label: 'Serie de Videos', icon: <Workflow className="w-4 h-4" /> },
  workshop: { label: 'Workshop', icon: <Workflow className="w-4 h-4" /> },
  other: { label: 'Otro', icon: <Workflow className="w-4 h-4" /> },
};

export const LifecycleSequences: React.FC<LifecycleSequencesProps> = ({ 
  sequences, 
  postLeadMagnetSequences = [],
  leadMagnetFunnels = [],
  loading = false, 
  className = '',
  onGeneratePostLeadMagnetSequence,
  onEditPostLeadMagnetSequence,
  onViewPostLeadMagnetSequence,
  onSelectSequence,
}) => {
  const [showPostLeadMagnet, setShowPostLeadMagnet] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('');
  if (loading && sequences.length === 0) {
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

  const formatDelay = (delay: { value: number; unit: 'hours' | 'days' }) => {
    if (delay.unit === 'hours') {
      return delay.value === 1 ? '1 hora' : `${delay.value} horas`;
    }
    return delay.value === 1 ? '1 día' : `${delay.value} días`;
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Lifecycle email sequences
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Analiza automatizaciones por objetivo y detecta cuellos de botella.
          </p>
        </div>
        <Badge variant="green" size="md">
          {sequences.length} flujos
        </Badge>
      </div>

      {/* Secuencias automáticas post lead magnet - US-CA-05 */}
      {leadMagnetFunnels.length > 0 && (
        <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Secuencias Post Lead Magnet
              </h3>
              <Badge variant="indigo" size="sm">
                {postLeadMagnetSequences.length} secuencias
              </Badge>
            </div>
            <button
              onClick={() => setShowPostLeadMagnet(!showPostLeadMagnet)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {showPostLeadMagnet ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            La IA propone secuencias automáticas post lead magnet para dar seguimiento coherente con el funnel. Importa datos del funnel seleccionado y genera mensajes y delays recomendados, con ajustes por buyer persona.
          </p>

          {showPostLeadMagnet && (
            <>
              {/* Generar nueva secuencia */}
              <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Generar nueva secuencia automática
                  </h4>
                </div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                  Selecciona un funnel y la IA generará una secuencia automática con mensajes y delays recomendados.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={selectedFunnel}
                    onChange={(e) => setSelectedFunnel(e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un funnel...</option>
                    {leadMagnetFunnels.map((funnel) => (
                      <option key={funnel.id} value={funnel.id}>
                        {funnel.name} ({funnelTypeLabels[funnel.type].label}) - {funnel.leadCount} leads
                      </option>
                    ))}
                  </select>
                  {onGeneratePostLeadMagnetSequence && selectedFunnel && (
                    <Button
                      onClick={() => {
                        onGeneratePostLeadMagnetSequence(selectedFunnel);
                        setSelectedFunnel('');
                      }}
                      leftIcon={<Sparkles className="w-4 h-4" />}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Generar con IA
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de secuencias post lead magnet */}
              {postLeadMagnetSequences.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                    No hay secuencias post lead magnet creadas
                  </p>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Selecciona un funnel arriba y genera tu primera secuencia automática con IA
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postLeadMagnetSequences.map((sequence) => {
                    const funnelTypeInfo = funnelTypeLabels[sequence.funnelType];
                    return (
                      <div
                        key={sequence.id}
                        className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                                {sequence.name}
                              </h4>
                              {sequence.aiGenerated && (
                                <Badge variant="purple" size="sm">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generada por IA
                                </Badge>
                              )}
                              <Badge variant={sequence.status === 'running' ? 'green' : 'yellow'} size="sm">
                                {sequence.status === 'running' ? 'Activa' : 'Pausada'}
                              </Badge>
                            </div>
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
                              {sequence.description}
                            </p>
                            <div className="flex items-center gap-4 flex-wrap text-sm">
                              <div className="flex items-center gap-1">
                                <Workflow className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                                  Funnel: {sequence.funnelName}
                                </span>
                                <Badge variant="gray" size="sm" className="ml-1">
                                  {funnelTypeInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                                  {sequence.activeLeads} leads activos
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {sequence.conversionRate.toFixed(1)}% conversión
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resumen de pasos */}
                        <div className="mb-4">
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            {sequence.steps.length} pasos configurados
                          </p>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Completados</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Flag className="w-4 h-4 text-indigo-500" />
                              <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                                {sequence.completedLeads}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tasa finalización</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock3 className="w-4 h-4 text-sky-500" />
                              <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                                {CampanasAutomatizacionService.formatPercentage(sequence.completionRate)}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Convertidos</p>
                            <div className="flex items-center gap-2 mt-1">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                                {sequence.convertedLeads}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Tiempo promedio</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock3 className="w-4 h-4 text-emerald-500" />
                              <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                                {sequence.averageTimeToConvert.toFixed(1)} días
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Buyer personas */}
                        {sequence.buyerPersonas.length > 0 && (
                          <div className="mb-4">
                            <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                              Buyer personas:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {sequence.buyerPersonas.map((persona, idx) => (
                                <Badge key={idx} variant="indigo" size="sm">
                                  {persona}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {onViewPostLeadMagnetSequence && (
                            <button
                              onClick={() => onViewPostLeadMagnetSequence(sequence.id)}
                              className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                              Ver detalles
                            </button>
                          )}
                          {onEditPostLeadMagnetSequence && (
                            <button
                              onClick={() => onEditPostLeadMagnetSequence(sequence)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="space-y-4">
        {sequences.map((sequence) => {
          const goal = goalLabel[sequence.goal];
          return (
            <div
              key={sequence.id}
              onClick={() => onSelectSequence?.(sequence.id)}
              className={`rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30] ${
                onSelectSequence ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.name}
                    </h3>
                    <Badge variant={goal.variant}>{goal.label}</Badge>
                    <Badge variant={sequence.status === 'running' ? 'green' : 'yellow'}>
                      {sequence.status === 'running' ? 'Live' : 'Programada'}
                    </Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {sequence.steps} pasos · {sequence.activeContacts.toLocaleString('es-ES')} contactos activos
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                  Score automatización {sequence.automationScore}%
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Completion rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Flag className="w-4 h-4 text-indigo-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatPercentage(sequence.completionRate)}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Time to convert</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock3 className="w-4 h-4 text-sky-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatDuration(sequence.avgTimeToConvert * 60)}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Última optimización
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Navigation className="w-4 h-4 text-emerald-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {sequence.lastOptimization}
                    </span>
                  </div>
                </div>
              </div>

              {sequence.bottleneckStep && (
                <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-3 flex flex-wrap items-start gap-3">
                  <span className={`${ds.typography.caption} text-amber-600 dark:text-amber-300 uppercase tracking-[0.2em]`}>
                    Botella de conversión
                  </span>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                    Revisar el paso {sequence.bottleneckStep}: baja tasa de clic. Sugerencia: duplicar mensaje en WhatsApp y añadir micro video.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};










