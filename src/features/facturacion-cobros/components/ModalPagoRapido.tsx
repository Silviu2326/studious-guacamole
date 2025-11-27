import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { Factura, MetodoPago } from '../types';
import { registrarCobro } from '../api/cobros';
import { Zap } from 'lucide-react';

interface ModalPagoRapidoProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura;
  onPagoRegistrado: () => void;
}

/**
 * Modal para registro rápido de pagos sobre facturas
 * 
 * Este componente permite registrar pagos de forma rápida sin necesidad
 * de acceder al detalle completo de la factura. Se utiliza desde FacturacionManager
 * como acción rápida en el listado de facturas.
 */
export const ModalPagoRapido: React.FC<ModalPagoRapidoProps> = ({
  isOpen,
  onClose,
  factura,
  onPagoRegistrado
}) => {
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && factura) {
      setMonto(factura.saldoPendiente.toString());
      setMetodoPago('efectivo');
    }
  }, [isOpen, factura]);

  const metodosPago: SelectOption[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'otro', label: 'Otro' }
  ];

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: factura.moneda || 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const handleConfirmar = async () => {
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (montoNumero > factura.saldoPendiente) {
      alert('El monto no puede ser mayor al saldo pendiente');
      return;
    }

    setLoading(true);
    try {
      // Registrar el cobro usando la API
      await registrarCobro(factura.id, {
        fechaCobro: new Date(),
        importe: montoNumero,
        metodoPago,
        referenciaExternaOpcional: `Pago rápido - ${new Date().toLocaleDateString()}`,
        observacionesOpcional: 'Pago rápido registrado desde FacturacionManager',
        esCobroRecurrente: false
      });

      onPagoRegistrado();
      onClose();
    } catch (error) {
      console.error('Error al registrar pago rápido:', error);
      alert('Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!factura) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Pago Rápido"
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmar} 
            loading={loading}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Confirmar Pago
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Información rápida de la factura */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-900">
            <div className="font-medium mb-1">{factura.nombreCliente}</div>
            <div className="text-xs text-blue-700">Factura: {factura.numero}</div>
          </div>
        </div>

        {/* Monto */}
        <div>
          <Input
            label="Monto *"
            type="number"
            min="0"
            step="0.01"
            max={factura.saldoPendiente}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            autoFocus
          />
          <div className="text-xs text-gray-500 mt-1">
            Pendiente: {formatearMoneda(factura.saldoPendiente)}
          </div>
        </div>

        {/* Método de pago */}
        <Select
          label="Método de Pago *"
          options={metodosPago}
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
        />
      </div>
    </Modal>
  );
};

