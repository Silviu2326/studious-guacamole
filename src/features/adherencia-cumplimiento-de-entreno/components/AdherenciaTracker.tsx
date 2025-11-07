import React from 'react';
import { MetricCards, Card, Table, Badge } from '../../../components/componentsreutilizables';
import { BarChart3, Users, CheckCircle, TrendingDown, Calendar, Users2, Clock, Target, Award, AlertCircle } from 'lucide-react';
import type { MetricCardData } from '../../../components/componentsreutilizables';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

export const AdherenciaTracker: React.FC<Props> = ({ modo }) => {
  const metrics: MetricCardData[] =
    modo === 'entrenador'
      ? [
          { 
            id: '1',
            title: 'Adherencia Promedio', 
            value: '86%',
            trend: { value: 3.2, direction: 'up' },
            icon: <BarChart3 size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Clientes Activos', 
            value: '42',
            trend: { value: 2, direction: 'up' },
            icon: <Users size={24} />,
            color: 'success'
          },
          { 
            id: '3',
            title: 'Sesiones Completadas (7d)', 
            value: '142',
            trend: { value: 12, direction: 'up' },
            icon: <CheckCircle size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Clientes en Riesgo', 
            value: '5',
            trend: { value: 1, direction: 'down' },
            icon: <AlertCircle size={24} />,
            color: 'error'
          },
          { 
            id: '5',
            title: 'Objetivos Alcanzados', 
            value: '68%',
            trend: { value: 5.2, direction: 'up' },
            icon: <Target size={24} />,
            color: 'primary'
          },
          { 
            id: '6',
            title: 'Tiempo Medio Sesión', 
            value: '52 min',
            trend: { value: 2, direction: 'up' },
            icon: <Clock size={24} />,
            color: 'info'
          },
        ]
      : [
          { 
            id: '1',
            title: 'Ocupación Promedio', 
            value: '72%',
            trend: { value: 1.1, direction: 'up' },
            icon: <BarChart3 size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Clases Activas', 
            value: '48',
            trend: { value: 3, direction: 'up' },
            icon: <Calendar size={24} />,
            color: 'success'
          },
          { 
            id: '3',
            title: 'Asistencia Total (7d)', 
            value: '1,248',
            trend: { value: 87, direction: 'up' },
            icon: <Users2 size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Clases con Baja Ocupación', 
            value: '3',
            trend: { value: 2, direction: 'down' },
            icon: <TrendingDown size={24} />,
            color: 'warning'
          },
          { 
            id: '5',
            title: 'Seguimiento Plan Grupal', 
            value: '64%',
            trend: { value: 4.4, direction: 'up' },
            icon: <Award size={24} />,
            color: 'primary'
          },
          { 
            id: '6',
            title: 'Puntos Saturados', 
            value: '8',
            trend: { value: 2, direction: 'up' },
            icon: <AlertCircle size={24} />,
            color: 'error'
          },
        ];

  const columns =
    modo === 'entrenador'
      ? [
          { key: 'cliente', label: 'Cliente' },
          { key: 'programadas', label: 'Programadas' },
          { key: 'completadas', label: 'Completadas' },
          { key: 'adherencia', label: 'Adherencia' },
          { key: 'estado', label: 'Estado' },
          { key: 'tendencia', label: 'Tendencia' },
        ]
      : [
          { key: 'clase', label: 'Clase' },
          { key: 'horario', label: 'Horario' },
          { key: 'plazas', label: 'Plazas' },
          { key: 'asistentes', label: 'Asistentes' },
          { key: 'ocupacion', label: 'Ocupación' },
          { key: 'status', label: 'Status' },
        ];

  const data =
    modo === 'entrenador'
      ? [
          { id: 1, cliente: 'María Pérez', programadas: 8, completadas: 7, adherencia: '87.5%', estado: <Badge variant="green">Excelente</Badge>, tendencia: '+5%' },
          { id: 2, cliente: 'Carlos Ruiz', programadas: 8, completadas: 8, adherencia: '100%', estado: <Badge variant="green">Perfecto</Badge>, tendencia: '+2%' },
          { id: 3, cliente: 'Ana Martínez', programadas: 8, completadas: 6, adherencia: '75%', estado: <Badge variant="blue">Buena</Badge>, tendencia: '0%' },
          { id: 4, cliente: 'Luis García', programadas: 8, completadas: 5, adherencia: '62.5%', estado: <Badge variant="yellow">Regular</Badge>, tendencia: '-8%' },
          { id: 5, cliente: 'Sofia López', programadas: 8, completadas: 4, adherencia: '50%', estado: <Badge variant="orange">Baja</Badge>, tendencia: '-12%' },
          { id: 6, cliente: 'Diego Fernández', programadas: 8, completadas: 7, adherencia: '87.5%', estado: <Badge variant="green">Excelente</Badge>, tendencia: '+3%' },
          { id: 7, cliente: 'Elena Sánchez', programadas: 8, completadas: 3, adherencia: '37.5%', estado: <Badge variant="red">Crítica</Badge>, tendencia: '-15%' },
          { id: 8, cliente: 'Roberto Martín', programadas: 8, completadas: 6, adherencia: '75%', estado: <Badge variant="blue">Buena</Badge>, tendencia: '+1%' },
          { id: 9, cliente: 'Laura Torres', programadas: 8, completadas: 8, adherencia: '100%', estado: <Badge variant="green">Perfecto</Badge>, tendencia: '0%' },
          { id: 10, cliente: 'Miguel Vargas', programadas: 8, completadas: 5, adherencia: '62.5%', estado: <Badge variant="yellow">Regular</Badge>, tendencia: '-3%' },
        ]
      : [
          { id: 1, clase: 'HIIT Intensivo', horario: 'Lunes 18:00-19:00', plazas: 20, asistentes: 18, ocupacion: '90%', status: <Badge variant="red">Saturado</Badge> },
          { id: 2, clase: 'Yoga Restaurativo', horario: 'Martes 19:00-20:00', plazas: 25, asistentes: 24, ocupacion: '96%', status: <Badge variant="red">Saturado</Badge> },
          { id: 3, clase: 'Cross Training', horario: 'Miércoles 18:00-19:00', plazas: 20, asistentes: 16, ocupacion: '80%', status: <Badge variant="green">Óptimo</Badge> },
          { id: 4, clase: 'Pilates Mat', horario: 'Jueves 09:00-10:00', plazas: 15, asistentes: 9, ocupacion: '60%', status: <Badge variant="yellow">Regular</Badge> },
          { id: 5, clase: 'Zumba Fitness', horario: 'Viernes 19:00-20:00', plazas: 30, asistentes: 28, ocupacion: '93%', status: <Badge variant="red">Saturado</Badge> },
          { id: 6, clase: 'TRX Training', horario: 'Lunes 10:00-11:00', plazas: 12, asistentes: 12, ocupacion: '100%', status: <Badge variant="red">Saturado</Badge> },
          { id: 7, clase: 'Spinning', horario: 'Martes 18:00-19:00', plazas: 25, asistentes: 20, ocupacion: '80%', status: <Badge variant="green">Óptimo</Badge> },
          { id: 8, clase: 'Boxeo Funcional', horario: 'Miércoles 19:00-20:00', plazas: 16, asistentes: 14, ocupacion: '87.5%', status: <Badge variant="green">Óptimo</Badge> },
          { id: 9, clase: 'Stretching', horario: 'Jueves 20:00-21:00', plazas: 20, asistentes: 8, ocupacion: '40%', status: <Badge variant="orange">Baja</Badge> },
          { id: 10, clase: 'Body Pump', horario: 'Viernes 18:00-19:00', plazas: 22, asistentes: 21, ocupacion: '95%', status: <Badge variant="red">Saturado</Badge> },
        ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={3} />
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          {modo === 'entrenador' ? 'Detalle por Cliente' : 'Detalle por Clase'}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {modo === 'entrenador' 
            ? 'Seguimiento individual de sesiones programadas vs completadas en las últimas 2 semanas'
            : 'Comparativa de plazas disponibles vs asistencia real por clase semanal'}
        </p>
      </div>
      <Card className="bg-white shadow-sm p-6">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
};


