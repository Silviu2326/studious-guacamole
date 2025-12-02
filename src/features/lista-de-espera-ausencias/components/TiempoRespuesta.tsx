import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { ConfiguracionTiempoRespuesta } from '../types';
import { Clock, Bell, DollarSign, Shield } from 'lucide-react';

export const TiempoRespuesta: React.FC = () => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionTiempoRespuesta>({
    tiempoDisponibilidadPlaza: 30,
    recordatorio24h: true,
    recordatorio2h: true,
    penalizacionNoShow: {
      habilitada: true,
      tipo: 'multa',
      multaMonto: 10,
      diasBloqueo: 7,
    },
  });

  const handleGuardar = () => {
    // Aquí se guardaría la configuración
    console.log('Guardando configuración:', configuracion);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ring-1 ring-blue-200/70">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Configuración de Tiempo de Respuesta
            </h3>
            <p className="text-sm text-gray-600">
              Configure los tiempos límite para confirmación de reservas y recordatorios
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tiempo para Confirmar Plaza Disponible (minutos)
            </label>
            <Input
              type="number"
              value={configuracion.tiempoDisponibilidadPlaza.toString()}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                tiempoDisponibilidadPlaza: parseInt(e.target.value) || 30,
              })}
              placeholder="30"
            />
            <p className="text-sm text-gray-600 mt-2">
              Tiempo que tiene un socio en lista de espera para confirmar su reserva cuando se libera una plaza.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-500" />
              <h4 className="text-lg font-semibold text-gray-900">
                Recordatorios Automáticos
              </h4>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configuracion.recordatorio24h}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    recordatorio24h: e.target.checked,
                  })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-900">
                  Enviar recordatorio 24 horas antes de la clase
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configuracion.recordatorio2h}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    recordatorio2h: e.target.checked,
                  })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-900">
                  Enviar recordatorio 2 horas antes de la clase
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-500" />
              <h4 className="text-lg font-semibold text-gray-900">
                Penalización por No Show
              </h4>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configuracion.penalizacionNoShow.habilitada}
                  onChange={(e) => setConfiguracion({
                    ...configuracion,
                    penalizacionNoShow: {
                      ...configuracion.penalizacionNoShow,
                      habilitada: e.target.checked,
                    },
                  })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-900">
                  Habilitar penalización por no asistir sin cancelar
                </span>
              </label>

              {configuracion.penalizacionNoShow.habilitada && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tipo de Penalización
                    </label>
                    <Select
                      value={configuracion.penalizacionNoShow.tipo}
                      onChange={(e) => setConfiguracion({
                        ...configuracion,
                        penalizacionNoShow: {
                          ...configuracion.penalizacionNoShow,
                          tipo: e.target.value as 'multa' | 'bloqueo' | 'ambos',
                        },
                      })}
                      options={[
                        { value: 'multa', label: 'Multa Económica' },
                        { value: 'bloqueo', label: 'Bloqueo Temporal' },
                        { value: 'ambos', label: 'Ambos' },
                      ]}
                    />
                  </div>

                  {(configuracion.penalizacionNoShow.tipo === 'multa' || configuracion.penalizacionNoShow.tipo === 'ambos') && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Monto de la Multa (€)
                      </label>
                      <Input
                        type="number"
                        value={configuracion.penalizacionNoShow.multaMonto?.toString() || ''}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          penalizacionNoShow: {
                            ...configuracion.penalizacionNoShow,
                            multaMonto: parseFloat(e.target.value) || 0,
                          },
                        })}
                        placeholder="10"
                      />
                    </div>
                  )}

                  {(configuracion.penalizacionNoShow.tipo === 'bloqueo' || configuracion.penalizacionNoShow.tipo === 'ambos') && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Días de Bloqueo
                      </label>
                      <Input
                        type="number"
                        value={configuracion.penalizacionNoShow.diasBloqueo?.toString() || ''}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          penalizacionNoShow: {
                            ...configuracion.penalizacionNoShow,
                            diasBloqueo: parseInt(e.target.value) || 0,
                          },
                        })}
                        placeholder="7"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => {}}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              Guardar Configuración
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

