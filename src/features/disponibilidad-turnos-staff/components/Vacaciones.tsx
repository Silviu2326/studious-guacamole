import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select, ConfirmModal } from '../../../components/componentsreutilizables';
import { Vacacion, TipoAusencia } from '../types';
import { getVacaciones, createVacacion, updateVacacion, deleteVacacion } from '../api/vacaciones';
import { getPersonal } from '../api/personal';
import { Plus, Edit, Trash2, Calendar, Loader2, Plane } from 'lucide-react';

export const Vacaciones: React.FC = () => {
  const [vacaciones, setVacaciones] = useState<Vacacion[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<string | null>(null);
  const [vacacionSeleccionada, setVacacionSeleccionada] = useState<Vacacion | null>(null);
  
  const [formData, setFormData] = useState<Partial<Vacacion>>({
    personalId: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'vacaciones',
    estado: 'pendiente',
    motivo: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [vacacionesData, personalData] = await Promise.all([
        getVacaciones(),
        getPersonal(),
      ]);
      setVacaciones(vacacionesData);
      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (vacacion?: Vacacion) => {
    if (vacacion) {
      setVacacionSeleccionada(vacacion);
      setFormData({
        personalId: vacacion.personalId,
        fechaInicio: vacacion.fechaInicio,
        fechaFin: vacacion.fechaFin,
        tipo: vacacion.tipo,
        estado: vacacion.estado,
        motivo: vacacion.motivo || '',
      });
    } else {
      setVacacionSeleccionada(null);
      setFormData({
        personalId: '',
        fechaInicio: '',
        fechaFin: '',
        tipo: 'vacaciones',
        estado: 'pendiente',
        motivo: '',
      });
    }
    setModalAbierto(true);
  };

  const handleGuardar = async () => {
    try {
      if (vacacionSeleccionada) {
        await updateVacacion(vacacionSeleccionada.id, formData);
      } else {
        await createVacacion(formData as Omit<Vacacion, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error('Error saving vacacion:', error);
    }
  };

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      await deleteVacacion(modalEliminar);
      setModalEliminar(null);
      cargarDatos();
    } catch (error) {
      console.error('Error deleting vacacion:', error);
    }
  };

  const columns = [
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
      key: 'fechaInicio',
      label: 'Periodo',
      render: (value: string, row: Vacacion) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-sm text-slate-900">
            {new Date(value).toLocaleDateString('es-ES')} - {new Date(row.fechaFin).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: TipoAusencia) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => {
        const estados = {
          pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
          aprobada: { bg: 'bg-green-100', text: 'text-green-800' },
          rechazada: { bg: 'bg-red-100', text: 'text-red-800' },
        };
        const estadoStyle = estados[value as keyof typeof estados] || estados.pendiente;
        return (
          <span className={`px-2 py-1 ${estadoStyle.bg} ${estadoStyle.text} rounded-full text-xs font-medium`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value: string) => (
        <span className="text-sm text-slate-600">{value || '-'}</span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Vacacion) => (
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

  if (loading && vacaciones.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando solicitudes...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => handleAbrirModal()}>
          <Plus size={20} className="mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Tabla */}
      <Card className="bg-white shadow-sm">
        {vacaciones.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <Plane size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes registradas</h3>
            <p className="text-gray-600 mb-4">Comienza agregando una nueva solicitud de vacaciones o ausencia</p>
            <Button onClick={() => handleAbrirModal()}>
              <Plus size={20} className="mr-2" />
              Crear Solicitud
            </Button>
          </div>
        ) : (
          <Table
            data={vacaciones}
            columns={columns}
            loading={loading}
            emptyMessage="No hay solicitudes de vacaciones registradas"
          />
        )}
      </Card>

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={vacacionSeleccionada ? 'Editar Solicitud' : 'Nueva Solicitud de Vacaciones'}
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
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha Inicio"
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
            />
          </div>
          
          <Select
            label="Tipo de Ausencia"
            options={[
              { value: 'vacaciones', label: 'Vacaciones' },
              { value: 'baja_medica', label: 'Baja Médica' },
              { value: 'permiso', label: 'Permiso' },
              { value: 'personal', label: 'Personal' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoAusencia })}
          />
          
          <Select
            label="Estado"
            options={[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'aprobada', label: 'Aprobada' },
              { value: 'rechazada', label: 'Rechazada' },
            ]}
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'pendiente' | 'aprobada' | 'rechazada' })}
          />
          
          <Input
            label="Motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Motivo de la solicitud"
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar Solicitud"
        message="¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

