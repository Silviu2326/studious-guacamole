import { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  Heart,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Input, Textarea, Tabs, Table } from '../../../components/componentsreutilizables';
import {
  AutomatedComplianceMessage,
  ComplianceMessageConfig,
  ComplianceMessageTemplate,
  MessageType,
  MessageTrigger,
  MessageStatus,
  MessageChannel,
} from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { useAuth } from '../../../context/AuthContext';

interface AutomatedComplianceMessagesProps {
  messages?: AutomatedComplianceMessage[];
  config?: ComplianceMessageConfig;
  loading?: boolean;
  onRefresh?: () => void;
}

const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  milestone: 'Hito',
  relapse: 'Recaída',
  achievement: 'Logro',
  encouragement: 'Motivación',
  'check-in': 'Check-in',
};

const MESSAGE_TYPE_ICONS: Record<MessageType, React.ReactNode> = {
  milestone: <Award className="w-4 h-4" />,
  relapse: <AlertCircle className="w-4 h-4" />,
  achievement: <CheckCircle2 className="w-4 h-4" />,
  encouragement: <Heart className="w-4 h-4" />,
  'check-in': <MessageSquare className="w-4 h-4" />,
};

const STATUS_LABELS: Record<MessageStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  sent: 'Enviado',
  delivered: 'Entregado',
  read: 'Leído',
  failed: 'Fallido',
};

const STATUS_COLORS: Record<MessageStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  sent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  read: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const CHANNEL_LABELS: Record<MessageChannel, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  sms: 'SMS',
  'in-app': 'En la App',
};

const TRIGGER_LABELS: Record<MessageTrigger, string> = {
  'objective-achieved': 'Objetivo Alcanzado',
  'session-milestone': 'Hito de Sesiones',
  'weight-goal': 'Meta de Peso',
  'strength-goal': 'Meta de Fuerza',
  'attendance-streak': 'Racha de Asistencia',
  'relapse-detected': 'Recaída Detectada',
  'low-engagement': 'Bajo Engagement',
  anniversary: 'Aniversario',
  custom: 'Personalizado',
};

