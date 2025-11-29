import React, { useState, useMemo } from 'react';
import { Card, Button, Select, MetricCards, Checkbox, Badge, Modal } from '../../../components/componentsreutilizables';
import { Plan, TipoPlan, EstadoPlan } from '../types';
import { PlanCard } from './PlanCard';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Package, 
  Copy, 
  Archive,
  CheckSquare,
  Square,
  GitCompare,
  AlertCircle,
  Check
} from 'lucide-react';

interface CatalogoPlanesProps {
  planes: Plan[];
  onSelectPlan?: (plan: Plan) => void;
  onEditPlan?: (plan: Plan) => void;
  onDeletePlan?: (planId: string) => void;
  onCreatePlan?: () => void;
  onDuplicatePlan?: (plan: Plan) => void;
  onArchivePlans?: (planIds: string[]) => void;
  onArchivePlan?: (plan: Plan) => void;
  onToggleEstadoPlan?: (plan: Plan) => void;
  onViewDetailsPlan?: (plan: Plan) => void;
}

type SortOption = 'precio' | 'popularidad' | 'fecha' | 'nombre';

export const CatalogoPlanes: React.FC<CatalogoPlanesProps> = ({
  planes,
  onSelectPlan,
  onEditPlan,
  onDeletePlan,
  onCreatePlan,
  onDuplicatePlan,
  onArchivePlans,
  onArchivePlan,
  onToggleEstadoPlan,
  onViewDetailsPlan
}) => {
  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<TipoPlan | 'all'>('all');
  const [filterEstado, setFilterEstado] = useState<EstadoPlan | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nombre');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  
  // Estados de selección
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  
  // Configuración de comparación
  const MAX_PLANS_TO_COMPARE = 3;
  const ENABLE_COMPARISON = true; // Flag para activar/desactivar fácilmente

  // Opciones de filtros
  const tipoOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'suscripcion', label: 'Suscripción' },
    { value: 'bono', label: 'Bono' },
    { value: 'paquete', label: 'Paquete' },
    { value: 'pt', label: 'PT' },
    { value: 'grupal', label: 'Grupal' }
  ];

  const estadoOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'archivado', label: 'Archivado' },
    { value: 'borrador', label: 'Borrador' }
  ];

  const sortOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' },
    { value: 'popularidad', label: 'Popularidad' },
    { value: 'fecha', label: 'Fecha de creación' }
  ];

  // Filtrar y ordenar planes
  const filteredAndSortedPlanes = useMemo(() => {
    let filtered = planes.filter(plan => {
      // Filtrar por término de búsqueda (nombre y descripción)
      const searchMatch = !searchTerm || 
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por tipo
      const tipoMatch = filterTipo === 'all' || plan.tipo === filterTipo;
      
      // Filtrar por estado
      const estadoMatch = filterEstado === 'all' || plan.estado === filterEstado;
      
      return searchMatch && tipoMatch && estadoMatch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          const priceA = a.precioBase || (a.precio?.base ?? 0);
          const priceB = b.precioBase || (b.precio?.base ?? 0);
          return priceA - priceB;
        case 'popularidad':
          // Ordenar por: esPopular > esRecomendado > esNuevo > resto
          const popularA = (a.esPopular ? 3 : 0) + (a.esRecomendado ? 2 : 0) + (a.esNuevo ? 1 : 0);
          const popularB = (b.esPopular ? 3 : 0) + (b.esRecomendado ? 2 : 0) + (b.esNuevo ? 1 : 0);
          if (popularA !== popularB) return popularB - popularA;
          // Si tienen la misma popularidad, ordenar por fecha
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'fecha':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [planes, searchTerm, filterTipo, filterEstado, sortBy]);

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterTipo !== 'all') count++;
    if (filterEstado !== 'all') count++;
    return count;
  }, [searchTerm, filterTipo, filterEstado]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const activos = planes.filter(p => p.estado === 'activo').length;
    const inactivos = planes.filter(p => p.estado === 'inactivo').length;
    const archivados = planes.filter(p => p.estado === 'archivado').length;
    const precioPromedio = planes.length > 0
      ? Math.round(
          planes.reduce((acc, p) => {
            const precio = p.precioBase || p.precio?.base || 0;
            return acc + precio;
          }, 0) / planes.length
        )
      : 0;

    return { activos, inactivos, archivados, precioPromedio };
  }, [planes]);

  // Manejo de selección
  const handleToggleSelect = (planId: string) => {
    const newSelected = new Set(selectedPlans);
    if (newSelected.has(planId)) {
      newSelected.delete(planId);
      setComparisonError(null);
    } else {
      // Validar límite máximo para comparación
      if (ENABLE_COMPARISON && newSelected.size >= MAX_PLANS_TO_COMPARE) {
        setComparisonError(`Solo puedes comparar hasta ${MAX_PLANS_TO_COMPARE} planes a la vez.`);
        return;
      }
      newSelected.add(planId);
      setComparisonError(null);
    }
    setSelectedPlans(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPlans.size === filteredAndSortedPlanes.length) {
      setSelectedPlans(new Set());
      setComparisonError(null);
    } else {
      if (ENABLE_COMPARISON && filteredAndSortedPlanes.length > MAX_PLANS_TO_COMPARE) {
        // Si hay más planes que el máximo, seleccionar solo los primeros MAX_PLANS_TO_COMPARE
        const limitedPlans = filteredAndSortedPlanes.slice(0, MAX_PLANS_TO_COMPARE);
        setSelectedPlans(new Set(limitedPlans.map(p => p.id)));
        setComparisonError(`Solo se han seleccionado los primeros ${MAX_PLANS_TO_COMPARE} planes para comparar.`);
      } else {
        setSelectedPlans(new Set(filteredAndSortedPlanes.map(p => p.id)));
        setComparisonError(null);
      }
    }
  };

  const handleDuplicateSelected = () => {
    if (selectedPlans.size === 1 && onDuplicatePlan) {
      const plan = planes.find(p => p.id === Array.from(selectedPlans)[0]);
      if (plan) {
        onDuplicatePlan(plan);
        setSelectedPlans(new Set());
        setIsSelectMode(false);
      }
    }
  };

  const handleArchiveSelected = () => {
    if (selectedPlans.size > 0 && onArchivePlans) {
      onArchivePlans(Array.from(selectedPlans));
      setSelectedPlans(new Set());
      setIsSelectMode(false);
    }
  };

  const handleComparePlans = () => {
    if (selectedPlans.size < 2) {
      setComparisonError('Selecciona al menos 2 planes para comparar.');
      return;
    }
    if (selectedPlans.size > MAX_PLANS_TO_COMPARE) {
      setComparisonError(`Solo puedes comparar hasta ${MAX_PLANS_TO_COMPARE} planes a la vez.`);
      return;
    }
    setComparisonError(null);
    setShowComparisonModal(true);
  };

  // Obtener planes seleccionados para comparación
  const selectedPlansForComparison = useMemo(() => {
    return planes.filter(plan => selectedPlans.has(plan.id));
  }, [planes, selectedPlans]);

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterTipo('all');
    setFilterEstado('all');
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior con acciones globales */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isSelectMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedPlans(new Set());
                }}
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-sm text-gray-600">
                {selectedPlans.size} {selectedPlans.size === 1 ? 'plan seleccionado' : 'planes seleccionados'}
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {isSelectMode ? (
            <>
              {ENABLE_COMPARISON && selectedPlans.size >= 2 && selectedPlans.size <= MAX_PLANS_TO_COMPARE && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleComparePlans}
                >
                  <GitCompare size={16} className="mr-2" />
                  Comparar planes ({selectedPlans.size})
                </Button>
              )}
              {selectedPlans.size === 1 && onDuplicatePlan && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDuplicateSelected}
                >
                  <Copy size={16} className="mr-2" />
                  Duplicar
                </Button>
              )}
              {selectedPlans.size > 0 && onArchivePlans && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleArchiveSelected}
                >
                  <Archive size={16} className="mr-2" />
                  Archivar ({selectedPlans.size})
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSelectMode(true)}
              >
                <CheckSquare size={16} className="mr-2" />
                Seleccionar
              </Button>
              {onCreatePlan && (
                <Button onClick={onCreatePlan}>
                  <Plus size={16} className="mr-2" />
                  Crear plan
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* KPIs de catálogo */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Planes totales',
            value: planes.length,
            color: 'info',
          },
          {
            id: 'activos',
            title: 'Activos',
            value: estadisticas.activos,
            color: 'success',
          },
          {
            id: 'inactivos',
            title: 'Inactivos',
            value: estadisticas.inactivos,
            color: 'error',
          },
          {
            id: 'precio-promedio',
            title: 'Precio promedio',
            value: `${estadisticas.precioPromedio}€`,
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
                    placeholder="Buscar planes por nombre o descripción..."
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
                  <Badge variant="blue" size="sm" className="ml-1">
                    {filtrosActivos}
                  </Badge>
                )}
                {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>

              {filtrosActivos > 0 && (
                <Button
                  onClick={limpiarFiltros}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="ghost"
                  size="sm"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de plan
                  </label>
                  <Select
                    options={tipoOptions}
                    value={filterTipo}
                    onChange={(value) => setFilterTipo(value as TipoPlan | 'all')}
                    placeholder="Todos los tipos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <Select
                    options={estadoOptions}
                    value={filterEstado}
                    onChange={(value) => setFilterEstado(value as EstadoPlan | 'all')}
                    placeholder="Todos los estados"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {filteredAndSortedPlanes.length} {filteredAndSortedPlanes.length === 1 ? 'plan encontrado' : 'planes encontrados'}
            </span>
            {filtrosActivos > 0 && (
              <span className="text-blue-600 font-medium">
                {filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}
              </span>
            )}
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
              onChange={(value) => setSortBy(value as SortOption)}
              placeholder="Ordenar por"
            />
          </div>
        </div>
      </Card>

      {/* Modo selección - Checkbox para seleccionar todos */}
      {isSelectMode && filteredAndSortedPlanes.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedPlans.size === filteredAndSortedPlanes.length && filteredAndSortedPlanes.length > 0}
              onChange={handleSelectAll}
              label="Seleccionar todos"
            />
            {ENABLE_COMPARISON && (
              <span className="text-sm text-gray-600 ml-auto">
                Máximo {MAX_PLANS_TO_COMPARE} planes para comparar
              </span>
            )}
          </div>
          {comparisonError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              <AlertCircle size={16} />
              <span>{comparisonError}</span>
            </div>
          )}
        </Card>
      )}

      {/* Grid/Lista de planes */}
      {filteredAndSortedPlanes.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filtrosActivos > 0 
              ? 'No se encontraron planes'
              : 'No hay planes disponibles'
            }
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {filtrosActivos > 0 
              ? 'Intenta ajustar los filtros de búsqueda o limpiar los filtros activos para ver más resultados.'
              : 'Comienza creando tu primer plan para construir tu catálogo de ofertas.'
            }
          </p>
          {filtrosActivos > 0 ? (
            <Button variant="secondary" onClick={limpiarFiltros}>
              <X size={16} className="mr-2" />
              Limpiar filtros
            </Button>
          ) : (
            onCreatePlan && (
              <Button onClick={onCreatePlan}>
                <Plus size={16} className="mr-2" />
                Crear primer plan
              </Button>
            )
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
              onSelect={onSelectPlan}
              onEdit={onEditPlan}
              onDelete={onDeletePlan}
              onDuplicate={onDuplicatePlan}
              onToggleEstado={onToggleEstadoPlan}
              onArchive={onArchivePlan}
              onViewDetails={onViewDetailsPlan}
              viewMode={viewMode}
              isSelectMode={isSelectMode}
              isSelected={selectedPlans.has(plan.id)}
              onToggleSelect={() => handleToggleSelect(plan.id)}
            />
          ))}
        </div>
      )}

      {/* Modal de comparación de planes */}
      {ENABLE_COMPARISON && (
        <Modal
          isOpen={showComparisonModal}
          onClose={() => {
            setShowComparisonModal(false);
            setComparisonError(null);
          }}
          title="Comparar planes"
          size="xl"
          footer={
            <Button
              variant="secondary"
              onClick={() => {
                setShowComparisonModal(false);
                setComparisonError(null);
              }}
            >
              Cerrar
            </Button>
          }
        >
          <PlansComparisonTable plans={selectedPlansForComparison} />
        </Modal>
      )}
    </div>
  );
};

