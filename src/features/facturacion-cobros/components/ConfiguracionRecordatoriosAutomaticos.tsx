import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Checkbox } from '../../../components/componentsreutilizables';
import { RecordatorioPagoConfig, CanalNotificacion } from '../types';
import { recordatoriosAutomaticosAPI } from '../api/recordatoriosAutomaticos';
import { Settings, Save, Mail, MessageCircle, Phone, Bell, Info, CheckCircle2 } from 'lucide-react';

interface ConfiguracionRecordatoriosAutomaticosProps {
  onConfiguracionGuardada?: () => void;
  onError?: (errorMessage: string) => void;
}

export const ConfiguracionRecordatoriosAutomaticos: React.FC<ConfiguracionRecordatoriosAutomaticosProps> = ({
  onConfiguracionGuardada,
  onError
}) => {
  const [configuracion, setConfiguracion] = useState<RecordatorioPagoConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await recordatoriosAutomaticosAPI.getConfiguracionRecordatoriosAuto();
      setConfiguracion(config);
      setErrores({});
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo cargar la configuración';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const validarConfiguracion = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!configuracion) {
      return false;
    }

    if (configuracion.diasAntesVencimiento < 0) {
      nuevosErrores.diasAntesVencimiento = 'Los días antes del vencimiento deben ser mayor o igual a 0';
    }

    if (configuracion.diasDespuesVencimiento < 0) {
      nuevosErrores.diasDespuesVencimiento = 'Los días después del vencimiento deben ser mayor o igual a 0';
    }

    if (configuracion.frecuenciaDias <= 0) {
      nuevosErrores.frecuenciaDias = 'La frecuencia en días debe ser mayor a 0';
    }

    if (!configuracion.canales || configuracion.canales.length === 0) {
      nuevosErrores.canales = 'Debe seleccionar al menos un canal de comunicación';
    }

    // Validar que al menos una de las configuraciones tenga sentido
    if (configuracion.diasAntesVencimiento === 0 && configuracion.diasDespuesVencimiento === 0) {
      nuevosErrores.general = 'Debe configurar al menos días antes o después del vencimiento';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!configuracion) return;

    if (!validarConfiguracion()) {
      return;
    }

    setGuardando(true);
    try {
      await recordatoriosAutomaticosAPI.guardarConfiguracionRecordatoriosAuto(configuracion);
      setMostrarConfirmacion(true);
      if (onConfiguracionGuardada) {
        onConfiguracionGuardada();
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la configuración';
      if (onError) {
        onError(errorMessage);
      }
      alert(errorMessage);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarDiasAntes = (valor: string) => {
    const numValor = parseInt(valor, 10);
    if (!isNaN(numValor) && numValor >= 0 && configuracion) {
      setConfiguracion({ ...configuracion, diasAntesVencimiento: numValor });
      if (errores.diasAntesVencimiento) {
        const nuevosErrores = { ...errores };
        delete nuevosErrores.diasAntesVencimiento;
        setErrores(nuevosErrores);
      }
    }
  };

  const handleCambiarDiasDespues = (valor: string) => {
    const numValor = parseInt(valor, 10);
    if (!isNaN(numValor) && numValor >= 0 && configuracion) {
      setConfiguracion({ ...configuracion, diasDespuesVencimiento: numValor });
      if (errores.diasDespuesVencimiento) {
        const nuevosErrores = { ...errores };
        delete nuevosErrores.diasDespuesVencimiento;
        setErrores(nuevosErrores);
      }
    }
  };

  const handleCambiarFrecuencia = (valor: string) => {
    const numValor = parseInt(valor, 10);
    if (!isNaN(numValor) && numValor > 0 && configuracion) {
      setConfiguracion({ ...configuracion, frecuenciaDias: numValor });
      if (errores.frecuenciaDias) {
        const nuevosErrores = { ...errores };
        delete nuevosErrores.frecuenciaDias;
        setErrores(nuevosErrores);
      }
    }
  };

  const handleCambiarCanal = (canal: CanalNotificacion, incluir: boolean) => {
    if (!configuracion) return;

    const nuevosCanales = [...configuracion.canales];
    
    if (incluir) {
      if (!nuevosCanales.includes(canal)) {
        nuevosCanales.push(canal);
      }
    } else {
      const index = nuevosCanales.indexOf(canal);
      if (index > -1) {
        nuevosCanales.splice(index, 1);
      }
    }
    
    // Asegurar que al menos un canal esté seleccionado
    if (nuevosCanales.length === 0) {
      nuevosCanales.push('email');
    }
    
    setConfiguracion({ ...configuracion, canales: nuevosCanales });
    if (errores.canales) {
      const nuevosErrores = { ...errores };
      delete nuevosErrores.canales;
      setErrores(nuevosErrores);
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
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configuración de Recordatorios Automáticos
            </h3>
            <p className="text-sm text-gray-600">
              Define cuándo y cómo se enviarán los recordatorios automáticos de pago
            </p>
          </div>
        </div>

        {/* Mensaje de error general */}
        {errores.general && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{errores.general}</p>
          </Card>
        )}

        {/* Días antes del vencimiento */}
        <div className="mb-6">
          <Input
            label="Días Antes del Vencimiento"
            type="number"
            min="0"
            value={configuracion.diasAntesVencimiento.toString()}
            onChange={(e) => handleCambiarDiasAntes(e.target.value)}
            error={errores.diasAntesVencimiento}
            helperText="Número de días antes del vencimiento para enviar el recordatorio (0 = no enviar)"
          />
        </div>

        {/* Días después del vencimiento */}
        <div className="mb-6">
          <Input
            label="Días Después del Vencimiento"
            type="number"
            min="0"
            value={configuracion.diasDespuesVencimiento.toString()}
            onChange={(e) => handleCambiarDiasDespues(e.target.value)}
            error={errores.diasDespuesVencimiento}
            helperText="Número de días después del vencimiento para enviar el recordatorio (0 = no enviar)"
          />
        </div>

        {/* Frecuencia de reenvío */}
        <div className="mb-6">
          <Input
            label="Frecuencia de Reenvío (días)"
            type="number"
            min="1"
            value={configuracion.frecuenciaDias.toString()}
            onChange={(e) => handleCambiarFrecuencia(e.target.value)}
            error={errores.frecuenciaDias}
            helperText="Cada cuántos días se reenviará el recordatorio si la factura sigue sin pagar"
          />
        </div>

        {/* Canales de comunicación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Canales de Comunicación *
          </label>
          {errores.canales && (
            <p className="text-sm text-red-600 mb-2">{errores.canales}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                configuracion.canales.includes('email')
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCambiarCanal('email', !configuracion.canales.includes('email'))}
            >
              <div className="flex items-center gap-3">
                <Mail className={`w-5 h-5 ${
                  configuracion.canales.includes('email') ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <label className="text-sm font-medium text-gray-900 cursor-pointer">
                    Email
                  </label>
                  <p className="text-xs text-gray-600">
                    Correo electrónico
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                configuracion.canales.includes('whatsapp')
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCambiarCanal('whatsapp', !configuracion.canales.includes('whatsapp'))}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className={`w-5 h-5 ${
                  configuracion.canales.includes('whatsapp') ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div>
                  <label className="text-sm font-medium text-gray-900 cursor-pointer">
                    WhatsApp
                  </label>
                  <p className="text-xs text-gray-600">
                    Mensaje de WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* SMS */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                configuracion.canales.includes('sms')
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCambiarCanal('sms', !configuracion.canales.includes('sms'))}
            >
              <div className="flex items-center gap-3">
                <Phone className={`w-5 h-5 ${
                  configuracion.canales.includes('sms') ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div>
                  <label className="text-sm font-medium text-gray-900 cursor-pointer">
                    SMS
                  </label>
                  <p className="text-xs text-gray-600">
                    Mensaje de texto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de reglas activas */}
        <Card className="p-4 mb-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Reglas Activas
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {configuracion.diasAntesVencimiento > 0 && (
                  <li>
                    • Recordatorio {configuracion.diasAntesVencimiento} día{configuracion.diasAntesVencimiento !== 1 ? 's' : ''} antes del vencimiento
                  </li>
                )}
                {configuracion.diasDespuesVencimiento > 0 && (
                  <li>
                    • Recordatorio {configuracion.diasDespuesVencimiento} día{configuracion.diasDespuesVencimiento !== 1 ? 's' : ''} después del vencimiento
                  </li>
                )}
                <li>
                  • Reenvío cada {configuracion.frecuenciaDias} día{configuracion.frecuenciaDias !== 1 ? 's' : ''} si la factura sigue sin pagar
                </li>
                <li>
                  • Canales habilitados: {configuracion.canales.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <Card className="p-4 mb-6 bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> Los recordatorios automáticos se enviarán solo para facturas con estado 
            "pendiente", "vencida" o "parcialmente pagada". Una vez que una factura sea completamente pagada, 
            no se enviarán más recordatorios automáticos.
          </p>
        </Card>

        {/* Botón de guardar */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={guardando}
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
          footer={
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setMostrarConfirmacion(false)}
              >
                Aceptar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <p className="text-gray-700">
                La configuración de recordatorios automáticos ha sido guardada exitosamente.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Resumen de la configuración:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {configuracion.diasAntesVencimiento > 0 && (
                  <li>• Recordatorio {configuracion.diasAntesVencimiento} día(s) antes del vencimiento</li>
                )}
                {configuracion.diasDespuesVencimiento > 0 && (
                  <li>• Recordatorio {configuracion.diasDespuesVencimiento} día(s) después del vencimiento</li>
                )}
                <li>• Reenvío cada {configuracion.frecuenciaDias} día(s)</li>
                <li>• Canales: {configuracion.canales.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

