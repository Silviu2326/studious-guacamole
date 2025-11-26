import React, { useState, useMemo } from 'react';
import { Card, Button, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Plan, UserRole } from '../types';
import { PlanCard } from './PlanCard';
import { Plus, Search, Filter, Grid3X3, List, ChevronDown, ChevronUp, X, Package } from 'lucide-react';

interface CatalogoPlanesProps {
  userType: UserRole;
  planes: Plan[];
  onSelectPlan: (plan: Plan) => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  onCreatePlan: () => void;
}

export const CatalogoPlanes: React.FC<CatalogoPlanesProps> = ({
  userType,
  planes,
  onSelectPlan,
  onEditPlan,
  onDeletePlan,
  onCreatePlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const filteredAndSortedPlanes = useMemo(() => {
    let filtered = planes.filter(plan => {
      // Filtrar por tipo según el rol del usuario
      const typeMatch = userType === 'entrenador' 
        ? plan.tipo === 'bono_pt' 
        : plan.tipo === 'cuota_gimnasio';
      
      // Filtrar por término de búsqueda
      const searchMatch = plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por estado
      const statusMatch = filterStatus === 'all' || 
                         (filterStatus === 'active' && plan.activo) ||
                         (filterStatus === 'inactive' && !plan.activo);
      
      return typeMatch && searchMatch && statusMatch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre);
        case 'price':
          const priceA = a.precio.base * (1 - a.precio.descuento / 100);
          const priceB = b.precio.base * (1 - b.precio.descuento / 100);
          return priceA - priceB;
        case 'date':
          return new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [planes, userType, searchTerm, filterStatus, sortBy]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan.id);
    onSelectPlan(plan);
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'price', label: 'Precio' },
    { value: 'date', label: 'Fecha de actualización' }
  ];

  const getEmptyMessage = () => {
    return userType === 'entrenador'
      ? 'No hay bonos disponibles. Crea tu primer bono para comenzar.'
      : 'No hay membresías disponibles. Crea tu primera membresía para comenzar.';
  };

  const getCreateButtonText = () => {
    return userType === 'entrenador' ? 'Crear Nuevo Bono' : 'Crear Nueva Membresía';
  };

  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterStatus !== 'all') count++;
    return count;
  }, [searchTerm, filterStatus]);

  const precioPromedio = useMemo(() => {
    if (planes.length === 0) return 0;
    return Math.round(
      planes.reduce((acc, p) => acc + p.precio.base * (1 - p.precio.descuento / 100), 0) / planes.length
    );
  }, [planes]);

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={onCreatePlan}>
          <Plus size={20} className="mr-2" />
          {getCreateButtonText()}
        </Button>
      </div>

      {/* KPIs de catálogo */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: userType === 'entrenador' ? 'Bonos totales' : 'Membresías totales',
            value: planes.length,
            color: 'info',
          },
          {
            id: 'activos',
            title: 'Activos',
            value: planes.filter(p => p.activo).length,
            color: 'success',
          },
          {
            id: 'inactivos',
            title: 'Inactivos',
            value: planes.filter(p => !p.activo).length,
            color: 'error',
          },
          {
            id: 'precio-promedio',
            title: 'Precio promedio',
            value: `${precioPromedio}€`,
            color: 'warning',
          },
        ]}
      />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Buscar ${userType === 'entrenador' ? 'bonos' : 'membresías'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="flex items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm"
              >
                <Filter size={16} />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>

              {filtrosActivos > 0 && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="ghost"
                >
                  <X size={16} className="mr-1" />
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
                    Estado
                  </label>
                  <Select
                    options={statusOptions}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive')}
                    placeholder="Todos los estados"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredAndSortedPlanes.length} resultados encontrados</span>
            {filtrosActivos > 0 && <span>{filtrosActivos} filtros aplicados</span>}
          </div>
        </div>
      </Card>

      {/* Controles de vista y ordenamiento */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'name' | 'price' | 'date')}
              placeholder="Ordenar por"
            />
          </div>
        </div>
      </Card>

      {/* Grid/Lista de planes */}
      {filteredAndSortedPlanes.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron resultados'
              : userType === 'entrenador' 
                ? 'No hay bonos disponibles'
                : 'No hay membresías disponibles'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : getEmptyMessage()
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button variant="primary" onClick={onCreatePlan}>
              {getCreateButtonText()}
            </Button>
          )}
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedPlanes.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              userType={userType}
              onSelect={handleSelectPlan}
              onEdit={onEditPlan}
              onDelete={onDeletePlan}
              isSelected={selectedPlan === plan.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};