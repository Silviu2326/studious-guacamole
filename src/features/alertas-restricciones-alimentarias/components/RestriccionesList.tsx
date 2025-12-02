import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, Badge, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { Plus, Edit2, Trash2, AlertTriangle, Shield, Heart, Users, Search, X } from 'lucide-react';
import * as api from '../api/restricciones';
import { RestriccionAlimentaria, TipoRestriccion, SeveridadRestriccion } from '../types';

export const RestriccionesList: React.FC = () => {
  const [restricciones, setRestricciones] = useState<RestriccionAlimentaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<TipoRestriccion | 'todos'>('todos');
  const [filtroSeveridad, setFiltroSeveridad] = useState<SeveridadRestriccion | 'todas'>('todas');
  const [formData, setFormData] = useState<Partial<RestriccionAlimentaria>>({
    tipo: 'alergia',
    descripcion: '',
    ingredientesAfectados: [],
    severidad: 'leve',
    activa: true,
  });

  useEffect(() => {
    cargarRestricciones();
  }, []);

  const cargarRestricciones = async () => {
    setLoading(true);
    const data = await api.getRestricciones();
    setRestricciones(data);
    setLoading(false);
  };

  const handleGuardar = async () => {
    if (editingId) {
      await api.actualizarRestriccion(editingId, formData);
    } else {
      await api.crearRestriccion(formData as Omit<RestriccionAlimentaria, 'id' | 'fechaRegistro' | 'activa'>);
    }
    cargarRestricciones();
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      tipo: 'alergia',
      descripcion: '',
      ingredientesAfectados: [],
      severidad: 'leve',
      activa: true,
    });
  };

  const handleEditar = (restriccion: RestriccionAlimentaria) => {
    setEditingId(restriccion.id);
    setFormData(restriccion);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta restricción?')) {
      await api.eliminarRestriccion(id);
      cargarRestricciones();
    }
  };

  const restriccionesFiltradas = useMemo(() => {
    return restricciones.filter((r) => {
      const matchBusqueda = !busqueda || 
        r.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.ingredientesAfectados?.some(i => i.toLowerCase().includes(busqueda.toLowerCase())) ||
        (r.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()));
      const matchTipo = filtroTipo === 'todos' || r.tipo === filtroTipo;
      const matchSeveridad = filtroSeveridad === 'todas' || r.severidad === filtroSeveridad;
      return matchBusqueda && matchTipo && matchSeveridad;
    });
  }, [restricciones, busqueda, filtroTipo, filtroSeveridad]);

  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (busqueda) count++;
    if (filtroTipo !== 'todos') count++;
    if (filtroSeveridad !== 'todas') count++;
    return count;
  }, [busqueda, filtroTipo, filtroSeveridad]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('todos');
    setFiltroSeveridad('todas');
  };

  const getTipoIcon = (tipo: TipoRestriccion) => {
    switch (tipo) {
      case 'alergia':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'intolerancia':
        return <Shield className="w-4 h-4 text-orange-500" />;
      case 'religiosa':
        return <Heart className="w-4 h-4 text-purple-500" />;
      case 'cultural':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getSeveridadBadge = (severidad: SeveridadRestriccion) => {
    const variants = {
      leve: { variant: 'green' as const, label: 'Leve' },
      moderada: { variant: 'yellow' as const, label: 'Moderada' },
      severa: { variant: 'red' as const, label: 'Severa' },
      critica: { variant: 'red' as const, label: 'Crítica' },
    };
    const config = variants[severidad];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = useMemo(
    () => [
      {
        key: 'tipo',
        label: 'Tipo',
        render: (_: any, row: RestriccionAlimentaria) => (
          <div className="flex items-center gap-2">
            {getTipoIcon(row.tipo)}
            <span className="capitalize">{row.tipo}</span>
          </div>
        ),
      },
      {
        key: 'descripcion',
        label: 'Descripción',
      },
      {
        key: 'clienteNombre',
        label: 'Cliente',
        render: (_: any, row: RestriccionAlimentaria) => row.clienteNombre || 'General',
      },
      {
        key: 'severidad',
        label: 'Severidad',
        render: (_: any, row: RestriccionAlimentaria) => getSeveridadBadge(row.severidad),
      },
      {
        key: 'activa',
        label: 'Estado',
        render: (_: any, row: RestriccionAlimentaria) => (
          <Badge variant={row.activa ? 'green' : 'gray'}>
            {row.activa ? 'Activa' : 'Inactiva'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        label: 'Acciones',
        render: (_: any, row: RestriccionAlimentaria) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditar(row)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEliminar(row.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Nueva Restricción
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por descripción, ingredientes o cliente..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="flex items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm"
              >
                Filtros
                {filtrosActivos > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                    {filtrosActivos}
                  </span>
                )}
              </Button>
              {filtrosActivos > 0 && (
                <Button variant="ghost" onClick={limpiarFiltros} size="sm">
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Restricción
                  </label>
                  <Select
                    value={filtroTipo}
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      setFiltroTipo(target.value as TipoRestriccion | 'todos');
                    }}
                    options={[
                      { value: 'todos', label: 'Todos' },
                      { value: 'alergia', label: 'Alergia' },
                      { value: 'intolerancia', label: 'Intolerancia' },
                      { value: 'religiosa', label: 'Religiosa' },
                      { value: 'cultural', label: 'Cultural' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Severidad
                  </label>
                  <Select
                    value={filtroSeveridad}
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      setFiltroSeveridad(target.value as SeveridadRestriccion | 'todas');
                    }}
                    options={[
                      { value: 'todas', label: 'Todas' },
                      { value: 'leve', label: 'Leve' },
                      { value: 'moderada', label: 'Moderada' },
                      { value: 'severa', label: 'Severa' },
                      { value: 'critica', label: 'Crítica' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{restriccionesFiltradas.length} resultado(s) encontrado(s)</span>
            {filtrosActivos > 0 && (
              <span>{filtrosActivos} filtro(s) aplicado(s)</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla de restricciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Restricciones Alimentarias
          </h2>
          <p className="text-gray-600 text-sm">
            Gestión completa de restricciones alimentarias de clientes
          </p>
        </div>
        <Table
          data={restriccionesFiltradas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay restricciones registradas"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({
            tipo: 'alergia',
            descripcion: '',
            ingredientesAfectados: [],
            severidad: 'leve',
            activa: true,
          });
        }}
        title={editingId ? 'Editar Restricción' : 'Nueva Restricción'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardar}>
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Restricción
              </label>
              <Select
                options={[
                  { value: 'alergia', label: 'Alergia' },
                  { value: 'intolerancia', label: 'Intolerancia' },
                  { value: 'religiosa', label: 'Religiosa' },
                  { value: 'cultural', label: 'Cultural' },
                ]}
                value={formData.tipo || 'alergia'}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement;
                  setFormData({ ...formData, tipo: target.value as TipoRestriccion });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Severidad
              </label>
              <Select
                options={[
                  { value: 'leve', label: 'Leve' },
                  { value: 'moderada', label: 'Moderada' },
                  { value: 'severa', label: 'Severa' },
                  { value: 'critica', label: 'Crítica' },
                ]}
                value={formData.severidad || 'leve'}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement;
                  setFormData({ ...formData, severidad: target.value as SeveridadRestriccion });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción
              </label>
              <Input
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada de la restricción"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ingredientes Afectados
              </label>
              <Input
                value={formData.ingredientesAfectados?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ingredientesAfectados: e.target.value.split(',').map((i) => i.trim()),
                  })
                }
                placeholder="Ej: cacahuetes, mariscos, gluten (separados por comas)"
                helperText="Separe los ingredientes con comas"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

