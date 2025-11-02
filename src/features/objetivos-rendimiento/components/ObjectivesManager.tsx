import React, { useState, useEffect, useMemo } from 'react';
import { Objective, ObjectiveFilters } from '../types';
import { getObjectives, createObjective, updateObjective, deleteObjective } from '../api/objectives';
import { Card, Button, Table, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Target, Plus, Edit2, Trash2, Filter, X, Search, Loader2, LayoutGrid, List, TrendingUp, Calendar, BarChart3, Clock } from 'lucide-react';

interface ObjectivesManagerProps {
  role: 'entrenador' | 'gimnasio';
}

export const ObjectivesManager: React.FC<ObjectivesManagerProps> = ({ role }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [filters, setFilters] = useState<ObjectiveFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadObjectives();
  }, [filters, role]);

  const loadObjectives = async () => {
    setLoading(true);
    try {
      const data = await getObjectives(filters, role);
      setObjectives(data);
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingObjective(null);
    setIsModalOpen(true);
  };

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este objetivo?')) {
      try {
        await deleteObjective(id);
        loadObjectives();
      } catch (error) {
        console.error('Error deleting objective:', error);
      }
    }
  };

  const getStatusBadge = (status: Objective['status']) => {
    const statusConfig = {
      not_started: { label: 'No iniciado', variant: 'blue' as const },
      in_progress: { label: 'En progreso', variant: 'purple' as const },
      achieved: { label: 'Alcanzado', variant: 'green' as const },
      at_risk: { label: 'En riesgo', variant: 'yellow' as const },
      failed: { label: 'Fallido', variant: 'red' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      label: 'Objetivo',
      render: (value: string, row: Objective) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {row.description && (
            <div className="text-xs text-gray-500 mt-1">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'progress',
      label: 'Progreso',
      render: (value: number, row: Objective) => (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-900">
              {value.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">
              {row.currentValue} / {row.targetValue} {row.unit}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 100 ? 'bg-green-600' : value >= 75 ? 'bg-blue-600' : value >= 50 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: Objective['status']) => getStatusBadge(value),
    },
    {
      key: 'deadline',
      label: 'Fecha límite',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Objective) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Filtrar objetivos con búsqueda
  const filteredObjectives = useMemo(() => {
    let filtered = [...objectives];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(obj => 
        obj.title.toLowerCase().includes(query) ||
        obj.description?.toLowerCase().includes(query) ||
        obj.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [objectives, searchQuery]);

  // Agrupar por estado para Kanban
  const kanbanColumns = useMemo(() => {
    const statuses: { key: Objective['status']; label: string; color: string }[] = [
      { key: 'not_started', label: 'No Iniciado', color: 'bg-gray-100 border-gray-300' },
      { key: 'in_progress', label: 'En Progreso', color: 'bg-blue-100 border-blue-300' },
      { key: 'at_risk', label: 'En Riesgo', color: 'bg-yellow-100 border-yellow-300' },
      { key: 'achieved', label: 'Alcanzado', color: 'bg-green-100 border-green-300' },
      { key: 'failed', label: 'Fallido', color: 'bg-red-100 border-red-300' },
    ];

    return statuses.map(status => ({
      ...status,
      items: filteredObjectives.filter(obj => obj.status === status.key),
    }));
  }, [filteredObjectives]);

  // Estadísticas de objetivos
  const stats = useMemo(() => {
    const total = filteredObjectives.length;
    const achieved = filteredObjectives.filter(o => o.status === 'achieved').length;
    const inProgress = filteredObjectives.filter(o => o.status === 'in_progress').length;
    const atRisk = filteredObjectives.filter(o => o.status === 'at_risk').length;
    const avgProgress = total > 0 
      ? filteredObjectives.reduce((acc, o) => acc + o.progress, 0) / total 
      : 0;

    return { total, achieved, inProgress, atRisk, avgProgress };
  }, [filteredObjectives]);

  // Objetivos próximos a vencer
  const upcomingObjectives = useMemo(() => {
    const now = new Date();
    return filteredObjectives
      .filter(obj => {
        const deadline = new Date(obj.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30 && obj.status !== 'achieved' && obj.status !== 'failed';
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [filteredObjectives]);

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.category ? 1 : 0) + (filters.responsible ? 1 : 0);

  const handleDragStart = (e: React.DragEvent, objectiveId: string) => {
    e.dataTransfer.setData('objectiveId', objectiveId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Objective['status']) => {
    e.preventDefault();
    const objectiveId = e.dataTransfer.getData('objectiveId');
    const objective = objectives.find(obj => obj.id === objectiveId);
    
    if (objective && objective.status !== newStatus) {
      try {
        await updateObjective(objectiveId, { status: newStatus });
        loadObjectives();
      } catch (error) {
        console.error('Error updating objective status:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior mejorado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 ring-1 ring-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4 inline mr-1" />
              Kanban
            </button>
          </div>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Nuevo Objetivo
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Alcanzados</p>
              <p className="text-2xl font-bold text-green-600">{stats.achieved}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">En Riesgo</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.atRisk}</p>
            </div>
            <X className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Progreso Medio</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Sistema de Filtros mejorado */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar objetivos por título, descripción o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="blue" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setFilters({})}
                >
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados mejorado */}
          {showFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as Objective['status'] || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'not_started', label: 'No iniciado' },
                      { value: 'in_progress', label: 'En progreso' },
                      { value: 'achieved', label: 'Alcanzado' },
                      { value: 'at_risk', label: 'En riesgo' },
                      { value: 'failed', label: 'Fallido' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Target size={16} className="inline mr-1" />
                    Categoría
                  </label>
                  <Input
                    value={filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                    placeholder="financiero, operacional..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha desde
                  </label>
                  <Input
                    type="date"
                    value={filters.deadlineFrom || ''}
                    onChange={(e) => setFilters({ ...filters, deadlineFrom: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.deadlineTo || ''}
                    onChange={(e) => setFilters({ ...filters, deadlineTo: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredObjectives.length} resultado{filteredObjectives.length !== 1 ? 's' : ''} encontrado{filteredObjectives.length !== 1 ? 's' : ''}</span>
            {activeFiltersCount > 0 && (
              <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Vista Kanban o Tabla */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : viewMode === 'kanban' ? (
        <div className="space-y-6">
          {/* Vista Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {kanbanColumns.map((column) => (
              <div
                key={column.key}
                className={`rounded-lg border-2 border-dashed ${column.color} p-4 min-h-[500px]`}
                onDrop={(e) => handleDrop(e, column.key)}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.label}</h3>
                  <Badge variant="blue">{column.items.length}</Badge>
                </div>
                <div className="space-y-3">
                  {column.items.map((objective) => (
                    <Card
                      key={objective.id}
                      className="p-3 bg-white shadow-sm cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, objective.id)}
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-900">{objective.title}</h4>
                        {objective.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{objective.description}</p>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-semibold">{objective.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                objective.progress >= 100 ? 'bg-green-600' :
                                objective.progress >= 75 ? 'bg-blue-600' :
                                objective.progress >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(objective.progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{objective.currentValue} / {objective.targetValue} {objective.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(objective.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(objective)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(objective.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-50 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {column.items.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No hay objetivos en este estado
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Table
          data={filteredObjectives}
          columns={columns}
          loading={false}
          emptyMessage="No hay objetivos registrados"
        />
      )}

      {/* Objetivos próximos a vencer */}
      {upcomingObjectives.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Objetivos Próximos a Vencer</h3>
            <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {upcomingObjectives.length}
            </span>
          </div>
          <div className="space-y-2">
            {upcomingObjectives.map((objective) => {
              const deadline = new Date(objective.deadline);
              const today = new Date();
              const diffTime = deadline.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={objective.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{objective.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span>Progreso: {objective.progress.toFixed(0)}%</span>
                      <span>Vence en {diffDays} día{diffDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          objective.progress >= 75 ? 'bg-green-600' :
                          objective.progress >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(objective.progress, 100)}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleEdit(objective)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <ObjectiveModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingObjective(null);
        }}
        onSave={loadObjectives}
        objective={editingObjective}
        role={role}
      />
    </div>
  );
};

interface ObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  objective?: Objective | null;
  role: 'entrenador' | 'gimnasio';
}

const ObjectiveModal: React.FC<ObjectiveModalProps> = ({ isOpen, onClose, onSave, objective, role }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    metric: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    deadline: '',
    category: '',
  });

  useEffect(() => {
    if (objective) {
      setFormData({
        title: objective.title,
        description: objective.description || '',
        metric: objective.metric,
        targetValue: objective.targetValue.toString(),
        currentValue: objective.currentValue.toString(),
        unit: objective.unit,
        deadline: objective.deadline,
        category: objective.category,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        metric: '',
        targetValue: '',
        currentValue: '',
        unit: '',
        deadline: '',
        category: '',
      });
    }
  }, [objective, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (objective) {
        await updateObjective(objective.id, {
          ...formData,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
        });
      } else {
        await createObjective({
          ...formData,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
          status: 'not_started',
          category: formData.category || 'general',
        } as any);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving objective:', error);
      alert('Error al guardar el objetivo');
    }
  };

  const metricOptions = role === 'entrenador'
    ? [
        { value: 'facturacion', label: 'Facturación Personal' },
        { value: 'adherencia', label: 'Adherencia de Clientes' },
        { value: 'retencion', label: 'Retención de Clientes' },
      ]
    : [
        { value: 'facturacion', label: 'Facturación Total' },
        { value: 'ocupacion', label: 'Ocupación Media' },
        { value: 'tasa_bajas', label: 'Tasa de Bajas' },
        { value: 'objetivos_comerciales', label: 'Objetivos Comerciales' },
      ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={objective ? 'Editar Objetivo' : 'Nuevo Objetivo'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Select
          label="Métrica"
          value={formData.metric}
          onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
          options={metricOptions}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor Objetivo"
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
            required
          />
          <Input
            label="Valor Actual"
            type="number"
            value={formData.currentValue}
            onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unidad"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="€, %, clientes..."
            required
          />
          <Input
            label="Fecha Límite"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>
        <Input
          label="Categoría"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="financiero, operacional..."
        />
      </form>
    </Modal>
  );
};

