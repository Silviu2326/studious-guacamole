import React, { useState } from 'react';
import { Card, Table, Badge, Select } from '../../../components/componentsreutilizables';
import { AlertCircle, Bell, AlertTriangle, Info, CheckCircle, Filter } from 'lucide-react';
import type { SelectOption } from '../../../components/componentsreutilizables';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

export const AlertasAdherencia: React.FC<Props> = ({ modo }) => {
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas');

  const prioridades: SelectOption[] = [
    { value: 'todas', label: 'Todas las prioridades' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  const columns = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'entidad', label: modo === 'entrenador' ? 'Cliente' : 'Clase' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'prioridad', label: 'Prioridad' },
    { key: 'estado', label: 'Estado' },
  ];

  const todasLasAlertas =
    modo === 'entrenador'
      ? [
          { 
            id: 1, 
            tipo: 'Baja Adherencia', 
            entidad: 'Luis García', 
            detalle: '42% en últimos 14d', 
            fecha: 'Hace 2 horas',
            prioridad: 'alta',
            estado: 'pendiente'
          },
          { 
            id: 2, 
            tipo: 'Sesión No Registrada', 
            entidad: 'Elena Sánchez', 
            detalle: 'Sesión de ayer 19:00 no completada', 
            fecha: 'Hace 5 horas',
            prioridad: 'media',
            estado: 'pendiente'
          },
          { 
            id: 3, 
            tipo: 'Objetivo en Riesgo', 
            entidad: 'Sofia López', 
            detalle: 'Objetivos mensuales al 45%', 
            fecha: 'Hace 1 día',
            prioridad: 'alta',
            estado: 'pendiente'
          },
          { 
            id: 4, 
            tipo: 'Tendencia Descendente', 
            entidad: 'Roberto Martín', 
            detalle: '-15% de adherencia en 7d', 
            fecha: 'Hace 2 días',
            prioridad: 'media',
            estado: 'vista'
          },
          { 
            id: 5, 
            tipo: 'Sesión Cancelada', 
            entidad: 'Ana Martínez', 
            detalle: '3ª cancelación consecutiva', 
            fecha: 'Hace 3 días',
            prioridad: 'alta',
            estado: 'vista'
          },
          { 
            id: 6, 
            tipo: 'Racha Perfecta', 
            entidad: 'Carlos Ruiz', 
            detalle: '30 días consecutivos completados', 
            fecha: 'Hace 1 día',
            prioridad: 'baja',
            estado: 'resuelta'
          },
          { 
            id: 7, 
            tipo: 'Meta Alcanzada', 
            entidad: 'María Pérez', 
            detalle: 'Objetivo semanal cumplido al 100%', 
            fecha: 'Hace 2 días',
            prioridad: 'baja',
            estado: 'resuelta'
          },
          { 
            id: 8, 
            tipo: 'Consulta Médica Pendiente', 
            entidad: 'Miguel Vargas', 
            detalle: 'Recordatorio: revisión hace 6 meses', 
            fecha: 'Hace 5 días',
            prioridad: 'media',
            estado: 'pendiente'
          },
          { 
            id: 9, 
            tipo: 'Progreso Excelente', 
            entidad: 'Diego Fernández', 
            detalle: '+8% mejora en última semana', 
            fecha: 'Hace 2 días',
            prioridad: 'baja',
            estado: 'resuelta'
          },
          { 
            id: 10, 
            tipo: 'Ausencia Prolongada', 
            entidad: 'Laura Torres', 
            detalle: 'Sin actividad desde hace 10 días', 
            fecha: 'Hace 1 día',
            prioridad: 'alta',
            estado: 'pendiente'
          },
        ]
      : [
          { 
            id: 1, 
            tipo: 'Clase Saturada', 
            entidad: 'HIIT Lunes 18:00', 
            detalle: '100% de ocupación, cola de espera', 
            fecha: 'Hace 2 horas',
            prioridad: 'alta',
            estado: 'pendiente'
          },
          { 
            id: 2, 
            tipo: 'Baja Ocupación', 
            entidad: 'Pilates Jueves 09:00', 
            detalle: '40% de ocupación en últimos 7d', 
            fecha: 'Hace 5 horas',
            prioridad: 'media',
            estado: 'pendiente'
          },
          { 
            id: 3, 
            tipo: 'Alta Demanda Repetida', 
            entidad: 'Yoga Martes 19:00', 
            detalle: '96% ocupación, considerar duplicar', 
            fecha: 'Hace 1 día',
            prioridad: 'alta',
            estado: 'pendiente'
          },
          { 
            id: 4, 
            tipo: 'Tendencia Descendente', 
            entidad: 'Spinning Viernes 18:00', 
            detalle: '-8% ocupación en 14d', 
            fecha: 'Hace 2 días',
            prioridad: 'media',
            estado: 'vista'
          },
          { 
            id: 5, 
            tipo: 'Cancelaciones Múltiples', 
            entidad: 'Body Combat Martes 10:00', 
            detalle: '15 cancelaciones en última semana', 
            fecha: 'Hace 3 días',
            prioridad: 'alta',
            estado: 'vista'
          },
          { 
            id: 6, 
            tipo: 'Clase Popular', 
            entidad: 'Zumba Viernes 19:00', 
            detalle: '95%+ ocupación sostenida', 
            fecha: 'Hace 1 día',
            prioridad: 'baja',
            estado: 'resuelta'
          },
          { 
            id: 7, 
            tipo: 'Nueva Franja Exitosas', 
            entidad: 'Cross Training Jueves 18:00', 
            detalle: 'Buena acogida en primer mes: 85%', 
            fecha: 'Hace 2 días',
            prioridad: 'baja',
            estado: 'resuelta'
          },
          { 
            id: 8, 
            tipo: 'Instructor Ausente', 
            entidad: 'Pilates Mat Lunes 10:00', 
            detalle: 'Necesita sustituto recurrente', 
            fecha: 'Hace 5 días',
            prioridad: 'alta',
            estado: 'pendiente'
          },
          { 
            id: 9, 
            tipo: 'Equipamiento Insuficiente', 
            entidad: 'TRX Training Miércoles 18:00', 
            detalle: 'Demanda supera plazas disponibles', 
            fecha: 'Hace 1 día',
            prioridad: 'media',
            estado: 'pendiente'
          },
          { 
            id: 10, 
            tipo: 'Horario Subóptimo', 
            entidad: 'Stretching Jueves 20:00', 
            detalle: '40% ocupación, considerar otro horario', 
            fecha: 'Hace 1 día',
            prioridad: 'media',
            estado: 'pendiente'
          },
        ];

  const alertasFiltradas = filtroPrioridad === 'todas' 
    ? todasLasAlertas 
    : todasLasAlertas.filter(a => a.prioridad === filtroPrioridad);

  const data = alertasFiltradas.map(alert => ({
    ...alert,
    prioridad: alert.prioridad === 'alta' 
      ? <Badge variant="red"><AlertCircle size={14} className="mr-1" />Alta</Badge>
      : alert.prioridad === 'media'
      ? <Badge variant="yellow"><AlertTriangle size={14} className="mr-1" />Media</Badge>
      : <Badge variant="blue"><Info size={14} className="mr-1" />Baja</Badge>,
    estado: alert.estado === 'pendiente'
      ? <Badge variant="red">Pendiente</Badge>
      : alert.estado === 'vista'
      ? <Badge variant="yellow">Vista</Badge>
      : <Badge variant="green"><CheckCircle size={14} className="mr-1" />Resuelta</Badge>
  }));

  const resumenAlertas = {
    total: todasLasAlertas.length,
    pendientes: todasLasAlertas.filter(a => a.estado === 'pendiente').length,
    alta: todasLasAlertas.filter(a => a.prioridad === 'alta').length,
    media: todasLasAlertas.filter(a => a.prioridad === 'media').length,
    baja: todasLasAlertas.filter(a => a.prioridad === 'baja').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">
          Alertas de Adherencia
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Notificaciones automáticas para actuar a tiempo
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="text-gray-600" size={20} />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{resumenAlertas.total}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Pendientes</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumenAlertas.pendientes}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-600">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Alta</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumenAlertas.alta}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Media</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{resumenAlertas.media}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Info className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Baja</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumenAlertas.baja}</div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroPrioridad}
          onChange={e => setFiltroPrioridad(e.target.value)}
          options={prioridades}
          className="w-64"
        />
        <span className="text-sm text-gray-600">
          Mostrando {data.length} de {resumenAlertas.total} alertas
        </span>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
};


