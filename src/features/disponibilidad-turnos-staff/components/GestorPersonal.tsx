import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select, ConfirmModal } from '../../../components/componentsreutilizables';
import { Personal, TipoPersonal, EstadoPersonal } from '../types';
import { getPersonal, createPersonal, updatePersonal, deletePersonal } from '../api/personal';
import { Plus, Edit, Trash2, User, Loader2, Package } from 'lucide-react';

export const GestorPersonal: React.FC = () => {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<string | null>(null);
  const [personalSeleccionado, setPersonalSeleccionado] = useState<Personal | null>(null);
  
  const [formData, setFormData] = useState<Partial<Personal>>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    tipo: 'entrenador',
    especialidad: '',
    estado: 'activo',
    fechaIngreso: '',
  });

  useEffect(() => {
    cargarPersonal();
  }, []);

  const cargarPersonal = async () => {
    setLoading(true);
    try {
      const data = await getPersonal();
      setPersonal(data);
    } catch (error) {
      console.error('Error loading personal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (persona?: Personal) => {
    if (persona) {
      setPersonalSeleccionado(persona);
      setFormData({
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        email: persona.email,
        telefono: persona.telefono || '',
        tipo: persona.tipo,
        especialidad: persona.especialidad || '',
        estado: persona.estado,
        fechaIngreso: persona.fechaIngreso,
      });
    } else {
      setPersonalSeleccionado(null);
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        tipo: 'entrenador',
        especialidad: '',
        estado: 'activo',
        fechaIngreso: '',
      });
    }
    setModalAbierto(true);
  };

  const handleGuardar = async () => {
    try {
      if (personalSeleccionado) {
        await updatePersonal(personalSeleccionado.id, formData);
      } else {
        await createPersonal(formData as Omit<Personal, 'id'>);
      }
      setModalAbierto(false);
      cargarPersonal();
    } catch (error) {
      console.error('Error saving personal:', error);
    }
  };

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      await deletePersonal(modalEliminar);
      setModalEliminar(null);
      cargarPersonal();
    } catch (error) {
      console.error('Error deleting personal:', error);
    }
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Personal',
      render: (value: string, row: Personal) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-500" />
          <span className="text-sm text-slate-900">{value} {row.apellidos}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <span className="text-sm text-slate-900">{value}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: TipoPersonal) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'especialidad',
      label: 'Especialidad',
      render: (value: string) => (
        <span className="text-sm text-slate-600">{value || '-'}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: EstadoPersonal) => {
        const estados = {
          activo: { bg: 'bg-green-100', text: 'text-green-800' },
          vacaciones: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
          baja: { bg: 'bg-red-100', text: 'text-red-800' },
          inactivo: { bg: 'bg-gray-100', text: 'text-gray-800' },
        };
        const estadoStyle = estados[value] || estados.activo;
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
      render: (_: any, row: Personal) => (
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

  if (loading && personal.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando personal...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => handleAbrirModal()}>
          <Plus size={20} className="mr-2" />
          Nuevo Personal
        </Button>
      </div>

      {/* Tabla */}
      <Card className="bg-white shadow-sm">
        {personal.length === 0 && !loading ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personal registrado</h3>
            <p className="text-gray-600 mb-4">Comienza agregando un nuevo miembro del personal</p>
            <Button onClick={() => handleAbrirModal()}>
              <Plus size={20} className="mr-2" />
              Agregar Personal
            </Button>
          </div>
        ) : (
          <Table
            data={personal}
            columns={columns}
            loading={loading}
            emptyMessage="No hay personal registrado"
          />
        )}
      </Card>

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={personalSeleccionado ? 'Editar Personal' : 'Nuevo Personal'}
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <Input
              label="Apellidos"
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <Input
            label="Teléfono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          
          <Select
            label="Tipo de Personal"
            options={[
              { value: 'entrenador', label: 'Entrenador' },
              { value: 'fisioterapeuta', label: 'Fisioterapeuta' },
              { value: 'recepcionista', label: 'Recepcionista' },
              { value: 'limpieza', label: 'Limpieza' },
              { value: 'gerente', label: 'Gerente' },
            ]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoPersonal })}
          />
          
          <Input
            label="Especialidad"
            value={formData.especialidad}
            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
            placeholder="Especialidad del personal (opcional)"
          />
          
          <Select
            label="Estado"
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'vacaciones', label: 'Vacaciones' },
              { value: 'baja', label: 'Baja' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoPersonal })}
          />
          
          <Input
            label="Fecha de Ingreso"
            type="date"
            value={formData.fechaIngreso}
            onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!modalEliminar}
        onClose={() => setModalEliminar(null)}
        onConfirm={handleEliminar}
        title="Eliminar Personal"
        message="¿Estás seguro de que deseas eliminar este personal? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

