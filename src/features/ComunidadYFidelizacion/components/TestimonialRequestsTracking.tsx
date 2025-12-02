import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  Globe,
  MessageCircle,
  Mail,
  MoreVertical,
  Send,
  X,
  Calendar,
  Bell,
  Filter,
} from 'lucide-react';
import { Card, Badge, Button, Select, Modal } from '../../../components/componentsreutilizables';
import { TestimonialRequest, TestimonialRequestStatus } from '../types';
import { TestimonialRequestsService } from '../services/testimonialRequestsService';

interface TestimonialRequestsTrackingProps {
  clientId?: string;
  onNotificationReceived?: (request: TestimonialRequest) => void;
}

const STATUS_CONFIG: Record<TestimonialRequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
    icon: <Clock className="w-4 h-4" />,
  },
  recibido: {
    label: 'Recibido',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  publicado: {
    label: 'Publicado',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
    icon: <Globe className="w-4 h-4" />,
  },
  rechazado: {
    label: 'Rechazado',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200',
    icon: <X className="w-4 h-4" />,
  },
};

export function TestimonialRequestsTracking({
  clientId,
  onNotificationReceived,
}: TestimonialRequestsTrackingProps) {
  const [requests, setRequests] = useState<TestimonialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TestimonialRequestStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedRequest, setSelectedRequest] = useState<TestimonialRequest | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'resend' | 'cancel' | null>(null);
  const [notifications, setNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRequests();
  }, [clientId]);

  // Detectar nuevas respuestas y mostrar notificaciones
  useEffect(() => {
    const checkNewResponses = () => {
      requests.forEach((request) => {
        if (request.status === 'recibido' && request.receivedAt) {
          const receivedDate = new Date(request.receivedAt);
          const now = new Date();
          const diffMinutes = (now.getTime() - receivedDate.getTime()) / (1000 * 60);

          // Notificar si la respuesta fue recibida en los últimos 5 minutos
          if (diffMinutes <= 5 && !notifications.has(request.id)) {
            setNotifications((prev) => new Set(prev).add(request.id));
            if (onNotificationReceived) {
              onNotificationReceived(request);
            }
          }
        }
      });
    };

    checkNewResponses();
    const interval = setInterval(checkNewResponses, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [requests, notifications, onNotificationReceived]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = clientId
        ? await TestimonialRequestsService.getByClient(clientId)
        : await TestimonialRequestsService.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Error cargando solicitudes de testimonio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: TestimonialRequestStatus) => {
    try {
      await TestimonialRequestsService.updateStatus(requestId, newStatus);
      await loadRequests();
      setIsStatusModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const handleResendReminder = async (requestId: string) => {
    try {
      await TestimonialRequestsService.resendReminder(requestId);
      await loadRequests();
      setIsActionModalOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    } catch (error) {
      console.error('Error reenviando recordatorio:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await TestimonialRequestsService.delete(requestId);
      await loadRequests();
      setIsActionModalOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    } catch (error) {
      console.error('Error cancelando solicitud:', error);
    }
  };

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter((req) => statusFilter === 'all' || req.status === statusFilter);

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((req) => {
        const sentDate = req.sentAt ? new Date(req.sentAt) : null;
        if (!sentDate) return false;

        switch (dateFilter) {
          case 'today':
            return sentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return sentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return sentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [requests, statusFilter, dateFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Seguimiento de solicitudes de testimonio
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Gestiona y realiza seguimiento del estado de las solicitudes de testimonios enviadas a tus clientes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TestimonialRequestStatus | 'all')}
              options={[
                { label: 'Todos los estados', value: 'all' },
                { label: 'Pendiente', value: 'pendiente' },
                { label: 'Recibido', value: 'recibido' },
                { label: 'Publicado', value: 'publicado' },
                { label: 'Rechazado', value: 'rechazado' },
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              options={[
                { label: 'Todas las fechas', value: 'all' },
                { label: 'Hoy', value: 'today' },
                { label: 'Última semana', value: 'week' },
                { label: 'Último mes', value: 'month' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay solicitudes de testimonio {statusFilter !== 'all' ? `con estado "${STATUS_CONFIG[statusFilter as TestimonialRequestStatus]?.label}"` : ''}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => {
              const statusConfig = STATUS_CONFIG[request.status];
              return (
                <div
                  key={request.id}
                  className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {request.clientName}
                      </h4>
                      <Badge className={statusConfig.color} size="sm">
                        <span className="flex items-center gap-1.5">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {request.channel === 'whatsapp' ? (
                          <span className="flex items-center gap-1.5">
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Email
                          </span>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {request.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      {request.sentAt && (
                        <span>Enviado: {formatDate(request.sentAt)}</span>
                      )}
                      {request.receivedAt && (
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3 text-blue-500" />
                          Recibido: {formatDate(request.receivedAt)}
                          {notifications.has(request.id) && (
                            <Badge variant="blue" size="sm" className="ml-1">
                              Nuevo
                            </Badge>
                          )}
                        </span>
                      )}
                      {request.publishedAt && (
                        <span>Publicado: {formatDate(request.publishedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === 'pendiente' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setActionType('resend');
                            setIsActionModalOpen(true);
                          }}
                          title="Reenviar recordatorio"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setActionType('cancel');
                            setIsActionModalOpen(true);
                          }}
                          title="Cancelar solicitud"
                          className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsStatusModalOpen(true);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para cambiar estado */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedRequest(null);
        }}
        title="Cambiar estado de solicitud"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsStatusModalOpen(false);
                setSelectedRequest(null);
              }}
            >
              Cancelar
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Cliente: {selectedRequest.clientName}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Estado actual: {STATUS_CONFIG[selectedRequest.status].label}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cambiar a:
              </p>
              <div className="grid gap-2">
                {(['pendiente', 'recibido', 'publicado', 'rechazado'] as TestimonialRequestStatus[]).map((status) => {
                  const config = STATUS_CONFIG[status];
                  if (status === selectedRequest.status) return null;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(selectedRequest.id, status)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={config.color + ' rounded p-1.5'}>
                        {config.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {config.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {status === 'recibido' && 'El cliente ha enviado su testimonio'}
                          {status === 'publicado' && 'El testimonio ha sido publicado'}
                          {status === 'pendiente' && 'Marcar como pendiente'}
                          {status === 'rechazado' && 'El cliente rechazó la solicitud'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para acciones (reenviar/cancelar) */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedRequest(null);
          setActionType(null);
        }}
        title={
          actionType === 'resend'
            ? 'Reenviar recordatorio'
            : actionType === 'cancel'
              ? 'Cancelar solicitud'
              : 'Acción'
        }
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsActionModalOpen(false);
                setSelectedRequest(null);
                setActionType(null);
              }}
            >
              Cancelar
            </Button>
            {actionType === 'resend' && selectedRequest && (
              <Button
                onClick={() => handleResendReminder(selectedRequest.id)}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Reenviar recordatorio
              </Button>
            )}
            {actionType === 'cancel' && selectedRequest && (
              <Button
                variant="destructive"
                onClick={() => handleCancelRequest(selectedRequest.id)}
                leftIcon={<X className="w-4 h-4" />}
              >
                Cancelar solicitud
              </Button>
            )}
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            {actionType === 'resend' && (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  ¿Deseas reenviar un recordatorio a <strong>{selectedRequest.clientName}</strong>?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Se enviará un recordatorio amable por {selectedRequest.channel === 'whatsapp' ? 'WhatsApp' : 'email'}.
                </p>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Mensaje original:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                    {selectedRequest.message}
                  </p>
                </div>
              </>
            )}
            {actionType === 'cancel' && (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  ¿Estás seguro de que deseas cancelar la solicitud de testimonio para{' '}
                  <strong>{selectedRequest.clientName}</strong>?
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  Esta acción no se puede deshacer. La solicitud será eliminada permanentemente.
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}

