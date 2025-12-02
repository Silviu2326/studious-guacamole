import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  HealthIntegration,
  HealthProvider,
  HealthMetrics,
  HealthDataAnalysis,
  HealthMetricType,
} from '../types/health-integrations';
import {
  getClientHealthIntegrations,
  connectHealthIntegration,
  disconnectHealthIntegration,
  syncHealthData,
  getClientHealthMetrics,
  getHealthDataAnalysis,
} from '../api/health-integrations';
import {
  Activity,
  Apple,
  Smartphone,
  Watch,
  RefreshCw,
  Link2,
  Unlink,
  TrendingUp,
  TrendingDown,
  Loader2,
  Calendar,
  Heart,
  Footprints,
  Flame,
  Moon,
  Scale,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthIntegrationsPanelProps {
  clientId: string;
}

const PROVIDER_INFO: Record<HealthProvider, { name: string; icon: React.ReactNode; color: string }> = {
  'apple-health': {
    name: 'Apple Health',
    icon: <Apple className="w-5 h-5" />,
    color: 'text-gray-900',
  },
  'google-fit': {
    name: 'Google Fit',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'text-blue-600',
  },
  'garmin': {
    name: 'Garmin',
    icon: <Watch className="w-5 h-5" />,
    color: 'text-orange-600',
  },
};

export const HealthIntegrationsPanel: React.FC<HealthIntegrationsPanelProps> = ({ clientId }) => {
  const [integrations, setIntegrations] = useState<HealthIntegration[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [analysis, setAnalysis] = useState<HealthDataAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<HealthProvider | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>('steps');

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [integrationsData, metricsData, analysisData] = await Promise.all([
        getClientHealthIntegrations(clientId),
        getClientHealthMetrics(clientId),
        getHealthDataAnalysis(clientId, 'month'),
      ]);
      setIntegrations(integrationsData);
      setMetrics(metricsData);
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error cargando integraciones de salud:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: HealthProvider) => {
    try {
      await connectHealthIntegration({
        clientId,
        provider,
        syncFrequency: 'daily',
      });
      await loadData();
      setShowConnectModal(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error conectando integración:', error);
      alert('Error al conectar la integración');
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm('¿Desconectar esta integración?')) {
      return;
    }
    
    try {
      await disconnectHealthIntegration(integrationId);
      await loadData();
    } catch (error) {
      console.error('Error desconectando integración:', error);
      alert('Error al desconectar la integración');
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId);
    try {
      await syncHealthData({ integrationId });
      await loadData();
    } catch (error) {
      console.error('Error sincronizando datos:', error);
      alert('Error al sincronizar datos');
    } finally {
      setSyncing(null);
    }
  };

  const getStatusBadge = (status: HealthIntegration['status']) => {
    const badges = {
      connected: <Badge variant="success">Conectado</Badge>,
      disconnected: <Badge variant="secondary">Desconectado</Badge>,
      error: <Badge variant="destructive">Error</Badge>,
      syncing: <Badge variant="blue">Sincronizando</Badge>,
    };
    return badges[status] || badges.disconnected;
  };

  const getMetricIcon = (metric: HealthMetricType) => {
    const icons = {
      steps: <Footprints className="w-4 h-4" />,
      distance: <Activity className="w-4 h-4" />,
      calories: <Flame className="w-4 h-4" />,
      'heart-rate': <Heart className="w-4 h-4" />,
      'active-energy': <Flame className="w-4 h-4" />,
      workouts: <Activity className="w-4 h-4" />,
      sleep: <Moon className="w-4 h-4" />,
      weight: <Scale className="w-4 h-4" />,
      'body-fat': <Scale className="w-4 h-4" />,
      'muscle-mass': <Scale className="w-4 h-4" />,
      'vo2-max': <Activity className="w-4 h-4" />,
      'resting-heart-rate': <Heart className="w-4 h-4" />,
      'blood-pressure': <Heart className="w-4 h-4" />,
      'blood-glucose': <Activity className="w-4 h-4" />,
    };
    return icons[metric] || <Activity className="w-4 h-4" />;
  };

  const getMetricLabel = (metric: HealthMetricType) => {
    const labels = {
      steps: 'Pasos',
      distance: 'Distancia',
      calories: 'Calorías',
      'heart-rate': 'Frecuencia Cardíaca',
      'active-energy': 'Energía Activa',
      workouts: 'Entrenamientos',
      sleep: 'Sueño',
      weight: 'Peso',
      'body-fat': 'Grasa Corporal',
      'muscle-mass': 'Masa Muscular',
      'vo2-max': 'VO2 Máx',
      'resting-heart-rate': 'Frecuencia Cardíaca en Reposo',
      'blood-pressure': 'Presión Arterial',
      'blood-glucose': 'Glucosa en Sangre',
    };
    return labels[metric] || metric;
  };

  const getMetricValue = (metric: HealthMetrics, metricType: HealthMetricType): number | null => {
    switch (metricType) {
      case 'steps':
        return metric.steps || null;
      case 'distance':
        return metric.distance ? metric.distance / 1000 : null; // Convertir a km
      case 'calories':
        return metric.calories || null;
      case 'heart-rate':
        return metric.heartRate?.average || null;
      default:
        return null;
    }
  };

  const getMetricUnit = (metricType: HealthMetricType): string => {
    const units = {
      steps: 'pasos',
      distance: 'km',
      calories: 'kcal',
      'heart-rate': 'bpm',
      'active-energy': 'kcal',
      workouts: 'sesiones',
      sleep: 'min',
      weight: 'kg',
      'body-fat': '%',
      'muscle-mass': 'kg',
      'vo2-max': 'ml/kg/min',
      'resting-heart-rate': 'bpm',
      'blood-pressure': 'mmHg',
      'blood-glucose': 'mg/dL',
    };
    return units[metricType] || '';
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando integraciones de salud...</p>
      </Card>
    );
  }

  const chartData = metrics
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      value: getMetricValue(m, selectedMetric),
    }))
    .filter((d) => d.value !== null);

  const connectedIntegrations = integrations.filter((i) => i.status === 'connected');
  const availableProviders: HealthProvider[] = ['apple-health', 'google-fit', 'garmin'];
  const connectedProviders = integrations.map((i) => i.provider);

  return (
    <div className="space-y-6">
      {/* Integraciones Conectadas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Integraciones de Salud</h3>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Link2 className="w-4 h-4" />}
            onClick={() => setShowConnectModal(true)}
          >
            Conectar Nueva
          </Button>
        </div>

        {integrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No hay integraciones conectadas</p>
            <p className="text-sm mt-2">Conecta Apple Health, Google Fit o Garmin para sincronizar datos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map((integration) => {
              const providerInfo = PROVIDER_INFO[integration.provider];
              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${providerInfo.color}`}>{providerInfo.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{providerInfo.name}</h4>
                        {getStatusBadge(integration.status)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {integration.lastSyncAt
                          ? `Última sincronización: ${new Date(integration.lastSyncAt).toLocaleString('es-ES')}`
                          : 'Nunca sincronizado'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Métricas:</span>
                        {integration.enabledMetrics.slice(0, 3).map((metric) => (
                          <span key={metric} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {getMetricLabel(metric)}
                          </span>
                        ))}
                        {integration.enabledMetrics.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{integration.enabledMetrics.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.status === 'connected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={
                          syncing === integration.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )
                        }
                        onClick={() => handleSync(integration.id)}
                        disabled={syncing === integration.id}
                      >
                        Sincronizar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      leftIcon={<Unlink className="w-4 h-4" />}
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Desconectar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Análisis y Tendencias */}
      {analysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análisis y Tendencias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pasos</span>
                {analysis.trends.steps.trend === 'increasing' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysis.trends.steps.current.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {analysis.trends.steps.change > 0 ? '+' : ''}
                {analysis.trends.steps.change.toFixed(1)}% vs período anterior
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Calorías</span>
                {analysis.trends.calories.trend === 'increasing' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analysis.trends.calories.current.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {analysis.trends.calories.change > 0 ? '+' : ''}
                {analysis.trends.calories.change.toFixed(1)}% vs período anterior
              </div>
            </div>
          </div>

          {analysis.insights.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Insights</h4>
              <ul className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recomendaciones</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Gráfico de Métricas */}
      {connectedIntegrations.length > 0 && metrics.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Métricas de Actividad</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as HealthMetricType)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="steps">Pasos</option>
              <option value="distance">Distancia</option>
              <option value="calories">Calorías</option>
              <option value="heart-rate">Frecuencia Cardíaca</option>
            </select>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name={getMetricLabel(selectedMetric)}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hay datos disponibles para esta métrica</p>
            </div>
          )}
        </Card>
      )}

      {/* Modal de Conexión */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Conectar Integración de Salud</h3>
            <div className="space-y-3">
              {availableProviders.map((provider) => {
                const providerInfo = PROVIDER_INFO[provider];
                const isConnected = connectedProviders.includes(provider);
                return (
                  <button
                    key={provider}
                    onClick={() => !isConnected && handleConnect(provider)}
                    disabled={isConnected}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      isConnected
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={providerInfo.color}>{providerInfo.icon}</div>
                        <span className="font-medium">{providerInfo.name}</span>
                      </div>
                      {isConnected ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Link2 className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setShowConnectModal(false)}>
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

