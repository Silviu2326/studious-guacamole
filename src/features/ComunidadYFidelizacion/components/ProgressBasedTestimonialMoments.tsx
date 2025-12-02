import { useState, useEffect } from 'react';
import { Target, TrendingUp, Clock, Send, X, CheckCircle2, Star, Activity, Award, Calendar } from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Textarea, Progress } from '../../../components/componentsreutilizables';
import { ProgressBasedMoment, TestimonialChannel } from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';

interface ProgressBasedTestimonialMomentsProps {
  loading?: boolean;
  onSendReminder?: (momentId: string, channel: TestimonialChannel) => void;
  onDismiss?: (momentId: string) => void;
  onRequestTestimonial?: (momentId: string) => void;
}

const MOMENT_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'objetivo-alcanzado': {
    label: 'Objetivo alcanzado',
    icon: <Target className="w-4 h-4" />,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  },
  'programa-completado': {
    label: 'Programa completado',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
  },
  'feedback-positivo': {
    label: 'Feedback positivo',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
  },
  'sesiones-completadas': {
    label: 'Sesiones completadas',
    icon: <Activity className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200',
  },
};

const ACTION_CONFIG: Record<string, { label: string; color: string; description: string }> = {
  'request-now': {
    label: 'Solicitar ahora',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
    description: 'Momentum alto - momento ideal para solicitar',
  },
  'wait-optimal': {
    label: 'Esperar momento óptimo',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
    description: 'Momentum bueno - esperar timing recomendado',
  },
  'schedule-follow-up': {
    label: 'Programar seguimiento',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
    description: 'Momentum moderado - programar para más adelante',
  },
};

