import React, { useState } from 'react';
import { Card, Button, Badge, Table, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Eye, Edit, Trash2, Plus, Calendar, TrendingUp, Filter, Target, Activity } from 'lucide-react';
import { Dieta, ObjetivoNutricional } from '../types';
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
  onCrear,
  esEntrenador = false,
}) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

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

  const dietasFiltradas = dietas.filter(dieta => {
    if (filtroEstado !== 'todos' && dieta.estado !== filtroEstado) return false;
    if (filtroTipo !== 'todos' && dieta.tipo !== filtroTipo) return false;
    return true;
  });

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
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: Dieta) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onVer(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          {onEditar && (
            <Button variant="ghost" size="sm" onClick={() => onEditar(row)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onEliminar && (
            <Button variant="ghost" size="sm" onClick={() => onEliminar(row)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        {onCrear && (
          <Button onClick={onCrear}>
            <Plus size={20} className="mr-2" />
            {esEntrenador ? 'Nueva Dieta Individual' : 'Asignar Plan Nutricional'}
          </Button>
        )}
        {!onCrear && <div />}
      </div>

      <MetricCards data={metricas} columns={3} />

      <div className="flex items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          options={estadosFiltros}
          className="w-48"
        />
        <Select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          options={tiposFiltros}
          className="w-52"
        />
        <span className="text-sm text-gray-600">
          Mostrando {dietasFiltradas.length} de {dietas.length} dietas
        </span>
      </div>

      <Table
        data={dietasFiltradas}
        columns={columns}
        loading={cargando}
        emptyMessage={
          esEntrenador
            ? 'No hay dietas asignadas a tus clientes'
            : 'No hay dietas o planes asignados'
        }
      />
    </div>
  );
};

