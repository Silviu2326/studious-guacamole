import React, { useState } from 'react';
import { Card, Button, Badge, Table, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Eye, TrendingUp, Users, Filter, Target, Award, Zap } from 'lucide-react';
import { PlanNutricional } from '../types';
import type { SelectOption, MetricCardData } from '../../../components/componentsreutilizables';

interface PlanesNutricionProps {
  planes: PlanNutricional[];
  cargando?: boolean;
  onVer: (plan: PlanNutricional) => void;
  onAsignar?: (plan: PlanNutricional) => void;
}

export const PlanesNutricion: React.FC<PlanesNutricionProps> = ({
  planes,
  cargando = false,
  onVer,
  onAsignar,
}) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');

  const planesFiltrados = planes.filter(plan => {
    if (filtroCategoria !== 'todos' && plan.categoria !== filtroCategoria) return false;
    if (filtroNivel !== 'todos') {
      const nivelLower = plan.nivel.toLowerCase();
      if (!nivelLower.includes(filtroNivel.toLowerCase())) return false;
    }
    return true;
  });

  const categoriasFiltros: SelectOption[] = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'perdida-grasa', label: 'Pérdida de Grasa' },
    { value: 'ganancia-muscular', label: 'Ganancia Muscular' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'rendimiento', label: 'Rendimiento' },
    { value: 'salud-general', label: 'Salud General' },
  ];

  const nivelesFiltros: SelectOption[] = [
    { value: 'todos', label: 'Todos los niveles' },
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
  ];

  const metricas: MetricCardData[] = [
    {
      id: '1',
      title: 'Total Planes',
      value: planes.length.toString(),
      icon: <Target size={24} />,
      color: 'primary',
    },
    {
      id: '2',
      title: 'Total Usos',
      value: planes.reduce((acc, p) => acc + p.usoCount, 0).toString(),
      icon: <Users size={24} />,
      color: 'success',
    },
    {
      id: '3',
      title: 'Tasa Éxito Promedio',
      value: `${Math.round(planes.filter(p => p.efectividad).reduce((acc, p) => acc + (p.efectividad?.tasaExito || 0), 0) / Math.max(1, planes.filter(p => p.efectividad).length))}%`,
      icon: <Award size={24} />,
      color: 'info',
    },
  ];
  const columns = [
    {
      key: 'nombre',
      label: 'Plan',
      render: (_: any, row: PlanNutricional) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {row.nombre}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {row.descripcion}
          </div>
        </div>
      ),
    },
    {
      key: 'nivel',
      label: 'Nivel',
      render: (_: any, row: PlanNutricional) => (
        <Badge className="bg-purple-100 text-purple-800">
          {row.nivel}
        </Badge>
      ),
    },
    {
      key: 'macros',
      label: 'Macros',
      render: (_: any, row: PlanNutricional) => (
        <div className="text-sm">
          <div className="font-semibold">{row.macros.calorias} kcal</div>
          <div className="flex gap-3 text-xs mt-1">
            <span>P: {row.macros.proteinas}g</span>
            <span>C: {row.macros.carbohidratos}g</span>
            <span>G: {row.macros.grasas}g</span>
          </div>
        </div>
      ),
    },
    {
      key: 'uso',
      label: 'Uso',
      render: (_: any, row: PlanNutricional) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span>{row.usoCount}</span>
        </div>
      ),
    },
    {
      key: 'efectividad',
      label: 'Efectividad',
      render: (_: any, row: PlanNutricional) => (
        row.efectividad ? (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>{row.efectividad.tasaExito}%</span>
          </div>
        ) : (
          <span className="text-gray-500">N/A</span>
        )
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: PlanNutricional) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onVer(row)}>
            <Eye className="w-4 h-4" />
          </Button>
          {onAsignar && (
            <Button variant="primary" size="sm" onClick={() => onAsignar(row)}>
              Asignar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={3} />

      <div className="flex items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          options={categoriasFiltros}
          className="w-64"
        />
        <Select
          value={filtroNivel}
          onChange={e => setFiltroNivel(e.target.value)}
          options={nivelesFiltros}
          className="w-52"
        />
        <span className="text-sm text-gray-600">
          Mostrando {planesFiltrados.length} de {planes.length} planes
        </span>
      </div>

      <Table
        data={planesFiltrados}
        columns={columns}
        loading={cargando}
        emptyMessage="No hay planes nutricionales disponibles"
      />
    </div>
  );
};

