// User Story 1: Componente para configurar sincronización de widgets con ERP
import React, { useState, useEffect } from 'react';
import { WidgetSyncConfig, ERPSource, WidgetSyncStatus } from '../types';
import { getSyncConfig, saveSyncConfig, deleteSyncConfig, getAvailableMetrics, getSyncStatus, syncWidget } from '../api/sync';
import { Card, Button, Select, Input, Badge, Modal } from '../../../components/componentsreutilizables';
import { RefreshCw, Settings, X, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';

interface WidgetSyncConfigProps {
  widgetId: string;
  widgetName: string;
  currentValue?: number;
  currentUnit?: string;
  onSync?: (data: { value: number; unit: string }) => void;
}

export const WidgetSyncConfig: React.FC<WidgetSyncConfigProps> = ({
  widgetId,
  widgetName,
  currentValue,
  currentUnit,
  onSync,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WidgetSyncConfig | null>(null);
  const [status, setStatus] = useState<WidgetSyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableMetrics, setAvailableMetrics] = useState<{ id: string; name: string; unit: string }[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen, widgetId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const [configData, statusData] = await Promise.all([
        getSyncConfig(widgetId),
        getSyncStatus(widgetId),
      ]);
      
      setConfig(configData || {
        widgetId,
        source: 'finanzas',
        sourceMetric: '',
        syncEnabled: false,
        syncInterval: 60,
        autoSync: true,
      });
      setStatus(statusData);
      
      if (configData?.source) {
        const metrics = await getAvailableMetrics(configData.source);
        setAvailableMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading sync config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceChange = async (source: ERPSource) => {
    if (!config) return;
    
    const metrics = await getAvailableMetrics(source);
    setAvailableMetrics(metrics);
    
    setConfig({
      ...config,
      source,
      sourceMetric: metrics[0]?.id || '',
    });
  };

  const handleSave = async () => {
    if (!config) return;
    
    setLoading(true);
    try {
      const saved = await saveSyncConfig(config);
      setConfig(saved);
      await loadConfig();
      
      // Si está habilitado y auto-sync, hacer una sincronización inmediata
      if (saved.syncEnabled && saved.autoSync) {
        handleSync();
      }
    } catch (error) {
      console.error('Error saving sync config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!config) return;
    
    setSyncing(true);
    try {
      const data = await syncWidget(widgetId);
      if (data && onSync) {
        onSync({ value: data.value, unit: data.unit });
      }
      await loadConfig();
    } catch (error) {
      console.error('Error syncing widget:', error);
      alert('Error al sincronizar el widget');
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar la configuración de sincronización?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteSyncConfig(widgetId);
      setConfig(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting sync config:', error);
      alert('Error al eliminar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        title="Configurar sincronización"
      >
        <Settings className="w-4 h-4" />
      </button>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={`Sincronizar: ${widgetName}`}
      size="lg"
      footer={
        <div className="flex gap-3 justify-between">
          <div>
            {config && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading || !config?.sourceMetric}
            >
              Guardar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {loading && !config ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        ) : (
          <>
            {/* Estado actual */}
            {status && (
              <Card className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Estado de Sincronización</h4>
                  {status.lastSyncStatus === 'success' && (
                    <Badge variant="green">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Activa
                    </Badge>
                  )}
                  {status.lastSyncStatus === 'error' && (
                    <Badge variant="red">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                  {status.lastSyncStatus === 'pending' && (
                    <Badge variant="blue">
                      <Clock className="w-3 h-3 mr-1" />
                      Pendiente
                    </Badge>
                  )}
                </div>
                {status.lastSyncTime && (
                  <p className="text-sm text-gray-600 mb-1">
                    Última sincronización: {new Date(status.lastSyncTime).toLocaleString('es-ES')}
                  </p>
                )}
                {status.nextSyncTime && (
                  <p className="text-sm text-gray-600">
                    Próxima sincronización: {new Date(status.nextSyncTime).toLocaleString('es-ES')}
                  </p>
                )}
                {config?.syncEnabled && (
                  <Button
                    variant="secondary"
                    onClick={handleSync}
                    disabled={syncing}
                    className="mt-3"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
                  </Button>
                )}
              </Card>
            )}

            {/* Configuración */}
            {config && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habilitar Sincronización
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.syncEnabled}
                      onChange={(e) => setConfig({ ...config, syncEnabled: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Sincronizar este widget con otras áreas del ERP
                    </span>
                  </label>
                </div>

                {config.syncEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área del ERP
                      </label>
                      <Select
                        value={config.source}
                        onChange={(e) => handleSourceChange(e.target.value as ERPSource)}
                        options={[
                          { value: 'finanzas', label: 'Finanzas' },
                          { value: 'adherencia', label: 'Adherencia' },
                          { value: 'campanas', label: 'Campañas' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Métrica
                      </label>
                      <Select
                        value={config.sourceMetric}
                        onChange={(e) => setConfig({ ...config, sourceMetric: e.target.value })}
                        options={[
                          { value: '', label: 'Seleccionar métrica...' },
                          ...availableMetrics.map(m => ({
                            value: m.id,
                            label: `${m.name} (${m.unit})`,
                          })),
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervalo de Sincronización (segundos)
                      </label>
                      <Select
                        value={config.syncInterval.toString()}
                        onChange={(e) => setConfig({ ...config, syncInterval: parseInt(e.target.value) })}
                        options={[
                          { value: '30', label: '30 segundos' },
                          { value: '60', label: '1 minuto' },
                          { value: '300', label: '5 minutos' },
                          { value: '600', label: '10 minutos' },
                          { value: '1800', label: '30 minutos' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.autoSync}
                          onChange={(e) => setConfig({ ...config, autoSync: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Sincronización automática
                        </span>
                      </label>
                    </div>

                    {/* Valores actuales */}
                    {currentValue !== undefined && (
                      <Card className="p-4 bg-blue-50 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Valor Actual del Widget</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {currentValue} {currentUnit || ''}
                        </p>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

