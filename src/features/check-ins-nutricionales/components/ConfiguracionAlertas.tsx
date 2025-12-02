import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { AlertTriangle, Bell, TrendingDown, Calendar } from 'lucide-react';
import {
  ConfigAlertasCheckInNutricional,
  getConfigAlertas,
  setConfigAlertas,
} from '../api/alertas';

interface ConfiguracionAlertasProps {
  isOpen: boolean;
  onClose: () => void;
  entrenadorId: string;
  clienteId: string;
}

export const ConfiguracionAlertas: React.FC<ConfiguracionAlertasProps> = ({
  isOpen,
  onClose,
  entrenadorId,
  clienteId,
}) => {
  const [config, setConfig] = useState<ConfigAlertasCheckInNutricional | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (isOpen) {
      cargarConfig();
    }
  }, [isOpen, entrenadorId, clienteId]);

  const cargarConfig = async () => {
    setCargando(true);
    try {
      const conf = await getConfigAlertas(entrenadorId, clienteId);
      setConfig(conf);
    } catch (error) {
      console.error('Error al cargar configuración de alertas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await setConfigAlertas(entrenadorId, clienteId, config);
      onClose();
    } catch (error) {
      console.error('Error al guardar configuración de alertas:', error);
      alert('Error al guardar la configuración');
    }
  };

  if (cargando || !config) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Alertas Automáticas">
        <div className="p-4">Cargando...</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Alertas Automáticas" size="lg">
      <div className="space-y-6">
        {/* Activar/Desactivar alertas */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Alertas automáticas</h3>
              <p className="text-sm text-slate-600 mt-1">
                Activa alertas cuando se detecten problemas de adherencia o ausencia de check-ins
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </Card>

        {config.enabled && (
          <>
            {/* Alerta por días sin check-ins */}
            <Card className="p-4 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Días sin check-ins
                      </h3>
                      <p className="text-sm text-slate-600">
                        Alerta cuando el cliente acumule varios días sin realizar check-ins
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.diasSinCheckIns.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          diasSinCheckIns: {
                            ...config.diasSinCheckIns,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {config.diasSinCheckIns.enabled && (
                  <div className="pl-14 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Umbral de días
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={config.diasSinCheckIns.umbralDias}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            diasSinCheckIns: {
                              ...config.diasSinCheckIns,
                              umbralDias: Math.max(1, Number(e.target.value)),
                            },
                          })
                        }
                        min={1}
                        max={30}
                        className="w-24"
                      />
                      <span className="text-sm text-slate-600">
                        días sin check-ins para activar la alerta
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Se enviará una alerta cuando el cliente no haya realizado check-ins durante este número de días consecutivos
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Alerta por umbral de adherencia */}
            <Card className="p-4 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Umbral de adherencia
                      </h3>
                      <p className="text-sm text-slate-600">
                        Alerta cuando la adherencia nutricional caiga por debajo de un porcentaje mínimo
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.umbralAdherencia.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          umbralAdherencia: {
                            ...config.umbralAdherencia,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {config.umbralAdherencia.enabled && (
                  <div className="pl-14 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Porcentaje mínimo de adherencia
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={config.umbralAdherencia.umbralPorcentaje}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            umbralAdherencia: {
                              ...config.umbralAdherencia,
                              umbralPorcentaje: Math.max(0, Math.min(100, Number(e.target.value))),
                            },
                          })
                        }
                        min={0}
                        max={100}
                        className="w-24"
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Se enviará una alerta cuando la adherencia nutricional del cliente caiga por debajo de este porcentaje
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Configuración de canal de notificación */}
            <Card className="p-4 bg-white">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Canal de notificación
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cómo recibir las alertas
                </label>
                <Select
                  value={config.canal}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      canal: e.target.value as 'push' | 'email' | 'ambos',
                    })
                  }
                  options={[
                    { value: 'push', label: 'Notificación push' },
                    { value: 'email', label: 'Email' },
                    { value: 'ambos', label: 'Ambos (push y email)' },
                  ]}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Selecciona cómo quieres recibir las alertas automáticas
                </p>
              </div>
            </Card>

            {/* Información adicional */}
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">¿Cómo funcionan las alertas?</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Las alertas se verifican automáticamente cada hora</li>
                    <li>Se creará una alerta solo si no existe una alerta activa del mismo tipo</li>
                    <li>Las alertas te ayudan a intervenir antes de que el cliente abandone el plan nutricional</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Bell size={18} className="mr-2" />
            Guardar configuración
          </Button>
        </div>
      </div>
    </Modal>
  );
};

