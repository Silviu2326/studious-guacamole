import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  User,
  Calendar,
  TrendingDown,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../../../components/componentsreutilizables';
import { NegativeFeedbackAlert, ClientHistory, Session, ActionSuggestion } from '../types';

interface NegativeFeedbackAlertsProps {
  alerts: NegativeFeedbackAlert[];
  loading?: boolean;
  onContactClient?: (clientId: string, channel: 'whatsapp' | 'email' | 'phone') => void;
  onResolveAlert?: (alertId: string) => void;
  onViewClientHistory?: (clientId: string) => void;
}

export function NegativeFeedbackAlerts({
  alerts,
  loading,
  onContactClient,
  onResolveAlert,
  onViewClientHistory,
}: NegativeFeedbackAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<NegativeFeedbackAlert | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const urgentAlerts = alerts.filter((a) => a.status === 'pending' && a.priority === 'urgent');
  const recentAlerts = alerts.filter((a) => a.status === 'pending').slice(0, 5);

  const handleViewDetails = (alert: NegativeFeedbackAlert) => {
    setSelectedAlert(alert);
    setIsDetailModalOpen(true);
  };

  const handleContact = (channel: 'whatsapp' | 'email' | 'phone') => {
    if (selectedAlert && onContactClient) {
      onContactClient(selectedAlert.clientId, channel);
    }
  };

  const handleResolve = () => {
    if (selectedAlert && onResolveAlert) {
      onResolveAlert(selectedAlert.id);
      setIsDetailModalOpen(false);
      setSelectedAlert(null);
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

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= score
                ? 'text-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{score}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ))}
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
              <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Alertas de Feedback Negativo
              </h3>
              {urgentAlerts.length > 0 && (
                <Badge variant="destructive" size="sm">
                  {urgentAlerts.length} urgente{urgentAlerts.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Notificaciones cuando un cliente da puntuación baja (&lt;3 estrellas) o comentario negativo
            </p>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="mt-6 py-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-300 dark:text-emerald-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay alertas de feedback negativo pendientes.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
                  alert.priority === 'urgent'
                    ? 'border-rose-300 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-900/20'
                    : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-900/10'
                }`}
                onClick={() => handleViewDetails(alert)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{alert.clientName}</h4>
                      {alert.priority === 'urgent' && (
                        <Badge variant="destructive" size="sm">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Urgente
                        </Badge>
                      )}
                      <Badge variant="secondary" size="sm">
                        {formatDate(alert.detectedAt)}
                      </Badge>
                    </div>
                    {alert.rating && (
                      <div className="flex items-center gap-2">
                        {renderStars(alert.rating)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Puntuación: {alert.rating}/5
                        </span>
                      </div>
                    )}
                    {alert.comment && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        &quot;{alert.comment}&quot;
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Sesión: {formatDate(alert.sessionDate)}
                      </span>
                      {alert.notificationChannels && alert.notificationChannels.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          Notificado: {alert.notificationChannels.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(alert);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal de detalles */}
      <Modal
        isOpen={isDetailModalOpen && selectedAlert !== null}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAlert(null);
        }}
        title={`Alerta: ${selectedAlert?.clientName}`}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
              Cerrar
            </Button>
            {selectedAlert && onResolveAlert && (
              <Button variant="ghost" onClick={handleResolve} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                Marcar como resuelto
              </Button>
            )}
          </>
        }
      >
        {selectedAlert && (
          <div className="space-y-6">
            {/* Información del feedback */}
            <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-900/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">Feedback Negativo Detectado</h4>
                  {selectedAlert.rating && (
                    <div className="mb-2">
                      {renderStars(selectedAlert.rating)}
                      <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
                        Puntuación: {selectedAlert.rating}/5 estrellas
                      </p>
                    </div>
                  )}
                  {selectedAlert.comment && (
                    <p className="text-sm text-rose-800 dark:text-rose-200 bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                      &quot;{selectedAlert.comment}&quot;
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-rose-600 dark:text-rose-400">
                    <span>Sesión: {formatDate(selectedAlert.sessionDate)}</span>
                    <span>Detectado: {formatDate(selectedAlert.detectedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial del cliente */}
            {selectedAlert.clientHistory && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Historial del Cliente
                </h4>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Sesiones totales</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {selectedAlert.clientHistory.totalSessions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Satisfacción promedio</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {selectedAlert.clientHistory.averageSatisfaction?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Días como cliente</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {selectedAlert.clientHistory.daysAsClient}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Última sesión</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatDate(selectedAlert.clientHistory.lastSessionDate)}
                      </p>
                    </div>
                  </div>
                  {onViewClientHistory && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewClientHistory(selectedAlert.clientId)}
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      Ver historial completo
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Últimas sesiones */}
            {selectedAlert.recentSessions && selectedAlert.recentSessions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Últimas Sesiones
                </h4>
                <div className="space-y-2">
                  {selectedAlert.recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(session.date)}
                          </p>
                          {session.notes && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{session.notes}</p>
                          )}
                        </div>
                        {session.satisfactionScore && (
                          <div className="flex items-center gap-2">
                            {renderStars(session.satisfactionScore)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sugerencias de acción */}
            {selectedAlert.actionSuggestions && selectedAlert.actionSuggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Sugerencias de Acción
                </h4>
                <div className="space-y-2">
                  {selectedAlert.actionSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-900/10 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            {suggestion.title}
                          </p>
                          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de contacto rápido */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Contactar al Cliente
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  onClick={() => handleContact('whatsapp')}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => handleContact('email')}
                >
                  Email
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => handleContact('phone')}
                >
                  Llamar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

