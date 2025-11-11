import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { 
  Calendar, 
  AlertCircle, 
  Save,
  Info,
  CheckCircle
} from 'lucide-react';
import { 
  getConfiguracionDiasMaximosReserva,
  actualizarConfiguracionDiasMaximosReserva
} from '../api';
import { ConfiguracionDiasMaximosReserva as ConfiguracionDiasMaximosReservaType } from '../types';

interface ConfiguracionDiasMaximosReservaProps {
  entrenadorId: string;
}

export const ConfiguracionDiasMaximosReserva: React.FC<ConfiguracionDiasMaximosReservaProps> = ({ 
  entrenadorId 
}) => {
  const [config, setConfig] = useState<ConfiguracionDiasMaximosReservaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estado local
  const [activo, setActivo] = useState(false);
  const [diasMaximos, setDiasMaximos] = useState(30);
  
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarConfiguracion();
  }, [entrenadorId]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const configData = await getConfiguracionDiasMaximosReserva(entrenadorId);
      setConfig(configData);
      setActivo(configData.activo);
      setDiasMaximos(configData.diasMaximos);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const validarConfiguracion = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    
    if (activo) {
      if (diasMaximos < 1) {
        nuevosErrores.diasMaximos = 'Los días máximos deben ser al menos 1';
      } else if (diasMaximos > 365) {
        nuevosErrores.diasMaximos = 'Los días máximos no pueden ser mayores a 365 (1 año)';
      }
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarConfiguracion = async () => {
    if (!validarConfiguracion()) {
      return;
    }

    setGuardando(true);
    try {
      await actualizarConfiguracionDiasMaximosReserva(entrenadorId, {
        activo: activo,
        diasMaximos: diasMaximos,
      });
      
      await cargarConfiguracion();
      setMensajeExito('Configuración guardada correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setErrores({ general: 'Error al guardar la configuración. Por favor, intenta de nuevo.' });
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

  const haCambiado = 
    config?.activo !== activo ||
    config?.diasMaximos !== diasMaximos;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Días Máximos en el Futuro para Reservas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configura hasta cuántos días en el futuro se pueden hacer reservas para no comprometer tu disponibilidad demasiado tiempo por adelantado
              </p>
            </div>
          </div>

          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">{mensajeExito}</p>
            </div>
          )}

          {errores.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{errores.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="activo"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="activo" className="text-base font-medium text-gray-900 cursor-pointer">
                Activar límite de días máximos para reservas
              </label>
            </div>

            {activo && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días máximos en el futuro
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={diasMaximos}
                    onChange={(e) => setDiasMaximos(parseInt(e.target.value) || 1)}
                    className="w-32"
                    placeholder="30"
                  />
                  <span className="text-sm text-gray-600">días</span>
                </div>
                {errores.diasMaximos && (
                  <p className="mt-2 text-sm text-red-600">{errores.diasMaximos}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Ejemplo: Si configuras 30 días y hoy es lunes 1 de enero, 
                  los clientes solo podrán reservar hasta el jueves 31 de enero
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Cómo funciona el límite de días máximos?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Los clientes no podrán realizar reservas más allá del número de días configurado</li>
                    <li>Te permite mantener control sobre tu disponibilidad a largo plazo</li>
                    <li>Evita comprometer tu calendario demasiado tiempo por adelantado</li>
                    <li>Si está desactivado, no habrá límite de días para reservas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {haCambiado && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                onClick={guardarConfiguracion}
                disabled={guardando}
                loading={guardando}
                iconLeft={Save}
              >
                Guardar Configuración
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


