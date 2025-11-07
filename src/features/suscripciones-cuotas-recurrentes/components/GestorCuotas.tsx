import React, { useState, useEffect } from 'react';
import { Cuota } from '../types';
import { Card, Table, Badge, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { getCuotas, procesarPagoCuota, getCuotasPendientes, getCuotasVencidas } from '../api/cuotas';
import { Calendar, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

interface GestorCuotasProps {
  suscripcionId?: string;
}

export const GestorCuotas: React.FC<GestorCuotasProps> = ({ suscripcionId }) => {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPago, setModalPago] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>('tarjeta');
  const [referencia, setReferencia] = useState<string>('');

  useEffect(() => {
    loadCuotas();
  }, [suscripcionId]);

  const loadCuotas = async () => {
    setLoading(true);
    try {
      const data = await getCuotas(suscripcionId);
      setCuotas(data);
    } catch (error) {
      console.error('Error cargando cuotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcesarPago = async () => {
    if (!cuotaSeleccionada) return;
    
    try {
      await procesarPagoCuota(cuotaSeleccionada.id, metodoPago, referencia);
      await loadCuotas();
      setModalPago(false);
      setCuotaSeleccionada(null);
      setMetodoPago('tarjeta');
      setReferencia('');
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      pagada: { label: 'Pagada', color: 'success' },
      pendiente: { label: 'Pendiente', color: 'warning' },
      vencida: { label: 'Vencida', color: 'error' },
      fallida: { label: 'Fallida', color: 'error' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  const columns = [
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => (
        <span className="text-base font-semibold text-gray-900">
          {value} €
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-base text-gray-900">
            {new Date(value).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'fechaPago',
      label: 'Fecha Pago',
      render: (value?: string) => (
        value ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-base text-gray-900">
              {new Date(value).toLocaleDateString('es-ES')}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">
            Pendiente
          </span>
        )
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'metodoPago',
      label: 'Método Pago',
      render: (value?: string) => (
        value ? (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">
              {value}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">
            -
          </span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Cuota) => (
        row.estado !== 'pagada' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCuotaSeleccionada(row);
              setModalPago(true);
            }}
          >
            Procesar Pago
          </Button>
        ) : (
          <span className="text-sm text-gray-600">
            Pagada
          </span>
        )
      ),
    },
  ];

  const cuotasPendientes = cuotas.filter(c => c.estado === 'pendiente' || c.estado === 'vencida');
  const cuotasVencidas = cuotas.filter(c => c.estado === 'vencida');

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Total Cuotas
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {cuotas.length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Pendientes
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {cuotasPendientes.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Vencidas
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {cuotasVencidas.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Tabla de cuotas */}
      <Card className="bg-white shadow-sm">
        <Table
          data={cuotas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay cuotas registradas"
        />
      </Card>

      {/* Modal de pago */}
      <Modal
        isOpen={modalPago}
        onClose={() => {
          setModalPago(false);
          setCuotaSeleccionada(null);
        }}
        title="Procesar Pago de Cuota"
        size="md"
      >
        {cuotaSeleccionada && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Monto
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {cuotaSeleccionada.monto} €
              </p>
            </div>
            
            <Select
              label="Método de Pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              options={[
                { value: 'tarjeta', label: 'Tarjeta' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'efectivo', label: 'Efectivo' },
              ]}
            />
            
            <Input
              label="Referencia (opcional)"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej: REF-2024-001"
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalPago(false);
                  setCuotaSeleccionada(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleProcesarPago}
              >
                Procesar Pago
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

