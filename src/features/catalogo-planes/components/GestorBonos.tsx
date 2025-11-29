import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Select, Textarea, Modal, TableWithActions, Badge, Switch, Checkbox } from '../../../components/componentsreutilizables';
import { Bono, EstadoPlan } from '../types';
import { bonosMock } from '../data/mockData';
import { Plus, Edit2, Trash2, Search, Filter, X, Copy, Archive, Power, PowerOff, Calendar, DollarSign, Users, Clock } from 'lucide-react';

interface BonoFormData {
  nombre: string;
  descripcion: string;
  numeroSesiones: number;
  precio: number;
  tiposSesiones: string[];
  fechaCaducidadOpcional?: Date;
  transferible: boolean;
  restriccionesUso?: string;
  estado: EstadoPlan;
}

const TIPOS_SESIONES_OPTIONS = [
  { value: 'pt', label: 'Entrenamiento Personal (PT)' },
  { value: 'grupal', label: 'Clase Grupal' },
  { value: 'online', label: 'Online' },
];

const ESTADO_OPTIONS: { value: EstadoPlan; label: string }[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'archivado', label: 'Archivado' },
  { value: 'borrador', label: 'Borrador' },
];

export const GestorBonos: React.FC = () => {
  const [bonos, setBonos] = useState<Bono[]>(bonosMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBono, setEditingBono] = useState<Bono | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [filterEstado, setFilterEstado] = useState<EstadoPlan | 'all'>('all');
  const [filterPrecioMin, setFilterPrecioMin] = useState<string>('');
  const [filterPrecioMax, setFilterPrecioMax] = useState<string>('');
  const [filterCaducidadDesde, setFilterCaducidadDesde] = useState<string>('');
  const [filterCaducidadHasta, setFilterCaducidadHasta] = useState<string>('');

  // Formulario
  const [formData, setFormData] = useState<BonoFormData>({
    nombre: '',
    descripcion: '',
    numeroSesiones: 0,
    precio: 0,
    tiposSesiones: [],
    fechaCaducidadOpcional: undefined,
    transferible: false,
    restriccionesUso: '',
    estado: 'activo',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BonoFormData, string>>>({});

  // Filtrar bonos
  const filteredBonos = useMemo(() => {
    let filtered = [...bonos];

    // Búsqueda por nombre
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bono =>
        bono.nombre.toLowerCase().includes(query) ||
        bono.descripcion.toLowerCase().includes(query)
      );
    }

    // Filtro por estado
    if (filterEstado !== 'all') {
      filtered = filtered.filter(bono => bono.estado === filterEstado);
    }

    // Filtro por precio
    if (filterPrecioMin) {
      const min = parseFloat(filterPrecioMin);
      if (!isNaN(min)) {
        filtered = filtered.filter(bono => bono.precio >= min);
      }
    }
    if (filterPrecioMax) {
      const max = parseFloat(filterPrecioMax);
      if (!isNaN(max)) {
        filtered = filtered.filter(bono => bono.precio <= max);
      }
    }

    // Filtro por caducidad
    if (filterCaducidadDesde) {
      const desde = new Date(filterCaducidadDesde);
      filtered = filtered.filter(bono => {
        if (!bono.fechaCaducidadOpcional) return false;
        return new Date(bono.fechaCaducidadOpcional) >= desde;
      });
    }
    if (filterCaducidadHasta) {
      const hasta = new Date(filterCaducidadHasta);
      hasta.setHours(23, 59, 59, 999); // Incluir todo el día
      filtered = filtered.filter(bono => {
        if (!bono.fechaCaducidadOpcional) return false;
        return new Date(bono.fechaCaducidadOpcional) <= hasta;
      });
    }

    return filtered;
  }, [bonos, searchQuery, filterEstado, filterPrecioMin, filterPrecioMax, filterCaducidadDesde, filterCaducidadHasta]);

  const handleOpenCreate = () => {
    setEditingBono(null);
    setFormData({
      nombre: '',
      descripcion: '',
      numeroSesiones: 0,
      precio: 0,
      tiposSesiones: [],
      fechaCaducidadOpcional: undefined,
      transferible: false,
      restriccionesUso: '',
      estado: 'activo',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bono: Bono) => {
    setEditingBono(bono);
    setFormData({
      nombre: bono.nombre,
      descripcion: bono.descripcion,
      numeroSesiones: bono.numeroSesiones,
      precio: bono.precio,
      tiposSesiones: [...bono.tiposSesiones],
      fechaCaducidadOpcional: bono.fechaCaducidadOpcional,
      transferible: bono.transferible,
      restriccionesUso: bono.restriccionesUso || '',
      estado: bono.estado,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBono(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BonoFormData, string>> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    if (formData.numeroSesiones <= 0) {
      errors.numeroSesiones = 'El número de sesiones debe ser mayor a 0';
    }
    if (formData.precio <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }
    if (formData.tiposSesiones.length === 0) {
      errors.tiposSesiones = 'Debe seleccionar al menos un tipo de sesión';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingBono) {
      // Editar bono existente
      setBonos(bonos.map(bono =>
        bono.id === editingBono.id
          ? {
              ...bono,
              ...formData,
              fechaCaducidadOpcional: formData.fechaCaducidadOpcional,
            }
          : bono
      ));
    } else {
      // Crear nuevo bono
      const nuevoBono: Bono = {
        id: `bono-${Date.now()}`,
        ...formData,
        fechaCaducidadOpcional: formData.fechaCaducidadOpcional,
      };
      setBonos([...bonos, nuevoBono]);
    }

    handleCloseModal();
  };

  const handleDelete = (bono: Bono) => {
    if (window.confirm(`¿Estás seguro de eliminar el bono "${bono.nombre}"?`)) {
      setBonos(bonos.filter(b => b.id !== bono.id));
    }
  };

  const handleToggleEstado = (bono: Bono) => {
    const nuevoEstado: EstadoPlan = bono.estado === 'activo' ? 'inactivo' : 'activo';
    setBonos(bonos.map(b =>
      b.id === bono.id ? { ...b, estado: nuevoEstado } : b
    ));
  };

  const handleArchive = (bono: Bono) => {
    if (window.confirm(`¿Estás seguro de archivar el bono "${bono.nombre}"?`)) {
      setBonos(bonos.map(b =>
        b.id === bono.id ? { ...b, estado: 'archivado' } : b
      ));
    }
  };

  const handleDuplicate = (bono: Bono) => {
    const nuevoBono: Bono = {
      ...bono,
      id: `bono-${Date.now()}`,
      nombre: `${bono.nombre} (Copia)`,
      estado: 'borrador',
    };
    setBonos([...bonos, nuevoBono]);
  };

  const handleTipoSesionChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        tiposSesiones: [...formData.tiposSesiones, tipo],
      });
    } else {
      setFormData({
        ...formData,
        tiposSesiones: formData.tiposSesiones.filter(t => t !== tipo),
      });
    }
  };

  const getEstadoBadge = (estado: EstadoPlan) => {
    const config = {
      activo: { label: 'Activo', variant: 'green' as const },
      inactivo: { label: 'Inactivo', variant: 'gray' as const },
      archivado: { label: 'Archivado', variant: 'gray' as const },
      borrador: { label: 'Borrador', variant: 'blue' as const },
    };
    const conf = config[estado] || config.activo;
    return <Badge variant={conf.variant}>{conf.label}</Badge>;
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (_: any, bono: Bono) => (
        <div>
          <div className="font-medium text-gray-900">{bono.nombre}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{bono.descripcion}</div>
        </div>
      ),
    },
    {
      key: 'numeroSesiones',
      label: 'Sesiones',
      align: 'center' as const,
      render: (_: any, bono: Bono) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{bono.numeroSesiones}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      align: 'right' as const,
      render: (_: any, bono: Bono) => (
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{bono.precio.toFixed(2)}€</span>
          </div>
        </div>
      ),
    },
    {
      key: 'fechaCaducidadOpcional',
      label: 'Caducidad',
      render: (_: any, bono: Bono) => {
        if (!bono.fechaCaducidadOpcional) {
          return <span className="text-gray-400">Sin caducidad</span>;
        }
        const fecha = new Date(bono.fechaCaducidadOpcional);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        const isVencido = diasRestantes < 0;
        const isProximo = diasRestantes >= 0 && diasRestantes <= 30;

        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <div className={`text-sm ${isVencido ? 'text-red-600' : isProximo ? 'text-yellow-600' : 'text-gray-900'}`}>
                {fecha.toLocaleDateString('es-ES')}
              </div>
              {!isVencido && (
                <div className="text-xs text-gray-500">{diasRestantes} días</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'tiposSesiones',
      label: 'Tipos de Sesión',
      render: (_: any, bono: Bono) => (
        <div className="flex flex-wrap gap-1">
          {bono.tiposSesiones.map(tipo => (
            <Badge key={tipo} variant="blue" className="text-xs">
              {TIPOS_SESIONES_OPTIONS.find(opt => opt.value === tipo)?.label || tipo}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, bono: Bono) => getEstadoBadge(bono.estado),
    },
  ];

  const getActions = (bono: Bono) => {
    const baseActions = [
      {
        label: 'Editar',
        icon: <Edit2 className="h-4 w-4" />,
        variant: 'secondary' as const,
        onClick: () => handleOpenEdit(bono),
      },
      {
        label: 'Duplicar',
        icon: <Copy className="h-4 w-4" />,
        variant: 'ghost' as const,
        onClick: () => handleDuplicate(bono),
      },
    ];

    if (bono.estado !== 'archivado') {
      baseActions.push(
        {
          label: bono.estado === 'activo' ? 'Desactivar' : 'Activar',
          icon: bono.estado === 'activo' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
          variant: 'ghost' as const,
          onClick: () => handleToggleEstado(bono),
        },
        {
          label: 'Archivar',
          icon: <Archive className="h-4 w-4" />,
          variant: 'ghost' as const,
          onClick: () => handleArchive(bono),
        }
      );
    }

    baseActions.push({
      label: 'Eliminar',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: () => handleDelete(bono),
    });

    return baseActions;
  };

  const activeFiltersCount = [
    filterEstado !== 'all',
    !!filterPrecioMin || !!filterPrecioMax,
    !!filterCaducidadDesde || !!filterCaducidadHasta,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterEstado('all');
    setFilterPrecioMin('');
    setFilterPrecioMax('');
    setFilterCaducidadDesde('');
    setFilterCaducidadHasta('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Bonos</h2>
          <p className="text-gray-600 mt-1">
            Administra los bonos y paquetes de sesiones disponibles
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Bono
        </Button>
      </div>

      {/* Búsqueda y Filtros */}
      <Card padding="md">
        <div className="space-y-4">
          {/* Búsqueda */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="blue">{activeFiltersCount}</Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Filtro por Estado */}
              <div>
                <Select
                  label="Estado"
                  options={[
                    { value: 'all', label: 'Todos los estados' },
                    ...ESTADO_OPTIONS,
                  ]}
                  value={filterEstado}
                  onChange={(value) => setFilterEstado(value as EstadoPlan | 'all')}
                />
              </div>

              {/* Filtro por Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Precio (€)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filterPrecioMin}
                    onChange={(e) => setFilterPrecioMin(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filterPrecioMax}
                    onChange={(e) => setFilterPrecioMax(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Filtro por Caducidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de Caducidad
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filterCaducidadDesde}
                    onChange={(e) => setFilterCaducidadDesde(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="date"
                    value={filterCaducidadHasta}
                    onChange={(e) => setFilterCaducidadHasta(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de Bonos */}
      <Card>
        <TableWithActions
          data={filteredBonos}
          columns={columns}
          actions={(bono) => getActions(bono)}
          emptyMessage="No hay bonos disponibles"
        />
      </Card>

      {/* Modal de Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBono ? 'Editar Bono' : 'Crear Nuevo Bono'}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingBono ? 'Guardar Cambios' : 'Crear Bono'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <Input
              label="Nombre del Bono"
              placeholder="Ej: Bono 10 Sesiones"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              error={formErrors.nombre}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <Textarea
              label="Descripción"
              placeholder="Describe el bono y sus beneficios..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              error={formErrors.descripcion}
              rows={3}
              required
            />
          </div>

          {/* Número de Sesiones y Precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Número de Sesiones"
                type="number"
                min="1"
                value={formData.numeroSesiones.toString()}
                onChange={(e) => setFormData({ ...formData, numeroSesiones: parseInt(e.target.value) || 0 })}
                error={formErrors.numeroSesiones}
                required
              />
            </div>
            <div>
              <Input
                label="Precio (€)"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio.toString()}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                error={formErrors.precio}
                required
              />
            </div>
          </div>

          {/* Tipos de Sesiones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipos de Sesiones Válidas <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {TIPOS_SESIONES_OPTIONS.map(option => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={formData.tiposSesiones.includes(option.value)}
                  onChange={(checked) => handleTipoSesionChange(option.value, checked)}
                />
              ))}
            </div>
            {formErrors.tiposSesiones && (
              <p className="text-sm text-red-600 mt-1">{formErrors.tiposSesiones}</p>
            )}
          </div>

          {/* Fecha de Caducidad */}
          <div>
            <Input
              label="Fecha de Caducidad (Opcional)"
              type="date"
              value={formData.fechaCaducidadOpcional ? new Date(formData.fechaCaducidadOpcional).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const fecha = e.target.value ? new Date(e.target.value) : undefined;
                setFormData({ ...formData, fechaCaducidadOpcional: fecha });
              }}
            />
          </div>

          {/* Transferible */}
          <div>
            <Switch
              label="Bono Transferible"
              checked={formData.transferible}
              onChange={(checked) => setFormData({ ...formData, transferible: checked })}
            />
            <p className="text-sm text-gray-500 mt-1">
              Si está activado, el bono puede ser transferido a otro cliente
            </p>
          </div>

          {/* Restricciones de Uso */}
          <div>
            <Textarea
              label="Restricciones de Uso (Opcional)"
              placeholder="Ej: Válido solo de lunes a viernes en horario de 9:00 a 20:00"
              value={formData.restriccionesUso || ''}
              onChange={(e) => setFormData({ ...formData, restriccionesUso: e.target.value })}
              rows={2}
            />
          </div>

          {/* Estado */}
          <div>
            <Select
              label="Estado"
              options={ESTADO_OPTIONS}
              value={formData.estado}
              onChange={(value) => setFormData({ ...formData, estado: value as EstadoPlan })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