export function AutomatedComplianceMessages({
  messages = [],
  config,
  loading = false,
  onRefresh,
}: AutomatedComplianceMessagesProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'config'>('messages');
  const [selectedType, setSelectedType] = useState<MessageType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MessageStatus | 'all'>('all');
  const [viewingMessage, setViewingMessage] = useState<AutomatedComplianceMessage | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ComplianceMessageTemplate | null>(null);
  const [configState, setConfigState] = useState<ComplianceMessageConfig | null>(config || null);

  useEffect(() => {
    if (config) {
      setConfigState(config);
    }
  }, [config]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;
    if (selectedType !== 'all') {
      filtered = filtered.filter((m) => m.type === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((m) => m.status === selectedStatus);
    }
    return filtered;
  }, [messages, selectedType, selectedStatus]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = async (messageId: string) => {
    try {
      await CommunityFidelizacionService.sendComplianceMessage(messageId);
      onRefresh?.();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleSaveConfig = async () => {
    if (!configState) return;
    try {
      await CommunityFidelizacionService.updateComplianceMessageConfig(configState);
      onRefresh?.();
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Mensajes Automatizados de Cumplimiento
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Automatiza mensajes para felicitar hitos y motivar en recaídas
              </p>
            </div>
          </div>
        </div>
        {onRefresh && (
          <Button variant="ghost" onClick={onRefresh} className="inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {configState && configState.stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total Enviados</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {configState.stats.totalMessagesSent}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Hitos</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {configState.stats.milestoneMessagesSent}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Recaídas</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {configState.stats.relapseMessagesSent}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Tasa de Respuesta</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {configState.stats.averageResponseRate.toFixed(0)}%
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Engagement</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {configState.stats.averageEngagementScore.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      <Tabs
        items={[
          { id: 'messages', label: 'Mensajes', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'templates', label: 'Plantillas', icon: <Edit className="w-4 h-4" /> },
          { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'messages' | 'templates' | 'config')}
        variant="pills"
        size="sm"
      />

      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as MessageType | 'all')}
              className="w-48"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(MESSAGE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as MessageStatus | 'all')}
              className="w-48"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-slate-400">Cargando mensajes...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-400">No hay mensajes disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setViewingMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-indigo-600 dark:text-indigo-400">
                          {MESSAGE_TYPE_ICONS[message.type]}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                          {message.clientName}
                        </h3>
                        <Badge className={STATUS_COLORS[message.status]}>
                          {STATUS_LABELS[message.status]}
                        </Badge>
                        <Badge variant="blue" size="sm">
                          {MESSAGE_TYPE_LABELS[message.type]}
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {CHANNEL_LABELS[message.channel]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                        <span>Trigger: {TRIGGER_LABELS[message.trigger]}</span>
                        {message.sentAt && <span>Enviado: {formatDate(message.sentAt)}</span>}
                        {message.deliveredAt && <span>Entregado: {formatDate(message.deliveredAt)}</span>}
                        {message.readAt && <span>Leído: {formatDate(message.readAt)}</span>}
                      </div>
                      {message.effectiveness && (
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-600 dark:text-slate-400">
                            Engagement: {message.effectiveness.engagementScore || 0}%
                          </span>
                          {message.effectiveness.responded && (
                            <Badge variant="green" size="sm">
                              Respondido
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {message.status === 'draft' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendMessage(message.id);
                          }}
                          className="inline-flex items-center gap-1"
                        >
                          <Send className="w-4 h-4" />
                          Enviar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingMessage(message);
                        }}
                        className="inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && configState && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Plantillas de Mensajes</h3>
            <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Plantilla
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ...configState.milestoneMessages.templates,
              ...configState.relapseMessages.templates,
            ].map((template) => (
              <Card
                key={template.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setEditingTemplate(template)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100">{template.name}</h4>
                    <Badge variant="blue" size="sm">{MESSAGE_TYPE_LABELS[template.type]}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-3">
                    {template.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                    <span>{CHANNEL_LABELS[template.channel]}</span>
                    <span>•</span>
                    <span>Trigger: {TRIGGER_LABELS[template.trigger]}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'config' && configState && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Configuración</h3>
            <Button variant="secondary" onClick={handleSaveConfig}>
              Guardar Cambios
            </Button>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Mensajes de Hitos</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Habilitado</span>
                  <input
                    type="checkbox"
                    checked={configState.milestoneMessages.enabled}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        milestoneMessages: {
                          ...configState.milestoneMessages,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 mb-1 block">
                    Retraso (horas)
                  </label>
                  <Input
                    type="number"
                    value={configState.milestoneMessages.delayHours}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        milestoneMessages: {
                          ...configState.milestoneMessages,
                          delayHours: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Mensajes de Recaídas</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Habilitado</span>
                  <input
                    type="checkbox"
                    checked={configState.relapseMessages.enabled}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        relapseMessages: {
                          ...configState.relapseMessages,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 mb-1 block">
                    Retraso (horas)
                  </label>
                  <Input
                    type="number"
                    value={configState.relapseMessages.delayHours}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        relapseMessages: {
                          ...configState.relapseMessages,
                          delayHours: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 mb-1 block">
                    Sensibilidad
                  </label>
                  <Select
                    value={configState.relapseMessages.sensitivity}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        relapseMessages: {
                          ...configState.relapseMessages,
                          sensitivity: e.target.value as 'low' | 'medium' | 'high',
                        },
                      })
                    }
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </Select>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Configuración General</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Habilitado</span>
                  <input
                    type="checkbox"
                    checked={configState.enabled}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        enabled: e.target.checked,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-slate-400 mb-1 block">
                    Máximo de mensajes por semana
                  </label>
                  <Input
                    type="number"
                    value={configState.general.maxMessagesPerWeek || 3}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        general: {
                          ...configState.general,
                          maxMessagesPerWeek: parseInt(e.target.value) || 3,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    Usar voz de comunidad del entrenador
                  </span>
                  <input
                    type="checkbox"
                    checked={configState.general.useTrainerVoice}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        general: {
                          ...configState.general,
                          useTrainerVoice: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {viewingMessage && (
        <Modal
          isOpen={!!viewingMessage}
          onClose={() => setViewingMessage(null)}
          title={`Mensaje para ${viewingMessage.clientName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Mensaje</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                {viewingMessage.message}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Tipo</span>
                <p className="font-medium">{MESSAGE_TYPE_LABELS[viewingMessage.type]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Canal</span>
                <p className="font-medium">{CHANNEL_LABELS[viewingMessage.channel]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Estado</span>
                <p className="font-medium">{STATUS_LABELS[viewingMessage.status]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-slate-400">Trigger</span>
                <p className="font-medium">{TRIGGER_LABELS[viewingMessage.trigger]}</p>
              </div>
            </div>
            {viewingMessage.milestoneData && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Datos del Hito</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Tipo:</span> {viewingMessage.milestoneData.type}
                  </p>
                  <p>
                    <span className="font-medium">Título:</span> {viewingMessage.milestoneData.title}
                  </p>
                  {viewingMessage.milestoneData.value && (
                    <p>
                      <span className="font-medium">Valor:</span> {viewingMessage.milestoneData.value}
                    </p>
                  )}
                </div>
              </div>
            )}
            {viewingMessage.relapseData && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Datos de la Recaída</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Tipo:</span> {viewingMessage.relapseData.type}
                  </p>
                  <p>
                    <span className="font-medium">Severidad:</span> {viewingMessage.relapseData.severity}
                  </p>
                  <p>
                    <span className="font-medium">Descripción:</span> {viewingMessage.relapseData.description}
                  </p>
                </div>
              </div>
            )}
            {viewingMessage.clientResponse && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Respuesta del Cliente</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {viewingMessage.clientResponse.responseText}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                    {formatDate(viewingMessage.clientResponse.respondedAt)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              {viewingMessage.status === 'draft' && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleSendMessage(viewingMessage.id);
                    setViewingMessage(null);
                  }}
                >
                  Enviar
                </Button>
              )}
              <Button variant="ghost" onClick={() => setViewingMessage(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

