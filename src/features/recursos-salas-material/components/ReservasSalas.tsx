import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { salasApi, ReservaSala, Sala } from '../api';
import { Plus, Calendar, Building2, Users, Clock } from 'lucide-react';

export const ReservasSalas: React.FC = () => {
  const [reservas, setReservas] = useState<ReservaSala[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaReserva, setNuevaReserva] = useState<Partial<ReservaSala>>({
    estado: 'pendiente'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reservasData, salasData] = await Promise.all([
        salasApi.obtenerReservas(),
        salasApi.obtenerSalas()
      ]);
      setReservas(reservasData);
      setSalas(salasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearReserva = async () => {
    try {
      await salasApi.crearReserva(nuevaReserva);
      setModalAbierto(false);
      setNuevaReserva({ estado: 'pendiente' });
      cargarDatos();
    } catch (error) {
      console.error('Error al crear reserva:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'confirmada':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Confirmada</span>;
      case 'pendiente':
        return <span className={`${clases} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}>Pendiente</span>;
      case 'cancelada':
        return <span className={`${clases} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>Cancelada</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{estado}</span>;
    }
  };

  const columns = [
    {
      key: 'instructorNombre',
      label: 'Instructor',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{value}</span>
        </div>
      )
    },
    {
      key: 'salaId',
      label: 'Sala',
      render: (_: any, row: ReservaSala) => {
        const sala = salas.find(s => s.id === row.salaId);
        return (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span>{sala?.nombre || row.salaId}</span>
          </div>
        );
      }
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      key: 'horaInicio',
      label: 'Horario',
      render: (_: any, row: ReservaSala) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      )
    },
    {
      key: 'participantesEsperados',
      label: 'Participantes',
      render: (value: number) => (
        <span className="font-semibold">{value} personas</span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: ReservaSala) => (
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={async () => {
                try {
                  await salasApi.cancelarReserva(row.id);
                  cargarDatos();
                } catch (error) {
                  console.error('Error al cancelar reserva:', error);
                }
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={20} className="mr-2" />
          Nueva Reserva
        </Button>
      </div>

      <Table
        data={reservas}
        columns={columns}
        loading={loading}
        emptyMessage="No hay reservas registradas"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setNuevaReserva({ estado: 'pendiente' });
        }}
        title="Nueva Reserva de Sala"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearReserva}>
              Crear Reserva
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sala</label>
            <Select
              options={[
                { value: '', label: 'Selecciona una sala', disabled: true },
                ...salas.map(sala => ({
                  value: sala.id,
                  label: `${sala.nombre} - ${sala.ubicacion}`
                }))
              ]}
              value={nuevaReserva.salaId || ''}
              onChange={(e) => setNuevaReserva({ ...nuevaReserva, salaId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Instructor</label>
            <Input
              placeholder="Nombre del instructor"
              value={nuevaReserva.instructorNombre || ''}
              onChange={(e) => setNuevaReserva({ ...nuevaReserva, instructorNombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
            <Input
              type="date"
              value={nuevaReserva.fecha ? nuevaReserva.fecha.split('T')[0] : ''}
              onChange={(e) => setNuevaReserva({ ...nuevaReserva, fecha: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hora Inicio</label>
              <Input
                type="time"
                value={nuevaReserva.horaInicio || ''}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, horaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hora Fin</label>
              <Input
                type="time"
                value={nuevaReserva.horaFin || ''}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, horaFin: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Participantes Esperados</label>
            <Input
              type="number"
              placeholder="20"
              value={nuevaReserva.participantesEsperados || ''}
              onChange={(e) => setNuevaReserva({ ...nuevaReserva, participantesEsperados: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Motivo</label>
            <Textarea
              placeholder="Describe el motivo de la reserva..."
              value={nuevaReserva.motivo || ''}
              onChange={(e) => setNuevaReserva({ ...nuevaReserva, motivo: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

