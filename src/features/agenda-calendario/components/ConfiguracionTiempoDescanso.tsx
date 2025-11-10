import React, { useState, useEffect } from 'react';
import { Clock, Save, AlertCircle } from 'lucide-react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { ConfiguracionTiempoDescanso } from '../types';
import { getConfiguracionTiempoDescanso, actualizarConfiguracionTiempoDescanso } from '../api/configuracion';
import { useAuth } from '../../../context/AuthContext';

export const ConfiguracionTiempoDescanso: React.FC = () => {
  const { user } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionTiempoDescanso | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tiempoMinimo, setTiempoMinimo] = useState(15);
  const [activo, setActivo] = useState(true);
  const [permitirOverride, setPermitirOverride] = useState(true);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await getConfiguracionTiempoDescanso(user?.id);
      setConfiguracion(config);
      setTiempoMinimo(config.tiempoMinimoMinutos);
      setActivo(config.activo);
      setPermitirOverride(config.permitirOverride);
    } catch (err) {
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async () => {
    if (tiempoMinimo < 0) {
      setError('El tiempo mínimo debe ser mayor o igual a 0');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const configActualizada = await actualizarConfiguracionTiempoDescanso({
        id: configuracion?.id || '1',
        tiempoMinimoMinutos: tiempoMinimo,
        activo,
        permitirOverride,
        userId: user?.id,
        createdAt: configuracion?.createdAt || new Date(),
        updatedAt: new Date(),
      });
      setConfiguracion(configActualizada);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const opcionesTiempo = [
    { value: 0, label: '0 minutos (sin descanso)' },
    { value: 5, label: '5 minutos' },
    { value: 10, label: '10 minutos' },
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Configuración de Tiempo de Descanso
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configura el tiempo mínimo de descanso entre sesiones para evitar agendamiento consecutivo
        </p>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando configuración...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-800">
                  <Save className="w-5 h-5" />
                  <span className="text-sm">Configuración guardada correctamente</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Activar tiempo de descanso automático
                    </span>
                  </label>
                </div>

                {activo && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo mínimo entre sesiones
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={tiempoMinimo}
                          onChange={(e) => setTiempoMinimo(parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {opcionesTiempo.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                              {opcion.label}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          value={tiempoMinimo}
                          onChange={(e) => setTiempoMinimo(parseInt(e.target.value) || 0)}
                          min="0"
                          max="120"
                          placeholder="Minutos"
                          className="w-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Selecciona de la lista o ingresa un valor personalizado (0-120 minutos)
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={permitirOverride}
                            onChange={(e) => setPermitirOverride(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Permitir override manual
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Si está activado, podrás agendar sesiones consecutivas manualmente si es necesario
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                          ¿Cómo funciona?
                        </h4>
                        <p className="text-xs text-blue-800">
                          Cuando esta configuración está activa, el sistema automáticamente respetará un tiempo mínimo de descanso entre sesiones al crear o mover citas. 
                          {permitirOverride && ' Si el override manual está habilitado, podrás agendar sesiones consecutivas cuando sea necesario.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={guardarConfiguracion}
                    disabled={saving}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