export function ProgressBasedTestimonialMoments({
  loading: externalLoading,
  onSendReminder,
  onDismiss,
  onRequestTestimonial,
}: ProgressBasedTestimonialMomentsProps) {
  const [moments, setMoments] = useState<ProgressBasedMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState<ProgressBasedMoment | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderChannel, setReminderChannel] = useState<TestimonialChannel>('whatsapp');
  const [reminderMessage, setReminderMessage] = useState('');

  useEffect(() => {
    loadMoments();
  }, []);

  const loadMoments = async () => {
    setLoading(true);
    try {
      const data = await CommunityFidelizacionService.getProgressBasedMoments();
      setMoments(data);
    } catch (error) {
      console.error('Error cargando momentos basados en progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = () => {
    if (selectedMoment && onSendReminder) {
      onSendReminder(selectedMoment.id, reminderChannel);
      setIsReminderModalOpen(false);
      setSelectedMoment(null);
      setReminderMessage('');
    }
  };

  const handleDismiss = (momentId: string) => {
    if (onDismiss) {
      onDismiss(momentId);
    }
  };

  const handleRequestTestimonial = (momentId: string) => {
    if (onRequestTestimonial) {
      onRequestTestimonial(momentId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMomentumColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const pendingMoments = moments.filter((m) => m.status === 'pending' || m.status === 'notified');
  const sortedMoments = [...moments].sort((a, b) => b.momentumScore - a.momentumScore);

  if (loading || externalLoading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Momentos ideales según progreso real
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Detectamos momentos ideales para pedir testimonios basados en el progreso real de tus clientes:
              objetivos alcanzados, sesiones completadas y logros recientes.
            </p>
          </div>
          {pendingMoments.length > 0 && (
            <Badge variant="blue" size="sm" className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              {pendingMoments.length} momento{pendingMoments.length !== 1 ? 's' : ''} detectado
              {pendingMoments.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="mt-6">
          {sortedMoments.length === 0 ? (
            <div className="py-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay momentos ideales detectados basados en progreso real.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMoments.map((moment) => {
                const momentConfig = MOMENT_TYPE_CONFIG[moment.momentType] || MOMENT_TYPE_CONFIG['feedback-positivo'];
                const actionConfig = ACTION_CONFIG[moment.recommendedAction];
                const progressData = moment.progressData;

                return (
                  <div
                    key={moment.id}
                    className={`rounded-lg border p-4 transition-all ${
                      moment.status === 'pending' || moment.status === 'notified'
                        ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-900/10'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={momentConfig.color} size="sm">
                            <span className="flex items-center gap-1.5">
                              {momentConfig.icon}
                              {momentConfig.label}
                            </span>
                          </Badge>
                          <Badge className={actionConfig.color} size="sm">
                            {actionConfig.label}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${getMomentumColor(moment.momentumScore)}`} />
                            <span className={`text-sm font-semibold ${getMomentumColor(moment.momentumScore)}`}>
                              Momentum: {moment.momentumScore}/100
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{moment.clientName}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{moment.description}</p>
                        </div>

                        {/* Progreso del cliente */}
                        <div className="grid gap-3 md:grid-cols-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                          {/* Objetivos */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <Target className="w-3.5 h-3.5" />
                              Objetivos
                            </div>
                            {progressData.objectives.length > 0 ? (
                              <div className="space-y-1.5">
                                {progressData.objectives.slice(0, 2).map((obj) => (
                                  <div key={obj.id}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-slate-600 dark:text-slate-400 truncate">{obj.title}</span>
                                      <span className="text-slate-500 dark:text-slate-500">{obj.progress}%</span>
                                    </div>
                                    <Progress value={obj.progress} size="sm" />
                                  </div>
                                ))}
                                {progressData.objectives.length > 2 && (
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    +{progressData.objectives.length - 2} más
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 dark:text-slate-500">Sin objetivos registrados</p>
                            )}
                          </div>

                          {/* Sesiones y logros */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <Activity className="w-3.5 h-3.5" />
                              Actividad
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <div className="flex items-center justify-between">
                                <span>Sesiones completadas:</span>
                                <span className="font-semibold">{progressData.sessions.completed}</span>
                              </div>
                              {progressData.sessions.milestoneSessions.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5 text-amber-500" />
                                  <span>
                                    Hitos: {progressData.sessions.milestoneSessions.join(', ')} sesiones
                                  </span>
                                </div>
                              )}
                              {progressData.recentAchievements.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{progressData.recentAchievements.length} logro(s) reciente(s)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Métricas de progreso */}
                        {progressData.metrics && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                              {progressData.metrics.weightChange && (
                                <span>
                                  Peso: {progressData.metrics.weightChange > 0 ? '+' : ''}
                                  {progressData.metrics.weightChange.toFixed(1)} kg
                                </span>
                              )}
                              {progressData.metrics.strengthGains && (
                                <span>Fuerza: +{progressData.metrics.strengthGains}%</span>
                              )}
                              {progressData.metrics.enduranceGains && (
                                <span>Resistencia: +{progressData.metrics.enduranceGains}%</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Mensaje sugerido */}
                        {moment.suggestedMessage && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Mensaje sugerido:
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                              "{moment.suggestedMessage}"
                            </p>
                          </div>
                        )}

                        {/* Timing óptimo */}
                        {moment.optimalTiming && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Timing óptimo: {formatDate(moment.optimalTiming)}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Detectado: {formatDate(moment.detectedAt)}
                          </span>
                          {moment.notificationSentAt && (
                            <span>Notificado: {formatDate(moment.notificationSentAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(moment.status === 'pending' || moment.status === 'notified') && (
                          <>
                            {moment.recommendedAction === 'request-now' && (
                              <Button
                                size="sm"
                                leftIcon={<Send className="w-4 h-4" />}
                                onClick={() => handleRequestTestimonial(moment.id)}
                              >
                                Solicitar ahora
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<Send className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedMoment(moment);
                                setIsReminderModalOpen(true);
                                setReminderMessage(moment.suggestedMessage || '');
                              }}
                            >
                              Enviar recordatorio
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismiss(moment.id)}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setSelectedMoment(null);
          setReminderMessage('');
        }}
        title="Enviar recordatorio automático"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsReminderModalOpen(false);
                setSelectedMoment(null);
                setReminderMessage('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSendReminder} leftIcon={<Send className="w-4 h-4" />}>
              Enviar recordatorio
            </Button>
          </>
        }
      >
        {selectedMoment && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Cliente: {selectedMoment.clientName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedMoment.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className={ACTION_CONFIG[selectedMoment.recommendedAction].color} size="sm">
                  {ACTION_CONFIG[selectedMoment.recommendedAction].label}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Momentum: {selectedMoment.momentumScore}/100
                </span>
              </div>
            </div>
            <Select
              label="Canal de envío"
              value={reminderChannel}
              onChange={(e) => setReminderChannel(e.target.value as TestimonialChannel)}
              options={[
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Email', value: 'email' },
              ]}
            />
            <Textarea
              label="Mensaje del recordatorio"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              rows={4}
              placeholder="Escribe el mensaje que se enviará al cliente..."
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              El recordatorio se enviará automáticamente al cliente por el canal seleccionado.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