// Componente de tabla de comparación
const PlansComparisonTable: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  const tipoLabels: Record<TipoPlan, string> = {
    suscripcion: 'Suscripción',
    bono: 'Bono',
    paquete: 'Paquete',
    pt: 'PT',
    grupal: 'Grupal'
  };

  const periodicidadLabels: Record<string, string> = {
    mensual: '/mes',
    trimestral: '/trimestre',
    anual: '/año',
    puntual: 'único'
  };

  // Obtener todas las características únicas de todos los planes
  const allCharacteristics = useMemo(() => {
    const charMap = new Map<string, { label: string; destacado: boolean }>();
    plans.forEach(plan => {
      plan.caracteristicas?.forEach(char => {
        if (!charMap.has(char.id)) {
          charMap.set(char.id, {
            label: char.label,
            destacado: char.destacadoOpcional || false
          });
        }
      });
    });
    return Array.from(charMap.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }, [plans]);

  // Obtener todos los beneficios únicos
  const allBenefits = useMemo(() => {
    const benefitsSet = new Set<string>();
    plans.forEach(plan => {
      plan.beneficiosAdicionales?.forEach(benefit => {
        benefitsSet.add(benefit);
      });
    });
    return Array.from(benefitsSet);
  }, [plans]);

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay planes seleccionados para comparar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">
              Característica
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className="text-center p-3 font-semibold text-gray-700 bg-gray-50 min-w-[200px]"
              >
                <div className="space-y-1">
                  <div className="font-bold text-lg">{plan.nombre}</div>
                  <Badge variant="gray" size="sm" className="capitalize">
                    {tipoLabels[plan.tipo]}
                  </Badge>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Precio */}
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
              Precio
            </td>
            {plans.map((plan) => {
              const precioBase = plan.precioBase || plan.precio?.base || 0;
              const descuento = plan.precio?.descuento || 0;
              const precioFinal = precioBase * (1 - descuento / 100);
              const moneda = plan.moneda || plan.precio?.moneda || 'EUR';
              return (
                <td key={plan.id} className="p-3 text-center">
                  <div className="space-y-1">
                    {descuento > 0 && (
                      <div className="text-xs text-gray-500 line-through">
                        {precioBase.toFixed(2)} {moneda}
                      </div>
                    )}
                    <div className="text-lg font-bold text-gray-900">
                      {precioFinal.toFixed(2)} {moneda}
                    </div>
                    {periodicidadLabels[plan.periodicidad] && (
                      <div className="text-xs text-gray-500">
                        {periodicidadLabels[plan.periodicidad]}
                      </div>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* Periodicidad */}
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
              Periodicidad
            </td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center text-gray-700 capitalize">
                {plan.periodicidad}
              </td>
            ))}
          </tr>

          {/* Número de sesiones */}
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
              Sesiones incluidas
            </td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center text-gray-700">
                {plan.sesionesIncluidasOpcional || plan.sesiones || '-'}
              </td>
            ))}
          </tr>

          {/* Tipo */}
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
              Tipo
            </td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                <Badge variant="gray" size="sm" className="capitalize">
                  {tipoLabels[plan.tipo]}
                </Badge>
              </td>
            ))}
          </tr>

          {/* Características */}
          {allCharacteristics.length > 0 && (
            <>
              <tr className="border-b-2 border-gray-200">
                <td
                  colSpan={plans.length + 1}
                  className="p-3 font-semibold text-gray-800 bg-gray-100"
                >
                  Características principales
                </td>
              </tr>
              {allCharacteristics.map((char) => (
                <tr key={char.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-700 bg-gray-50 sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      <span>{char.label}</span>
                      {char.destacado && (
                        <Badge variant="yellow" size="sm">
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </td>
                  {plans.map((plan) => {
                    const hasChar = plan.caracteristicas?.some(c => c.id === char.id);
                    return (
                      <td key={plan.id} className="p-3 text-center">
                        {hasChar ? (
                          <Check size={20} className="text-green-600 mx-auto" />
                        ) : (
                          <X size={20} className="text-gray-300 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          )}

          {/* Beneficios adicionales */}
          {allBenefits.length > 0 && (
            <>
              <tr className="border-b-2 border-gray-200">
                <td
                  colSpan={plans.length + 1}
                  className="p-3 font-semibold text-gray-800 bg-gray-100"
                >
                  Beneficios adicionales
                </td>
              </tr>
              {allBenefits.map((benefit, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-700 bg-gray-50 sticky left-0 z-10">
                    {benefit}
                  </td>
                  {plans.map((plan) => {
                    const hasBenefit = plan.beneficiosAdicionales?.includes(benefit);
                    return (
                      <td key={plan.id} className="p-3 text-center">
                        {hasBenefit ? (
                          <Check size={20} className="text-green-600 mx-auto" />
                        ) : (
                          <X size={20} className="text-gray-300 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          )}

          {/* Estado */}
          <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
              Estado
            </td>
            {plans.map((plan) => {
              const estadoConfig: Record<EstadoPlan, { label: string; variant: 'success' | 'error' | 'secondary' | 'yellow' }> = {
                activo: { label: 'Activo', variant: 'success' },
                inactivo: { label: 'Inactivo', variant: 'error' },
                archivado: { label: 'Archivado', variant: 'secondary' },
                borrador: { label: 'Borrador', variant: 'yellow' }
              };
              const estadoInfo = estadoConfig[plan.estado];
              return (
                <td key={plan.id} className="p-3 text-center">
                  <Badge variant={estadoInfo.variant} size="sm">
                    {estadoInfo.label}
                  </Badge>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
