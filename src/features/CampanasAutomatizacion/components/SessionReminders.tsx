import React, { useState } from 'react';
import { Clock, MessageSquare, Mail, Smartphone, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Users, Calendar } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SessionReminderTemplate, ClientReminderSettings, SessionReminder } from '../types';

interface SessionRemindersProps {
  templates?: SessionReminderTemplate[];
  clientSettings?: ClientReminderSettings[];
  upcomingReminders?: SessionReminder[];
  loading?: boolean;
  className?: string;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: SessionReminderTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateToggle?: (templateId: string, isActive: boolean) => void;
  onClientToggle?: (clientId: string, templateId: string, isEnabled: boolean) => void;
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

export const SessionReminders: React.FC<SessionRemindersProps> = ({
  templates = [],
  clientSettings = [],
  upcomingReminders = [],
  loading = false,
  className = '',
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateToggle,
  onClientToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'clients' | 'upcoming'>('templates');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  const activeTemplates = templates.filter((t) => t.isActive);
  const enabledClients = clientSettings.filter((c) => c.isEnabled);

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Recordatorios de Sesiones
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Gestiona plantillas de recordatorios automáticos que se envían según el calendario de reservas
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onTemplateCreate}
          >
            Nueva plantilla
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Plantillas activas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {activeTemplates.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Clientes con recordatorios
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {enabledClients.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Próximos envíos
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {upcomingReminders.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Plantillas ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'clients'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Configuración por Cliente ({clientSettings.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Próximos Envíos ({upcomingReminders.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'templates' && (
            <div className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                    No hay plantillas de recordatorios creadas
                  </p>
                  <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
                    Crear primera plantilla
                  </Button>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {template.name}
                          </h3>
                          <Badge className={channelColors[template.channel]}>
                            <span className="flex items-center gap-1">
                              {channelIcons[template.channel]}
                              {template.channel.toUpperCase()}
                            </span>
                          </Badge>
                          {template.isActive ? (
                            <Badge variant="success">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </div>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>
                            Enviar {template.timing.hours}h {template.timing.type === 'before' ? 'antes' : 'después'} de la sesión
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTemplateToggle?.(template.id, !template.isActive)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title={template.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {template.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={() => onTemplateEdit?.(template)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                          onClick={() => onTemplateDelete?.(template.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70">
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-mono text-sm`}>
                        {template.messageTemplate}
                      </p>
                      {template.variables.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Variables:
                          </span>
                          {template.variables.map((variable) => (
                            <Badge key={variable} variant="secondary" size="sm">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4">
              {clientSettings.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    No hay configuraciones de clientes
                  </p>
                </div>
              ) : (
                clientSettings.map((setting) => {
                  const template = templates.find((t) => t.id === setting.templateId);
                  return (
                    <div
                      key={`${setting.clientId}-${setting.templateId}`}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {setting.clientName}
                            </h3>
                            {template && (
                              <Badge className={channelColors[template.channel]}>
                                {template.name}
                              </Badge>
                            )}
                          </div>
                          {setting.customMessage && (
                            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                              Mensaje personalizado: {setting.customMessage}
                            </p>
                          )}
                          {setting.lastSent && (
                            <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Último envío: {new Date(setting.lastSent).toLocaleDateString('es-ES')}
                            </p>
                          )}
                          {setting.nextScheduled && (
                            <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Próximo: {new Date(setting.nextScheduled).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onClientToggle?.(setting.clientId, setting.templateId, !setting.isEnabled)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title={setting.isEnabled ? 'Desactivar' : 'Activar'}
                        >
                          {setting.isEnabled ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    No hay recordatorios programados
                  </p>
                </div>
              ) : (
                upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {reminder.clientName}
                          </h3>
                          <Badge className={channelColors[reminder.channel]}>
                            <span className="flex items-center gap-1">
                              {channelIcons[reminder.channel]}
                              {reminder.channel.toUpperCase()}
                            </span>
                          </Badge>
                          <Badge
                            variant={
                              reminder.status === 'scheduled'
                                ? 'info'
                                : reminder.status === 'sent'
                                ? 'success'
                                : reminder.status === 'failed'
                                ? 'error'
                                : 'secondary'
                            }
                          >
                            {reminder.status === 'scheduled'
                              ? 'Programado'
                              : reminder.status === 'sent'
                              ? 'Enviado'
                              : reminder.status === 'failed'
                              ? 'Fallido'
                              : 'Cancelado'}
                          </Badge>
                        </div>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                          Sesión: {new Date(reminder.sessionDate).toLocaleDateString('es-ES')} a las {reminder.sessionTime}
                        </p>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                          Envío programado: {new Date(reminder.scheduledAt).toLocaleString('es-ES')}
                        </p>
                        {reminder.sentAt && (
                          <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Enviado: {new Date(reminder.sentAt).toLocaleString('es-ES')}
                          </p>
                        )}
                        <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70">
                          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-mono text-sm`}>
                            {reminder.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

