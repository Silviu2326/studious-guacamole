import React, { useState } from 'react';
import { Card, Table, Badge, Select, MetricCards } from '../../../components/componentsreutilizables';
import { Users, Calendar, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Filter, BarChart3 } from 'lucide-react';
import type { SelectOption, MetricCardData } from '../../../components/componentsreutilizables';

export const OcupacionClase: React.FC = () => {
  const [periodo, setPeriodo] = useState<string>('semanal');
  const [filtroOcupacion, setFiltroOcupacion] = useState<string>('todas');

  const periodos: SelectOption[] = [
    { value: 'diario', label: 'Vista Diaria' },
    { value: 'semanal', label: 'Vista Semanal' },
    { value: 'mensual', label: 'Vista Mensual' },
  ];

  const filtros: SelectOption[] = [
    { value: 'todas', label: 'Todas las clases' },
    { value: 'alta', label: 'Alta ocupación (>80%)' },
    { value: 'baja', label: 'Baja ocupación (<60%)' },
    { value: 'optima', label: 'Óptima (60-80%)' },
  ];

  const metricas: MetricCardData[] = [
    { id: '1', title: 'Ocupación Promedio', value: '72%', trend: { value: 1.1, direction: 'up' }, icon: <BarChart3 size={24} />, color: 'info' },
    { id: '2', title: 'Clases Activas', value: '48', trend: { value: 3, direction: 'up' }, icon: <Calendar size={24} />, color: 'success' },
    { id: '3', title: 'Puntos Saturados', value: '8', trend: { value: 2, direction: 'up' }, icon: <AlertCircle size={24} />, color: 'error' },
    { id: '4', title: 'Clases Mejorando', value: '12', trend: { value: 5, direction: 'up' }, icon: <TrendingUp size={24} />, color: 'success' },
  ];

  const todasLasClases = [
    { id: 1, clase: 'HIIT Intensivo', dia: 'Lunes', hora: '18:00', plazas: 20, asistentes: 18, ocupacion: 90, tendencia: '+5.2%' },
    { id: 2, clase: 'Yoga Restaurativo', dia: 'Martes', hora: '19:00', plazas: 25, asistentes: 24, ocupacion: 96, tendencia: '+3.1%' },
    { id: 3, clase: 'Cross Training', dia: 'Miércoles', hora: '18:00', plazas: 20, asistentes: 16, ocupacion: 80, tendencia: '-2.3%' },
    { id: 4, clase: 'Pilates Mat', dia: 'Jueves', hora: '09:00', plazas: 15, asistentes: 9, ocupacion: 60, tendencia: '-8.5%' },
    { id: 5, clase: 'Zumba Fitness', dia: 'Viernes', hora: '19:00', plazas: 30, asistentes: 28, ocupacion: 93, tendencia: '+1.2%' },
    { id: 6, clase: 'TRX Training', dia: 'Lunes', hora: '10:00', plazas: 12, asistentes: 12, ocupacion: 100, tendencia: '0%' },
    { id: 7, clase: 'Spinning', dia: 'Martes', hora: '18:00', plazas: 25, asistentes: 20, ocupacion: 80, tendencia: '+2.1%' },
    { id: 8, clase: 'Boxeo Funcional', dia: 'Miércoles', hora: '19:00', plazas: 16, asistentes: 14, ocupacion: 87, tendencia: '+4.3%' },
    { id: 9, clase: 'Stretching', dia: 'Jueves', hora: '20:00', plazas: 20, asistentes: 8, ocupacion: 40, tendencia: '-5.2%' },
    { id: 10, clase: 'Body Pump', dia: 'Viernes', hora: '18:00', plazas: 22, asistentes: 21, ocupacion: 95, tendencia: '+2.8%' },
    { id: 11, clase: 'Functional Movement', dia: 'Lunes', hora: '12:00', plazas: 18, asistentes: 14, ocupacion: 78, tendencia: '+3.5%' },
    { id: 12, clase: 'Athletic Conditioning', dia: 'Martes', hora: '10:00', plazas: 14, asistentes: 11, ocupacion: 79, tendencia: '+1.8%' },
    { id: 13, clase: 'Cardio HIIT', dia: 'Miércoles', hora: '20:00', plazas: 20, asistentes: 15, ocupacion: 75, tendencia: '0%' },
    { id: 14, clase: 'Pilates Avanzado', dia: 'Jueves', hora: '19:00', plazas: 12, asistentes: 12, ocupacion: 100, tendencia: '+8.2%' },
    { id: 15, clase: 'Body Combat', dia: 'Viernes', hora: '10:00', plazas: 20, asistentes: 7, ocupacion: 35, tendencia: '-12.5%' },
  ];

  const clasesFiltradas = todasLasClases.filter(clase => {
    if (filtroOcupacion === 'alta') return clase.ocupacion > 80;
    if (filtroOcupacion === 'baja') return clase.ocupacion < 60;
    if (filtroOcupacion === 'optima') return clase.ocupacion >= 60 && clase.ocupacion <= 80;
    return true;
  });

  const resumen = {
    total: todasLasClases.length,
    alta: todasLasClases.filter(c => c.ocupacion > 80).length,
    optima: todasLasClases.filter(c => c.ocupacion >= 60 && c.ocupacion <= 80).length,
    baja: todasLasClases.filter(c => c.ocupacion < 60).length,
    promedio: Math.round(todasLasClases.reduce((sum, c) => sum + c.ocupacion, 0) / todasLasClases.length),
  };

  const columns = [
    { key: 'clase', label: 'Clase' },
    { key: 'horario', label: 'Horario' },
    { key: 'plazas', label: 'Plazas' },
    { key: 'asistentes', label: 'Asistentes' },
    { key: 'ocupacion', label: 'Ocupación' },
    { key: 'tendencia', label: 'Tendencia' },
    { key: 'status', label: 'Status' },
  ];

  const data = clasesFiltradas.map(clase => ({
    ...clase,
    horario: `${clase.dia} ${clase.hora}`,
    ocupacion: `${clase.ocupacion}%`,
    tendencia: clase.tendencia,
    status: clase.ocupacion > 90 
      ? <Badge variant="red">Saturado</Badge>
      : clase.ocupacion >= 60 && clase.ocupacion <= 90
      ? <Badge variant="green">Óptimo</Badge>
      : <Badge variant="yellow">Bajo</Badge>
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Ocupación por Clase</h3>
        <p className="text-sm text-gray-600 mt-2">
          Análisis detallado de ocupación y asistencia por clase y horario
        </p>
      </div>

      <MetricCards data={metricas} columns={4} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Promedio</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumen.promedio}%</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Óptimas</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resumen.optima}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Saturadas</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{resumen.alta}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Bajas</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumen.baja}</div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={periodo}
          onChange={e => setPeriodo(e.target.value)}
          options={periodos}
          className="w-48"
        />
        <Select
          value={filtroOcupacion}
          onChange={e => setFiltroOcupacion(e.target.value)}
          options={filtros}
          className="w-56"
        />
        <span className="text-sm text-gray-600">
          Mostrando {data.length} de {resumen.total} clases
        </span>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Distribución por Horarios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Mañana (06:00-12:00)', 'Tarde (12:00-18:00)', 'Noche (18:00-22:00)'].map((franja, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">{franja}</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${75 - idx * 5}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">{75 - idx * 5}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
};


