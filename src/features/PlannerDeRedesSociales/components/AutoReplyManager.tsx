import React, { useState, useEffect } from 'react';
import {
  AutoReplySettings,
  AutoReplyRule,
  AutoReplyLog,
  getAutoReplySettings,
  createAutoReplyRule,
  updateAutoReplyRule,
  deleteAutoReplyRule,
  getAutoReplyLogs,
  Sentiment
} from '../api/autoReply';
import { SocialPlatform, getPlatformIcon } from '../api/social';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface AutoReplyManagerProps {
  onSettingsUpdate?: () => void;
}

export const AutoReplyManager: React.FC<AutoReplyManagerProps> = ({
  onSettingsUpdate
}) => {
  const [settings, setSettings] = useState<AutoReplySettings | null>(null);
  const [logs, setLogs] = useState<AutoReplyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoReplyRule | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsData, logsData] = await Promise.all([
        getAutoReplySettings(),
        getAutoReplyLogs(50)
      ]);
      setSettings(settingsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEnabled = async () => {
    if (!settings) return;
    
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    onSettingsUpdate?.();
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      const updated = await updateAutoReplyRule(ruleId, { enabled });
      setSettings(prev => prev ? {
        ...prev,
        rules: prev.rules.map(r => r.id === ruleId ? updated : r)
      } : null);
      onSettingsUpdate?.();
    } catch (err) {
      console.error('Error updating rule:', err);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;
    
    try {
      await deleteAutoReplyRule(ruleId);
      setSettings(prev => prev ? {
        ...prev,
        rules: prev.rules.filter(r => r.id !== ruleId)
      } : null);
      onSettingsUpdate?.();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const getSentimentColor = (sentiment: Sentiment): string => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      case 'question':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSentimentLabel = (sentiment: Sentiment): string => {
    switch (sentiment) {
      case 'positive':
        return 'Positivo';
      case 'negative':
        return 'Negativo';
      case 'question':
        return 'Pregunta';
      default:
        return 'Neutral';
    }
  };

  const getTriggerLabel = (rule: AutoReplyRule): string => {
    switch (rule.trigger.type) {
      case 'keyword':
        return `Palabras clave: ${rule.trigger.keywords?.join(', ') || 'N/A'}`;
      case 'sentiment':
        return `Sentimiento: ${getSentimentLabel(rule.trigger.sentiment || 'neutral')}`;
      case 'question':
        return 'Preguntas';
      case 'all':
        return 'Todos los mensajes';
      default:
        return rule.trigger.type;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <MessageSquare size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando configuración...</p>
      </Card>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Respuestas Automáticas</h3>
            <p className="text-sm text-gray-600">Gestiona respuestas automáticas a comentarios y mensajes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleEnabled}
            variant={settings.enabled ? "destructive" : "primary"}
            size="sm"
            leftIcon={settings.enabled ? <Pause size={18} /> : <Play size={18} />}
          >
            {settings.enabled ? 'Desactivar' : 'Activar'}
          </Button>
          <Button
            onClick={() => {
              setSelectedRule(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus size={18} />}
            size="sm"
          >
            Nueva Regla
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Respuestas</p>
              <p className="text-2xl font-bold text-gray-900">{settings.statistics.totalReplies}</p>
            </div>
            <MessageSquare size={32} className="text-blue-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{settings.statistics.repliesToday}</p>
            </div>
            <TrendingUp size={32} className="text-green-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{settings.statistics.averageResponseTime}s</p>
            </div>
            <Clock size={32} className="text-purple-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reglas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {settings.rules.filter(r => r.enabled).length}
              </p>
            </div>
            <BarChart3 size={32} className="text-yellow-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Status Card */}
      <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              {settings.enabled ? (
                <Play size={20} className="text-green-600" />
              ) : (
                <Pause size={20} className="text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {settings.enabled ? 'Respuestas Automáticas Activas' : 'Respuestas Automáticas Inactivas'}
              </p>
              <p className="text-sm text-gray-600">
                {settings.rules.filter(r => r.enabled).length} regla(s) activa(s)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Rules */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Reglas de Respuesta</h4>
        <div className="space-y-4">
          {settings.rules.map((rule) => (
            <Card
              key={rule.id}
              className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-900">{rule.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rule.enabled ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{getTriggerLabel(rule)}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {rule.platforms.map(platform => (
                      <span key={platform} className="text-lg">
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-xs text-gray-600 mb-1">Respuesta:</p>
                    <p className="text-sm text-gray-900">{rule.response.template}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                  >
                    {rule.enabled ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRule(rule);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              {rule.conditions && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {rule.conditions.maxRepliesPerDay && (
                      <div>
                        <span className="text-gray-600">Máx/día:</span>
                        <span className="font-semibold text-gray-900 ml-1">{rule.conditions.maxRepliesPerDay}</span>
                      </div>
                    )}
                    {rule.conditions.onlyBusinessHours && (
                      <div>
                        <span className="text-gray-600">Horario:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {rule.conditions.businessHours?.start} - {rule.conditions.businessHours?.end}
                        </span>
                      </div>
                    )}
                    {rule.response.delay && (
                      <div>
                        <span className="text-gray-600">Retraso:</span>
                        <span className="font-semibold text-gray-900 ml-1">{rule.response.delay}s</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Historial Reciente</h4>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.map((log) => (
              <Card
                key={log.id}
                className="p-4 bg-white shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(log.platform)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(log.sentiment)}`}>
                        {getSentimentLabel(log.sentiment)}
                      </span>
                      {log.status === 'sent' ? (
                        <CheckCircle2 size={14} className="text-green-600" />
                      ) : log.status === 'failed' ? (
                        <XCircle size={14} className="text-red-600" />
                      ) : (
                        <Clock size={14} className="text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mb-1 font-medium">Mensaje original:</p>
                    <p className="text-sm text-gray-700 mb-2 italic">"{log.originalMessage}"</p>
                    <p className="text-sm text-gray-900 mb-1 font-medium">Respuesta:</p>
                    <p className="text-sm text-gray-700">"{log.response}"</p>
                  </div>
                  <div className="text-right text-xs text-gray-600 ml-4">
                    <p>{new Date(log.sentAt).toLocaleDateString('es-ES')}</p>
                    <p>{new Date(log.sentAt).toLocaleTimeString('es-ES')}</p>
                  </div>
                </div>
                {log.error && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle size={12} />
                      <span>{log.error}</span>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center bg-white shadow-sm">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin historial</h3>
              <p className="text-gray-600">No hay respuestas automáticas registradas aún</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

