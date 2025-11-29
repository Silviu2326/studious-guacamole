import React, { useState, useEffect } from 'react';
import {
  AutoPublishSettings,
  AutoPublishRule,
  PublishQueue,
  getAutoPublishSettings,
  createAutoPublishRule,
  updateAutoPublishRule,
  getPublishQueue,
  optimizePublishQueue,
  processPublishQueue,
  retryFailedPublish
} from '../api/automation';
import { SocialPost, BestTimeToPost, SocialPlatform, getPlatformIcon } from '../api/social';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  AlertCircle
} from 'lucide-react';

interface AutoPublishManagerProps {
  posts: SocialPost[];
  bestTimes: BestTimeToPost[];
  onQueueUpdate?: () => void;
}

export const AutoPublishManager: React.FC<AutoPublishManagerProps> = ({
  posts,
  bestTimes,
  onQueueUpdate
}) => {
  const [settings, setSettings] = useState<AutoPublishSettings | null>(null);
  const [queue, setQueue] = useState<PublishQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutoPublishRule | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsData, queueData] = await Promise.all([
        getAutoPublishSettings(),
        getPublishQueue()
      ]);
      setSettings(settingsData);
      setQueue(queueData);
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
    // En producción, guardar cambios
  };

  const handleOptimizeQueue = async () => {
    setIsOptimizing(true);
    try {
      const optimized = await optimizePublishQueue(posts, bestTimes);
      setQueue(optimized);
      onQueueUpdate?.();
    } catch (err) {
      console.error('Error optimizing queue:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleProcessQueue = async (queueId: string) => {
    try {
      const result = await processPublishQueue(queueId);
      if (result.success) {
        setQueue(prev => prev.map(q => 
          q.id === queueId 
            ? { ...q, status: 'published' as const, lastAttempt: new Date().toISOString() }
            : q
        ));
      } else {
        setQueue(prev => prev.map(q => 
          q.id === queueId 
            ? { ...q, status: 'failed' as const, error: result.error, attempts: q.attempts + 1, lastAttempt: new Date().toISOString() }
            : q
        ));
      }
      onQueueUpdate?.();
    } catch (err) {
      console.error('Error processing queue:', err);
    }
  };

  const handleRetryFailed = async (queueId: string) => {
    try {
      const result = await retryFailedPublish(queueId);
      if (result.success) {
        setQueue(prev => prev.map(q => 
          q.id === queueId 
            ? { ...q, status: 'published' as const, lastAttempt: new Date().toISOString() }
            : q
        ));
      } else {
        setQueue(prev => prev.map(q => 
          q.id === queueId 
            ? { ...q, error: result.error, attempts: q.attempts + 1, lastAttempt: new Date().toISOString() }
            : q
        ));
      }
      onQueueUpdate?.();
    } catch (err) {
      console.error('Error retrying:', err);
    }
  };

  const getStatusIcon = (status: PublishQueue['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'processing':
        return <RefreshCw size={16} className="text-blue-600 animate-spin" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: PublishQueue['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando configuración...</p>
      </Card>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={24} className="text-yellow-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Publicación Automática</h3>
            <p className="text-sm text-gray-600">Gestiona la publicación automática de tus posts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleOptimizeQueue}
            variant="secondary"
            size="sm"
            loading={isOptimizing}
            leftIcon={<RefreshCw size={18} />}
          >
            Optimizar Cola
          </Button>
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
                {settings.enabled ? 'Publicación Automática Activa' : 'Publicación Automática Inactiva'}
              </p>
              <p className="text-sm text-gray-600">
                {settings.rules.filter(r => r.enabled).length} regla(s) activa(s)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{queue.length}</p>
            <p className="text-xs text-gray-600">Posts en cola</p>
          </div>
        </div>
      </Card>

      {/* Rules */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Reglas de Publicación</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.rules.map((rule) => (
            <Card
              key={rule.id}
              className="p-4 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
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
                  <div className="flex flex-wrap gap-2 mb-2">
                    {rule.platforms.map(platform => (
                      <span key={platform} className="text-lg">
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Tipo: {rule.schedule.type === 'best_time' ? 'Mejores Horarios' : 
                           rule.schedule.type === 'custom' ? 'Personalizado' : 'Recurrente'}
                  </p>
                </div>
                <div className="flex gap-2">
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
                </div>
              </div>
              
              {rule.conditions && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {rule.conditions.minPostsPerDay && (
                      <div>
                        <span className="text-gray-600">Mín:</span>
                        <span className="font-semibold text-gray-900 ml-1">{rule.conditions.minPostsPerDay}/día</span>
                      </div>
                    )}
                    {rule.conditions.maxPostsPerDay && (
                      <div>
                        <span className="text-gray-600">Máx:</span>
                        <span className="font-semibold text-gray-900 ml-1">{rule.conditions.maxPostsPerDay}/día</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cola de Publicación</h4>
        <div className="space-y-3">
          {queue.length > 0 ? (
            queue.map((item) => (
              <Card
                key={item.id}
                className="p-4 bg-white shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-semibold text-gray-900">Post #{item.postId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                        <span className="text-sm text-gray-600">
                          {new Date(item.scheduledAt).toLocaleString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'published' ? 'Publicado' :
                       item.status === 'failed' ? 'Fallido' :
                       item.status === 'processing' ? 'Procesando' : 'Pendiente'}
                    </span>
                    {item.status === 'pending' && (
                      <Button
                        onClick={() => handleProcessQueue(item.id)}
                        size="sm"
                        variant="secondary"
                      >
                        Publicar Ahora
                      </Button>
                    )}
                    {item.status === 'failed' && (
                      <Button
                        onClick={() => handleRetryFailed(item.id)}
                        size="sm"
                        variant="secondary"
                        leftIcon={<RefreshCw size={14} />}
                      >
                        Reintentar
                      </Button>
                    )}
                    {item.error && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle size={14} />
                        <span>{item.error}</span>
                      </div>
                    )}
                  </div>
                </div>
                {item.attempts > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Intentos: {item.attempts}
                  </p>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Clock size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cola vacía</h3>
              <p className="text-gray-600">No hay posts en la cola de publicación</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

