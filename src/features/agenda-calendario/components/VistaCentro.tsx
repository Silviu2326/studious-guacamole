import React from 'react';
import { Users, Building2, Calendar, TrendingUp } from 'lucide-react';
import { Card, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { Cita } from '../types';

interface VistaCentroProps {
  citas?: Cita[];
}

export const VistaCentro: React.FC<VistaCentroProps> = ({ citas = [] }) => {
  const citasHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fechaInicio);
    const hoy = new Date();
    return fechaCita.getDate() === hoy.getDate() &&
      fechaCita.getMonth() === hoy.getMonth() &&
      fechaCita.getFullYear() === hoy.getFullYear();
  });

  const clasesHoy = citasHoy.filter(cita => cita.tipo === 'clase-colectiva');
  const ocupacionPromedio = clasesHoy.length > 0
    ? Math.round((clasesHoy.reduce((acc, c) => acc + (c.inscritos || 0), 0) / 
                  clasesHoy.reduce((acc, c) => acc + (c.capacidadMaxima || 1), 0)) * 100)
    : 0;

  const metricas = [
    {
      id: '1',
      title: 'Clases Hoy',
      value: clasesHoy.length.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: '2',
      title: 'Ocupación Promedio',
      value: `${ocupacionPromedio}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Total Citas',
      value: citasHoy.length.toString(),
      icon: <Building2 className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Inscritos Totales',
      value: clasesHoy.reduce((acc, c) => acc + (c.inscritos || 0), 0).toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Agenda del Centro
        </h3>
        <Badge color="info">
          {citasHoy.length} eventos hoy
        </Badge>
      </div>

      <MetricCards data={metricas} columns={4} />

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Clases y Servicios de Hoy
          </h4>
          <div className="space-y-4">
            {citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay clases o servicios programados para hoy
                </p>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-semibold text-gray-900">
                        {cita.titulo}
                      </h5>
                      <Badge color={cita.estado === 'confirmada' ? 'success' : 'warning'}>
                        {cita.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearHora(cita.fechaInicio)} - {formatearHora(cita.fechaFin)}</span>
                      </div>
                      {cita.capacidadMaxima && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{cita.inscritos || 0} / {cita.capacidadMaxima}</span>
                        </div>
                      )}
                      {cita.instructorNombre && (
                        <div className="text-gray-600">
                          Instructor: {cita.instructorNombre}
                        </div>
                      )}
                    </div>
                    {cita.ubicacion && (
                      <p className="mt-2 text-sm text-gray-500">
                        Ubicación: {cita.ubicacion}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
