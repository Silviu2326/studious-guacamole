import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../api/proveedores';
import { Proveedor } from '../types';
import { Building2, Plus, Search, Star, Edit, Trash2, Mail, Phone } from 'lucide-react';

export const ProveedoresList: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: 'productos' as const,
    categorias: [] as string[],
    condicionesPago: '',
    descuentosAplicables: 0,
    notas: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getProveedores({ activo: true });
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProveedor = () => {
    setProveedorSeleccionado(null);
    setFormData({
      nombre: '',
      contacto: '',
      email: '',
      telefono: '',
      direccion: '',
      tipo: 'productos',
      categorias: [],
      condicionesPago: '',
      descuentosAplicables: 0,
      notas: '',
    });
    setMostrarModal(true);
  };

  const handleEditarProveedor = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      email: proveedor.email,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion || '',
      tipo: proveedor.tipo,
      categorias: proveedor.categorias,
      condicionesPago: proveedor.condicionesPago || '',
      descuentosAplicables: proveedor.descuentosAplicables || 0,
      notas: proveedor.notas || '',
    });
    setMostrarModal(true);
  };

  const handleGuardarProveedor = async () => {
    try {
      if (proveedorSeleccionado) {
        await updateProveedor(proveedorSeleccionado.id, formData);
      } else {
        await createProveedor(formData);
      }
      await cargarDatos();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  };

  const handleEliminarProveedor = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      try {
        await deleteProveedor(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
      }
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const renderEstrellas = (calificacion: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= calificacion ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{calificacion.toFixed(1)}</span>
      </div>
    );
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    busqueda === '' ||
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columnas = [
    {
      key: 'nombre',
      label: 'Proveedor',
      render: (value: string, row: Proveedor) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{row.contacto}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contacto',
      render: (value: string, row: Proveedor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3" />
            {value}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="w-3 h-3" />
            {row.telefono}
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: 'calificacion',
      label: 'Calificación',
      render: (value: number) => renderEstrellas(value),
    },
    {
      key: 'numeroOrdenes',
      label: 'Órdenes',
      align: 'center' as const,
    },
    {
      key: 'montoTotal',
      label: 'Total Comprado',
      render: (value: number) => formatearMoneda(value),
      align: 'right' as const,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Proveedor) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditarProveedor(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEliminarProveedor(row.id)}
            className="text-red-600 hover:text-red-800"
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
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCrearProveedor}>
          <Plus size={20} className="mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar proveedores..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Proveedores */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Table
            data={proveedoresFiltrados}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay proveedores registrados"
          />
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={proveedorSeleccionado ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarProveedor}>
              {proveedorSeleccionado ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Proveedor"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contacto"
              value={formData.contacto}
              onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              required
            />
            <Input
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={[
              { value: 'productos', label: 'Productos' },
              { value: 'servicios', label: 'Servicios' },
              { value: 'mantenimiento', label: 'Mantenimiento' },
              { value: 'servicios_generales', label: 'Servicios Generales' },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Condiciones de Pago"
              value={formData.condicionesPago}
              onChange={(e) => setFormData({ ...formData, condicionesPago: e.target.value })}
            />
            <Input
              label="Descuentos Aplicables (%)"
              type="number"
              value={formData.descuentosAplicables.toString()}
              onChange={(e) => setFormData({ ...formData, descuentosAplicables: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <Input
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

