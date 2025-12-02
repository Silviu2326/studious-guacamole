import React, { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Clock,
  Users,
  Send,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ScheduledMessage, ScheduledMessageFrequency } from '../types';

interface ScheduledMessagesProps {
  messages?: ScheduledMessage[];
  loading?: boolean;
  className?: string;
  onMessageCreate?: () => void;
  onMessageEdit?: (message: ScheduledMessage) => void;
  onMessageDelete?: (messageId: string) => void;
  onMessageToggle?: (messageId: string, isActive: boolean) => void;
}

const channelIcons = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  push: <MessageSquare className="w-4 h-4" />,
  'in-app': <MessageSquare className="w-4 h-4" />,
};

const channelColors = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sms: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  push: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'in-app': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const frequencyLabels: Record<ScheduledMessageFrequency, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  custom: 'Personalizado',
};

const getFrequencyDescription = (frequency: ScheduledMessageFrequency, customDays?: number): string => {
  switch (frequency) {
    case 'daily':
      return 'Cada día';
    case 'weekly':
      return 'Cada semana';
    case 'biweekly':
      return 'Cada 2 semanas';
    case 'monthly':
      return 'Cada mes';
    case 'custom':
      return `Cada ${customDays || 0} días`;
    default:
      return frequency;
  }
};

export const ScheduledMessages: React.FC<ScheduledMessagesProps> = ({
  messages = [],
  loading = false,
  className = '',
  onMessageCreate,
  onMessageEdit,
  onMessageDelete,
  onMessageToggle,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'paused' | 'scheduled'>('all');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  const activeMessages = messages.filter((m) => m.isActive && m.status === 'running');
  const pausedMessages = messages.filter((m) => !m.isActive || m.status === 'paused');
  const scheduledMessages = messages.filter((m) => m.status === 'scheduled');

  const filteredMessages = messages.filter((message) => {
    switch (activeFilter) {
      case 'active':
        return message.isActive && message.status === 'running';
      case 'paused':
        return !message.isActive || message.status === 'paused';
      case 'scheduled':
        return message.status === 'scheduled';
      default:
        return true;
    }
  });

  const totalSent = messages.reduce((sum, m) => sum + m.totalSent, 0);
  const avgResponseRate =
    messages.filter((m) => m.responseRate !== undefined).length > 0
      ? messages
          .filter((m) => m.responseRate !== undefined)
          .reduce((sum, m) => sum + (m.responseRate || 0), 0) /
        messages.filter((m) => m.responseRate !== undefined).length
      : 0;

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Mensajes Programados
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Sistema de mensajes que se envían automáticamente según la frecuencia configurada, con opción de personalizar el contenido y ajustar la frecuencia por cliente o grupo
            </p>
          </div>
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={onMessageCreate}>
            Nuevo mensaje programado
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total programados
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {messages.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Activos
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {activeMessages.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total enviados
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {totalSent}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Tasa respuesta
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {avgResponseRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todos ({messages.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'active'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Activos ({activeMessages.length})
          </button>
          <button
            onClick={() => setActiveFilter('paused')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'paused'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Pausados ({pausedMessages.length})
          </button>
          <button
            onClick={() => setActiveFilter('scheduled')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'scheduled'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Programados ({scheduledMessages.length})
          </button>
        </div>

        {/* Lista de mensajes programados */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                {activeFilter !== 'all'
                  ? 'No hay mensajes programados con este filtro'
                  : 'No hay mensajes programados creados'}
              </p>
              {activeFilter === 'all' && (
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={onMessageCreate}>
                  Crear primer mensaje programado
                </Button>
              )}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {message.name}
                      </h3>
                      <Badge className={channelColors[message.channel]}>
                        <span className="flex items-center gap-1">
                          {channelIcons[message.channel]}
                          {message.channel.toUpperCase()}
                        </span>
                      </Badge>
                      <Badge variant={message.isActive ? 'success' : 'secondary'}>
                        {message.isActive ? 'Activo' : 'Pausado'}
                      </Badge>
                      <Badge variant="outline">{frequencyLabels[message.frequency]}</Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {message.description}
                    </p>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 mb-3">
                      <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                        {message.messageContent}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} block mb-1`}>
                          Frecuencia:
                        </span>
                        <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {getFrequencyDescription(message.frequency, message.customFrequencyDays)}
                        </span>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} block mb-1`}>
                          Próximo envío:
                        </span>
                        <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {new Date(message.nextScheduledDate).toLocaleString('es-ES', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} block mb-1`}>
                          Destinatarios:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {message.recipients.slice(0, 3).map((recipient) => (
                            <Badge key={recipient.id} variant="outline" size="sm">
                              {recipient.name}
                            </Badge>
                          ))}
                          {message.recipients.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{message.recipients.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} block mb-1`}>
                          Estadísticas:
                        </span>
                        <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {message.totalSent} enviados
                          {message.responseRate !== undefined && ` • ${message.responseRate}% respuesta`}
                        </span>
                      </div>
                    </div>
                    {message.variables && message.variables.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Variables:
                        </span>
                        {message.variables.map((variable) => (
                          <Badge key={variable} variant="outline" size="sm">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={message.isActive ? <Pause size={14} /> : <Play size={14} />}
                    onClick={() => onMessageToggle?.(message.id, !message.isActive)}
                  >
                    {message.isActive ? 'Pausar' : 'Activar'}
                  </Button>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Edit size={14} />}
                    onClick={() => onMessageEdit?.(message)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => onMessageDelete?.(message.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

