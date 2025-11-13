/**
 * Componente de integración con dashboards globales del ERP
 * User Story: Como manager quiero consolidar métricas de objetivos en dashboards globales del ERP
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Tabs } from '../../../components/componentsreutilizables';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Megaphone,
  Settings,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  getERPDashboardMetrics,
  getAllERPDashboardMetrics,
  ERPDashboardMetric,
  ERPDashboardType,
  getERPDashboardConfig,
  updateERPDashboardConfig,
  ERPDashboardConfig,
} from '../api/erpDashboardIntegration';

interface ERPDashboardIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERPDashboardIntegration: React.FC<ERPDashboardIntegrationProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDashboard, setActiveDashboard] = useState<ERPDashboardType>('finanzas');
  const [metrics, setMetrics] = useState<Record<ERPDashboardType, ERPDashboardMetric[]>>({
    finanzas: [],
    marketing: [],
    operaciones: [],
  });
  const [loading, setLoading] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [config, setConfig] = useState<ERPDashboardConfig | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAllMetrics();
      loadConfig();
    }
  }, [isOpen, activeDashboard]);

  const loadAllMetrics = async () => {
    setLoading(true);
    try {
      const allMetrics = await getAllERPDashboardMetrics();
      setMetrics(allMetrics);
    } catch (error) {
      console.error('Error loading ERP dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const dashboardConfig = await getERPDashboardConfig(activeDashboard);
      setConfig(dashboardConfig);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleRefresh = async () => {
    await loadAllMetrics();
  };

  const getStatusIcon = (status: ERPDashboardMetric['status']) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'at_risk':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'behind':
        return <XCircle className="text-red-600" size={20} />;
      case 'exceeded':
        return <TrendingUp className="text-blue-600" size={20} />;
      default:
        return <Minus className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: ERPDashboardMetric['status']) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-700';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'behind':
        return 'bg-red-100 text-red-700';
      case 'exceeded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (direction?: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-600" size={16} />;
      default:
        return <Minus className="text-gray-600" size={16} />;
    }
  };

  const getDashboardIcon = (type: ERPDashboardType) => {
    switch (type) {
      case 'finanzas':
        return <DollarSign size={20} />;
      case 'marketing':
        return <Megaphone size={20} />;
      case 'operaciones':
        return <Settings size={20} />;
    }
  };

  const getDashboardLabel = (type: ERPDashboardType) => {
    switch (type) {
      case 'finanzas':
        return 'Finanzas';
      case 'marketing':
        return 'Marketing';
      case 'operaciones':
        return 'Operaciones';
    }
  };

  const currentMetrics = metrics[activeDashboard] || [];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Integración con Dashboards ERP" size="xl">
        <div className="space-y-6">
          {/* Dashboard Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              {(['finanzas', 'marketing', 'operaciones'] as ERPDashboardType[]).map((type) => {
                const Icon = getDashboardIcon(type);
                return (
                  <button
                    key={type}
                    onClick={() => setActiveDashboard(type)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                      activeDashboard === type
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {Icon}
                    {getDashboardLabel(type)}
                    {metrics[type]?.length > 0 && (
                      <Badge className="bg-gray-100 text-gray-700">
                        {metrics[type].length}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfigModalOpen(true)}
              >
                <Settings size={16} className="mr-2" />
                Configurar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Metrics List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Cargando métricas...</div>
            </div>
          ) : currentMetrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay métricas en este dashboard
              </h3>
              <p className="text-gray-600 mb-4">
                Configura la integración para sincronizar objetivos con este dashboard del ERP
              </p>
              <Button onClick={() => setConfigModalOpen(true)}>
                <Settings size={16} className="mr-2" />
                Configurar Integración
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {currentMetrics.map((metric) => (
                <Card key={metric.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(metric.status)}
                        <h3 className="font-semibold text-gray-900">{metric.objectiveTitle}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{metric.metric}</p>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === 'on_track' && 'En camino'}
                      {metric.status === 'at_risk' && 'En riesgo'}
                      {metric.status === 'behind' && 'Retrasado'}
                      {metric.status === 'exceeded' && 'Superado'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Valor Actual</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {metric.currentValue.toLocaleString()} {metric.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Objetivo</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {metric.targetValue.toLocaleString()} {metric.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Progreso</span>
                      <p className="text-lg font-semibold text-gray-900">{metric.progress}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          metric.progress >= 100
                            ? 'bg-blue-500'
                            : metric.progress >= 75
                            ? 'bg-green-500'
                            : metric.progress >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(metric.progress, 100)}%` }}
                      />
                    </div>
                    {metric.trend && (
                      <div className="flex items-center gap-1 ml-3 text-sm">
                        {getTrendIcon(metric.trend.direction)}
                        <span
                          className={
                            metric.trend.direction === 'up'
                              ? 'text-green-600'
                              : metric.trend.direction === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }
                        >
                          {metric.trend.direction === 'up' ? '+' : ''}
                          {metric.trend.value}% {metric.trend.period}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Última actualización: {new Date(metric.lastUpdated).toLocaleString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navegar al objetivo en el módulo
                          window.location.href = `/objetivos-rendimiento?objectiveId=${metric.objectiveId}`;
                        }}
                      >
                        Ver detalle
                        <ArrowUpRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Summary */}
          {currentMetrics.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-blue-700 font-medium">Total Objetivos</span>
                  <p className="text-2xl font-bold text-blue-900">{currentMetrics.length}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-700 font-medium">En Camino</span>
                  <p className="text-2xl font-bold text-green-600">
                    {currentMetrics.filter(m => m.status === 'on_track').length}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-700 font-medium">En Riesgo</span>
                  <p className="text-2xl font-bold text-yellow-600">
                    {currentMetrics.filter(m => m.status === 'at_risk').length}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-700 font-medium">Progreso Promedio</span>
                  <p className="text-2xl font-bold text-blue-900">
                    {Math.round(
                      currentMetrics.reduce((sum, m) => sum + m.progress, 0) / currentMetrics.length
                    )}
                    %
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Modal>

      {/* Configuration Modal */}
      {config && (
        <Modal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          title={`Configurar Dashboard: ${getDashboardLabel(activeDashboard)}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, enabled: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="font-medium">Habilitar integración</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Sincronizar objetivos con el dashboard {getDashboardLabel(activeDashboard)} del ERP
              </p>
            </div>

            {config.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervalo de actualización (segundos)
                </label>
                <input
                  type="number"
                  value={config.refreshInterval || 3600}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      refreshInterval: parseInt(e.target.value) || 3600,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={60}
                  step={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tiempo entre actualizaciones automáticas (mínimo: 60 segundos)
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                onClick={async () => {
                  if (config) {
                    await updateERPDashboardConfig(config);
                    setConfigModalOpen(false);
                    await loadConfig();
                  }
                }}
                className="flex-1"
              >
                Guardar Configuración
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfigModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

