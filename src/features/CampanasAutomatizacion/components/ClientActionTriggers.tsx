import React, { useState } from 'react';
import {
  Zap,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  ClientActionTriggersDashboard,
  ClientActionTrigger,
  ClientActionTriggerEvent,
  ClientActionType,
} from '../types';

interface ClientActionTriggersProps {
  dashboard?: ClientActionTriggersDashboard;
  loading?: boolean;
  className?: string;
  onTriggerCreate?: () => void;
  onTriggerEdit?: (trigger: ClientActionTrigger) => void;
  onTriggerDelete?: (triggerId: string) => void;
  onTriggerToggle?: (triggerId: string, isActive: boolean) => void;
  onViewEvent?: (event: ClientActionTriggerEvent) => void;
}

const actionTypeLabels: Record<ClientActionType, string> = {
  'session-booked': 'Reserva sesión',
  'session-missed': 'Falta a clase',
  'session-cancelled': 'Cancela sesión',
  'session-completed': 'Completa sesión',
  'payment-made': 'Realiza pago',
  'plan-renewed': 'Renueva plan',
  'goal-achieved': 'Logra objetivo',
  'custom': 'Personalizado',
};

const channelIcons = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  push: <Activity className="w-4 h-4" />,
  'in-app': <Target className="w-4 h-4" />,
};

const channelColors = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sms: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  push: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'in-app': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

export const ClientActionTriggers: React.FC<ClientActionTriggersProps> = ({
  dashboard,
  loading = false,
  className = '',
  onTriggerCreate,
  onTriggerEdit,
  onTriggerDelete,
  onTriggerToggle,
  onViewEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'triggers' | 'events'>('triggers');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card className={className} padding="lg">
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de triggers disponibles
          </p>
        </div>
      </Card>
    );
  }

  const activeTriggers = dashboard.triggers.filter((t) => t.isActive);
  const recentEvents = dashboard.recentEvents.slice(0, 10);

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Triggers de Acciones de Clientes
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Define triggers basados en acciones de tus clientes (reserva sesión, falta a clase) para enviar mensajes contextuales automáticamente
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onTriggerCreate}
          >
            Nuevo trigger
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Triggers activos
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.activeTriggers}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Eventos últimas 24h
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.eventsLast24h}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total procesados
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalEventsProcessed}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Tasa de respuesta
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.averageResponseRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('triggers')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'triggers'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Triggers ({dashboard.triggers.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'events'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Eventos recientes ({dashboard.recentEvents.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'triggers' && (
          <div className="space-y-4">
            {dashboard.triggers.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                  No hay triggers configurados
                </p>
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTriggerCreate}>
                  Crear primer trigger
                </Button>
              </div>
            ) : (
              dashboard.triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {trigger.name}
                        </h3>
                        <Badge
                          variant={trigger.isActive ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {trigger.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {actionTypeLabels[trigger.actionType]}
                        </Badge>
                        <Badge className={channelColors[trigger.channel]}>
                          <span className="flex items-center gap-1">
                            {channelIcons[trigger.channel]}
                            {trigger.channel.toUpperCase()}
                          </span>
                        </Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                        {trigger.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        {trigger.delay && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                            <Clock className="w-3 h-3" />
                            Delay: {trigger.delay.value} {trigger.delay.unit}
                          </span>
                        )}
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                          <Activity className="w-3 h-3" />
                          Activado {trigger.totalTriggered} veces
                        </span>
                        {trigger.responseRate !== undefined && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                            <TrendingUp className="w-3 h-3" />
                            {trigger.responseRate.toFixed(1)}% respuesta
                          </span>
                        )}
                        {trigger.lastTriggered && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                            <Calendar className="w-3 h-3" />
                            Última: {new Date(trigger.lastTriggered).toLocaleString('es-ES')}
                          </span>
                        )}
                      </div>
                      {trigger.conditions && (
                        <div className="mb-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70">
                          <p className={`${ds.typography.caption} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                            Condiciones:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {trigger.conditions.clientSegment && (
                              <Badge variant="secondary" size="sm">Segmento: {trigger.conditions.clientSegment}</Badge>
                            )}
                            {trigger.conditions.planType && trigger.conditions.planType.length > 0 && (
                              <Badge variant="secondary" size="sm">Planes: {trigger.conditions.planType.join(', ')}</Badge>
                            )}
                            {trigger.conditions.daysSinceLastSession !== undefined && (
                              <Badge variant="secondary" size="sm">Días desde última sesión: {trigger.conditions.daysSinceLastSession}</Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70">
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-mono text-sm`}>
                          {trigger.messageTemplate}
                        </p>
                        {trigger.variables.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Variables:
                            </span>
                            {trigger.variables.map((variable) => (
                              <Badge key={variable} variant="secondary" size="sm">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onTriggerToggle?.(trigger.id, !trigger.isActive)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={trigger.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {trigger.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => onTriggerEdit?.(trigger)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        onClick={() => onTriggerDelete?.(trigger.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  No hay eventos recientes
                </p>
              </div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => onViewEvent?.(event)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                      <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`${ds.typography.bodyMedium} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {event.clientName}
                        </p>
                        <Badge variant="outline" size="sm">
                          {actionTypeLabels[event.actionType]}
                        </Badge>
                        {event.messageSent ? (
                          <Badge variant="success" size="sm">Mensaje enviado</Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">Pendiente</Badge>
                        )}
                        {event.responseReceived && (
                          <Badge variant="info" size="sm">Respondido</Badge>
                        )}
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        Trigger: {event.triggerName}
                        {event.actionDetails.sessionDate && ` • Sesión: ${event.actionDetails.sessionDate}`}
                        {event.actionDetails.sessionTime && ` a las ${event.actionDetails.sessionTime}`}
                      </p>
                      {event.messageContent && (
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1 italic`}>
                          "{event.messageContent.substring(0, 100)}..."
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {new Date(event.createdAt).toLocaleString('es-ES')}
                    </span>
                    {event.messageSentAt && (
                      <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
                        Enviado: {new Date(event.messageSentAt).toLocaleTimeString('es-ES')}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

