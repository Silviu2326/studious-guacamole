import React from 'react';
import { MetricCards, Card, Table, Badge } from '../../../../components/componentsreutilizables';
import { TrendingUp, AlertTriangle, Activity, Calendar, Users, Target, Clock, Award, Zap, TrendingDown, CheckCircle2, Flame } from 'lucide-react';
import type { MetricCardData } from '../../../../components/componentsreutilizables';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

export const MetricasAdherencia: React.FC<Props> = ({ modo }) => {
  const metrics: MetricCardData[] =
    modo === 'entrenador'
      ? [
          { 
            id: '1',
            title: 'Adherencia 30d', 
            value: '84%',
            trend: { value: 2.4, direction: 'up' },
            icon: <TrendingUp size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Clientes en Riesgo', 
            value: '7',
            trend: { value: 1, direction: 'down' },
            icon: <AlertTriangle size={24} />,
            color: 'warning'
          },
          { 
            id: '3',
            title: 'Sesiones/Cliente (sem)', 
            value: '2.8',
            trend: { value: 0.2, direction: 'up' },
            icon: <Activity size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Tasa de Éxito', 
            value: '76%',
            trend: { value: 3.1, direction: 'up' },
            icon: <Target size={24} />,
            color: 'primary'
          },
          { 
            id: '5',
            title: 'Duración Media', 
            value: '48 min',
            trend: { value: 2, direction: 'up' },
            icon: <Clock size={24} />,
            color: 'info'
          },
          { 
            id: '6',
            title: 'Racha Promedio', 
            value: '11 días',
            trend: { value: 1.5, direction: 'up' },
            icon: <Flame size={24} />,
            color: 'success'
          },
        ]
      : [
          { 
            id: '1',
            title: 'Ocupación 30d', 
            value: '71%',
            trend: { value: 0.9, direction: 'up' },
            icon: <Calendar size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Picos de Demanda', 
            value: 'L-M 18-20h',
            icon: <TrendingUp size={24} />,
            color: 'primary'
          },
          { 
            id: '3',
            title: 'Plan Grupal Seguimiento', 
            value: '63%',
            trend: { value: 3.1, direction: 'up' },
            icon: <Users size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Clases Tope Reserva', 
            value: '8',
            trend: { value: 2, direction: 'up' },
            icon: <Zap size={24} />,
            color: 'error'
          },
          { 
            id: '5',
            title: 'Satisfacción Media', 
            value: '4.6/5',
            trend: { value: 0.2, direction: 'up' },
            icon: <Award size={24} />,
            color: 'primary'
          },
          { 
            id: '6',
            title: 'Cancelaciones (sem)', 
            value: '23',
            trend: { value: 3, direction: 'down' },
            icon: <TrendingDown size={24} />,
            color: 'success'
          },
        ];

  const tableData =
    modo === 'entrenador'
      ? [
          { id: 1, categoria: 'Adherencia General', valor: '84%', periodo: '30 días', cambio: '+2.4%', tendencia: 'up' },
          { id: 2, categoria: 'Sesiones Completadas', valor: '342', periodo: '30 días', cambio: '+18', tendencia: 'up' },
          { id: 3, categoria: 'Tasa de Asistencia', valor: '88%', periodo: '30 días', cambio: '+1.2%', tendencia: 'up' },
          { id: 4, categoria: 'Sesiones Canceladas', valor: '15', periodo: '30 días', cambio: '-5', tendencia: 'down' },
          { id: 5, categoria: 'Tiempo Promedio', valor: '48 min', periodo: 'Por sesión', cambio: '+2 min', tendencia: 'up' },
          { id: 6, categoria: 'Objetivos Cumplidos', valor: '76%', periodo: '30 días', cambio: '+4.2%', tendencia: 'up' },
          { id: 7, categoria: 'Clientes Nuevos', valor: '8', periodo: '30 días', cambio: '+2', tendencia: 'up' },
          { id: 8, categoria: 'Retención', valor: '91%', periodo: '30 días', cambio: '+0.8%', tendencia: 'up' },
        ]
      : [
          { id: 1, categoria: 'Ocupación General', valor: '71%', periodo: '30 días', cambio: '+0.9%', tendencia: 'up' },
          { id: 2, categoria: 'Asistencias Totales', valor: '4,892', periodo: '30 días', cambio: '+234', tendencia: 'up' },
          { id: 3, categoria: 'Clases Impartidas', valor: '186', periodo: '30 días', cambio: '+12', tendencia: 'up' },
          { id: 4, categoria: 'Media Asistencia/Clase', valor: '26.3', periodo: '30 días', cambio: '+0.8', tendencia: 'up' },
          { id: 5, categoria: 'Franjas Saturadas', valor: '8', periodo: 'Semanal', cambio: '+2', tendencia: 'up' },
          { id: 6, categoria: 'Franjas Vacías', valor: '3', periodo: 'Semanal', cambio: '-2', tendencia: 'down' },
          { id: 7, categoria: 'Satisfacción Media', valor: '4.6/5', periodo: '30 días', cambio: '+0.2', tendencia: 'up' },
          { id: 8, categoria: 'Tasa Retención', valor: '78%', periodo: '30 días', cambio: '+2.1%', tendencia: 'up' },
        ];

  const columns = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'valor', label: 'Valor' },
    { key: 'periodo', label: 'Período' },
    { key: 'cambio', label: 'Cambio vs Anterior' },
    { key: 'tendencia', label: 'Tendencia' },
  ];

  const formattedTableData = tableData.map(row => ({
    ...row,
    tendencia: row.tendencia === 'up' 
      ? <Badge variant="green"><CheckCircle2 size={14} className="mr-1" />Alcista</Badge>
      : <Badge variant="blue"><TrendingDown size={14} className="mr-1" />Bajista</Badge>
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Métricas de Adherencia
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Indicadores clave para decisiones operativas y análisis de rendimiento
        </p>
      </div>
      <MetricCards data={metrics} columns={3} />
      
      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Análisis Detallado
          </h4>
          <p className="text-sm text-gray-600">
            Comparativa de métricas en el período seleccionado
          </p>
        </div>
        <Card className="bg-white shadow-sm p-6">
          <Table columns={columns} data={formattedTableData} />
        </Card>
      </div>
    </div>
  );
};


