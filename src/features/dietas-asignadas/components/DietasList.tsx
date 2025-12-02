import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Select, MetricCards, TableWithActions } from '../../../components/componentsreutilizables';
import { Eye, Edit, Trash2, Calendar, TrendingUp, Search, X, User, Layout, Target, Activity } from 'lucide-react';
import { Dieta } from '../types';
import type { SelectOption, MetricCardData } from '../../../components/componentsreutilizables';

interface DietasListProps {
  dietas: Dieta[];
  cargando?: boolean;
  onVer: (dieta: Dieta) => void;
  onEditar?: (dieta: Dieta) => void;
  onEliminar?: (dieta: Dieta) => void;
  onCrear?: () => void;
  esEntrenador?: boolean;
}

export const DietasList: React.FC<DietasListProps> = ({
  dietas,
  cargando = false,
  onVer,
  onEditar,
  onEliminar,
  onCrear, // Kept for interface compatibility
  esEntrenador = false,
}) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'pausada':
        return 'bg-yellow-100 text-yellow-800';
      case 'finalizada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return 'Individual';
      case 'plan-estandar':
        return 'Plan Estándar';
      case 'pack-semanal':
        return 'Pack Semanal';
      default:
        return tipo;
    }
  };

  const dietasFiltradas = useMemo(() => {
    return dietas.filter(dieta => {
      if (filtroEstado !== 'todos' && dieta.estado !== filtroEstado) return false;
      if (filtroTipo !== 'todos' && dieta.tipo !== filtroTipo) return false;
      if (busqueda) {
        const searchLower = busqueda.toLowerCase();
        const matchesName = dieta.nombre.toLowerCase().includes(searchLower);
        const matchesClient = dieta.clienteNombre?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesClient) return false;
      }
      return true;
    });
  }, [dietas, filtroEstado, filtroTipo, busqueda]);

  const hasFiltrosActivos = busqueda || filtroEstado !== 'todos' || filtroTipo !== 'todos';
  const filtrosActivosCount = [
    busqueda, 
    filtroEstado !== 'todos' ? filtroEstado : null, 
    filtroTipo !== 'todos' ? filtroTipo : null
  ].filter(Boolean).length;

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todos');
    setFiltroTipo('todos');
  };

  const estadosFiltros: SelectOption[] = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activa', label: 'Activas' },
    { value: 'pausada', label: 'Pausadas' },
    { value: 'finalizada', label: 'Finalizadas' },
  ];

  const tiposFiltros: SelectOption[] = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'individual', label: 'Individual' },
    { value: 'plan-estandar', label: 'Plan Estándar' },
    { value: 'pack-semanal', label: 'Pack Semanal' },
  ];

  const metricas: MetricCardData[] = [
    {
      id: '1',
      title: 'Total Dietas',
      value: dietas.length.toString(),
      icon: <Target size={24} />,
      color: 'primary',
    },
    {
      id: '2',
      title: 'Dietas Activas',
      value: dietas.filter(d => d.estado === 'activa').length.toString(),
      icon: <Activity size={24} />,
      color: 'success',
    },
    {
      id: '3',
      title: 'Adherencia Promedio',
      value: `${Math.round(dietas.filter(d => d.adherencia !== undefined).reduce((acc, d) => acc + (d.adherencia || 0), 0) / Math.max(1, dietas.filter(d => d.adherencia !== undefined).length))}%`,
      icon: <TrendingUp size={24} />,
      color: 'info',
    },
  ];

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (_: any, row: Dieta) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {row.nombre}
          </div>
          {row.clienteNombre && (
            <div className="text-sm text-gray-600 mt-1">
              {row.clienteNombre}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_: any, row: Dieta) => (
        <Badge className="bg-blue-100 text-blue-800">
          {getTipoLabel(row.tipo)}
        </Badge>
      ),
    },
    {
      key: 'macros',
      label: 'Macros',
      render: (_: any, row: Dieta) => (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {row.macros.calorias} kcal
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>P: {row.macros.proteinas}g</span>
            <span>C: {row.macros.carbohidratos}g</span>
            <span>G: {row.macros.grasas}g</span>
          </div>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Dieta) => (
        <Badge className={getEstadoColor(row.estado)}>
          {row.estado}
        </Badge>
      ),
    },
    {
      key: 'adherencia',
      label: 'Adherencia',
      render: (_: any, row: Dieta) => (
        <div className="flex items-center gap-2">
          {row.adherencia !== undefined ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-gray-900">{row.adherencia}%</span>
            </>
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (_: any, row: Dieta) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{new Date(row.fechaInicio).toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={3} />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar dietas o clientes..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              {hasFiltrosActivos && (
                <Button variant="ghost" onClick={limpiarFiltros} leftIcon={<X className="h-3.5 w-3.5" />} size="sm">
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Activity size={16} className="inline mr-1" />
                  Estado
                </label>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  options={estadosFiltros}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Layout size={16} className="inline mr-1" />
                  Tipo
                </label>
                <Select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  options={tiposFiltros}
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            {dietasFiltradas.length > 0 && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{dietasFiltradas.length} resultados encontrados</span>
                {filtrosActivosCount > 0 && (
                  <span>{filtrosActivosCount} filtros aplicados</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      <TableWithActions
        data={dietasFiltradas}
        columns={columns}
        loading={cargando}
        emptyMessage={
          esEntrenador
            ? 'No hay dietas asignadas a tus clientes'
            : 'No hay dietas o planes asignados'
        }
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onVer(row)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Ver
            </Button>
            {onEditar && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEditar(row)}
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Editar
              </Button>
            )}
            {onEliminar && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEliminar(row)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
};

