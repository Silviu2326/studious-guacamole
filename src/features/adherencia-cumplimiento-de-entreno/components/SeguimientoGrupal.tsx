import React, { useState } from 'react';
import { Card, Table, Badge, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Users, TrendingUp, Award, Target, Filter, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import type { SelectOption, MetricCardData } from '../../../components/componentsreutilizables';

export const SeguimientoGrupal: React.FC = () => {
  const [filtroPlan, setFiltroPlan] = useState<string>('todos');

  const planes: SelectOption[] = [
    { value: 'todos', label: 'Todos los planes' },
    { value: 'inicio', label: 'Planes Inicio' },
    { value: 'intermedio', label: 'Planes Intermedio' },
    { value: 'avanzado', label: 'Planes Avanzado' },
    { value: 'especializado', label: 'Planes Especializados' },
  ];

  const metricas: MetricCardData[] = [
    { id: '1', title: 'Seg. Promedio Total', value: '68%', trend: { value: 2.4, direction: 'up' }, icon: <Target size={24} />, color: 'info' },
    { id: '2', title: 'Participantes Activos', value: '342', trend: { value: 18, direction: 'up' }, icon: <Users size={24} />, color: 'success' },
    { id: '3', title: 'Planes en Curso', value: '12', trend: { value: 2, direction: 'up' }, icon: <Calendar size={24} />, color: 'primary' },
    { id: '4', title: 'Completados (30d)', value: '89', trend: { value: 12, direction: 'up' }, icon: <Award size={24} />, color: 'success' },
  ];

  const todosLosPlanes = [
    { id: 1, plan: 'Plan Inicio 4 Semanas', tipo: 'inicio', participantes: 120, seguimiento: 68, variacion: '+2.1%', duracion: '4 semanas', completados: 78 },
    { id: 2, plan: 'Plan Avanzado Fuerza', tipo: 'avanzado', participantes: 75, seguimiento: 61, variacion: '+0.8%', duracion: '8 semanas', completados: 46 },
    { id: 3, plan: 'Plan HIIT Intensivo', tipo: 'intermedio', participantes: 95, seguimiento: 72, variacion: '+3.2%', duracion: '6 semanas', completados: 68 },
    { id: 4, plan: 'Plan Flexibilidad y Movilidad', tipo: 'inicio', participantes: 85, seguimiento: 65, variacion: '-1.2%', duracion: '4 semanas', completados: 55 },
    { id: 5, plan: 'Plan Powerlifting', tipo: 'avanzado', participantes: 45, seguimiento: 58, variacion: '+1.5%', duracion: '12 semanas', completados: 26 },
    { id: 6, plan: 'Plan Running 10K', tipo: 'intermedio', participantes: 110, seguimiento: 74, variacion: '+4.1%', duracion: '8 semanas', completados: 81 },
    { id: 7, plan: 'Plan Cardio Quema Grasa', tipo: 'inicio', participantes: 140, seguimiento: 71, variacion: '+2.8%', duracion: '4 semanas', completados: 99 },
    { id: 8, plan: 'Plan Calistenia Avanzada', tipo: 'especializado', participantes: 60, seguimiento: 55, variacion: '-2.1%', duracion: '10 semanas', completados: 33 },
    { id: 9, plan: 'Plan Funcional Complete', tipo: 'intermedio', participantes: 98, seguimiento: 69, variacion: '+1.8%', duracion: '6 semanas', completados: 68 },
    { id: 10, plan: 'Plan Yoga y Mindfulness', tipo: 'inicio', participantes: 125, seguimiento: 66, variacion: '+0.5%', duracion: '4 semanas', completados: 83 },
  ];

  const planesFiltrados = filtroPlan === 'todos' 
    ? todosLosPlanes 
    : todosLosPlanes.filter(p => p.tipo === filtroPlan);

  const resumen = {
    total: todosLosPlanes.length,
    totalParticipantes: todosLosPlanes.reduce((sum, p) => sum + p.participantes, 0),
    promedioSeguimiento: Math.round(todosLosPlanes.reduce((sum, p) => sum + p.seguimiento, 0) / todosLosPlanes.length),
    totalCompletados: todosLosPlanes.reduce((sum, p) => sum + p.completados, 0),
    mejorPlan: todosLosPlanes.reduce((best, p) => p.seguimiento > best.seguimiento ? p : best),
  };

  const columns = [
    { key: 'plan', label: 'Plan Grupal' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'participantes', label: 'Participantes' },
    { key: 'seguimiento', label: 'Seguimiento' },
    { key: 'variacion', label: 'Variación (7d)' },
    { key: 'duracion', label: 'Duración' },
    { key: 'completados', label: 'Completados' },
    { key: 'estado', label: 'Estado' },
  ];

  const data = planesFiltrados.map(plan => ({
    ...plan,
    seguimiento: `${plan.seguimiento}%`,
    variacion: plan.variacion,
    completados: plan.completados,
    estado: plan.seguimiento >= 70
      ? <Badge variant="green"><CheckCircle size={14} className="mr-1" />Excelente</Badge>
      : plan.seguimiento >= 60 && plan.seguimiento < 70
      ? <Badge variant="blue">Buena</Badge>
      : plan.seguimiento >= 50 && plan.seguimiento < 60
      ? <Badge variant="yellow">Regular</Badge>
      : <Badge variant="red"><AlertCircle size={14} className="mr-1" />Baja</Badge>
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Seguimiento Grupal</h3>
        <p className="text-sm text-gray-600 mt-2">
          Análisis detallado de adherencia y cumplimiento en planes grupales
        </p>
      </div>

      <MetricCards data={metricas} columns={4} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Planes Activos</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumen.total}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Participantes</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resumen.totalParticipantes}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Promedio Seg.</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{resumen.promedioSeguimiento}%</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-purple-600" size={20} />
            <span className="text-sm text-gray-600">Completados</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{resumen.totalCompletados}</div>
        </Card>
      </div>

      <Card className="bg-white shadow-sm p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-3 mb-2">
          <Award className="text-green-600" size={24} />
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Mejor Plan de Seguimiento</h4>
            <p className="text-sm text-gray-600">{resumen.mejorPlan.plan} - {resumen.mejorPlan.seguimiento}% de cumplimiento</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroPlan}
          onChange={e => setFiltroPlan(e.target.value)}
          options={planes}
          className="w-64"
        />
        <span className="text-sm text-gray-600">
          Mostrando {data.length} de {resumen.total} planes
        </span>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <Table columns={columns} data={data} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo</h4>
          <div className="space-y-4">
            {['inicio', 'intermedio', 'avanzado', 'especializado'].map(tipo => {
              const planesDelTipo = todosLosPlanes.filter(p => p.tipo === tipo);
              const promedio = Math.round(planesDelTipo.reduce((sum, p) => sum + p.seguimiento, 0) / planesDelTipo.length);
              
              return (
                <div key={tipo} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 capitalize">{tipo}</span>
                    <span className="font-bold text-gray-900">{promedio}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${promedio}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Cumplimiento</h4>
          <div className="space-y-3">
            {todosLosPlanes
              .sort((a, b) => b.seguimiento - a.seguimiento)
              .slice(0, 5)
              .map(plan => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{plan.plan}</div>
                    <div className="text-xs text-gray-600">{plan.participantes} participantes</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{plan.seguimiento}%</span>
                    <span
                      className={`text-xs font-semibold ${
                        parseFloat(plan.variacion) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {plan.variacion}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};


