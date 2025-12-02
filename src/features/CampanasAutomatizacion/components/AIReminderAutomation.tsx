import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Users,
  Brain,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  AIReminderAutomationDashboard,
  AIReminderAutomation,
  AIReminderMessage,
} from '../types';

interface AIReminderAutomationProps {
  dashboard?: AIReminderAutomationDashboard;
  loading?: boolean;
  className?: string;
  onAutomationCreate?: () => void;
  onAutomationEdit?: (automation: AIReminderAutomation) => void;
  onAutomationDelete?: (automationId: string) => void;
  onAutomationToggle?: (automationId: string, isActive: boolean) => void;
  onViewReminder?: (reminder: AIReminderMessage) => void;
}

const channelIcons = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  push: <Target className="w-4 h-4" />,
  'in-app': <Target className="w-4 h-4" />,
};

const channelColors = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sms: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  push: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'in-app': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const adaptationLevelLabels = {
  minimal: 'Mínima',
  moderate: 'Moderada',
  aggressive: 'Agresiva',
};

const personalizationDepthLabels = {
  basic: 'Básica',
  intermediate: 'Intermedia',
  advanced: 'Avanzada',
};

export const AIReminderAutomationComponent: React.FC<AIReminderAutomationProps> = ({
  dashboard,
  loading = false,
  className = '',
  onAutomationCreate,
  onAutomationEdit,
  onAutomationDelete,
  onAutomationToggle,
  onViewReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'automations' | 'reminders'>('automations');

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
          <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de automatización con IA disponibles
          </p>
        </div>
      </Card>
    );
  }

  const activeAutomations = dashboard.automations.filter((a) => a.isActive);

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Recordatorios con IA
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Automatiza recordatorios con IA que adaptan el mensaje al historial del cliente para aumentar asistencia
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onAutomationCreate}
          >
            Nueva automatización
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Automatizaciones activas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalActive}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Programados
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.totalScheduled}
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
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Mejora asistencia
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              +{dashboard.attendanceImprovement.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Adaptación IA
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {dashboard.aiAdaptationRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'automations'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Automatizaciones ({dashboard.automations.length})
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'reminders'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Próximos recordatorios ({dashboard.upcomingReminders.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'automations' && (
          <div className="space-y-4">
            {dashboard.automations.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                  No hay automatizaciones configuradas
                </p>
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={onAutomationCreate}>
                  Crear primera automatización
                </Button>
              </div>
            ) : (
              dashboard.automations.map((automation) => (
                <div
                  key={automation.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {automation.name}
                        </h3>
                        <Badge
                          variant={automation.isActive ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {automation.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                        <Badge className={channelColors[automation.channel]}>
                          <span className="flex items-center gap-1">
                            {channelIcons[automation.channel]}
                            {automation.channel.toUpperCase()}
                          </span>
                        </Badge>
                        <Badge variant="info" size="sm">
                          <Brain className="w-3 h-3 mr-1" />
                          IA: {adaptationLevelLabels[automation.aiSettings.adaptationLevel]}
                        </Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                        {automation.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                          <Clock className="w-3 h-3" />
                          Enviar {automation.timing.hours}h {automation.timing.type === 'before' ? 'antes' : 'después'} de la sesión
                        </span>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                          <MessageSquare className="w-3 h-3" />
                          {automation.totalSent} enviados
                        </span>
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                          <Brain className="w-3 h-3" />
                          {automation.totalAdapted} adaptados por IA
                        </span>
                        {automation.averageResponseRate > 0 && (
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                            <TrendingUp className="w-3 h-3" />
                            {automation.averageResponseRate.toFixed(1)}% respuesta
                          </span>
                        )}
                        {automation.averageAttendanceImprovement !== undefined && automation.averageAttendanceImprovement > 0 && (
                          <span className={`${ds.typography.caption} text-green-600 dark:text-green-400 flex items-center gap-1`}>
                            <Target className="w-3 h-3" />
                            +{automation.averageAttendanceImprovement.toFixed(1)}% asistencia
                          </span>
                        )}
                      </div>
                      <div className="mb-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <p className={`${ds.typography.caption} font-medium text-indigo-900 dark:text-indigo-200`}>
                            Configuración de IA
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <div className="flex items-center gap-2">
                            {automation.aiSettings.considerHistory ? (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Historial
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {automation.aiSettings.considerGoals ? (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Objetivos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {automation.aiSettings.considerAttendance ? (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Asistencia
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {automation.aiSettings.toneAdjustment ? (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Ajuste de tono
                            </span>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Personalización: {personalizationDepthLabels[automation.aiSettings.personalizationDepth]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70">
                        <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                          Plantilla base:
                        </p>
                        <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-mono text-sm`}>
                          {automation.baseTemplate}
                        </p>
                        {automation.variables.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              Variables:
                            </span>
                            {automation.variables.map((variable) => (
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
                        onClick={() => onAutomationToggle?.(automation.id, !automation.isActive)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={automation.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {automation.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => onAutomationEdit?.(automation)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        onClick={() => onAutomationDelete?.(automation.id)}
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

        {activeTab === 'reminders' && (
          <div className="space-y-3">
            {dashboard.upcomingReminders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  No hay recordatorios programados
                </p>
              </div>
            ) : (
              dashboard.upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => onViewReminder?.(reminder)}
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
                        {reminder.aiConfidence !== undefined && (
                          <Badge variant="info" size="sm">
                            <Brain className="w-3 h-3 mr-1" />
                            {reminder.aiConfidence}% confianza
                          </Badge>
                        )}
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        Sesión: {new Date(reminder.sessionDate).toLocaleDateString('es-ES')} a las {reminder.sessionTime}
                      </p>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        Programado: {new Date(reminder.scheduledAt).toLocaleString('es-ES')}
                      </p>
                      <div className="mt-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-2 mb-2">
                          <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                          <div className="flex-1">
                            <p className={`${ds.typography.caption} font-medium text-indigo-900 dark:text-indigo-200 mb-1`}>
                              Mensaje adaptado por IA
                            </p>
                            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-mono text-sm mb-2`}>
                              {reminder.aiAdaptedMessage}
                            </p>
                            <p className={`${ds.typography.caption} text-indigo-700 dark:text-indigo-300 italic`}>
                              💡 {reminder.adaptationReason}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary" size="sm">
                          Asistencia: {reminder.clientHistory.attendanceRate.toFixed(0)}%
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {reminder.clientHistory.totalSessions} sesiones
                        </Badge>
                        {reminder.clientHistory.goals && reminder.clientHistory.goals.length > 0 && (
                          <Badge variant="secondary" size="sm">
                            {reminder.clientHistory.goals.length} objetivos
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReminder?.(reminder);
                      }}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-4"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
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

