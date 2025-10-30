import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Plan, UserRole } from '../types';
import { PlanCard } from './PlanCard';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';

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

  const getTitle = () => {
    return userType === 'entrenador' 
      ? 'Catálogo de Bonos PT' 
      : 'Catálogo de Membresías';
  };

  const getEmptyMessage = () => {
    return userType === 'entrenador'
      ? 'No hay bonos disponibles. Crea tu primer bono para comenzar.'
      : 'No hay membresías disponibles. Crea tu primera membresía para comenzar.';
  };

  const getCreateButtonText = () => {
    return userType === 'entrenador' ? 'Crear Nuevo Bono' : 'Crear Nueva Membresía';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {userType === 'entrenador' 
              ? 'Gestiona tus bonos de entrenamiento personalizado'
              : 'Gestiona las membresías de tu gimnasio'
            }
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={onCreatePlan}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{getCreateButtonText()}</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Buscar ${userType === 'entrenador' ? 'bonos' : 'membresías'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive')}
              placeholder="Estado"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'name' | 'price' | 'date')}
              placeholder="Ordenar por"
            />
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{planes.length}</div>
            <div className="text-sm text-gray-600">
              {userType === 'entrenador' ? 'Bonos totales' : 'Membresías totales'}
            </div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {planes.filter(p => p.activo).length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {planes.filter(p => !p.activo).length}
            </div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
        </Card>
        
        <Card padding="md">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round(planes.reduce((acc, p) => acc + p.precio.base * (1 - p.precio.descuento / 100), 0) / planes.length || 0)}€
            </div>
            <div className="text-sm text-gray-600">Precio promedio</div>
          </div>
        </Card>
      </div>

      {/* Lista de planes */}
      {filteredAndSortedPlanes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No se encontraron resultados</p>
            <p className="text-sm mt-2">
              {searchTerm || filterStatus !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : getEmptyMessage()
              }
            </p>
          </div>
          {!searchTerm && filterStatus === 'all' && (
            <Button variant="primary" onClick={onCreatePlan}>
              {getCreateButtonText()}
            </Button>
          )}
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
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