import { useState } from 'react';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Settings,
  Clock,
  Star,
  AlertCircle,
  Send,
} from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import {
  SocialPlatformConnection,
  ReviewRequest,
  SocialPlatform,
  SyncFrequency,
} from '../types';

interface SocialPlatformsIntegrationProps {
  connections?: SocialPlatformConnection[];
  reviewRequests?: ReviewRequest[];
  loading?: boolean;
  onConnect?: (platform: SocialPlatform) => void;
  onDisconnect?: (connectionId: string) => void;
  onSync?: (connectionId: string) => void;
  onUpdateSyncFrequency?: (connectionId: string, frequency: SyncFrequency) => void;
  onRequestReview?: (clientId: string, platform: SocialPlatform) => void;
}

const PLATFORM_INFO: Record<
  SocialPlatform,
  { name: string; icon: React.ReactNode; color: string; description: string }
> = {
  'google-my-business': {
    name: 'Google My Business',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    description: 'Importa reseñas de Google automáticamente',
  },
  facebook: {
    name: 'Facebook',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    description: 'Sincroniza reseñas de tu página de Facebook',
  },
  instagram: {
    name: 'Instagram',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
    description: 'Importa reseñas y menciones de Instagram',
  },
};

const SYNC_FREQUENCY_LABELS: Record<SyncFrequency, string> = {
  hourly: 'Cada hora',
  daily: 'Diariamente',
  weekly: 'Semanalmente',
  manual: 'Manual',
};

export function SocialPlatformsIntegration({
  connections = [],
  reviewRequests = [],
  loading = false,
  onConnect,
  onDisconnect,
  onSync,
  onUpdateSyncFrequency,
  onRequestReview,
}: SocialPlatformsIntegrationProps) {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);

  const handleConnect = (platform: SocialPlatform) => {
    if (onConnect) {
      onConnect(platform);
    }
  };

  const handleDisconnect = (connectionId: string) => {
    if (onDisconnect) {
      onDisconnect(connectionId);
    }
  };

  const handleSync = (connectionId: string) => {
    if (onSync) {
      onSync(connectionId);
    }
  };

  const handleRequestReview = () => {
    if (selectedClient && selectedPlatform && onRequestReview) {
      onRequestReview(selectedClient.id, selectedPlatform);
      setShowRequestModal(false);
      setSelectedClient(null);
      setSelectedPlatform(null);
    }
  };

  const getPlatformInfo = (platform: SocialPlatform) => PLATFORM_INFO[platform];

  const pendingRequests = reviewRequests.filter((r) => r.status === 'pending' || r.status === 'sent');
  const completedRequests = reviewRequests.filter((r) => r.status === 'completed');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Integración con Plataformas Sociales
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Conecta con Google My Business, Facebook e Instagram para importar reseñas automáticamente
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(['google-my-business', 'facebook', 'instagram'] as SocialPlatform[]).map((platform) => {
            const connection = connections.find((c) => c.platform === platform);
            const platformInfo = getPlatformInfo(platform);
            const isConnected = connection?.isConnected ?? false;

            return (
              <div
                key={platform}
                className={`p-4 rounded-lg border-2 ${
                  isConnected
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${platformInfo.color}`}>{platformInfo.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                        {platformInfo.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        {platformInfo.description}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Badge variant="green" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="gray" size="sm">
                      <XCircle className="w-3 h-3 mr-1" />
                      Desconectado
                    </Badge>
                  )}
                </div>

                {isConnected && connection && (
                  <div className="space-y-2 mb-4 text-sm">
                    {connection.accountName && (
                      <div className="text-gray-600 dark:text-slate-400">
                        <span className="font-medium">Cuenta:</span> {connection.accountName}
                      </div>
                    )}
                    {connection.lastSyncAt && (
                      <div className="text-gray-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Última sincronización: {new Date(connection.lastSyncAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <Star className="w-3 h-3" />
                      <span>
                        {connection.reviewsImported} reseñas importadas ({connection.reviewsThisMonth} este mes)
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-slate-400">
                      <span className="font-medium">Sincronización:</span>{' '}
                      {SYNC_FREQUENCY_LABELS[connection.syncFrequency]}
                    </div>
                    {connection.error && (
                      <div className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{connection.error}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {!isConnected ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConnect(platform)}
                      className="flex-1"
                    >
                      Conectar
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => connection && handleSync(connection.id)}
                        className="flex-1"
                        disabled={loading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Sincronizar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => connection && setSelectedConnection(connection.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => connection && handleDisconnect(connection.id)}
                      >
                        Desconectar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Configuración de sincronización */}
      {selectedConnection && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Configurar Sincronización
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedConnection(null)}>
              Cerrar
            </Button>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Frecuencia de sincronización
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SYNC_FREQUENCY_LABELS) as SyncFrequency[]).map((frequency) => {
                const connection = connections.find((c) => c.id === selectedConnection);
                return (
                  <Button
                    key={frequency}
                    variant={connection?.syncFrequency === frequency ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() =>
                      onUpdateSyncFrequency && onUpdateSyncFrequency(selectedConnection, frequency)
                    }
                  >
                    {SYNC_FREQUENCY_LABELS[frequency]}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Solicitar reseñas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
              Solicitar Reseñas en Plataformas
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Envía solicitudes a tus clientes para que dejen reseñas directamente en estas plataformas
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowRequestModal(true)}
            disabled={connections.filter((c) => c.isConnected).length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Solicitar Reseña
          </Button>
        </div>

        {pendingRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Solicitudes Pendientes ({pendingRequests.length})
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => {
                const platformInfo = getPlatformInfo(request.platform);
                return (
                  <div
                    key={request.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platformInfo.color}`}>
                        {platformInfo.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-slate-100">
                          {request.clientName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          {platformInfo.name} • {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={request.status === 'sent' ? 'blue' : 'gray'}
                      size="sm"
                    >
                      {request.status === 'sent' ? 'Enviado' : 'Pendiente'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedRequests.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Reseñas Completadas ({completedRequests.length})
            </h3>
            <div className="space-y-2">
              {completedRequests.slice(0, 5).map((request) => {
                const platformInfo = getPlatformInfo(request.platform);
                return (
                  <div
                    key={request.id}
                    className="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platformInfo.color}`}>
                        {platformInfo.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-slate-100">
                          {request.clientName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          {platformInfo.name} • Completada el{' '}
                          {request.completedAt && new Date(request.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {request.link && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={request.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Modal para solicitar reseña */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Solicitar Reseña en Plataforma
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Cliente
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-100"
                  placeholder="Buscar cliente..."
                  onChange={(e) => {
                    // En una implementación real, esto sería un selector de clientes
                    if (e.target.value) {
                      setSelectedClient({ id: '1', name: e.target.value });
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Plataforma
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['google-my-business', 'facebook', 'instagram'] as SocialPlatform[]).map(
                    (platform) => {
                      const platformInfo = getPlatformInfo(platform);
                      const connection = connections.find((c) => c.platform === platform);
                      const isConnected = connection?.isConnected ?? false;

                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setSelectedPlatform(platform)}
                          disabled={!isConnected}
                          className={`p-3 rounded-lg border-2 ${
                            selectedPlatform === platform
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-gray-200 dark:border-gray-700'
                          } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`p-2 rounded-lg ${platformInfo.color} mb-2`}>
                            {platformInfo.icon}
                          </div>
                          <div className="text-xs font-medium text-gray-900 dark:text-slate-100">
                            {platformInfo.name}
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedClient(null);
                    setSelectedPlatform(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestReview}
                  disabled={!selectedClient || !selectedPlatform}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Solicitud
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

