import React, { useState } from 'react';
import { Card, Table, Button, Modal, Textarea } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { cancelarReserva } from '../api';
import { XCircle, Calendar, Clock, DollarSign, AlertTriangle, Package } from 'lucide-react';

interface CancelacionesProps {
  reservas: Reserva[];
  role: 'entrenador' | 'gimnasio';
  onCancelar: (reservaId: string) => void;
}

export const Cancelaciones: React.FC<CancelacionesProps> = ({
  reservas,
  role,
  onCancelar,
}) => {
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  const reservasCancelables = reservas.filter(
    (r) => r.estado === 'confirmada' || r.estado === 'pendiente'
  );

  const handleCancelar = async () => {
    if (!reservaSeleccionada) return;

    setProcesando(true);
    try {
      await cancelarReserva(reservaSeleccionada.id, motivo);
      onCancelar(reservaSeleccionada.id);
      setReservaSeleccionada(null);
      setMotivo('');
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
    } finally {
      setProcesando(false);
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-ES'),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => `${row.horaInicio} - ${row.horaFin}`,
    },
    {
      key: 'clienteNombre',
      label: role === 'entrenador' ? 'Cliente' : 'Socio',
      render: (value: string) => value,
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number) => `€${value.toFixed(2)}`,
      align: 'right' as const,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Reserva) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setReservaSeleccionada(row)}
        >
          Cancelar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Cancelaciones
            </h3>
          </div>

          {reservasCancelables.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reservas cancelables</h3>
              <p className="text-gray-600">Todas las reservas están completadas o ya han sido canceladas</p>
            </Card>
          ) : (
            <Table
              data={reservasCancelables}
              columns={columns}
              emptyMessage="No hay reservas para cancelar"
            />
          )}
        </div>
      </Card>

      <Modal
        isOpen={!!reservaSeleccionada}
        onClose={() => {
          setReservaSeleccionada(null);
          setMotivo('');
        }}
        title="Cancelar Reserva"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setReservaSeleccionada(null);
                setMotivo('');
              }}
            >
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelar}
              loading={procesando}
              disabled={!motivo.trim()}
            >
              Confirmar Cancelación
            </Button>
          </div>
        }
      >
        {reservaSeleccionada && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2 ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  {reservaSeleccionada.fecha.toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  {reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  €{reservaSeleccionada.precio.toFixed(2)}
                </span>
              </div>
            </div>

            <Textarea
              label="Motivo de Cancelación"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo de la cancelación..."
              rows={4}
            />
          </div>
        )}
      </Modal>
    </>
  );
};
