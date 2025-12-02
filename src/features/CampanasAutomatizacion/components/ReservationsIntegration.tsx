import React, { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  ReservationsIntegration,
  ReservationAutomationRule,
  ReservationEvent,
  ReservationEventType,
} from '../types';

interface ReservationsIntegrationProps {
  integration?: ReservationsIntegration;
  loading?: boolean;
  className?: string;
  onRuleCreate?: () => void;
  onRuleEdit?: (rule: ReservationAutomationRule) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleToggle?: (ruleId: string, isActive: boolean) => void;
  onIntegrationToggle?: (isEnabled: boolean) => void;
  onSync?: () => void;
}

const channelIcons = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
};

const channelColors = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sms: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const eventTypeLabels: Record<ReservationEventType, string> = {
  'new-session': 'Nueva sesión',
  'session-cancelled': 'Sesión cancelada',
  'session-rescheduled': 'Sesión reagendada',
  'session-completed': 'Sesión completada',
  'no-show': 'Ausencia sin avisar',
};

const automationTypeLabels: Record<string, string> = {
  reminder: 'Recordatorio',
  'follow-up': 'Seguimiento',
  confirmation: 'Confirmación',
  'cancellation-follow-up': 'Seguimiento cancelación',
};

export const ReservationsIntegrationComponent: React.FC<ReservationsIntegrationProps> = ({
  integration,
  loading = false,
  className = '',
  onRuleCreate,
  onRuleEdit,
  onRuleDelete,
  onRuleToggle,
  onIntegrationToggle,
  onSync,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'events'>('rules');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  if (!integration) {
    return (
      <Card className={className} padding="lg">
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de integración disponibles
          </p>
        </div>
      </Card>
    );
  }

  const activeRules = integration.rules.filter((r) => r.isActive);
  const recentEvents = integration.recentEvents.slice(0, 10);

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
                Integración con Sistema de Reservas
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Conecta las automatizaciones con el sistema de reservas para activar mensajes según cambios en el calendario
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RefreshCcw size={16} className={integration.syncStatus === 'syncing' ? 'animate-spin' : ''} />}
              onClick={onSync}
              disabled={integration.syncStatus === 'syncing'}
            >
              Sincronizar
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={onRuleCreate}
            >
              Nueva regla
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${
            integration.isEnabled
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {integration.isEnabled ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <p className={`${ds.typography.bodyMedium} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {integration.isEnabled ? 'Integración activa' : 'Integración desactivada'}
              </p>
              <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {integration.isEnabled
                  ? `Última sincronización: ${integration.lastSyncDate ? new Date(integration.lastSyncDate).toLocaleString('es-ES') : 'Nunca'}`
                  : 'Activa la integración para conectar con el sistema de reservas'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onIntegrationToggle?.(!integration.isEnabled)}
            className="flex items-center gap-2"
          >
            {integration.isEnabled ? (
              <ToggleRight className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Reglas activas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {activeRules.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Eventos últimas 24h
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {integration.eventsLast24h}
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
              {integration.totalEventsProcessed}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              {integration.syncStatus === 'synced' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : integration.syncStatus === 'syncing' ? (
                <RefreshCcw className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Estado sincronización
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {integration.syncStatus === 'synced' ? 'Sincronizado' : integration.syncStatus === 'syncing' ? 'Sincronizando...' : 'Error'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'rules'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Reglas de automatización ({integration.rules.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'events'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Eventos recientes ({integration.recentEvents.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {integration.rules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                  No hay reglas configuradas
                </p>
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={onRuleCreate}>
                  Crear primera regla
                </Button>
              </div>
            ) : (
              integration.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {rule.name}
                        </h3>
                        <Badge
                          variant={rule.isActive ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {rule.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {eventTypeLabels[rule.eventType]}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {automationTypeLabels[rule.automationType]}
                        </Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                        {rule.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`${channelColors[rule.channel]} px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1`}>
                            {channelIcons[rule.channel]}
                            {rule.channel.toUpperCase()}
                          </span>
                        </div>
                        {rule.triggerDelay && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            {rule.triggerDelay.type === 'before' ? 'Antes' : 'Después'}: {rule.triggerDelay.hours}h
                          </span>
                        )}
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Activada {rule.totalTriggered} veces
                        </span>
                        {rule.lastTriggered && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Última: {new Date(rule.lastTriggered).toLocaleString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onRuleToggle?.(rule.id, !rule.isActive)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {rule.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => onRuleEdit?.(rule)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        onClick={() => onRuleDelete?.(rule.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <p className={`${ds.typography.bodyMedium} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {event.clientName}
                      </p>
                      <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {eventTypeLabels[event.eventType]} - {event.sessionDate} a las {event.sessionTime}
                      </p>
                    </div>
                  </div>
                  <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {new Date(event.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

