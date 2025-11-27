/**
 * GestorCobros - Componente para gestión operativa de cobros
 * 
 * Este componente muestra los cobros de una factura y permite registrar
 * pagos completos o parciales. Actualiza la factura en tiempo real tras
 * cada operación.
 * 
 * INTEGRACIÓN CON FacturacionManager:
 * - Se puede usar como modal independiente o como sección dentro de FacturacionManager
 * - Recibe una factura como prop y gestiona todos sus cobros
 * - Emite eventos cuando se registran/eliminan cobros para actualizar el estado padre
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Select, Badge, Table } from '../../../components/componentsreutilizables';
import { Factura, Cobro, MetodoPago } from '../types';
import { cobrosAPI } from '../api/cobros';
import { getFacturaById } from '../api/facturas';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle,
  CreditCard,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';

interface GestorCobrosProps {
  factura: Factura;
  isOpen: boolean;
  onClose: () => void;
  onCobroRegistrado?: (facturaActualizada: Factura) => void;
}

interface FormularioPago {
  importe: string;
  metodoPago: MetodoPago;
  fechaCobro: string;
  referenciaExterna?: string;
  observaciones?: string;
}

export const GestorCobros: React.FC<GestorCobrosProps> = ({
  factura,
  isOpen,
  onClose,
  onCobroRegistrado
}) => {
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [facturaActualizada, setFacturaActualizada] = useState<Factura>(factura);
  const [loading, setLoading] = useState(false);
  const [cargandoCobros, setCargandoCobros] = useState(false);
  const [formulario, setFormulario] = useState<FormularioPago>({
    importe: '',
    metodoPago: 'efectivo',
    fechaCobro: new Date().toISOString().split('T')[0],
    referenciaExterna: '',
    observaciones: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cargar cobros cuando se abre el modal
  useEffect(() => {
    if (isOpen && factura) {
      cargarCobros();
      setFacturaActualizada(factura);
    }
  }, [isOpen, factura]);

  const cargarCobros = async () => {
    if (!factura) return;
    
    setCargandoCobros(true);
    try {
      const cobrosData = await cobrosAPI.getCobrosPorFactura(factura.id);
      setCobros(cobrosData);
      
      // Actualizar factura para obtener el estado más reciente
      const facturaActual = await getFacturaById(factura.id);
      if (facturaActual) {
        setFacturaActualizada(facturaActual);
      }
    } catch (error) {
      console.error('Error al cargar cobros:', error);
    } finally {
      setCargandoCobros(false);
    }
  };

  const handleRegistrarPago = async () => {
    const importeNumero = parseFloat(formulario.importe);
    
    if (isNaN(importeNumero) || importeNumero <= 0) {
      alert('El importe debe ser mayor a 0');
      return;
    }

    if (importeNumero > facturaActualizada.saldoPendiente) {
      alert(`El importe no puede ser mayor al saldo pendiente (${formatearMoneda(facturaActualizada.saldoPendiente)})`);
      return;
    }

    setLoading(true);
    try {
      const resultado = await cobrosAPI.registrarCobro(factura.id, {
        fechaCobro: new Date(formulario.fechaCobro),
        importe: importeNumero,
        metodoPago: formulario.metodoPago,
        referenciaExternaOpcional: formulario.referenciaExterna || undefined,
        observacionesOpcional: formulario.observaciones || undefined,
        esCobroRecurrente: false
      });

      // Actualizar estado local
      setFacturaActualizada(resultado.facturaActualizada);
      await cargarCobros();

      // Resetear formulario
      setFormulario({
        importe: '',
        metodoPago: 'efectivo',
        fechaCobro: new Date().toISOString().split('T')[0],
        referenciaExterna: '',
        observaciones: ''
      });
      setMostrarFormulario(false);

      // Notificar al componente padre
      if (onCobroRegistrado) {
        onCobroRegistrado(resultado.facturaActualizada);
      }

      // Si la factura está completamente pagada, cerrar después de un momento
      if (resultado.facturaActualizada.saldoPendiente <= 0) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al registrar cobro:', error);
      alert(error instanceof Error ? error.message : 'Error al registrar el cobro');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCobro = async (cobroId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este cobro? Esta acción no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    try {
      const facturaActualizada = await cobrosAPI.eliminarCobro(cobroId);
      setFacturaActualizada(facturaActualizada);
      await cargarCobros();

      // Notificar al componente padre
      if (onCobroRegistrado) {
        onCobroRegistrado(facturaActualizada);
      }
    } catch (error) {
      console.error('Error al eliminar cobro:', error);
      alert('Error al eliminar el cobro');
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: facturaActualizada.moneda || 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerNombreMetodoPago = (metodo: MetodoPago): string => {
    const nombres: Record<MetodoPago, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      paypal: 'PayPal',
      stripe: 'Stripe',
      otro: 'Otro'
    };
    return nombres[metodo] || metodo;
  };

  const obtenerBadgeEstado = () => {
    const estado = facturaActualizada.estado;
    const config: Record<string, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }> = {
      pendiente: { label: 'Pendiente', variant: 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      parcialmentePagada: { label: 'Parcialmente Pagada', variant: 'yellow' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' }
    };
    return config[estado] || { label: estado, variant: 'blue' as const };
  };

  const totalCobrado = cobros.reduce((sum, cobro) => sum + cobro.importe, 0);
  const estadoConfig = obtenerBadgeEstado();

  const metodosPago: { value: string; label: string }[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestión de Cobros - ${factura.numero}`}
      size="lg"
      footer={
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {!mostrarFormulario && facturaActualizada.saldoPendiente > 0 && (
            <Button
              variant="primary"
              onClick={() => {
                setFormulario({
                  ...formulario,
                  importe: facturaActualizada.saldoPendiente.toString()
                });
                setMostrarFormulario(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Resumen de la factura */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Cliente</div>
              <div className="font-semibold text-gray-900">{facturaActualizada.nombreCliente}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Factura</div>
              <div className="font-semibold text-gray-900">{formatearMoneda(facturaActualizada.total)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Saldo Pendiente</div>
              <div className={`font-semibold ${facturaActualizada.saldoPendiente > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {formatearMoneda(facturaActualizada.saldoPendiente)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Estado</div>
              <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
            </div>
          </div>
          
          {/* Barra de progreso de pago */}
          {facturaActualizada.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Total cobrado: {formatearMoneda(totalCobrado)}</span>
                <span>{Math.round((totalCobrado / facturaActualizada.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    facturaActualizada.saldoPendiente <= 0 
                      ? 'bg-green-500' 
                      : totalCobrado > 0 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalCobrado / facturaActualizada.total) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Formulario de registro de pago */}
        {mostrarFormulario && facturaActualizada.saldoPendiente > 0 && (
          <Card className="p-4 border-2 border-blue-200 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Pago</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarFormulario(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Importe *"
                type="number"
                min="0"
                step="0.01"
                max={facturaActualizada.saldoPendiente}
                value={formulario.importe}
                onChange={(e) => setFormulario({ ...formulario, importe: e.target.value })}
                placeholder={`Máx: ${formatearMoneda(facturaActualizada.saldoPendiente)}`}
                required
              />
              <Select
                label="Método de Pago *"
                options={metodosPago}
                value={formulario.metodoPago}
                onChange={(e) => setFormulario({ ...formulario, metodoPago: e.target.value as MetodoPago })}
              />
              <Input
                label="Fecha de Cobro *"
                type="date"
                value={formulario.fechaCobro}
                onChange={(e) => setFormulario({ ...formulario, fechaCobro: e.target.value })}
                required
              />
              <Input
                label="Referencia Externa"
                value={formulario.referenciaExterna || ''}
                onChange={(e) => setFormulario({ ...formulario, referenciaExterna: e.target.value })}
                placeholder="Ej: TXN-123456, Cheque #123"
              />
              <div className="md:col-span-2">
                <Input
                  label="Observaciones"
                  value={formulario.observaciones || ''}
                  onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
                  placeholder="Notas adicionales sobre el pago"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="primary"
                onClick={handleRegistrarPago}
                loading={loading}
                disabled={!formulario.importe || parseFloat(formulario.importe) <= 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Registrar Pago
              </Button>
              <Button
                variant="secondary"
                onClick={() => setMostrarFormulario(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Lista de cobros registrados */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Historial de Pagos ({cobros.length})
            </h3>
            {!mostrarFormulario && facturaActualizada.saldoPendiente > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFormulario({
                    ...formulario,
                    importe: facturaActualizada.saldoPendiente.toString()
                  });
                  setMostrarFormulario(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Pago
              </Button>
            )}
          </div>

          {cargandoCobros ? (
            <div className="text-center py-8 text-gray-500">Cargando cobros...</div>
          ) : cobros.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No hay pagos registrados</p>
              <p className="text-sm text-gray-500">
                Registra el primer pago usando el botón "Registrar Pago"
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {cobros.map((cobro) => (
                <Card
                  key={cobro.id}
                  className="p-4 border-l-4 border-l-green-500 bg-green-50/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900 text-lg">
                          {formatearMoneda(cobro.importe)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          <span>{obtenerNombreMetodoPago(cobro.metodoPago)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatearFecha(cobro.fechaCobro)}</span>
                        </div>
                        {cobro.referenciaExternaOpcional && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{cobro.referenciaExternaOpcional}</span>
                          </div>
                        )}
                        {cobro.esCobroRecurrente && (
                          <Badge variant="blue" size="sm">Recurrente</Badge>
                        )}
                      </div>
                      {cobro.observacionesOpcional && (
                        <div className="mt-2 text-sm text-gray-700 italic">
                          {cobro.observacionesOpcional}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarCobro(cobro.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Mensaje de factura pagada completamente */}
        {facturaActualizada.saldoPendiente <= 0 && (
          <Card className="p-4 bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">Factura completamente pagada</div>
                <div className="text-sm text-green-700">
                  Todos los pagos han sido registrados correctamente
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

