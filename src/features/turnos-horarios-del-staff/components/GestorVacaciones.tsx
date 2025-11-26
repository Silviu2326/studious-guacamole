import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select, ConfirmModal } from '../../../components/componentsreutilizables';
import { Vacacion, TipoAusencia } from '../types';
import { getVacaciones, createVacacion, updateVacacion, deleteVacacion, aprobarVacacion, rechazarVacacion } from '../api/vacaciones';
import { getPersonal } from '../api/personal';
import { Plus, Edit, Trash2, Calendar, CheckCircle, XCircle, Plane } from 'lucide-react';

export const GestorVacaciones: React.FC = () => {
  const [vacaciones, setVacaciones] = useState<Vacacion[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<string | null>(null);
  const [vacacionSeleccionada, setVacacionSeleccionada] = useState<Vacacion | null>(null);
  const [accionModal, setAccionModal] = useState<'aprobar' | 'rechazar' | null>(null);
  
  const [formData, setFormData] = useState<Partial<Vacacion>>({
    personalId: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'vacaciones',
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
        motivo: vacacion.motivo || '',
      });
    } else {
      setVacacionSeleccionada(null);
      setFormData({
        personalId: '',
        fechaInicio: '',
        fechaFin: '',
        tipo: 'vacaciones',
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
        await createVacacion({
          ...formData,
          estado: 'pendiente',
        } as Omit<Vacacion, 'id' | 'createdAt' | 'updatedAt'>);
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

  const handleAprobar = async (id: string) => {
    try {
      await aprobarVacacion(id);
      setAccionModal(null);
      cargarDatos();
    } catch (error) {
      console.error('Error aprobando vacacion:', error);
    }
  };

  const handleRechazar = async (motivo: string) => {
    if (!vacacionSeleccionada) return;
    try {
      await rechazarVacacion(vacacionSeleccionada.id, motivo);
      setAccionModal(null);
      setVacacionSeleccionada(null);
      cargarDatos();
    } catch (error) {
      console.error('Error rechazando vacacion:', error);
    }
  };

  const columns = [
    {
      key: 'personalId',
      label: 'Personal',
      render: (value: string) => {
        const persona = personal.find(p => p.id === value);
        return persona ? `${persona.nombre} ${persona.apellidos}` : value;
      },
    },
    {
      key: 'fechaInicio',
      label: 'Periodo',
      render: (value: string, row: Vacacion) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            {new Date(value).toLocaleDateString('es-ES')} - {new Date(row.fechaFin).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: TipoAusencia) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => {
        const estados = {
          pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Plane className="w-3 h-3" /> },
          aprobada: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
          rechazada: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3 h-3" /> },
        };
        const estadoStyle = estados[value as keyof typeof estados] || estados.pendiente;
        return (
          <span className={`px-2 py-1 ${estadoStyle.bg} ${estadoStyle.text} rounded-full text-xs font-medium flex items-center gap-1`}>
            {estadoStyle.icon}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value: string) => value || '-',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Vacacion) => (
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <>
              <button
                onClick={() => {
                  setVacacionSeleccionada(row);
                  setAccionModal('aprobar');
                }}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Aprobar"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setVacacionSeleccionada(row);
                  setAccionModal('rechazar');
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Rechazar"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => handleAbrirModal(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModalEliminar(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => handleAbrirModal()}>
          <Plus size={20} className="mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      <Table
        data={vacaciones}
        columns={columns}
        loading={loading}
        emptyMessage="No hay solicitudes de vacaciones registradas"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={vacacionSeleccionada ? 'Editar Vacación' : 'Nueva Solicitud de Vacaciones'}
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
              { value: 'baja_laboral', label: 'Baja Laboral' },
              { value: 'permiso', label: 'Permiso' },
              { value: 'personal', label: 'Personal' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoAusencia })}
          />
          
          <Input
            label="Motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Motivo de la ausencia"
          />
        </div>
      </Modal>

      <Modal
        isOpen={accionModal === 'aprobar'}
        onClose={() => {
          setAccionModal(null);
          setVacacionSeleccionada(null);
        }}
        title="Aprobar Vacación"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => {
              setAccionModal(null);
              setVacacionSeleccionada(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => vacacionSeleccionada && handleAprobar(vacacionSeleccionada.id)}>
              Aprobar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas aprobar esta solicitud de vacaciones?
        </p>
      </Modal>

      <Modal
        isOpen={accionModal === 'rechazar'}
        onClose={() => {
          setAccionModal(null);
          setVacacionSeleccionada(null);
        }}
        title="Rechazar Vacación"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => {
              setAccionModal(null);
              setVacacionSeleccionada(null);
            }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleRechazar('Rechazado por administración')}>
              Rechazar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas rechazar esta solicitud de vacaciones?
          </p>
          <Input
            label="Motivo del Rechazo"
            placeholder="Motivo del rechazo"
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar Solicitud"
        message="¿Estás seguro de que deseas eliminar esta solicitud de vacaciones?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};


