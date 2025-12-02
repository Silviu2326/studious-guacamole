import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select, ConfirmModal } from '../../../components/componentsreutilizables';
import { Turno, TipoTurno, EstadoTurno } from '../types';
import { getTurnos, createTurno, updateTurno, deleteTurno } from '../api/turnos';
import { getPersonal } from '../api/personal';
import { Plus, Edit, Trash2, Clock, Calendar, Loader2 } from 'lucide-react';

export const TurnosStaff: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<string | null>(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);
  
  const [formData, setFormData] = useState<Partial<Turno>>({
    personalId: '',
    fecha: '',
    tipo: 'mañana',
    horaInicio: '',
    horaFin: '',
    estado: 'asignado',
    notas: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [turnosData, personalData] = await Promise.all([
        getTurnos(),
        getPersonal(),
      ]);
      setTurnos(turnosData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (turno?: Turno) => {
    if (turno) {
      setTurnoSeleccionado(turno);
      setFormData({
        personalId: turno.personalId,
        fecha: turno.fecha,
        tipo: turno.tipo,
        horaInicio: turno.horaInicio,
        horaFin: turno.horaFin,
        estado: turno.estado,
        notas: turno.notas || '',
      });
    } else {
      setTurnoSeleccionado(null);
      setFormData({
        personalId: '',
        fecha: '',
        tipo: 'mañana',
        horaInicio: '',
        horaFin: '',
        estado: 'asignado',
        notas: '',
      });
    }
    setModalAbierto(true);
  };

  const handleGuardar = async () => {
    try {
      if (turnoSeleccionado) {
        await updateTurno(turnoSeleccionado.id, formData);
      } else {
        await createTurno(formData as Omit<Turno, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error('Error saving turno:', error);
    }
  };

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      await deleteTurno(modalEliminar);
      setModalEliminar(null);
      cargarDatos();
    } catch (error) {
      console.error('Error deleting turno:', error);
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string, row: Turno) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-sm text-slate-900">{new Date(value).toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'personalId',
      label: 'Personal',
      render: (value: string) => {
        const persona = personal.find(p => p.id === value);
        return (
          <span className="text-sm text-slate-900">
            {persona ? `${persona.nombre} ${persona.apellidos}` : value}
          </span>
        );
      },
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: TipoTurno) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'horaInicio',
      label: 'Horario',
      render: (value: string, row: Turno) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-500" />
          <span className="text-sm text-slate-900">{value} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: EstadoTurno) => {
        const estados = {
          asignado: { bg: 'bg-gray-100', text: 'text-gray-800' },
          confirmado: { bg: 'bg-green-100', text: 'text-green-800' },
          completado: { bg: 'bg-blue-100', text: 'text-blue-800' },
          cancelado: { bg: 'bg-red-100', text: 'text-red-800' },
        };
        const estadoStyle = estados[value] || estados.asignado;
        return (
          <span className={`px-2 py-1 ${estadoStyle.bg} ${estadoStyle.text} rounded-full text-xs font-medium`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Turno) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAbrirModal(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setModalEliminar(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && turnos.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando turnos...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => handleAbrirModal()}>
          <Plus size={20} className="mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Tabla */}
      <Card className="bg-white shadow-sm">
        {turnos.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos registrados</h3>
            <p className="text-gray-600 mb-4">Comienza agregando un nuevo turno</p>
            <Button onClick={() => handleAbrirModal()}>
              <Plus size={20} className="mr-2" />
              Crear Turno
            </Button>
          </div>
        ) : (
          <Table
            data={turnos}
            columns={columns}
            loading={loading}
            emptyMessage="No hay turnos registrados"
          />
        )}
      </Card>

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Personal"
            options={personal.map(p => ({
              value: p.id,
              label: `${p.nombre} ${p.apellidos} - ${p.tipo}`,
            }))}
            value={formData.personalId}
            onChange={(e) => setFormData({ ...formData, personalId: e.target.value })}
          />
          
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          />
          
          <Select
            label="Tipo de Turno"
            options={[
              { value: 'mañana', label: 'Mañana' },
              { value: 'tarde', label: 'Tarde' },
              { value: 'noche', label: 'Noche' },
              { value: 'completo', label: 'Completo' },
              { value: 'parcial', label: 'Parcial' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoTurno })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora Inicio"
              type="time"
              value={formData.horaInicio}
              onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
            />
            <Input
              label="Hora Fin"
              type="time"
              value={formData.horaFin}
              onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
            />
          </div>
          
          <Select
            label="Estado"
            options={[
              { value: 'asignado', label: 'Asignado' },
              { value: 'confirmado', label: 'Confirmado' },
              { value: 'completado', label: 'Completado' },
              { value: 'cancelado', label: 'Cancelado' },
            ]}
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoTurno })}
          />
          
          <Input
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            placeholder="Notas adicionales sobre el turno"
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar Turno"
        message="¿Estás seguro de que deseas eliminar este turno? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

