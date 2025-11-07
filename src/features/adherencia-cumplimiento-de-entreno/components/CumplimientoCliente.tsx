import React, { useState } from 'react';
import { Card, Table, Badge, Select } from '../../../components/componentsreutilizables';
import { CheckCircle, XCircle, Clock, TrendingUp, Calendar, Filter } from 'lucide-react';
import type { SelectOption } from '../../../components/componentsreutilizables';

export const CumplimientoCliente: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('todos');

  const estados: SelectOption[] = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'completada', label: 'Completadas' },
    { value: 'no-completada', label: 'No completadas' },
    { value: 'pendiente', label: 'Pendientes' },
  ];

  const clientes: SelectOption[] = [
    { value: 'todos', label: 'Todos los clientes' },
    { value: 'maria', label: 'María Pérez' },
    { value: 'carlos', label: 'Carlos Ruiz' },
    { value: 'ana', label: 'Ana Martínez' },
    { value: 'luis', label: 'Luis García' },
    { value: 'sofia', label: 'Sofia López' },
  ];

  const todasLasSesiones = [
    { id: 1, cliente: 'María Pérez', fecha: '2025-01-15', sesion: 'Fuerza Tren Superior', estado: 'Completada', duracion: '55 min', observaciones: 'Excelente progreso' },
    { id: 2, cliente: 'María Pérez', fecha: '2025-01-17', sesion: 'Cardio HIIT', estado: 'Completada', duracion: '45 min', observaciones: '-' },
    { id: 3, cliente: 'Carlos Ruiz', fecha: '2025-01-15', sesion: 'Full Body Strength', estado: 'Completada', duracion: '60 min', observaciones: 'Personal record' },
    { id: 4, cliente: 'Ana Martínez', fecha: '2025-01-16', sesion: 'Yoga Flow', estado: 'No completada', duracion: '-', observaciones: 'Cliente enfermo' },
    { id: 5, cliente: 'Ana Martínez', fecha: '2025-01-18', sesion: 'Core & Flexibilidad', estado: 'Completada', duracion: '50 min', observaciones: 'Buena forma' },
    { id: 6, cliente: 'Luis García', fecha: '2025-01-15', sesion: 'Spinning Intensivo', estado: 'No completada', duracion: '-', observaciones: 'Sin justificación' },
    { id: 7, cliente: 'Luis García', fecha: '2025-01-17', sesion: 'Pesas Tren Inferior', estado: 'Completada', duracion: '48 min', observaciones: 'Dolor leve' },
    { id: 8, cliente: 'Sofia López', fecha: '2025-01-16', sesion: 'Pilates Mat', estado: 'Completada', duracion: '40 min', observaciones: '-' },
    { id: 9, cliente: 'Diego Fernández', fecha: '2025-01-15', sesion: 'Cross Training', estado: 'Completada', duracion: '55 min', observaciones: 'Muy motivado' },
    { id: 10, cliente: 'Diego Fernández', fecha: '2025-01-18', sesion: 'Boxeo Funcional', estado: 'Completada', duracion: '50 min', observaciones: 'Excelente técnica' },
    { id: 11, cliente: 'Elena Sánchez', fecha: '2025-01-16', sesion: 'Stretching', estado: 'Pendiente', duracion: '-', observaciones: 'Programada' },
    { id: 12, cliente: 'Roberto Martín', fecha: '2025-01-17', sesion: 'TRX Training', estado: 'Completada', duracion: '45 min', observaciones: '-' },
    { id: 13, cliente: 'Roberto Martín', fecha: '2025-01-18', sesion: 'Functional Movement', estado: 'Completada', duracion: '52 min', observaciones: 'Mejora notable' },
    { id: 14, cliente: 'Laura Torres', fecha: '2025-01-15', sesion: 'Body Pump', estado: 'No completada', duracion: '-', observaciones: 'Cancelación de último minuto' },
    { id: 15, cliente: 'Miguel Vargas', fecha: '2025-01-16', sesion: 'Circuit Training', estado: 'Completada', duracion: '48 min', observaciones: '-' },
    { id: 16, cliente: 'Miguel Vargas', fecha: '2025-01-18', sesion: 'Athletic Conditioning', estado: 'Pendiente', duracion: '-', observaciones: 'Programada' },
  ];

  const sesionesFiltradas = todasLasSesiones.filter(sesion => {
    const estadoMatch = filtroEstado === 'todos' || 
      (filtroEstado === 'completada' && sesion.estado === 'Completada') ||
      (filtroEstado === 'no-completada' && sesion.estado === 'No completada') ||
      (filtroEstado === 'pendiente' && sesion.estado === 'Pendiente');
    
    const clienteMatch = clienteSeleccionado === 'todos' || 
      sesion.cliente.toLowerCase().includes(clienteSeleccionado);
    
    return estadoMatch && clienteMatch;
  });

  const resumen = {
    total: todasLasSesiones.length,
    completadas: todasLasSesiones.filter(s => s.estado === 'Completada').length,
    noCompletadas: todasLasSesiones.filter(s => s.estado === 'No completada').length,
    pendientes: todasLasSesiones.filter(s => s.estado === 'Pendiente').length,
    tasaCumplimiento: Math.round((todasLasSesiones.filter(s => s.estado === 'Completada').length / todasLasSesiones.length) * 100),
  };

  const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'sesion', label: 'Sesión' },
    { key: 'duracion', label: 'Duración' },
    { key: 'estado', label: 'Estado' },
    { key: 'observaciones', label: 'Observaciones' },
  ];

  const data = sesionesFiltradas.map(sesion => ({
    ...sesion,
    estado: sesion.estado === 'Completada'
      ? <Badge variant="green"><CheckCircle size={14} className="mr-1" />Completada</Badge>
      : sesion.estado === 'No completada'
      ? <Badge variant="red"><XCircle size={14} className="mr-1" />No Completada</Badge>
      : <Badge variant="yellow"><Clock size={14} className="mr-1" />Pendiente</Badge>
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Cumplimiento del Cliente</h3>
        <p className="text-sm text-gray-600 mt-2">
          Detalle completo de sesiones programadas vs completadas por cliente
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{resumen.total}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Completadas</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{resumen.completadas}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">No Completadas</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{resumen.noCompletadas}</div>
        </Card>
        <Card className="bg-white shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-yellow-600" size={20} />
            <span className="text-sm text-gray-600">Tasa Cumplimiento</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{resumen.tasaCumplimiento}%</div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter size={20} className="text-gray-600" />
        <Select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          options={estados}
          className="w-48"
        />
        <Select
          value={clienteSeleccionado}
          onChange={e => setClienteSeleccionado(e.target.value)}
          options={clientes}
          className="w-56"
        />
        <span className="text-sm text-gray-600">
          Mostrando {data.length} de {resumen.total} sesiones
        </span>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
};


