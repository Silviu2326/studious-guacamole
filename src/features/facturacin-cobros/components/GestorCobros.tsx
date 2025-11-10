import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableColumn, Modal, Input, Select, SelectOption, Badge } from '../../../components/componentsreutilizables';
import { Factura, Cobro, MetodoPago, Pago } from '../types';
import { cobrosAPI } from '../api/cobros';
import { facturasAPI } from '../api/facturas';
import { enviarReciboPorEmail } from '../api/recibosEmail';
import { DollarSign, CheckCircle, XCircle, Mail, Plus, Trash2, CreditCard } from 'lucide-react';

interface GestorCobrosProps {
  facturas: Factura[];
  onRefresh: () => void;
}

interface PagoParcial {
  monto: string;
  metodoPago: MetodoPago;
  referencia: string;
  notas: string;
}

export const GestorCobros: React.FC<GestorCobrosProps> = ({ facturas, onRefresh }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [pagosExistentes, setPagosExistentes] = useState<Pago[]>([]);
  const [pagosParciales, setPagosParciales] = useState<PagoParcial[]>([]);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [referencia, setReferencia] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviandoRecibo, setEnviandoRecibo] = useState(false);
  const [reciboEnviado, setReciboEnviado] = useState(false);
  const [montoPendienteActualizado, setMontoPendienteActualizado] = useState(0);

  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida');

  const metodosPago: SelectOption[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' }
  ];

  const abrirModalCobro = async (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setMontoPendienteActualizado(factura.montoPendiente);
    setMonto('');
    setReferencia('');
    setNotas('');
    setPagosParciales([]);
    setEnviandoRecibo(false);
    setReciboEnviado(false);
    setMostrarModal(true);
    
    // Cargar pagos existentes de la factura
    try {
      const pagos = await cobrosAPI.obtenerPagosFactura(factura.id);
      setPagosExistentes(pagos);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      setPagosExistentes(factura.pagos || []);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFacturaSeleccionada(null);
    setMonto('');
    setReferencia('');
    setNotas('');
    setPagosParciales([]);
    setPagosExistentes([]);
    setEnviandoRecibo(false);
    setReciboEnviado(false);
    setMontoPendienteActualizado(0);
  };

  const agregarPagoParcial = () => {
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (montoNumero > montoPendienteActualizado) {
      alert(`El monto no puede ser mayor al pendiente (${formatearMoneda(montoPendienteActualizado)})`);
      return;
    }

    // Agregar a la lista de pagos parciales
    setPagosParciales([...pagosParciales, {
      monto: monto,
      metodoPago,
      referencia,
      notas
    }]);

    // Actualizar monto pendiente
    setMontoPendienteActualizado(montoPendienteActualizado - montoNumero);

    // Limpiar campos para el siguiente pago
    setMonto('');
    setReferencia('');
    setNotas('');
    setMetodoPago('efectivo');
  };

  const eliminarPagoParcial = (index: number) => {
    const pago = pagosParciales[index];
    const montoNumero = parseFloat(pago.monto);
    
    // Restaurar monto pendiente
    setMontoPendienteActualizado(montoPendienteActualizado + montoNumero);
    
    // Eliminar de la lista
    const nuevosPagos = pagosParciales.filter((_, i) => i !== index);
    setPagosParciales(nuevosPagos);
  };

  const handleRegistrarCobros = async () => {
    if (!facturaSeleccionada) return;

    if (pagosParciales.length === 0) {
      alert('Debe agregar al menos un pago parcial');
      return;
    }

    const montoTotalPagos = pagosParciales.reduce((sum, p) => sum + parseFloat(p.monto), 0);
    if (montoTotalPagos > facturaSeleccionada.montoPendiente) {
      alert('El monto total de los pagos no puede ser mayor al pendiente');
      return;
    }

    setLoading(true);
    try {
      // Registrar todos los pagos parciales
      const cobrosRegistrados: Cobro[] = [];
      
      for (const pagoParcial of pagosParciales) {
        const montoNumero = parseFloat(pagoParcial.monto);
        
        const nuevoCobro = await cobrosAPI.registrarCobro({
          facturaId: facturaSeleccionada.id,
          fechaCobro: new Date(),
          monto: montoNumero,
          metodoPago: pagoParcial.metodoPago,
          referencia: pagoParcial.referencia || undefined,
          estado: 'confirmado',
          usuario: 'usuario-actual',
          notas: pagoParcial.notas || undefined
        });
        
        cobrosRegistrados.push(nuevoCobro);
      }

      // Obtener todos los pagos de la factura (incluyendo los que acabamos de registrar)
      const todosLosPagos = await cobrosAPI.obtenerPagosFactura(facturaSeleccionada.id);
      const totalPagado = todosLosPagos.reduce((sum, pago) => sum + pago.monto, 0);
      
      // Calcular nuevo monto pendiente basado en el total de la factura menos lo pagado
      const nuevoMontoPendiente = Math.max(0, facturaSeleccionada.total - totalPagado);
      let nuevoEstado: typeof facturaSeleccionada.estado = facturaSeleccionada.estado;
      
      if (nuevoMontoPendiente <= 0) {
        nuevoEstado = 'pagada';
      } else if (totalPagado > 0 && nuevoMontoPendiente < facturaSeleccionada.total) {
        nuevoEstado = 'parcial';
      } else if (nuevoMontoPendiente === facturaSeleccionada.total) {
        nuevoEstado = 'pendiente';
      }

      // Actualizar factura con el nuevo monto pendiente y estado
      await facturasAPI.actualizarFactura(facturaSeleccionada.id, {
        montoPendiente: nuevoMontoPendiente,
        estado: nuevoEstado,
        pagos: todosLosPagos
      });

      // Enviar recibo por email (solo para el primer pago o si se completó)
      if (cobrosRegistrados.length > 0) {
        setEnviandoRecibo(true);
        setReciboEnviado(false);
        try {
          const facturaFinal = await facturasAPI.obtenerFactura(facturaSeleccionada.id);
          if (facturaFinal) {
            // Enviar recibo del primer pago
            const resultado = await enviarReciboPorEmail(facturaFinal, cobrosRegistrados[0]);
            if (resultado.enviado) {
              setReciboEnviado(true);
            } else {
              console.warn('El recibo no se pudo enviar:', resultado.error);
            }
          }
        } catch (error) {
          console.error('Error al enviar recibo:', error);
        } finally {
          setEnviandoRecibo(false);
        }
      }

      // Si la factura está completamente pagada, cerrar el modal
      if (nuevoMontoPendiente <= 0) {
        setTimeout(() => {
          cerrarModal();
          onRefresh();
        }, 1500);
      } else {
        // Actualizar estado y refrescar pagos
        setMontoPendienteActualizado(nuevoMontoPendiente);
        setPagosParciales([]);
        const pagos = await cobrosAPI.obtenerPagosFactura(facturaSeleccionada.id);
        setPagosExistentes(pagos);
        onRefresh();
      }
    } catch (error) {
      console.error('Error al registrar cobros:', error);
      alert('Error al registrar los cobros');
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerNombreMetodoPago = (metodo: MetodoPago): string => {
    const nombres: Record<MetodoPago, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      cheque: 'Cheque',
      online: 'Online'
    };
    return nombres[metodo] || metodo;
  };

  const columnas: TableColumn<Factura>[] = [
    {
      key: 'numeroFactura',
      label: 'Número',
      sortable: true
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => row.cliente.nombre
    },
    {
      key: 'total',
      label: 'Total',
      render: (_, row) => formatearMoneda(row.total),
      align: 'right',
      sortable: true
    },
    {
      key: 'montoPendiente',
      label: 'Pendiente',
      render: (_, row) => (
        <span className={row.montoPendiente > 0 ? 'font-medium text-orange-600' : 'text-green-600'}>
          {formatearMoneda(row.montoPendiente)}
        </span>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'pagos',
      label: 'Pagos',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.pagos.length > 0 ? 'blue' : 'gray'} size="sm">
            {row.pagos.length} {row.pagos.length === 1 ? 'pago' : 'pagos'}
          </Badge>
          {row.estado === 'parcial' && (
            <Badge variant="yellow" size="sm">Parcial</Badge>
          )}
        </div>
      )
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (_, row) => {
        const vencida = new Date(row.fechaVencimiento) < new Date();
        return (
          <span className={vencida ? 'text-red-600' : ''}>
            {row.fechaVencimiento.toLocaleDateString('es-ES')}
          </span>
        );
      },
      sortable: true
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => abrirModalCobro(row)}
          disabled={row.montoPendiente === 0}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          {row.pagos.length > 0 ? 'Agregar Pago' : 'Registrar Cobro'}
        </Button>
      )
    }
  ];

  const totalPagosParciales = pagosParciales.reduce((sum, p) => sum + parseFloat(p.monto), 0);

  return (
    <div className="space-y-6">
      <Table
        data={facturasPendientes}
        columns={columnas}
        emptyMessage="No hay facturas pendientes de cobro"
      />

      {/* Modal de registro de cobro */}
      {mostrarModal && facturaSeleccionada && (
        <Modal
          isOpen={true}
          onClose={cerrarModal}
          title="Registrar Pagos Parciales"
          size="lg"
          footer={
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Total pagos a registrar: <strong className="text-gray-900">{formatearMoneda(totalPagosParciales)}</strong>
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={cerrarModal}>
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleRegistrarCobros} 
                  loading={loading}
                  disabled={pagosParciales.length === 0}
                >
                  Registrar {pagosParciales.length > 1 ? 'Pagos' : 'Pago'}
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Información de la factura */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm">Factura:</span>
                  <div className="font-medium">{facturaSeleccionada.numeroFactura}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Cliente:</span>
                  <div className="font-medium">{facturaSeleccionada.cliente.nombre}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Total Factura:</span>
                  <div className="font-medium">{formatearMoneda(facturaSeleccionada.total)}</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Pendiente:</span>
                  <div className="font-medium text-orange-600">
                    {formatearMoneda(montoPendienteActualizado)}
                  </div>
                </div>
              </div>
            </div>

            {/* Pagos existentes */}
            {pagosExistentes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Pagos Registrados</h3>
                <div className="space-y-2">
                  {pagosExistentes.map((pago) => (
                    <div key={pago.id} className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">{formatearMoneda(pago.monto)}</div>
                          <div className="text-xs text-gray-600">
                            {obtenerNombreMetodoPago(pago.metodoPago)}
                            {pago.referencia && ` • ${pago.referencia}`}
                            {` • ${pago.fecha.toLocaleDateString('es-ES')}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario para agregar pago parcial */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Agregar Pago Parcial</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monto *"
                  type="number"
                  min="0"
                  max={montoPendienteActualizado}
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder={`Máx: ${formatearMoneda(montoPendienteActualizado)}`}
                  required
                />
                <Select
                  label="Método de Pago *"
                  options={metodosPago}
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                />
                <Input
                  label="Referencia / Comprobante"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej: TXN-123456, Cheque #123"
                />
                <Input
                  label="Notas (Opcional)"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas adicionales"
                />
              </div>
              <Button
                variant="secondary"
                onClick={agregarPagoParcial}
                className="mt-3"
                disabled={!monto || parseFloat(monto) <= 0 || parseFloat(monto) > montoPendienteActualizado}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar a Lista
              </Button>
            </div>

            {/* Lista de pagos parciales a registrar */}
            {pagosParciales.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Pagos a Registrar ({pagosParciales.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pagosParciales.map((pago, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{formatearMoneda(parseFloat(pago.monto))}</div>
                          <div className="text-xs text-gray-600">
                            {obtenerNombreMetodoPago(pago.metodoPago)}
                            {pago.referencia && ` • ${pago.referencia}`}
                            {pago.notas && ` • ${pago.notas}`}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => eliminarPagoParcial(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total a registrar:</span>
                  <span className="text-lg font-bold text-blue-600">{formatearMoneda(totalPagosParciales)}</span>
                </div>
              </div>
            )}

            {/* Mensaje de envío de recibo */}
            {enviandoRecibo && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-blue-700">Enviando recibo por email al cliente...</span>
              </div>
            )}
            
            {reciboEnviado && !enviandoRecibo && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Recibo enviado automáticamente al email del cliente</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
