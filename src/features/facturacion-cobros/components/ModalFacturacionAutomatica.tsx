/**
 * ModalFacturacionAutomatica - Modal para configurar reglas de facturación automática
 * 
 * Este componente permite configurar reglas básicas simuladas de facturación automática:
 * - Facturación automática por reservas
 * - Facturación automática por paquetes
 * - Facturación automática por suscripciones recurrentes
 * - Configuración de días de vencimiento
 * - Habilitar/deshabilitar facturación automática
 * 
 * NOTA: Por ahora, las reglas son simuladas. En producción, se integrarían con:
 * - Sistema de eventos/triggers para generar facturas automáticamente
 * - Integración con pasarelas de pago para cobros automáticos
 * - Sistema de notificaciones para recordatorios
 */

import React, { useState } from 'react';
import { Modal, Button, Input, Select, SelectOption, Checkbox } from '../../../components/componentsreutilizables';
import { Settings, Zap, Calendar, Package, Repeat } from 'lucide-react';

interface ModalFacturacionAutomaticaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfiguracionGuardada?: (configuracion: ConfiguracionFacturacionAutomatica) => void;
}

export interface ConfiguracionFacturacionAutomatica {
  facturacionPorReservas: boolean;
  facturacionPorPaquetes: boolean;
  facturacionPorSuscripciones: boolean;
  diasVencimiento: number;
  generarFacturaInmediatamente: boolean;
  enviarEmailAutomatico: boolean;
  metodoPagoPorDefecto: string;
}

export const ModalFacturacionAutomatica: React.FC<ModalFacturacionAutomaticaProps> = ({
  isOpen,
  onClose,
  onConfiguracionGuardada
}) => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionFacturacionAutomatica>({
    facturacionPorReservas: false,
    facturacionPorPaquetes: false,
    facturacionPorSuscripciones: true,
    diasVencimiento: 30,
    generarFacturaInmediatamente: true,
    enviarEmailAutomatico: true,
    metodoPagoPorDefecto: 'transferencia'
  });

  const [loading, setLoading] = useState(false);

  const metodosPagoOptions: SelectOption[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleGuardar = async () => {
    setLoading(true);
    try {
      // Simular guardado de configuración
      // En producción, esto haría una llamada a la API para guardar la configuración
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onConfiguracionGuardada) {
        onConfiguracionGuardada(configuracion);
      }
      
      alert('Configuración de facturación automática guardada correctamente');
      onClose();
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Facturación Automática"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={loading}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Guardar Configuración
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            Configure las reglas de facturación automática. Las facturas se generarán automáticamente
            según las reglas activadas cuando se cumplan las condiciones correspondientes.
          </p>
        </div>

        {/* Reglas de Facturación */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Reglas de Facturación Automática
          </h3>

          {/* Facturación por Reservas */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Facturación por Reservas</h4>
                  <p className="text-sm text-gray-600">
                    Generar factura automáticamente cuando se confirme una reserva
                  </p>
                </div>
              </div>
              <Checkbox
                checked={configuracion.facturacionPorReservas}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    facturacionPorReservas: e.target.checked
                  })
                }
              />
            </div>
          </div>

          {/* Facturación por Paquetes */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Facturación por Paquetes</h4>
                  <p className="text-sm text-gray-600">
                    Generar factura automáticamente cuando se compre un paquete de sesiones
                  </p>
                </div>
              </div>
              <Checkbox
                checked={configuracion.facturacionPorPaquetes}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    facturacionPorPaquetes: e.target.checked
                  })
                }
              />
            </div>
          </div>

          {/* Facturación por Suscripciones */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Facturación por Suscripciones</h4>
                  <p className="text-sm text-gray-600">
                    Generar factura automáticamente para suscripciones recurrentes
                  </p>
                </div>
              </div>
              <Checkbox
                checked={configuracion.facturacionPorSuscripciones}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    facturacionPorSuscripciones: e.target.checked
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Configuración General */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>

          {/* Días de Vencimiento */}
          <div>
            <Input
              label="Días de Vencimiento"
              type="number"
              min="1"
              max="365"
              value={configuracion.diasVencimiento.toString()}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  diasVencimiento: parseInt(e.target.value) || 30
                })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Número de días después de la emisión para el vencimiento de la factura
            </p>
          </div>

          {/* Método de Pago por Defecto */}
          <div>
            <Select
              label="Método de Pago por Defecto"
              options={metodosPagoOptions}
              value={configuracion.metodoPagoPorDefecto}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  metodoPagoPorDefecto: e.target.value
                })
              }
            />
          </div>

          {/* Opciones Adicionales */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Generar Factura Inmediatamente</p>
                <p className="text-sm text-gray-600">
                  Crear la factura tan pronto como se cumpla la condición
                </p>
              </div>
              <Checkbox
                checked={configuracion.generarFacturaInmediatamente}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    generarFacturaInmediatamente: e.target.checked
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enviar Email Automático</p>
                <p className="text-sm text-gray-600">
                  Enviar la factura por email automáticamente al cliente
                </p>
              </div>
              <Checkbox
                checked={configuracion.enviarEmailAutomatico}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    enviarEmailAutomatico: e.target.checked
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>Nota:</strong> Esta es una configuración simulada. En producción, estas reglas
            se integrarían con el sistema de eventos y pasarelas de pago para generar y procesar
            facturas automáticamente.
          </p>
        </div>
      </div>
    </Modal>
  );
};

