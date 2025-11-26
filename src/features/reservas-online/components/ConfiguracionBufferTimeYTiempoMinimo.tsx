import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { 
  Clock, 
  AlertCircle, 
  Save,
  Info,
  CheckCircle
} from 'lucide-react';
import { 
  getConfiguracionBufferTime,
  actualizarConfiguracionBufferTime,
  getConfiguracionTiempoMinimoAnticipacion,
  actualizarConfiguracionTiempoMinimoAnticipacion
} from '../api';
import { 
  ConfiguracionBufferTime,
  ConfiguracionTiempoMinimoAnticipacion
} from '../types';

interface ConfiguracionBufferTimeYTiempoMinimoProps {
  entrenadorId: string;
}

export const ConfiguracionBufferTimeYTiempoMinimo: React.FC<ConfiguracionBufferTimeYTiempoMinimoProps> = ({ 
  entrenadorId 
}) => {
  const [configBufferTime, setConfigBufferTime] = useState<ConfiguracionBufferTime | null>(null);
  const [configTiempoMinimo, setConfigTiempoMinimo] = useState<ConfiguracionTiempoMinimoAnticipacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estado local para buffer time
  const [bufferActivo, setBufferActivo] = useState(false);
  const [minutosBuffer, setMinutosBuffer] = useState(15);
  
  // Estado local para tiempo mínimo
  const [tiempoMinimoActivo, setTiempoMinimoActivo] = useState(false);
  const [horasMinimasAnticipacion, setHorasMinimasAnticipacion] = useState(24);
  
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarConfiguraciones();
  }, [entrenadorId]);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const [bufferConfig, tiempoMinimoConfig] = await Promise.all([
        getConfiguracionBufferTime(entrenadorId),
        getConfiguracionTiempoMinimoAnticipacion(entrenadorId)
      ]);
      
      setConfigBufferTime(bufferConfig);
      setConfigTiempoMinimo(tiempoMinimoConfig);
      setBufferActivo(bufferConfig.activo);
      setMinutosBuffer(bufferConfig.minutosBuffer);
      setTiempoMinimoActivo(tiempoMinimoConfig.activo);
      setHorasMinimasAnticipacion(tiempoMinimoConfig.horasMinimasAnticipacion);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const validarConfiguraciones = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    
    if (bufferActivo) {
      if (minutosBuffer < 0) {
        nuevosErrores.bufferTime = 'Los minutos de buffer no pueden ser negativos';
      } else if (minutosBuffer > 240) {
        nuevosErrores.bufferTime = 'Los minutos de buffer no pueden ser mayores a 240 (4 horas)';
      }
    }
    
    if (tiempoMinimoActivo) {
      if (horasMinimasAnticipacion < 0) {
        nuevosErrores.tiempoMinimo = 'Las horas mínimas no pueden ser negativas';
      } else if (horasMinimasAnticipacion > 168) {
        nuevosErrores.tiempoMinimo = 'Las horas mínimas no pueden ser mayores a 168 (7 días)';
      }
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarConfiguraciones = async () => {
    if (!validarConfiguraciones()) {
      return;
    }

    setGuardando(true);
    try {
      await Promise.all([
        actualizarConfiguracionBufferTime(entrenadorId, {
          activo: bufferActivo,
          minutosBuffer: minutosBuffer,
        }),
        actualizarConfiguracionTiempoMinimoAnticipacion(entrenadorId, {
          activo: tiempoMinimoActivo,
          horasMinimasAnticipacion: horasMinimasAnticipacion,
        })
      ]);
      
      await cargarConfiguraciones();
      setMensajeExito('Configuraciones guardadas correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
      setErrores({ general: 'Error al guardar las configuraciones. Por favor, intenta de nuevo.' });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando configuraciones...</p>
      </Card>
    );
  }

  const haCambiado = 
    configBufferTime?.activo !== bufferActivo ||
    configBufferTime?.minutosBuffer !== minutosBuffer ||
    configTiempoMinimo?.activo !== tiempoMinimoActivo ||
    configTiempoMinimo?.horasMinimasAnticipacion !== horasMinimasAnticipacion;

  return (
    <div className="space-y-6">
      {/* Configuración de Buffer Time */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tiempo de Buffer entre Sesiones</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configura un tiempo automático de buffer entre sesiones para tener tiempo de descanso, limpieza o desplazamiento entre clientes
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
                id="bufferActivo"
                checked={bufferActivo}
                onChange={(e) => setBufferActivo(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="bufferActivo" className="text-base font-medium text-gray-900 cursor-pointer">
                Activar tiempo de buffer entre sesiones
              </label>
            </div>

            {bufferActivo && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutos de buffer entre sesiones
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="240"
                    value={minutosBuffer}
                    onChange={(e) => setMinutosBuffer(parseInt(e.target.value) || 0)}
                    className="w-32"
                    placeholder="15"
                  />
                  <span className="text-sm text-gray-600">minutos</span>
                </div>
                {errores.bufferTime && (
                  <p className="mt-2 text-sm text-red-600">{errores.bufferTime}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Ejemplo: Si configuras 15 minutos y tienes una sesión de 10:00 a 11:00, 
                  la próxima sesión disponible será a partir de las 11:15
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Cómo funciona el buffer time?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El sistema automáticamente reserva tiempo entre sesiones</li>
                    <li>Este tiempo no estará disponible para nuevas reservas</li>
                    <li>Te permite tener tiempo para descansar, limpiar el espacio o desplazarte entre clientes</li>
                    <li>El buffer se aplica automáticamente después de cada sesión confirmada</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuración de Tiempo Mínimo de Anticipación */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tiempo Mínimo de Anticipación para Reservas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configura un tiempo mínimo de anticipación para nuevas reservas para evitar reservas de último momento cuando no puedas prepararte adecuadamente
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="tiempoMinimoActivo"
                checked={tiempoMinimoActivo}
                onChange={(e) => setTiempoMinimoActivo(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="tiempoMinimoActivo" className="text-base font-medium text-gray-900 cursor-pointer">
                Activar tiempo mínimo de anticipación
              </label>
            </div>

            {tiempoMinimoActivo && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas mínimas de anticipación requeridas
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="168"
                    value={horasMinimasAnticipacion}
                    onChange={(e) => setHorasMinimasAnticipacion(parseInt(e.target.value) || 0)}
                    className="w-32"
                    placeholder="24"
                  />
                  <span className="text-sm text-gray-600">horas</span>
                </div>
                {errores.tiempoMinimo && (
                  <p className="mt-2 text-sm text-red-600">{errores.tiempoMinimo}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Ejemplo: Si configuras 24 horas y son las 10:00 AM del lunes, 
                  los clientes solo podrán reservar para el martes a partir de las 10:00 AM
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Cómo funciona el tiempo mínimo de anticipación?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Los clientes no podrán realizar reservas con menos tiempo de anticipación del configurado</li>
                    <li>Te permite tener tiempo suficiente para prepararte para cada sesión</li>
                    <li>Evita reservas de último momento que puedan interrumpir tu planificación</li>
                    <li>Se aplica tanto a reservas nuevas como a reprogramaciones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {haCambiado && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={guardarConfiguraciones}
            disabled={guardando}
            loading={guardando}
            iconLeft={Save}
          >
            Guardar Configuraciones
          </Button>
        </div>
      )}
    </div>
  );
};


