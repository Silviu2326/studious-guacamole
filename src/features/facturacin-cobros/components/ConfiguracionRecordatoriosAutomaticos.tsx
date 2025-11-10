import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { ConfiguracionRecordatoriosAutomaticos } from '../types';
import { recordatoriosAutomaticosAPI } from '../api/recordatoriosAutomaticos';
import { Bell, Mail, MessageCircle, Save, Settings } from 'lucide-react';

interface ConfiguracionRecordatoriosAutomaticosProps {
  onConfiguracionGuardada?: () => void;
}

export const ConfiguracionRecordatoriosAutomaticos: React.FC<ConfiguracionRecordatoriosAutomaticosProps> = ({
  onConfiguracionGuardada
}) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatoriosAutomaticos | null>(null);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await recordatoriosAutomaticosAPI.obtenerConfiguracion();
      setConfiguracion(config);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarActivo = (activo: boolean) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      activo
    });
  };

  const handleCambiarRecordatorio = (
    tipo: 'recordatorio3DiasAntes' | 'recordatorioDiaVencimiento' | 'recordatorio3DiasDespues',
    valor: boolean
  ) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      [tipo]: valor
    });
  };

  const handleCambiarMedioEnvio = (medio: 'email' | 'whatsapp', incluir: boolean) => {
    if (!configuracion) return;
    const mediosEnvio = [...configuracion.mediosEnvio];
    
    if (incluir) {
      if (!mediosEnvio.includes(medio)) {
        mediosEnvio.push(medio);
      }
    } else {
      const index = mediosEnvio.indexOf(medio);
      if (index > -1) {
        mediosEnvio.splice(index, 1);
      }
    }
    
    // Asegurar que al menos un medio esté seleccionado
    if (mediosEnvio.length === 0) {
      mediosEnvio.push('email');
    }
    
    setConfiguracion({
      ...configuracion,
      mediosEnvio
    });
  };

  const handleGuardar = async () => {
    if (!configuracion) return;
    
    setGuardando(true);
    try {
      await recordatoriosAutomaticosAPI.guardarConfiguracion({
        activo: configuracion.activo,
        recordatorio3DiasAntes: configuracion.recordatorio3DiasAntes,
        recordatorioDiaVencimiento: configuracion.recordatorioDiaVencimiento,
        recordatorio3DiasDespues: configuracion.recordatorio3DiasDespues,
        mediosEnvio: configuracion.mediosEnvio
      });
      
      setMostrarConfirmacion(true);
      if (onConfiguracionGuardada) {
        onConfiguracionGuardada();
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando configuración...</div>
        </div>
      </Card>
    );
  }

  if (!configuracion) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          No se pudo cargar la configuración
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configuración de Recordatorios Automáticos
            </h3>
            <p className="text-sm text-gray-600">
              Configura los recordatorios automáticos que se enviarán antes y después del vencimiento de las facturas
            </p>
          </div>
        </div>

        {/* Activar/Desactivar recordatorios automáticos */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Activar Recordatorios Automáticos
                </label>
                <p className="text-xs text-gray-600">
                  Los recordatorios se enviarán automáticamente según la configuración establecida
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={configuracion.activo}
                onChange={(e) => handleCambiarActivo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Configuración de recordatorios */}
        {configuracion.activo && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Cuándo Enviar Recordatorios
              </h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={configuracion.recordatorio3DiasAntes}
                      onChange={(e) => handleCambiarRecordatorio('recordatorio3DiasAntes', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        3 Días Antes del Vencimiento
                      </span>
                      <p className="text-xs text-gray-600">
                        Recordatorio preventivo antes de que venza la factura
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={configuracion.recordatorioDiaVencimiento}
                      onChange={(e) => handleCambiarRecordatorio('recordatorioDiaVencimiento', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Día de Vencimiento
                      </span>
                      <p className="text-xs text-gray-600">
                        Recordatorio el mismo día que vence la factura
                      </p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={configuracion.recordatorio3DiasDespues}
                      onChange={(e) => handleCambiarRecordatorio('recordatorio3DiasDespues', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        3 Días Después del Vencimiento
                      </span>
                      <p className="text-xs text-gray-600">
                        Recordatorio de seguimiento para facturas vencidas
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Medios de envío */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Medios de Envío
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    configuracion.mediosEnvio.includes('email')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCambiarMedioEnvio('email', !configuracion.mediosEnvio.includes('email'))}
                >
                  <div className="flex items-center gap-3">
                    <Mail className={`w-5 h-5 ${
                      configuracion.mediosEnvio.includes('email') ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Email
                      </label>
                      <p className="text-xs text-gray-600">
                        Enviar recordatorios por correo electrónico
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    configuracion.mediosEnvio.includes('whatsapp')
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCambiarMedioEnvio('whatsapp', !configuracion.mediosEnvio.includes('whatsapp'))}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className={`w-5 h-5 ${
                      configuracion.mediosEnvio.includes('whatsapp') ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        WhatsApp
                      </label>
                      <p className="text-xs text-gray-600">
                        Enviar recordatorios por WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Los recordatorios automáticos se enviarán solo para facturas con estado "pendiente" o "vencida". 
                Una vez que una factura sea pagada, no se enviarán más recordatorios automáticos.
              </p>
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={guardando}
            disabled={!configuracion.activo && (
              !configuracion.recordatorio3DiasAntes &&
              !configuracion.recordatorioDiaVencimiento &&
              !configuracion.recordatorio3DiasDespues
            )}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </Card>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <Modal
          isOpen={true}
          onClose={() => setMostrarConfirmacion(false)}
          title="Configuración Guardada"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              La configuración de recordatorios automáticos ha sido guardada exitosamente.
            </p>
            {configuracion.activo && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Los recordatorios automáticos están activos y se enviarán según la configuración establecida.
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setMostrarConfirmacion(false)}
              >
                Aceptar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

