import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/categorias';
import { CategoriaGasto } from '../types';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export const CategoriasGastos: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaGasto | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'operativo' as const,
    descripcion: '',
    presupuestoMensual: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCategoria = () => {
    setCategoriaSeleccionada(null);
    setFormData({
      nombre: '',
      tipo: 'operativo',
      descripcion: '',
      presupuestoMensual: '',
    });
    setMostrarModal(true);
  };

  const handleEditarCategoria = (categoria: CategoriaGasto) => {
    setCategoriaSeleccionada(categoria);
    setFormData({
      nombre: categoria.nombre,
      tipo: categoria.tipo,
      descripcion: categoria.descripcion || '',
      presupuestoMensual: categoria.presupuestoMensual?.toString() || '',
    });
    setMostrarModal(true);
  };

  const handleGuardarCategoria = async () => {
    try {
      const categoriaData = {
        ...formData,
        presupuestoMensual: formData.presupuestoMensual ? parseFloat(formData.presupuestoMensual) : undefined,
      };

      if (categoriaSeleccionada) {
        await updateCategoria(categoriaSeleccionada.id, categoriaData);
      } else {
        await createCategoria(categoriaData as Omit<CategoriaGasto, 'id' | 'activa'>);
      }
      await cargarDatos();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await deleteCategoria(id);
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const formatearMoneda = (valor?: number) => {
    if (!valor) return 'No asignado';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { color: string; label: string }> = {
      operativo: { color: 'bg-blue-100 text-blue-800', label: 'Operativo' },
      inversion: { color: 'bg-purple-100 text-purple-800', label: 'Inversión' },
      mantenimiento: { color: 'bg-orange-100 text-orange-800', label: 'Mantenimiento' },
    };
    const tipoInfo = tipos[tipo] || tipos.operativo;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoInfo.color}`}>
        {tipoInfo.label}
      </span>
    );
  };

  const columnas = [
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => getTipoBadge(value),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value: string | undefined) => value || 'Sin descripción',
    },
    {
      key: 'presupuestoMensual',
      label: 'Presupuesto Mensual',
      render: (value: number | undefined) => formatearMoneda(value),
      align: 'right' as const,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: CategoriaGasto) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditarCategoria(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEliminarCategoria(row.id)}
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
        <Button onClick={handleCrearCategoria}>
          <Plus size={20} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Tabla de Categorías */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Table
            data={categorias}
            columns={columnas}
            loading={loading}
            emptyMessage="No hay categorías registradas"
          />
        </div>
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={categoriaSeleccionada ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarCategoria}>
              {categoriaSeleccionada ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={[
              { value: 'operativo', label: 'Operativo' },
              { value: 'inversion', label: 'Inversión' },
              { value: 'mantenimiento', label: 'Mantenimiento' },
            ]}
            required
          />
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <Input
            label="Presupuesto Mensual"
            type="number"
            value={formData.presupuestoMensual}
            onChange={(e) => setFormData({ ...formData, presupuestoMensual: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

