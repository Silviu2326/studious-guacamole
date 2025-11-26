import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input } from '../../../components/componentsreutilizables';
import { 
  Video, 
  Save, 
  CheckCircle, 
  Info,
  ExternalLink,
  Settings
} from 'lucide-react';
import { 
  getConfiguracionVideollamada, 
  guardarConfiguracionVideollamada,
  PlataformaVideollamada,
  ConfiguracionVideollamada as ConfiguracionVideollamadaType
} from '../api/enlacesVideollamada';

interface ConfiguracionVideollamadaProps {
  entrenadorId: string;
}

export const ConfiguracionVideollamada: React.FC<ConfiguracionVideollamadaProps> = ({ 
  entrenadorId 
}) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionVideollamadaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [plataforma, setPlataforma] = useState<PlataformaVideollamada>('google-meet');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [enlacePersonalizado, setEnlacePersonalizado] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    cargarConfiguracion();
  }, [entrenadorId]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await getConfiguracionVideollamada(entrenadorId);
      setConfiguracion(config);
      setPlataforma(config.plataforma);
      setApiKey(config.apiKey || '');
      setApiSecret(config.apiSecret || '');
      setEnlacePersonalizado(config.configuracionAdicional?.enlacePersonalizado || '');
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    try {
      const configActualizada: ConfiguracionVideollamadaType = {
        plataforma,
        apiKey: plataforma !== 'jitsi' && plataforma !== 'custom' ? apiKey : undefined,
        apiSecret: plataforma !== 'jitsi' && plataforma !== 'custom' ? apiSecret : undefined,
        configuracionAdicional: {
          enlacePersonalizado: plataforma === 'custom' ? enlacePersonalizado : undefined,
        },
      };

      await guardarConfiguracionVideollamada(entrenadorId, configActualizada);
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

  const haCambiado = 
    configuracion?.plataforma !== plataforma ||
    configuracion?.apiKey !== apiKey ||
    configuracion?.apiSecret !== apiSecret ||
    configuracion?.configuracionAdicional?.enlacePersonalizado !== enlacePersonalizado;

  const plataformas = [
    { value: 'google-meet', label: 'Google Meet', descripcion: 'Integración con Google Calendar y Meet' },
    { value: 'zoom', label: 'Zoom', descripcion: 'Requiere API Key y API Secret de Zoom' },
    { value: 'teams', label: 'Microsoft Teams', descripcion: 'Integración con Microsoft Teams' },
    { value: 'jitsi', label: 'Jitsi Meet', descripcion: 'Sin configuración adicional requerida' },
    { value: 'custom', label: 'Enlace Personalizado', descripcion: 'Usa tu propia URL de videollamada' },
  ];

  const obtenerDescripcionPlataforma = (plataforma: PlataformaVideollamada): string => {
    const plat = plataformas.find(p => p.value === plataforma);
    return plat?.descripcion || '';
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Configuración de Videollamada</h3>
            <p className="text-sm text-gray-600 mt-1">
              Configura tu plataforma preferida para generar enlaces de videollamada automáticamente en las reservas
            </p>
          </div>
        </div>

        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{mensajeExito}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Select
              label="Plataforma de Videollamada"
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value as PlataformaVideollamada)}
              options={plataformas.map(p => ({
                value: p.value,
                label: `${p.label} - ${p.descripcion}`
              }))}
            />
            <p className="mt-2 text-sm text-gray-600">
              {obtenerDescripcionPlataforma(plataforma)}
            </p>
          </div>

          {(plataforma === 'zoom' || plataforma === 'teams') && (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">
                    {plataforma === 'zoom' ? 'Configuración de Zoom' : 'Configuración de Microsoft Teams'}
                  </p>
                  <p>
                    Para usar {plataforma === 'zoom' ? 'Zoom' : 'Microsoft Teams'}, necesitas configurar tus credenciales de API.
                    Los enlaces se generarán automáticamente cuando crees reservas de tipo videollamada.
                  </p>
                </div>
              </div>

              <Input
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Ingresa tu ${plataforma === 'zoom' ? 'Zoom' : 'Teams'} API Key`}
                leftIcon={<Settings className="w-5 h-5" />}
              />

              <Input
                label="API Secret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder={`Ingresa tu ${plataforma === 'zoom' ? 'Zoom' : 'Teams'} API Secret`}
                leftIcon={<Settings className="w-5 h-5" />}
              />

              <div className="p-3 bg-white rounded border border-blue-300">
                <p className="text-xs text-blue-700">
                  <strong>Nota:</strong> Estas credenciales se almacenan de forma segura y solo se usan para generar enlaces de reunión.
                  {plataforma === 'zoom' && ' Puedes obtenerlas desde el portal de desarrolladores de Zoom.'}
                  {plataforma === 'teams' && ' Puedes obtenerlas desde Azure Portal.'}
                </p>
              </div>
            </div>
          )}

          {plataforma === 'custom' && (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Enlace Personalizado</p>
                  <p>
                    Configura una plantilla de URL personalizada. Puedes usar variables como {'{'}RESERVA_ID{'}'} o {'{'}FECHA{'}'} 
                    que se reemplazarán automáticamente.
                  </p>
                </div>
              </div>

              <Input
                label="URL de Videollamada (Plantilla)"
                value={enlacePersonalizado}
                onChange={(e) => setEnlacePersonalizado(e.target.value)}
                placeholder="https://tu-plataforma.com/reunion/{RESERVA_ID}"
                leftIcon={<ExternalLink className="w-5 h-5" />}
              />

              <div className="p-3 bg-white rounded border border-blue-300">
                <p className="text-xs text-blue-700">
                  <strong>Variables disponibles:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>{'{RESERVA_ID}'} - ID de la reserva</li>
                    <li>{'{FECHA}'} - Fecha de la sesión (YYYY-MM-DD)</li>
                    <li>{'{CLIENTE_NOMBRE}'} - Nombre del cliente</li>
                  </ul>
                </p>
              </div>
            </div>
          )}

          {(plataforma === 'google-meet' || plataforma === 'jitsi') && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">
                    {plataforma === 'google-meet' ? 'Google Meet' : 'Jitsi Meet'} - Listo para usar
                  </p>
                  <p>
                    {plataforma === 'google-meet' 
                      ? 'No se requiere configuración adicional. Los enlaces de Google Meet se generarán automáticamente cuando crees reservas de tipo videollamada.'
                      : 'Jitsi Meet no requiere configuración adicional. Los enlaces se generarán automáticamente basados en el ID de la reserva.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Cómo funciona?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cuando crees una reserva de tipo "Videollamada", se generará automáticamente un enlace usando la plataforma seleccionada</li>
                  <li>El enlace se incluirá en la reserva y se enviará automáticamente en los recordatorios</li>
                  <li>Los clientes recibirán el enlace directamente en sus notificaciones</li>
                  <li>Puedes cambiar la plataforma en cualquier momento</li>
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
              iconLeft={<Save className="w-5 h-5" />}
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

