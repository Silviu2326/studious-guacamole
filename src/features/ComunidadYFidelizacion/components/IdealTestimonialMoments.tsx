import { useState } from 'react';
import { Bell, Target, CheckCircle2, MessageCircle, Star, X, Send, Clock } from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Textarea } from '../../../components/componentsreutilizables';
import { IdealTestimonialMoment, IdealMomentType, TestimonialChannel } from '../types';

interface IdealTestimonialMomentsProps {
  moments: IdealTestimonialMoment[];
  loading?: boolean;
  onSendReminder?: (momentId: string, channel: TestimonialChannel) => void;
  onDismiss?: (momentId: string) => void;
  onRequestTestimonial?: (momentId: string) => void;
}

const MOMENT_TYPE_CONFIG: Record<IdealMomentType, { label: string; icon: React.ReactNode; color: string }> = {
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
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200',
  },
};

const STATUS_CONFIG: Record<IdealTestimonialMoment['status'], { label: string; color: string }> = {
  pending: {
    label: 'Pendiente',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  },
  notified: {
    label: 'Notificado',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
  },
  sent: {
    label: 'Enviado',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  },
  dismissed: {
    label: 'Descartado',
    color: 'bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-500',
  },
};

export function IdealTestimonialMoments({
  moments,
  loading,
  onSendReminder,
  onDismiss,
  onRequestTestimonial,
}: IdealTestimonialMomentsProps) {
  const [selectedMoment, setSelectedMoment] = useState<IdealTestimonialMoment | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderChannel, setReminderChannel] = useState<TestimonialChannel>('whatsapp');
  const [reminderMessage, setReminderMessage] = useState('');

  const pendingMoments = moments.filter((m) => m.status === 'pending' || m.status === 'notified');
  const recentMoments = moments.slice(0, 5);

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

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Momentos ideales para testimonios
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              El sistema detecta automáticamente cuando un cliente alcanza un objetivo, completa un programa, da
              feedback positivo o cumple X sesiones y te sugiere solicitar un testimonio.
            </p>
          </div>
          {pendingMoments.length > 0 && (
            <Badge variant="blue" size="sm" className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              {pendingMoments.length} pendiente{pendingMoments.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : recentMoments.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay momentos ideales detectados recientemente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMoments.map((moment) => {
                const momentConfig = MOMENT_TYPE_CONFIG[moment.momentType];
                const statusConfig = STATUS_CONFIG[moment.status];
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
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={momentConfig.color} size="sm">
                            <span className="flex items-center gap-1.5">
                              {momentConfig.icon}
                              {momentConfig.label}
                            </span>
                          </Badge>
                          <Badge className={statusConfig.color} size="sm">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{moment.clientName}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{moment.description}</p>
                        </div>
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
                            <Button
                              size="sm"
                              leftIcon={<Send className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedMoment(moment);
                                setIsReminderModalOpen(true);
                                setReminderMessage(
                                  `Hola ${moment.clientName}, nos encantaría conocer tu experiencia. ¿Podrías compartir un testimonio?`,
                                );
                              }}
                            >
                              Enviar recordatorio
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRequestTestimonial(moment.id)}
                            >
                              Solicitar ahora
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

