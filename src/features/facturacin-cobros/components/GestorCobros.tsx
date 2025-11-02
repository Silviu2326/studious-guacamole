import React, { useState } from 'react';
import { Card, Button, Table, TableColumn, Modal, Input, Select, SelectOption, Badge } from '../../../components/componentsreutilizables';
import { Factura, Cobro, MetodoPago } from '../types';
import { cobrosAPI } from '../api/cobros';
import { facturasAPI } from '../api/facturas';
import { DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface GestorCobrosProps {
  facturas: Factura[];
  onRefresh: () => void;
}

export const GestorCobros: React.FC<GestorCobrosProps> = ({ facturas, onRefresh }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [referencia, setReferencia] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida');

  const metodosPago: SelectOption[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' }
  ];

  const abrirModalCobro = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setMonto(factura.montoPendiente.toString());
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFacturaSeleccionada(null);
    setMonto('');
    setReferencia('');
    setNotas('');
  };

  const handleRegistrarCobro = async () => {
    if (!facturaSeleccionada) return;

    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (montoNumero > facturaSeleccionada.montoPendiente) {
      alert('El monto no puede ser mayor al pendiente');
      return;
    }

    setLoading(true);
    try {
      await cobrosAPI.registrarCobro({
        facturaId: facturaSeleccionada.id,
        fechaCobro: new Date(),
        monto: montoNumero,
        metodoPago,
        referencia: referencia || undefined,
        estado: 'confirmado',
        usuario: 'usuario-actual',
        notas: notas || undefined
      });

      // Actualizar factura
      const nuevoMontoPendiente = facturaSeleccionada.montoPendiente - montoNumero;
      let nuevoEstado: typeof facturaSeleccionada.estado = facturaSeleccionada.estado;
      
      if (nuevoMontoPendiente === 0) {
        nuevoEstado = 'pagada';
      } else if (nuevoMontoPendiente < facturaSeleccionada.total) {
        nuevoEstado = 'parcial';
      }

      await facturasAPI.actualizarFactura(facturaSeleccionada.id, {
        montoPendiente: nuevoMontoPendiente,
        estado: nuevoEstado
      });

      cerrarModal();
      onRefresh();
    } catch (error) {
      console.error('Error al registrar cobro:', error);
      alert('Error al registrar el cobro');
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
          Registrar Cobro
        </Button>
      )
    }
  ];

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
          title="Registrar Cobro"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleRegistrarCobro} loading={loading}>
                Registrar Cobro
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Factura:</span>
                  <span className="font-medium">{facturaSeleccionada.numeroFactura}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{facturaSeleccionada.cliente.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Factura:</span>
                  <span className="font-medium">{formatearMoneda(facturaSeleccionada.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pendiente:</span>
                  <span className="font-medium text-orange-600">
                    {formatearMoneda(facturaSeleccionada.montoPendiente)}
                  </span>
                </div>
              </div>
            </div>

            <Input
              label="Monto a Cobrar *"
              type="number"
              min="0"
              max={facturaSeleccionada.montoPendiente}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
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
              placeholder="Notas adicionales sobre el pago"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

