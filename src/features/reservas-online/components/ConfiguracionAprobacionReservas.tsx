import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Save,
  Info
} from 'lucide-react';
import { 
  getConfiguracionAprobacion, 
  actualizarConfiguracionAprobacion 
} from '../api/configuracionAprobacion';
import { ConfiguracionAprobacionReservas } from '../types';

interface ConfiguracionAprobacionReservasProps {
  entrenadorId: string;
}

export const ConfiguracionAprobacionReservas: React.FC<ConfiguracionAprobacionReservasProps> = ({ 
  entrenadorId 
}) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionAprobacionReservas | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aprobacionAutomatica, setAprobacionAutomatica] = useState(true);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    cargarConfiguracion();
  }, [entrenadorId]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await getConfiguracionAprobacion(entrenadorId);
      setConfiguracion(config);
      setAprobacionAutomatica(config.aprobacionAutomatica);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    try {
      const configActualizada = await actualizarConfiguracionAprobacion(
        entrenadorId,
        aprobacionAutomatica
      );
      setConfiguracion(configActualizada);
      setMensajeExito('Configuración guardada correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando configuración...</p>
      </Card>
    );
  }

  const haCambiado = configuracion?.aprobacionAutomatica !== aprobacionAutomatica;

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Configuración de Aprobación de Reservas</h3>
            <p className="text-sm text-gray-600 mt-1">
              Elige si las reservas de clientes se confirman automáticamente o requieren tu aprobación
            </p>
          </div>
        </div>

        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{mensajeExito}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="aprobacion"
                checked={aprobacionAutomatica}
                onChange={() => setAprobacionAutomatica(true)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-base font-semibold text-gray-900">
                    Aprobación Automática
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Las reservas se confirmarán automáticamente cuando los clientes las realicen. 
                  Ideal para agilizar el proceso y permitir reservas 24/7.
                </p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="aprobacion"
                checked={!aprobacionAutomatica}
                onChange={() => setAprobacionAutomatica(false)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-base font-semibold text-gray-900">
                    Aprobación Manual
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Las reservas quedarán en estado "pendiente" y deberás aprobarlas manualmente. 
                  Te da mayor control sobre tu agenda.
                </p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Cómo funciona?</p>
                <ul className="list-disc list-inside space-y-1">
                  {aprobacionAutomatica ? (
                    <>
                      <li>Los clientes pueden reservar y la sesión se confirma inmediatamente</li>
                      <li>Recibirás una notificación cuando se realice una reserva</li>
                      <li>Las reservas aparecerán directamente en tu agenda como "confirmadas"</li>
                    </>
                  ) : (
                    <>
                      <li>Los clientes pueden reservar pero la sesión quedará en "pendiente"</li>
                      <li>Recibirás una notificación para revisar y aprobar la reserva</li>
                      <li>Debes aprobar o rechazar cada reserva desde la sección de reservas</li>
                      <li>El cliente recibirá un email cuando apruebes o rechaces su reserva</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {haCambiado && (
            <Button
              variant="primary"
              onClick={guardarConfiguracion}
              disabled={guardando}
              loading={guardando}
              iconLeft={Save}
              fullWidth
            >
              Guardar Configuración
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};


